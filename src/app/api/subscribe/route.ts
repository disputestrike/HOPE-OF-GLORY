import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { optionalDb } from "@/lib/server-db";
import { FORTY_DAY_JOURNEY } from "@/data/forty-day-journey";
import { HURTING_HEART_JOURNEY } from "@/data/thirty-day-hurting-heart";
import { publicRateLimit, rateLimitResponse } from "@/lib/request-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  email: z.string().email().max(200),
  name: z.string().max(120).optional(),
  flow: z.enum(["forty_day", "hurting_heart", "daily_faith", "weekly_digest"]),
  sourcePage: z.string().min(1).max(512),
});

function consentText(flow: z.infer<typeof Body>["flow"]): string {
  switch (flow) {
    case "forty_day":
      return "Send me the 40-Day Hope of Glory Journey emails.";
    case "hurting_heart":
      return "Send me the 30-Day Hope for the Hurting Heart emails.";
    case "daily_faith":
      return "Send me Daily Faith emails.";
    case "weekly_digest":
      return "Send me the Hope of Glory weekly digest.";
  }
}

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://hopeofglory.ministry").replace(/\/$/, "");
}

async function sendFirstLifecycleEmail(body: z.infer<typeof Body>, email: string): Promise<string> {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) return "scheduled";

  const emailClient = await import("@hog/email");
  const givenName = body.name;

  if (body.flow === "forty_day") {
    const day = FORTY_DAY_JOURNEY[0];
    if (!day) return "scheduled";
    const result = await emailClient.sendFortyDayJourneyDayEmail({
      to: email,
      givenName,
      ctaUrl: `${siteUrl()}/journey/40-day/1`,
      day,
    });
    return result.error ? "scheduled" : "sent";
  }

  if (body.flow === "hurting_heart") {
    const day = HURTING_HEART_JOURNEY[0];
    if (!day) return "scheduled";
    const result = await emailClient.sendHurtingHeartDayEmail({
      to: email,
      givenName,
      ctaUrl: `${siteUrl()}/journey/hope-for-the-hurting-heart/1`,
      day,
    });
    return result.error ? "scheduled" : "sent";
  }

  if (body.flow === "daily_faith") {
    const day = FORTY_DAY_JOURNEY[new Date().getDate() % FORTY_DAY_JOURNEY.length] ?? FORTY_DAY_JOURNEY[0];
    if (!day) return "scheduled";
    const result = await emailClient.sendDailyFaithEmail({
      to: email,
      givenName,
      subject: day.theme,
      scriptureRef: day.scriptureRef,
      scriptureText: day.scriptureText,
      reflection: day.reflection,
      prayer: day.prayer,
      askUrl: `${siteUrl()}/daily-faith`,
    });
    return result.error ? "scheduled" : "sent";
  }

  const result = await emailClient.sendWeeklyDigestEmail({
    to: email,
    weekOf: new Date().toISOString().slice(0, 10),
    featuredArticle: {
      title: "Trust the Scriptures",
      url: `${siteUrl()}/trust-the-scriptures`,
      hub: "The Scroll",
    },
    featuredJourneyDay: {
      day: 1,
      theme: "The Earth Shall Be Filled",
      url: `${siteUrl()}/journey/40-day/1`,
    },
  });
  return result.error ? "scheduled" : "sent";
}

export async function POST(request: Request) {
  const rl = publicRateLimit(request, "subscribe", { limit: 10, windowMs: 60 * 60 * 1000 });
  if (!rl.ok) return rateLimitResponse(rl);

  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = body.email.toLowerCase().trim();
  const database = await optionalDb("subscribe");

  if (database) {
    try {
      await database.execute(sql`
        INSERT INTO email_subscribers (
          email, name, status, source_page, consent_text, opted_in_at, metadata
        )
        VALUES (
          ${email},
          ${body.name ?? null},
          'confirmed',
          ${body.sourcePage},
          ${consentText(body.flow)},
          now(),
          ${JSON.stringify({ flow: body.flow, sourcePage: body.sourcePage })}::jsonb
        )
        ON CONFLICT (email) DO UPDATE SET
          name = COALESCE(EXCLUDED.name, email_subscribers.name),
          status = CASE
            WHEN email_subscribers.status = 'unsubscribed' THEN email_subscribers.status
            ELSE 'confirmed'
          END,
          source_page = EXCLUDED.source_page,
          consent_text = EXCLUDED.consent_text,
          opted_in_at = COALESCE(email_subscribers.opted_in_at, EXCLUDED.opted_in_at),
          metadata = COALESCE(email_subscribers.metadata, '{}'::jsonb) || EXCLUDED.metadata,
          updated_at = now()
      `);
      await database.execute(sql`
        INSERT INTO email_campaigns (
          slug, subject, preheader, body_text, from_name, from_email,
          audience_filter, scheduled_for, status, recipient_count, provider
        )
        VALUES (
          ${`${body.flow}-welcome-${Date.now()}`},
          ${consentText(body.flow)},
          ${"First touch queued for this subscription."},
          ${`Flow: ${body.flow}. Source page: ${body.sourcePage}.`},
          ${process.env.EMAIL_FROM_NAME ?? "Hope of Glory Ministry"},
          ${process.env.EMAIL_FROM ?? "hello@hopeofglory.ministry"},
          ${JSON.stringify({ email, flow: body.flow })}::jsonb,
          now(),
          ${process.env.RESEND_API_KEY && process.env.EMAIL_FROM ? "sending" : "scheduled"},
          1,
          'resend'
        )
        ON CONFLICT DO NOTHING
      `);
    } catch (err) {
      console.warn("[subscribe] upsert failed:", err);
    }
  }

  const delivery = await sendFirstLifecycleEmail(body, email).catch((err) => {
    console.warn("[subscribe] first lifecycle email failed:", err);
    return "scheduled";
  });

  return NextResponse.json({
    ok: true,
    flow: body.flow,
    delivery,
    message:
      delivery === "sent"
        ? "Subscription received. The first email has been sent."
        : "Subscription received. The lifecycle flow is queued.",
  });
}
