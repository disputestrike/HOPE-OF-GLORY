/**
 * JSON-LD structured data emitters. Google recommends JSON-LD over RDFa/Microdata.
 * Embed inside server components via <Script type="application/ld+json">.
 *
 * Implements three primary schemas:
 *   - Organization (use once on /, /about, /beliefs)
 *   - Article (use on every long-form teaching, sermon, hub article)
 *   - BreadcrumbList (use everywhere the user has visible breadcrumbs)
 */

type Json =
  | string
  | number
  | boolean
  | null
  | undefined
  | Json[]
  | { [key: string]: Json };

function jsonLd(data: Json): React.ReactElement {
  return (
    <script
      type="application/ld+json"
      // Server-rendered — no XSS risk with controlled JSON.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationLd(opts: {
  url?: string;
  logoUrl?: string;
  sameAs?: string[];
}) {
  const url = opts.url ?? "https://hopeofglory.ministry";
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Hope of Glory Ministry",
    alternateName: "Hope of Glory",
    url,
    logo: opts.logoUrl ?? `${url}/logo.png`,
    description:
      "An AI-native Christian media ministry proclaiming Jesus Christ through Scripture, prayer, teaching, apologetics, and discipleship.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Washington",
      addressRegion: "DC",
      addressCountry: "US",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "hello@hopeofglory.ministry",
        availableLanguage: ["English"],
      },
    ],
    sameAs: opts.sameAs ?? [],
  });
}

export function ArticleLd(opts: {
  headline: string;
  description?: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  imageUrl?: string;
  authorName?: string;
}) {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    image: opts.imageUrl,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    author: {
      "@type": "Organization",
      name: opts.authorName ?? "Hope of Glory Ministry",
    },
    publisher: {
      "@type": "Organization",
      name: "Hope of Glory Ministry",
      logo: {
        "@type": "ImageObject",
        url: "https://hopeofglory.ministry/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": opts.url,
    },
  });
}

export function BreadcrumbListLd(items: Array<{ name: string; url: string }>) {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  });
}

export function VideoObjectLd(opts: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  contentUrl?: string;
  embedUrl?: string;
  duration?: string; // ISO 8601 (e.g. "PT5M30S")
}) {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: opts.name,
    description: opts.description,
    thumbnailUrl: opts.thumbnailUrl,
    uploadDate: opts.uploadDate,
    contentUrl: opts.contentUrl,
    embedUrl: opts.embedUrl,
    duration: opts.duration,
    publisher: {
      "@type": "Organization",
      name: "Hope of Glory Ministry",
    },
  });
}
