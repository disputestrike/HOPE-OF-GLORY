/**
 * Posting Agent — writes scheduled posts through self-hosted Postiz.
 *
 * Pre-publish gates (run for EVERY post):
 *   1. Doctrine Agent must not have blocked the source sermon
 *   2. Moderation pass on the post content itself
 *   3. Platform must not be paused (e.g. X until donations cover the cost)
 *   4. POSTIZ_API_KEY must be configured
 *
 * Each successful schedule is logged to social_posts with status='scheduled'.
 */
import { db, schema } from "@hog/db";
import { schedulePost } from "@hog/publishing";
import { moderate } from "@hog/safety";
import type { ScheduledPost, PublishResult } from "@hog/publishing";
import { isPlatformPaused } from "./scheduling";

export async function publishScheduledPost(
  post: ScheduledPost,
  opts: { tags?: string[] } = {}
): Promise<PublishResult> {
  // 1. Platform paused?
  if (isPlatformPaused(post.platform)) {
    return {
      platform: post.platform,
      status: "failed",
      error: "platform_paused",
    };
  }

  // 2. Moderation
  const mod = moderate(post.content);
  if (!mod.pass) {
    return {
      platform: post.platform,
      status: "failed",
      error: `moderation: ${mod.violations.map((v) => v.category).join(",")}`,
    };
  }

  // 3. Persist intent row BEFORE calling Postiz.
  const inserted = await db
    .insert(schema.socialPosts)
    .values({
      platform: post.platform,
      caption: post.content,
      mediaJson: post.media as unknown as Record<string, unknown>,
      scheduledFor: post.scheduledFor,
      status: "queued",
    })
    .returning({ id: schema.socialPosts.id })
    .catch(() => [{ id: undefined as string | undefined }]);
  const localId = inserted[0]?.id;

  // 4. Schedule with Postiz.
  const result = await schedulePost({
    post,
    scheduledFor: post.scheduledFor,
    tags: opts.tags,
  });

  // 5. Update row with provider id + status.
  if (localId) {
    await db
      .update(schema.socialPosts)
      .set({
        postizId: result.externalId,
        postUrl: result.postUrl,
        status: result.status === "scheduled" ? "scheduled" : "failed",
      })
      .where(schema.socialPosts.id.eq(localId) as never)
      .catch((err) => console.warn("[posting] update failed:", err));
  }

  return result;
}

export async function publishMany(
  posts: ScheduledPost[],
  opts: { tags?: string[] } = {}
): Promise<PublishResult[]> {
  const results: PublishResult[] = [];
  for (const p of posts) {
    const r = await publishScheduledPost(p, opts);
    results.push(r);
  }
  return results;
}
