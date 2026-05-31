import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BOOKS } from "@/data/books";

export const metadata: Metadata = {
  title: "Free books",
  description:
    "Free books from Hope of Glory Ministry — discipleship and apologetics you can read online or download as a PDF. No email wall, no charge. The gospel is free.",
};

export default function BooksIndexPage() {
  return (
    <section className="section">
      <div className="container-prose">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Free Books", href: "/books" },
          ]}
        />

        <header className="mb-10">
          <p className="eyebrow">Free books</p>
          <h1>Read the long form — free.</h1>
          <p
            className="text-muted max-w-readable"
            style={{ fontSize: "var(--fs-body-lg)" }}
          >
            Full-length discipleship and apologetics, free to read online or
            download as a PDF. No email required, no charge, no catch. Share
            them with anyone.
          </p>
        </header>

        <div className="flex flex-col gap-6">
          {BOOKS.map((book) => (
            <article key={book.slug} className="card">
              <p className="card__eyebrow">Book · {book.pages} pages · ~{book.readingTimeMin} min</p>
              <h2 className="m-0 mb-2" style={{ fontSize: "var(--fs-h3)" }}>
                <Link href={`/books/${book.slug}`} className="text-warm hover:text-gold">
                  {book.title}
                </Link>
              </h2>
              <p className="m-0 mb-3 text-gold text-sm italic">{book.subtitle}</p>
              <p className="m-0 mb-5 text-muted">{book.description}</p>
              <div className="flex flex-wrap gap-3">
                <Link href={`/books/${book.slug}`} className="btn btn--primary">
                  Read free online
                </Link>
                <a href={book.pdf} className="btn btn--secondary" download>
                  Download the PDF
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
