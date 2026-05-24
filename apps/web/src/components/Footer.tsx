import Link from "next/link";

const sections = [
  {
    heading: "Ministry",
    links: [
      { href: "/mission", label: "Mission" },
      { href: "/beliefs", label: "What We Believe" },
      { href: "/sermons", label: "Sermons" },
      { href: "/new-believers", label: "Start Here" },
    ],
  },
  {
    heading: "Engage",
    links: [
      { href: "/ask", label: "Ask Hope" },
      { href: "/prayer", label: "Prayer" },
      { href: "/hope-line", label: "Hope Line" },
      { href: "/give", label: "Support" },
    ],
  },
  {
    heading: "Teaching",
    links: [
      { href: "/revelation", label: "Revelation" },
      { href: "/apologetics", label: "Apologetics" },
      { href: "/bible-study", label: "Bible Study" },
    ],
  },
  {
    heading: "Transparency",
    links: [
      { href: "/ai-disclosure", label: "AI Disclosure" },
      { href: "/corrections", label: "Corrections" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/contact", label: "Contact" },
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
                    <Link
                      href={link.href}
                      className="text-muted hover:text-gold text-sm"
                    >
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
            <div className="wordmark items-start">
              <span className="wordmark__title">Hope of Glory</span>
              <span className="wordmark__sub">Ministry</span>
            </div>
            <p className="m-0 text-muted">
              Filling the earth with the knowledge of the glory of the Lord.
            </p>
          </div>

          <div className="text-sm text-muted">
            <p className="m-0">Washington, D.C.</p>
            <p className="m-0">
              <a
                href="mailto:hello@hopeofglory.ministry"
                className="text-muted hover:text-gold"
              >
                hello@hopeofglory.ministry
              </a>
            </p>
            <p className="m-0 mt-2 text-xs uppercase tracking-[0.16em] text-gold">
              In crisis? Call 988 · Emergency? Call 911
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
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
