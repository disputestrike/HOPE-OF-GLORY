/**
 * XML sitemap.
 *
 * Each entry includes an `alternates.languages` map (hreflang scaffold,
 * Phase 12). For now every locale's alternate URL points to the SAME
 * canonical English URL — this is acceptable per Google's hreflang docs
 * as a placeholder while translated content is being produced by the
 * Translation Agent. Once translated pages exist, the alternate URLs
 * here should be rebuilt with `buildLocalizedPath` so each language
 * advertises its own `/{lang}/{path}` URL.
 */
import type { MetadataRoute } from "next";
import { HELP_TOPIC_SLUGS } from "@/data/help-topics";
import { FORTY_DAY_JOURNEY } from "@/data/forty-day-journey";
import { HURTING_HEART_JOURNEY } from "@/data/thirty-day-hurting-heart";
import { HUBS } from "@/data/read-library";
import { SCROLL_TOPICS } from "@/data/scroll-topics";
import { LAUNCH_SERMONS } from "@/data/launch-schedule";
import { LOCALES, HREFLANG_CODES } from "@/lib/i18n";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hopeofglory.ministry";

type SitemapEntry = MetadataRoute.Sitemap[number];

/**
 * Build the hreflang `alternates.languages` map for a given canonical URL.
 *
 * Placeholder behaviour: every locale's URL is the canonical English URL.
 * When the Translation Agent (Phase 12) ships translated routes, replace
 * the right-hand side with `${BASE}${buildLocalizedPath(locale, path)}`.
 */
function alternatesFor(canonicalUrl: string): NonNullable<SitemapEntry["alternates"]> {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    languages[HREFLANG_CODES[locale]] = canonicalUrl;
  }
  languages["x-default"] = canonicalUrl;
  return { languages };
}

/**
 * Convenience: extend a plain route entry with the alternates block so the
 * existing route array reads cleanly.
 */
function withAlternates(entry: SitemapEntry): SitemapEntry {
  return { ...entry, alternates: alternatesFor(entry.url) };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    // Primary surface
    { url: `${BASE}/`, priority: 1.0, changeFrequency: "daily", lastModified },
    { url: `${BASE}/come-to-christ`, priority: 1.0, changeFrequency: "monthly", lastModified },
    { url: `${BASE}/sinners-prayer`, priority: 0.9, changeFrequency: "yearly", lastModified },
    { url: `${BASE}/how-can-i-be-saved`, priority: 0.9, changeFrequency: "yearly", lastModified },
    { url: `${BASE}/what-happens-after-i-pray`, priority: 0.9, changeFrequency: "yearly", lastModified },
    { url: `${BASE}/new-believer-next-steps`, priority: 0.9, changeFrequency: "yearly", lastModified },

    // Engage
    { url: `${BASE}/ask`, priority: 0.9, changeFrequency: "weekly", lastModified },
    { url: `${BASE}/read`, priority: 0.9, changeFrequency: "daily", lastModified },
    { url: `${BASE}/scroll`, priority: 0.9, changeFrequency: "weekly", lastModified },
    { url: `${BASE}/messages`, priority: 0.9, changeFrequency: "daily", lastModified },
    { url: `${BASE}/messages/daily-word`, priority: 0.8, changeFrequency: "daily", lastModified },
    { url: `${BASE}/calendar`, priority: 0.7, changeFrequency: "daily", lastModified },
    { url: `${BASE}/messages/teachings`, priority: 0.8, changeFrequency: "weekly", lastModified },
    { url: `${BASE}/messages/studies`, priority: 0.8, changeFrequency: "weekly", lastModified },
    { url: `${BASE}/messages/prayers`, priority: 0.8, changeFrequency: "weekly", lastModified },
    { url: `${BASE}/messages/healing-and-miracles`, priority: 0.8, changeFrequency: "weekly", lastModified },
    { url: `${BASE}/messages/meditating-on-the-word`, priority: 0.8, changeFrequency: "weekly", lastModified },
    { url: `${BASE}/daily-faith`, priority: 0.9, changeFrequency: "daily", lastModified },
    { url: `${BASE}/journey/40-day`, priority: 0.9, changeFrequency: "weekly", lastModified },
    { url: `${BASE}/journey/30-day`, priority: 0.9, changeFrequency: "weekly", lastModified },

    // Help
    { url: `${BASE}/help`, priority: 0.9, changeFrequency: "monthly", lastModified },
    { url: `${BASE}/help-now`, priority: 0.9, changeFrequency: "monthly", lastModified },
    { url: `${BASE}/help/suicide`, priority: 0.9, changeFrequency: "monthly", lastModified },
    { url: `${BASE}/help/crisis-resources`, priority: 0.9, changeFrequency: "monthly", lastModified },
    { url: `${BASE}/help/prayer-request`, priority: 0.8, changeFrequency: "monthly", lastModified },

    // Apologetics
    { url: `${BASE}/apologetics`, priority: 0.8, changeFrequency: "weekly", lastModified },
    { url: `${BASE}/trust-the-scriptures`, priority: 0.8, changeFrequency: "monthly", lastModified },

    // Public content pages
    { url: `${BASE}/mission`, priority: 0.7, changeFrequency: "yearly", lastModified },
    { url: `${BASE}/beliefs`, priority: 0.7, changeFrequency: "yearly", lastModified },
    { url: `${BASE}/doctrinal-basis`, priority: 0.6, changeFrequency: "yearly", lastModified },
    { url: `${BASE}/community-guidelines`, priority: 0.5, changeFrequency: "yearly", lastModified },
    { url: `${BASE}/crisis-disclaimer`, priority: 0.5, changeFrequency: "yearly", lastModified },
    { url: `${BASE}/ai-disclosure`, priority: 0.6, changeFrequency: "yearly", lastModified },
    { url: `${BASE}/corrections`, priority: 0.5, changeFrequency: "weekly", lastModified },
    { url: `${BASE}/privacy`, priority: 0.3, changeFrequency: "yearly", lastModified },
    { url: `${BASE}/terms`, priority: 0.3, changeFrequency: "yearly", lastModified },
    { url: `${BASE}/contact`, priority: 0.5, changeFrequency: "yearly", lastModified },
    { url: `${BASE}/gallery`, priority: 0.6, changeFrequency: "monthly", lastModified },
    { url: `${BASE}/give`, priority: 0.6, changeFrequency: "yearly", lastModified },
    { url: `${BASE}/prayer`, priority: 0.8, changeFrequency: "monthly", lastModified },
    { url: `${BASE}/sermons`, priority: 0.8, changeFrequency: "daily", lastModified },
    { url: `${BASE}/revelation`, priority: 0.7, changeFrequency: "weekly", lastModified },
    { url: `${BASE}/bible-study`, priority: 0.7, changeFrequency: "weekly", lastModified },
    { url: `${BASE}/hope-line`, priority: 0.7, changeFrequency: "monthly", lastModified },
  ];

  // Dynamic help topics
  const helpTopicRoutes: MetadataRoute.Sitemap = HELP_TOPIC_SLUGS
    .filter((s) => s !== "suicide" && s !== "crisis-resources" && s !== "prayer-request")
    .map((slug) => ({
      url: `${BASE}/help/${slug}`,
      priority: 0.7,
      changeFrequency: "monthly" as const,
      lastModified,
    }));

  const readRoutes: MetadataRoute.Sitemap = Object.values(HUBS).flatMap((hub) => [
    {
      url: `${BASE}/read/${hub.slug}`,
      priority: 0.8,
      changeFrequency: "weekly" as const,
      lastModified,
    },
    ...hub.articles.map((article) => ({
      url: `${BASE}/read/${hub.slug}/${article.slug}`,
      priority: 0.7,
      changeFrequency: "monthly" as const,
      lastModified,
    })),
  ]);

  const fortyDayRoutes: MetadataRoute.Sitemap = FORTY_DAY_JOURNEY.map((day) => ({
    url: `${BASE}/journey/40-day/${day.day}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
    lastModified,
  }));

  const hurtingHeartRoutes: MetadataRoute.Sitemap = HURTING_HEART_JOURNEY.map((day) => ({
    url: `${BASE}/journey/30-day/${day.day}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
    lastModified,
  }));

  const scrollRoutes: MetadataRoute.Sitemap = SCROLL_TOPICS.map((topic) => ({
    url: `${BASE}/scroll/${topic.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
    lastModified,
  }));

  const sermonRoutes: MetadataRoute.Sitemap = LAUNCH_SERMONS.map((sermon) => ({
    url: `${BASE}/sermons/${sermon.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
    lastModified,
  }));

  return [
    ...staticRoutes,
    ...helpTopicRoutes,
    ...readRoutes,
    ...fortyDayRoutes,
    ...hurtingHeartRoutes,
    ...scrollRoutes,
    ...sermonRoutes,
  ].map(withAlternates);
}
