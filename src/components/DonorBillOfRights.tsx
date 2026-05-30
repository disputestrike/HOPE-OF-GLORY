import {
  DONATION_ETHICS_POINTS,
  DONOR_BILL_OF_RIGHTS,
} from "@/lib/donor-content";

/**
 * The AFP Donor Bill of Rights, rendered as a `card` for use on /give and
 * /donation-ethics. The list is numbered to preserve the canonical ordering
 * of the 10 points.
 */
export function DonorBillOfRightsCard() {
  return (
    <section className="card mb-10" aria-labelledby="donor-bill-of-rights">
      <p className="card__eyebrow">Donor Bill of Rights</p>
      <h2
        id="donor-bill-of-rights"
        className="m-0 mb-4"
        style={{ fontSize: "var(--fs-h3)" }}
      >
        Ten things every donor is owed.
      </h2>
      <p className="text-muted m-0 mb-4 max-w-readable">
        These rights apply before, during, and after a gift. You are free to
        ask questions, decline, pause, request privacy, or ask for a refund
        without being shamed or spiritually pressured.
      </p>
      <p className="text-muted m-0 mb-6 max-w-readable text-sm">
        Adopted from the standard published by the Association of Fundraising
        Professionals. Hope of Glory Ministry holds itself to every point
        whether or not a gift is involved.
      </p>
      <ol className="m-0 text-warm" style={{ paddingLeft: "1.25rem" }}>
        {DONOR_BILL_OF_RIGHTS.map((right, i) => (
          <li key={i} className="mb-2">
            {right}
          </li>
        ))}
      </ol>
    </section>
  );
}

/**
 * The Hope of Glory donation ethics statement, rendered as a `card`.
 */
export function DonationEthicsCard() {
  return (
    <section
      className="card mb-10"
      style={{ borderColor: "var(--border)" }}
      aria-labelledby="donation-ethics"
    >
      <p className="card__eyebrow">Our donation ethics</p>
      <h2
        id="donation-ethics"
        className="m-0 mb-4"
        style={{ fontSize: "var(--fs-h3)" }}
      >
        Commitments we will not bend.
      </h2>
      <ul className="m-0 text-warm">
        {DONATION_ETHICS_POINTS.map((point, i) => (
          <li key={i} className="mb-1">
            {point}
          </li>
        ))}
      </ul>
    </section>
  );
}
