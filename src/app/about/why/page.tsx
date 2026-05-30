import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Why this ministry exists",
  description:
    "Why Hope of Glory exists, why we won't sell you anything, why we built it with AI, and the standards we hold ourselves to. The founder's plain account.",
};

export default function WhyPage() {
  return (
    <section className="section">
      <div className="container-prose">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "About", href: "/about/why" },
            { name: "Why this ministry exists", href: "/about/why" },
          ]}
        />

        <header className="mb-10">
          <p className="eyebrow">About</p>
          <h1>Why this ministry exists.</h1>
          <p
            className="text-muted max-w-readable"
            style={{ fontSize: "var(--fs-body-lg)" }}
          >
            The plain account: why we built this, why we won't sell you
            anything, why we use AI, what we won't do, and the standards we
            hold ourselves to. Read it before you decide whether to trust us
            with your soul-care, your prayer requests, or your gift.
          </p>
        </header>

        <section className="mb-10">
          <blockquote className="scripture-display border-none m-0 p-0">
            For the earth will be filled with the knowledge of the glory of
            the Lord, as the waters cover the sea.
          </blockquote>
          <p className="scripture-ref">Habakkuk 2:14 · WEB</p>
        </section>

        <article className="prose-ministry mb-12">
          <h2>The verse that started this.</h2>
          <p>
            One verse keeps coming back: <em>the earth will be filled with the
            knowledge of the glory of the Lord, as the waters cover the sea.</em>{" "}
            Not a small remnant. The whole earth. Not someday in theory. As
            certainly as the sea covers the seabed. That's the future the
            Bible promises and that's the future this ministry is trying to
            help bring nearer.
          </p>
          <p>
            We are not the church. We are not a replacement for the church.
            We do not want to be your pastor. What we are trying to be is a
            front door — a place a stranger can walk up to at 3 a.m. and find
            the gospel of Jesus Christ, real Scripture, an honest answer to
            an honest question, a prayer they can pray, and a clear next step
            toward a local body of believers.
          </p>

          <h2>What this site is, in one paragraph.</h2>
          <p>
            Hope of Glory Ministry is a Christian media ministry. We publish
            a daily Bible-grounded message. We answer hard questions
            honestly. We offer a Scripture-and-prayer chat called Ask Hope.
            We keep a Hope Line for people who are hurting too much to type.
            We point seekers to Jesus Christ, to repentance and faith, to
            the Word of God, and to a local church. We use the World
            English Bible (WEB), a public-domain translation that anyone
            anywhere can read, copy, share, and translate without
            permission.
          </p>

          <h2>Why we won't sell you anything.</h2>
          <p>
            The gospel is free. Prayer is free. Biblical help is free. They
            were paid for once and forever, two thousand years ago, on a
            Roman cross. Charging you to access them would be a betrayal of
            the thing itself.
          </p>
          <p>
            So you will never find a paywall here. You will never be asked
            for your credit card to read a teaching, ask a question, share a
            prayer request, or call the Hope Line. You will never be told to
            give a "seed" to get a blessing. You will never be promised
            healing, money, or favor in exchange for a gift. We consider
            that kind of teaching a serious distortion of the Bible.
          </p>
          <p>
            If you want to support the mission, you can. Giving is optional,
            and the giving page tells you plainly what your gift funds. If
            you give and later change your mind, we refund it for thirty
            days without asking why.
          </p>

          <h2>Why we use AI.</h2>
          <p>
            A small team can't write a sermon every morning, answer ten
            thousand seeker questions a day, return prayer at scale, and
            keep a phone line open for the hurting. With AI we can. AI lets
            one ministry behave like a much larger one — at the cost of
            tools, not staff — and the cost savings stay in the mission
            instead of going to overhead.
          </p>
          <p>
            But AI is a help, not a head. The Word of God is the Word of
            God. Christ alone is Lord of his church. So we hold ourselves to
            five rules, none of which are negotiable:
          </p>
          <ol>
            <li>
              <strong>A human reviews what we publish.</strong> No sermon,
              teaching, or apologetics article goes public without a human
              read.
            </li>
            <li>
              <strong>Doctrine is gated.</strong> Before anything publishes,
              it passes through a doctrine check that compares the draft
              against the historic creeds and the plain reading of
              Scripture. If it fails the check, it doesn't ship.
            </li>
            <li>
              <strong>Crisis is never AI alone.</strong> When someone tells
              us they want to end their life, or that someone is in
              immediate danger, the system stops trying to be clever and
              hands the moment to a trained human, points them to the
              988 Suicide &amp; Crisis Lifeline (in the U.S.) or 911, and
              keeps the person company while help is on the way.
            </li>
            <li>
              <strong>Scripture is never invented.</strong> Every verse
              quoted in our published content is checked against the WEB
              text by a validator. Hallucinated references are blocked
              before publish.
            </li>
            <li>
              <strong>We disclose.</strong> Anything AI-assisted is labeled
              as such. We won't pretend a human wrote what a model drafted.
            </li>
          </ol>

          <h2>What we won't do.</h2>
          <p>
            We won't promise prosperity for gifts. We won't sell your
            email. We won't share your prayer requests beyond what's
            strictly required to pray for you and follow up. We won't shame
            anyone for unbelief, doubt, or sin — the gospel meets people
            where they are. We won't insult people of other religions; we
            will compare doctrines, never demean persons. We won't pretend
            to be a substitute for a local church, a counselor, a doctor,
            or 911.
          </p>

          <h2>What we will do.</h2>
          <p>
            We will preach Jesus Christ, crucified, risen, and returning.
            We will use the whole Bible — Old Testament and New, Genesis to
            Revelation — and let it interpret itself. We will pray for
            people who write in. We will hand off to a human the moment a
            human is needed. We will publish a plain-English account of how
            donated funds are used. We will fix mistakes publicly when we
            make them, because the One we serve is the truth.
          </p>

          <h2>A note to the seeker.</h2>
          <p>
            If you came here because you are looking for God — start with
            the page called <Link href="/come-to-christ" className="text-gold">Come to Christ</Link>.
            That is the most important page on this site. The gospel is
            short. It will not waste your time. And if you are not ready
            for that, you are still welcome here. Ask any question on{" "}
            <Link href="/ask" className="text-gold">Ask Hope</Link>. Read
            anything in the <Link href="/read" className="text-gold">Library</Link>.
            Take all the time you need.
          </p>

          <h2>A note to the hurting.</h2>
          <p>
            If you are hurting too much to read, please go to{" "}
            <Link href="/help-now" className="text-gold">Need Help Today</Link>{" "}
            and pick the door that fits where you are. If you are in
            danger, in the United States, call or text{" "}
            <strong>988</strong> right now. The Suicide &amp; Crisis
            Lifeline is free, confidential, and open every minute of every
            day. We are glad you are here. Please don't go.
          </p>

          <h2>A note to a future donor.</h2>
          <p>
            We are completing our 501(c)(3) nonprofit incorporation and IRS
            Form 1023 filing. Until that determination letter is issued,
            gifts are not yet tax-deductible. When it is granted, we will
            issue receipts retroactively for gifts given during the
            application period. We would rather earn your trust before we
            activate giving than turn this into a fundraising-first
            ministry.
          </p>

          <h2>The standard we hold ourselves to.</h2>
          <p>
            Paul wrote to the Corinthians:{" "}
            <em>we have renounced the hidden things of shame, not walking in
            craftiness, nor handling the word of God deceitfully; but by the
            manifestation of the truth commending ourselves to every man's
            conscience in the sight of God.</em>{" "}
            (2 Corinthians 4:2, WEB.) That is the standard. If we ever fall
            short of it, write us at{" "}
            <a href="mailto:hello@hopeofglory.ministry" className="text-gold">
              hello@hopeofglory.ministry
            </a>{" "}
            and tell us. We will read every letter, and the legitimate
            corrections will be published.
          </p>
        </article>

        <section className="mb-10">
          <blockquote className="scripture-display border-none m-0 p-0">
            Christ in you, the hope of glory.
          </blockquote>
          <p className="scripture-ref">Colossians 1:27 · WEB</p>
        </section>

        <div className="gold-divider" />

        <section>
          <p className="eyebrow">Next steps</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/come-to-christ" className="btn btn--primary">
              Come to Christ
            </Link>
            <Link href="/ai-disclosure" className="btn btn--secondary">
              Read our AI disclosure
            </Link>
            <Link href="/donation-ethics" className="btn btn--secondary">
              Read our donation ethics
            </Link>
            <Link href="/contact" className="btn btn--ghost">
              Contact us
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}
