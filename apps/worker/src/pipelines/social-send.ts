/**
 * Social send pipeline — picks up social_posts with status='queued' and
 * pushes them to Postiz on/before their scheduled time. Idempotent:
 * status transitions queued → scheduling → scheduled or failed.
 *
 * Postiz gate: returns { skipped: true } if POSTIZ_API_KEY missing.
 */
import { sql } from "drizzle-orm";
import { db } from "@hog/db";
import { schedulePost, type ComposedPost, type PublishResult } from "@hog/publishing";
import { isPlatformPaused } from "../agents/scheduling";
import type { Platform } from "@hog/shared";

export type SocialSendResult = {
  scanned: number;
  scheduled: number;
  failed: number;
  pausedSkipped: number;
  skipped: boolean;
  errors: Array<{ postId: string; platform: string; error: string }>;
};

type SocialRow = {
  id: string;
  platform: string;
  caption: string;
  media_json: Array<{ url?: string; mimeType?: string; altText?: string }> | null;
  scheduled_for: Date;
};

export async function runSocialSendPipeline(opts: { limit?: number } = {}): Promise<SocialSendResult> {
  if (!process.env.POSTIZ_API_KEY || !process.env.POSTIZ_URL) {
    return { scanned: 0, scheduled: 0, failed: 0, pausedSkipped: 0, skipped: true, errors: [] };
  }
  const limit = opts.limit ?? 50;

  const due = await db.execute<SocialRow>(sql`
    SELECT id, platform, caption, media_json, scheduled_for
    FROM social_posts
    WHERE status = 'queued'
      AND scheduled_for <= now() + interval '1 hour'
    ORDER BY scheduled_for ASC
    LIMIT ${limit}
  `).catch(() => [] as SocialRow[]);

  const result: SocialSendResult = {
    scanned: due.length,
    scheduled: 0,
    failed: 0,
    pausedSkipped: 0,
    skipped: false,
    errors: [],
  };

  for (const row of due) {
    if (isPlatformPaused(row.platform as Platform)) {
      await db.execute(sql`
        UPDATE social_posts SET status = 'paused', updated_at = now() WHERE id = ${row.id}
      `).catch(() => undefined);
      result.pausedSkipped += 1;
      continue;
    }

    // Claim to avoid double-send
    const claimed = await db.execute<{ id: string }>(sql`
      UPDATE social_posts SET status = 'scheduling', updated_at = now()
      WHERE id = ${row.id} AND status = 'queued'
      RETURNING id
    `).catch(() => [] as Array<{ id: string }>);
    if (claimed.length === 0) continue;

    const media = (row.media_json ?? [])
      .filter((m): m is { url: string; mimeType: string; altText?: string } => typeof m.url === "string" && typeof m.mimeType === "string")
      .map((m) => ({ url: m.url, mimeType: m.mimeType, altText: m.altText }));

    const post: ComposedPost = {
      platform: row.platform as Platform,
      content: row.caption,
      media,
    };

    let r: PublishResult;
    try {
      r = await schedulePost({ post, scheduledFor: new Date(row.scheduled_for) });
    } catch (err) {
      r = { platform: post.platform, status: "failed", error: err instanceof Error ? err.message : "unknown" };
    }

    if (r.status === "scheduled") {
      await db.execute(sql`
        UPDATE social_posts
        SET status = 'scheduled', postiz_id = ${r.externalId ?? null}, post_url = ${r.postUrl ?? null}, updated_at = now()
        WHERE id = ${row.id}
      `).catch(() => undefined);
      result.scheduled += 1;
    } else {
      await db.execute(sql`
        UPDATE social_posts
        SET status = 'failed', updated_at = now()
        WHERE id = ${row.id}
      `).catch(() => undefined);
      result.failed += 1;
      if (r.error && result.errors.length < 10) {
        result.errors.push({ postId: row.id, platform: row.platform, error: r.error });
      }
    }
  }

  return result;
}
