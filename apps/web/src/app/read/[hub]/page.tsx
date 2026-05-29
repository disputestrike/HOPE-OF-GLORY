import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { HUBS, HUB_SLUGS } from "@/data/read-library";

type Params = Promise<{ hub: string }>;

export async function generateStaticParams() {
  return HUB_SLUGS.map((hub) => ({ hub }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { hub: hubSlug } = await params;
  const hub = HUBS[hubSlug];
  if (!hub) return {};
  return { title: hub.title, description: hub.description };
}

export default async function HubPage({ params }: { params: Params }) {
  const { hub: hubSlug } = await params;
  const hub = HUBS[hubSlug];
  if (!hub) notFound();

  return (
    <section className="section">
      <div className="container-prose">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Read", href: "/read" },
            { name: hub.title, href: `/read/${hub.slug}` },
          ]}
        />

        <header className="mb-12">
          <p className="eyebrow">{hub.eyebrow}</p>
          <h1>{hub.title}</h1>
          <p className="text-muted max-w-readable" style={{ fontSize: "var(--fs-body-lg)" }}>
            {hub.description}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hub.articles.map((a) => (
            <article key={a.slug} className="card">
              <h2 className="m-0 mb-2 text-base">
                <Link
                  href={`/read/${hub.slug}/${a.slug}` as `/read/${string}/${string}`}
                  className="text-warm hover:text-gold no-underline"
                >
                  {a.title}
                </Link>
              </h2>
              <p className="text-gold text-xs uppercase tracking-[0.12em] m-0 mb-3">
                {a.subtitle}
              </p>
              <p className="text-muted text-sm m-0 mb-4">{a.shortAnswer.slice(0, 220)}…</p>
              <Link
                href={`/read/${hub.slug}/${a.slug}` as `/read/${string}/${string}`}
                className="btn btn--ghost text-sm"
                style={{ padding: "0.5rem 1rem" }}
              >
                Read →
              </Link>
            </article>
          ))}
        </div>

        <div className="gold-divider" />

        <section>
          <p className="eyebrow">Have a question first?</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/ask" className="btn btn--primary">
              Ask Hope
            </Link>
            <Link href="/read" className="btn btn--secondary">
              Back to the library
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}
