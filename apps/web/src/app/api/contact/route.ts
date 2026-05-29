/**
 * Contact form submission. Creates a contact_submissions row + (if pastoral) a
 * human_handoff row so the founder sees it in the queue.
 */
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { HumanHandoffReason } from "@hog/shared";
import { optionalDb } from "@/lib/server-db";
import { publicRateLimit, rateLimitResponse } from "@/lib/request-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const Body = z.object({
  name: z.string().max(120).optional(),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional(),
  reason: HumanHandoffReason.default("user_requested_human"),
  message: z.string().min(2).max(4000),
});

export async function POST(request: Request) {
  const rl = publicRateLimit(request, "contact", { limit: 8, windowMs: 60 * 60 * 1000 });
  if (!rl.ok) return rateLimitResponse(rl);

  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  let contactId: string | null = null;
  const database = await optionalDb("contact");
  try {
    if (database) {
      const rows = await database.execute<{ id: string }>(sql`
        INSERT INTO contact_submissions (name, email, phone, message, source_page)
        VALUES (${body.name ?? null}, ${body.email}, ${body.phone ?? null}, ${body.message}, '/contact')
        RETURNING id
      `);
      contactId = rows[0]?.id ?? null;
    }
  } catch (err) {
    console.warn("[contact] db insert failed:", err);
  }

  try {
    if (database && contactId) {
      await database.execute(sql`
        INSERT INTO human_handoff (source_type, source_id, user_email, user_phone, reason, status, notes)
        VALUES ('contact_submission', ${contactId}, ${body.email}, ${body.phone ?? null}, ${body.reason}, 'open', ${body.message.slice(0, 500)})
      `);
    }
  } catch (err) {
    console.warn("[contact] handoff insert failed:", err);
  }

  // Fire-and-forget acknowledgment email.
  void (async () => {
    try {
      const { ackPrayerRequest } = await import("../../../../../worker/src/agents/contact");
      await ackPrayerRequest({
        email: body.email,
        givenName: body.name,
        prayerRequestId: contactId ?? "(no id)",
      });
    } catch (err) {
      console.warn("[contact] ack send failed:", err);
    }
  })();

  return NextResponse.json({ ok: true, id: contactId });
}
