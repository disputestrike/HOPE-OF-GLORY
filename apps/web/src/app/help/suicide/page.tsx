import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "If you are thinking about ending your life — please read this",
  description:
    "If you are in immediate danger, call 911. If you are in the U.S. or Canada, call or text 988 — Suicide & Crisis Lifeline. You are not alone. Your life matters.",
  robots: { index: true, follow: true },
};

/**
 * Suicide crisis page. Deliberately custom — NOT the dynamic /help/[topic]
 * route — because the structure must be different:
 *   1. Crisis numbers FIRST, above everything else
 *   2. No scripture-dump before safety direction
 *   3. No long theological argument
 *   4. No donation prompts anywhere
 *   5. Plain language, large tap targets for crisis hotlines
 */
export default function SuicidePage() {
  return (
    <section className="section--hero" style={{ paddingTop: "var(--space-12)" }}>
      <div className="container-prose">
        <aside
          className="p-6 md:p-8 rounded border mb-10"
          style={{
            borderColor: "var(--blood-crimson)",
            background: "rgba(138, 28, 28, 0.16)",
          }}
        >
          <p
            className="card__eyebrow m-0 mb-3"
            style={{ color: "var(--warm-light)" }}
          >
            Please read this first
          </p>
          <p
            className="m-0 mb-6 text-warm"
            style={{ fontSize: "var(--fs-body-lg)" }}
          >
            You should not be alone with this right now.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href="tel:911"
              className="btn btn--primary justify-center"
              style={{
                fontSize: "1.125rem",
                padding: "1.25rem 1.75rem",
                minHeight: "60px",
              }}
            >
              Call 911 — Emergency
            </a>
            <a
              href="tel:988"
              className="btn btn--secondary justify-center"
              style={{
                fontSize: "1.125rem",
                padding: "1.25rem 1.75rem",
                minHeight: "60px",
              }}
            >
              Call or Text 988 — Suicide & Crisis Lifeline (US/Canada)
            </a>
            <a
              href="sms:741741?body=HOME"
              className="btn btn--ghost justify-center"
              style={{
                fontSize: "1rem",
                padding: "1rem 1.5rem",
                minHeight: "52px",
              }}
            >
              Text HOME to 741741 — Crisis Text Line
            </a>
          </div>
        </aside>

        <header className="mb-10">
          <h1 style={{ maxWidth: "26ch" }}>
            Your life matters. Please don't be alone with this.
          </h1>
          <p
            className="text-muted max-w-readable"
            style={{ fontSize: "var(--fs-body-lg)" }}
          >
            I'm so sorry you are carrying this. What you are feeling is real,
            and it is heavy. You should not have to hold this on your own.
          </p>
        </header>

        <section className="mb-10">
          <h2>If you are in immediate danger</h2>
          <p>
            Call <a href="tel:911" className="text-gold"><strong>911</strong></a> right now.
            Or get to the nearest emergency room. Or call someone you trust who can drive you.
          </p>
          <p>
            If you have a plan or means to hurt yourself, please put distance between
            you and them. Move to a different room. Give the means to someone else.
            Lock them up. Anything to slow this down.
          </p>
        </section>

        <section className="mb-10">
          <h2>If you are in the U.S. or Canada</h2>
          <p>
            Call or text <a href="tel:988" className="text-gold"><strong>988</strong></a>{" "}
            — the Suicide & Crisis Lifeline. It is free. It is confidential. It is 24/7.
            The people there are trained to help. They will not judge you. They will not
            send police unless your life is in immediate danger.
          </p>
          <p>
            You can also <a href="https://988lifeline.org/chat/" className="text-gold" target="_blank" rel="noreferrer">
              chat online at 988lifeline.org/chat
            </a>.
          </p>
        </section>

        <section className="mb-10">
          <h2>Outside the U.S.</h2>
          <p>
            Please contact your country's emergency number or a local crisis line. For
            international suicide-prevention resources, see{" "}
            <a href="https://www.iasp.info/suicidalthoughts/" className="text-gold" target="_blank" rel="noreferrer">
              IASP (International Association for Suicide Prevention)
            </a>{" "}
            or{" "}
            <a href="https://www.befrienders.org/" className="text-gold" target="_blank" rel="noreferrer">
              Befrienders Worldwide
            </a>.
          </p>
        </section>

        <section className="mb-10">
          <h2>Please tell someone nearby</h2>
          <p>
            A family member. A friend. A neighbor. A pastor. Don't tell them through
            text alone. Knock on a door. Make a phone call. Show up. You are not a
            burden. Your life is not a burden. The people who love you would rather be
            called at 3 a.m. than miss this.
          </p>
        </section>

        <section className="mb-10">
          <h2>One thing the Bible says</h2>
          <p>
            I want to share one verse with you — and only one, because I don't want to
            bury you in words while you are trying to stay alive:
          </p>
          <blockquote className="scripture-display border-none m-0 p-0 my-8">
            The Lord is near to the brokenhearted, and saves those who have a crushed
            spirit.
          </blockquote>
          <p className="scripture-ref">Psalm 34:18 · WEB</p>
          <p>
            He is near. Even now. Especially now. He has not left. You are not invisible.
            What you are feeling is not the verdict on your life.
          </p>
        </section>

        <section className="mb-10">
          <h2>If you are safe right now and want to keep reading</h2>
          <p>
            We have a page on{" "}
            <Link href="/help/hopelessness" className="text-gold">
              despair and hopelessness
            </Link>{" "}
            that takes more time. There is also our page on{" "}
            <Link href="/come-to-christ" className="text-gold">
              coming to Christ
            </Link>{" "}
            — but please, only after you have called someone, told someone, or are safe.
          </p>
        </section>

        <aside className="card mt-12">
          <p className="card__eyebrow">After the immediate moment</p>
          <p className="m-0 text-muted">
            When you are safe and rested, please consider talking to a doctor or
            counselor. Severe despair is often a medical issue as well as a spiritual
            one. There is no shame in real help.
          </p>
        </aside>
      </div>
    </section>
  );
}
