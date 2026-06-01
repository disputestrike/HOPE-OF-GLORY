import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { OrganizationLd } from "@/components/StructuredData";
import { EmailSubscribeForm } from "@/components/EmailSubscribeForm";

export const metadata: Metadata = {
  title: "Hope of Glory Ministry — Filling the earth with His glory",
  description:
    "Hope of Glory Ministry proclaims Jesus Christ through Scripture, prayer, teaching, apologetics, and AI-powered digital ministry. Come to Christ. Start the 40-Day Journey. Ask Hope. Read the Word. Find help today.",
};

type Card = {
  eyebrow: string;
  title: string;
  body: string;
  cta: { href: `/${string}`; label: string };
};

const ministryGrid: Card[] = [
  {
    eyebrow: "Daily Faith",
    title: "A verse and a thought for today.",
    body:
      "A short Scripture, a short reflection, posted every morning. No noise. No outrage. Just the Word of God and a few sentences to carry with you.",
    cta: { href: "/daily-faith", label: "Open today's reading" },
  },
  {
    eyebrow: "What the World Needs",
    title: "One Savior. The hope of the nations.",
    body:
      "Jesus Christ for forgiveness of sin, peace with God, healing of the heart, truth in confusion, hope in death, freedom from shame, and the promise of resurrection and new creation.",
    cta: { href: "/read/what-the-world-needs", label: "Read the answer" },
  },
  {
    eyebrow: "Life's Biggest Questions",
    title: "Why am I here? What happens when I die?",
    body:
      "Plain biblical answers to the questions you actually ask. Purpose, evil, suffering, salvation, eternity. Asked honestly. Answered honestly.",
    cta: { href: "/read/lifes-biggest-questions", label: "See the questions" },
  },
  {
    eyebrow: "Christ in All Scripture",
    title: "From Genesis to Revelation, He is the point.",
    body:
      "The Seed of the woman. The Lamb of the Passover. The Son of David. The Suffering Servant. The mystery hidden and now revealed. Christ is the spine of the whole Bible.",
    cta: { href: "/read/christ-in-all-scripture", label: "Open Christ in All Scripture" },
  },
  {
    eyebrow: "The Holy Spirit and New Birth",
    title: "Born again, walking by the Spirit.",
    body:
      "Who the Holy Spirit is, what it means to be born again, and what it looks like to walk by the Spirit day by day.",
    cta: { href: "/read/god-trinity-word-spirit", label: "Read the teaching" },
  },
  {
    eyebrow: "Prayer, Healing, and the Word",
    title: "Honest prayer. Real Scripture.",
    body:
      "Does God still answer prayer? How do we pray? Does God still heal? What do we do when the answer is no? Direct biblical teaching, without manipulation.",
    cta: { href: "/read/word-prayer-and-power", label: "Read the hub" },
  },
  {
    eyebrow: "Following Jesus in Real Life",
    title: "Holiness, marriage, money, work, family.",
    body:
      "The Christian life on a Tuesday. Repentance, obedience, sexual purity, work, parenting, integrity, forgiveness, anger, humility. Where the gospel meets the calendar.",
    cta: { href: "/read/following-jesus", label: "Read the teaching" },
  },
  {
    eyebrow: "Worship, Love, and Obedience",
    title: "Love God. Love your neighbor. Love your enemies.",
    body:
      "The two great commandments, plus the third hard one Jesus added. Worship in spirit and truth. Faith working through love.",
    cta: { href: "/read/worship-love-and-obedience", label: "Read the teaching" },
  },
  {
    eyebrow: "The Church and Discipleship",
    title: "You are not meant to do this alone.",
    body:
      "What the church is. Why the local church matters. Baptism, communion, membership, gifts, gathering. Why digital ministry is not a substitute for embodied fellowship.",
    cta: { href: "/read/church-and-discipleship", label: "Read the teaching" },
  },
  {
    eyebrow: "Nations, Unity, and Glory",
    title: "One new people in Christ.",
    body:
      "Different peoples, one Lord. Different languages, one faith. All nations blessed in Christ. The earth filled with His glory.",
    cta: { href: "/read/nations-unity-and-glory", label: "Read the teaching" },
  },
  {
    eyebrow: "Apologetics and Hard Questions",
    title: "Honest answers to hard objections.",
    body:
      "Bible reliability. The Trinity. The resurrection. Christianity and Islam. Atheism. Science and faith. Suffering. We compare doctrines — we never insult persons.",
    cta: { href: "/apologetics", label: "Open the apologetics desk" },
  },
  {
    eyebrow: "Hope for the Human Heart",
    title: "Where God meets you in pain.",
    body:
      "Grief. Fear. Death. Loneliness. Doubt. Shame. Confession. Hopelessness. Family wounds. Bring the burden to Scripture.",
    cta: { href: "/help", label: "See the soul-care hub" },
  },
];

const humanityImage = "/images/ministry-humanity-to-light.webp";
const psalmGloryImage = "/images/earth-filled-with-his-glory.webp";
const christInYouImage = "/images/christ-in-you-hope-of-glory.webp";
const missionFaces = [
  {
    src: "/images/gallery/culture_diversity_10.webp",
    alt: "A diverse crowd walking through a city at sunrise",
    label: "The nations walking in light",
  },
  {
    src: "/images/gallery/culture_diversity_6.webp",
    alt: "A woman writing in a notebook beside books and warm light",
    label: "The Word written on the heart",
  },
  {
    src: "/images/gallery/ministry_humanity_8.webp",
    alt: "Two people holding hands in a gentle act of comfort",
    label: "Mercy with hands",
  },
  {
    src: "/images/gallery/ministry_humanity_6.webp",
    alt: "A diverse group working together around a laptop",
    label: "Laboring together",
  },
];

export default function HomePage() {
  return (
    <>
      {OrganizationLd({ url: "https://hopeofglory.ministry" })}

      {/* HERO */}
      <section className="section--hero">
        <div className="container-prose">
          <p className="eyebrow">A Christian media ministry</p>
          <h1 className="mx-auto">
            Filling the earth with the knowledge of the glory of the Lord.
          </h1>
          <p
            className="mt-6 mx-auto text-muted"
            style={{ fontSize: "var(--fs-body-lg)", maxWidth: "60ch" }}
          >
            Hope of Glory Ministry proclaims Jesus Christ through Scripture,
            prayer, teaching, apologetics, discipleship, and AI-powered digital
            ministry.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/come-to-christ" className="btn btn--primary">
              Give Your Life to Jesus
            </Link>
            <Link href="/journey/40-day/1" className="btn btn--secondary">
              Start the 40-Day Journey
            </Link>
            <Link href="/ask" className="btn btn--ghost">
              Ask Hope
            </Link>
          </div>
          <p className="mt-8 text-xs text-muted">
            Need Jesus?{" "}
            <Link href="/come-to-christ" className="text-gold underline">
              Pray and begin here
            </Link>
            .
          </p>
        </div>
      </section>

      {/* COME TO CHRIST — PRIMARY CONVERSION */}
      <section
        className="section border-y border-[var(--border-soft)]"
        style={{ background: "rgba(212, 175, 55, 0.04)" }}
      >
        <div className="container-prose">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="eyebrow">Come to Christ</p>
              <h2 className="m-0 mb-4">Give your life to Jesus.</h2>
              <p className="text-muted max-w-readable">
                The most important page on this whole site. The gospel
                explained plainly, a biblical prayer of repentance and faith,
                and the clear next steps for a brand-new follower of Christ.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/come-to-christ" className="btn btn--primary">
                  Come to Christ
                </Link>
                <Link href="/sinners-prayer" className="btn btn--ghost">
                  About the sinner's prayer
                </Link>
              </div>
            </div>
            <blockquote
              className="scripture-display border-none m-0 p-0"
              style={{ maxWidth: "30ch" }}
            >
              I am the way, the truth, and the life. No one comes to the
              Father, except through me.
            </blockquote>
          </div>
          <p className="scripture-ref">John 14:6 · WEB</p>
        </div>
      </section>

      {/* 40-DAY JOURNEY + DAILY FAITH */}
      <section className="section">
        <div className="container-prose">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div>
              <p className="eyebrow">Discipleship</p>
              <h2 className="m-0 mb-4">
                Start the 40-Day Hope of Glory Journey.
              </h2>
              <p className="text-muted max-w-readable">
                Forty days through the foundations of the Christian life. Come
                to Christ. Learn prayer and the Word. Walk in holiness. See
                Christ in all Scripture. Live for the glory of God. One short
                message per day, in your inbox.
              </p>
              <Link href="/journey/40-day/1" className="btn btn--primary mt-6">
                Begin Day 1 today
              </Link>
            </div>
            <div>
              <p className="eyebrow">Daily Faith</p>
              <h2 className="m-0 mb-4">After the 40 days, keep coming.</h2>
              <p className="text-muted max-w-readable">
                Daily Scripture, daily prayer, daily message, daily question,
                daily obedience step, daily share. The long rhythm of a life
                lived with Christ.
              </p>
              <Link href="/daily-faith" className="btn btn--secondary mt-6">
                Open Daily Faith
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* EMAIL CAPTURE — Daily Faith */}
      <section
        className="section border-y border-[var(--border-soft)]"
        style={{ background: "rgba(212, 175, 55, 0.04)" }}
      >
        <div className="container-prose">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="eyebrow">Daily Faith by email</p>
              <h2 className="m-0 mb-4">A verse and a thought, every morning.</h2>
              <p className="text-muted max-w-readable">
                Leave your email and receive a short Scripture, a reflection, a
                prayer, and one step to carry through the day. No noise, no
                outrage, no selling — and you can stop any time. We will never
                share your address.
              </p>
            </div>
            <EmailSubscribeForm flow="daily_faith" sourcePage="/" />
          </div>
        </div>
      </section>

      {/* SCRIPTURE BANNER */}
      <section className="section overflow-hidden bg-navy border-y border-[var(--border-soft)]">
        <div className="container-prose">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[0.85fr_1.15fr] xl:gap-14">
            <div>
              <blockquote className="scripture-display border-none m-0 p-0 lg:text-left">
                For the earth shall be filled with the knowledge of the glory of
                the Lord, as the waters cover the sea.
              </blockquote>
              <p className="scripture-ref lg:text-left">Habakkuk 2:14 · WEB</p>
            </div>
            <figure className="relative m-0 overflow-hidden rounded-sm border border-[var(--border-soft)] shadow-[0_28px_80px_rgba(0,0,0,0.35)]">
              <Image
                src={humanityImage}
                alt="People from many nations walking toward sunrise over the sea"
                width={2560}
                height={1440}
                sizes="(min-width: 1280px) 620px, (min-width: 1024px) 54vw, 100vw"
                className="h-auto w-full object-cover"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(5,11,24,0.22),rgba(5,11,24,0)_34%,rgba(5,11,24,0.12))]"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* ASK HOPE */}
      <section className="section">
        <div className="container-prose">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="eyebrow">Ask Hope</p>
              <h2 className="m-0 mb-4">Ask Hope.</h2>
              <p className="text-muted max-w-readable">
                A Scripture-and-prayer chat where you can ask honest questions
                about the Bible, faith, doubt, the Christian life, the hard
                things — and receive a thoughtful, scriptural answer. Ask Hope
                is an AI companion, not a pastor. It points you to the Word
                and to the local church.
              </p>
              <Link href="/ask" className="btn btn--primary mt-6">
                Ask a question
              </Link>
            </div>
            <div className="card">
              <p className="card__eyebrow">Try one of these</p>
              <ul className="m-0 p-0 list-none flex flex-col gap-2">
                {[
                  "Who is Jesus?",
                  "What does Habakkuk 2:14 mean?",
                  "Is the Bible reliable?",
                  "I'm grieving. Where is God?",
                  "How can I begin to follow Christ?",
                ].map((q) => (
                  <li key={q}>
                    <Link
                      href={`/ask?q=${encodeURIComponent(q)}` as `/ask?q=${string}`}
                      className="text-muted hover:text-gold"
                    >
                      {q} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* THE SCROLL */}
      <section
        className="section border-y border-[var(--border-soft)]"
        style={{ background: "rgba(212, 175, 55, 0.035)" }}
      >
        <div className="container-prose">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div>
              <p className="eyebrow">The Scroll</p>
              <h2 className="m-0 mb-4">Open the deep study desk.</h2>
              <p className="text-muted max-w-readable">
                The Scroll gathers the doctrinal notebook: YHWH, Trinity,
                Jesus as God, messianic prophecy, Israel and the nations,
                Revelation, Christianity and Islam, and how to study Scripture
                without isolating verses from the whole Bible.
              </p>
              <Link href="/scroll" className="btn btn--primary mt-6">
                Open The Scroll
              </Link>
            </div>
            <div className="card">
              <p className="card__eyebrow">Study lanes</p>
              <ul className="m-0 p-0 list-none flex flex-col gap-2">
                {[
                  { label: "The Word of God as foundation", slug: "word-of-god-foundation" },
                  { label: "YHWH, Trinity, and the Holy Spirit", slug: "yhwh-gods-true-name" },
                  { label: "Christ in the Old Testament", slug: "messianic-prophecy" },
                  { label: "Israel, Gentiles, and the nations", slug: "israel" },
                  { label: "Revelation and Christian apologetics", slug: "revelation" },
                ].map((lane) => (
                  <li key={lane.slug}>
                    <Link
                      href={`/scroll/${lane.slug}` as `/scroll/${string}`}
                      className="text-muted hover:text-gold"
                    >
                      {lane.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* MINISTRY GRID — 12 doorways into the Word */}
      <section className="section">
        <div className="container-prose">
          <header className="mb-10 text-center">
            <p className="eyebrow">The library</p>
            <h2 className="mx-auto" style={{ maxWidth: "28ch" }}>
              Twelve doorways into the Word.
            </h2>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {ministryGrid.map((s) => (
              <article key={s.eyebrow} className="card">
                <p className="card__eyebrow">{s.eyebrow}</p>
                <h3 className="m-0 mb-3 text-base">{s.title}</h3>
                <p className="text-muted mb-6 text-sm">{s.body}</p>
                <Link
                  href={s.cta.href}
                  className="btn btn--ghost text-sm"
                  style={{ padding: "0.625rem 1.25rem" }}
                >
                  {s.cta.label} →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WHOLE EARTH SCRIPTURE BANNER */}
      <section className="section overflow-hidden border-y border-[var(--border-soft)]">
        <div className="container-prose">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] xl:gap-14">
            <figure className="relative order-2 m-0 overflow-hidden rounded-sm border border-[var(--border-soft)] shadow-[0_28px_80px_rgba(0,0,0,0.28)] lg:order-1">
              <Image
                src={psalmGloryImage}
                alt="People from many nations looking toward warm sunlight"
                width={2560}
                height={1440}
                sizes="(min-width: 1280px) 620px, (min-width: 1024px) 54vw, 100vw"
                className="h-auto w-full object-cover"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(5,11,24,0.08),rgba(5,11,24,0)_44%,rgba(5,11,24,0.18))]"
              />
            </figure>
            <div className="order-1 lg:order-2">
              <blockquote className="scripture-display border-none m-0 p-0 lg:text-left">
                Blessed be his glorious name forever! Let the whole earth be
                filled with his glory! Amen and amen.
              </blockquote>
              <p className="scripture-ref lg:text-left">Psalm 72:19 · WEB</p>
            </div>
          </div>
        </div>
      </section>

      {/* MESSAGES + GALLERY */}
      <section className="section">
        <div className="container-prose">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="eyebrow">Messages</p>
              <h2 className="m-0 mb-4">Hear the Word.</h2>
              <p className="text-muted max-w-readable">
                Sermons, teachings, studies, prayers, Daily Word, healing and
                miracles, and meditating on the Word belong here — the published
                ministry messages gathered in one place.
              </p>
              <Link href="/messages" className="btn btn--secondary mt-6">
                Browse Messages
              </Link>
            </div>
            <div>
              <p className="eyebrow">Glory Gallery</p>
              <h2 className="m-0 mb-4">Images with a statement.</h2>
              <p className="text-muted max-w-readable">
                AI-assisted ministry visuals can live in a gallery, each paired
                with Scripture and a short statement so the image serves the
                Word instead of floating by itself.
              </p>
              <Link href="/gallery" className="btn btn--ghost mt-6">
                Open Gallery
              </Link>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {missionFaces.map((image) => (
              <figure
                key={image.src}
                className="relative m-0 overflow-hidden rounded-sm border border-[var(--border-soft)]"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={2560}
                  height={1440}
                  sizes="(min-width: 1024px) 245px, (min-width: 640px) 50vw, 100vw"
                  className="aspect-[4/3] w-full object-cover"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-[linear-gradient(0deg,rgba(5,11,24,0.86),rgba(5,11,24,0))] px-4 pb-4 pt-12 text-sm font-semibold text-cream">
                  {image.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* NEED HELP TODAY? */}
      <section
        className="section border-y"
        style={{
          borderColor: "var(--blood-crimson)",
          background: "rgba(138, 28, 28, 0.06)",
        }}
      >
        <div className="container-prose">
          <header className="mb-8">
            <p className="eyebrow">Need help today?</p>
            <h2 className="m-0 mb-4">You don't have to be alone with this.</h2>
            <p className="text-muted max-w-readable">
              Choose what fits where you are right now. No registration. No
              payment. No pressure.
            </p>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Link
              href="/help/suicide"
              className="card block hover:no-underline"
              style={{ borderColor: "var(--blood-crimson)" }}
            >
              <p
                className="card__eyebrow"
                style={{ color: "var(--blood-crimson)" }}
              >
                Highest priority
              </p>
              <h3 className="m-0 mb-2 text-warm">I feel like ending my life</h3>
              <p className="m-0 text-muted text-sm">
                Crisis-mode help. Immediate steps.
              </p>
            </Link>
            <Link href="/prayer" className="card block hover:no-underline">
              <p className="card__eyebrow">Pray With Me</p>
              <h3 className="m-0 mb-2 text-warm">I need prayer</h3>
              <p className="m-0 text-muted text-sm">
                Share a request, anonymously if you wish.
              </p>
            </Link>
            <Link href="/help/grief" className="card block hover:no-underline">
              <p className="card__eyebrow">Grief</p>
              <h3 className="m-0 mb-2 text-warm">I am grieving</h3>
              <p className="m-0 text-muted text-sm">
                Where God meets us in loss.
              </p>
            </Link>
            <Link href="/help/fear" className="card block hover:no-underline">
              <p className="card__eyebrow">Fear and anxiety</p>
              <h3 className="m-0 mb-2 text-warm">I feel afraid</h3>
              <p className="m-0 text-muted text-sm">
                The honest cry of an honest heart.
              </p>
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/help-now" className="btn btn--primary">
              Open Need Help Today?
            </Link>
            <Link href="/journey/30-day/1" className="btn btn--secondary">
              Start the 30-Day Hope Journey
            </Link>
            <Link href="/help/crisis-resources" className="btn btn--secondary">
              Crisis resources
            </Link>
          </div>
        </div>
      </section>

      {/* CHRIST IN YOU SCRIPTURE BANNER */}
      <section className="section overflow-hidden bg-navy border-y border-[var(--border-soft)]">
        <div className="container-prose">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[0.85fr_1.15fr] xl:gap-14">
            <div>
              <blockquote className="scripture-display border-none m-0 p-0 lg:text-left">
                Christ in you, the hope of glory.
              </blockquote>
              <p className="scripture-ref lg:text-left">Colossians 1:27 · WEB</p>
            </div>
            <figure className="relative m-0 overflow-hidden rounded-sm border border-[var(--border-soft)] shadow-[0_28px_80px_rgba(0,0,0,0.35)]">
              <Image
                src={christInYouImage}
                alt="Christ with radiant cross-shaped light over his heart"
                width={2560}
                height={1440}
                sizes="(min-width: 1280px) 620px, (min-width: 1024px) 54vw, 100vw"
                className="h-auto w-full object-cover"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(5,11,24,0.2),rgba(5,11,24,0)_38%,rgba(5,11,24,0.1))]"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* AI NOTE + SUPPORT THE MISSION */}
      <section className="section">
        <div className="container-prose grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div>
            <p className="eyebrow">A note about AI</p>
            <h2 className="m-0 mb-4">A help, not a head.</h2>
            <p className="text-muted">
              Hope of Glory uses AI tools to help produce sermons, prayer
              prompts, study notes, audio, and visuals. A human reviews what
              we publish.
            </p>
            <p className="text-muted">
              AI is a help, not a head. The Word of God is the Word of God,
              and Christ alone is Lord of the church.
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <Link href="/about/why" className="btn btn--ghost">
                Why this ministry exists →
              </Link>
              <Link href="/ai-disclosure" className="btn btn--ghost">
                Read our full AI disclosure →
              </Link>
            </div>
          </div>
          <div>
            <p className="eyebrow">Support the mission</p>
            <h2 className="m-0 mb-4">Help keep this ministry available.</h2>
            <p className="text-muted">
              Giving is optional. The gospel, prayer, and biblical help are
              freely offered. If you want to support the mission, you can
              give here.
            </p>
            <Link href="/give" className="btn btn--secondary mt-2">
              Support the mission
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
