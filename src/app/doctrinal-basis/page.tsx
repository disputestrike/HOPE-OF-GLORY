import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Doctrinal basis",
  description:
    "How Hope of Glory Ministry handles Scripture, the creeds, secondary disputes, and the boundary between what we hold without negotiation and what we hold humbly.",
};

export default function DoctrinalBasisPage() {
  return (
    <section className="section">
      <div className="container-prose">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Doctrinal Basis", href: "/doctrinal-basis" },
          ]}
        />

        <header className="mb-10">
          <p className="eyebrow">Doctrinal basis</p>
          <h1>How we handle doctrine.</h1>
          <p
            className="text-muted max-w-readable"
            style={{ fontSize: "var(--fs-body-lg)" }}
          >
            Our beliefs are set out in the{" "}
            <Link href="/beliefs" className="text-gold">
              Statement of Faith
            </Link>
            . This page explains the method underneath it — which authorities
            bind us, which translation we use, and how we treat the matters on
            which faithful Christians have long disagreed.
          </p>
        </header>

        <article className="prose-ministry mb-12">
          <h2>Scripture is the final authority.</h2>
          <p>
            The sixty-six books of the Old and New Testaments are our sole
            final authority for faith and practice. Tradition, reason,
            experience, and the witness of the church are servants of the
            Word, never its judges. Where Scripture speaks clearly, we speak
            clearly. Where it is silent or veiled, we do not invent.
          </p>

          <h2>We confess the historic creeds.</h2>
          <p>
            We stand inside the faith confessed by the Apostles' and Nicene
            Creeds: one God in three persons; the full deity and full humanity
            of Jesus Christ; His death, bodily resurrection, ascension, and
            return; salvation by grace through faith; the resurrection of the
            dead and the life of the world to come. These are not negotiable.
          </p>

          <h2>We use the World English Bible (WEB).</h2>
          <p>
            Every verse we quote in our published content uses the World
            English Bible, a modern public-domain translation. We chose it
            deliberately: it can be read, copied, shared, printed, and
            translated by anyone, anywhere, without permission or payment — a
            free Bible for a free gospel. We do not publish under the ESV,
            NIV, NASB, or other restricted translations. Our citation
            validator checks each reference against the WEB text before
            publishing, so hallucinated or misquoted verses are caught.
          </p>

          <h2>On disputed doctrines, we name positions and refuse to coerce.</h2>
          <p>
            Sincere, Bible-believing Christians have read certain passages
            differently for centuries — the mode and subjects of baptism, the
            operation of spiritual gifts today, the order of end-time events,
            the precise relationship of divine sovereignty and human will,
            church government, and more. On these secondary matters, our
            practice is fixed: we state the historic positions charitably and
            accurately, we show the Scriptures each side leans on, and we
            decline to bind your conscience beyond what is written. We will
            not pretend a disputed matter is settled, and we will not
            manufacture controversy where Scripture is plain.
          </p>

          <h2>The boundary.</h2>
          <p>
            The line between &ldquo;held without negotiation&rdquo; and
            &ldquo;held humbly&rdquo; is itself a doctrine we take seriously.
            To blur it in either direction — treating a creedal essential as
            optional, or treating a personal opinion as a test of fellowship —
            does damage to the body of Christ. We aim to be immovable on the
            center and gracious at the edges.
          </p>

          <h2>How AI fits.</h2>
          <p>
            Hope of Glory uses AI tools to help produce teaching, but the AI
            is bound by these same documents and may never exceed them. It may
            explain Scripture and summarize the traditions; it may never claim
            fresh revelation, bind your conscience, or speak in the place of
            the Spirit or the church. See our{" "}
            <Link href="/ai-disclosure" className="text-gold">
              AI disclosure
            </Link>{" "}
            for the full set of boundaries.
          </p>
        </article>

        <div className="gold-divider" />

        <section>
          <p className="eyebrow">Related</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/beliefs" className="btn btn--primary">
              Statement of Faith
            </Link>
            <Link href="/ai-disclosure" className="btn btn--secondary">
              AI disclosure
            </Link>
            <Link href="/trust-the-scriptures" className="btn btn--ghost">
              Why we trust the Scriptures
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}
