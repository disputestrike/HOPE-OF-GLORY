/**
 * Nightly Postgres backup -> S3.
 *
 * Streams `pg_dump --format=custom` directly into an S3 multipart upload so
 * we never materialize the dump on disk (no leaked plaintext PII on a build
 * worker filesystem). Server-side AES256 encryption is applied at rest.
 *
 *   S3 key layout:
 *     backups/postgres/YYYY-MM-DD/db-<ISO-timestamp>.dump
 *
 *   Restore (custom format is forward-compatible to a newer PG version):
 *     pg_restore -d $NEW_DATABASE_URL --no-owner --no-acl path/to/db.dump
 *
 * Exit codes:
 *   0 — backup succeeded
 *   1 — backup failed (pg_dump non-zero, S3 error, or job_runs log failure
 *       on the "failed" path). The cron runner / Sentry must treat exit 1
 *       as paging.
 *   2 — preflight / config failure (missing env vars)
 *
 * Env required: DATABASE_URL, S3_BUCKET, S3_REGION, S3_ACCESS_KEY_ID,
 *               S3_SECRET_ACCESS_KEY. S3_ENDPOINT optional (R2 / non-AWS).
 */
import { spawn } from "node:child_process";
import { PassThrough } from "node:stream";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import postgres from "postgres";

const JOB_NAME = "db_backup";

type Result = {
  ok: boolean;
  key?: string;
  url?: string;
  bytes?: number;
  durationMs: number;
  error?: string;
};

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v || !v.trim()) {
    console.error(`[backup-db] missing required env var: ${name}`);
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

function dateKey(now = new Date()): { day: string; key: string } {
  const day = now.toISOString().slice(0, 10); // YYYY-MM-DD
  const ts = now.toISOString().replace(/[:.]/g, "-");
  return {
    day,
    key: `backups/postgres/${day}/db-${ts}.dump`,
  };
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
    console.warn("[backup-db] failed to log job_run:", err);
  } finally {
    await sql?.end({ timeout: 2 }).catch(() => undefined);
  }
}

async function runBackup(): Promise<Result> {
  const databaseUrl = requireEnv("DATABASE_URL");
  const bucket = requireEnv("S3_BUCKET");
  requireEnv("S3_REGION");
  requireEnv("S3_ACCESS_KEY_ID");
  requireEnv("S3_SECRET_ACCESS_KEY");

  const { key } = dateKey();
  const started = Date.now();
  await logJobRun({ status: "running" });

  // Spawn pg_dump → stream stdout to S3 via lib-storage's Upload (handles
  // multipart automatically). Custom format is binary, smaller than plain
  // SQL, and restorable into a newer PG version.
  const args = ["--format=custom", "--compress=9", "--no-owner", "--no-acl", databaseUrl];
  const dump = spawn("pg_dump", args, {
    stdio: ["ignore", "pipe", "pipe"],
    env: process.env,
  });

  const stderrChunks: Buffer[] = [];
  dump.stderr.on("data", (chunk: Buffer) => stderrChunks.push(chunk));

  // PassThrough lets us count bytes as they fly past.
  let bytes = 0;
  const passthrough = new PassThrough();
  dump.stdout.on("data", (chunk: Buffer) => {
    bytes += chunk.length;
  });
  dump.stdout.pipe(passthrough);

  const upload = new Upload({
    client: s3Client(),
    params: {
      Bucket: bucket,
      Key: key,
      Body: passthrough,
      ContentType: "application/octet-stream",
      ServerSideEncryption: "AES256",
      Metadata: {
        "x-hog-backup": "postgres-custom",
        "x-hog-started-at": new Date(started).toISOString(),
      },
    },
    queueSize: 4,
    partSize: 8 * 1024 * 1024, // 8 MiB parts
    leavePartsOnError: false,
  });

  const dumpExit = new Promise<number>((resolve) => {
    dump.on("close", (code) => resolve(code ?? 1));
  });
  const dumpError = new Promise<Error | null>((resolve) => {
    dump.on("error", (err) => resolve(err));
    dump.on("close", () => resolve(null));
  });

  try {
    // Run both in parallel — pg_dump streaming feeds the upload buffer.
    const [, code, err] = await Promise.all([upload.done(), dumpExit, dumpError]);
    if (err) {
      throw new Error(`pg_dump spawn error: ${err.message}`);
    }
    if (code !== 0) {
      const stderr = Buffer.concat(stderrChunks).toString("utf8").slice(0, 4000);
      throw new Error(`pg_dump exited ${code}: ${stderr}`);
    }
    const url = process.env.S3_PUBLIC_URL
      ? `${process.env.S3_PUBLIC_URL.replace(/\/$/, "")}/${key}`
      : `s3://${bucket}/${key}`;
    return { ok: true, key, url, bytes, durationMs: Date.now() - started };
  } catch (err) {
    return {
      ok: false,
      bytes,
      durationMs: Date.now() - started,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

async function main(): Promise<void> {
  console.log("[backup-db] starting Postgres backup -> S3");
  const result = await runBackup();
  if (result.ok) {
    console.log(
      `[backup-db] OK key=${result.key} bytes=${result.bytes} duration=${result.durationMs}ms`
    );
    await logJobRun({
      status: "succeeded",
      result,
      durationMs: result.durationMs,
    });
    process.exit(0);
  } else {
    console.error(`[backup-db] FAIL ${result.error}`);
    await logJobRun({
      status: "failed",
      result,
      error: result.error,
      durationMs: result.durationMs,
    });
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("[backup-db] crashed:", err);
  process.exit(1);
});
