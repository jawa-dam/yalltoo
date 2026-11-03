# GEI Investigation Crew Assistant

A chatbot for the Genesis Engineered Interpretation (GEI) research initiative.
Built by Y'allToo / Genesis Engineered Interpretation.

**Seven disciplines. One blueprint. Agreement is never required.**

## What It Does

- Explains the GEI framework in plain language
- Guides visitors through seven investigation roles (Hebrew Scholar, Biblical Researcher, Civil Engineer, Hydrologist, Archaeologist, Mechanical Engineer, Curious Citizen)
- Handles the "Is Adam a dam?" question with proper distinction between hypothesis and etymology
- Welcomes challenges and skepticism — does not auto-defend GEI
- Links to published research (Zenodo, YouTube) and participation forms
- Maintains research integrity: never invents evidence, endorsements, or claims

## Architecture

```
gei-crew-bot/
├── api/
│   └── chat.js           # Vercel serverless function (Claude API proxy)
├── public/
│   ├── index.html         # Chatbot UI
│   ├── styles.css         # Responsive styles (dark/light mode)
│   └── app.js             # Client-side chat logic
├── knowledge/
│   ├── system-prompt.txt  # Bot personality and rules
│   └── gei-knowledge.txt  # Research knowledge base
├── package.json
├── vercel.json
└── README.md
```

- **Frontend**: Static HTML/CSS/JS — no framework dependencies
- **Backend**: Vercel serverless function proxying to Claude API
- **Knowledge**: Markdown text files loaded at runtime by the serverless function
- **API keys**: Server-side only — never exposed to the browser
- **Knowledge base**: Static files loaded at function cold start — no live document retrieval
- **Conversation memory**: Session-only (in browser memory) — resets on page refresh

## Setup and Deployment

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- [Vercel CLI](https://vercel.com/docs/cli) (`npm i -g vercel`)
- An [Anthropic API key](https://console.anthropic.com/)

### Local Development

```bash
cd gei-crew-bot
npm install
```

Create a `.env` file (gitignored):

```
ANTHROPIC_API_KEY=sk-ant-...
```

Start the dev server:

```bash
npx vercel dev
```

Open `http://localhost:3000`.

### Deploy to Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Set **Root Directory** to `gei-crew-bot`.
4. Add environment variables (see table below).
5. Deploy.

The bot will be live at your Vercel URL (e.g., `gei-crew-bot.vercel.app`).

### Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | — | Your Anthropic API key from console.anthropic.com |
| `CHAT_MODEL` | No | `claude-sonnet-4-20250514` | Claude model ID to use |
| `ALLOWED_ORIGINS` | No | `*` (any origin) | Comma-separated list of allowed CORS origins. Set to your deployment URL in production (e.g., `https://gei-crew-bot.vercel.app`) |

## Security Protections

### Rate Limiting
- **Server-side**: 10 requests per IP per 60-second window (in-memory, per serverless instance)
- **Client-side**: 2-second minimum interval between messages
- Returns `429` with `Retry-After` header when exceeded

**Note**: In-memory rate limiting resets when a new serverless instance spins up. For persistent cross-instance rate limiting, integrate an external store like [Upstash Redis](https://upstash.com/) and add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` environment variables. This is optional — the current in-memory approach provides reasonable protection for moderate traffic.

### Request Validation
- Maximum 30 messages per conversation
- Maximum 1,500 characters per message
- Maximum 20,000 total characters per request
- Role alternation enforced (user/assistant must alternate)
- Empty and malformed requests rejected

### Cost Controls
- Output capped at 800 tokens per response
- API request timeout: 30 seconds (serverless function) + 35 seconds (client)
- No automatic retry on failure
- Conversation history capped client-side at 30 messages

### CORS and Headers
- `ALLOWED_ORIGINS` restricts which domains can call the API
- `Content-Security-Policy` blocks inline scripts, external script loading, and framing
- `X-Frame-Options: DENY` prevents embedding
- `Permissions-Policy` disables camera, microphone, and geolocation
- Stack traces and internal errors are never exposed to the client

### API Cost Monitoring
- Monitor usage at [console.anthropic.com](https://console.anthropic.com/)
- Set a monthly spending limit in the Anthropic console under Settings > Limits
- Each conversation turn costs roughly 5,000–7,000 input tokens (knowledge base + history) + up to 800 output tokens
- Estimated cost per response: ~$0.01–0.03 depending on model and conversation length

## Updating the Knowledge Base

Edit the files in `knowledge/`:

- **`system-prompt.txt`** — Bot personality, rules, and behavior instructions
- **`gei-knowledge.txt`** — Research content, framework details, and source material

Changes take effect on next deployment (or next serverless function cold start).

## Testing

### Run the test suite

```bash
cd gei-crew-bot
node tests/test-suite.js
```

Tests cover:
- All seven investigation pathways
- Adam A-DAM question handling
- Religious, nonreligious, and skeptical visitor scenarios
- Empty/oversized/malformed request rejection
- Rate limiting behavior
- API failure and timeout handling

### Manual testing

Start the dev server with `npx vercel dev` and try the six conversation starters on the welcome screen. Each represents a core pathway.

## Limitations

- **Requires an Anthropic API key** — the bot shows a clear error without one configured
- **No persistent memory** — conversation resets on page refresh
- **No retrieval system** — the bot uses a static knowledge base, not live document search
- **No user accounts** — chatting does not constitute joining the research team
- **API costs** — each conversation incurs Claude API usage charges
- **In-memory rate limiting** — resets per serverless instance; upgrade to Redis for persistent limiting
- **No conversation export** — visitors cannot download their chat history

## Troubleshooting

| Problem | Solution |
|---|---|
| "API key not configured" error | Set `ANTHROPIC_API_KEY` in Vercel project settings > Environment Variables |
| "Invalid API key" error | Verify the key at console.anthropic.com; regenerate if needed |
| "Rate limited" message | Wait 60 seconds; check Anthropic console for account-level limits |
| Bot returns generic errors | Check Vercel function logs (Vercel dashboard > Deployments > Functions) |
| Fonts not loading | Verify CSP allows `fonts.googleapis.com` and `fonts.gstatic.com` |
| CORS errors in browser console | Set `ALLOWED_ORIGINS` to your deployment URL, or remove to allow all |

## Research Integrity

The bot is built to maintain honesty about what GEI is and isn't:

- GEI hypotheses are labeled as hypotheses
- Established facts are distinguished from proposed interpretations
- The Adam A-DAM association is presented as English wordplay, not Hebrew etymology
- No fabricated evidence, endorsements, or citations
- Skepticism is welcomed, not treated as hostility
