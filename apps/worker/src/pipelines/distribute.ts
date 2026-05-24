/**
 * Distribution pipeline — runs AFTER the sermon pipeline.
 *
 *   1. Load published sermon
 *   2. Summarize into a social pack
 *   3. Schedule platform-specific posts
 *   4. Publish via Postiz (one call per platform)
 *   5. Log every attempt to social_posts
 *
 * Triggered manually from /admin/sermons/[id] or on a cron after sermon publish.
 */
import { db } from "@hog/db";
import { sql } from "drizzle-orm";
import { summarizeSermon } from "../agents/summarize";
import { schedulePack } from "../agents/scheduling";
import { publishMany } from "../agents/posting";
import type { PublishResult } from "@hog/publishing";

export type DistributeResult = {
  sermonId: string;
  scheduled: number;
  failed: number;
  results: PublishResult[];
};

export async function distributeSermon(
  sermonId: string
): Promise<DistributeResult> {
  const rows = await db.execute<{
    id: string;
    title: string;
    primary_passage: string;
    summary: string | null;
    full_text: string | null;
    image_url: string | null;
  }>(sql`
    SELECT id, title, primary_passage, summary, full_text, image_url
    FROM sermons
    WHERE id = ${sermonId}
    LIMIT 1
  `);
  const sermon = rows[0];
  if (!sermon) throw new Error(`Sermon ${sermonId} not found`);
  if (!sermon.full_text) throw new Error(`Sermon ${sermonId} has no body — generate first`);

  const pack = await summarizeSermon({
    title: sermon.title,
    primaryPassage: sermon.primary_passage,
    bigIdea: sermon.summary ?? "",
    fullText: sermon.full_text,
  });
  if (!pack) {
    return { sermonId, scheduled: 0, failed: 0, results: [] };
  }

  const posts = schedulePack({
    sermonId,
    primaryPassage: sermon.primary_passage,
    pack,
    heroImageUrl: sermon.image_url ?? undefined,
  });

  const results = await publishMany(posts, {
    tags: ["sermon", sermon.primary_passage.replace(/\s+/g, "_")],
  });

  return {
    sermonId,
    scheduled: results.filter((r) => r.status === "scheduled").length,
    failed: results.filter((r) => r.status === "failed").length,
    results,
  };
}
