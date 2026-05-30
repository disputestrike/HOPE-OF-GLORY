/**
 * Contact Agent — email follow-ups, supporter comms, new-believer sequence.
 *
 * Phase 4 ships:
 *   - prayer_received → send confirmation email if email provided
 *   - contact_received → send acknowledgment email
 *   - new_believer_enrolled → start 30-day sequence (Phase 13)
 *
 * All sends are logged to email_campaigns.
 */
import { db, schema } from "@hog/db";
import { sendEmail, prayerReceivedTemplate, newBelieverWelcomeTemplate } from "@hog/email";

function campaignSlug(prefix: string, id: string): string {
  return `${prefix}-${id}`.toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, 200);
}

export async function ackPrayerRequest(opts: {
  email: string;
  givenName?: string;
  prayerRequestId: string;
}): Promise<{ ok: boolean; error?: string }> {
  const t = prayerReceivedTemplate({ givenName: opts.givenName });
  const { id, error } = await sendEmail({
    to: opts.email,
    subject: t.subject,
    html: t.html.replace(/\{\{unsubscribeUrl\}\}/g, "#"),
    text: t.text,
    tags: [
      { name: "kind", value: "prayer_ack" },
      { name: "prayer_request_id", value: opts.prayerRequestId },
    ],
  });

  await db.insert(schema.emailCampaigns).values({
    slug: campaignSlug("prayer-ack", opts.prayerRequestId),
    subject: t.subject,
    bodyHtml: t.html,
    bodyText: t.text,
    audienceFilter: { email: opts.email, kind: "prayer_ack" },
    provider: "resend",
    status: id ? "sent" : "failed",
    sentAt: id ? new Date() : null,
    recipientCount: 1,
  }).catch(() => undefined);

  return { ok: !!id, error };
}

export async function welcomeNewBeliever(opts: {
  email: string;
  givenName?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const t = newBelieverWelcomeTemplate({ givenName: opts.givenName });
  const { id, error } = await sendEmail({
    to: opts.email,
    subject: t.subject,
    html: t.html.replace(/\{\{unsubscribeUrl\}\}/g, "#"),
    text: t.text,
    tags: [{ name: "kind", value: "new_believer_welcome" }],
  });

  await db.insert(schema.emailCampaigns).values({
    slug: campaignSlug("new-believer-welcome", opts.email),
    subject: t.subject,
    bodyHtml: t.html,
    bodyText: t.text,
    audienceFilter: { email: opts.email, kind: "new_believer_welcome" },
    provider: "resend",
    status: id ? "sent" : "failed",
    sentAt: id ? new Date() : null,
    recipientCount: 1,
  }).catch(() => undefined);

  return { ok: !!id, error };
}
