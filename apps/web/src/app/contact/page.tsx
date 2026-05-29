import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Hope of Glory Ministry. Talk to a real person about a question, a correction, support, or media.",
};

export default function ContactPage() {
  return (
    <section className="section">
      <div className="container-prose">
        <header className="mb-10">
          <p className="eyebrow">Contact</p>
          <h1>Talk to us.</h1>
          <p className="text-muted max-w-readable" style={{ fontSize: "var(--fs-body-lg)" }}>
            Most of what we offer is online and self-serve. But if you'd like to talk to a real
            person, leave a note here and we'll read it.
          </p>
          <aside
            className="mt-6 p-4 rounded border max-w-readable"
            style={{ borderColor: "var(--blood-crimson)", background: "rgba(138, 28, 28, 0.08)" }}
          >
            <p className="m-0 text-warm text-sm">
              <strong>In crisis?</strong> Don't wait for us. Call{" "}
              <strong className="text-gold">911</strong> for immediate danger or{" "}
              <strong className="text-gold">988</strong> for the U.S. Suicide & Crisis Lifeline.
            </p>
          </aside>
        </header>

        <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card">
            <p className="card__eyebrow">Email</p>
            <p className="m-0 text-warm">
              <a href="mailto:hello@hopeofglory.ministry" className="text-gold">
                hello@hopeofglory.ministry
              </a>
            </p>
          </div>
          <div className="card">
            <p className="card__eyebrow">Hope Line</p>
            <p className="m-0 text-warm">(202) 555-0100</p>
            <p className="m-0 text-muted text-xs mt-1">
              Phone ministry setup number. For immediate danger use 911 or 988.
            </p>
          </div>
          <div className="card">
            <p className="card__eyebrow">Location</p>
            <p className="m-0 text-warm">Washington, D.C.</p>
          </div>
        </div>

        <ContactForm />

        <p className="text-muted text-xs mt-8 max-w-readable">
          What you send us is private to the ministry. See our{" "}
          <Link href="/privacy" className="text-gold">privacy policy</Link>.
        </p>
      </div>
    </section>
  );
}
