# Owner Punch List

Things only the founder can do. I'll build everything around these. Check them off as you go.

---

## Block 1 — Before Phase 1 deploy

### Domain
- [ ] Register domain. Recommended: **hopeofglory.ministry** (~$25/yr). Backup: `hopeofglory.org`, `hopeofgloryministry.com`.
- [ ] Add DNS pointing to Railway (we'll set this up after Railway project is live).

### Railway
- [ ] Create Railway account → https://railway.app
- [ ] Create new project: "Hope of Glory"
- [ ] Provision: PostgreSQL, Redis
- [ ] Get `DATABASE_URL` and `REDIS_URL` → into `.env.local`

### Google Cloud (for OAuth + YouTube later)
- [ ] Create Google Cloud project: "Hope of Glory Ministry"
- [ ] Enable APIs: People API (OAuth), YouTube Data API v3, YouTube Live Streaming API
- [ ] Configure OAuth consent screen (External, in-development OK)
- [ ] Create OAuth Client ID (Web). Authorized redirect: `https://hopeofglory.ministry/api/auth/callback/google` + `http://localhost:3000/api/auth/callback/google`
- [ ] Capture `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` → into `.env.local`

### AI providers — get the keys
- [ ] **Cerebras** — https://cloud.cerebras.ai — create 5 keys with labels: `cerebras-sermons`, `cerebras-chat`, `cerebras-live`, `cerebras-phone`, `cerebras-background`. (Service-class isolation, not rate-limit evasion.)
- [ ] **Anthropic** — https://console.anthropic.com → create API key. Default model: `claude-sonnet-4-5`.
- [ ] **OpenAI** — https://platform.openai.com → create API key. For embeddings (`text-embedding-3-small`) + structured verification via Responses API.

### Monitoring
- [ ] **Sentry** — https://sentry.io → create project (Next.js). Capture `SENTRY_DSN`.

---

## Block 2 — Before Phase 3 launch (public)

### Email
- [ ] **Resend** — https://resend.com → create account, verify `hopeofglory.ministry` domain (DKIM/SPF DNS records). Capture `RESEND_API_KEY`.
- [ ] Configure `EMAIL_FROM=hello@hopeofglory.ministry`.

### Storage
- [ ] **S3-compatible storage** — Railway Volume, Cloudflare R2 (cheapest), or AWS S3. Capture credentials. Public URL for sermon audio/images.

### Image generation
- [ ] **fal.ai** — https://fal.ai → create account, get API key (cheapest fast access to Flux 1.1 Pro). Recommended for Branding Agent.
- [ ] Alternative: **Replicate** (https://replicate.com) for broader model selection. Use for Video Agent later.

---

## Block 3 — Before Phase 4 distribution

### Social platform developer accounts (start TikTok ASAP — slowest approval)
- [ ] **Meta for Developers** — https://developers.facebook.com → create app, request Pages + Instagram Graph API permissions. Business verification required (1-3 days).
- [ ] **TikTok for Developers** — https://developers.tiktok.com → register app, request **Content Posting API** access. **THIS APPROVAL TAKES 2-4 WEEKS — START DAY 1.**
- [ ] **LinkedIn Developer** — https://developer.linkedin.com → create app, request "Share on LinkedIn" + "Manage Organization Page" permissions.
- [ ] **YouTube** — already covered above under Google Cloud.
- [ ] **Pinterest Developers** — https://developers.pinterest.com → create app.
- [ ] **BlueSky** — get an app password from your account settings (no developer registration needed).
- [ ] **Threads** — uses Meta Developer app from above.
- [ ] **Mastodon** — create account on chosen instance (mastodon.social or christian.social), get access token.
- [ ] **Discord** — create a server, create a webhook URL for our ministry channel.

### X (Twitter) — built but paused
- [ ] **X Developer** — https://developer.x.com → Basic tier ($200/mo) required for posting. **Hold off until donations support this cost.** Build the integration in Phase 4, flip on in Phase 11.

---

## Block 4 — Before Phase 9 phone line

### SignalWire
- [ ] **SignalWire** — https://signalwire.com → create account, provision a phone number (~$1/mo).
- [ ] Capture: `SIGNALWIRE_PROJECT_ID`, `SIGNALWIRE_TOKEN`, `SIGNALWIRE_SPACE_URL`, `SIGNALWIRE_PHONE_NUMBER`.

### Deepgram
- [ ] **Deepgram** — https://console.deepgram.com → create account, get API key. Free $200 credit on signup.

### Crisis line agreements (no formal partnerships — public numbers used)
- 988 Suicide & Crisis Lifeline (US): public, no agreement needed.
- 911: public emergency, no agreement needed.

---

## Block 5 — Before Phase 10 donations

### Legal / nonprofit
- [ ] **Incorporate as a nonprofit** in your state. D.C. has its own nonprofit corp filing. Federal: file IRS Form SS-4 for EIN (free). State: file Articles of Incorporation for nonprofit religious corporation.
- [ ] **EIN** — apply at https://irs.gov/ein (instant if you do it online).
- [ ] **IRS Form 1023** for 501(c)(3) status (or 1023-EZ if eligible — under $50k gross receipts and < $250k assets). I'll draft the application narrative.
- [ ] **Registered agent** — required for incorporation. Use a service ($50-150/yr) or yourself if you have a physical D.C. address.

### PayPal
- [ ] **PayPal Donate** — https://developer.paypal.com → create app under your nonprofit business account. Capture `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, configure webhook → capture `PAYPAL_WEBHOOK_ID`.

---

## Block 6 — Optional / later

- [ ] **Twitch** — for stream destination mirroring (Phase 7+). Create channel, get stream key.
- [ ] **Spotify for Podcasters** + **Apple Podcasts Connect** if we want a podcast feed (sermon audio).
- [ ] **Buy Me a Coffee** or **Stripe** for non-PayPal donation options if PayPal becomes a friction point.

---

## What you DO NOT need to do

I handle all of this — no action from you required:
- Writing every line of code
- Designing the database
- Wiring all the agents together
- Building the admin panel
- Writing the sermon engine
- Generating the image prompts (you just run them or let the Branding Agent run them)
- Drafting all doctrine docs (already done in Phase 0)
- Writing all site copy (already done in Phase 0)
- Logo design briefs (already done — three concepts in `docs/brand/logo-brief.md`)
- Privacy + terms (already drafted in Phase 0)

You bring the keys and the calling. I bring the code and the discipline.
