/**
 * Prayer submission endpoint.
 *
 * POST /api/prayer
 *   body: { content, privacyLevel, name?, email?, phone? }
 *
 * Returns: { id, prayerText, crisis }
 *
 * If a crisis indicator is present, we generate a pastoral response inline AND
 * record a crisis_event so the founder can review within 24h.
 */
import { NextResponse } from "next/server";
import { db } from "@hog/db";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { features, PrayerPrivacy } from "@hog/shared";
import { redactPii, assess as assessCrisis } from "@hog/safety";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const BodySchema = z.object({
  content: z.string().min(2).max(4000),
  privacyLevel: PrayerPrivacy.default("anonymous"),
  name: z.string().max(120).optional(),
  email: z.string().email().max(200).optional(),
  phone: z.string().max(40).optional(),
});

export async function POST(request: Request) {
  if (!features().prayer) {
    return NextResponse.json({ error: "Prayer is currently disabled" }, { status: 503 });
  }

  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const crisis = assessCrisis(body.content);

  let prayerText = "";
  try {
    const { generateSermonPrayer } = await import("../../../../../worker/src/agents/prayer");
    prayerText = await generateSermonPrayer({
      title: "A prayer with you today",
      bigIdea: "We bring this need before the Father, through the Son, in the Spirit.",
      prayerFocus: redactPii(body.content).slice(0, 300),
    });
  } catch (err) {
    console.warn("[prayer] prayer generation failed:", err);
    prayerText =
      "Father, we lift this need before you. You see and you hear. Jesus, you are near to the brokenhearted. Holy Spirit, comfort and lead. In the name of Jesus we pray. Amen.";
  }

  let id: string | null = null;
  try {
    const rows = await db.execute<{ id: string }>(sql`
      INSERT INTO prayer_requests (
        submitted_from, privacy_level, content, risk_level, follow_up_state
      )
      VALUES (
        'web',
        ${body.privacyLevel},
        ${body.content},
        ${crisis.severity === "none" ? "low" : crisis.severity === "watch" ? "medium" : "high"},
        ${crisis.severity === "none" ? "queued" : "needs_human_review"}
      )
      RETURNING id
    `);
    id = rows[0]?.id ?? null;
  } catch (err) {
    console.warn("[prayer] DB insert failed:", err);
  }

  if (crisis.severity !== "none" && id) {
    try {
      await db.execute(sql`
        INSERT INTO crisis_events (
          chat_session_id, trigger_phrase, severity, action_taken, escalated_to
        )
        VALUES (
          ${id},
          ${crisis.triggers.join("|")},
          ${crisis.severity},
          ${crisis.recommendedAction},
          ${crisis.surface_988 ? "988" : null}
        )
      `);
    } catch (err) {
      console.warn("[prayer] crisis event log failed:", err);
    }
  }

  return NextResponse.json({
    id,
    prayerText,
    crisis: {
      severity: crisis.severity,
      surface_988: crisis.surface_988,
      surface_911: crisis.surface_911,
    },
  });
}
