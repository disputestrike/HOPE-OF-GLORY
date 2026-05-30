import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EmailSubscribeForm } from "@/components/EmailSubscribeForm";
import { NeedHelpBanner } from "@/components/NeedHelpBanner";
import {
  HURTING_HEART_JOURNEY,
  HURTING_HEART_TOTAL_DAYS,
} from "@/data/thirty-day-hurting-heart";

export const metadata: Metadata = {
  title: "30-Day Hope for the Hurting Heart",
  description:
    "Biblical hope, prayer, and a gentle path through grief, fear, loneliness, doubt, and pain — one day at a time.",
};

const chapters = [
  {
    n: "01",
    range: "Days 1-6",
    title: "Sees",
    body: "He is not far off. The God who saw Hagar in the wilderness sees you in yours.",
  },
  {
    n: "02",
    range: "Days 7-12",
    title: "Wounded",
    body: "Grief, fear, money, shelter, lostness, shame — when the heart bleeds.",
  },
  {
    n: "03",
    range: "Days 13-18",
    title: "Grieving",
    body: "Confession, doubt, loneliness, family wounds, forgiveness, and feeling forgotten.",
  },
  {
    n: "04",
    range: "Days 19-24",
    title: "Doubting",
    body: "When waiting is too long, hope is gone, God is silent, you have failed, or your body is sick.",
  },
  {
    n: "05",
    range: "Days 25-30",
    title: "Hoping",
    body: "Anxiety, worth, the crowd, temptation, weakness — and Christ in you, the hope of glory.",
  },
];

export default function ThirtyDayJourneyPage() {
  return (
    <section className="section theme-warm">
      <div className="container-prose">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "30-Day Hurting Heart", href: "/journey/30-day" },
          ]}
        />

        <div className="mb-8">
          <NeedHelpBanner />
        </div>

        <header className="mb-10">
          <p className="eyebrow">Comfort and rescue</p>
          <h1>30-Day Hope for the Hurting Heart.</h1>
          <p
            className="text-muted max-w-readable"
            style={{ fontSize: "var(--fs-body-lg)" }}
          >
            Biblical hope, prayer, and a gentle path through grief, fear, loneliness,
            doubt, and pain — one day at a time.
          </p>
        </header>

        <section className="card mb-12" style={{ borderColor: "var(--glory-gold)" }}>
          <p className="card__eyebrow">Who this is for</p>
          <p className="m-0 text-muted">
            This journey is for the person whose heart is heavy right now. The grieving.
            The afraid. The angry. The doubting. The sick. The exhausted. The one who
            cannot pray more than a few words. We will not rush you. We will not pretend
            the pain is not pain. We will sit with you, day by day, and point — gently —
            to the Christ who has not left and will not leave.
          </p>
        </section>

        <section className="card mb-12">
          <p className="card__eyebrow">What this is not</p>
          <p className="m-0 text-muted">
            This is not a discipleship 101 program. If you are a new believer or seeker
            looking for a structured walk through the foundations of the Christian life,
            the{" "}
            <Link href="/journey/40-day" className="text-gold underline">
              40-Day Hope of Glory Journey
            </Link>{" "}
            is for you. This 30-day path is a different shape: a rescue and comfort
            journey for the wounded heart. Both belong to the same family. You can do
            both, in either order.
          </p>
        </section>

        <section className="mb-12">
          <h2>The five chapters</h2>
          <ol className="m-0 p-0 list-none flex flex-col gap-4">
            {chapters.map((c) => (
              <li key={c.n} className="card flex gap-6 items-start">
                <div className="flex-shrink-0">
                  <p
                    className="text-3xl text-gold m-0"
                    style={{ fontFamily: "var(--font-display)", lineHeight: 1 }}
                  >
                    {c.n}
                  </p>
                  <p className="text-xs uppercase tracking-[0.16em] text-muted mt-2">
                    {c.range}
                  </p>
                </div>
                <div>
                  <h3 className="m-0 mb-2 text-warm">{c.title}</h3>
                  <p className="m-0 text-muted text-sm">{c.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-12">
          <h2>How to begin</h2>
          <ul className="text-muted">
            <li>Start with Day 1. Read it slowly. You do not have to finish it in one sitting.</li>
            <li>Pray the prayer, even if the words feel small. Small honest prayers count.</li>
            <li>Do the next step — sometimes that is sitting in silence, sometimes a phone call.</li>
            <li>If today is not Day 1's theme, scroll the grid below and find the day you need.</li>
            <li>If you might hurt yourself, call or text 988. If there is immediate danger, call 911. Stay.</li>
          </ul>
          <Link href="/journey/30-day/1" className="btn btn--primary">
            Start Day 1
          </Link>
        </section>

        <section className="mb-12">
          <EmailSubscribeForm flow="hurting_heart" sourcePage="/journey/30-day" />
        </section>

        <section className="mb-12">
          <h2>All {HURTING_HEART_TOTAL_DAYS} days</h2>
          <ol
            className="m-0 p-0 list-none grid gap-3"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
          >
            {HURTING_HEART_JOURNEY.map((d) => (
              <li key={d.day} className="m-0">
                <Link
                  href={`/journey/30-day/${d.day}` as `/journey/30-day/${string}`}
                  className="card block hover:border-[var(--glory-gold)]"
                  style={{ textDecoration: "none" }}
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-muted m-0 mb-1">
                    Day {d.day} · {d.chapterName}
                  </p>
                  <p
                    className="m-0 mb-1 text-warm"
                    style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-body-lg)" }}
                  >
                    {d.theme}
                  </p>
                  <p className="m-0 text-muted text-sm">{d.subtitle}</p>
                </Link>
              </li>
            ))}
          </ol>
        </section>

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
