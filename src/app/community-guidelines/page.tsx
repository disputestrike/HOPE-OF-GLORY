import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Community guidelines",
  description:
    "How we ask people to engage across Hope of Glory Ministry — prayer requests, questions, and comments. Truth with love. Compare doctrines, never demean persons.",
};

export default function CommunityGuidelinesPage() {
  return (
    <section className="section">
      <div className="container-prose">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Community Guidelines", href: "/community-guidelines" },
          ]}
        />

        <header className="mb-10">
          <p className="eyebrow">Community guidelines</p>
          <h1>Truth with love.</h1>
          <p
            className="text-muted max-w-readable"
            style={{ fontSize: "var(--fs-body-lg)" }}
          >
            However you engage here — sharing a prayer request, asking a
            question, leaving a comment — these are the simple expectations
            that keep this a place where people can meet Christ without being
            wounded by His people.
          </p>
        </header>

        <section className="mb-10">
          <blockquote className="scripture-display border-none m-0 p-0">
            Let no corrupt speech proceed out of your mouth, but only what is
            good for building up as the need may be, that it may give grace to
            those who hear.
          </blockquote>
          <p className="scripture-ref">Ephesians 4:29 · WEB</p>
        </section>

        <article className="prose-ministry mb-12">
          <h2>What we hope for.</h2>
          <ul>
            <li>
              <strong>Honesty.</strong> Bring your real questions, your real
              doubt, your real pain. You do not have to clean yourself up to be
              welcome here.
            </li>
            <li>
              <strong>Charity.</strong> Assume the best of others. Disagree
              without contempt.
            </li>
            <li>
              <strong>Compare doctrines, never demean persons.</strong> You may
              challenge an idea, a teaching, or a claim with full vigor. You may
              not attack a person or a people-group for their faith, ethnicity,
              or background. We hold this line especially in apologetics.
            </li>
            <li>
              <strong>Point to Christ and the Scriptures.</strong> The goal is
              never to win; it is to help someone see Jesus more clearly.
            </li>
          </ul>

          <h2>What is not welcome.</h2>
          <ul>
            <li>Harassment, threats, slurs, or contempt toward any person or group.</li>
            <li>Spam, scams, solicitation, or self-promotion.</li>
            <li>Sexual content, graphic violence, or content harmful to minors.</li>
            <li>Using Scripture as a weapon to shame, manipulate, or control.</li>
            <li>Sharing others' private information without consent.</li>
            <li>Claiming to speak fresh revelation, prophecy, or judgment over another person.</li>
          </ul>

          <h2>Prayer requests.</h2>
          <p>
            Prayer requests may be shared anonymously. Share only what you are
            comfortable making known, and please do not post other people's
            private details. Requests may be reviewed by a human before they
            are prayed over publicly. If a request signals that someone is in
            danger, we will treat it as a crisis and point to immediate help —
            see our{" "}
            <Link href="/crisis-disclaimer" className="text-gold">
              crisis disclaimer
            </Link>
            .
          </p>

          <h2>How moderation works.</h2>
          <p>
            Submissions may pass through automated safety checks and human
            review. We may decline to publish, edit for safety, or remove
            content that crosses these lines — and in serious cases restrict
            participation. Moderation is not censorship of honest disagreement;
            it is care for the people in the room. If we get a moderation call
            wrong, tell us on the{" "}
            <Link href="/corrections" className="text-gold">
              corrections
            </Link>{" "}
            page.
          </p>
        </article>

        <div className="gold-divider" />

        <section>
          <p className="eyebrow">Related</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/prayer" className="btn btn--primary">
              Share a prayer request
            </Link>
            <Link href="/ask" className="btn btn--secondary">
              Ask a question
            </Link>
            <Link href="/corrections" className="btn btn--ghost">
              Report a problem
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}
