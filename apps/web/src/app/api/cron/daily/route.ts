import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { getSocialQueue, getTodaysLaunchSermon } from "@/data/launch-schedule";
import { optionalDb } from "@/lib/server-db";
import { logJobRun } from "@/lib/ops";
import { requestId } from "@/lib/request-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret && process.env.APP_ENV !== "production") return true;
  const auth = request.headers.get("authorization");
  const url = new URL(request.url);
  return auth === `Bearer ${secret}` || url.searchParams.get("secret") === secret;
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const started = Date.now();
  const correlationId = requestId(request);
  const today = getTodaysLaunchSermon();
  const queue = getSocialQueue().filter((post) => new Date(post.scheduledFor) <= new Date());
  const database = await optionalDb("cron-daily");

  const result = {
    sermon: today.slug,
    socialQueued: 0,
    socialScheduledInPostiz: 0,
    emailCampaignsQueued: 0,
    db: Boolean(database),
  };

  try {
    if (database) {
      await database.execute(sql`
        INSERT INTO sermons (
          slug, primary_passage, supporting_passages, title, summary, full_text,
          prayer, call_to_action, status, scheduled_for, published_at, image_url, metadata
        )
        VALUES (
          ${today.slug},
          ${today.primaryPassage},
          ${today.supportingPassages},
          ${today.title},
          ${today.summary},
          ${today.fullText},
          ${today.prayer},
          ${today.callToAction},
          ${today.status},
          ${today.scheduledFor},
          ${today.status === "published" ? today.scheduledFor : null},
          ${today.imageUrl},
          ${JSON.stringify({ source: "daily_cron", correlationId })}::jsonb
        )
        ON CONFLICT (slug) DO UPDATE SET
          summary = EXCLUDED.summary,
          full_text = EXCLUDED.full_text,
          prayer = EXCLUDED.prayer,
          call_to_action = EXCLUDED.call_to_action,
          image_url = EXCLUDED.image_url,
          updated_at = now()
      `);

      for (const post of queue.slice(0, 25)) {
        await database.execute(sql`
          INSERT INTO social_posts (
            platform, caption, media_json, scheduled_for, status
          )
          VALUES (
            ${post.platform},
            ${post.caption},
            ${JSON.stringify([{ url: today.imageUrl, mimeType: "image/webp", altText: today.title }])}::jsonb,
            ${post.scheduledFor},
            ${process.env.POSTIZ_URL && process.env.POSTIZ_API_KEY ? "queued" : "scheduled"}
          )
          ON CONFLICT DO NOTHING
        `);
        result.socialQueued += 1;
      }

      await database.execute(sql`
        INSERT INTO email_campaigns (
          slug, subject, preheader, body_text, from_name, from_email,
          audience_filter, scheduled_for, status, recipient_count, provider
        )
        VALUES (
          ${`daily-faith-${new Date().toISOString().slice(0, 10)}`},
          ${`Daily Faith: ${today.title}`},
          ${today.primaryPassage},
          ${today.summary},
          ${process.env.EMAIL_FROM_NAME ?? "Hope of Glory Ministry"},
          ${process.env.EMAIL_FROM ?? "hello@hopeofglory.ministry"},
          ${JSON.stringify({ flow: "daily_faith" })}::jsonb,
          now(),
          ${process.env.RESEND_API_KEY && process.env.EMAIL_FROM ? "scheduled" : "draft"},
          0,
          'resend'
        )
        ON CONFLICT DO NOTHING
      `);
      result.emailCampaignsQueued = 1;
    }

    if (process.env.POSTIZ_URL && process.env.POSTIZ_API_KEY) {
      const { schedulePost } = await import("@hog/publishing");
      for (const post of queue.slice(0, 5)) {
        const scheduled = await schedulePost({
          scheduledFor: new Date(post.scheduledFor),
          tags: ["hope-of-glory", "daily"],
          post: {
            platform: post.platform as "facebook" | "instagram" | "x" | "youtube" | "linkedin",
            content: post.caption,
            media: [{ url: today.imageUrl, mimeType: "image/webp", altText: today.title }],
          },
        });
        if (scheduled.status === "scheduled") result.socialScheduledInPostiz += 1;
      }
    }

    await logJobRun({
      jobName: "daily_content_automation",
      queue: "cron",
      status: "succeeded",
      payload: { sermon: today.slug },
      result,
      correlationId,
      durationMs: Date.now() - started,
    });

    return NextResponse.json({ ok: true, result });
  } catch (err) {
    await logJobRun({
      jobName: "daily_content_automation",
      queue: "cron",
      status: "failed",
      payload: { sermon: today.slug },
      result,
      error: err,
      correlationId,
      durationMs: Date.now() - started,
    });
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Daily cron failed", result },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  return POST(request);
}
