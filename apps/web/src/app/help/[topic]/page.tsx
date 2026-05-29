import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { NeedHelpBanner } from "@/components/NeedHelpBanner";
import { HELP_TOPICS, HELP_TOPIC_SLUGS } from "@/data/help-topics";

type Params = Promise<{ topic: string }>;

export async function generateStaticParams() {
  // /help/suicide and /help/crisis-resources have their own custom routes
  return HELP_TOPIC_SLUGS.filter(
    (s) => s !== "suicide" && s !== "crisis-resources" && s !== "prayer-request"
  ).map((topic) => ({ topic }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { topic } = await params;
  const t = HELP_TOPICS[topic];
  if (!t) return {};
  return { title: t.title, description: t.shortAnswer };
}

export default async function HelpTopicPage({ params }: { params: Params }) {
  const { topic } = await params;
  const t = HELP_TOPICS[topic];
  if (!t) notFound();

  const bodyHtml = await marked.parse(t.body, { async: true });

  return (
    <section className="section theme-warm">
      <div className="container-prose">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Help", href: "/help" },
            { name: t.hubLabel, href: `/help/${t.slug}` },
          ]}
        />

        <header className="mb-10">
          <p className="eyebrow">{t.hubLabel}</p>
          <h1>{t.title}</h1>
          <p className="text-muted max-w-readable" style={{ fontSize: "var(--fs-body-lg)" }}>
            {t.subtitle}
          </p>
        </header>

        <NeedHelpBanner variant="compact" />

        <section className="mt-10 mb-10">
          <p className="eyebrow">Short answer</p>
          <p style={{ fontSize: "var(--fs-body-lg)" }}>{t.shortAnswer}</p>
        </section>

        <article
          className="prose-ministry mb-12"
          dangerouslySetInnerHTML={{ __html: String(bodyHtml) }}
        />

        <section className="card mb-12">
          <p className="card__eyebrow">Scriptures to sit with</p>
          <ul className="m-0">
            {t.scriptures.map((s) => (
              <li key={s.ref} className="mb-2">
                <span className="text-gold uppercase tracking-[0.12em] text-xs">
                  {s.ref}
                </span>{" "}
                <span className="text-muted text-sm">— {s.text}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <p className="eyebrow">Next steps</p>
          <div className="flex flex-wrap gap-3">
            {t.nextSteps.map((s, i) => (
              <Link
                key={s.href}
                href={s.href as `/${string}`}
                className={i === 0 ? "btn btn--primary" : "btn btn--secondary"}
              >
                {s.label}
              </Link>
            ))}
          </div>
        </section>

        <div className="gold-divider" />

        <section>
          <p className="eyebrow">Other topics</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.values(HELP_TOPICS)
              .filter((other) => other.slug !== t.slug)
              .slice(0, 6)
              .map((other) => (
                <Link
                  key={other.slug}
                  href={`/help/${other.slug}` as `/help/${string}`}
                  className="text-muted hover:text-gold text-sm"
                >
                  {other.hubLabel} →
                </Link>
              ))}
          </div>
        </section>
      </div>
    </section>
  );
}
