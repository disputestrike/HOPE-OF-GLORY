import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { optionalDb } from "@/lib/server-db";

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

export async function POST(request: Request) {
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
    } catch (err) {
      console.warn("[subscribe] upsert failed:", err);
    }
  }

  return NextResponse.json({
    ok: true,
    flow: body.flow,
    message: "Subscription received",
  });
}
