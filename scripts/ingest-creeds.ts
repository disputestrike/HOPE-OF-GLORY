/**
 * Ingest the three ecumenical creeds (Apostles', Nicene, Chalcedonian Definition).
 * All public domain.
 *
 * Run with: pnpm ingest:creeds
 */
import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { db, closeDb } from "@hog/db";
import { chunkBySection } from "@hog/rag";
import { openai } from "@hog/ai";
import { sql } from "drizzle-orm";

const CREEDS_DIR = path.resolve(process.cwd(), "../content/creeds");

function checksum(s: string): string {
  return createHash("sha256").update(s).digest("hex");
}

async function main(): Promise<void> {
  const entries = await readdir(CREEDS_DIR);
  const slugs = entries.filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));

  for (const slug of slugs) {
    const file = path.join(CREEDS_DIR, `${slug}.md`);
    const raw = await readFile(file, "utf8");
    const hash = checksum(raw);

    const src = await db.execute<{ id: string }>(sql`
      INSERT INTO sources (source_type, title, license_type, canonical_ref, version, language, status)
      VALUES ('creed', ${`Creed: ${slug}`}, 'public_domain', ${slug}, '1.0', 'en', 'active')
      ON CONFLICT (canonical_ref) DO UPDATE SET version = EXCLUDED.version
      RETURNING id
    `);
    const sid = src[0]?.id;
    if (!sid) continue;

    await db.execute(sql`DELETE FROM source_chunks WHERE source_id = ${sid}`);

    const chunks = chunkBySection(raw, 500, 700, 0.1);
    console.log(`[creeds] ${slug}: ${chunks.length} chunks`);

    for (const chunk of chunks) {
      const vector = await openai.embed(chunk.content);
      const cr = await db.execute<{ id: string }>(sql`
        INSERT INTO source_chunks (source_id, chunk_index, content, token_count, doctrine_tags, metadata_json)
        VALUES (${sid}, ${chunk.index}, ${chunk.content}, ${chunk.tokenEstimate}, ARRAY['creed', ${slug}]::text[], ${JSON.stringify({ checksum: hash })}::jsonb)
        RETURNING id
      `);
      const cid = cr[0]?.id;
      if (!cid) continue;
      const vec = `[${vector.join(",")}]`;
      await db.execute(sql`
        INSERT INTO embeddings (chunk_id, embedding_model, vector)
        VALUES (${cid}, 'text-embedding-3-small', ${vec}::vector)
      `);
    }
  }

  console.log("[creeds] complete.");
  await closeDb();
}

main().catch(async (err) => {
  console.error("[creeds] failed:", err);
  await closeDb();
  process.exit(1);
});
