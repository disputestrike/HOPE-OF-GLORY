import Link from "next/link";
import Image from "next/image";

const logoSrc = "/brand/hope-of-glory-logo-transparent.png";

const primary = [
  { href: "/come-to-christ", label: "Come to Christ" },
  { href: "/journey/40-day", label: "40-Day Journey" },
  { href: "/ask", label: "Ask Hope" },
  { href: "/read", label: "Read" },
  { href: "/daily-faith", label: "Daily Faith" },
  { href: "/scroll", label: "The Scroll" },
  { href: "/messages", label: "Messages" },
  { href: "/help", label: "Need Help" },
  { href: "/give", label: "Give" },
];

export function Header() {
  return (
    <header
      className="sticky top-0 z-40 border-b border-[var(--border-soft)] backdrop-blur-md"
      style={{ background: "rgba(11, 31, 58, 0.78)" }}
    >
      <div className="container-prose flex items-center justify-between gap-8 py-4 md:py-5 xl:gap-10">
        <Link
          href="/"
          aria-label="Hope of Glory Ministry - home"
          className="-ml-3 flex flex-shrink-0 items-center sm:-ml-4 lg:-ml-8 xl:-ml-10"
        >
          <Image
            src={logoSrc}
            alt="Hope of Glory Ministry"
            width={1536}
            height={1024}
            priority
            className="h-auto w-40 object-contain drop-shadow-[0_0_14px_rgba(212,175,55,0.2)] sm:w-48 md:w-52 lg:w-60"
            sizes="(min-width: 1024px) 240px, (min-width: 768px) 208px, (min-width: 640px) 192px, 160px"
          />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden flex-1 items-center justify-end gap-x-3 xl:flex 2xl:gap-x-4"
        >
          {primary.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>

        <details className="xl:hidden relative">
          <summary
            aria-label="Open menu"
            className="list-none cursor-pointer p-2 -m-2 text-warm hover:text-gold"
          >
            <svg
              width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" aria-hidden
            >
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </summary>
          <div className="absolute right-0 top-full mt-2 w-72 rounded border border-[var(--border-soft)] bg-[var(--deep-heaven)] p-4 shadow-lg">
            <ul className="flex flex-col gap-1">
              {primary.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="nav-link block py-2 px-2 rounded hover:bg-[var(--accent-soft)]">
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
