/**
 * Weekly cron — Reliability layer.
 *
 * Runs every Sunday at 02:00 UTC. Triggers two jobs in sequence:
 *   1. db_backup        — Postgres pg_dump streamed to S3 (SSE AES256).
 *   2. backup_cleanup   — Enforce 7d/4w/12m/yearly retention.
 *
 * Both jobs already log to `job_runs` directly (since they are tsx scripts
 * called from a build worker, not the Next.js process). This route shells
 * out to pnpm so we get the exact same behavior in cron as we would running
 * `pnpm backup:db` locally.
 *
 * AUTH: same scheme as /api/cron/daily — Bearer token via Authorization
 * header OR ?secret= query string. Returns 401 if unauthorized.
 *
 * FAILURE BEHAVIOR: this endpoint returns 500 if EITHER backup OR cleanup
 * exits non-zero AND S3 is configured. The cron scheduler treats 500 as a
 * page-worthy event. (We do NOT 500 when S3 is unconfigured — that just
 * skips the job cleanly; logged as 'skipped' in job_runs.)
 *
 * Why weekly + not daily for the script-side, and daily-via-fire-and-forget?
 *   - Decoupling: a slow backup must not delay the daily content automation.
 *   - Visibility: a single, focused weekly cron is easier to alert on.
 *   - Cost: 7 days of full custom-format dumps is plenty given Railway PITR
 *     covers the in-between window. RPO target stays at 24h because the daily
 *     fire-and-forget from /api/cron/daily also schedules an out-of-band
 *     backup (see appended block in that route).
 */
import { NextResponse } from "next/server";
import { spawn } from "node:child_process";
import path from "node:path";
import { logJobRun } from "@/lib/ops";
import { requestId } from "@/lib/request-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 900; // 15 min — pg_dump on a moderate DB

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret && process.env.APP_ENV !== "production") return true;
  const auth = request.headers.get("authorization");
  const url = new URL(request.url);
  return auth === `Bearer ${secret}` || url.searchParams.get("secret") === secret;
}

function s3Configured(): boolean {
  return Boolean(
    process.env.S3_BUCKET &&
      process.env.S3_REGION &&
      process.env.S3_ACCESS_KEY_ID &&
      process.env.S3_SECRET_ACCESS_KEY
  );
}

async function runPnpmScript(name: string): Promise<{ ok: boolean; code: number; output: string }> {
  const cwd = path.resolve(process.cwd(), "scripts");
  return new Promise((resolve) => {
    const child = spawn("pnpm", ["--silent", name], {
      cwd,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
      shell: process.platform === "win32",
    });
    const chunks: Buffer[] = [];
    child.stdout.on("data", (b: Buffer) => chunks.push(b));
    child.stderr.on("data", (b: Buffer) => chunks.push(b));
    child.on("close", (code) => {
      resolve({
        ok: code === 0,
        code: code ?? 1,
        output: Buffer.concat(chunks).toString("utf8").slice(-4000),
      });
    });
    child.on("error", (err) => {
      resolve({ ok: false, code: 1, output: err.message });
    });
  });
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const correlationId = requestId(request);
  const started = Date.now();

  if (!s3Configured()) {
    await logJobRun({
      jobName: "weekly_backup_orchestrator",
      queue: "cron",
      status: "succeeded",
      payload: { skipped: true },
      result: { reason: "S3 not configured" },
      correlationId,
      durationMs: Date.now() - started,
    });
    return NextResponse.json({ ok: true, skipped: true, reason: "S3 not configured" });
  }

  const backup = await runPnpmScript("backup:db");
  const cleanup = backup.ok
    ? await runPnpmScript("backup:cleanup")
    : { ok: false, code: -1, output: "skipped (backup failed)" };

  const allOk = backup.ok && cleanup.ok;
  await logJobRun({
    jobName: "weekly_backup_orchestrator",
    queue: "cron",
    status: allOk ? "succeeded" : "failed",
    payload: {},
    result: {
      backup: { ok: backup.ok, code: backup.code, tail: backup.output },
      cleanup: { ok: cleanup.ok, code: cleanup.code, tail: cleanup.output },
    },
    correlationId,
    durationMs: Date.now() - started,
  });

  if (!allOk) {
    return NextResponse.json(
      {
        ok: false,
        backup,
        cleanup,
      },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true, backup, cleanup });
}

export async function GET(request: Request) {
  return POST(request);
}
