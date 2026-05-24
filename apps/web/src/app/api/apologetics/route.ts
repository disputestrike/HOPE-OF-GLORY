import { NextResponse } from "next/server";
import { z } from "zod";
import { features } from "@hog/shared";
import { db } from "@hog/db";
import { sql } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 90;

const Body = z.object({
  question: z.string().min(2).max(2000),
  audience: z.enum(["seeker", "believer", "skeptic"]).optional(),
  sessionId: z.string().uuid().optional(),
});

export async function POST(request: Request) {
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { answerObjection } = await import("../../../../../worker/src/agents/apologetics");
  const result = await answerObjection({ question: body.question, audience: body.audience });

  // Log
  try {
    await db.execute(sql`
      INSERT INTO chat_messages (session_id, role, content, agent_name)
      VALUES (
        COALESCE(${body.sessionId}, gen_random_uuid()),
        'assistant',
        ${JSON.stringify(result)},
        'apologetics'
      )
    `);
  } catch {}

  return NextResponse.json(result);
}
