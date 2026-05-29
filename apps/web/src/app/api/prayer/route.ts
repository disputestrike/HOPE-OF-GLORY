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
import { sql } from "drizzle-orm";
import { z } from "zod";
import { features, PrayerPrivacy } from "@hog/shared";
import { redactPii, assess as assessCrisis } from "@hog/safety";
import { optionalDb } from "@/lib/server-db";
import { crisisDbSeverity, prayerRiskLevel } from "@/lib/ops";
import { publicRateLimit, rateLimitResponse, requestId } from "@/lib/request-guard";

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

function fallbackPrayer(): string {
  return "Father, we lift this need before you. You see and you hear. Jesus, you are near to the brokenhearted. Holy Spirit, comfort and lead. In the name of Jesus we pray. Amen.";
}

export async function POST(request: Request) {
  if (!features().prayer) {
    return NextResponse.json({ error: "Prayer is currently disabled" }, { status: 503 });
  }

  const rl = publicRateLimit(request, "prayer", { limit: 12, windowMs: 10 * 60 * 1000 });
  if (!rl.ok) return rateLimitResponse(rl);

  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const crisis = assessCrisis(body.content);
  const correlationId = requestId(request);

  let prayerText = fallbackPrayer();
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const { generateSermonPrayer } = await import("../../../../../worker/src/agents/prayer");
      prayerText = await generateSermonPrayer({
        title: "A prayer with you today",
        bigIdea: "We bring this need before the Father, through the Son, in the Spirit.",
        prayerFocus: redactPii(body.content).slice(0, 300),
      });
    } catch (err) {
      console.warn("[prayer] prayer generation failed:", err);
    }
  }

  let id: string | null = null;
  const database = await optionalDb("prayer");
  try {
    if (database) {
      const rows = await database.execute<{ id: string }>(sql`
        INSERT INTO prayer_requests (
          submitted_from, privacy_level, content, risk_level, follow_up_state, contact_email
        )
        VALUES (
          'web',
          ${body.privacyLevel},
          ${body.content},
          ${prayerRiskLevel(crisis.severity)},
          ${crisis.severity === "none" ? "pending" : "escalated"},
          ${body.email ?? null}
        )
        RETURNING id
      `);
      id = rows[0]?.id ?? null;
    }
  } catch (err) {
    console.warn("[prayer] DB insert failed:", err);
  }

  if (crisis.severity !== "none" && id && database) {
    try {
      await database.execute(sql`
        INSERT INTO crisis_events (
          trigger_phrase, severity, action_taken, escalated_to, metadata
        )
        VALUES (
          ${crisis.triggers.join("|")},
          ${crisisDbSeverity(crisis.severity)},
          ${crisis.recommendedAction},
          ${null},
          ${JSON.stringify({
            source: "prayer_request",
            prayerRequestId: id,
            surfaces: {
              lifeline988: crisis.surface_988,
              emergency911: crisis.surface_911,
            },
            correlationId,
          })}::jsonb
        )
      `);
      await database.execute(sql`
        INSERT INTO human_handoff (
          source_type, source_id, user_email, user_phone, reason, status, priority, metadata
        )
        VALUES (
          'prayer_request',
          ${id},
          ${body.email ?? null},
          ${body.phone ?? null},
          ${`Crisis signal detected: ${crisis.severity}`},
          'open',
          ${crisis.severity === "imminent" ? 1 : 2},
          ${JSON.stringify({ correlationId, recommendedAction: crisis.recommendedAction })}::jsonb
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
