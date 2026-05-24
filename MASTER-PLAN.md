# Hope of Glory Ministry — Master Plan

> The earth shall be filled with the knowledge of the glory of the Lord.

This is the build sequence. 13 phases. Every phase produces a green-light condition before public release.

---

## Operating principles

1. **AI-operated, human-governed.** Agents run the work. The founder retains authority over doctrine, credentials, donations, incident response, crisis escalation, and public corrections.
2. **Doctrine is the gate.** Nothing publishes without the Doctrine Agent scoring it ≥ 0.85 against the constitution.
3. **Build everything. Stage the public launches.** Each subsystem is built into the same monorepo. Public-facing release of each is gated by its safety tests.
4. **Witness > velocity.** A slow launch that honors Christ beats a fast one that embarrasses Him.
5. **No external SaaS dashboards we have to log into.** The agent workshop orchestrates everything in-house. Self-hosted Postiz on Railway, direct platform APIs where needed.

---

## Phase 0 — Foundation ✅
- Doctrinal constitution (11 documents)
- Public site copy (17 pages)
- Brand system (palette, typography, logo concepts, 30 hyper-realistic image-gen prompts, asset checklist)
- Database schema (35 tables, Drizzle ORM, pgvector)
- Agent system prompts (15 agents, including extra-care Crisis Agent)

## Phase 1 — Core platform 🚧
- pnpm monorepo
- Next.js 15 web app, Tailwind, brand tokens
- Drizzle migrations against Railway Postgres
- WEB Bible ingestion + pgvector RAG
- Doctrine document ingestion
- Google OAuth admin login
- Sentry monitoring
- AI gateway (Cerebras 5-key pool, OpenAI verifier, Anthropic verifier)
- Orchestrator + Doctrine Agent skeleton
- Base layout, navigation, footer
- All 17 public pages rendering from site copy

## Phase 2 — Sermon engine
- Calendar Agent (editorial calendar, sermon series)
- Sermon Agent (daily sermon generation)
- Greek/Hebrew Agent (original-language insight with confidence scoring)
- Branding Agent (Scripture cards + sermon hero images via Flux 1.1 Pro)
- Sermon publishing to /sermons
- Admin sermon studio

## Phase 3 — Ask Hope + Prayer + Phase-1 PUBLIC LAUNCH 🚀
- Q&A Agent live on /ask
- Prayer Agent live on /prayer (text only — phone deferred to Phase 9)
- Chat UI
- First sermon published
- AI disclosure live
- /corrections live
- **Site goes public**

## Phase 4 — Multi-channel distribution
- Self-hosted Postiz on Railway
- Posting Agent → Postiz API
- Direct YouTube Data API integration
- Summarization Agent
- Scheduling Agent
- Resend email + Contact Agent + daily devotional email sequence
- BlueSky, Threads, Mastodon, LinkedIn, Pinterest, Discord, Facebook, Instagram, TikTok (pending approval)
- X built but **not launched** (toggle off until donations support $200/mo)

## Phase 5 — Video & visuals
- Video Agent orchestrating Runway Gen-3 / Pika + FFmpeg
- Reels and shorts pipeline
- Deepgram TTS sermon audio
- Automated Scripture cards
- Sermon hero image generation
- Daily content automation

## Phase 6 — Engagement loop
- Engagement Agent reads comments/DMs across platforms
- Admin approval queue (first 30 days every reply human-reviewed)
- Sentiment classification
- Crisis indicator routing

## Phase 7 — Live YouTube
- YouTube Live Streaming API + RTMPS
- OBS/FFmpeg scene composition (Scripture cards, sermon title, Q&A card)
- Live chat ingestion via Live Chat API
- Q&A Agent answers viewer questions live
- Deepgram TTS narration
- First scheduled live show (Sunday sermon)
- Twitch destination mirror via OBS

## Phase 8 — Apologetics desk
- Apologetics Agent with heavy tone tuning
- apologetics-policy.md enforced as gate
- 200+ hard objections tested before public release
- "Defending the Faith" Thursday live show
- Steel-man-required rule
- Never-attack-groups guardrail

## Phase 9 — Hope Line / Crisis 🔴 highest stakes
- SignalWire phone number provisioned
- Crisis Agent (Claude only, never Cerebras)
- Mid-call transfer/conference to 988 + 911
- 50+ simulated crisis test calls reviewed before public
- Transcript review dashboard
- Soft pastoral tone
- PII protection (caller_hash SHA-256, no raw phone stored)

## Phase 10 — Donations live
- PayPal Donate SDK embedded
- donation-ethics.md enforced by Donation Tone Guard
- Webhook logging
- Donor receipt automation
- Nonprofit incorporation completed
- IRS Form 1023 drafted and filed

## Phase 11 — Apologetics live debate room
- Live AI Q&A on Islam/atheism/Trinity/Bible reliability
- Only after Apologetics Agent has 4 weeks of recorded performance
- Tone classifier has rejected 200+ attack-mode drafts
- Manual kill switch in admin
- X integration flipped on at this stage if budget allows

## Phase 12 — International / multilingual
- Translation Agent
- Spanish (Reina-Valera 1909, public domain)
- Portuguese (Almeida)
- French (Louis Segond)
- Arabic (Van Dyck)
- Mandarin (Chinese Union Version)
- Hindi
- Strategic Hab 2:14 reach prioritization

## Phase 13 — New Believer pathway
- Discipleship Agent
- 30-day new-believer email sequence
- Bible reading plans (start in John)
- Connection to local-church directory
- Pointing people to flesh-and-blood community as a feature, not a bug

---

## What is built but not launched

| Feature | Built in Phase | Launched in Phase |
|---|---|---|
| Public site + Ask Hope + Prayer | 1-3 | 3 |
| Daily sermon engine | 2 | 3 |
| Multi-channel distribution | 4 | 4 |
| Video pipeline | 5 | 5 |
| Engagement loop | 6 | 6 (approval queue first) |
| Live YouTube | 7 | 7 |
| Apologetics Q&A | 8 | 8 |
| Hope Line phone | 9 | 9 |
| Donations | 10 | 10 |
| Live debate room | 11 | 11 |
| X (Twitter) | 4 | 11 (or when budget) |
| TikTok content | 4 | 4 (or whenever TikTok approval lands) |

---

## Green-light gates per phase

Every phase must pass these before public release:

- [ ] Doctrine Agent scores ≥ 0.85 on representative outputs
- [ ] Safety/crisis classifier passes red-team test set
- [ ] No copyrighted Bible text in storage or output (WEB/KJV only)
- [ ] No technology stack names exposed in public copy
- [ ] AI disclosure present where AI is producing output
- [ ] Admin can see, pause, kill, override every agent
- [ ] All output logged to `agent_runs` with provider + model + cost + risk score
- [ ] PII redaction confirmed on any external API call
