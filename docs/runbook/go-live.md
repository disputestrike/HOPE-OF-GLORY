# Go-Live Runbook

Single canonical path from "fresh repo" to "public traffic." If you only read one doc, read this one.

---

## 0. Prerequisites (1 minute)

- Node 20+ installed
- pnpm 9+ installed (`corepack enable && corepack prepare pnpm@9.12.0 --activate`)
- Git installed
- Editor of choice
- A credit card (everything below uses free or low-cost tiers initially)

---

## 1. Local clone + dependency install (5 minutes)

```bash
git clone https://github.com/disputestrike/HOPE-OF-GLORY.git hope-of-glory
cd hope-of-glory
pnpm install --frozen-lockfile
cp .env.example .env.local
```

You can now run `pnpm typecheck` and `pnpm test` against the lockfile. They should pass.

---

## 2. Provision the production infrastructure (60-90 minutes)

### Database — Railway PostgreSQL

1. https://railway.app → New project → "Hope of Glory"
2. Add → PostgreSQL → wait 60s
3. Click the Postgres service → Connect → copy the `DATABASE_URL` (looks like `postgresql://user:pwd@host:5432/railway`)
4. In the same project, Add → Redis → copy `REDIS_URL`

### Auth — Google OAuth

1. https://console.cloud.google.com → New project "Hope of Glory Ministry"
2. APIs & Services → OAuth consent screen → External → fill basics
3. Credentials → Create credentials → OAuth client ID → Web application
4. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://hopeofglory.ministry/api/auth/callback/google` (or your final domain)
5. Copy `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

### AI providers (pick at least one; ideally all three for the routing tiers)

- Anthropic: https://console.anthropic.com → API Keys → create → `ANTHROPIC_API_KEY`
- OpenAI: https://platform.openai.com → API Keys → create → `OPENAI_API_KEY`
- Cerebras (optional, workhorse): https://cloud.cerebras.ai → API Keys → create 5 keys with labels: `cerebras-sermons`, `cerebras-chat`, `cerebras-live`, `cerebras-phone`, `cerebras-background`

If none of the three are configured, Ask Hope falls back to local Scripture-grounded responses (still useful, but no nuance).

### Monitoring — Sentry

1. https://sentry.io → New project (Next.js) → `SENTRY_DSN`

### Generate secrets

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

Run that command four times and use the outputs for:
- `AUTH_SECRET`
- `CRON_SECRET`
- `PHONE_HASH_PEPPER`
- `IP_HASH_PEPPER`

---

## 3. Populate `.env.local` (10 minutes)

Open `.env.local` and fill in:

```
NEXT_PUBLIC_SITE_URL=https://hopeofglory.ministry
APP_ENV=production
APP_VERSION=1.0.0

DATABASE_URL=<from Railway Postgres>
DATABASE_SSL=require
REDIS_URL=<from Railway Redis>

AUTH_SECRET=<generated>
GOOGLE_CLIENT_ID=<from Google>
GOOGLE_CLIENT_SECRET=<from Google>
ADMIN_EMAILS=you@example.com

ANTHROPIC_API_KEY=<from Anthropic>
OPENAI_API_KEY=<from OpenAI>
# Optional, recommended:
# CEREBRAS_KEY_SERMONS=...
# CEREBRAS_KEY_CHAT=...

PHONE_HASH_PEPPER=<generated>
CRON_SECRET=<generated>

SENTRY_DSN=<from Sentry>

# Budget caps (recommended for production)
AI_DAILY_BUDGET_USD=20
AI_MONTHLY_BUDGET_USD=400
AI_BUDGET_HARD_STOP=true
AI_BUDGET_ALERT_EMAILS=you@example.com

# Crisis alerting (REQUIRED before public launch)
CRISIS_ALERT_EMAILS=you@example.com
```

---

## 4. Database migration + seed (5 minutes)

```bash
pnpm db:migrate
pnpm db:seed
pnpm ingest:doctrine
pnpm ingest:creeds
pnpm seed:calendar
```

If you have the WEB Bible JSON at `content/bible/web.json` (see `content/bible/README.md`):

```bash
pnpm ingest:bible
```

Skip this on first launch if you'd rather come back to it later — the site works without WEB ingested; only direct verse-lookup features degrade.

---

## 5. Local verification (5 minutes)

```bash
pnpm typecheck
pnpm test
pnpm content:qa
pnpm preflight
pnpm dev
```

In another terminal:

```bash
SMOKE_BASE_URL=http://localhost:3000 pnpm smoke:routes
```

All five must pass. If `preflight` flags missing env vars, fix and re-run.

Visit `http://localhost:3000` — the public site should render. Visit `/admin/login`, sign in with the Google account in `ADMIN_EMAILS`, then go to `/admin/dashboard` and `/admin/release` to see the full state of readiness.

---

## 6. Crisis-alert end-to-end test (5 minutes — MANDATORY)

This is the single most important test before public traffic. An imminent crisis event with no human paged is the worst failure mode in the system.

While signed in to `/admin`, paste in the browser dev console:

```javascript
fetch("/api/admin/alerts/test", { method: "POST" }).then(r => r.json()).then(console.log)
```

Within ~60 seconds, every address in `CRISIS_ALERT_EMAILS` must receive an email subjectd `[TEST] [CRISIS — IMMINENT] Hope Line caller needs human follow-up`. **If any recipient doesn't get it, fix it now.**

Then on a non-prod build, submit a prayer request with imminent-trigger language (anything matching the patterns in `packages/safety/src/crisis.ts`). The real (un-prefixed) crisis email must arrive at every address.

If both pass → continue.
If either fails → STOP. Do not deploy.

---

## 7. Deploy to Railway (15 minutes)

In the same Railway project from step 2:

1. New service → GitHub repo → `disputestrike/HOPE-OF-GLORY`
2. Settings → Build → root directory = `apps/web`, build command = `pnpm install --frozen-lockfile && pnpm --filter web build`, start command = `pnpm --filter web start`
3. Variables → paste in every var from `.env.local` (set `APP_ENV=production`)
4. Custom domain → add `hopeofglory.ministry` → update DNS at your registrar to the CNAME Railway provides
5. Wait for the build to go green

Repeat the service-creation steps for the **worker** (start: `pnpm --filter worker start`), **voice** (start: `pnpm --filter voice start`), and **stream** (start: `pnpm --filter stream start`) services in the same Railway project. They share the same env vars.

---

## 8. Wire the cron schedules (5 minutes)

In Railway, on the **web** service → Settings → Cron Jobs (or use an external scheduler like https://cron-job.org). Two crons:

| Path | Schedule (UTC) | What it does |
|---|---|---|
| `POST /api/cron/daily` | `0 12 * * *` (6 AM CT) | Generates today's sermon (LLM-gated), pushes queued social, sends queued emails, kicks YouTube upload if video is ready |
| `POST /api/cron/weekly` | `0 2 * * 0` (Sunday 2 AM UTC) | Streams `pg_dump` to S3 + retention cleanup |

Both require the header `Authorization: Bearer ${CRON_SECRET}`.

---

## 9. Production verification (10 minutes)

```bash
SMOKE_BASE_URL=https://hopeofglory.ministry pnpm smoke:routes
```

Must pass. Then visit `/admin/release` — every gate should be green or warn (not fail) for the categories you've activated.

Fire the crisis-alert test once against production — confirm email lands.

---

## 10. Announce (when you decide you're ready)

Soft-launch to 50 invited users for 7 days. Watch `/admin/dashboard` for crisis events and failed jobs. Tune as needed. Then public.

---

## When something goes wrong

- **Site is up but slow** → Check Sentry. Check `/admin/spend` (are you cap-rate-limited?).
- **Crisis alert didn't fire** → Check Resend dashboard. Check `CRISIS_ALERT_EMAILS` env is set on the deployed service (not just local). Re-fire the test endpoint.
- **Today's sermon didn't publish** → Check `/admin/dashboard` for failed jobs. Check `job_runs` for `daily_content_automation` rows. Check `/admin/release` — if DB or auth is red, fix that first.
- **DB issue / data loss** → See `docs/runbook/disaster-recovery.md`. Most recent backup is at `s3://${S3_BUCKET}/backups/postgres/{YYYY-MM-DD}/`.
- **AI budget exhausted** → `/admin/spend` will show 100% red. Raise the cap in env or wait for tomorrow.

---

## What runs automatically once you're live

| What | When | Where |
|---|---|---|
| Sermon generation (LLM-gated through Doctrine Agent) | Daily 6 AM CT | `/api/cron/daily` → `runSermonPipeline` |
| Sermon hero image + audio + video | Same | `renderSermonAssets` (Phase 5 pipeline) |
| Social posts (Postiz) | Same + on-schedule by Postiz queue | `runSocialSendPipeline` |
| Email lifecycle (new believer, 40-day, daily faith, etc.) | Same | `runEmailSendPipeline` |
| YouTube upload (unlisted; admin promotes) | Same when video is ready | `uploadDailySermonToYouTube` |
| Postgres backup to S3 | Sunday 2 AM UTC | `/api/cron/weekly` |
| Crisis alerts to founder email | Immediately on imminent event | `alertOnImminentCrisis` |

If a step's env vars are missing, that step is silently skipped (logged as `skipped`). The cron itself never fails because a future feature isn't configured yet.

---

Soli Deo gloria. Now go live.
