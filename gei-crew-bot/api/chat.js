import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let cachedSystemPrompt = null;

function loadSystemPrompt() {
  if (cachedSystemPrompt) return cachedSystemPrompt;
  const knowledgeDir = join(__dirname, '..', 'knowledge');
  const systemPrompt = readFileSync(join(knowledgeDir, 'system-prompt.txt'), 'utf-8');
  const knowledge = readFileSync(join(knowledgeDir, 'gei-knowledge.txt'), 'utf-8');
  cachedSystemPrompt = `${systemPrompt}\n\n--- RESEARCH KNOWLEDGE BASE ---\n\n${knowledge}`;
  return cachedSystemPrompt;
}

const MAX_MESSAGES = 30;
const MAX_MESSAGE_LENGTH = 1500;
const MAX_TOTAL_CHARS = 20000;
const MAX_OUTPUT_TOKENS = 800;
const RATE_WINDOW_MS = 60_000;
const RATE_MAX_REQUESTS = 10;
const API_TIMEOUT_MS = 30_000;

const rateBuckets = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  let bucket = rateBuckets.get(ip);
  if (!bucket || now - bucket.windowStart > RATE_WINDOW_MS) {
    bucket = { windowStart: now, count: 0 };
    rateBuckets.set(ip, bucket);
  }
  bucket.count++;

  if (rateBuckets.size > 5000) {
    const cutoff = now - RATE_WINDOW_MS;
    for (const [key, val] of rateBuckets) {
      if (val.windowStart < cutoff) rateBuckets.delete(key);
    }
  }

  return bucket.count <= RATE_MAX_REQUESTS;
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

function getAllowedOrigins() {
  const env = process.env.ALLOWED_ORIGINS;
  if (env) return env.split(',').map(o => o.trim()).filter(Boolean);
  return null;
}

function setCorsHeaders(req, res) {
  const allowed = getAllowedOrigins();
  if (!allowed) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else {
    const origin = req.headers.origin || '';
    if (allowed.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
    } else {
      return false;
    }
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  return true;
}

function sanitizeMessages(messages) {
  const sanitized = [];
  for (const m of messages) {
    const role = m.role === 'assistant' ? 'assistant' : 'user';
    const content = typeof m.content === 'string'
      ? m.content.slice(0, MAX_MESSAGE_LENGTH)
      : '';
    if (!content) continue;
    if (sanitized.length > 0 && sanitized[sanitized.length - 1].role === role) continue;
    sanitized.push({ role, content });
  }
  if (sanitized.length > 0 && sanitized[0].role !== 'user') {
    sanitized.shift();
  }
  if (sanitized.length > 0 && sanitized[sanitized.length - 1].role !== 'user') {
    sanitized.pop();
  }
  return sanitized;
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    setCorsHeaders(req, res);
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!setCorsHeaders(req, res)) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'not_configured',
      message: 'The ANTHROPIC_API_KEY environment variable is not set. Please configure it in your Vercel project settings.'
    });
  }

  const ip = getClientIp(req);
  if (!checkRateLimit(ip)) {
    res.setHeader('Retry-After', '60');
    return res.status(429).json({
      error: 'rate_limited',
      message: 'You have sent too many requests. Please wait a minute and try again.'
    });
  }

  const { messages } = req.body || {};

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  if (messages.length > MAX_MESSAGES) {
    return res.status(400).json({ error: `Maximum ${MAX_MESSAGES} messages per request` });
  }

  const sanitized = sanitizeMessages(messages);

  if (sanitized.length === 0) {
    return res.status(400).json({ error: 'No valid messages provided' });
  }

  const totalChars = sanitized.reduce((sum, m) => sum + m.content.length, 0);
  if (totalChars > MAX_TOTAL_CHARS) {
    return res.status(400).json({ error: 'Conversation too long. Please start a new conversation.' });
  }

  const model = process.env.CHAT_MODEL || 'claude-sonnet-4-20250514';

  try {
    const client = new Anthropic({ apiKey, timeout: API_TIMEOUT_MS });
    const systemPrompt = loadSystemPrompt();

    const response = await client.messages.create({
      model,
      max_tokens: MAX_OUTPUT_TOKENS,
      system: systemPrompt,
      messages: sanitized,
    });

    const text = response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('');

    return res.status(200).json({ reply: text });
  } catch (err) {
    const status = err.status || err.statusCode;
    const msg = err.message || '';

    if (status === 401) {
      return res.status(503).json({
        error: 'auth_failed',
        message: 'Invalid API key. Please check ANTHROPIC_API_KEY in your Vercel environment variables.'
      });
    }
    if (status === 429) {
      return res.status(429).json({
        error: 'rate_limited',
        message: 'The AI service is busy. Please wait a moment and try again.'
      });
    }
    if (msg.includes('timed out') || msg.includes('timeout') || err.code === 'ETIMEDOUT') {
      return res.status(504).json({
        error: 'timeout',
        message: 'The request took too long. Please try a shorter question.'
      });
    }

    return res.status(500).json({
      error: 'server_error',
      message: 'Something went wrong processing your request. Please try again.'
    });
  }
}
