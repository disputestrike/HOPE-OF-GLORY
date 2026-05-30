/**
 * Video pipeline — runs after the sermon pipeline has produced a published sermon.
 *   1. Load sermon
 *   2. Resolve scripture text from scripture_passages
 *   3. Render audio + hero video + reel via Video Agent
 *   4. Upsert sermon_assets rows
 *   5. Update sermons.audio_url and video_url
 */
import { db } from "@hog/db";
import { sql } from "drizzle-orm";
import { renderSermonAssets } from "../agents/video";

export type VideoPipelineResult = {
  sermonId: string;
  audioUrl: string;
  audioDurationSec: number;
  heroVideoUrl?: string;
  reelUrl?: string;
};

export async function runVideoPipeline(sermonId: string): Promise<VideoPipelineResult> {
  const rows = await db.execute<{
    id: string;
    title: string;
    primary_passage: string;
    full_text: string | null;
    image_url: string | null;
  }>(sql`
    SELECT id, title, primary_passage, full_text, image_url
    FROM sermons
    WHERE id = ${sermonId}
    LIMIT 1
  `);
  const sermon = rows[0];
  if (!sermon) throw new Error(`Sermon ${sermonId} not found`);
  if (!sermon.full_text) throw new Error("Sermon has no body");

  // Best-effort scripture text resolution; not fatal if empty.
  let scriptureText = "";
  try {
    const ref = sermon.primary_passage.match(/^([1-3]?\s?[A-Za-z]+(?:\s[A-Za-z]+)?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?/);
    if (ref) {
      const book = ref[1];
      const ch = Number.parseInt(ref[2] ?? "0", 10);
      const vs = ref[3] ? Number.parseInt(ref[3], 10) : null;
      const ve = ref[4] ? Number.parseInt(ref[4], 10) : vs;
      const verses = await db.execute<{ verse: number; text: string }>(sql`
        SELECT verse, text FROM scripture_passages
        WHERE book = ${book} AND chapter = ${ch} AND translation = 'WEB'
        ${vs !== null ? sql`AND verse >= ${vs}` : sql``}
        ${ve !== null ? sql`AND verse <= ${ve}` : sql``}
        ORDER BY verse ASC
      `);
      scriptureText = verses.map((v) => v.text).join(" ");
    }
  } catch {
    // ignore
  }

  const assets = await renderSermonAssets({
    sermonId: sermon.id,
    title: sermon.title,
    primaryPassage: sermon.primary_passage,
    scriptureText,
    fullText: sermon.full_text,
    heroImageUrl: sermon.image_url ?? undefined,
  });

  // Persist asset rows
  await db.execute(sql`
    INSERT INTO sermon_assets (sermon_id, asset_type, url, mime_type, duration_secs)
    VALUES
      (${sermon.id}, 'audio_full', ${assets.audioUrl}, 'audio/mpeg', ${assets.audioDurationSec})
    ON CONFLICT DO NOTHING
  `);
  if (assets.heroVideoUrl) {
    await db.execute(sql`
      INSERT INTO sermon_assets (sermon_id, asset_type, url, mime_type)
      VALUES (${sermon.id}, 'video_hero', ${assets.heroVideoUrl}, 'video/mp4')
      ON CONFLICT DO NOTHING
    `);
  }
  if (assets.reelUrl) {
    await db.execute(sql`
      INSERT INTO sermon_assets (sermon_id, asset_type, url, mime_type)
      VALUES (${sermon.id}, 'video_reel', ${assets.reelUrl}, 'video/mp4')
      ON CONFLICT DO NOTHING
    `);
  }

  await db.execute(sql`
    UPDATE sermons SET
      audio_url = ${assets.audioUrl},
      video_url = ${assets.heroVideoUrl ?? null}
    WHERE id = ${sermon.id}
  `);

  return { sermonId: sermon.id, ...assets };
}
