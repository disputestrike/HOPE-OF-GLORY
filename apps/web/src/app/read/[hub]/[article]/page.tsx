import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EngagementActions } from "@/components/EngagementActions";
import { ArticleLd } from "@/components/StructuredData";
import { HUBS, getArticle } from "@/data/read-library";

type Params = Promise<{ hub: string; article: string }>;

export async function generateStaticParams() {
  const params: Array<{ hub: string; article: string }> = [];
  for (const hub of Object.values(HUBS)) {
    for (const a of hub.articles) {
      params.push({ hub: hub.slug, article: a.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { hub, article } = await params;
  const found = getArticle(hub, article);
  if (!found) return {};
  return {
    title: found.article.title,
    description: found.article.subtitle,
  };
}

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hopeofglory.ministry";

export default async function ArticlePage({ params }: { params: Params }) {
  const { hub: hubSlug, article: articleSlug } = await params;
  const found = getArticle(hubSlug, articleSlug);
  if (!found) notFound();
  const { hub, article } = found;

  const bodyHtml = article.body
    ? await marked.parse(article.body, { async: true })
    : null;

  const related =
    article.relatedSlugs
      ?.map((s) => hub.articles.find((a) => a.slug === s))
      .filter((a): a is NonNullable<typeof a> => Boolean(a)) ?? [];
  const downloadText = [
    article.title,
    article.subtitle,
    "",
    "Short answer",
    article.shortAnswer,
    "",
    "Key Scriptures",
    ...article.keyScriptures.map((s) =>
      s.note ? `${s.ref} - ${s.note}` : s.ref,
    ),
    "",
    `${BASE}/read/${hub.slug}/${article.slug}`,
  ].join("\n");
  const downloadUrl = `data:text/plain;charset=utf-8,${encodeURIComponent(downloadText)}`;

  return (
    <>
      {ArticleLd({
        headline: article.title,
        description: article.subtitle,
        url: `${BASE}/read/${hub.slug}/${article.slug}`,
        datePublished: "2025-01-01",
      })}
      <section className="section">
        <div className="container-prose">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Read", href: "/read" },
              { name: hub.title, href: `/read/${hub.slug}` },
              { name: article.title, href: `/read/${hub.slug}/${article.slug}` },
            ]}
          />

          <header className="mb-10">
            <p className="eyebrow">{hub.title}</p>
            <h1>{article.title}</h1>
            <p
              className="text-muted max-w-readable"
              style={{ fontSize: "var(--fs-body-lg)" }}
            >
              {article.subtitle}
            </p>
          </header>

          <section className="mb-10">
            <p className="eyebrow">Short answer</p>
            <p style={{ fontSize: "var(--fs-body-lg)" }}>{article.shortAnswer}</p>
          </section>

          {bodyHtml ? (
            <article
              className="prose-ministry mb-12"
              dangerouslySetInnerHTML={{ __html: String(bodyHtml) }}
            />
          ) : (
            <section className="card mb-10">
              <p className="card__eyebrow">Study pathway</p>
              <p className="m-0 mb-4 text-muted">
                Start with the short answer above, read the key Scriptures below, then
                take the next step into the related teachings. This page is designed to
                be a doorway into Scripture, not a dead end.
              </p>
            </section>
          )}

          <section className="card mb-10">
            <p className="card__eyebrow">Key Scriptures</p>
            <ul className="m-0">
              {article.keyScriptures.map((s) => (
                <li key={s.ref} className="mb-2">
                  <span className="text-gold uppercase tracking-[0.12em] text-xs">
                    {s.ref}
                  </span>
                  {s.note ? (
                    <span className="text-muted text-sm"> — {s.note}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-10">
            <p className="eyebrow">Next step</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/ask" className="btn btn--primary">
                Ask Hope about this
              </Link>
              <Link href="/come-to-christ" className="btn btn--secondary">
                Come to Christ
              </Link>
            </div>
          </section>

          {related.length > 0 ? (
            <>
              <div className="gold-divider" />
              <section>
                <p className="eyebrow">Related teachings</p>
                <ul className="m-0 p-0 list-none">
                  {related.map((r) => (
                    <li key={r.slug} className="mb-2">
                      <Link
                        href={`/read/${hub.slug}/${r.slug}` as `/read/${string}/${string}`}
                        className="text-gold"
                      >
                        {r.title}
                      </Link>{" "}
                      <span className="text-muted text-sm">— {r.subtitle}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          ) : null}

          <EngagementActions
            targetType="article"
            targetId={`${hub.slug}/${article.slug}`}
            downloadUrl={downloadUrl}
          />
        </div>
      </section>
    </>
  );
}
