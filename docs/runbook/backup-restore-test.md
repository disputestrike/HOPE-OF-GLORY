# Quarterly Backup Restore Drill

The first DR test is the worst time to discover the backups are broken.
Run this drill **once per quarter**. Mark it on the founder's calendar.

Expected duration: 60-90 minutes including writeup.

---

## When

- Q1: January, second Tuesday
- Q2: April, second Tuesday
- Q3: July, second Tuesday
- Q4: October, second Tuesday

If you miss a quarter, do it the next available Tuesday. Never skip two in
a row.

---

## What "passing" means

The drill passes if **all** of these are true:

1. The latest backup in S3 downloads cleanly (no truncation, correct AES256
   server-side encryption header on the object).
2. `pg_restore` runs without warnings against a fresh, empty Postgres.
3. The restored DB has:
   - `crisis_events` row count within 1% of production
   - `prayer_requests` row count within 1% of production
   - `call_turns` row count within 1% of production
   - All three required extensions installed (`uuid-ossp`, `pgcrypto`,
     `vector`)
4. `pnpm preflight` against the restored DB shows no failures.
5. A simple readback query returns the most recent sermon by `published_at`.

If any check fails, file a P0 the same day. Do not close the drill record
until the underlying issue is fixed.

---

## The drill

### 0. Pre-flight (5 min)

- Confirm `aws` or `rclone` is installed on the drill box.
- Confirm a throwaway Postgres is available. Recommended: a Railway DB in
  a separate "DR-Drill" project so production is untouchable.
- Confirm you have `DATABASE_URL` for the drill DB.

### 1. List backups (5 min)

```bash
aws s3 ls "s3://$S3_BUCKET/backups/postgres/" --recursive --human-readable | tail -20
```

Note the most recent key. Note its size — if it's wildly smaller than
yesterday's, stop and investigate before continuing.

### 2. Download the dump (5-15 min depending on size)

```bash
aws s3 cp "s3://$S3_BUCKET/backups/postgres/<key>" /tmp/drill.dump
```

Verify:

```bash
ls -la /tmp/drill.dump
file /tmp/drill.dump
# Expect: "PostgreSQL custom database dump"
```

### 3. Verify encryption-at-rest (1 min)

```bash
aws s3api head-object \
  --bucket "$S3_BUCKET" \
  --key "<key>" \
  --query 'ServerSideEncryption'
```

Expect `"AES256"`. If it returns null or something else, the backup script's
SSE setting has regressed — file a P0.

### 4. Restore to the throwaway DB (10-30 min)

```bash
# Apply schema first (extensions etc.). From canonical repo root:
DATABASE_URL="$DRILL_DATABASE_URL" pnpm db:migrate

# Then restore the dump:
pg_restore \
  --no-owner --no-acl \
  --dbname="$DRILL_DATABASE_URL" \
  /tmp/drill.dump
```

Count any warning lines in the pg_restore output. Zero warnings is a pass.
Non-zero warnings get noted in the drill log even if the drill otherwise
succeeds — they may foreshadow a future failure.

### 5. Compare row counts (5 min)

```bash
psql "$DRILL_DATABASE_URL" -c "
  SELECT 'crisis_events' AS table, COUNT(*) FROM crisis_events
  UNION ALL SELECT 'prayer_requests', COUNT(*) FROM prayer_requests
  UNION ALL SELECT 'call_turns',      COUNT(*) FROM call_turns
  UNION ALL SELECT 'donations',       COUNT(*) FROM donations
  UNION ALL SELECT 'sermons',         COUNT(*) FROM sermons;
"
```

Compare against the same query on production (or the admin dashboard). Each
row must be within 1% of production. If a table is empty in the restore but
populated in production: P0.

### 6. Run preflight against the restored DB (2 min)

```bash
DATABASE_URL="$DRILL_DATABASE_URL" pnpm preflight
```

Every gate must pass. Extensions must show installed.

### 7. Readback test (1 min)

```bash
psql "$DRILL_DATABASE_URL" -c "
  SELECT slug, title, published_at
  FROM sermons
  ORDER BY published_at DESC NULLS LAST
  LIMIT 1;
"
```

You should see the most recently published sermon. If it returns no rows,
or returns garbage, P0.

### 8. Teardown (2 min)

- Drop the drill DB. **Do not** leave restored crisis transcripts living on
  a throwaway box.
  ```bash
  # From Railway dashboard: delete the drill Postgres service.
  ```
- Delete the local dump file.
  ```bash
  shred -u /tmp/drill.dump   # Linux
  rm -P  /tmp/drill.dump     # macOS
  ```
- Clear shell history of the drill DATABASE_URL.

### 9. Drill log (5 min)

Append a row to `docs/runbook/drill-log.md` (create it if it doesn't exist):

```
| Date       | Backup key                                            | Size  | Warnings | Result | Notes                |
|------------|-------------------------------------------------------|-------|----------|--------|----------------------|
| 2025-01-14 | backups/postgres/2025-01-13/db-2025-01-13T02-00-00.dump | 42MB  | 0        | PASS   | Restored in 12 min.  |
```

Commit the drill log entry. The git log is the audit trail.

---

## What to do if the drill fails

- **Download fails** → check `S3_BUCKET`, S3 credentials, network. Re-run.
- **`pg_restore` errors** → most often a missing extension or PG version
  mismatch. The custom format restores forward, not backward — confirm the
  drill PG ≥ production PG. If it is, file a P0 and stop.
- **Row counts wildly off** → check the backup script's exit status in
  `job_runs` for the night of the failed backup. The script exits non-zero
  on partial dumps; if exit was 0 but data is missing, something is wrong
  with `pg_dump --format=custom` on this database. File a P0.

The drill is the only test of the backup pipeline that actually exercises
restore. Treat its failure as production-critical.
