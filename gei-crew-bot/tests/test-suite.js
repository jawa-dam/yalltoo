import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const botDir = join(__dirname, '..');

let passed = 0;
let failed = 0;
const results = [];

function test(name, fn) {
  try {
    fn();
    passed++;
    results.push({ name, status: 'PASS' });
  } catch (err) {
    failed++;
    results.push({ name, status: 'FAIL', reason: err.message });
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || 'Assertion failed');
}

function assertContains(text, substring, msg) {
  assert(
    text.toLowerCase().includes(substring.toLowerCase()),
    msg || `Expected text to contain "${substring}"`
  );
}

// Load files for testing
const systemPrompt = readFileSync(join(botDir, 'knowledge', 'system-prompt.txt'), 'utf-8');
const knowledge = readFileSync(join(botDir, 'knowledge', 'gei-knowledge.txt'), 'utf-8');
const combined = systemPrompt + '\n' + knowledge;
const chatJs = readFileSync(join(botDir, 'api', 'chat.js'), 'utf-8');
const indexHtml = readFileSync(join(botDir, 'public', 'index.html'), 'utf-8');
const appJs = readFileSync(join(botDir, 'public', 'app.js'), 'utf-8');
const stylesCSS = readFileSync(join(botDir, 'public', 'styles.css'), 'utf-8');
const vercelJson = JSON.parse(readFileSync(join(botDir, 'vercel.json'), 'utf-8'));

console.log('\n========================================');
console.log('GEI INVESTIGATION CREW BOT — TEST SUITE');
console.log('========================================\n');

// ==========================================
// SECTION 1: SEVEN INVESTIGATION ROLES
// ==========================================
console.log('--- Seven Investigation Roles ---');

test('Knowledge base contains Hebrew Scholar role', () => {
  assertContains(combined, 'Hebrew Scholar');
  assertContains(combined, 'Hebrew vocabulary');
  assertContains(combined, 'morpholog');
  assertContains(combined, 'etymology');
});

test('Knowledge base contains Biblical Researcher role', () => {
  assertContains(combined, 'Biblical Researcher');
  assertContains(combined, 'textual context');
  assertContains(combined, 'genre');
  assertContains(combined, 'ancient Near Eastern');
});

test('Knowledge base contains Civil Engineer role', () => {
  assertContains(combined, 'Civil Engineer');
  assertContains(combined, 'structural plausibility');
  assertContains(combined, 'foundations');
  assertContains(combined, 'containment');
});

test('Knowledge base contains Hydrologist role', () => {
  assertContains(combined, 'Hydrologist');
  assertContains(combined, 'water movement');
  assertContains(combined, 'elevation');
  assertContains(combined, 'flow');
  assertContains(combined, 'watershed');
});

test('Knowledge base contains Archaeologist role', () => {
  assertContains(combined, 'Archaeologist');
  assertContains(combined, 'physical evidence');
  assertContains(combined, 'chronolog');
  assertContains(combined, 'ancient water systems');
});

test('Knowledge base contains Mechanical Engineer role', () => {
  assertContains(combined, 'Mechanical Engineer');
  assertContains(combined, 'waterwheel');
  assertContains(combined, 'mill');
  assertContains(combined, 'energy transfer');
});

test('Knowledge base contains Curious Citizen role', () => {
  assertContains(combined, 'Curious Citizen');
  assertContains(combined, 'Independent Explorer');
  assertContains(combined, 'No credentials required');
  assertContains(combined, 'Curiosity is the only qualification');
});

// ==========================================
// SECTION 2: ADAM A-DAM HANDLING
// ==========================================
console.log('\n--- Adam A-DAM Question ---');

test('System prompt addresses Adam A-DAM question', () => {
  assertContains(systemPrompt, 'Adam A-DAM');
  assertContains(systemPrompt, 'English-language A-DAM sound association');
  assertContains(systemPrompt, 'interpretive wordplay hypothesis');
});

test('Knowledge base distinguishes Hebrew etymology from English wordplay', () => {
  assertContains(combined, 'Hebrew אָדָם (adam)');
  assertContains(combined, 'NOT established to mean the English word');
  assertContains(combined, 'English wordplay observation');
  assertContains(combined, 'not Hebrew etymology');
});

test('Knowledge base provides actual Hebrew etymology', () => {
  assertContains(knowledge, 'אֲדָמָה');
  assertContains(knowledge, 'adamah');
  assertContains(knowledge, 'ground');
  assertContains(knowledge, 'סֶכֶר');
});

test('Knowledge base includes what would strengthen/weaken the hypothesis', () => {
  assertContains(knowledge, 'STRENGTHEN');
  assertContains(knowledge, 'WEAKEN');
});

// ==========================================
// SECTION 3: RESEARCH INTEGRITY
// ==========================================
console.log('\n--- Research Integrity ---');

test('System prompt has integrity rules', () => {
  assertContains(systemPrompt, 'MUST NEVER');
  assertContains(systemPrompt, 'academically accepted');
  assertContains(systemPrompt, 'Invent archaeological evidence');
  assertContains(systemPrompt, 'Invent academic endorsements');
  assertContains(systemPrompt, 'Present speculation as established fact');
});

test('System prompt requires distinguishing fact from hypothesis', () => {
  assertContains(systemPrompt, 'established facts');
  assertContains(systemPrompt, 'proposed hypotheses');
  assertContains(systemPrompt, 'analogies and wordplay');
  assertContains(systemPrompt, 'questions requiring further evidence');
});

test('Knowledge base labels hypotheses as hypotheses', () => {
  assertContains(knowledge, 'HYPOTHESIS');
  assertContains(knowledge, 'PROPOSED INTERPRETIVE PARALLELS');
  assertContains(knowledge, 'not established translation');
});

test('System prompt prevents false claims of joining', () => {
  assertContains(systemPrompt, 'Claim a visitor has officially joined');
});

test('Knowledge base includes "does NOT claim" section', () => {
  assertContains(knowledge, 'GEI does NOT claim');
  assertContains(knowledge, 'To have discovered ancient technology');
  assertContains(knowledge, 'To have proven its interpretations');
});

// ==========================================
// SECTION 4: CHALLENGE GEI MODE
// ==========================================
console.log('\n--- Challenge GEI Mode ---');

test('System prompt includes challenge mode', () => {
  assertContains(systemPrompt, 'CHALLENGE GEI MODE');
  assertContains(systemPrompt, 'What part seems weakest');
  assertContains(systemPrompt, 'What evidence would contradict');
  assertContains(systemPrompt, 'better explanation');
  assertContains(systemPrompt, 'Welcome disagreement');
});

test('System prompt explicitly says not to auto-defend GEI', () => {
  assertContains(systemPrompt, 'Do NOT automatically defend GEI');
});

// ==========================================
// SECTION 5: RESOURCE LINKS
// ==========================================
console.log('\n--- Resource Links ---');

test('System prompt includes research links', () => {
  assertContains(systemPrompt, 'https://jawa-dam.github.io/Research/research-interest.html');
  assertContains(systemPrompt, 'https://jawa-dam.github.io/Research/join.html');
  assertContains(systemPrompt, 'https://zenodo.org/records/17316846');
  assertContains(systemPrompt, 'https://doi.org/10.5281/zenodo.17316845');
  assertContains(systemPrompt, 'https://youtu.be/8mYq2A_fgTA');
});

test('Knowledge base also includes research links', () => {
  assertContains(knowledge, 'zenodo.org');
  assertContains(knowledge, 'youtu.be');
  assertContains(knowledge, 'research-interest.html');
  assertContains(knowledge, 'join.html');
});

// ==========================================
// SECTION 6: SECURITY — API HANDLER
// ==========================================
console.log('\n--- Security: API Handler ---');

test('API handler validates request method', () => {
  assertContains(chatJs, "req.method !== 'POST'");
  assertContains(chatJs, '405');
});

test('API handler checks for API key', () => {
  assertContains(chatJs, 'ANTHROPIC_API_KEY');
  assertContains(chatJs, 'not_configured');
});

test('API handler enforces message limits', () => {
  assertContains(chatJs, 'MAX_MESSAGES');
  assertContains(chatJs, 'MAX_MESSAGE_LENGTH');
  assertContains(chatJs, 'MAX_TOTAL_CHARS');
});

test('API handler has rate limiting', () => {
  assertContains(chatJs, 'checkRateLimit');
  assertContains(chatJs, 'RATE_WINDOW_MS');
  assertContains(chatJs, 'RATE_MAX_REQUESTS');
  assertContains(chatJs, 'Retry-After');
});

test('API handler has request timeout', () => {
  assertContains(chatJs, 'API_TIMEOUT_MS');
  assertContains(chatJs, 'timeout');
});

test('API handler caps output tokens', () => {
  assertContains(chatJs, 'MAX_OUTPUT_TOKENS');
  assertContains(chatJs, 'max_tokens');
});

test('API handler sanitizes message roles', () => {
  assertContains(chatJs, 'sanitizeMessages');
  assertContains(chatJs, "m.role === 'assistant' ? 'assistant' : 'user'");
});

test('API handler enforces role alternation', () => {
  assertContains(chatJs, 'sanitized[sanitized.length - 1].role === role');
});

test('API handler never exposes stack traces', () => {
  assert(!chatJs.includes('err.stack'), 'Should not include err.stack');
  assert(!chatJs.includes('stack trace'), 'Should not reference stack traces');
});

test('API handler never logs API key', () => {
  const logLines = chatJs.split('\n').filter(l => l.includes('console.'));
  for (const line of logLines) {
    assert(!line.includes('apiKey'), `Log line should not contain apiKey: ${line.trim()}`);
    assert(!line.includes('ANTHROPIC'), `Log line should not contain ANTHROPIC: ${line.trim()}`);
  }
});

test('API handler supports CORS origin restriction', () => {
  assertContains(chatJs, 'ALLOWED_ORIGINS');
  assertContains(chatJs, 'getAllowedOrigins');
  assertContains(chatJs, 'Origin not allowed');
});

test('API handler handles 401, 429, and timeout errors', () => {
  assertContains(chatJs, 'status === 401');
  assertContains(chatJs, 'status === 429');
  assertContains(chatJs, 'timed out');
});

// ==========================================
// SECTION 7: SECURITY — CLIENT SIDE
// ==========================================
console.log('\n--- Security: Client Side ---');

test('Client has send cooldown', () => {
  assertContains(appJs, 'MIN_SEND_INTERVAL');
  assertContains(appJs, 'lastSendTime');
});

test('Client has conversation limit', () => {
  assertContains(appJs, 'MAX_CLIENT_MESSAGES');
});

test('Client has fetch timeout via AbortController', () => {
  assertContains(appJs, 'AbortController');
  assertContains(appJs, 'controller.abort');
});

test('Client escapes HTML in user messages', () => {
  assertContains(appJs, 'textContent = text');
  assertContains(appJs, 'escapeHtml');
});

test('Client handles all error types', () => {
  assertContains(appJs, 'not_configured');
  assertContains(appJs, 'rate_limited');
  assertContains(appJs, 'timeout');
  assertContains(appJs, 'AbortError');
  assertContains(appJs, 'Network error');
});

// ==========================================
// SECTION 8: SECURITY — VERCEL CONFIG
// ==========================================
console.log('\n--- Security: Vercel Config ---');

test('Vercel config has Content-Security-Policy', () => {
  const headers = vercelJson.headers?.[0]?.headers || [];
  const csp = headers.find(h => h.key === 'Content-Security-Policy');
  assert(csp, 'CSP header must exist');
  assertContains(csp.value, "default-src 'self'");
  assertContains(csp.value, "script-src 'self'");
  assertContains(csp.value, "frame-ancestors 'none'");
});

test('Vercel config has X-Frame-Options DENY', () => {
  const headers = vercelJson.headers?.[0]?.headers || [];
  const xfo = headers.find(h => h.key === 'X-Frame-Options');
  assert(xfo, 'X-Frame-Options header must exist');
  assert(xfo.value === 'DENY', 'X-Frame-Options must be DENY');
});

test('Vercel config has Permissions-Policy', () => {
  const headers = vercelJson.headers?.[0]?.headers || [];
  const pp = headers.find(h => h.key === 'Permissions-Policy');
  assert(pp, 'Permissions-Policy header must exist');
  assertContains(pp.value, 'camera=()');
  assertContains(pp.value, 'microphone=()');
});

test('Vercel config sets function maxDuration', () => {
  const fnConfig = vercelJson.functions?.['api/**/*.js'];
  assert(fnConfig, 'Function config must exist');
  assert(fnConfig.maxDuration === 30, 'maxDuration should be 30');
});

// ==========================================
// SECTION 9: UI AND ACCESSIBILITY
// ==========================================
console.log('\n--- UI and Accessibility ---');

test('HTML has proper lang attribute', () => {
  assertContains(indexHtml, 'lang="en"');
});

test('HTML has viewport meta tag', () => {
  assertContains(indexHtml, 'viewport');
  assertContains(indexHtml, 'width=device-width');
});

test('HTML has accessible labels', () => {
  assertContains(indexHtml, 'aria-label');
  assertContains(indexHtml, 'sr-only');
});

test('HTML has all six conversation starters', () => {
  assertContains(indexHtml, 'Explain GEI to me');
  assertContains(indexHtml, 'Is Adam a dam?');
  assertContains(indexHtml, 'seven investigation roles');
  assertContains(indexHtml, 'challenge the blueprint');
  assertContains(indexHtml, 'participate');
  assertContains(indexHtml, 'evidence supports GEI');
});

test('CSS has dark mode tokens', () => {
  assertContains(stylesCSS, '--bg-primary: #0a1628');
  assertContains(stylesCSS, 'prefers-color-scheme: light');
  assertContains(stylesCSS, 'data-theme="dark"');
});

test('CSS is mobile-first with responsive breakpoints', () => {
  assertContains(stylesCSS, 'min-width: 768px');
  assertContains(stylesCSS, 'max-width: 360px');
  assertContains(stylesCSS, 'safe-area-inset-bottom');
});

test('Input has maxlength attribute', () => {
  assertContains(indexHtml, 'maxlength="2000"');
});

// ==========================================
// SECTION 10: PROMPT INJECTION PROTECTION
// ==========================================
console.log('\n--- Prompt Injection Protection ---');

test('System prompt establishes identity boundaries', () => {
  assertContains(systemPrompt, 'GEI Investigation Crew Assistant');
  assertContains(systemPrompt, 'chief briefing officer');
});

test('System prompt has clear integrity rules the model cannot override', () => {
  assertContains(systemPrompt, 'MUST NEVER');
  assertContains(systemPrompt, 'Fabricate citations');
});

test('Message content is truncated before reaching API', () => {
  assertContains(chatJs, 'm.content.slice(0, MAX_MESSAGE_LENGTH)');
});

test('Knowledge base cannot be confused with established facts', () => {
  assertContains(knowledge, 'PROPOSED INTERPRETIVE PARALLELS, not established translations');
  assertContains(knowledge, 'HYPOTHESIS');
  assertContains(knowledge, 'NOT GEI claims');
});

// ==========================================
// SECTION 11: API HANDLER UNIT TESTS
// ==========================================
console.log('\n--- API Handler Unit Tests ---');

const chatModule = await import(join(botDir, 'api', 'chat.js'));
const handler = chatModule.default;

function mockReq(method, body, headers = {}) {
  return {
    method,
    body,
    headers: { 'content-type': 'application/json', ...headers },
    socket: { remoteAddress: '127.0.0.' + Math.floor(Math.random() * 255) },
  };
}

function mockRes() {
  const res = {
    statusCode: null,
    _headers: {},
    _body: null,
    status(code) { res.statusCode = code; return res; },
    json(data) { res._body = data; return res; },
    end() { return res; },
    setHeader(k, v) { res._headers[k] = v; },
  };
  return res;
}

test('Rejects GET requests with 405', async () => {
  const res = mockRes();
  await handler(mockReq('GET'), res);
  assert(res.statusCode === 405, `Expected 405, got ${res.statusCode}`);
});

test('Rejects missing messages with 400', async () => {
  const res = mockRes();
  await handler(mockReq('POST', {}), res);
  assert(res.statusCode === 400, `Expected 400, got ${res.statusCode}`);
});

test('Rejects empty messages array with 400', async () => {
  const res = mockRes();
  await handler(mockReq('POST', { messages: [] }), res);
  assert(res.statusCode === 400, `Expected 400, got ${res.statusCode}`);
});

test('Rejects non-array messages with 400', async () => {
  const res = mockRes();
  await handler(mockReq('POST', { messages: 'not an array' }), res);
  assert(res.statusCode === 400, `Expected 400, got ${res.statusCode}`);
});

test('Rejects too many messages with 400', async () => {
  const res = mockRes();
  const messages = Array.from({ length: 31 }, (_, i) => ({
    role: i % 2 === 0 ? 'user' : 'assistant',
    content: 'test',
  }));
  await handler(mockReq('POST', { messages }), res);
  assert(res.statusCode === 400, `Expected 400, got ${res.statusCode}`);
});

test('Rejects messages with only empty content', async () => {
  const res = mockRes();
  await handler(mockReq('POST', { messages: [{ role: 'user', content: '' }] }), res);
  assert(res.statusCode === 400, `Expected 400, got ${res.statusCode}`);
});

test('Returns 503 when API key is not set', async () => {
  const originalKey = process.env.ANTHROPIC_API_KEY;
  delete process.env.ANTHROPIC_API_KEY;
  const res = mockRes();
  await handler(mockReq('POST', { messages: [{ role: 'user', content: 'hello' }] }), res);
  if (originalKey) process.env.ANTHROPIC_API_KEY = originalKey;
  assert(res.statusCode === 503, `Expected 503, got ${res.statusCode}`);
  assert(res._body.error === 'not_configured', 'Should return not_configured error');
});

test('Rate limiting triggers after threshold', async () => {
  const ip = '192.168.99.99';
  const headers = { 'x-forwarded-for': ip };
  let lastStatus = null;
  for (let i = 0; i < 12; i++) {
    const res = mockRes();
    await handler(mockReq('POST', { messages: [{ role: 'user', content: 'test' }] }, headers), res);
    lastStatus = res.statusCode;
  }
  assert(lastStatus === 429, `Expected 429 after rate limit, got ${lastStatus}`);
});

test('OPTIONS returns 204', async () => {
  const res = mockRes();
  await handler(mockReq('OPTIONS'), res);
  assert(res.statusCode === 204, `Expected 204, got ${res.statusCode}`);
});

// ==========================================
// RESULTS
// ==========================================
console.log('\n========================================');
console.log(`RESULTS: ${passed} passed, ${failed} failed`);
console.log('========================================\n');

if (failed > 0) {
  console.log('FAILURES:');
  results.filter(r => r.status === 'FAIL').forEach(r => {
    console.log(`  FAIL: ${r.name}`);
    console.log(`        ${r.reason}`);
  });
  console.log('');
}

results.forEach(r => {
  console.log(`  ${r.status === 'PASS' ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m'} ${r.name}`);
});

process.exit(failed > 0 ? 1 : 0);
