/**
 * Admin-only — send a sample crisis-alert email so the founder can verify
 * end-to-end that:
 *   1. CRISIS_ALERT_EMAILS is set
 *   2. Resend is configured (RESEND_API_KEY + EMAIL_FROM)
 *   3. The address actually receives mail (no spam-filter / DNS issues)
 *
 * The sample email is clearly labeled "[TEST]" in the subject + body and
 * uses a fixture caller hash / fixture trigger pattern so a recipient who
 * sees it knows it is a drill, not a live event.
 *
 * GUARDS: admin auth required. Returns 401/403 otherwise.
 */
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { sendEmail, crisisAlertTemplate } from "@hog/email";
import { requireAdminApi } from "@/lib/admin-auth";
import { logJobRun } from "@/lib/ops";
import { requestId } from "@/lib/request-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

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

export async function POST(request: Request) {
  const gate = await requireAdminApi("settings");
  if (!gate.ok) return gate.response;

  const correlationId = requestId(request);
  const started = Date.now();
  const to = recipients();

  if (to.length === 0) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "CRISIS_ALERT_EMAILS is empty. Set it (comma-separated) and redeploy before re-running this test.",
      },
      { status: 400 }
    );
  }
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { ok: false, error: "RESEND_API_KEY is not set. Cannot send mail." },
      { status: 400 }
    );
  }

  const fixtureId = randomUUID();
  const rendered = crisisAlertTemplate({
    severity: "imminent",
    source: "voice",
    adminUrl: `/admin/calls/${fixtureId}`,
    siteUrl: siteUrl(),
    callerHash: "test-fixture-hash",
    triggerPhrases: ["test-pattern-imminent"],
    actionTaken: "988_and_911",
    occurredAt: new Date().toISOString(),
  });

  // Tag the email as a TEST so a recipient who opens it on their phone in the
  // middle of the night isn't startled into thinking it's a live event.
  const subject = `[TEST] ${rendered.subject}`;
  const banner = `<p style="font-size:14px; background:#0B1F3A; color:#D4AF37; padding:10px 14px; margin:0 0 12px 0; border:1px dashed #D4AF37; text-align:center; letter-spacing:0.12em; text-transform:uppercase;">This is a configuration test. No live event occurred.</p>`;
  const html = rendered.html.replace(/(<tr><td style="padding:24px 32px 16px 32px;">)/, `$1${banner}`);
  const text = `[TEST] This is a configuration test. No live event occurred.\n\n${rendered.text}`;

  const results: Array<{ to: string; ok: boolean; id?: string | null; error?: string }> = [];

  for (const recipient of to) {
    try {
      const send = await sendEmail({
        to: recipient,
        subject,
        html,
        text,
        tags: [
          { name: "flow", value: "crisis_alert" },
          { name: "severity", value: "imminent" },
          { name: "source", value: "voice" },
          { name: "test", value: "true" },
        ],
      });
      results.push({
        to: recipient,
        ok: !send.error,
        id: send.id,
        error: send.error,
      });
    } catch (err) {
      results.push({
        to: recipient,
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  const ok = results.every((r) => r.ok);
  await logJobRun({
    jobName: "crisis_alert_test",
    queue: "alerts",
    status: ok ? "succeeded" : "failed",
    payload: { actor: gate.session.email, recipients: to.length },
    result: { results },
    correlationId,
    durationMs: Date.now() - started,
  });

  return NextResponse.json({
    ok,
    sentTo: results,
    note: "Recipients should see an email with [TEST] in the subject within 60 seconds.",
  });
}

export async function GET(request: Request) {
  return POST(request);
}
