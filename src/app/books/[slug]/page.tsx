import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { marked } from "marked";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EngagementActions } from "@/components/EngagementActions";
import { ArticleLd, BreadcrumbListLd } from "@/components/StructuredData";
import { BOOKS, getBook } from "@/data/books";

type Params = Promise<{ slug: string }>;

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hopeofglory.ministry";

export function generateStaticParams() {
  return BOOKS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) return {};
  return {
    title: book.title,
    description: book.description,
    openGraph: {
      title: `${book.title} — ${book.subtitle}`,
      description: book.description,
      type: "book",
      url: `${BASE}/books/${book.slug}`,
    },
  };
}

function loadManuscript(file: string): string | null {
  try {
    return readFileSync(join(process.cwd(), "content", "books", file), "utf8");
  } catch {
    return null;
  }
}

export default async function BookReaderPage({ params }: { params: Params }) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();

  const md = loadManuscript(book.file);
  const html = md ? await marked.parse(md, { async: true }) : null;

  return (
    <>
      {ArticleLd({
        headline: `${book.title}: ${book.subtitle}`,
        description: book.description,
        url: `${BASE}/books/${book.slug}`,
        datePublished: "2026-01-01",
      })}
      {BreadcrumbListLd([
        { name: "Home", url: `${BASE}/` },
        { name: "Free Books", url: `${BASE}/books` },
        { name: book.title, url: `${BASE}/books/${book.slug}` },
      ])}

      <section className="section">
        <div className="container-prose">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Free Books", href: "/books" },
              { name: book.title, href: `/books/${book.slug}` },
            ]}
          />

          {/* Download / read bar */}
          <div
            className="card mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            style={{ background: "rgba(212, 175, 55, 0.05)" }}
          >
            <div>
              <p className="card__eyebrow">Free ebook · {book.pages} pages</p>
              <p className="m-0 text-warm text-sm">
                Read the whole book below, or take it with you. No email, no
                charge — please share it.
              </p>
            </div>
            <a href={book.pdf} className="btn btn--primary whitespace-nowrap" download>
              ↓ Download the PDF
            </a>
          </div>

          {html ? (
            <article
              className="prose-ministry book-reader"
              dangerouslySetInnerHTML={{ __html: String(html) }}
            />
          ) : (
            <section className="card">
              <p className="card__eyebrow">Manuscript</p>
              <p className="m-0 text-muted">
                This book is available as a{" "}
                <a href={book.pdf} className="text-gold" download>
                  downloadable PDF
                </a>
                .
              </p>
            </section>
          )}

          <div className="gold-divider" />

          <section className="mb-10">
            <p className="eyebrow">Take it further</p>
            <div className="flex flex-wrap gap-3">
              <a href={book.pdf} className="btn btn--secondary" download>
                Download the PDF
              </a>
              <Link href="/ask" className="btn btn--secondary">
                Ask Hope a question
              </Link>
              <Link href="/come-to-christ" className="btn btn--primary">
                Come to Christ
              </Link>
            </div>
          </section>

          <EngagementActions targetType="article" targetId={`book/${book.slug}`} />
        </div>
      </section>
    </>
  );
}
