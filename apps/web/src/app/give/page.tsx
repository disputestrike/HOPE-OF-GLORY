import type { Metadata } from "next";
import Link from "next/link";
import { PayPalDonateButton } from "@/components/PayPalDonateButton";
import { features } from "@hog/shared";

export const metadata: Metadata = {
  title: "Support the mission",
  description:
    "Support Hope of Glory Ministry. Gifts fund sermon production, server costs, ministry expansion, and translation. We never pressure, never guilt, never promise blessing for gifts.",
};

export default function GivePage() {
  const flags = features();

  return (
    <section className="section">
      <div className="container-prose">
        <header className="mb-10">
          <p className="eyebrow">Support the mission</p>
          <h1>Filling the earth — together.</h1>
          <p className="text-muted max-w-readable" style={{ fontSize: "var(--fs-body-lg)" }}>
            Hope of Glory is paid for by gifts from people who believe the gospel is worth getting
            out. If the Lord moves you to give, you can support us through the link below.
          </p>
          <p className="text-muted max-w-readable">
            You will never be pressured. Most of what we make is free, and it will stay that way.
          </p>
        </header>

        <section className="mb-10">
          <blockquote className="scripture-display border-none m-0 p-0">
            Let each man give according as he has determined in his heart; not grudgingly, or
            under compulsion; for God loves a cheerful giver.
          </blockquote>
          <p className="scripture-ref">2 Corinthians 9:7 · WEB</p>
        </section>

        <section className="card mb-10">
          <p className="card__eyebrow">What your gift funds</p>
          <ul className="m-0 text-muted">
            <li>Daily sermon production and free distribution</li>
            <li>The Ask Hope Q&amp;A chat (server time + model use)</li>
            <li>The Hope Line phone number and crisis-ready operations</li>
            <li>Translation of teaching into other languages</li>
            <li>Free apologetics content for seekers</li>
          </ul>
        </section>

        <section className="card mb-10" style={{ borderColor: "var(--border)" }}>
          <p className="card__eyebrow">Our donation ethics</p>
          <ul className="m-0 text-warm text-sm">
            <li>We will never use guilt to ask for money.</li>
            <li>We will never frame giving as a transaction with God.</li>
            <li>We will never promise blessing or healing in exchange for a gift.</li>
            <li>We will never solicit during a prayer or crisis interaction.</li>
            <li>We will publish how we use what we receive.</li>
            <li>You can ask for a refund within 30 days, no questions asked.</li>
          </ul>
        </section>

        {flags.donations ? (
          <div className="card text-center">
            <p className="card__eyebrow">Give via PayPal</p>
            <p className="m-0 mb-6 text-muted">Donor funds stay on our site — no redirect.</p>
            <PayPalDonateButton />
          </div>
        ) : (
          <div className="card text-center">
            <p className="card__eyebrow">Coming soon</p>
            <p className="m-0 text-muted">
              We are completing our nonprofit incorporation and IRS Form 1023 filing before
              activating donations. We'd rather earn your trust first.
            </p>
          </div>
        )}

        <p className="text-muted text-xs mt-8 max-w-readable">
          Hope of Glory Ministry is in the process of obtaining 501(c)(3) status. Until then,
          gifts are not yet tax-deductible. We will issue receipts retroactively when 501(c)(3)
          status is granted. See our <Link href="/privacy">privacy policy</Link>.
        </p>
      </div>
    </section>
  );
}
