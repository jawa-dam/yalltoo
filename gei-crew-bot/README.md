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
4. Add the environment variable:
   - `ANTHROPIC_API_KEY` = your Anthropic API key
5. Deploy.

The bot will be live at your Vercel URL (e.g., `gei-crew-bot.vercel.app`).

### Optional Configuration

| Environment Variable | Default | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | *(required)* | Your Anthropic API key |
| `CHAT_MODEL` | `claude-sonnet-4-20250514` | Claude model ID to use |

## Updating the Knowledge Base

Edit the files in `knowledge/`:

- **`system-prompt.txt`** — Bot personality, rules, and behavior instructions
- **`gei-knowledge.txt`** — Research content, framework details, and source material

Changes take effect on next deployment (or next serverless function cold start).

## Limitations

- **Requires an Anthropic API key** — the bot won't respond without one configured
- **No persistent memory** — conversation resets on page refresh
- **No retrieval system** — the bot uses a static knowledge base, not live document search
- **No user accounts** — chatting does not constitute joining the research team
- **API costs** — each conversation incurs Claude API usage charges

## Research Integrity

The bot is built to maintain honesty about what GEI is and isn't:

- GEI hypotheses are labeled as hypotheses
- Established facts are distinguished from proposed interpretations
- The Adam A-DAM association is presented as English wordplay, not Hebrew etymology
- No fabricated evidence, endorsements, or citations
- Skepticism is welcomed, not treated as hostility
