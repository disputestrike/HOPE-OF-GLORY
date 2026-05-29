/**
 * Email send pipeline — picks up email_campaigns with status='scheduled'
 * and sends them via Resend. Idempotent: campaigns are marked 'sent' as
 * the send completes; failures move to 'failed' with the error logged.
 *
 * Triggered from the daily cron AND can be invoked manually from admin.
 *
 * Resend gate: returns { skipped: true } if RESEND_API_KEY is missing.
 */
import { sql } from "drizzle-orm";
import { db } from "@hog/db";
import { sendEmail } from "@hog/email";

export type EmailSendResult = {
  scanned: number;
  sent: number;
  failed: number;
  skipped: boolean;
  errors: Array<{ campaignId: string; error: string }>;
};

type CampaignRow = {
  id: string;
  slug: string;
  subject: string;
  preheader: string | null;
  body_text: string | null;
  body_html: string | null;
  from_name: string | null;
  from_email: string | null;
  audience_filter: Record<string, unknown> | null;
};

/**
 * Send any campaigns that are due. `limit` caps the per-run batch so a
 * misconfigured query can't run away.
 */
export async function runEmailSendPipeline(opts: { limit?: number } = {}): Promise<EmailSendResult> {
  if (!process.env.RESEND_API_KEY) {
    return { scanned: 0, sent: 0, failed: 0, skipped: true, errors: [] };
  }
  const limit = opts.limit ?? 100;

  const due = await db.execute<CampaignRow>(sql`
    SELECT id, slug, subject, preheader, body_text, body_html,
           from_name, from_email, audience_filter
    FROM email_campaigns
    WHERE status = 'scheduled'
      AND scheduled_for <= now()
    ORDER BY scheduled_for ASC
    LIMIT ${limit}
  `).catch(() => [] as CampaignRow[]);

  const result: EmailSendResult = {
    scanned: due.length,
    sent: 0,
    failed: 0,
    skipped: false,
    errors: [],
  };

  for (const campaign of due) {
    // Mark sending so a concurrent worker doesn't double-send.
    const claimed = await db
      .execute<{ id: string }>(sql`
        UPDATE email_campaigns
        SET status = 'sending', updated_at = now()
        WHERE id = ${campaign.id} AND status = 'scheduled'
        RETURNING id
      `)
      .catch(() => [] as Array<{ id: string }>);
    if (claimed.length === 0) continue;

    // Resolve the audience. For Phase 1 we read from email_subscribers using
    // the campaign's audience_filter.flow tag.
    const audience = await resolveAudience(campaign.audience_filter ?? {});
    if (audience.length === 0) {
      await db.execute(sql`
        UPDATE email_campaigns
        SET status = 'sent', sent_at = now(), recipient_count = 0
        WHERE id = ${campaign.id}
      `).catch(() => undefined);
      continue;
    }

    let success = 0;
    let failure = 0;
    for (const recipient of audience) {
      const { id, error } = await sendEmail({
        to: recipient.email,
        subject: campaign.subject,
        html: campaign.body_html ?? wrapPlainAsHtml(campaign.body_text ?? "", campaign.preheader),
        text: campaign.body_text ?? undefined,
        tags: [
          { name: "campaign", value: campaign.slug.slice(0, 50) },
          { name: "flow", value: String((campaign.audience_filter as { flow?: string })?.flow ?? "general").slice(0, 50) },
        ],
      });
      if (id) success += 1;
      else {
        failure += 1;
        if (error && failure < 5) {
          result.errors.push({ campaignId: campaign.id, error });
        }
      }
    }

    const newStatus = failure === 0 ? "sent" : success === 0 ? "failed" : "partial";
    await db.execute(sql`
      UPDATE email_campaigns
      SET status = ${newStatus},
          sent_at = ${success > 0 ? sql`now()` : null},
          recipient_count = ${success},
          updated_at = now()
      WHERE id = ${campaign.id}
    `).catch(() => undefined);

    result.sent += success;
    result.failed += failure;
  }

  return result;
}

async function resolveAudience(filter: Record<string, unknown>): Promise<Array<{ id: string; email: string; name: string | null }>> {
  const flow = String(filter.flow ?? "");
  const status = flow === "new_believer" ? "new_believer_day_0" : null;

  if (status) {
    return db.execute<{ id: string; email: string; name: string | null }>(sql`
      SELECT id, email, name FROM email_subscribers
      WHERE status LIKE ${status + "%"}
        AND unsubscribed_at IS NULL
      LIMIT 5000
    `).catch(() => []);
  }

  // Default: all opted-in subscribers
  return db.execute<{ id: string; email: string; name: string | null }>(sql`
    SELECT id, email, name FROM email_subscribers
    WHERE status NOT IN ('unsubscribed', 'bounced', 'complained')
      AND unsubscribed_at IS NULL
    LIMIT 5000
  `).catch(() => []);
}

function wrapPlainAsHtml(text: string, preheader: string | null): string {
  const safe = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `<!DOCTYPE html><html><body style="font-family:Inter,system-ui,sans-serif;color:#0B1F3A;max-width:600px;margin:32px auto;padding:0 24px;">
${preheader ? `<div style="display:none;font-size:0;line-height:0;max-height:0;mso-hide:all;">${preheader}</div>` : ""}
<div style="white-space:pre-wrap;">${safe}</div>
<p style="margin-top:32px;font-size:12px;color:#6b6b6b;">Hope of Glory Ministry · Washington, D.C.</p>
</body></html>`;
}
