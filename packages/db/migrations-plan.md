# Hope of Glory Ministry — Migrations & Seed Plan

This document describes the ordered Drizzle migrations that create the
schema from scratch and the seed-data plan that follows.

Migrations are generated with `drizzle-kit generate` and applied with
`drizzle-kit migrate` (or the equivalent custom runner) against the Railway
PostgreSQL 16 instance. Each numbered step below corresponds to one
migration file. Files are prefixed with `NNNN_` and a short slug, e.g.
`0001_extensions_and_enums.sql`.

---

## 1. Migration order

### 0001 — `extensions_and_enums`

Pre-flight: install the Postgres extensions Drizzle cannot create on its own.

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";
```

Then create every `pgEnum` declared in `schema.ts`. Enums are created first
because almost every later table depends on at least one of them.

### 0002 — `users_and_auth`

Tables: `users`, `oauth_accounts`, `sessions`, `email_subscribers`,
`contact_submissions`.

Notes:
- `users.email` unique.
- `oauth_accounts(provider, provider_account_id)` unique.
- `sessions.session_token_hash` unique.
- `email_subscribers.email` unique.

### 0003 — `doctrine_and_sources`

Tables: `doctrine_documents`, `sources`, `source_chunks`, `embeddings`.

Notes:
- `doctrine_documents(slug, version)` unique.
- `source_chunks(source_id, chunk_index)` unique.
- `embeddings(chunk_id, embedding_model)` unique.
- `embeddings.vector` is `vector(1536)`.

### 0004 — `embeddings_ann_index`

Separate migration so it can be re-run independently if the index needs to
be rebuilt.

```sql
-- Start with IVFFlat for fast initial backfill (<100k rows).
CREATE INDEX IF NOT EXISTS embeddings_vector_ivfflat_ix
  ON embeddings
  USING ivfflat (vector vector_cosine_ops)
  WITH (lists = 100);

-- Once the corpus stabilizes (>500k rows), drop the above and switch to HNSW:
--
-- DROP INDEX embeddings_vector_ivfflat_ix;
-- CREATE INDEX embeddings_vector_hnsw_ix
--   ON embeddings
--   USING hnsw (vector vector_cosine_ops)
--   WITH (m = 16, ef_construction = 64);
```

The HNSW switch is its own migration when triggered.

### 0005 — `content_sermons_scripture`

Tables: `sermon_series`, `sermons`, `sermon_assets`, `scripture_passages`.

### 0006 — `interactions`

Tables: `chat_sessions`, `chat_messages`, `prayer_requests`, `questions`.

### 0007 — `voice_phone`

Tables: `call_sessions`, `call_turns`, `crisis_events`.

`crisis_events` carries FKs to both `call_sessions` and `chat_sessions`, so
this migration runs after `interactions`.

### 0008 — `live`

Tables: `live_events`, `live_questions`, `live_transcripts`.

### 0009 — `distribution`

Tables: `social_posts`, `email_campaigns`, `social_engagements`.

### 0010 — `operations_providers`

Tables: `provider_keys`, `provider_usage`.

These are referenced by no other table at this point, but they precede
`agent_runs` for readability and to allow seed data ordering.

### 0011 — `operations_runtime`

Tables: `donations`, `agent_runs`, `moderation_flags`, `corrections`,
`job_runs`, `human_handoff`, `admin_actions`.

### 0012 — `seed_admin_and_doctrine`

Seed data (idempotent — `ON CONFLICT DO NOTHING`):

- One placeholder admin `users` row.
- Default `doctrine_documents` slug rows (body = empty, backfilled by the
  doctrine ingester from `docs/doctrine/`).
- Default `provider_keys` label rows.
- Baseline `agent_runs.prompt_version` marker (a sentinel row used by
  prompt-version queries even before the first real agent run).

See §3 for exact seed payloads.

### 0013 — `retention_jobs`

Inserts initial scheduling rows (not schema, but `job_runs` template rows)
for the retention sweepers:

- `pii_retention` (daily)
- `recording_purge` (daily)
- `session_gc` (hourly)
- `polymorphic_integrity` (weekly)

These are application-managed schedules; the migration just inserts the
canonical row so the worker has a stable id to update.

---

## 2. Rollback strategy

Every migration ships a paired `down.sql`. Production rollbacks are
exceptional and require a documented incident. Standard policy:

- Tables: `DROP TABLE IF EXISTS ... CASCADE;` only on `down.sql` for
  migrations not yet in production. For production-applied migrations,
  prefer a forward-fix migration over a rollback.
- Enums: `DROP TYPE` only after all dependent tables are gone.
- Extensions are never dropped on rollback.

---

## 3. Seed data

All seeds are written as `INSERT ... ON CONFLICT DO NOTHING` so they are
idempotent across redeploys.

### 3.1 Placeholder admin user

```sql
INSERT INTO users (id, email, name, role, status)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@hopeofglory.local',
  'Hope of Glory Admin (placeholder)',
  'admin',
  'invited'
)
ON CONFLICT (email) DO NOTHING;
```

This row exists so other seed rows can FK to a real admin id during
bootstrap. The real admin replaces this on first onboarding via the
`admin_actions` audit trail.

### 3.2 Doctrine documents (slugs only, body backfilled later)

The doctrine ingester reads `docs/doctrine/<slug>.md` and updates the body +
checksum + version. The seed simply creates the slug rows so foreign-key
intent is stable from day one.

```sql
INSERT INTO doctrine_documents (slug, version, status, title, body, checksum, author_id)
VALUES
  ('statement-of-faith',         1, 'draft', 'Statement of Faith',           '', '', '00000000-0000-0000-0000-000000000001'),
  ('the-trinity',                1, 'draft', 'The Trinity',                  '', '', '00000000-0000-0000-0000-000000000001'),
  ('person-and-work-of-christ',  1, 'draft', 'The Person and Work of Christ','', '', '00000000-0000-0000-0000-000000000001'),
  ('authority-of-scripture',     1, 'draft', 'The Authority of Scripture',   '', '', '00000000-0000-0000-0000-000000000001'),
  ('gospel-and-salvation',       1, 'draft', 'The Gospel and Salvation',     '', '', '00000000-0000-0000-0000-000000000001'),
  ('the-holy-spirit',            1, 'draft', 'The Holy Spirit',              '', '', '00000000-0000-0000-0000-000000000001'),
  ('the-church',                 1, 'draft', 'The Church',                   '', '', '00000000-0000-0000-0000-000000000001'),
  ('eschatology',                1, 'draft', 'Last Things (Eschatology)',    '', '', '00000000-0000-0000-0000-000000000001'),
  ('marriage-and-sexuality',     1, 'draft', 'Marriage and Sexuality',       '', '', '00000000-0000-0000-0000-000000000001'),
  ('sanctity-of-life',           1, 'draft', 'Sanctity of Life',             '', '', '00000000-0000-0000-0000-000000000001'),
  ('pastoral-care-and-crisis',   1, 'draft', 'Pastoral Care and Crisis',     '', '', '00000000-0000-0000-0000-000000000001'),
  ('ai-and-ministry-ethics',     1, 'draft', 'AI and Ministry Ethics',       '', '', '00000000-0000-0000-0000-000000000001')
ON CONFLICT (slug, version) DO NOTHING;
```

The ingester is responsible for promoting `draft → review → approved` and
recomputing `checksum` (SHA-256 of the canonical body).

### 3.3 Provider key label rows

These rows reserve the labels used at runtime. The actual secret lives in
the secret manager and is referenced by `key_ref`. `keyFingerprint` is
populated only after the first real rotation.

```sql
INSERT INTO provider_keys (provider, key_label, environment, service_class, status, notes)
VALUES
  ('cerebras', 'cerebras-sermons',    'production', 'sermons',    'active', 'Sermon generation (long-form, batchy).'),
  ('cerebras', 'cerebras-chat',       'production', 'chat',       'active', 'Web chat + Q&A.'),
  ('cerebras', 'cerebras-live',       'production', 'live',       'active', 'Live event host agent.'),
  ('cerebras', 'cerebras-phone',      'production', 'phone',      'active', 'Phone-line agent.'),
  ('cerebras', 'cerebras-background', 'production', 'background', 'active', 'Background workers, social drafting, summaries.')
ON CONFLICT (key_label, environment) DO NOTHING;
```

Equivalent rows for `development`, `preview`, and `staging` environments are
seeded in a follow-up data step gated on `NODE_ENV`.

### 3.4 Baseline agent_runs prompt_version marker

A sentinel row so `SELECT MAX(prompt_version) FROM agent_runs` always
returns a value, and so dashboards have a stable "v0" baseline.

```sql
INSERT INTO agent_runs (
  id,
  agent_name,
  input_hash,
  prompt_version,
  provider,
  model,
  status,
  requires_review,
  metadata
)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'system.seed',
  'seed:baseline:v0',
  'v0.0.0-baseline',
  'internal',
  'none',
  'succeeded',
  false,
  '{"note":"baseline marker row inserted by 0012_seed_admin_and_doctrine"}'::jsonb
)
ON CONFLICT (id) DO NOTHING;
```

### 3.5 Retention job rows

```sql
INSERT INTO job_runs (id, job_name, queue, status, scheduled_for, payload)
VALUES
  ('00000000-0000-0000-0000-000000000010', 'pii_retention',         'retention', 'queued', now() + interval '1 day', '{"interval":"daily"}'::jsonb),
  ('00000000-0000-0000-0000-000000000011', 'recording_purge',       'retention', 'queued', now() + interval '1 day', '{"interval":"daily"}'::jsonb),
  ('00000000-0000-0000-0000-000000000012', 'session_gc',            'retention', 'queued', now() + interval '1 hour','{"interval":"hourly"}'::jsonb),
  ('00000000-0000-0000-0000-000000000013', 'polymorphic_integrity', 'integrity', 'queued', now() + interval '7 days','{"interval":"weekly"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
```

---

## 4. CI / CD flow

1. Developer runs `pnpm drizzle:generate` after editing `schema.ts`.
2. The generated SQL file is committed in the PR.
3. CI runs `drizzle-kit check` and applies the migration to an ephemeral
   Railway preview branch.
4. Reviewers see the SQL diff alongside the TypeScript diff.
5. On merge, the production deploy pipeline runs `drizzle-kit migrate`
   before booting any app container.
6. Seed migrations (`0012`, `0013`, and any future seeds) are idempotent
   and re-run on every deploy.

---

## 5. Pre-flight checklist before first production migration

- [ ] Railway Postgres 16 with at least 4 GB RAM provisioned (HNSW build is
      memory-hungry).
- [ ] `pgvector` extension version >= 0.7 (HNSW support).
- [ ] `PHONE_HASH_PEPPER` and `IP_HASH_PEPPER` set in production secrets.
- [ ] `OAUTH_TOKEN_ENCRYPTION_KEY` set in production secrets.
- [ ] Object storage bucket for call recordings and sermon media provisioned
      with a 30-day lifecycle rule on the `recordings/` prefix.
- [ ] Backup policy enabled (PITR + nightly S3 Glacier dump).
- [ ] Initial admin email known and added to `users` after seed.

---

## 6. Post-migration smoke tests

After every production migration, run:

```sql
-- Enums present
SELECT typname FROM pg_type WHERE typtype = 'e' ORDER BY typname;

-- Vector index present
SELECT indexname FROM pg_indexes WHERE tablename = 'embeddings';

-- Seed admin present
SELECT id, role, status FROM users WHERE email = 'admin@hopeofglory.local';

-- Doctrine slugs present
SELECT slug, version, status FROM doctrine_documents ORDER BY slug;

-- Provider keys present
SELECT provider, key_label, environment, status FROM provider_keys
ORDER BY environment, key_label;

-- Baseline agent_runs marker present
SELECT prompt_version FROM agent_runs WHERE agent_name = 'system.seed';
```

Each check is wired into the deploy pipeline's post-migrate health probe.
