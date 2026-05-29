import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Bible Studies",
  description:
    "Bible studies - chapter by chapter, topic by topic. Designed to be read slowly.",
};

const studies = [
  {
    title: "John 1: The Word Became Flesh",
    passage: "John 1:1-18",
    body: "A slow study of the eternal Word, creation, incarnation, grace, truth, and the glory of Christ.",
    href: "/sermons/the-word-became-flesh-and-revealed-glory",
  },
  {
    title: "Colossians 1: Christ in You",
    passage: "Colossians 1:24-29",
    body: "A study on the mystery revealed: Christ among the nations and Christ dwelling in his people.",
    href: "/sermons/christ-in-you-the-hope-of-glory",
  },
  {
    title: "Habakkuk 2: The Earth Filled",
    passage: "Habakkuk 2:1-20",
    body: "Faith, waiting, judgment, idolatry, and the promise that God's glory will fill the earth.",
    href: "/sermons/the-earth-filled-with-his-glory",
  },
  {
    title: "Psalm 72: The King's Glory",
    passage: "Psalm 72",
    body: "A kingdom prayer for righteousness, justice, mercy for the poor, and glory filling the whole earth.",
    href: "/sermons/let-the-whole-earth-be-filled-with-his-glory",
  },
  {
    title: "Revelation 1: The Unveiled Christ",
    passage: "Revelation 1:1-20",
    body: "Read Revelation first as the unveiling of Jesus: faithful witness, firstborn from the dead, and ruler of kings.",
    href: "/sermons/the-revelation-of-jesus-christ",
  },
  {
    title: "Revelation 7: Every Nation Before the Lamb",
    passage: "Revelation 7:9-12",
    body: "The end of mission is worship: a redeemed multitude from every nation, tribe, people, and language.",
    href: "/sermons/a-great-multitude-from-every-nation",
  },
];

export default function StudiesPage() {
  return (
    <section className="section">
      <div className="container-prose">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Messages", href: "/messages" },
            { name: "Studies", href: "/messages/studies" },
          ]}
        />
        <header className="mb-10">
          <p className="eyebrow">Studies</p>
          <h1>Bible studies, chapter by chapter.</h1>
          <p className="text-muted max-w-readable" style={{ fontSize: "var(--fs-body-lg)" }}>
            Studies designed to be read slowly. One book at a time, one chapter at a time,
            one truth at a time. Made for personal devotion, small groups, and discipleship.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {studies.map((study) => (
            <Link key={study.href} href={study.href as `/sermons/${string}`} className="card block hover:no-underline">
              <p className="card__eyebrow">{study.passage}</p>
              <h2 className="m-0 mb-2" style={{ fontSize: "var(--fs-h3)" }}>
                {study.title}
              </h2>
              <p className="m-0 text-muted text-sm">{study.body}</p>
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/journey/40-day" className="btn btn--primary">
            Start the 40-Day Journey
          </Link>
          <Link href="/read" className="btn btn--secondary">
            Open the Read library
          </Link>
        </div>
      </div>
    </section>
  );
}

