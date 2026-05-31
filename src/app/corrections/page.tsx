import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Corrections",
  description:
    "How Hope of Glory Ministry handles mistakes: how to report an error, what we do when we are wrong, and our commitment to correct publicly and promptly.",
};

export default function CorrectionsPage() {
  return (
    <section className="section">
      <div className="container-prose">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Corrections", href: "/corrections" },
          ]}
        />

        <header className="mb-10">
          <p className="eyebrow">Corrections</p>
          <h1>When we are wrong, we say so.</h1>
          <p
            className="text-muted max-w-readable"
            style={{ fontSize: "var(--fs-body-lg)" }}
          >
            We handle the Word of God, and we do it with the help of AI tools
            and fallible people. That means we will sometimes get something
            wrong — a misquoted verse, a clumsy sentence, an unfair
            characterization, a factual error. When that happens, we want to
            hear it, and we want to fix it in the open.
          </p>
        </header>

        <section className="mb-10">
          <blockquote className="scripture-display border-none m-0 p-0">
            We have renounced the hidden things of shame, not walking in
            craftiness, nor handling the word of God deceitfully; but by the
            manifestation of the truth commending ourselves to every man's
            conscience.
          </blockquote>
          <p className="scripture-ref">2 Corinthians 4:2 · WEB</p>
        </section>

        <article className="prose-ministry mb-12">
          <h2>How to report an error.</h2>
          <p>
            Email{" "}
            <a href="mailto:corrections@hopeofglory.ministry" className="text-gold">
              corrections@hopeofglory.ministry
            </a>{" "}
            with the page or message, what you believe is wrong, and — if you
            can — the Scripture or source that supports the correction. You do
            not need to be a scholar or use careful language. A plain note is
            enough. You may report anonymously.
          </p>

          <h2>What we do with it.</h2>
          <ul>
            <li>
              <strong>We read every report.</strong> A human reviews each one,
              not a bot.
            </li>
            <li>
              <strong>We test it against Scripture and sources.</strong> A
              legitimate doctrinal or factual correction is verified before we
              act.
            </li>
            <li>
              <strong>We fix it promptly.</strong> Clear errors — a wrong
              reference, a typo in a verse, a broken link — are corrected as
              soon as we can.
            </li>
            <li>
              <strong>We correct in the open.</strong> For anything
              substantive, we would rather publish the correction than quietly
              edit and pretend it never happened.
            </li>
          </ul>

          <h2>Doctrine and disputed matters.</h2>
          <p>
            On the historic essentials of the faith, we will not move — see our{" "}
            <Link href="/beliefs" className="text-gold">
              Statement of Faith
            </Link>
            . On matters where faithful Christians have long disagreed, a
            &ldquo;correction&rdquo; that simply prefers a different valid
            position will be received graciously but may not change the page;
            we aim to represent the historic positions fairly rather than to
            take sides. See our{" "}
            <Link href="/doctrinal-basis" className="text-gold">
              doctrinal basis
            </Link>
            .
          </p>

          <h2>AI-specific errors.</h2>
          <p>
            Because we use AI tools, some errors come from the model rather
            than a writer. We treat those the same way: report it, we verify
            it, we fix it, and where a pattern emerges we adjust the guardrails
            so the same kind of mistake is less likely next time. See our{" "}
            <Link href="/ai-disclosure" className="text-gold">
              AI disclosure
            </Link>
            .
          </p>
        </article>

        <div className="gold-divider" />

        <section>
          <p className="eyebrow">Related</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="btn btn--primary">
              Contact us
            </Link>
            <Link href="/community-guidelines" className="btn btn--secondary">
              Community guidelines
            </Link>
            <Link href="/about/why" className="btn btn--ghost">
              Why this ministry exists
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}
