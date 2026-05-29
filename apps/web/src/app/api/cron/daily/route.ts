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
    llmSermon: { ran: false, status: "skipped" as string, doctrineScore: 0, note: "" },
    emailsSent: 0,
    emailsFailed: 0,
    socialPushed: 0,
    socialPushFailed: 0,
    youtube: { ran: false, status: "skipped" as string },
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

    // -----------------------------------------------------------------------
    // LLM-driven steps. Each is independently env-gated and best-effort.
    // The static-schedule path above remains the safety net.
    // -----------------------------------------------------------------------

    // 1. If a real provider key + DB are present, try generating today's sermon
    //    through the doctrine-gated LLM pipeline. The pipeline reads the
    //    sermon_series calendar (seeded once) so the launch-schedule INSERT
    //    above doesn't conflict — different sermons, different slugs.
    const hasProvider = Boolean(
      process.env.CEREBRAS_KEY_CHAT ||
        process.env.CEREBRAS_KEY_SERMONS ||
        process.env.ANTHROPIC_API_KEY ||
        process.env.OPENAI_API_KEY,
    );
    if (database && hasProvider) {
      try {
        const { runSermonPipeline } = await import("../../../../../../../apps/worker/src/pipelines/sermon");
        const llm = await runSermonPipeline({ mode: "today" });
        result.llmSermon = {
          ran: true,
          status: llm.status,
          doctrineScore: llm.doctrineScore,
          note: llm.notes[llm.notes.length - 1] ?? "",
        };
      } catch (err) {
        result.llmSermon = {
          ran: true,
          status: "error",
          doctrineScore: 0,
          note: err instanceof Error ? err.message : "unknown error",
        };
      }
    }

    // 2. Send any due email campaigns via Resend.
    if (database && process.env.RESEND_API_KEY) {
      try {
        const { runEmailSendPipeline } = await import("../../../../../../../apps/worker/src/pipelines/email-send");
        const out = await runEmailSendPipeline({ limit: 200 });
        result.emailsSent = out.sent;
        result.emailsFailed = out.failed;
      } catch (err) {
        console.warn("[cron/daily] email send failed:", err);
      }
    }

    // 3. Push any queued social posts to Postiz.
    if (database && process.env.POSTIZ_API_KEY) {
      try {
        const { runSocialSendPipeline } = await import("../../../../../../../apps/worker/src/pipelines/social-send");
        const out = await runSocialSendPipeline({ limit: 50 });
        result.socialPushed = out.scheduled;
        result.socialPushFailed = out.failed;
      } catch (err) {
        console.warn("[cron/daily] social send failed:", err);
      }
    }

    // 4. If today's LLM sermon produced a video, kick the YouTube upload.
    if (database && process.env.YOUTUBE_REFRESH_TOKEN && process.env.S3_BUCKET) {
      try {
        const rows = await database.execute<{ id: string }>(sql`
          SELECT id FROM sermons
          WHERE scheduled_for::date = current_date
            AND status IN ('ready','published')
            AND video_url IS NOT NULL
            AND (video_url LIKE 'http%' AND video_url NOT LIKE '%youtube%')
          ORDER BY scheduled_for DESC LIMIT 1
        `);
        const sid = rows[0]?.id;
        if (sid) {
          const { uploadDailySermonToYouTube } = await import("../../../../../../../apps/worker/src/pipelines/sermon-to-youtube");
          const yt = await uploadDailySermonToYouTube(sid);
          result.youtube = { ran: true, status: yt.status };
        }
      } catch (err) {
        result.youtube = { ran: true, status: "error" };
        console.warn("[cron/daily] youtube upload failed:", err);
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

    // Reliability — fire-and-forget kick to the weekly backup orchestrator.
    // Real, paged backup runs on the dedicated /api/cron/weekly schedule (Sun
    // 02:00 UTC). This call exists so that on days when the weekly cron is
    // missed (Railway worker restart, schedule drift) we still get a recent
    // snapshot. The orchestrator self-skips if S3 isn't configured, so
    // calling it on every daily run is safe.
    if (process.env.S3_BUCKET && process.env.CRON_SECRET) {
      const base = (
        process.env.NEXT_PUBLIC_SITE_URL ??
        process.env.PUBLIC_SITE_URL ??
        process.env.SITE_URL ??
        "http://localhost:3000"
      ).replace(/\/$/, "");
      void fetch(`${base}/api/cron/weekly`, {
        method: "POST",
        headers: { authorization: `Bearer ${process.env.CRON_SECRET}` },
      }).catch((err) => console.warn("[cron/daily] weekly backup kick failed:", err));
    }

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
