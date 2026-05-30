/**
 * Daily cron — iterates all new-believer subscribers and sends the next day's email.
 * Protect with X-Cron-Secret header.
 */
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { optionalDb } from "@/lib/server-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 600;

export async function POST(request: Request) {
  const secret = request.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const database = await optionalDb("new-believer-cron");
  const subs = database
    ? await database.execute<{ email: string }>(sql`
        SELECT email FROM email_subscribers
        WHERE status LIKE 'new_believer_day_%'
          AND status != 'new_believer_completed'
          AND unsubscribed_at IS NULL
      `).catch(() => [])
    : [];

  const { sendDailyEmail } = await import("@/server/worker/agents/discipleship");
  let sent = 0;
  for (const s of subs) {
    const result = await sendDailyEmail(s.email).catch(() => ({ ok: false }));
    if (result.ok) sent += 1;
  }

  return NextResponse.json({ ok: true, processed: subs.length, sent });
}
