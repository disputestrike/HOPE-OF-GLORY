import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "What Hope of Glory Ministry collects, why, and how we protect it. We never sell your data. Prayer requests are handled with care, and phone numbers are never stored in the clear.",
};

export default function PrivacyPage() {
  return (
    <section className="section">
      <div className="container-prose">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Privacy Policy", href: "/privacy" },
          ]}
        />

        <header className="mb-10">
          <p className="eyebrow">Privacy policy</p>
          <h1>Your trust, kept.</h1>
          <p
            className="text-muted max-w-readable"
            style={{ fontSize: "var(--fs-body-lg)" }}
          >
            People bring tender things to a ministry — prayers, doubts, the
            worst night of their life. We treat that with the seriousness it
            deserves. This policy explains, in plain language, what we collect,
            why, and how we guard it.
          </p>
        </header>

        <article className="prose-ministry mb-12">
          <h2>The short version.</h2>
          <ul>
            <li>We collect as little as possible to run the ministry.</li>
            <li>We never sell, rent, or trade your personal information.</li>
            <li>Prayer requests can be submitted anonymously.</li>
            <li>Phone numbers are never stored in the clear — only as a one-way hash.</li>
            <li>You can ask us to show you, or delete, the data we hold about you.</li>
          </ul>

          <h2>What we collect.</h2>
          <p>
            <strong>Email subscriptions.</strong> If you sign up for the
            40-Day Journey, Daily Faith, or another list, we store your email
            address, the date and page you subscribed from, and your consent.
            You can unsubscribe from any email.
          </p>
          <p>
            <strong>Prayer requests and questions.</strong> If you submit a
            prayer request or ask a question, we store what you write so we can
            respond and, where appropriate, follow up. You may submit
            anonymously. Please do not include other people's private details.
          </p>
          <p>
            <strong>The Hope Line and calls.</strong> If you call the Hope
            Line, we may keep a record of the conversation to provide care and
            improve safety. Your phone number is stored only as a one-way
            cryptographic hash — we cannot read the original number back. Raw
            phone numbers are never persisted.
          </p>
          <p>
            <strong>Donations.</strong> Gifts are processed by PayPal. We
            receive only what is necessary to acknowledge the gift and issue a
            receipt. We do not see or store your full card number.
          </p>
          <p>
            <strong>Basic technical data.</strong> Like most websites, our
            servers process standard request data (such as IP address and
            browser type) to deliver pages and protect against abuse. Where we
            log such data, identifying values like IP addresses are hashed.
          </p>
          <p>
            <strong>Analytics.</strong> When analytics are enabled, we use a
            privacy-friendly, cookieless analytics tool that measures aggregate
            traffic. We do not build advertising profiles and do not use
            third-party advertising trackers.
          </p>

          <h2>How we use it.</h2>
          <ul>
            <li>To answer your questions and prayer requests.</li>
            <li>To send the emails you asked for, and to let you stop them.</li>
            <li>To provide care safely, including escalating genuine crises to human help.</li>
            <li>To acknowledge donations and meet our record-keeping obligations.</li>
            <li>To keep the service secure and working.</li>
          </ul>

          <h2>What we never do.</h2>
          <p>
            We never sell, rent, or trade your personal information. We never
            share prayer requests beyond what is needed to pray for you and
            follow up. We never use your tender disclosures to market to you or
            pressure you to give.
          </p>

          <h2>Who processes data for us.</h2>
          <p>
            We use trusted service providers to operate — for example, a
            hosting provider, an email-delivery provider, a payment processor
            (PayPal), and AI providers that help generate and review content.
            These providers act on our instructions and only receive what is
            necessary for their function. For sensitive pastoral content we
            prefer providers offering strong data-handling terms.
          </p>

          <h2>Your choices and rights.</h2>
          <p>
            You can unsubscribe from any email at any time. You can ask us what
            personal data we hold about you, ask us to correct it, or ask us to
            delete it, by writing to{" "}
            <a href="mailto:privacy@hopeofglory.ministry" className="text-gold">
              privacy@hopeofglory.ministry
            </a>
            . We will respond within a reasonable time.
          </p>

          <h2>Children.</h2>
          <p>
            This site is intended for a general audience and is not directed to
            children under 13. We do not knowingly collect personal information
            from children under 13. If you believe a child has provided us
            information, contact us and we will delete it.
          </p>

          <h2>Changes.</h2>
          <p>
            We may update this policy as the ministry grows. When we make a
            material change, we will note it here. Continued use of the site
            after a change means you accept the updated policy.
          </p>

          <h2>Contact.</h2>
          <p>
            Questions about privacy? Write{" "}
            <a href="mailto:privacy@hopeofglory.ministry" className="text-gold">
              privacy@hopeofglory.ministry
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
            <Link href="/terms" className="btn btn--secondary">
              Terms of use
            </Link>
            <Link href="/donation-ethics" className="btn btn--secondary">
              Donation ethics
            </Link>
            <Link href="/contact" className="btn btn--ghost">
              Contact us
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}
