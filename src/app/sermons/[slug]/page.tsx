import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { sql } from "drizzle-orm";
import { marked } from "marked";
import { EngagementActions } from "@/components/EngagementActions";
import { ScriptureRef } from "@/components/ScriptureRef";
import { ArticleLd, BreadcrumbListLd } from "@/components/StructuredData";
import { LAUNCH_SERMONS, getStaticSermon } from "@/data/launch-schedule";
import { optionalDb } from "@/lib/server-db";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hopeofglory.ministry";

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

type SermonDetail = {
  id: string;
  slug: string;
  title: string;
  primaryPassage: string;
  summary: string | null;
  fullText: string;
  prayer: string | null;
  callToAction: string | null;
  imageUrl: string | null;
  seriesTitle: string | null;
  seriesTheme: string | null;
};

async function getDbSermon(slug: string): Promise<SermonRow | null> {
  const database = await optionalDb("sermon-detail");
  if (!database) return null;
  try {
    const rows = await database.execute<SermonRow>(sql`
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

async function getSermon(slug: string): Promise<SermonDetail | null> {
  const db = await getDbSermon(slug);
  if (db) {
    return {
      id: db.id,
      slug: db.slug,
      title: db.title,
      primaryPassage: db.primary_passage,
      summary: db.summary,
      fullText:
        db.full_text ??
        `## Sermon notes\n\n${db.summary ?? "This sermon centers on the stated passage and the glory of Jesus Christ."}\n\n## Prayer\n\n${
          db.prayer ?? "Lord, open our eyes to your Word and make us obedient to Jesus Christ. Amen."
        }`,
      prayer: db.prayer,
      callToAction: db.call_to_action,
      imageUrl: db.image_url,
      seriesTitle: db.series_title,
      seriesTheme: db.series_theme,
    };
  }

  const fallback = getStaticSermon(slug);
  if (!fallback) return null;
  return {
    id: fallback.id,
    slug: fallback.slug,
    title: fallback.title,
    primaryPassage: fallback.primaryPassage,
    summary: fallback.summary,
    fullText: fallback.fullText,
    prayer: fallback.prayer,
    callToAction: fallback.callToAction,
    imageUrl: fallback.imageUrl,
    seriesTitle: fallback.seriesTitle,
    seriesTheme: fallback.seriesTheme,
  };
}

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return LAUNCH_SERMONS.map((sermon) => ({ slug: sermon.slug }));
}

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
      images: s.imageUrl ? [{ url: s.imageUrl }] : undefined,
    },
  };
}

export default async function SermonPage({ params }: { params: Params }) {
  const { slug } = await params;
  const s = await getSermon(slug);
  if (!s) notFound();

  const html = await marked.parse(s.fullText, { async: true });
  const url = `${BASE}/sermons/${s.slug}`;

  return (
    <>
      {ArticleLd({
        headline: s.title,
        description: s.summary ?? undefined,
        url,
        datePublished: "2026-01-01",
        imageUrl: s.imageUrl ?? undefined,
      })}
      {BreadcrumbListLd([
        { name: "Home", url: `${BASE}/` },
        { name: "Sermons", url: `${BASE}/sermons` },
        { name: s.title, url },
      ])}
      <article>
      {s.imageUrl ? (
        <div
          className="w-full h-64 md:h-96 bg-navy bg-cover bg-center border-b border-[var(--border-soft)]"
          style={{ backgroundImage: `url(${s.imageUrl})` }}
          role="img"
          aria-label={`Hero image for ${s.title}`}
        />
      ) : null}

      <div className="container-prose section">
        <header className="mb-12">
          <Link href="/sermons" className="eyebrow hover:opacity-80 inline-block mb-3">
            {s.seriesTitle ?? "Sermon"}
          </Link>
          <h1>{s.title}</h1>
          <p className="mt-4" style={{ fontSize: "var(--fs-body-lg)" }}>
            <ScriptureRef reference={s.primaryPassage} />
          </p>
          {s.summary ? (
            <p className="text-muted mt-4 max-w-readable" style={{ fontSize: "var(--fs-body-lg)" }}>
              {s.summary}
            </p>
          ) : null}
        </header>

        <div className="prose-ministry" dangerouslySetInnerHTML={{ __html: html }} />

        {s.prayer ? (
          <aside className="card mt-12" style={{ borderColor: "var(--border)" }}>
            <p className="card__eyebrow">Prayer</p>
            <p className="m-0 text-warm" style={{ fontSize: "var(--fs-body-lg)" }}>
              {s.prayer}
            </p>
          </aside>
        ) : null}

        {s.callToAction ? (
          <aside className="card mt-6" style={{ borderColor: "var(--border)" }}>
            <p className="card__eyebrow">Next step</p>
            <p className="m-0 text-warm" style={{ fontSize: "var(--fs-body-lg)" }}>
              {s.callToAction}
            </p>
          </aside>
        ) : null}

        <EngagementActions targetType="sermon" targetId={s.slug} />

        <div className="gold-divider" />

        <p className="text-muted text-sm">
          Scripture quotations from the World English Bible (public domain).
          This sermon was produced with AI tools and reviewed by the ministry.
          See our <Link href="/ai-disclosure">AI disclosure</Link>.
        </p>
      </div>
      </article>
    </>
  );
}

