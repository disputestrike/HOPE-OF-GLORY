import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Meditating on the Word",
  description:
    "How to meditate on Scripture biblically. The Word in your mouth, in your heart, day and night.",
};

export default function MeditationPage() {
  return (
    <section className="section">
      <div className="container-prose">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Messages", href: "/messages" },
            { name: "Meditating on the Word", href: "/messages/meditating-on-the-word" },
          ]}
        />
        <header className="mb-10">
          <p className="eyebrow">Meditating on the Word</p>
          <h1>Not emptying. Filling.</h1>
          <p className="text-muted max-w-readable" style={{ fontSize: "var(--fs-body-lg)" }}>
            Biblical meditation is not emptying your mind. It is filling it — with
            Scripture, slowly, repeatedly, prayerfully. The Word in your mouth, in your
            heart, day and night.
          </p>
        </header>

        <section className="mb-10">
          <blockquote className="scripture-display border-none m-0 p-0">
            This book of the law shall not depart out of your mouth, but you shall meditate
            on it day and night, that you may observe to do according to all that is
            written in it.
          </blockquote>
          <p className="scripture-ref">Joshua 1:8 · WEB</p>
        </section>

        <section className="card mb-10">
          <p className="card__eyebrow">How to begin</p>
          <ol className="m-0 text-muted">
            <li>Pick one verse — short and clear.</li>
            <li>Read it five times. Slowly.</li>
            <li>Pause between readings.</li>
            <li>Ask: what does this say about God? About me? About Christ?</li>
            <li>Carry it with you all day.</li>
            <li>Pray it back to God.</li>
            <li>Memorize it by week's end.</li>
          </ol>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link href="/read/word-prayer-and-power/meditate-on-the-word" className="btn btn--primary">
            Read: Meditate on the Word Day and Night
          </Link>
          <Link href="/journey/40-day/12" className="btn btn--secondary">
            Journey Day 12 — Meditation
          </Link>
        </div>
      </div>
    </section>
  );
}
