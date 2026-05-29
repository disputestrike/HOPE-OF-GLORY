import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  DonationEthicsCard,
  DonorBillOfRightsCard,
} from "@/components/DonorBillOfRights";

export const metadata: Metadata = {
  title: "Donation Ethics",
  description:
    "How Hope of Glory Ministry asks for, handles, and accounts for donations. Includes the AFP Donor Bill of Rights, our donation ethics statement, and our 30-day refund policy.",
};

export default function DonationEthicsPage() {
  return (
    <section className="section">
      <div className="container-prose">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Donation Ethics", href: "/donation-ethics" },
          ]}
        />

        <header className="mb-10">
          <p className="eyebrow">Transparency</p>
          <h1>Donation ethics.</h1>
          <p
            className="text-muted max-w-readable"
            style={{ fontSize: "var(--fs-body-lg)" }}
          >
            The way a ministry asks for money tells the truth about what it
            actually believes. This page sets out how Hope of Glory Ministry
            handles giving — what we will say, what we will never say, and
            what every donor is owed.
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
          <p className="card__eyebrow">Posture</p>
          <p className="m-0 mb-3 text-warm">
            Hope of Glory Ministry trusts God for its provision. We do not run
            a fundraising operation that wears spiritual language as a
            costume. We would rather grow slowly than grow by coercion.
          </p>
          <p className="m-0 text-warm">
            Giving is between the giver and God. It is never a transaction
            between the giver and this ministry, and it is never a
            transaction between the giver and God. Teaching, prayer, crisis
            direction, and spiritual care are never conditioned on a gift.
          </p>
        </section>

        <DonationEthicsCard />

        <DonorBillOfRightsCard />

        <section className="card mb-10">
          <p className="card__eyebrow">Transparency commitments</p>
          <p className="m-0 mb-3 text-warm">
            We will publish a plain-English summary of how donated funds are
            used. When asked a financial question we cannot answer in a
            sentence, we will publish the longer answer rather than keep it
            behind private email. Our governing board and its decisions are
            disclosed on the ministry pages and updated as the organization
            grows.
          </p>
          <p className="m-0 mb-3 text-warm">
            Donor information is never sold, never rented, and never shared
            outside what is strictly required to process the gift and issue a
            receipt. See our{" "}
            <Link href="/privacy" className="text-gold">
              privacy policy
            </Link>{" "}
            for the full detail.
          </p>
          <p className="m-0 text-warm">
            Hope of Glory Ministry is currently completing its 501(c)(3) tax-
            exempt status. Until the IRS determination letter is granted,
            gifts are <strong>not yet tax-deductible</strong>. We will issue
            receipts retroactively for gifts given during the application
            period once status is granted.
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

        <section className="card mb-10">
          <p className="card__eyebrow">Donor questions</p>
          <p className="m-0 mb-3 text-warm">
            You are welcome to ask any question about how a gift will be
            used, who is on the board, where the money goes, or how we make
            decisions. We will give a prompt, truthful, and forthright
            answer.
          </p>
          <p className="m-0 text-warm">
            <Link href="/contact" className="text-gold">
              Contact us with a donor question →
            </Link>
          </p>
        </section>

        <nav
          aria-label="Related"
          className="mt-12 flex flex-wrap gap-4 text-sm"
        >
          <Link href="/give" className="text-gold">
            ← Back to Support the Mission
          </Link>
          <Link href="/privacy" className="text-gold">
            Privacy policy →
          </Link>
        </nav>
      </div>
    </section>
  );
}
