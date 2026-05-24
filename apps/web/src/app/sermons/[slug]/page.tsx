import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@hog/db";
import { sql } from "drizzle-orm";
import { marked } from "marked";

type SermonRow = {
  id: string;
  slug: string;
  title: string;
  primary_passage: string;
  summary: string | null;
  full_text: string | null;
  prayer: string | null;
  call_to_action: string | null;
  published_at: Date | null;
  scheduled_for: Date | null;
  image_url: string | null;
  series_slug: string | null;
  series_title: string | null;
  series_theme: string | null;
};

async function getSermon(slug: string): Promise<SermonRow | null> {
  try {
    const rows = await db.execute<SermonRow>(sql`
      SELECT
        s.id, s.slug, s.title, s.primary_passage, s.summary, s.full_text, s.prayer,
        s.call_to_action, s.published_at, s.scheduled_for, s.image_url,
        series.slug as series_slug, series.title as series_title, series.theme as series_theme
      FROM sermons s
      LEFT JOIN sermon_series series ON series.id = s.series_id
      WHERE s.slug = ${slug}
        AND s.status IN ('published', 'ready')
      LIMIT 1
    `);
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const s = await getSermon(slug);
  if (!s) return {};
  return {
    title: s.title,
    description: s.summary ?? undefined,
    openGraph: {
      title: s.title,
      description: s.summary ?? undefined,
      images: s.image_url ? [{ url: s.image_url }] : undefined,
    },
  };
}

export default async function SermonPage({ params }: { params: Params }) {
  const { slug } = await params;
  const s = await getSermon(slug);
  if (!s) notFound();

  const html = s.full_text ? await marked.parse(s.full_text, { async: true }) : "";

  return (
    <article>
      {s.image_url ? (
        <div
          className="w-full h-64 md:h-96 bg-navy bg-cover bg-center border-b border-[var(--border-soft)]"
          style={{ backgroundImage: `url(${s.image_url})` }}
          role="img"
          aria-label={`Hero image for ${s.title}`}
        />
      ) : null}

      <div className="container-prose section">
        <header className="mb-12">
          {s.series_title ? (
            <Link
              href={`/sermons` as const}
              className="eyebrow hover:opacity-80 inline-block mb-3"
            >
              {s.series_title}
            </Link>
          ) : (
            <p className="eyebrow">Sermon</p>
          )}
          <h1>{s.title}</h1>
          <p className="text-gold mt-4" style={{ fontSize: "var(--fs-body-lg)" }}>
            {s.primary_passage}
          </p>
          {s.summary ? (
            <p
              className="text-muted mt-4 max-w-readable"
              style={{ fontSize: "var(--fs-body-lg)" }}
            >
              {s.summary}
            </p>
          ) : null}
        </header>

        {html ? (
          <div className="prose-ministry" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <p className="text-muted">This sermon is being prepared.</p>
        )}

        {s.call_to_action ? (
          <aside
            className="card mt-12"
            style={{ borderColor: "var(--border)" }}
          >
            <p className="card__eyebrow">Next step</p>
            <p className="m-0 text-warm" style={{ fontSize: "var(--fs-body-lg)" }}>
              {s.call_to_action}
            </p>
          </aside>
        ) : null}

        <div className="gold-divider" />

        <p className="text-muted text-sm">
          Scripture quotations from the World English Bible (public domain).
          This sermon was produced with AI tools and reviewed by the ministry.
          See our <Link href="/ai-disclosure">AI disclosure</Link>.
        </p>
      </div>
    </article>
  );
}
