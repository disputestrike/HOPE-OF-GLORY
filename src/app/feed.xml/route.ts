/**
 * RSS 2.0 feed for sermons / daily messages. Standard for a content/media
 * ministry — enables syndication, readers, and podcast/automation pipelines.
 * Built from the curated launch schedule so the feed is never empty even
 * before the database is connected.
 */
import { LAUNCH_SERMONS } from "@/data/launch-schedule";

export const dynamic = "force-static";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hopeofglory.ministry";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function rfc822(iso: string): string {
  try {
    return new Date(iso).toUTCString();
  } catch {
    return new Date(0).toUTCString();
  }
}

export async function GET(): Promise<Response> {
  const sorted = [...LAUNCH_SERMONS].sort((a, b) =>
    a.scheduledFor < b.scheduledFor ? 1 : -1,
  );

  const items = sorted
    .map((s) => {
      const link = `${BASE}/sermons/${s.slug}`;
      const desc = `${s.summary} (${s.primaryPassage}, WEB)`;
      return [
        "    <item>",
        `      <title>${esc(s.title)}</title>`,
        `      <link>${esc(link)}</link>`,
        `      <guid isPermaLink="true">${esc(link)}</guid>`,
        `      <pubDate>${rfc822(s.scheduledFor)}</pubDate>`,
        `      <description>${esc(desc)}</description>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Hope of Glory Ministry — Sermons</title>
    <link>${BASE}/sermons</link>
    <atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Daily Scripture-grounded sermons and messages from Hope of Glory Ministry. Filling the earth with the knowledge of the glory of the Lord.</description>
    <language>en</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
