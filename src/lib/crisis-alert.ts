/**
 * Crisis alert dispatcher.
 *
 * Called from every public surface that can record a crisis_events row:
 *   - /api/ask
 *   - /api/scroll (proxies /api/ask)
 *   - /api/prayer
 *   - /api/voice/turn (Hope Line conversation loop)
 *   - /api/apologetics
 *
 * Contract:
 *   - Returns early for any severity that is NOT 'imminent'. Watch/active are
 *     loud enough on the user-facing surface; only 'imminent' pages a human.
 *   - Reads CRISIS_ALERT_EMAILS (comma-separated). If unset or empty, logs a
 *     job_run entry noting the misconfiguration and returns. We do NOT throw.
 *   - Best-effort: every catch path swallows. The user request must NEVER
 *     block on email delivery. Callers should always invoke with
 *     `alertOnImminentCrisis(...).catch(() => undefined)`.
 *
 * The email itself contains pattern names + severity + admin link only.
 * Caller words are NEVER pasted into the email.
 */
import type { CrisisSeverity } from "@hog/safety";
import { sendEmail, crisisAlertTemplate, type CrisisAlertSource } from "@hog/email";
import { logJobRun } from "@/lib/ops";

export type AlertOnImminentCrisisOpts = {
  severity: CrisisSeverity;
  source: CrisisAlertSource;
  sourceId: string;
  triggerPhrases?: string[];
  actionTaken?: string;
  callerHash?: string;
  correlationId?: string;
};

function adminPathForSource(source: CrisisAlertSource, id: string): string {
  switch (source) {
    case "voice":
      return `/admin/calls/${encodeURIComponent(id)}`;
    case "prayer":
      return `/admin/prayers/${encodeURIComponent(id)}`;
    case "ask":
    case "scroll":
    case "apologetics":
    default:
      return `/admin/handoff?source=${source}&id=${encodeURIComponent(id)}`;
  }
}

function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    "https://hopeofglory.ministry"
  ).replace(/\/$/, "");
}

function recipients(): string[] {
  return (process.env.CRISIS_ALERT_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
}

export async function alertOnImminentCrisis(opts: AlertOnImminentCrisisOpts): Promise<void> {
  // Only imminent escalates by email. Anything lower already gets human review
  // through the admin queue without paging.
  if (opts.severity !== "imminent") return;

  const to = recipients();
  const started = Date.now();

  if (to.length === 0) {
    // Misconfiguration: imminent crisis lands but no one is paged. Loud-log
    // it so the founder sees this on the next preflight or in Sentry.
    console.error(
      "[crisis-alert] IMMINENT crisis fired but CRISIS_ALERT_EMAILS is empty. " +
        "No human will be paged. Source:",
      opts.source,
      "sourceId:",
      opts.sourceId
    );
    await logJobRun({
      jobName: "crisis_alert_sent",
      queue: "alerts",
      status: "failed",
      payload: {
        source: opts.source,
        sourceId: opts.sourceId,
        severity: opts.severity,
      },
      error: "CRISIS_ALERT_EMAILS is empty",
      correlationId: opts.correlationId,
      durationMs: Date.now() - started,
    });
    return;
  }

  const rendered = crisisAlertTemplate({
    severity: "imminent",
    source: opts.source,
    adminUrl: adminPathForSource(opts.source, opts.sourceId),
    siteUrl: siteUrl(),
    callerHash: opts.callerHash,
    triggerPhrases: opts.triggerPhrases,
    actionTaken: opts.actionTaken,
    occurredAt: new Date().toISOString(),
  });

  const failures: string[] = [];
  const successes: string[] = [];

  for (const recipient of to) {
    try {
      const result = await sendEmail({
        to: recipient,
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.text,
        tags: [
          { name: "flow", value: "crisis_alert" },
          { name: "severity", value: "imminent" },
          { name: "source", value: opts.source },
        ],
      });
      if (result.error) {
        failures.push(`${recipient}: ${result.error}`);
      } else {
        successes.push(recipient);
      }
    } catch (err) {
      failures.push(`${recipient}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  await logJobRun({
    jobName: "crisis_alert_sent",
    queue: "alerts",
    status: failures.length > 0 && successes.length === 0 ? "failed" : "succeeded",
    payload: {
      source: opts.source,
      sourceId: opts.sourceId,
      severity: opts.severity,
      recipients: to.length,
    },
    result: {
      sent: successes.length,
      failed: failures.length,
      failureDetail: failures.length ? failures : undefined,
    },
    correlationId: opts.correlationId,
    durationMs: Date.now() - started,
  });
}
