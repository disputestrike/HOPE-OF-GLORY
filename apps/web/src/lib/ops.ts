import { sql } from "drizzle-orm";
import { optionalDb } from "@/lib/server-db";
import type { CrisisSeverity } from "@hog/safety";

export type DbCrisisSeverity = "flag" | "concern" | "urgent" | "imminent";
export type DbRiskLevel = "none" | "low" | "medium" | "high" | "critical";

export function crisisDbSeverity(severity: CrisisSeverity): DbCrisisSeverity {
  switch (severity) {
    case "imminent":
      return "imminent";
    case "active":
      return "urgent";
    case "watch":
      return "concern";
    case "none":
    default:
      return "flag";
  }
}

export function prayerRiskLevel(severity: CrisisSeverity): DbRiskLevel {
  switch (severity) {
    case "imminent":
      return "critical";
    case "active":
      return "high";
    case "watch":
      return "medium";
    case "none":
    default:
      return "low";
  }
}

export async function logJobRun(opts: {
  jobName: string;
  status: "queued" | "running" | "succeeded" | "failed" | "cancelled" | "retrying" | "timed_out";
  queue?: string;
  payload?: unknown;
  result?: unknown;
  error?: unknown;
  correlationId?: string;
  durationMs?: number;
}): Promise<void> {
  const database = await optionalDb(`job:${opts.jobName}`);
  if (!database) return;
  try {
    await database.execute(sql`
      INSERT INTO job_runs (
        job_name, queue, status, started_at, finished_at, duration_ms,
        payload, result, error_message, error_stack, correlation_id
      )
      VALUES (
        ${opts.jobName},
        ${opts.queue ?? null},
        ${opts.status},
        ${opts.status === "running" ? sql`now()` : null},
        ${opts.status === "succeeded" || opts.status === "failed" || opts.status === "cancelled" ? sql`now()` : null},
        ${opts.durationMs ?? null},
        ${JSON.stringify(opts.payload ?? {})}::jsonb,
        ${JSON.stringify(opts.result ?? {})}::jsonb,
        ${opts.error instanceof Error ? opts.error.message : opts.error ? String(opts.error) : null},
        ${opts.error instanceof Error ? opts.error.stack ?? null : null},
        ${opts.correlationId ?? null}
      )
    `);
  } catch (err) {
    console.warn("[ops] failed to log job run:", err);
  }
}

export async function auditAdminAction(opts: {
  actorEmail?: string | null;
  action: string;
  targetType?: string;
  targetId?: string | null;
  diff?: unknown;
  ipHash?: string | null;
  userAgent?: string | null;
  notes?: string;
}): Promise<void> {
  const database = await optionalDb("admin-audit");
  if (!database) return;
  try {
    const rows = opts.actorEmail
      ? await database.execute<{ id: string }>(sql`
          SELECT id FROM users WHERE email = ${opts.actorEmail.toLowerCase()} LIMIT 1
        `)
      : [];
    const actorId = rows[0]?.id ?? null;
    await database.execute(sql`
      INSERT INTO admin_actions (
        actor_id, action, target_type, target_id, diff_json, ip_hash, user_agent, notes
      )
      VALUES (
        ${actorId},
        ${opts.action},
        ${opts.targetType ?? null},
        ${opts.targetId ?? null},
        ${JSON.stringify(opts.diff ?? {})}::jsonb,
        ${opts.ipHash ?? null},
        ${opts.userAgent ?? null},
        ${opts.notes ?? null}
      )
    `);
  } catch (err) {
    console.warn("[ops] failed to audit admin action:", err);
  }
}

export function captureError(scope: string, err: unknown): void {
  console.error(`[${scope}]`, err);
}
