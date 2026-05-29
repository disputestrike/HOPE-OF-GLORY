import Link from "next/link";
import Image from "next/image";

const logoSrc = "/brand/hope-of-glory-logo-transparent.png";

const sections = [
  {
    heading: "Begin",
    links: [
      { href: "/come-to-christ", label: "Come to Christ" },
      { href: "/sinners-prayer", label: "Sinner's Prayer" },
      { href: "/journey/40-day", label: "40-Day Journey" },
      { href: "/new-believer-next-steps", label: "Next Steps" },
    ],
  },
  {
    heading: "Engage",
    links: [
      { href: "/ask", label: "Ask Hope" },
      { href: "/read", label: "Read" },
      { href: "/daily-faith", label: "Daily Faith" },
      { href: "/scroll", label: "The Scroll" },
      { href: "/trust-the-scriptures", label: "Trust the Scriptures" },
      { href: "/messages", label: "Messages" },
      { href: "/gallery", label: "Glory Gallery" },
    ],
  },
  {
    heading: "Care",
    links: [
      { href: "/help", label: "Help" },
      { href: "/help-now", label: "Need Help Today?" },
      { href: "/help/crisis-resources", label: "Crisis Resources" },
      { href: "/help/prayer-request", label: "Prayer Request" },
      { href: "/hope-line", label: "Hope Line" },
    ],
  },
  {
    heading: "Transparency",
    links: [
      { href: "/beliefs", label: "What We Believe" },
      { href: "/doctrinal-basis", label: "Doctrinal Basis" },
      { href: "/ai-disclosure", label: "AI Disclosure" },
      { href: "/corrections", label: "Corrections" },
      { href: "/community-guidelines", label: "Community Guidelines" },
      { href: "/donation-ethics", label: "Donation Ethics" },
      { href: "/crisis-disclaimer", label: "Crisis Disclaimer" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/contact", label: "Contact" },
      { href: "/give", label: "Support the Mission" },
    ],
  },
];

export function Footer() {
  return (
    <footer
      className="footer mt-24 border-t border-[var(--border-soft)] bg-navy"
      role="contentinfo"
    >
      <div className="container-prose py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {sections.map((section) => (
            <div key={section.heading}>
              <h2
                className="text-xs font-semibold uppercase mb-4 tracking-[0.18em] text-gold m-0"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {section.heading}
              </h2>
              <ul className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-muted hover:text-gold text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="gold-divider !my-8" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-sm text-muted">
          <div className="flex flex-col gap-2 max-w-prose">
            <Image
              src={logoSrc}
              alt="Hope of Glory Ministry"
              width={1536}
              height={1024}
              className="h-auto w-64 object-contain drop-shadow-[0_0_16px_rgba(212,175,55,0.18)] md:w-80"
              sizes="(min-width: 768px) 320px, 256px"
            />
            <p className="m-0 text-muted">
              Filling the earth with the knowledge of the glory of the Lord.
            </p>
          </div>

          <div className="text-sm text-muted">
            <p className="m-0">Washington, D.C.</p>
            <p className="m-0">
              <a href="mailto:hello@hopeofglory.ministry" className="text-muted hover:text-gold">
                hello@hopeofglory.ministry
              </a>
            </p>
            <p className="m-0 mt-2 text-xs uppercase tracking-[0.16em] text-gold">
              In crisis? Call 988 · Emergency? Call 911 · Housing? Dial 211
            </p>
          </div>
        </div>

        <div className="mt-10 text-xs text-muted opacity-70">
          <p className="m-0">
            © {new Date().getFullYear()} Hope of Glory Ministry. Sermons,
            teaching, prayer prompts, audio, and visuals on this site are
            produced with the help of AI tools. See our{" "}
            <Link href="/ai-disclosure" className="text-gold">
              AI disclosure
            </Link>.
          </p>
        </div>
      </div>
    </footer>
  );
}
