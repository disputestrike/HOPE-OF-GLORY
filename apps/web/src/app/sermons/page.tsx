import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@hog/db";
import { sql } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Sermons",
  description:
    "Daily verse-by-verse teaching from Hope of Glory Ministry. Old Testament and New, in plain English, with scripture and prayer.",
};

type SermonRow = {
  id: string;
  slug: string;
  title: string;
  primary_passage: string;
  summary: string | null;
  published_at: Date | null;
  scheduled_for: Date | null;
  image_url: string | null;
  series_slug: string | null;
  series_title: string | null;
};

async function listSermons(): Promise<SermonRow[]> {
  try {
    return await db.execute<SermonRow>(sql`
      SELECT
        s.id, s.slug, s.title, s.primary_passage, s.summary,
        s.published_at, s.scheduled_for, s.image_url,
        series.slug as series_slug, series.title as series_title
      FROM sermons s
      LEFT JOIN sermon_series series ON series.id = s.series_id
      WHERE s.status IN ('published', 'ready')
      ORDER BY COALESCE(s.published_at, s.scheduled_for) DESC NULLS LAST
      LIMIT 50
    `);
  } catch (err) {
    console.warn("[sermons] DB unreachable, returning empty list:", err);
    return [];
  }
}

function fmtDate(d: Date | null): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function SermonsPage() {
  const sermons = await listSermons();

  return (
    <section className="section">
      <div className="container-prose">
        <header className="mb-12">
          <p className="eyebrow">Sermons</p>
          <h1>Verse by verse, day by day.</h1>
          <p className="text-muted max-w-readable" style={{ fontSize: "var(--fs-body-lg)" }}>
            Daily teaching from Old Testament and New. Each sermon includes Scripture,
            written notes, and prayer. New to the Bible? Start in the gospel of John.
          </p>
        </header>

        {sermons.length === 0 ? (
          <div className="card">
            <p className="card__eyebrow">Coming soon</p>
            <h3 className="m-0 mb-3">No sermons published yet</h3>
            <p className="m-0 text-muted">
              We are preparing the first daily sermon. Subscribe to the Daily Word to
              receive it the morning it goes live.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sermons.map((s) => (
              <Link
                key={s.id}
                href={`/sermons/${s.slug}` as `/sermons/${string}`}
                className="card block hover:no-underline"
              >
                <p className="card__eyebrow">
                  {s.series_title ?? "Sermon"} · {fmtDate(s.published_at ?? s.scheduled_for)}
                </p>
                <h3 className="m-0 mb-2 text-warm">{s.title}</h3>
                <p className="m-0 mb-3 text-gold text-sm">{s.primary_passage}</p>
                {s.summary ? (
                  <p className="m-0 text-muted text-sm">{s.summary}</p>
                ) : null}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
