import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Crisis resources — Hope of Glory Ministry",
  description:
    "Immediate help: 988 Suicide & Crisis Lifeline, 911 Emergency, 211 Community Resources, Crisis Text Line, domestic violence, shelter, SAMHSA, and international resources.",
};

export default function CrisisResourcesPage() {
  return (
    <section className="section">
      <div className="container-prose">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Help", href: "/help" },
            { name: "Crisis resources", href: "/help/crisis-resources" },
          ]}
        />

        <header className="mb-10">
          <p className="eyebrow">Crisis resources</p>
          <h1>Immediate help.</h1>
          <p className="text-muted max-w-readable" style={{ fontSize: "var(--fs-body-lg)" }}>
            If you are in immediate danger, call <a href="tel:911" className="text-gold"><strong>911</strong></a>{" "}
            — or your country's emergency number — right now. The resources below are for the
            United States unless noted. International resources are at the bottom.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <a
            href="tel:911"
            className="card block hover:no-underline"
            style={{ borderColor: "var(--blood-crimson)" }}
          >
            <p className="card__eyebrow" style={{ color: "var(--blood-crimson)" }}>Emergency</p>
            <h3 className="m-0 mb-2 text-warm">911</h3>
            <p className="m-0 text-muted text-sm">Immediate danger, medical emergency, active violence.</p>
          </a>
          <a href="tel:988" className="card block hover:no-underline">
            <p className="card__eyebrow">Suicide & Crisis Lifeline</p>
            <h3 className="m-0 mb-2 text-warm">Call or text 988</h3>
            <p className="m-0 text-muted text-sm">
              Free, confidential, 24/7. U.S. and Canada. Or chat at{" "}
              <span className="text-gold">988lifeline.org/chat</span>.
            </p>
          </a>
          <a href="tel:211" className="card block hover:no-underline">
            <p className="card__eyebrow">Community resources</p>
            <h3 className="m-0 mb-2 text-warm">Dial 211</h3>
            <p className="m-0 text-muted text-sm">Food, shelter, utilities, emergency assistance by ZIP code.</p>
          </a>
          <a href="sms:741741?body=HOME" className="card block hover:no-underline">
            <p className="card__eyebrow">Crisis Text Line</p>
            <h3 className="m-0 mb-2 text-warm">Text HOME to 741741</h3>
            <p className="m-0 text-muted text-sm">Free, confidential crisis support by text. 24/7. U.S., Canada, UK, Ireland.</p>
          </a>
        </section>

        <section className="mb-10">
          <h2>Specialized crisis lines</h2>
          <ul>
            <li>
              <strong className="text-warm">National Domestic Violence Hotline:</strong>{" "}
              <a href="tel:1-800-799-7233" className="text-gold">1-800-799-7233</a>{" "}
              (or text START to 88788). 24/7, confidential.
            </li>
            <li>
              <strong className="text-warm">SAMHSA's National Helpline:</strong>{" "}
              <a href="tel:1-800-662-4357" className="text-gold">1-800-662-HELP (4357)</a>.
              24/7. Mental health and substance-use treatment referral.
            </li>
            <li>
              <strong className="text-warm">RAINN (sexual assault):</strong>{" "}
              <a href="tel:1-800-656-4673" className="text-gold">1-800-656-HOPE (4673)</a>. 24/7.
            </li>
            <li>
              <strong className="text-warm">Veterans Crisis Line:</strong>{" "}
              Dial 988 then press 1. Or text 838255.
            </li>
            <li>
              <strong className="text-warm">Trevor Project (LGBTQ+ youth):</strong>{" "}
              <a href="tel:1-866-488-7386" className="text-gold">1-866-488-7386</a>.
            </li>
            <li>
              <strong className="text-warm">Childhelp (child abuse):</strong>{" "}
              <a href="tel:1-800-422-4453" className="text-gold">1-800-4-A-CHILD</a>. 24/7.
            </li>
            <li>
              <strong className="text-warm">National Human Trafficking Hotline:</strong>{" "}
              <a href="tel:1-888-373-7888" className="text-gold">1-888-373-7888</a> (or text 233733).
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2>Housing, shelter, basic needs</h2>
          <ul>
            <li>
              <strong className="text-warm">HUD Find Shelter:</strong>{" "}
              <a href="https://www.hud.gov/findshelter" className="text-gold" target="_blank" rel="noreferrer">
                hud.gov/findshelter
              </a>{" "}
              — shelters, health, clothing, related resources by ZIP.
            </li>
            <li>
              <strong className="text-warm">211:</strong> Dial 211. Local food banks, shelters, utility assistance.
            </li>
            <li>
              <strong className="text-warm">SAMHSA Treatment Locator:</strong>{" "}
              <a href="https://findtreatment.gov" className="text-gold" target="_blank" rel="noreferrer">
                findtreatment.gov
              </a>{" "}
              — substance use and mental-health treatment.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2>International</h2>
          <ul>
            <li>
              <strong className="text-warm">IASP (International Association for Suicide Prevention):</strong>{" "}
              <a href="https://www.iasp.info/suicidalthoughts/" className="text-gold" target="_blank" rel="noreferrer">
                iasp.info/suicidalthoughts
              </a>{" "}
              — directory of crisis lines by country.
            </li>
            <li>
              <strong className="text-warm">Befrienders Worldwide:</strong>{" "}
              <a href="https://www.befrienders.org/" className="text-gold" target="_blank" rel="noreferrer">
                befrienders.org
              </a>{" "}
              — emotional support across 32 countries.
            </li>
            <li>
              <strong className="text-warm">United Kingdom:</strong> Samaritans —{" "}
              <a href="tel:116123" className="text-gold">116 123</a>. 24/7, free.
            </li>
            <li>
              <strong className="text-warm">Australia:</strong> Lifeline —{" "}
              <a href="tel:131114" className="text-gold">13 11 14</a>. 24/7.
            </li>
            <li>
              <strong className="text-warm">Nigeria:</strong> Mentally Aware Nigeria Initiative (MANI) —
              SMS 0908 021 7555.
            </li>
            <li>
              <strong className="text-warm">India:</strong> iCALL —{" "}
              <a href="tel:9152987821" className="text-gold">9152987821</a>{" "}
              (Mon-Sat, 8am-10pm IST).
            </li>
            <li>
              <strong className="text-warm">Other countries:</strong> Search your country name +{" "}
              "suicide prevention hotline" or use the IASP directory above.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2>What we can offer</h2>
          <p>
            Hope of Glory Ministry cannot provide emergency care, medical treatment, or
            shelter directly. We can pray with you and point you to Scripture. The
            resources above are the right next step in a crisis. Please use them first.
          </p>
          <p>
            When you are safe, we are here.{" "}
            <Link href="/ask" className="text-gold">Ask Hope</Link>,{" "}
            <Link href="/prayer" className="text-gold">share a prayer request</Link>, or{" "}
            <Link href="/contact" className="text-gold">talk to a real person</Link>.
          </p>
        </section>
      </div>
    </section>
  );
}
