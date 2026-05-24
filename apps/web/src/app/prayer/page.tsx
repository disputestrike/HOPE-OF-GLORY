import type { Metadata } from "next";
import Link from "next/link";
import { PrayerForm } from "@/components/PrayerForm";

export const metadata: Metadata = {
  title: "Prayer",
  description:
    "You are not alone. Share a prayer request with Hope of Glory Ministry. Requests can be anonymous. We never sell, share, or publish what you send us.",
};

export default function PrayerPage() {
  return (
    <section className="section">
      <div className="container-prose">
        <header className="mb-10">
          <p className="eyebrow">Prayer</p>
          <h1>You are not alone.</h1>
          <p className="text-muted max-w-readable" style={{ fontSize: "var(--fs-body-lg)" }}>
            If you would like prayer, share what is on your heart below. Requests can be anonymous.
            We never sell, share, or publish what you send us.
          </p>
          <aside
            className="mt-6 p-4 rounded border max-w-readable"
            style={{ borderColor: "var(--blood-crimson)", background: "rgba(138, 28, 28, 0.08)" }}
          >
            <p className="m-0 text-warm text-sm">
              <strong>If you are in crisis</strong>, please don't wait on us. Call{" "}
              <strong className="text-gold">911</strong> for immediate danger or{" "}
              <strong className="text-gold">988</strong> for the U.S. Suicide & Crisis Lifeline.
              We will still pray for you — but please reach those resources first.
            </p>
          </aside>
        </header>

        <div className="mb-10">
          <blockquote className="scripture-display border-none m-0 p-0">
            The Lord is near to the brokenhearted, and saves those who have a crushed spirit.
          </blockquote>
          <p className="scripture-ref">Psalm 34 : 18 · WEB</p>
        </div>

        <PrayerForm />

        <p className="text-muted text-xs mt-8 max-w-readable">
          Submissions are stored privately so the ministry can read and pray.
          See our <Link href="/privacy">privacy policy</Link>.
        </p>
      </div>
    </section>
  );
}
