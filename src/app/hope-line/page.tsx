import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { features } from "@hog/shared";

export const metadata: Metadata = {
  title: "The Hope Line",
  description:
    "The Hope Line is a phone number where a hurting heart can hear Scripture, prayer, and a way toward real human help. Not an emergency service — if you are in danger, call 988 or 911.",
};

export default function HopeLinePage() {
  const flags = features();
  const number = process.env.NEXT_PUBLIC_HOPE_LINE_NUMBER?.trim();
  const live = flags.hopeLine && Boolean(number);

  return (
    <section className="section">
      <div className="container-prose">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "The Hope Line", href: "/hope-line" },
          ]}
        />

        <header className="mb-10">
          <p className="eyebrow">The Hope Line</p>
          <h1>When you can't type, you can call.</h1>
          <p
            className="text-muted max-w-readable"
            style={{ fontSize: "var(--fs-body-lg)" }}
          >
            Some moments are too heavy for a screen. The Hope Line is a phone
            number where a hurting heart can hear Scripture, be prayed with,
            and be pointed gently toward real, human, local help.
          </p>
        </header>

        {live ? (
          <section className="card mb-10 text-center">
            <p className="card__eyebrow">Call the Hope Line</p>
            <p
              className="m-0 mb-2"
              style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h2)" }}
            >
              <a href={`tel:${(number ?? "").replace(/[^+\d]/g, "")}`} className="text-gold">
                {number}
              </a>
            </p>
            <p className="m-0 text-muted text-sm">
              Free to call. You may stay anonymous.
            </p>
          </section>
        ) : (
          <section className="card mb-10">
            <p className="card__eyebrow">Getting the line ready</p>
            <p className="m-0 mb-3 text-warm">
              We are completing the crisis-ready operations behind the Hope
              Line before we publish its number — we would rather open it right
              than open it early. When it is live, the number will appear on
              this page.
            </p>
            <p className="m-0 text-muted text-sm">
              In the meantime, the fastest help is always a call or text to{" "}
              <strong>988</strong>, the Suicide &amp; Crisis Lifeline.
            </p>
          </section>
        )}

        <section
          className="card mb-10"
          style={{
            borderColor: "var(--blood-crimson)",
            background: "rgba(138, 28, 28, 0.06)",
          }}
        >
          <p className="card__eyebrow" style={{ color: "var(--blood-crimson)" }}>
            This is not an emergency service
          </p>
          <p className="m-0 text-warm">
            If you or someone else is in immediate danger, call or text{" "}
            <strong>988</strong> (Suicide &amp; Crisis Lifeline) or call{" "}
            <strong>911</strong> right now. The Hope Line offers spiritual care
            and a path to help; it is not a substitute for emergency services.
            Read our{" "}
            <Link href="/crisis-disclaimer" className="text-gold">
              crisis disclaimer
            </Link>
            .
          </p>
        </section>

        <article className="prose-ministry mb-12">
          <h2>What to expect.</h2>
          <p>
            You will be met with patience, not a sales pitch. You can share as
            much or as little as you want. You will hear Scripture that speaks
            to where you are, you can be prayed with, and — if it would help —
            you will be pointed toward a local church or qualified human care.
          </p>

          <h2>Honesty about how it works.</h2>
          <p>
            The Hope Line uses AI to help carry the conversation, with safety
            checks built in. If anything you say signals that you are in
            danger, the line will stop and move you toward immediate human
            help. Your phone number is never stored in the clear — only as a
            one-way hash. See our{" "}
            <Link href="/privacy" className="text-gold">
              privacy policy
            </Link>{" "}
            and{" "}
            <Link href="/ai-disclosure" className="text-gold">
              AI disclosure
            </Link>
            .
          </p>
        </article>

        <div className="gold-divider" />

        <section>
          <p className="eyebrow">Other ways to find help</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/help-now" className="btn btn--primary">
              Need help today?
            </Link>
            <Link href="/prayer" className="btn btn--secondary">
              Share a prayer request
            </Link>
            <Link href="/help/crisis-resources" className="btn btn--ghost">
              Crisis resources
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}
