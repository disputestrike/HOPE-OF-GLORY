# Self-hosted Postiz on Railway

Postiz (MIT-licensed) handles per-platform OAuth + posting queues for X, Instagram, Facebook,
TikTok, LinkedIn, BlueSky, Threads, Mastodon, Pinterest, Discord, YouTube, and more. We
self-host it so the workshop stays in-house.

## Deploy steps

1. **Fork or clone the Postiz repo:** https://github.com/gitroomhq/postiz-app

2. **Create a Railway service from the repo.** Postiz ships Docker support and runs as a
   single service plus a worker. Railway can run both off the same image with different
   start commands.

3. **Required environment variables:**
   ```
   DATABASE_URL          # Postiz needs its own Postgres — provision a SEPARATE Postgres on Railway
   REDIS_URL             # Postiz needs Redis — separate from our app Redis
   JWT_SECRET            # 64-char random
   FRONTEND_URL          # https://postiz.hopeofglory.internal
   NEXT_PUBLIC_BACKEND_URL  # same
   BACKEND_INTERNAL_URL  # http://localhost:3000 inside Railway
   IS_GENERAL=true
   STORAGE_PROVIDER=local  # or 'cloudflare' once R2 is set up
   API_TOKEN             # generate a long random string — this is what our app uses to call Postiz
   ```

4. **Set up platform OAuth credentials** (this is the same work whether self-hosted or cloud Postiz):
   - X / Twitter API keys
   - Meta (Facebook + Instagram) app credentials
   - TikTok Content Posting API credentials
   - LinkedIn OAuth credentials
   - YouTube OAuth credentials
   - BlueSky app password
   - Threads (via Meta)
   - Mastodon access token
   - Pinterest app credentials
   - Discord webhook URLs

   Each platform's required env vars are documented in the Postiz README. Many of these
   accounts need to be created and verified before keys are issued — TikTok's Content
   Posting API approval can take 2-4 weeks, so submit early.

5. **Run migrations:** Postiz auto-migrates on first boot.

6. **Connect platforms in the Postiz UI:**
   - Visit `https://postiz.hopeofglory.internal`
   - Sign in with the admin email used in `JWT_SECRET` flow
   - For each platform, click "Add channel" and authorize

7. **Set our app to call Postiz:**
   ```
   POSTIZ_URL=https://postiz.hopeofglory.internal
   POSTIZ_API_KEY=<the API_TOKEN you generated>
   ```

8. **Test from `/admin/sermons/{id}`:** Generate a sermon, then trigger distribution.

## Why self-host (not cloud Postiz)

- Counts as in-house: lives on our Railway, no external SaaS dependency
- Zero monthly SaaS fee
- Full control — fork it if a connector needs to change
- Same connector code as cloud Postiz, just hosted by us
- Saves ~3 weeks of writing 10+ platform integrations from scratch

## Operational tips

- Run the Postiz worker as a separate Railway service from the API so a worker hang doesn't
  break the API. Both use the same image, different start commands.
- The Postiz Postgres should be SEPARATE from the Hope of Glory Postgres. Different
  databases, different lifecycle.
- Back up the Postiz database weekly — losing it means re-authorizing every platform.
- When TikTok Content Posting API approval lands, add the credentials and reconnect
  the TikTok integration in the Postiz UI.

## X (Twitter) — built, paused

The X integration code is in place but the platform is paused (see `FEATURE_X=false` in
`.env.example`). X requires the $200/month Basic tier for posting. Once donations cover
that cost, set `FEATURE_X=true` and add credentials in Postiz.
