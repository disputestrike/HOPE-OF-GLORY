/**
 * Resend email client.
 *
 * Used for:
 *   - Prayer follow-up acknowledgments
 *   - Contact form receipt
 *   - Daily Word devotional (subscribers)
 *   - New believer 30-day sequence
 *
 * All sends are logged to email_campaigns / email_logs for audit.
 */
import { Resend } from "resend";

let _client: Resend | null = null;
function client(): Resend {
  if (_client) return _client;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY not set");
  _client = new Resend(key);
  return _client;
}

export type SendEmailOpts = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  tags?: Array<{ name: string; value: string }>;
};

export async function sendEmail(
  opts: SendEmailOpts
): Promise<{ id: string | null; error?: string }> {
  const from = `${process.env.EMAIL_FROM_NAME ?? "Hope of Glory Ministry"} <${process.env.EMAIL_FROM ?? "hello@hopeofglory.ministry"}>`;
  try {
    const res = await client().emails.send({
      from,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      replyTo: opts.replyTo,
      tags: opts.tags,
    });
    if (res.error) {
      return { id: null, error: res.error.message };
    }
    return { id: res.data?.id ?? null };
  } catch (err) {
    return { id: null, error: err instanceof Error ? err.message : "Unknown" };
  }
}
