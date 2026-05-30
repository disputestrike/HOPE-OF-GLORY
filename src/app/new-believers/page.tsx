import type { Metadata } from "next";
import Link from "next/link";
import { NewBelieverSignup } from "@/components/NewBelieverSignup";

export const metadata: Metadata = {
  title: "New to Christ?",
  description:
    "If you have just begun to follow Jesus — or you are still wondering who He is — start here. A 30-day walk through the gospel of John, basic prayer, who Christ is, and finding a local church.",
};

export default function NewBelieversPage() {
  return (
    <section className="section">
      <div className="container-prose">
        <header className="mb-10">
          <p className="eyebrow">Start here</p>
          <h1>Welcome to the family.</h1>
          <p className="text-muted max-w-readable" style={{ fontSize: "var(--fs-body-lg)" }}>
            If you have just begun to follow Jesus — or you are still wondering who He is — start here.
            We will walk with you for 30 days through the gospel of John, basic prayer, the person of
            Christ, and how to find a faithful local church.
          </p>
        </header>

        <section className="card mb-10">
          <p className="card__eyebrow">What you'll get</p>
          <ul className="m-0 text-muted">
            <li><strong className="text-warm">Days 1-7:</strong> The gospel of John, one chapter at a time</li>
            <li><strong className="text-warm">Days 8-14:</strong> Prayer, faith, forgiveness, Scripture, the Spirit</li>
            <li><strong className="text-warm">Days 15-21:</strong> Who Jesus is</li>
            <li><strong className="text-warm">Days 22-30:</strong> Belonging to the church — baptism, communion, finding a local body</li>
          </ul>
          <p className="m-0 mt-6 text-muted text-sm">
            One short email per day. No marketing tricks. One-click unsubscribe in every message.
          </p>
        </section>

        <NewBelieverSignup />

        <p className="text-muted text-xs mt-10 max-w-readable">
          We will never sell your email. We will never push donations to new believers.
          You belong to the family because of Christ, not because of what you give.
          See our <Link href="/privacy" className="text-gold">privacy policy</Link>.
        </p>
      </div>
    </section>
  );
}
