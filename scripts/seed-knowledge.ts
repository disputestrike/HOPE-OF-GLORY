/**
 * Seeds The Scroll and Read library into the source_chunks table so Ask Hope
 * has a first-party knowledge base to retrieve from once embeddings are added.
 */
import postgres from "postgres";
import { SCROLL_TOPICS } from "../src/data/scroll-topics";
import { HUBS } from "../src/data/read-library";

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("DATABASE_URL is required for knowledge seeding.");
  process.exit(1);
}

function tokenEstimate(text: string): number {
  return Math.ceil(text.split(/\s+/).filter(Boolean).length * 1.35);
}

async function sourceId(sql: postgres.Sql, title: string, canonicalRef: string): Promise<string> {
  const existing = await sql<{ id: string }[]>`
    SELECT id FROM sources WHERE title = ${title} AND canonical_ref = ${canonicalRef} LIMIT 1
  `;
  if (existing[0]?.id) return existing[0].id;

  const inserted = await sql<{ id: string }[]>`
    INSERT INTO sources (
      source_type, title, author, license_type, canonical_ref, language, status, ingested_at, metadata
    )
    VALUES (
      'article', ${title}, 'Hope of Glory Ministry', 'proprietary', ${canonicalRef}, 'en', 'indexed', now(),
      ${JSON.stringify({ seed: "first_party_knowledge" })}::jsonb
    )
    RETURNING id
  `;
  return inserted[0]!.id;
}

async function main(): Promise<void> {
  const sql = postgres(dbUrl!, {
    max: 1,
    ssl: process.env.DATABASE_SSL === "require" ? "require" : undefined,
  });

  let chunks = 0;

  const scrollSource = await sourceId(sql, "The Scroll", "scroll");
  for (let i = 0; i < SCROLL_TOPICS.length; i += 1) {
    const topic = SCROLL_TOPICS[i]!;
    const content = [
      topic.title,
      topic.summary,
      topic.coreClaim,
      `Scriptures: ${topic.keyScriptures.join(", ")}`,
      `Subtopics: ${topic.subtopics.join(", ")}`,
    ].join("\n");
    await sql`
      INSERT INTO source_chunks (
        source_id, chunk_index, content, token_count, topic, doctrine_tags, metadata_json
      )
      VALUES (
        ${scrollSource}, ${i}, ${content}, ${tokenEstimate(content)}, ${topic.title},
        ${topic.subtopics}, ${JSON.stringify({ slug: topic.slug, category: topic.category })}::jsonb
      )
      ON CONFLICT (source_id, chunk_index) DO UPDATE SET
        content = EXCLUDED.content,
        token_count = EXCLUDED.token_count,
        topic = EXCLUDED.topic,
        doctrine_tags = EXCLUDED.doctrine_tags,
        metadata_json = EXCLUDED.metadata_json
    `;
    chunks += 1;
  }

  const readSource = await sourceId(sql, "Read Library", "read-library");
  let index = 0;
  for (const hub of Object.values(HUBS)) {
    for (const article of hub.articles) {
      const content = [
        hub.title,
        article.title,
        article.subtitle,
        article.shortAnswer,
        `Scriptures: ${article.keyScriptures.map((s) => s.ref).join(", ")}`,
      ].join("\n");
      await sql`
        INSERT INTO source_chunks (
          source_id, chunk_index, content, token_count, topic, doctrine_tags, metadata_json
        )
        VALUES (
          ${readSource}, ${index}, ${content}, ${tokenEstimate(content)}, ${article.title},
          ${[hub.slug]}, ${JSON.stringify({ hub: hub.slug, article: article.slug })}::jsonb
        )
        ON CONFLICT (source_id, chunk_index) DO UPDATE SET
          content = EXCLUDED.content,
          token_count = EXCLUDED.token_count,
          topic = EXCLUDED.topic,
          doctrine_tags = EXCLUDED.doctrine_tags,
          metadata_json = EXCLUDED.metadata_json
      `;
      index += 1;
      chunks += 1;
    }
  }

  await sql.end();
  console.log(`Seeded ${chunks} first-party knowledge chunks.`);
}

main().catch((err) => {
  console.error("Knowledge seeding failed:", err);
  process.exit(1);
});

