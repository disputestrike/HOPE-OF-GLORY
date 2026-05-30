import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Messages — Daily Word, sermons, teachings, studies, prayers",
  description:
    "Daily Word, sermons, teachings, Bible studies, prayers, healing and miracles, meditating on the Word — all in one place.",
};

const collections = [
  { href: "/messages/daily-word", title: "Daily Word", body: "One Scripture and one short reflection, posted every morning." },
  { href: "/sermons", title: "Sermons", body: "Verse-by-verse teaching from the Old Testament and New, with notes, audio, and video." },
  { href: "/calendar", title: "Calendar", body: "The daily sermon schedule that feeds Messages, Daily Word, email, and social posts." },
  { href: "/messages/teachings", title: "Teachings", body: "Longer-form teaching on doctrine, the gospel, prayer, holiness, and the Christian life." },
  { href: "/messages/studies", title: "Studies", body: "Bible studies — chapter by chapter, topic by topic. Designed to be read slowly." },
  { href: "/messages/prayers", title: "Prayers", body: "Prayers you can pray as your own, for healing, faith, family, the nations, and your own heart." },
  { href: "/messages/healing-and-miracles", title: "Healing and Miracles", body: "What the Bible says about healing, prayer for the sick, and the sovereignty of God — without manipulation." },
  { href: "/messages/meditating-on-the-word", title: "Meditating on the Word", body: "How to meditate on Scripture biblically. The Word in your mouth, in your heart, day and night." },
  { href: "/gallery", title: "Glory Gallery", body: "Visual meditations paired with Scripture and short statements for sharing and reflection." },
];

export default function MessagesPage() {
  return (
    <section className="section">
      <div className="container-prose">
        <Breadcrumbs
          items={[{ name: "Home", href: "/" }, { name: "Messages", href: "/messages" }]}
        />

        <header className="mb-10">
          <p className="eyebrow">Messages</p>
          <h1>Hear the Word.</h1>
          <p className="text-muted max-w-readable" style={{ fontSize: "var(--fs-body-lg)" }}>
            Daily Word, sermons, teachings, studies, prayers, healing and miracles,
            meditating on the Word — all in one place. Find what you need, sit with it, and
            let Christ speak.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collections.map((c) => (
            <article key={c.href} className="card">
              <h2 className="m-0 mb-2 text-base">
                <Link href={c.href as `/${string}`} className="text-warm hover:text-gold no-underline">
                  {c.title}
                </Link>
              </h2>
              <p className="text-muted text-sm m-0 mb-4">{c.body}</p>
              <Link
                href={c.href as `/${string}`}
                className="btn btn--ghost text-sm"
                style={{ padding: "0.5rem 1rem" }}
              >
                Open →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
