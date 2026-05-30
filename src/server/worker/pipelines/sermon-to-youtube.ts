/**
 * Sermon → YouTube pipeline.
 *
 *   1. Load sermon row (must have a video_url from the Video Agent).
 *   2. If YOUTUBE_REFRESH_TOKEN + OAuth client are not configured, skip.
 *   3. Compose title + description + tags.
 *   4. Resumable upload to YouTube as UNLISTED (admin reviews before promote).
 *   5. Record the YouTube URL in sermon_assets (asset_type='video_youtube')
 *      and update sermons.video_url to point at YouTube.
 *
 * Idempotency: if a sermon_assets row of type 'video_youtube' already exists
 * for this sermon, we skip and return its URL — re-uploading would create
 * duplicate videos on the channel.
 *
 * Failure mode: any failure returns status='failed' with a reason. The cron
 * caller logs but does not retry inside this process; the admin queue picks
 * it up via the standard daily review.
 */
import { db } from "@hog/db";
import { sql } from "drizzle-orm";
// Cross-app import. The worker doesn't declare a workspace dep on `stream`
// because stream owns runtime-only services (OBS scene relay), but we re-use
// the YouTube auth + uploader logic. The relative path matches the apologetics
// API route's pattern of reaching across workspaces for pure functions.
import { uploadVideo } from "@/server/stream/youtube-upload";

export type SermonToYouTubeResult = {
  videoId: string | null;
  status: "uploaded" | "skipped" | "failed";
  reason?: string;
};

type SermonRow = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  primary_passage: string;
  video_url: string | null;
};

function youtubeConfigured(): boolean {
  if (!process.env.YOUTUBE_REFRESH_TOKEN) return false;
  const hasClient =
    (process.env.YOUTUBE_OAUTH_CLIENT_ID || process.env.GOOGLE_CLIENT_ID) &&
    (process.env.YOUTUBE_OAUTH_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET);
  return Boolean(hasClient);
}

/**
 * Best-effort book extraction: "John 1:14" → "John". Used as the third tag
 * so viewers searching for a book find the sermon.
 */
function bookFromPassage(passage: string): string | null {
  const m = passage.match(/^([1-3]?\s?[A-Za-z]+(?:\s[A-Za-z]+)?)/);
  return m?.[1]?.trim() ?? null;
}

function siteBase(): string {
  return process.env.SITE_PUBLIC_URL?.replace(/\/$/, "") ?? "https://hopeofglory.ministry";
}

/**
 * Compose the YouTube description. Keeps a tight structure so the YouTube
 * page reads as: scripture ref, summary excerpt, link back to the canonical
 * sermon page on our site (so we own the relationship, not the platform).
 */
function buildDescription(sermon: SermonRow): string {
  const summary = (sermon.summary ?? "").trim().slice(0, 500);
  const lines = [
    `${sermon.title}`,
    `Scripture: ${sermon.primary_passage}`,
    "",
  ];
  if (summary) {
    lines.push(summary);
    lines.push("");
  }
  lines.push(
    `Read or listen to the full sermon: ${siteBase()}/sermons/${sermon.slug}`,
  );
  lines.push("");
  lines.push("Hope of Glory Ministry");
  return lines.join("\n");
}

export async function uploadDailySermonToYouTube(
  sermonId: string,
): Promise<SermonToYouTubeResult> {
  // 1. Load sermon
  const rows = await db.execute<SermonRow>(sql`
    SELECT id, slug, title, summary, primary_passage, video_url
    FROM sermons
    WHERE id = ${sermonId}
    LIMIT 1
  `);
  const sermon = rows[0];
  if (!sermon) {
    return { videoId: null, status: "failed", reason: "sermon_not_found" };
  }
  if (!sermon.video_url) {
    return { videoId: null, status: "skipped", reason: "no_video_url" };
  }

  // 2. Env gate.
  if (!youtubeConfigured()) {
    return { videoId: null, status: "skipped", reason: "youtube_not_configured" };
  }

  // 3. Idempotency: if we've already uploaded, return the existing URL.
  const existing = await db.execute<{ url: string }>(sql`
    SELECT url FROM sermon_assets
    WHERE sermon_id = ${sermonId} AND asset_type = 'video_youtube'
    LIMIT 1
  `);
  if (existing[0]?.url) {
    const m = existing[0].url.match(/[?&]v=([^&]+)|youtu\.be\/([^?]+)/);
    return {
      videoId: m?.[1] ?? m?.[2] ?? null,
      status: "skipped",
      reason: "already_uploaded",
    };
  }

  // 4. Build metadata + upload.
  const book = bookFromPassage(sermon.primary_passage);
  const tags = ["hopeofglory", "sermon", "christian"];
  if (book) tags.push(book);

  let result;
  try {
    result = await uploadVideo({
      videoUrl: sermon.video_url,
      title: sermon.title,
      description: buildDescription(sermon),
      tags,
      privacyStatus: "unlisted", // admin promotes from /admin/sermons/{id}
    });
  } catch (err) {
    return {
      videoId: null,
      status: "failed",
      reason: err instanceof Error ? err.message : "upload_failed",
    };
  }

  // 5. Persist. We record a sermon_assets row (preserves the S3 URL on
  //    sermons.video_url if it was originally S3, while marking that the
  //    YouTube edition exists) and ALSO update sermons.video_url to the
  //    YouTube canonical URL since the site player can embed YouTube once
  //    the admin promotes the video to public.
  try {
    await db.execute(sql`
      INSERT INTO sermon_assets (sermon_id, asset_type, url, mime_type, metadata)
      VALUES (
        ${sermon.id},
        'video_youtube',
        ${result.videoUrl},
        'video/mp4',
        ${sql`${JSON.stringify({ videoId: result.videoId, privacyStatus: "unlisted" })}::jsonb`}
      )
    `);
    await db.execute(sql`
      UPDATE sermons SET video_url = ${result.videoUrl} WHERE id = ${sermon.id}
    `);
  } catch (err) {
    // Upload succeeded but persistence failed — still return uploaded so the
    // admin can reconcile manually. The duplicate-upload guard above checks
    // sermon_assets, so the operator should patch that row before re-running.
    return {
      videoId: result.videoId,
      status: "uploaded",
      reason: `db_persist_failed: ${err instanceof Error ? err.message : "unknown"}`,
    };
  }

  return { videoId: result.videoId, status: "uploaded" };
}
