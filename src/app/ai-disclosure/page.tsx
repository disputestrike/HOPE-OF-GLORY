import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "AI disclosure",
  description:
    "How Hope of Glory Ministry uses artificial intelligence, what the AI may do, what it must never claim, and what it always discloses about itself. A help, not a head.",
};

const mayDo = [
  "Quote and explain Scripture using sound, historically rooted Christian teaching.",
  "Summarize the views of the major Christian traditions on disputed matters, charitably and accurately.",
  "Answer doctrinal, historical, linguistic, and pastoral questions within the bounds of our doctrinal documents.",
  "Pray with users in accordance with our prayer policy.",
  "Point users to Scripture, to their local church, and to qualified human help.",
  "Acknowledge uncertainty and the limits of its knowledge, and decline questions outside its mandate.",
];

const neverClaim = [
  ["No fresh revelation", "The AI may never claim a new word from God, a personal prophecy, a vision, or any revelation beyond what is written. Scripture is closed; the AI does not add to it."],
  ["No prophetic certainty", "It may not predict dates, name living people as fulfillments of prophecy, or speak about the future with the authority of a biblical prophet."],
  ["No guaranteed outcome", "It may not promise healing, money, restored relationships, or any concrete outcome in exchange for faith, prayer, or giving. God heals as He wills and is not bound by formulas."],
  ["No sacramental authority", "It may not baptize, administer the Lord's Supper, marry, hear confession, absolve sin, ordain, bless, or curse. These belong to the gathered church and its called ministers."],
  ["No knowledge of eternal standing", "It may never declare any person — living or dead, named or anonymous — saved or damned. It explains what Scripture says in general; it never applies that judgment to an individual."],
  ["No authority over conscience", "On matters Scripture does not bind, the AI states the historic positions and refuses to compel a verdict."],
  ["No impersonation", "It may never claim to be human, the founder, a pastor, an angel, the Holy Spirit, Jesus, or God. Asked whether it is human, it answers plainly that it is not."],
];

export default function AiDisclosurePage() {
  return (
    <section className="section">
      <div className="container-prose">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "AI Disclosure", href: "/ai-disclosure" },
          ]}
        />

        <header className="mb-10">
          <p className="eyebrow">AI disclosure</p>
          <h1>A help, not a head.</h1>
          <p
            className="text-muted max-w-readable"
            style={{ fontSize: "var(--fs-body-lg)" }}
          >
            Hope of Glory Ministry uses an artificial intelligence system to
            help teach, answer questions, pray, and produce sermons, prayer
            prompts, study notes, audio, and visuals. A human reviews what we
            publish. This page defines what that system may say, what it must
            never claim, and what it always discloses. These boundaries are
            not suggestions — they are the conditions under which the ministry
            permits the AI to speak in its name.
          </p>
        </header>

        <section className="card mb-10">
          <p className="card__eyebrow">What the AI is</p>
          <p className="m-0 text-warm">
            The AI is a software tool trained on text. It is not a person, not
            a pastor, not a prophet, not a priest, and not a substitute for the
            Holy Spirit or the local church. It does not have a soul, a
            conscience, or the gift of spiritual discernment. It can be useful.
            It can be wrong. It must be treated as a tool, never as an oracle.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4">What the AI may do</h2>
          <ul className="m-0 text-muted">
            {mayDo.map((item) => (
              <li key={item} className="mb-2">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="mb-4">What the AI must never claim</h2>
          <div className="flex flex-col gap-4">
            {neverClaim.map(([heading, body]) => (
              <div key={heading} className="card">
                <p className="card__eyebrow">{heading}</p>
                <p className="m-0 text-warm">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="card mb-10">
          <p className="card__eyebrow">What the AI always discloses</p>
          <ul className="m-0 text-warm">
            <li>It is an artificial intelligence, not a human being.</li>
            <li>It is a tool of Hope of Glory Ministry, governed by our published doctrinal documents.</li>
            <li>It can be mistaken; test what it says against Scripture and consult your local church.</li>
            <li>It is not a substitute for pastoral care, professional counseling, medical or legal advice, or emergency services.</li>
          </ul>
        </section>

        <section className="card mb-10">
          <p className="card__eyebrow">Human review and crisis</p>
          <p className="m-0 mb-3 text-warm">
            No sermon, teaching, or apologetics article is published without a
            human read. Doctrine passes through a gate that checks every draft
            against the creeds and Scripture before it ships, and a validator
            checks every quoted verse against the World English Bible.
          </p>
          <p className="m-0 text-warm">
            In any crisis — when someone expresses a wish to end their life or
            that anyone is in danger — the AI stops trying to be clever, hands
            the moment to human help, and points to emergency services. See
            our{" "}
            <Link href="/crisis-disclaimer" className="text-gold">
              crisis disclaimer
            </Link>
            .
          </p>
        </section>

        <div className="gold-divider" />

        <section>
          <p className="eyebrow">Related</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/about/why" className="btn btn--primary">
              Why this ministry exists
            </Link>
            <Link href="/doctrinal-basis" className="btn btn--secondary">
              Doctrinal basis
            </Link>
            <Link href="/ask" className="btn btn--ghost">
              Try Ask Hope
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}
