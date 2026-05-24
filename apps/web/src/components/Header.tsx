import Link from "next/link";

const primary = [
  { href: "/ask", label: "Ask Hope" },
  { href: "/sermons", label: "Sermons" },
  { href: "/prayer", label: "Prayer" },
  { href: "/revelation", label: "Revelation" },
  { href: "/apologetics", label: "Apologetics" },
];

const secondary = [
  { href: "/new-believers", label: "Start Here" },
  { href: "/give", label: "Support" },
];

export function Header() {
  return (
    <header
      className="sticky top-0 z-40 border-b border-[var(--border-soft)] backdrop-blur-md"
      style={{ background: "rgba(11, 31, 58, 0.78)" }}
    >
      <div className="container-prose flex items-center justify-between py-4 md:py-5">
        <Link
          href="/"
          aria-label="Hope of Glory Ministry — home"
          className="wordmark flex-shrink-0"
        >
          <span className="wordmark__title">Hope of Glory</span>
          <span className="wordmark__sub">Ministry</span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-x-6 lg:gap-x-8"
        >
          {primary.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
          <span
            aria-hidden
            className="h-4 w-px bg-[var(--border-soft)] mx-2"
          />
          {secondary.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>

        <details className="md:hidden relative">
          <summary
            aria-label="Open menu"
            className="list-none cursor-pointer p-2 -m-2 text-warm hover:text-gold"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </summary>
          <div className="absolute right-0 top-full mt-2 w-64 rounded border border-[var(--border-soft)] bg-[var(--deep-heaven)] p-4 shadow-lg">
            <ul className="flex flex-col gap-2">
              {[...primary, ...secondary].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="nav-link block py-2">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </details>
      </div>
    </header>
  );
}
