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

const MAX_MESSAGES = 40;
const MAX_MESSAGE_LENGTH = 2000;

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'not_configured',
      message: 'The ANTHROPIC_API_KEY environment variable is not set. Please configure it in your Vercel project settings.'
    });
  }

  const { messages } = req.body || {};

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  if (messages.length > MAX_MESSAGES) {
    return res.status(400).json({ error: `Maximum ${MAX_MESSAGES} messages per request` });
  }

  const sanitized = messages.map(m => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: typeof m.content === 'string'
      ? m.content.slice(0, MAX_MESSAGE_LENGTH)
      : ''
  })).filter(m => m.content.length > 0);

  if (sanitized.length === 0) {
    return res.status(400).json({ error: 'No valid messages provided' });
  }

  const model = process.env.CHAT_MODEL || 'claude-sonnet-4-20250514';

  try {
    const client = new Anthropic({ apiKey });
    const systemPrompt = loadSystemPrompt();

    const response = await client.messages.create({
      model,
      max_tokens: 1024,
      system: systemPrompt,
      messages: sanitized,
    });

    const text = response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('');

    return res.status(200).json({ reply: text });
  } catch (err) {
    console.error('Chat API error:', err.message);

    if (err.status === 401) {
      return res.status(503).json({
        error: 'auth_failed',
        message: 'Invalid API key. Please check ANTHROPIC_API_KEY in your Vercel environment variables.'
      });
    }
    if (err.status === 429) {
      return res.status(429).json({
        error: 'rate_limited',
        message: 'Too many requests. Please wait a moment and try again.'
      });
    }

    return res.status(500).json({
      error: 'server_error',
      message: 'Something went wrong processing your request. Please try again.'
    });
  }
}
