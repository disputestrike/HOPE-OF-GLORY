# Disaster Recovery — Hope of Glory Ministry

This is the playbook for restoring the ministry after a database loss event.
It is written to be followed at 3 a.m. by a person who did not write the code.

If you are panicked, **read each step out loud before doing it**. Do not skip.

---

## RTO and RPO targets

- **RTO** (recovery time objective) — **4 hours**. From the moment we know
  the DB is gone to the moment users can pray, donate, and ask Hope again.
- **RPO** (recovery point objective) — **24 hours**. We accept the loss of
  up to one day of writes if the last nightly backup was clean.

If a single crisis event is missing from the restored DB, that is a pastoral
event, not just an ops event. See **Notify** below.

---

## 1. What this protects

A Postgres backup restores everything in the `hope_of_glory` database:

- Sermons, sermon translations, content calendar
- Prayer requests + risk classifications
- Call sessions, call turns (Hope Line conversation transcripts)
- **Crisis events** — sacred. Every imminent / active / watch row.
- Donations + donation receipts
- Chat messages (Ask Hope / Scroll / Apologetics)
- Contact submissions
- New believer / hurting heart / journey email subscribers
- Admin actions audit log
- Job run history

## 2. What this does NOT protect

Do not assume the backup brings these back. They live elsewhere:

- **Redis** — volatile cache + rate-limit counters. Cold restart is fine.
- **S3 assets** — sermon audio, generated images. Already replicated by
  the S3 provider. If S3 is gone, this runbook is the wrong runbook.
- **Code** — lives in the Git repo. Redeploy from `main`.
- **Secrets / env vars** — Railway holds them. If Railway is gone, you need
  the offline 1Password vault.
- **Email queue** — Resend holds in-flight messages.

---

## 3. Detection — how do we know we have a problem?

Any one of these is enough to declare an incident:

- Sentry error rate spikes above the daily baseline
- `/api/health` returns 5xx for more than 2 minutes
- The daily cron `/api/cron/daily` is missing for the day (check Railway logs)
- Admin `/admin/release` shows the Database connectivity gate as red
- Users report inability to submit prayers or that prior submissions vanished
- Railway shows the Postgres service as failed / degraded

Declare the incident in the founder's pastoral team channel before touching
anything. State the time, what surface is broken, and what you intend to do.

---

## 4. Recovery from the latest S3 backup

### 4.1 Find the latest backup

Backups live at:

```
s3://<S3_BUCKET>/backups/postgres/YYYY-MM-DD/db-<timestamp>.dump
```

List the most recent day:

```bash
aws s3 ls "s3://$S3_BUCKET/backups/postgres/" --recursive | tail -20
```

(or `rclone ls` if you use Cloudflare R2)

Pick the newest `.dump` you trust. If the most recent one was written during
the incident window, walk back one day.

### 4.2 Download the dump

```bash
aws s3 cp "s3://$S3_BUCKET/backups/postgres/2024-12-15/db-2024-12-15T02-00-00-000Z.dump" /tmp/restore.dump
```

It is server-side encrypted with AES256 at rest. The download decrypts
transparently — you do not need a key.

### 4.3 Provision a fresh Postgres on Railway

1. Open the Railway project "Hope of Glory".
2. Create a new Postgres service. Do **not** restore over the broken one.
3. Wait for `DATABASE_URL` to populate. Copy it.
4. From the `hope-of-glory-canonical` repo on a worker box:
   ```bash
   pnpm db:migrate
   ```
   This installs the `uuid-ossp`, `pgcrypto`, and `vector` extensions and runs
   every migration. Confirm with `pnpm preflight` — the three extension rows
   must say OK.

### 4.4 Restore the dump

```bash
pg_restore \
  --no-owner \
  --no-acl \
  --dbname="$NEW_DATABASE_URL" \
  /tmp/restore.dump
```

- `--no-owner` and `--no-acl` are required because the dump was taken with
  the same flags. Roles do not transfer.
- Custom format (this is what we use) restores **forward** into a newer PG
  major version. It does not restore backward.

Expect ~30 seconds per 100 MB of dump on a Railway hobby box.

### 4.5 Point the app at the new database

1. Update `DATABASE_URL` in the Railway web service to the new value.
2. Redeploy the web service. Watch Sentry. Watch `/api/health`.
3. Update `DATABASE_URL` everywhere else that holds it: worker, stream app,
   voice app. Each service has its own env panel.

### 4.6 Smoke test

In order:

```bash
pnpm preflight                 # extensions installed, env vars set
pnpm smoke:routes              # public routes return 200
```

Then open in a browser:

- `/` — homepage renders
- `/admin/release` — green across the board
- `/admin/calls` — recent call sessions present (if any were in the backup)
- `/admin/prayers` — recent prayer requests present
- `/api/health` — returns ok with the current commit SHA

---

## 5. Recovery from point-in-time (Railway PITR)

If Railway's Postgres point-in-time recovery is enabled on the plan, and the
last good moment is **within the 24h backup window**, prefer PITR:

- Smaller RPO (minutes, not hours)
- No `pg_restore` step — Railway hot-swaps the data directory
- No re-ingestion of large tables

Use the S3 backup when:

- PITR target is older than Railway's retention window
- The Railway region itself is degraded
- You need to restore to a **different** project (e.g. for forensic review)
- The PITR target slot itself is corrupted

PITR is plan-dependent. As of go-live we are not relying on it.

---

## 6. Crisis transcripts — SACRED

`call_turns` and `crisis_events` carry the words of people in extreme distress.

- **Never delete** them during recovery — even rows that look duplicate.
- If you must merge two restored copies of a session, keep the **older**
  copy intact and append the newer turns. Do not overwrite.
- If a single `crisis_events` row from the gap window is lost forever:
  - Note the missing time window in the incident report.
  - Tell the founder by phone, not email.
  - Open a `human_handoff` task with `priority = 1` and
    `reason = "Lost crisis event during incident YYYY-MM-DD"`.

The founder will decide whether to attempt to re-contact known users from that
window. This is a pastoral decision, not an engineering one.

---

## 7. PII reset

If the backup is **older than 30 days**, the `caller_hash` values in
`call_sessions` and the `phone_hash` values in `prayer_requests` may have
been generated with a `PHONE_HASH_PEPPER` that has since rotated.

Steps:

1. Confirm the **current** `PHONE_HASH_PEPPER` matches the one that produced
   the hashes in the restored data. If yes, stop here.
2. If the pepper rotated, set `PHONE_HASH_PEPPER_PREV` to the value that
   originally produced the hashes (so existing lookups still match).
3. If the previous pepper is also lost: hashes are one-way. You cannot
   re-derive them. Treat the existing hashes as opaque historical labels and
   start producing new hashes with the current pepper going forward.

---

## 8. Notify

You **must** tell users about any incident that affects their submitted
content. Pastoral first, transactional second.

- Any **prayer request lost** → email the submitter (if they gave one)
  within 24 hours with a one-paragraph apology and an invitation to resubmit.
- Any **crisis event lost** → see Section 6.
- Any **donation lost** → email + phone the donor within 24 hours. Refunds
  do not apply (the gift cleared PayPal), but acknowledgement letters must
  be reissued.
- General DB downtime under 4 hours → public banner on `/` for the duration
  + a brief note on social. No individual emails.

Drafts for each notification live in `docs/runbook/notify-templates/` (TODO:
add as part of first incident postmortem).

---

## 9. After recovery

Within 48 hours of incident close:

1. Write a postmortem in `docs/runbook/postmortems/YYYY-MM-DD-<short>.md`.
   Blameless. Timeline first, contributing factors second, fixes third.
2. Add any new detection step to Section 3 above.
3. Schedule the **next** quarterly DR drill explicitly — do not let it slip.
4. If the backup itself was the problem, file a P0 in the punchlist.

---

## Quick reference card

```
Bucket:        s3://$S3_BUCKET/backups/postgres/
Format:        pg_dump custom, AES256 SSE
Restore:       pg_restore --no-owner --no-acl -d "$URL" file.dump
Cleanup:       7d daily / 4w Sunday / 12m first-of-month / yearly Jan-1
Cron:          /api/cron/weekly  (Sun 02:00 UTC) + daily fire-and-forget kick
Logs:          job_runs table, job_name = 'db_backup' or 'backup_cleanup'
Smoke:         pnpm preflight && pnpm smoke:routes
RTO:           4 hours
RPO:           24 hours
```
