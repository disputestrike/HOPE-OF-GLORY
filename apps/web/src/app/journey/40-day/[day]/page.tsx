import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EngagementActions } from "@/components/EngagementActions";
import { FORTY_DAY_JOURNEY, getDay } from "@/data/forty-day-journey";

type Params = Promise<{ day: string }>;

export async function generateStaticParams() {
  return FORTY_DAY_JOURNEY.map((d) => ({ day: String(d.day) }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { day } = await params;
  const d = getDay(Number.parseInt(day, 10));
  if (!d) return {};
  return {
    title: `Day ${d.day}: ${d.theme}`,
    description: d.subtitle,
  };
}

export default async function JourneyDayPage({ params }: { params: Params }) {
  const { day } = await params;
  const dayNum = Number.parseInt(day, 10);
  if (Number.isNaN(dayNum)) notFound();
  const d = getDay(dayNum);
  if (!d) notFound();

  const prev = dayNum > 1 ? getDay(dayNum - 1) : null;
  const next = dayNum < 40 ? getDay(dayNum + 1) : null;

  return (
    <section className="section">
      <div className="container-prose">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "40-Day Journey", href: "/journey/40-day" },
            { name: `Day ${d.day}`, href: `/journey/40-day/${d.day}` },
          ]}
        />

        <header className="mb-10">
          <p className="eyebrow">
            Day {d.day} of 40 · {d.movementName}
          </p>
          <h1>{d.theme}</h1>
          <p
            className="text-muted max-w-readable"
            style={{ fontSize: "var(--fs-body-lg)" }}
          >
            {d.subtitle}
          </p>
        </header>

        <section className="mb-10">
          <blockquote className="scripture-display border-none m-0 p-0">
            {d.scriptureText}
          </blockquote>
          <p className="scripture-ref">{d.scriptureRef} · WEB</p>
        </section>

        <section className="mb-10 prose-ministry">
          <h2>Reflection</h2>
          <p>{d.reflection}</p>
        </section>

        <section className="card mb-8">
          <p className="card__eyebrow">Prayer</p>
          <p
            className="m-0 italic"
            style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-body-lg)" }}
          >
            {d.prayer}
          </p>
        </section>

        <section className="card mb-12">
          <p className="card__eyebrow">Today's step</p>
          <p className="m-0 text-warm">{d.nextStep}</p>
        </section>

        <EngagementActions
          targetType="journey_day"
          targetId={String(d.day)}
          className="mb-10"
        />

        <nav
          aria-label="Day navigation"
          className="flex items-center justify-between gap-4 border-t border-[var(--border-soft)] pt-6"
        >
          {prev ? (
            <Link
              href={`/journey/40-day/${prev.day}` as `/journey/40-day/${string}`}
              className="text-muted hover:text-gold text-sm"
            >
              ← Day {prev.day}: {prev.theme}
            </Link>
          ) : (
            <Link href="/journey/40-day" className="text-muted hover:text-gold text-sm">
              ← About the journey
            </Link>
          )}
          {next ? (
            <Link
              href={`/journey/40-day/${next.day}` as `/journey/40-day/${string}`}
              className="text-muted hover:text-gold text-sm text-right"
            >
              Day {next.day}: {next.theme} →
            </Link>
          ) : (
            <Link
              href="/daily-faith"
              className="text-muted hover:text-gold text-sm text-right"
            >
              Continue with Daily Faith →
            </Link>
          )}
        </nav>

        <div className="gold-divider" />

        <section>
          <p className="eyebrow">Have a question?</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/ask" className="btn btn--primary">
              Ask Hope
            </Link>
            <Link href="/prayer" className="btn btn--secondary">
              Share a prayer request
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}
