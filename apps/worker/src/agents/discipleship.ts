/**
 * Discipleship Agent — runs the 30-day new believer email sequence.
 */
import { db } from "@hog/db";
import { sql } from "drizzle-orm";
import { sendEmail } from "@hog/email";
import { NEW_BELIEVER_CURRICULUM } from "../curricula/new-believer-30day";

export async function enrollNewBeliever(opts: {
  email: string;
  givenName?: string;
}): Promise<{ ok: boolean; enrolled: boolean }> {
  const email = opts.email.toLowerCase().trim();
  // Upsert subscriber
  try {
    await db.execute(sql`
      INSERT INTO email_subscribers (email, status, source_page, opted_in_at, name)
      VALUES (${email}, 'new_believer_day_0', '/new-believers', now(), ${opts.givenName ?? null})
      ON CONFLICT (email) DO UPDATE SET
        status = 'new_believer_day_0',
        opted_in_at = COALESCE(email_subscribers.opted_in_at, EXCLUDED.opted_in_at)
    `);
  } catch (err) {
    console.warn("[discipleship] enroll failed:", err);
  }

  // Send day 1 immediately
  await sendDailyEmail(email).catch((err) => console.warn("[discipleship] day1 send failed:", err));

  return { ok: true, enrolled: true };
}

export async function sendDailyEmail(emailLower: string): Promise<{ ok: boolean; day: number | null }> {
  const rows = await db.execute<{ status: string; name: string | null }>(sql`
    SELECT status, name FROM email_subscribers WHERE email = ${emailLower} LIMIT 1
  `);
  const subscriber = rows[0];
  if (!subscriber) return { ok: false, day: null };

  const match = /new_believer_day_(\d+)/.exec(subscriber.status);
  const dayIndex = match?.[1] ? Number.parseInt(match[1], 10) : 0;
  const next = NEW_BELIEVER_CURRICULUM[dayIndex];
  if (!next) {
    // Completed
    await db.execute(sql`
      UPDATE email_subscribers SET status = 'new_believer_completed' WHERE email = ${emailLower}
    `);
    return { ok: true, day: null };
  }

  const subject = `Day ${next.day}: ${next.theme}`;
  const html = renderDayHtml(subscriber.name, next);
  const text = renderDayText(subscriber.name, next);

  const { id, error } = await sendEmail({
    to: emailLower,
    subject,
    html,
    text,
    tags: [{ name: "sequence", value: "new_believer" }, { name: "day", value: String(next.day) }],
  });

  await db.execute(sql`
    INSERT INTO email_campaigns (provider, template_key, audience, status, sent_at, recipient_count)
    VALUES ('resend', ${`new_believer_day_${next.day}`}, ${emailLower}, ${id ? "sent" : "failed"}, ${id ? new Date() : null}, 1)
  `).catch(() => undefined);

  if (id) {
    await db.execute(sql`
      UPDATE email_subscribers SET status = ${`new_believer_day_${next.day}`}
      WHERE email = ${emailLower}
    `).catch(() => undefined);
  }

  return { ok: !!id, day: next.day };
}

function renderDayHtml(givenName: string | null, day: typeof NEW_BELIEVER_CURRICULUM[number]): string {
  const greeting = givenName ? `, ${givenName}` : "";
  return `<!DOCTYPE html><html><body style="font-family:Inter,system-ui,sans-serif;color:#FFF8E7;background:#050B18;margin:0;padding:0;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#050B18;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#0B1F3A;max-width:600px;">
<tr><td style="padding:32px;text-align:center;">
  <div style="font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;letter-spacing:0.18em;color:#FFF8E7;text-transform:uppercase;">HOPE OF GLORY</div>
  <div style="font-size:11px;letter-spacing:0.4em;color:#D4AF37;margin-top:4px;">MINISTRY</div>
</td></tr>
<tr><td style="padding:0 32px 32px;">
  <h1 style="font-family:'Cormorant Garamond',serif;font-size:28px;color:#FFF8E7;margin:24px 0 8px;">Day ${day.day}${greeting}</h1>
  <h2 style="font-family:'Cormorant Garamond',serif;font-size:20px;color:#D4AF37;margin:0 0 24px;">${day.theme}</h2>
  <p style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#D4AF37;margin:0 0 8px;">${day.scriptureRef} · WEB</p>
  <p style="font-size:17px;color:#FFF8E7;"><strong>Reading plan:</strong> ${day.readingPlan}</p>
  <p style="font-size:17px;color:#FFF8E7;"><strong>Prayer:</strong> ${day.prayerPrompt}</p>
  <p style="font-size:17px;color:#FFF8E7;"><strong>Reflection:</strong> ${day.reflectionQuestion}</p>
</td></tr>
<tr><td style="padding:24px 32px 32px;border-top:1px solid rgba(255,248,231,0.12);font-size:13px;color:rgba(255,248,231,0.6);">
  <p style="margin:0 0 8px;">Washington, D.C. · hopeofglory.ministry</p>
  <p style="margin:0;">You're on day ${day.day} of 30. <a href="{{unsubscribeUrl}}" style="color:#D4AF37;">Unsubscribe</a>.</p>
</td></tr></table></td></tr></table></body></html>`;
}

function renderDayText(givenName: string | null, day: typeof NEW_BELIEVER_CURRICULUM[number]): string {
  const greeting = givenName ? `, ${givenName}` : "";
  return `Day ${day.day}${greeting}: ${day.theme}\n\n${day.scriptureRef} (WEB)\n\nReading plan: ${day.readingPlan}\n\nPrayer: ${day.prayerPrompt}\n\nReflection: ${day.reflectionQuestion}`;
}
