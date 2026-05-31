import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Crisis disclaimer",
  description:
    "Hope of Glory Ministry is not an emergency service. If you are in danger, call 988 or 911 now. Here is what our help can and cannot do, and where to find immediate human help.",
};

export default function CrisisDisclaimerPage() {
  return (
    <section className="section">
      <div className="container-prose">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Crisis Disclaimer", href: "/crisis-disclaimer" },
          ]}
        />

        <header className="mb-8">
          <p className="eyebrow">Crisis disclaimer</p>
          <h1>We are not an emergency service.</h1>
          <p
            className="text-muted max-w-readable"
            style={{ fontSize: "var(--fs-body-lg)" }}
          >
            We are glad you are here, and we want to be honest with you about
            what this ministry can and cannot do when life is on the line.
          </p>
        </header>

        <section
          className="card mb-10"
          style={{
            borderColor: "var(--blood-crimson)",
            background: "rgba(138, 28, 28, 0.06)",
          }}
        >
          <p className="card__eyebrow" style={{ color: "var(--blood-crimson)" }}>
            If you are in immediate danger
          </p>
          <ul className="m-0 text-warm">
            <li className="mb-2">
              <strong>Call or text 988</strong> — the Suicide &amp; Crisis
              Lifeline (United States). Free, confidential, every minute of
              every day.
            </li>
            <li className="mb-2">
              <strong>Call 911</strong> — for any medical or safety emergency.
            </li>
            <li className="mb-2">
              <strong>Text HOME to 741741</strong> — the Crisis Text Line, to
              reach a trained counselor by text.
            </li>
            <li>
              <strong>Dial 211</strong> — for housing, food, and local
              community resources.
            </li>
          </ul>
          <p className="m-0 mt-4 text-muted text-sm">
            Outside the United States, please contact your local emergency
            number and nearest crisis line.
          </p>
        </section>

        <article className="prose-ministry mb-12">
          <h2>What this ministry is.</h2>
          <p>
            Hope of Glory offers Scripture, prayer, and biblical
            encouragement. Our Ask Hope chat and our Hope Line are designed to
            point you to the hope of Jesus Christ and to walk with you toward
            real, human, local help. That is a genuine good — but it is not the
            same as emergency care.
          </p>

          <h2>What this ministry is not.</h2>
          <p>
            We are not a 24/7 emergency response service, a suicide hotline, a
            medical provider, a licensed counseling practice, or a substitute
            for the people physically near you who can act. Our AI tools, in
            particular, are software — they can be useful and they can be
            wrong, and they cannot send help to your door.
          </p>

          <h2>What we do when someone is in crisis.</h2>
          <p>
            When you tell us you are thinking of ending your life, or that
            someone is in immediate danger, our system does not try to handle
            it alone. It stops, names the emergency, and points you to 988 and
            911 right away. On the Hope Line, a call that signals immediate
            danger is moved toward human help rather than kept in an automated
            conversation. We would always rather over-escalate than risk a
            life.
          </p>

          <h2>Please don't carry it alone.</h2>
          <p>
            If you are reading this in a dark hour: you matter, your life
            matters, and there are people ready to help you right now. Make the
            call. Then, when you are safe, we would be honored to pray with you
            and point you to the One who is near to the brokenhearted.
          </p>
        </article>

        <div className="gold-divider" />

        <section>
          <p className="eyebrow">More help</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/help/crisis-resources" className="btn btn--primary">
              Crisis resources
            </Link>
            <Link href="/help/suicide" className="btn btn--secondary">
              If you feel like ending your life
            </Link>
            <Link href="/prayer" className="btn btn--ghost">
              Ask for prayer
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}
