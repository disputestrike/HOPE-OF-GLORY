# Hope of Glory Ministry — Database Architecture

This document explains the production-ready PostgreSQL 16 schema for Hope of
Glory Ministry. The schema is defined in `schema.ts` (Drizzle ORM) and is
designed for an AI-native Christian media ministry hosted on Railway.

---

## 1. Platform

- **Database:** PostgreSQL 16 (Railway-managed).
- **Extensions:** `uuid-ossp`, `pgcrypto`, `vector` (pgvector >= 0.7).
- **ORM:** Drizzle ORM (TypeScript).
- **Primary key strategy:** UUID v4 via `uuid_generate_v4()`.
- **Timestamps:** Always `timestamp with time zone`, default `now()`.
- **JSON:** Always `jsonb`, never `json`.
- **Money:** `numeric(12, 2)` (`cost_estimate` widened to `(14, 6)`).
- **Currency:** ISO-4217 3-letter codes, default `USD`.

### Vector dimension decision

The `embeddings.vector` column is `vector(1536)`.

| Option | Dim  | Model                              | Cost / 1M tokens | Quality |
| ------ | ---- | ---------------------------------- | ---------------- | ------- |
| **A**  | 1536 | OpenAI `text-embedding-3-small`    | ~$0.02           | Strong  |
| A.1    | 1536 | OpenAI `text-embedding-ada-002`    | ~$0.10           | Legacy  |
| B      | 3072 | OpenAI `text-embedding-3-large`    | ~$0.13           | Best    |

**Decision: launch with 1536.** It gives the best quality-per-dollar at
launch. The embeddings table includes `embedding_model` in the unique index
`(chunk_id, embedding_model)`, so a future upgrade can add 3072-dim vectors in
a sibling column or a sibling table without dropping the existing index. The
recommended upgrade path is:

1. Add a new table `embeddings_large` with `vector(3072)`, dual-write.
2. Backfill historical chunks asynchronously.
3. Cut retrieval reads over once recall metrics confirm parity.
4. Retire the legacy `embeddings` table after a 30-day soak.

This avoids an in-place `ALTER COLUMN TYPE` on a column with an ANN index
(which would require dropping and rebuilding the index against billions of
rows).

---

## 2. Domain map

The schema is organized into eight bounded contexts:

```
 Users & Auth ──┐
                │
 Doctrine &     │      ┌── Interactions (chat, prayer, questions)
 Sources  ──────┼──────┤
                │      ├── Voice / Phone (call_sessions, call_turns)
 Content        │      │
 (sermons)  ────┤      └── Live (live_events, live_questions)
                │
 Distribution   │
 (social, email)│
                │
 Operations  ───┘  (agent_runs, providers, moderation, handoff, audit)
```

---

## 3. Table-by-table reference

### 3.1 Users & Auth

| Table                  | Purpose                                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `users`                | Internal staff and registered visitors. `role` controls RBAC; `status` supports invited/suspended lifecycles.      |
| `oauth_accounts`       | External-provider identities linked to a user. Tokens stored encrypted-at-rest (pgcrypto in app layer, not raw).  |
| `sessions`             | First-party session tokens. We store a SHA-256 fingerprint, never the raw token. Expired rows are GC'd nightly.  |
| `email_subscribers`    | Opt-in mailing list. `source_page` and `consent_text` preserve the consent moment for GDPR/CAN-SPAM compliance. |
| `contact_submissions`  | "Contact us" form posts. `handled_by` links to the staff member who closed it.                                    |

**Indexes**: unique on `email`, status indexes on most lookup columns.

### 3.2 Doctrine & Sources

| Table                | Purpose                                                                                                                      |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `doctrine_documents` | Versioned position papers (`(slug, version)` unique). Drives the doctrinal guardrails enforced on every agent_run.           |
| `sources`            | Bibliographic record of every text we ingest (Bible translations, creeds, commentaries, sermons). License-tracked.            |
| `source_chunks`      | RAG-sized chunks of each source. `book/chapter/verse_*` columns let us join scripture chunks directly to passages.            |
| `embeddings`         | One vector per `(chunk, embedding_model)`. Backs all semantic retrieval.                                                       |

**Vector index (migration SQL, not Drizzle):**

```sql
CREATE INDEX embeddings_vector_hnsw_ix
  ON embeddings
  USING hnsw (vector vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);
```

- **HNSW over IVFFlat** for production because HNSW maintains recall as the
  table grows without periodic re-clustering. IVFFlat is acceptable at
  bootstrap (<100k rows) and has lower build cost; we may start with IVFFlat
  during the initial backfill and swap to HNSW once the corpus stabilizes.
- Cosine distance (`<=>`) is the default operator for retrieval.

### 3.3 Content — Sermons & Scripture

| Table                | Purpose                                                                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `sermon_series`      | Optional grouping for sermon arcs.                                                                                                          |
| `sermons`            | The canonical sermon record. `theology_score`, `citation_score`, `risk_score` are pre-publication safety scores assigned by the model stack. |
| `sermon_assets`      | Generated media (audio, video, image, transcript). Sized to support multi-format delivery.                                                  |
| `scripture_passages` | Materialized scripture lookups keyed by `(translation, book, chapter, verse_start, verse_end)`.                                            |

### 3.4 Interactions

| Table             | Purpose                                                                                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `chat_sessions`   | A coherent conversation across web/SMS/embed/etc. `anon_key` lets anonymous visitors persist a thread without an account.                                  |
| `chat_messages`   | Turn-by-turn record with `citations_json`, agent, provider, model, and latency. Used both for runtime context and for offline review.                       |
| `prayer_requests` | Pastoral submissions. `privacy_level` controls who can ever see the content; `risk_level` triggers escalation flows. Highly sensitive — see retention below. |
| `questions`       | Q&A library backing the public "Ask" surface. `published=true` rows are renderable to visitors.                                                             |

### 3.5 Voice / Phone

| Table            | Purpose                                                                                                                                                                                                                          |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `call_sessions`  | One row per phone call. **Stores `caller_hash` (SHA-256 + pepper of the E.164 phone), never the raw number.** Recording URL is captured but `recording_deleted_at` is set when the audio is purged from object storage.       |
| `call_turns`     | Speech-to-text turn record. `stt_confidence` lets us drop low-confidence rows from later RAG.                                                                                                                                    |
| `crisis_events`  | Self-harm / safety triggers across chat and phone. The most sensitive table in the system — reviewed by a designated pastoral lead.                                                                                              |

#### Caller hash scheme

```text
caller_hash = lowercase_hex(
  sha256(
    e164_normalize(phone_e164) || ':' || PHONE_HASH_PEPPER
  )
)
```

- **Input:** E.164-normalized phone (e.g. `+15551234567`).
- **Pepper:** 32-byte random secret stored in the secrets manager
  (`PHONE_HASH_PEPPER`). Rotation requires a planned re-hash window — we
  retain the old pepper for 30 days as `PHONE_HASH_PEPPER_PREV` so look-ups
  during rotation can fall back.
- **Output:** 64-character lowercase hex (matches column length 64).
- **Properties:** Deterministic (same caller produces same hash), one-way,
  unsearchable by humans, but still allows the system to recognize a repeat
  caller across sessions without ever storing the number.
- **Recordings:** Stored encrypted in object storage; the DB only holds the
  URL. Auto-delete policy is enforced by a daily `job_runs` worker.

### 3.6 Live

| Table              | Purpose                                                                                |
| ------------------ | -------------------------------------------------------------------------------------- |
| `live_events`      | Scheduled / live / archived broadcasts across YouTube, Facebook, Twitch, etc.          |
| `live_questions`   | Viewer questions ingested from the live chat overlays.                                  |
| `live_transcripts` | Streamed STT segments. Used for clipping, recap generation, and post-event indexing.  |

### 3.7 Distribution

| Table                | Purpose                                                                                                                                                  |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `social_posts`       | Outbound posts on every platform. `postiz_id` is our scheduling-service handle; `engagement_json` is hydrated periodically by a job.                    |
| `email_campaigns`    | Outbound newsletters. Stores aggregate stats inline (open/click/bounce/unsubscribe) to avoid round-tripping to the ESP for dashboards.                  |
| `social_engagements` | Inbound mentions, comments, replies. `sentiment` and `suggested_reply` feed the moderation queue. Unique on `(platform, external_engagement_id)`.       |

### 3.8 Operations

| Table              | Purpose                                                                                                                                              |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `donations`        | Recorded for every gift. Unique on `(provider, provider_txn_id)` to make webhook delivery idempotent.                                                |
| `agent_runs`       | One row per LLM invocation, with risk/theology/citation scores, token + latency + cost telemetry, and review state.                                  |
| `provider_keys`    | Logical key records (label, environment, service class, status). **Never holds the secret.** Tracks rotation, cooldowns, and per-key budget caps.   |
| `provider_usage`   | Time-bucketed rollup per key. Backs the budget guardrails and the cost dashboard.                                                                    |
| `moderation_flags` | Polymorphic flags across any content table via `(source_type, source_id)`.                                                                            |
| `corrections`      | User- or staff-submitted corrections to AI-generated content. Tracks the applied diff and the reviewer.                                              |
| `job_runs`         | Background job ledger. Tracks attempts, payload, error, correlation id.                                                                              |
| `human_handoff`    | Cross-domain escalation queue (chat, call, prayer, contact, social, crisis). `priority` smallint drives the queue ordering.                          |
| `admin_actions`    | Append-only audit log of staff actions on sensitive tables.                                                                                          |

---

## 4. Indexing strategy

General rules:
- Every FK has a supporting index on the child column for `JOIN` and cascade.
- Every status enum is indexed when the queue/dashboard reads by status.
- Every temporal field used for filtering or window queries is indexed.
- Composite indexes (`source_type, source_id`) cover polymorphic lookups.

Specifically:
- **`embeddings.vector`** — HNSW with `vector_cosine_ops` (see §3.2).
- **`source_chunks(book, chapter)`** — supports scripture-driven RAG.
- **`chat_messages(session_id, created_at)`** — replays a thread cheaply
  (`session_ix` + `created_ix`).
- **`call_sessions.caller_hash`** — supports "have we spoken before?" lookups
  without exposing PII.
- **`donations(provider, provider_txn_id)`** unique — idempotent webhooks.
- **`social_engagements(platform, external_engagement_id)`** unique —
  idempotent inbound webhooks.
- **`provider_usage(provider_key_id, bucket_start, bucket_granularity)`**
  unique — one row per bucket per key.

---

## 5. Retention policy (PII-heavy tables)

We minimize PII storage. The following rules are enforced by daily
`job_runs.job_name = 'pii_retention'`:

| Table                  | Retain raw content | Retain row | Notes                                                                                                                                                   |
| ---------------------- | ------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `prayer_requests`      | **90 days**        | indefinite | After 90 days, `content` and any contact fields are nulled out. Aggregate fields (risk_level, follow_up_state, created_at) remain for analytics.       |
| `call_sessions`        | 30 days (audio)    | indefinite | `recording_url` is set to NULL and `recording_deleted_at` stamped. Hash and risk metadata retained for safety analytics and crisis follow-up.           |
| `call_turns`           | 90 days (text)     | indefinite | `text` and `audio_url` purged after 90 days. STT confidence + latency retained.                                                                          |
| `crisis_events`        | **2 years**        | 7 years    | Higher retention because of safeguarding obligations. `notes` are reviewed and may be redacted by the pastoral lead.                                    |
| `contact_submissions`  | 18 months          | 18 months  | Resolved + 18 months → hard delete. Open rows are never auto-deleted.                                                                                   |
| `chat_messages`        | 90 days            | 1 year     | Content nulled at 90 days; row deleted at 1 year unless flagged for safety review.                                                                       |
| `chat_sessions`        | 1 year             | 1 year     | Cascade with `chat_messages`.                                                                                                                            |
| `email_subscribers`    | until unsubscribe + 30 days | indefinite (hash) | Unsubscribed rows have `email` replaced with a SHA-256 hash to honor suppression lists without retaining PII.                                  |
| `donations`            | 7 years            | 7 years    | IRS / state requirements. After 7 years, donor identity fields are redacted; aggregates remain.                                                          |
| `oauth_accounts`       | until revoked      | until user delete | Tokens decrypt only in app memory; raw tokens never appear in logs.                                                                                |
| `sessions`             | until expiry       | 30 days post-expiry | Expired sessions are GC'd nightly.                                                                                                                |
| `admin_actions`        | indefinite         | indefinite | Audit log; never purged.                                                                                                                                 |
| `agent_runs`           | 1 year             | 1 year     | High-volume telemetry. Sensitive `input_text`/`output_text` columns are nulled at 90 days unless `requires_review=true`.                                |
| `job_runs`             | 90 days            | 90 days    | Operational; aggregate metrics rolled up before delete.                                                                                                  |

Hard-delete requests (right-to-be-forgotten) take precedence over the
schedule and are executed via the `admin_actions` audit trail.

---

## 6. Encryption & secret handling

- All OAuth tokens (`oauth_accounts.*_token_encrypted`) are encrypted at the
  application layer with libsodium secret-box; the key is provisioned via
  the secret manager and rotated quarterly.
- `provider_keys` never holds the secret itself. It carries `key_ref`
  (pointer to the secret manager entry) and `key_fingerprint` (last-4 + a
  SHA-256 prefix for audit logs).
- IP addresses captured on submissions (`contact_submissions.ip_hash`,
  `chat_sessions.ip_hash`, `admin_actions.ip_hash`) are stored only as
  SHA-256 with a daily-rotating pepper, to support abuse-pattern detection
  without retaining raw addresses.
- `phone` fields are stored in the clear only on `email_subscribers` and
  `contact_submissions` where the user explicitly provided them for
  contact; phones tied to phone calls are stored only as `caller_hash`.

---

## 7. Polymorphic associations

`moderation_flags`, `corrections`, `human_handoff`, and `admin_actions` all
use `(source_type, source_id)` rather than per-target FKs. This is a
deliberate trade-off:

- **Pro:** A single queue and worker for every flag/correction/handoff.
- **Pro:** New content types don't require schema migrations.
- **Con:** No FK integrity at the DB level — enforced by app code and a
  weekly `job_runs.job_name = 'polymorphic_integrity'` audit.

---

## 8. Crisis & safety guarantees

- Every chat session and call session carries a `risk_level`.
- Every safety-trigger creates a `crisis_events` row immediately, with a
  pointer to the originating session.
- `human_handoff` rows for `source_type = 'crisis_event'` are always
  `priority = 0` (highest) and bypass normal queue ordering.
- The pastoral lead reviews all `crisis_events` weekly and stamps
  `reviewed_by` / `reviewed_at`.

---

## 9. Foreign-key cascade matrix

| Parent                 | Child                          | onDelete  | Rationale                                                            |
| ---------------------- | ------------------------------ | --------- | -------------------------------------------------------------------- |
| `users`                | `oauth_accounts`, `sessions`   | cascade   | Account closure removes identity material.                            |
| `users`                | most `*_by` audit FKs          | set null  | We keep the row but drop the personal link.                          |
| `sources`              | `source_chunks`                | cascade   | Re-ingesting a source means chunks go with it.                       |
| `source_chunks`        | `embeddings`                   | cascade   | Embeddings only make sense alongside their chunks.                   |
| `sermons`              | `sermon_assets`                | cascade   | Retracted sermon → assets gone.                                       |
| `chat_sessions`        | `chat_messages`                | cascade   | Session purge removes its messages.                                  |
| `call_sessions`        | `call_turns`                   | cascade   | Same.                                                                 |
| `live_events`          | `live_questions`, `live_transcripts` | cascade | Same.                                                                 |
| `provider_keys`        | `provider_usage`               | cascade   | Usage rollups belong to a key.                                       |
| `crisis_events`        | session FKs (`set null`)       | set null  | Crisis events survive even if a session is purged for retention.     |

---

## 10. Operational notes

- **Migrations** are run via `drizzle-kit` against a Railway environment.
  Production migrations must be reviewable as PRs and require a green CI.
- **Backups**: Railway PITR + a nightly logical dump shipped to S3
  Glacier (90-day retention).
- **Observability**: `agent_runs`, `job_runs`, and `provider_usage` form the
  basis of the cost + reliability dashboards.
- **Tenant model**: Single tenant. If multi-tenancy is needed later, add a
  `ministry_id` UUID column to every primary table and a row-level security
  policy. The current schema avoids embedding this prematurely.
