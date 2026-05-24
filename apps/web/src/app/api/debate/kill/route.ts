import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { db } from "@hog/db";
import { sql } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.redirect(new URL("/admin/login", request.url));

  // Log the kill action
  await db
    .execute(sql`
      INSERT INTO admin_actions (admin_user_id, action_type, target_table, target_id, after_json)
      VALUES (gen_random_uuid(), 'debate_kill_switch', 'live_events', NULL, ${JSON.stringify({ at: new Date().toISOString(), by: session.user.email })}::jsonb)
    `)
    .catch(() => undefined);

  // Try to end any in-progress broadcast
  await db
    .execute(sql`
      UPDATE live_events SET status = 'killed', ended_at = now()
      WHERE status = 'live'
    `)
    .catch(() => undefined);

  return NextResponse.redirect(new URL("/admin/debate", request.url), { status: 303 });
}
