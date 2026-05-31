import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of use",
  description:
    "The terms for using Hope of Glory Ministry. The gospel, prayer, and biblical help are freely offered. This site is not a substitute for pastoral, medical, legal, or emergency care.",
};

export default function TermsPage() {
  return (
    <section className="section">
      <div className="container-prose">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Terms of Use", href: "/terms" },
          ]}
        />

        <header className="mb-10">
          <p className="eyebrow">Terms of use</p>
          <h1>Plain terms.</h1>
          <p
            className="text-muted max-w-readable"
            style={{ fontSize: "var(--fs-body-lg)" }}
          >
            By using Hope of Glory Ministry, you agree to these terms. We have
            tried to write them the way we try to write everything here —
            honestly and without tricks.
          </p>
        </header>

        <article className="prose-ministry mb-12">
          <h2>The ministry we offer.</h2>
          <p>
            This site offers Christian teaching, Scripture, prayer,
            apologetics, and related content. The gospel, prayer, and biblical
            help are freely offered. Giving is optional and never required to
            access anything here.
          </p>

          <h2>This is not professional advice.</h2>
          <p>
            Content on this site is for spiritual encouragement and education.
            It is not, and is not a substitute for, professional medical,
            mental-health, legal, or financial advice, nor for the pastoral
            care of a local church. Always seek a qualified professional for
            your specific situation.
          </p>

          <h2>This is not an emergency service.</h2>
          <p>
            We cannot respond to emergencies. If you or someone else is in
            danger, call 988 or 911 immediately. Please read our{" "}
            <Link href="/crisis-disclaimer" className="text-gold">
              crisis disclaimer
            </Link>
            .
          </p>

          <h2>About the AI.</h2>
          <p>
            Parts of this ministry are produced or assisted by artificial
            intelligence, with human review before publication. The AI is a
            tool; it can be mistaken. Test what you read against Scripture and
            your local church. The AI may never claim fresh revelation, promise
            outcomes, or speak in the place of God or His church. See our{" "}
            <Link href="/ai-disclosure" className="text-gold">
              AI disclosure
            </Link>
            .
          </p>

          <h2>Acceptable use.</h2>
          <p>When using this site, you agree not to:</p>
          <ul>
            <li>Harass, threaten, or abuse any person or group.</li>
            <li>Submit unlawful, hateful, sexual, or harmful content.</li>
            <li>Attempt to disrupt, attack, or gain unauthorized access to the service.</li>
            <li>Scrape, resell, or misrepresent the ministry's content or identity.</li>
            <li>Use the site to spam, solicit, or defraud others.</li>
          </ul>
          <p>
            Participation in interactive features is also governed by our{" "}
            <Link href="/community-guidelines" className="text-gold">
              community guidelines
            </Link>
            .
          </p>

          <h2>Content and Scripture.</h2>
          <p>
            Scripture quotations are from the World English Bible (WEB), which
            is in the public domain. Our original teaching, design, and brand
            (including the name &ldquo;Hope of Glory Ministry&rdquo;) belong to
            the ministry. You are warmly welcome to share and quote our content
            for non-commercial, God-glorifying purposes with attribution;
            please do not republish it as your own or for resale.
          </p>

          <h2>Donations.</h2>
          <p>
            Gifts are processed by PayPal and are voluntary. Our refund and
            ethics commitments — including a 30-day, no-questions refund — are
            described on the{" "}
            <Link href="/give" className="text-gold">
              giving
            </Link>{" "}
            and{" "}
            <Link href="/donation-ethics" className="text-gold">
              donation ethics
            </Link>{" "}
            pages.
          </p>

          <h2>Disclaimers and liability.</h2>
          <p>
            The site is provided &ldquo;as is&rdquo; without warranties of any
            kind. To the fullest extent permitted by law, Hope of Glory
            Ministry is not liable for any indirect or consequential damages
            arising from your use of the site. Nothing in these terms limits
            liability that cannot be limited by law.
          </p>

          <h2>Changes and contact.</h2>
          <p>
            We may update these terms as the ministry grows; material changes
            will be noted here. Questions? Write{" "}
            <a href="mailto:hello@hopeofglory.ministry" className="text-gold">
              hello@hopeofglory.ministry
            </a>{" "}
            or use our{" "}
            <Link href="/contact" className="text-gold">
              contact page
            </Link>
            .
          </p>
        </article>

        <div className="gold-divider" />

        <section>
          <p className="eyebrow">Related</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/privacy" className="btn btn--secondary">
              Privacy policy
            </Link>
            <Link href="/community-guidelines" className="btn btn--secondary">
              Community guidelines
            </Link>
            <Link href="/crisis-disclaimer" className="btn btn--ghost">
              Crisis disclaimer
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}
