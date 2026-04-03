# Agent Party

RPG-style AI agent team manager. Build your party, assign quests, watch them collaborate.

Powered by Claude. Works with **Claude Max plan** (no API key needed) or direct **API access**.

## Features

- **4 Agent Characters** - Each with unique personality, skills, and RPG stats
  - Merlin (Architect) | Sir Debug (Warrior Dev) | Pixie (Design Fox) | Data-X (Data Sorcerer)
- **Dual Backend** - Use Claude Code CLI (free with Max plan) or Anthropic API
- **Team Discussions** - Agents debate topics from their unique perspectives
- **RPG Stats** - HP, XP, levels that change as agents complete tasks
- **Quick Actions** - One-click suggestions, debugging, introductions, and more
- **Dark RPG Theme** - Beautiful game-inspired UI with animations

## Quick Start

```bash
git clone https://github.com/YOUR_USERNAME/agent-party.git
cd agent-party
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Setup

**Option A: Claude Code CLI (recommended for Max plan users)**
1. Install [Claude Code](https://docs.anthropic.com/en/docs/claude-code)
2. Authenticate: `claude login`
3. In Agent Party settings, select "Claude CLI"

**Option B: API Key**
1. Get an API key from [Anthropic Console](https://console.anthropic.com)
2. In Agent Party settings, select "API Key" and paste your key

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand
- Anthropic SDK

## License

MIT
