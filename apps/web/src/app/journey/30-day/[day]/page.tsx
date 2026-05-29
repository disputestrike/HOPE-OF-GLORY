import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { NeedHelpBanner } from "@/components/NeedHelpBanner";
import {
  HURTING_HEART_JOURNEY,
  HURTING_HEART_TOTAL_DAYS,
  getHurtingDay,
} from "@/data/thirty-day-hurting-heart";

type Params = Promise<{ day: string }>;

// Days where pain is acute and crisis indicators may be present.
// Show the full NeedHelpBanner, not just the compact version, on these.
const CRISIS_DAYS = new Set<number>([2, 20, 26]);

function parseDayParam(day: string) {
  if (!/^\d+$/.test(day)) return null;
  const dayNum = Number(day);
  if (String(dayNum) !== day) return null;
  if (dayNum < 1 || dayNum > HURTING_HEART_TOTAL_DAYS) return null;
  return dayNum;
}

export async function generateStaticParams() {
  return HURTING_HEART_JOURNEY.map((d) => ({ day: String(d.day) }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { day } = await params;
  const dayNum = parseDayParam(day);
  if (!dayNum) return {};
  const d = getHurtingDay(dayNum);
  if (!d) return {};
  return {
    title: `Day ${d.day}: ${d.theme}`,
    description: d.subtitle,
  };
}

export default async function HurtingHeartDayPage({
  params,
}: {
  params: Params;
}) {
  const { day } = await params;
  const dayNum = parseDayParam(day);
  if (!dayNum) notFound();
  const d = getHurtingDay(dayNum);
  if (!d) notFound();

  const prev = dayNum > 1 ? getHurtingDay(dayNum - 1) : null;
  const next =
    dayNum < HURTING_HEART_TOTAL_DAYS ? getHurtingDay(dayNum + 1) : null;
  const isCrisisDay = CRISIS_DAYS.has(dayNum);

  return (
    <section className="section">
      <div className="container-prose">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "30-Day Hurting Heart", href: "/journey/30-day" },
            { name: `Day ${d.day}`, href: `/journey/30-day/${d.day}` },
          ]}
        />

        {/* Compact help banner at top of every day — every day touches pain. */}
        <div className="mb-6">
          <NeedHelpBanner variant="compact" />
        </div>

        <header className="mb-10">
          <p className="eyebrow">
            Day {d.day} of {HURTING_HEART_TOTAL_DAYS} · {d.chapterName}
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

        {/* On crisis days, surface the full help banner prominently before the reflection. */}
        {isCrisisDay && (
          <div className="mb-10">
            <NeedHelpBanner />
          </div>
        )}

        <section className="mb-10 prose-ministry">
          <h2>Reflection</h2>
          <p>{d.reflection}</p>
        </section>

        <section className="card mb-8">
          <p className="card__eyebrow">Prayer</p>
          <p
            className="m-0 italic"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--fs-body-lg)",
            }}
          >
            {d.prayer}
          </p>
        </section>

        <section className="card mb-12">
          <p className="card__eyebrow">Today's step</p>
          <p className="m-0 text-warm">{d.nextStep}</p>
        </section>

        <nav
          aria-label="Day navigation"
          className="flex items-center justify-between gap-4 border-t border-[var(--border-soft)] pt-6"
        >
          {prev ? (
            <Link
              href={`/journey/30-day/${prev.day}` as `/journey/30-day/${string}`}
              className="text-muted hover:text-gold text-sm"
            >
              ← Day {prev.day}: {prev.theme}
            </Link>
          ) : (
            <Link
              href="/journey/30-day"
              className="text-muted hover:text-gold text-sm"
            >
              ← About this journey
            </Link>
          )}
          {next ? (
            <Link
              href={`/journey/30-day/${next.day}` as `/journey/30-day/${string}`}
              className="text-muted hover:text-gold text-sm text-right"
            >
              Day {next.day}: {next.theme} →
            </Link>
          ) : (
            <Link
              href="/journey/30-day"
              className="text-muted hover:text-gold text-sm text-right"
            >
              Back to overview →
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
            <Link href="/help/crisis-resources" className="btn btn--ghost">
              Crisis resources
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}
