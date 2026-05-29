/**
 * Backup retention enforcement.
 *
 * Keeps:
 *   - All backups from the last 7 days (daily granularity)
 *   - The last 4 Sunday backups (weekly granularity)
 *   - The first-of-month backup for the last 12 months (monthly granularity)
 *   - Every Jan-1 backup forever (yearly granularity)
 *
 * Deletes everything else under backups/postgres/.
 *
 * Safe by default — pass --dry-run to log what WOULD be deleted without
 * actually issuing DeleteObject calls. The first quarterly restore drill
 * should run this once with --dry-run to confirm the kept set looks sane.
 *
 * Logs result to job_runs as 'backup_cleanup'.
 */
import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectsCommand,
  type _Object,
} from "@aws-sdk/client-s3";
import postgres from "postgres";

const JOB_NAME = "backup_cleanup";
const PREFIX = "backups/postgres/";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v || !v.trim()) {
    console.error(`[backup-cleanup] missing required env var: ${name}`);
    process.exit(2);
  }
  return v;
}

function s3Client(): S3Client {
  return new S3Client({
    region: process.env.S3_REGION ?? "auto",
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
      accessKeyId: requireEnv("S3_ACCESS_KEY_ID"),
      secretAccessKey: requireEnv("S3_SECRET_ACCESS_KEY"),
    },
  });
}

async function listAll(bucket: string): Promise<_Object[]> {
  const client = s3Client();
  const out: _Object[] = [];
  let token: string | undefined;
  do {
    const res = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: PREFIX,
        ContinuationToken: token,
      })
    );
    for (const obj of res.Contents ?? []) {
      out.push(obj);
    }
    token = res.NextContinuationToken;
  } while (token);
  return out;
}

type Classified = {
  obj: _Object;
  date: Date;
};

/**
 * Decide which keys to keep. The S3 key encodes the date as the second path
 * segment (backups/postgres/YYYY-MM-DD/...). We parse the date out and bucket
 * objects by:
 *   - last 7 days  → keep all
 *   - last 4 weeks → keep the latest from each Sunday
 *   - last 12 mon  → keep the latest from each first-of-month
 *   - always       → keep every Jan-1 latest
 */
function decideKeepSet(items: Classified[], now: Date): Set<string> {
  const keep = new Set<string>();
  const day = 24 * 60 * 60 * 1000;

  // 1. Last 7 days — keep everything.
  const sevenDaysAgo = new Date(now.getTime() - 7 * day);
  for (const c of items) {
    if (c.date >= sevenDaysAgo && c.obj.Key) keep.add(c.obj.Key);
  }

  // 2. Last 4 Sunday backups.
  const sundays = items.filter((c) => c.date.getUTCDay() === 0);
  const sundaysByDay = groupByDay(sundays);
  const recentSundays = [...sundaysByDay.entries()]
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .slice(0, 4);
  for (const [, list] of recentSundays) {
    const latest = list.sort((a, b) => (a.obj.Key! < b.obj.Key! ? 1 : -1))[0];
    if (latest?.obj.Key) keep.add(latest.obj.Key);
  }

  // 3. Last 12 first-of-month backups.
  const firsts = items.filter((c) => c.date.getUTCDate() === 1);
  const firstsByDay = groupByDay(firsts);
  const recentFirsts = [...firstsByDay.entries()]
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .slice(0, 12);
  for (const [, list] of recentFirsts) {
    const latest = list.sort((a, b) => (a.obj.Key! < b.obj.Key! ? 1 : -1))[0];
    if (latest?.obj.Key) keep.add(latest.obj.Key);
  }

  // 4. Every Jan-1 — yearly archive forever.
  const jans = items.filter(
    (c) => c.date.getUTCMonth() === 0 && c.date.getUTCDate() === 1
  );
  const jansByDay = groupByDay(jans);
  for (const [, list] of jansByDay) {
    const latest = list.sort((a, b) => (a.obj.Key! < b.obj.Key! ? 1 : -1))[0];
    if (latest?.obj.Key) keep.add(latest.obj.Key);
  }

  return keep;
}

function groupByDay(items: Classified[]): Map<string, Classified[]> {
  const m = new Map<string, Classified[]>();
  for (const c of items) {
    const k = c.date.toISOString().slice(0, 10);
    const arr = m.get(k) ?? [];
    arr.push(c);
    m.set(k, arr);
  }
  return m;
}

function classify(items: _Object[]): Classified[] {
  const out: Classified[] = [];
  for (const obj of items) {
    if (!obj.Key) continue;
    // Key is backups/postgres/YYYY-MM-DD/...
    const m = obj.Key.match(/^backups\/postgres\/(\d{4}-\d{2}-\d{2})\//);
    if (!m) continue;
    const date = new Date(`${m[1]}T00:00:00Z`);
    if (Number.isNaN(date.getTime())) continue;
    out.push({ obj, date });
  }
  return out;
}

async function logJobRun(opts: {
  status: "running" | "succeeded" | "failed";
  result?: unknown;
  error?: unknown;
  durationMs?: number;
}): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (!url) return;
  let sql: ReturnType<typeof postgres> | null = null;
  try {
    sql = postgres(url, {
      max: 1,
      connect_timeout: 5,
      ssl: process.env.DATABASE_SSL === "require" ? "require" : undefined,
    });
    await sql.unsafe(
      `
      INSERT INTO job_runs (
        job_name, queue, status, started_at, finished_at, duration_ms,
        payload, result, error_message
      ) VALUES (
        $1, 'cron-backup', $2,
        ${opts.status === "running" ? "now()" : "NULL"},
        ${opts.status === "succeeded" || opts.status === "failed" ? "now()" : "NULL"},
        $3, $4::jsonb, $5::jsonb, $6
      )
      `,
      [
        JOB_NAME,
        opts.status,
        opts.durationMs ?? null,
        JSON.stringify({}),
        JSON.stringify(opts.result ?? {}),
        opts.error instanceof Error
          ? opts.error.message
          : opts.error
            ? String(opts.error)
            : null,
      ],
    );
  } catch (err) {
    console.warn("[backup-cleanup] failed to log job_run:", err);
  } finally {
    await sql?.end({ timeout: 2 }).catch(() => undefined);
  }
}

async function main(): Promise<void> {
  const bucket = requireEnv("S3_BUCKET");
  requireEnv("S3_REGION");
  requireEnv("S3_ACCESS_KEY_ID");
  requireEnv("S3_SECRET_ACCESS_KEY");

  const dryRun = process.argv.includes("--dry-run");
  const started = Date.now();
  await logJobRun({ status: "running" });

  console.log(`[backup-cleanup] listing ${PREFIX}* in s3://${bucket}/`);
  let all: _Object[];
  try {
    all = await listAll(bucket);
  } catch (err) {
    console.error("[backup-cleanup] list failed:", err);
    await logJobRun({
      status: "failed",
      error: err,
      durationMs: Date.now() - started,
    });
    process.exit(1);
  }
  console.log(`[backup-cleanup] found ${all.length} objects`);

  const classified = classify(all);
  const now = new Date();
  const keep = decideKeepSet(classified, now);

  const toDelete = classified.filter(
    (c) => c.obj.Key && !keep.has(c.obj.Key)
  );

  console.log(
    `[backup-cleanup] keep=${keep.size} delete=${toDelete.length} dryRun=${dryRun}`
  );

  let deleted = 0;
  if (!dryRun && toDelete.length > 0) {
    const client = s3Client();
    // S3 DeleteObjects supports max 1000 keys per call.
    for (let i = 0; i < toDelete.length; i += 1000) {
      const batch = toDelete.slice(i, i + 1000);
      const res = await client.send(
        new DeleteObjectsCommand({
          Bucket: bucket,
          Delete: {
            Objects: batch.map((c) => ({ Key: c.obj.Key! })),
            Quiet: true,
          },
        })
      );
      deleted += batch.length - (res.Errors?.length ?? 0);
      for (const e of res.Errors ?? []) {
        console.warn(`[backup-cleanup] delete error key=${e.Key}: ${e.Message}`);
      }
    }
  }

  const result = {
    total: all.length,
    kept: keep.size,
    deleted,
    candidatesForDelete: toDelete.length,
    dryRun,
  };
  console.log(`[backup-cleanup] result: ${JSON.stringify(result)}`);
  await logJobRun({
    status: "succeeded",
    result,
    durationMs: Date.now() - started,
  });
  process.exit(0);
}

main().catch(async (err) => {
  console.error("[backup-cleanup] crashed:", err);
  await logJobRun({ status: "failed", error: err }).catch(() => undefined);
  process.exit(1);
});
