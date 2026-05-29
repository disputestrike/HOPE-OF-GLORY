import Link from "next/link";
import type { Metadata } from "next";
import { sql } from "drizzle-orm";
import {
  formatLaunchDate,
  getStaticSermons,
  getTodaysLaunchSermon,
} from "@/data/launch-schedule";
import { optionalDb } from "@/lib/server-db";

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

type SermonCard = {
  id: string;
  slug: string;
  title: string;
  primaryPassage: string;
  summary: string | null;
  date: Date | string | null;
  imageUrl: string | null;
  seriesTitle: string | null;
};

async function listSermons(): Promise<SermonRow[]> {
  const database = await optionalDb("sermons");
  if (!database) return [];
  try {
    return await database.execute<SermonRow>(sql`
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
    console.warn("[sermons] DB unreachable, using launch schedule:", err);
    return [];
  }
}

function fmtDate(value: Date | string | null): string {
  if (!value) return "";
  return formatLaunchDate(value);
}

export default async function SermonsPage() {
  const dbSermons = await listSermons();
  const sermons: SermonCard[] =
    dbSermons.length > 0
      ? dbSermons.map((s) => ({
          id: s.id,
          slug: s.slug,
          title: s.title,
          primaryPassage: s.primary_passage,
          summary: s.summary,
          date: s.published_at ?? s.scheduled_for,
          imageUrl: s.image_url,
          seriesTitle: s.series_title,
        }))
      : getStaticSermons().map((s) => ({
          id: s.id,
          slug: s.slug,
          title: s.title,
          primaryPassage: s.primaryPassage,
          summary: s.summary,
          date: s.scheduledFor,
          imageUrl: s.imageUrl,
          seriesTitle: s.seriesTitle,
        }));

  const today = getTodaysLaunchSermon();

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

        <section className="card mb-8">
          <p className="card__eyebrow">Today's message</p>
          <h2 className="m-0 mb-2" style={{ fontSize: "var(--fs-h3)" }}>
            {today.title}
          </h2>
          <p className="m-0 mb-3 text-gold">{today.primaryPassage}</p>
          <p className="m-0 mb-5 text-muted">{today.summary}</p>
          <Link href={`/sermons/${today.slug}` as `/sermons/${string}`} className="btn btn--primary">
            Read today's sermon
          </Link>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sermons.map((s) => (
            <Link
              key={s.id}
              href={`/sermons/${s.slug}` as `/sermons/${string}`}
              className="card block hover:no-underline"
            >
              <p className="card__eyebrow">
                {s.seriesTitle ?? "Sermon"} - {fmtDate(s.date)}
              </p>
              <h3 className="m-0 mb-2 text-warm">{s.title}</h3>
              <p className="m-0 mb-3 text-gold text-sm">{s.primaryPassage}</p>
              {s.summary ? <p className="m-0 text-muted text-sm">{s.summary}</p> : null}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

