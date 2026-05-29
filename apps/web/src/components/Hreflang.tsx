/**
 * Hreflang — server component that emits explicit `<link rel="alternate">`
 * tags inside the document head.
 *
 * Next.js Metadata `alternates.languages` is the primary mechanism and
 * handles all modern crawlers. This component exists as a defensive
 * belt-and-suspenders for legacy clients and as an escape hatch for route
 * segments that need to override the layout-level alternates explicitly.
 *
 * Usage (inside a Server Component page or layout body):
 *   <Hreflang pathname="/sermons" />
 *
 * The component renders zero visible output — only `<link>` tags. React
 * hoists `<link>` tags from anywhere in the tree into `<head>` in Next.js
 * 15 / React 19.
 */
import { alternateLinks } from "@/lib/i18n";

export interface HreflangProps {
  /**
   * Canonical path or URL, e.g. "/sermons". Locale prefix, query string,
   * fragment, duplicate slashes, and non-root trailing slash are normalized.
   */
  pathname: string;
  /** Optional override for the site origin. */
  siteUrl?: string;
}

export function Hreflang({ pathname, siteUrl }: HreflangProps) {
  const { canonical, languages } = alternateLinks(pathname, { siteUrl });

  return (
    <>
      <link rel="canonical" href={canonical} />
      {Object.entries(languages).map(([hreflang, href]) => (
        <link key={hreflang} rel="alternate" hrefLang={hreflang} href={href} />
      ))}
    </>
  );
}
