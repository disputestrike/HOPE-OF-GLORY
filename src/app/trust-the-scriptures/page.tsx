import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Trust the Scriptures",
  description:
    "A Christian answer to questions about the Bible, manuscripts, corruption claims, history, archaeology, science, and Christ's view of Scripture.",
};

const trustLanes = [
  {
    title: "Christ received the Scriptures",
    body:
      "Jesus treated the Law, the Prophets, and the Psalms as the Word of God. He corrected bad interpretation, but he did not treat Scripture as broken, disposable, or unreliable.",
    refs: ["Matthew 5:17-18", "Luke 24:27", "Luke 24:44-47", "John 10:35"],
  },
  {
    title: "The text was copied, not invented",
    body:
      "The Bible was transmitted through manuscripts. That means we can compare copies, identify variants, and test claims. Variants exist, but the core message is not hidden or lost.",
    refs: ["Isaiah 40:8", "Matthew 24:35", "1 Peter 1:24-25"],
  },
  {
    title: "History gives real-world handles",
    body:
      "Scripture names places, rulers, customs, conflicts, journeys, cities, exile, return, crucifixion, and resurrection witnesses. Christianity makes claims in public history.",
    refs: ["Luke 1:1-4", "Acts 26:26", "1 Corinthians 15:3-8"],
  },
  {
    title: "Archaeology can clarify the setting",
    body:
      "Archaeology does not replace faith, and it does not prove every doctrine. But it often confirms the world the Bible describes and corrects claims that Scripture was careless about history.",
    refs: ["Psalm 119:160", "John 19:35", "2 Peter 1:16"],
  },
];

const witnesses = [
  {
    title: "Dead Sea Scrolls",
    body:
      "Ancient Hebrew manuscripts and fragments show that the Old Testament text was preserved with remarkable care across centuries, while also giving scholars earlier witnesses to compare.",
  },
  {
    title: "New Testament manuscript tradition",
    body:
      "The New Testament is supported by thousands of Greek manuscripts and many early translations and quotations. Textual criticism works because the evidence is abundant, not because it is absent.",
  },
  {
    title: "Pontius Pilate inscription",
    body:
      "An inscription from Caesarea names Pontius Pilate as a Roman prefect in Judea, matching the historical setting of the Gospels.",
  },
  {
    title: "Tel Dan inscription",
    body:
      "This inscription is widely discussed because it appears to refer to the house of David, giving an outside witness to Davidic kingship language.",
  },
  {
    title: "Pools of Bethesda and Siloam",
    body:
      "Locations named in John's Gospel have been identified archaeologically, showing that the Gospel writer knows the geography of Jerusalem.",
  },
  {
    title: "Cyrus and the Persian return",
    body:
      "Persian-era evidence helps illuminate the policy world behind the return from exile, the rebuilding period, and the setting of books like Ezra and Nehemiah.",
  },
];

const cautions = [
  "Do not pretend textual variants do not exist. They do. Christians should tell the truth about them.",
  "Do not claim archaeology proves every event. It gives evidence, context, and confirmation, but Scripture is not reduced to artifacts.",
  "Do not make science the judge over God. The created world is God's world, and careful study of it should lead to humility, not arrogance.",
  "Do not answer corruption claims with fear. Compare manuscripts, examine history, and come back to Christ.",
];

export default function TrustTheScripturesPage() {
  return (
    <section className="section">
      <div className="container-prose">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Trust the Scriptures", href: "/trust-the-scriptures" },
          ]}
        />

        <header className="mb-12 grid grid-cols-1 items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow">Bible confidence</p>
            <h1>Trust the Scriptures.</h1>
            <p
              className="text-muted max-w-readable"
              style={{ fontSize: "var(--fs-body-lg)" }}
            >
              A place for the questions people actually ask: Was the Bible
              corrupted? Can we know what it said? Is it historically grounded?
              Does archaeology help? What about science? And above all, how did
              Jesus himself treat the Scriptures?
            </p>
          </div>
          <figure className="m-0 overflow-hidden rounded-sm border border-[var(--border-soft)]">
            <Image
              src="/images/gallery/ministry_humanity_9.webp"
              alt="A man studying an open Bible beside a laptop"
              width={2560}
              height={1440}
              priority
              sizes="(min-width: 1024px) 600px, 100vw"
              className="aspect-[16/9] w-full object-cover"
            />
          </figure>
        </header>

        <section className="card mb-12" style={{ borderColor: "var(--glory-gold)" }}>
          <p className="card__eyebrow">The short answer</p>
          <p className="m-0 text-muted">
            Christians do not trust the Bible because we are afraid to ask hard
            questions. We trust it because God has spoken, Christ received and
            fulfilled the Scriptures, the manuscript evidence can be examined,
            the Bible stands in real history, and the central message has not
            been lost: Jesus Christ died for our sins, rose again, and reigns as
            Lord.
          </p>
        </section>

        <section className="mb-12">
          <p className="eyebrow">Four lanes</p>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {trustLanes.map((lane) => (
              <article key={lane.title} className="card">
                <h2 className="m-0 mb-3 text-base text-warm">{lane.title}</h2>
                <p className="text-muted text-sm">{lane.body}</p>
                <ul className="m-0 flex flex-wrap gap-2 p-0 text-xs uppercase tracking-[0.12em] text-gold">
                  {lane.refs.map((ref) => (
                    <li key={ref}>{ref}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <p className="eyebrow">Historical and archaeological witnesses</p>
          <h2>Not the foundation of faith, but useful witnesses.</h2>
          <p className="text-muted max-w-readable">
            The Christian faith rests on God's Word and on the risen Christ.
            Historical and archaeological evidence serves that faith by showing
            that Scripture speaks in the real world, not in a vague myth-world.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {witnesses.map((witness) => (
              <article key={witness.title} className="card">
                <h3 className="m-0 mb-3 text-base text-warm">{witness.title}</h3>
                <p className="m-0 text-muted text-sm">{witness.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <p className="eyebrow">How we answer corruption claims</p>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2>Truthful, calm, evidence-aware.</h2>
              <p className="text-muted">
                A serious Christian answer distinguishes copying variants from
                doctrinal corruption. Copyists made ordinary human mistakes.
                Scholars can see many of them precisely because so many
                manuscripts survive. That is not a reason to panic; it is one of
                the reasons the text can be studied openly.
              </p>
              <p className="text-muted">
                The better question is not, "Are there variants?" The better
                question is, "Do the variants overthrow the gospel, the deity of
                Christ, the cross, the resurrection, or the Christian hope?" No.
                The message remains clear.
              </p>
            </div>
            <div className="card">
              <p className="card__eyebrow">Guardrails</p>
              <ul className="m-0">
                {cautions.map((caution) => (
                  <li key={caution} className="text-muted mb-3">
                    {caution}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <p className="eyebrow">Go deeper</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Link href="/read/apologetics/why-trust-the-bible" className="card block hover:no-underline">
              <p className="card__eyebrow">Read</p>
              <h3 className="m-0 mb-2 text-warm">Why Trust the Bible?</h3>
              <p className="m-0 text-muted text-sm">
                The short Read-library article for Bible confidence.
              </p>
            </Link>
            <Link href="/read/apologetics/bible-corrupted" className="card block hover:no-underline">
              <p className="card__eyebrow">Read</p>
              <h3 className="m-0 mb-2 text-warm">Is the Bible Corrupted?</h3>
              <p className="m-0 text-muted text-sm">
                A direct answer to the most common corruption claim.
              </p>
            </Link>
            <Link href="/scroll/tahrif-bible-corruption" className="card block hover:no-underline">
              <p className="card__eyebrow">The Scroll</p>
              <h3 className="m-0 mb-2 text-warm">Tahrif and corruption claims</h3>
              <p className="m-0 text-muted text-sm">
                The deeper apologetics lane for Islam and Bible-corruption claims.
              </p>
            </Link>
            <Link href="/scroll/manuscripts-history-archaeology" className="card block hover:no-underline">
              <p className="card__eyebrow">The Scroll</p>
              <h3 className="m-0 mb-2 text-warm">Manuscripts, history, and archaeology</h3>
              <p className="m-0 text-muted text-sm">
                A structured topic map for the evidence questions.
              </p>
            </Link>
          </div>
        </section>

        <div className="gold-divider" />

        <section>
          <p className="eyebrow">Bring the question</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/ask" className="btn btn--primary">
              Ask Hope
            </Link>
            <Link href="/scroll" className="btn btn--secondary">
              Open The Scroll
            </Link>
            <Link href="/come-to-christ" className="btn btn--ghost">
              Come to Christ
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}
