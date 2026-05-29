import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PayPalDonateButton } from "@/components/PayPalDonateButton";
import {
  DonationEthicsCard,
  DonorBillOfRightsCard,
} from "@/components/DonorBillOfRights";
import { GIFT_FUNDING_ITEMS, MISSION_STATEMENT } from "@/lib/donor-content";
import { features } from "@hog/shared";

export const metadata: Metadata = {
  title: "Support the mission",
  description:
    "Support Hope of Glory Ministry with a one-time or monthly gift. We never pressure, never guilt, never promise blessing for gifts. 30-day no-questions refund.",
};

export default function GivePage() {
  const flags = features();

  return (
    <section className="section">
      <div className="container-prose">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Support the Mission", href: "/give" },
          ]}
        />

        <header className="mb-10">
          <p className="eyebrow">Support the mission</p>
          <h1>Filling the earth — together.</h1>
          <p
            className="text-muted max-w-readable"
            style={{ fontSize: "var(--fs-body-lg)" }}
          >
            {MISSION_STATEMENT}
          </p>
          <p className="text-muted max-w-readable">
            Giving is optional. The gospel, prayer, and biblical help are
            freely offered, and no ministry care depends on a donation. You
            will never be pressured here.
          </p>
        </header>

        <section className="mb-10">
          <blockquote className="scripture-display border-none m-0 p-0">
            Let each man give according as he has determined in his heart; not
            grudgingly, or under compulsion; for God loves a cheerful giver.
          </blockquote>
          <p className="scripture-ref">2 Corinthians 9:7 · WEB</p>
        </section>

        <section className="card mb-10">
          <p className="card__eyebrow">What your gift funds</p>
          <ul className="m-0 text-muted">
            {GIFT_FUNDING_ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Give Once / Give Monthly — two cards side-by-side */}
        <section
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
          aria-label="Ways to give"
        >
          <div className="card text-center">
            <p className="card__eyebrow">Give Once</p>
            <h2 className="m-0 mb-2" style={{ fontSize: "var(--fs-h3)" }}>
              A single gift.
            </h2>
            <p className="m-0 mb-6 text-muted">
              A one-time contribution in any amount, processed securely
              through PayPal. No amount is suggested because the choice is
              yours.
            </p>
            {flags.donations ? (
              <PayPalDonateButton mode="once" />
            ) : (
              <DonationSetupNotice />
            )}
          </div>

          <div className="card text-center">
            <p className="card__eyebrow">Give Monthly</p>
            <h2 className="m-0 mb-2" style={{ fontSize: "var(--fs-h3)" }}>
              Walk with us each month.
            </h2>
            <p className="m-0 mb-6 text-muted">
              Optional recurring support helps with predictable server,
              production, and translation costs. Cancel any time.
            </p>
            {flags.donations ? (
              <PayPalDonateButton mode="monthly" />
            ) : (
              <DonationSetupNotice />
            )}
          </div>
        </section>

        <DonationEthicsCard />

        <DonorBillOfRightsCard />

        <section className="card mb-10">
          <p className="card__eyebrow">Transparency commitments</p>
          <p className="m-0 mb-3 text-warm">
            We will publish a plain-English summary of how donated funds are
            used. When we are asked a financial question we cannot answer in a
            sentence, we will publish the longer answer rather than keep it
            behind email.
          </p>
          <p className="m-0 text-warm">
            Donor information is never sold, never rented, and never shared
            outside what is strictly required to process the gift and issue a
            receipt. See our{" "}
            <Link href="/privacy" className="text-gold">
              privacy policy
            </Link>{" "}
            for the full detail.
          </p>
        </section>

        <section className="card mb-10">
          <p className="card__eyebrow">30-day refund policy</p>
          <p className="m-0 text-warm">
            If you gave and later changed your mind — for any reason, or for
            no reason — email{" "}
            <a href="mailto:hello@hopeofglory.ministry" className="text-gold">
              hello@hopeofglory.ministry
            </a>{" "}
            within 30 days of the gift and we will refund it in full. No
            questions, no explanations required.
          </p>
        </section>

        <aside
          className="mt-2 p-4 rounded border max-w-readable"
          style={{ borderColor: "var(--border)" }}
        >
          <p className="text-muted text-sm m-0">
            Hope of Glory Ministry is currently completing its 501(c)(3) tax-
            exempt status with the IRS. Until that status is granted, gifts
            are <strong>not yet tax-deductible</strong>. When the
            determination letter is issued, we will issue receipts
            retroactively for gifts given during the application period.
          </p>
        </aside>

        <p className="text-muted text-sm mt-10">
          <Link href="/donation-ethics" className="text-gold">
            Read our donation ethics in full →
          </Link>
        </p>
      </div>
    </section>
  );
}

function DonationSetupNotice() {
  return (
    <div>
      <p className="card__eyebrow" style={{ marginBottom: "0.5rem" }}>
        Donation setup status
      </p>
      <p className="m-0 text-muted text-sm">
        We are completing our nonprofit incorporation and IRS Form 1023 filing
        before activating donations. We&apos;d rather earn your trust first.
      </p>
    </div>
  );
}
