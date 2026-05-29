import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { NeedHelpBanner } from "@/components/NeedHelpBanner";
import { HELP_TOPICS } from "@/data/help-topics";

export const metadata: Metadata = {
  title: "Help — Biblical hope and practical next steps",
  description:
    "Biblical hope, prayer, and practical next steps for pain, fear, anger, rejection, grief, doubt, financial stress, homelessness, and crisis.",
};

export default function HelpPage() {
  const topics = Object.values(HELP_TOPICS);
  return (
    <section className="section">
      <div className="container-prose">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Help", href: "/help" }]} />

        <header className="mb-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow">Help</p>
            <h1>Help for real life.</h1>
            <p className="text-muted max-w-readable" style={{ fontSize: "var(--fs-body-lg)" }}>
              Biblical hope, prayer, and practical next steps for the heaviest places in life.
              Choose what fits where you are right now.
            </p>
          </div>
          <figure className="m-0 overflow-hidden rounded-sm border border-[var(--border-soft)]">
            <Image
              src="/images/gallery/ministry_humanity_4.webp"
              alt="One man comforting another in a dim street scene"
              width={2560}
              height={1440}
              sizes="(min-width: 1024px) 600px, 100vw"
              priority
              className="aspect-[16/9] w-full object-cover"
            />
          </figure>
        </header>

        <NeedHelpBanner />

        <section className="mt-10 mb-12">
          <h2>If you are in immediate crisis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/help/suicide"
              className="card block hover:no-underline"
              style={{ borderColor: "var(--blood-crimson)" }}
            >
              <p className="card__eyebrow" style={{ color: "var(--blood-crimson)" }}>Highest priority</p>
              <h3 className="m-0 mb-2 text-warm">I feel like ending my life</h3>
              <p className="m-0 text-muted text-sm">
                Crisis-mode help. Immediate steps. You are not alone.
              </p>
            </Link>
            <Link
              href="/help/crisis-resources"
              className="card block hover:no-underline"
            >
              <p className="card__eyebrow">Resources</p>
              <h3 className="m-0 mb-2 text-warm">Crisis resources</h3>
              <p className="m-0 text-muted text-sm">
                988, 911, 211, domestic violence, shelter, mental health, international.
              </p>
            </Link>
          </div>
        </section>

        <section className="mb-12">
          <h2>Hope for the human heart</h2>
          <p className="text-muted mb-6 max-w-readable">
            Biblical help for the wounds people carry before God.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((t) => (
              <Link
                key={t.slug}
                href={`/help/${t.slug}` as `/help/${string}`}
                className="card block hover:no-underline"
              >
                <p className="card__eyebrow">{t.hubLabel}</p>
                <h3 className="m-0 mb-2 text-warm text-base">{t.title}</h3>
                <p className="m-0 text-muted text-sm">{t.shortAnswer.slice(0, 130)}…</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2>Talk to someone</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/prayer" className="btn btn--primary">Share a prayer request</Link>
            <Link href="/ask" className="btn btn--secondary">Ask Hope</Link>
            <Link href="/contact" className="btn btn--ghost">Talk to a real person</Link>
          </div>
        </section>
      </div>
    </section>
  );
}
