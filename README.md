# Hope of Glory Ministry

> "For the earth shall be filled with the knowledge of the glory of the Lord, as the waters cover the sea." — Habakkuk 2:14 (WEB)

An AI-native Christian media ministry. This repository is the entire workshop: doctrine, brand, site, agents, sermon engine, prayer line, distribution, admin.

## Repository layout

```
hope-of-glory/
├── apps/
│   ├── web/      Next.js public site + admin
│   ├── worker/   Background jobs, sermon engine, agent orchestrator
│   ├── voice/    SignalWire AI voice agent (Hope Line)
│   └── stream/   Livestream / RTMP utilities
├── packages/
│   ├── db/         Drizzle schema, migrations
│   ├── ai/         Model router, providers
│   ├── rag/        Retrieval, embeddings
│   ├── prompts/    Agent system prompts (15 agents)
│   ├── scripture/  Bible lookup, cross-references
│   ├── safety/     Moderation, crisis classification
│   ├── publishing/ Postiz adapter, social adapters
│   ├── voice/      SignalWire + Deepgram helpers
│   ├── payments/   PayPal donations
│   ├── analytics/  Metrics
│   └── shared/     Types + utils
├── content/
│   ├── site-copy/  Public page copy (MDX)
│   ├── bible/      World English Bible source
│   ├── creeds/     Apostles', Nicene, Chalcedon
│   ├── sermons/    Published sermons
│   └── studies/    Bible studies
└── docs/
    ├── doctrine/      11 doctrine policies (constitution)
    ├── brand/         Logo brief, style guide, image prompts
    ├── architecture/  System diagrams + runbooks
    └── runbook/       Incident response
```

## Phase-1 quick start

```bash
pnpm install
cp .env.example .env.local   # fill in keys
pnpm db:migrate
pnpm db:seed
pnpm dev
```

## Doctrinal anchors

- Habakkuk 2:14 — the earth filled with the knowledge of the glory of the Lord
- Psalm 72:19 — the whole earth filled with his glory
- Colossians 1:27 — Christ in you, the hope of glory

Trinity. Nicene. Bible-believing. Scripture is the sole authority. On secondary doctrines where faithful Christians differ, we teach the text and defer to the local church.

## Agent workshop

15 specialized AI agents. Doctrine Agent is the gate. Crisis Agent gets the highest care. See `packages/prompts/agents/`.

## The plan

See `MASTER-PLAN.md` for the 13 phases. See `OWNER-PUNCHLIST.md` for what only the founder can do (accounts, keys, paperwork).
