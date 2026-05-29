/**
 * Internationalization (i18n) core module — Phase 12 scaffold.
 *
 * Provides the canonical locale list, path manipulation helpers, and the
 * `alternateLinks()` builder used by Next.js Metadata `alternates.languages`
 * to emit hreflang tags.
 *
 * Locale codes here MUST match `LANGUAGE_NAMES` in
 * `apps/worker/src/agents/translation-glossary.ts`. English ("en") is the
 * default and is not in that worker map because it is the source language.
 *
 * URL strategy (Google-compliant):
 *   - English (default):  /foo
 *   - Other locales:      /{lang}/foo   e.g. /es/foo, /ar/foo
 *   - x-default → canonical English URL
 *   - Self-referencing hreflang is included
 *
 * Alternate-language URLs use the locale-prefixed route shape now so the
 * scaffold is stable before translated content lands.
 */

export const LOCALES = [
  "en",
  "es",
  "pt",
  "fr",
  "ar",
  "zh",
  "hi",
  "ko",
] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/**
 * Human-readable names for each locale. Used in language switchers and
 * accessibility labels. Names are in the target language so a speaker of
 * that language can recognize their own option.
 */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  es: "Español",
  pt: "Português",
  fr: "Français",
  ar: "العربية",
  zh: "中文",
  hi: "हिन्दी",
  ko: "한국어",
};

/**
 * BCP-47 hreflang codes for sitemap and `<link rel="alternate">` tags.
 * These map our internal locale codes to the precise tags search engines
 * expect. Currently 1:1 — we may later distinguish zh-CN vs zh-TW etc.
 */
export const HREFLANG_CODES: Record<Locale, string> = {
  en: "en",
  es: "es",
  pt: "pt",
  fr: "fr",
  ar: "ar",
  zh: "zh",
  hi: "hi",
  ko: "ko",
};

/**
 * Locales that render right-to-left. The locale-aware layout will set
 * `<html dir="rtl">` for these. Phase 12 implementation will wire this up;
 * the scaffold layout stays LTR.
 */
export const RTL_LOCALES: Locale[] = ["ar"];

const DEFAULT_SITE_URL = "https://hopeofglory.ministry";
const HTTP_OR_HTTPS_URL = /^https?:\/\//i;

function resolveSiteUrl(siteUrl?: string): string {
  const raw = (
    siteUrl ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    DEFAULT_SITE_URL
  ).trim();
  if (!raw) return DEFAULT_SITE_URL;

  const withProtocol = HTTP_OR_HTTPS_URL.test(raw)
    ? raw
    : raw.startsWith("//")
      ? `https:${raw}`
      : `https://${raw}`;

  try {
    const url = new URL(withProtocol);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return DEFAULT_SITE_URL;
    }
    return url.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

function normalizePath(pathname: string): string {
  const raw = pathname.trim();
  if (!raw) return "/";

  let pathOnly = raw;
  if (HTTP_OR_HTTPS_URL.test(pathOnly)) {
    try {
      pathOnly = new URL(pathOnly).pathname;
    } catch {
      pathOnly = raw;
    }
  }

  const withoutHash = pathOnly.split("#", 1)[0] ?? "";
  const withoutSearch = withoutHash.split("?", 1)[0] ?? "";
  const withSlash = withoutSearch.startsWith("/")
    ? withoutSearch
    : `/${withoutSearch}`;
  const collapsed = withSlash.replace(/\/{2,}/g, "/");
  const normalized = new URL(collapsed, DEFAULT_SITE_URL).pathname;

  if (normalized === "/") return "/";
  return normalized.replace(/\/+$/, "") || "/";
}

function absoluteUrl(origin: string, pathname: string): string {
  return new URL(pathname, `${origin}/`).toString();
}

/**
 * Type guard: is the given string one of our supported locale codes?
 */
export function isLocale(code: string): code is Locale {
  return (LOCALES as readonly string[]).includes(code);
}

/**
 * Returns whether the given locale renders right-to-left.
 */
export function isRtlLocale(locale: Locale): boolean {
  return RTL_LOCALES.includes(locale);
}

/**
 * Extracts the locale from a pathname. Returns DEFAULT_LOCALE when no
 * locale prefix is present or when the first segment is not a known locale.
 *
 * Examples:
 *   localeFromPath("/")             → "en"
 *   localeFromPath("/sermons")      → "en"
 *   localeFromPath("/es/sermons")   → "es"
 *   localeFromPath("/ar")           → "ar"
 *   localeFromPath("/xx/sermons")   → "en"  (unknown locale ⇒ default)
 */
export function localeFromPath(pathname: string): Locale {
  const normalized = normalizePath(pathname);
  const segments = normalized.split("/").filter(Boolean);
  if (segments.length === 0) return DEFAULT_LOCALE;
  const first = segments[0];
  if (!first) return DEFAULT_LOCALE;
  return isLocale(first) ? first : DEFAULT_LOCALE;
}

/**
 * Strips a leading locale segment from a path, returning the canonical
 * (English) path. Leaves non-locale-prefixed paths untouched.
 *
 * Examples:
 *   pathWithoutLocale("/es/sermons")   → "/sermons"
 *   pathWithoutLocale("/sermons")      → "/sermons"
 *   pathWithoutLocale("/es")           → "/"
 *   pathWithoutLocale("/")             → "/"
 */
export function pathWithoutLocale(pathname: string): string {
  const normalized = normalizePath(pathname);
  const segments = normalized.split("/").filter(Boolean);
  if (segments.length === 0) return "/";
  const first = segments[0];
  if (!first || !isLocale(first)) return normalized;
  const rest = segments.slice(1).join("/");
  return rest === "" ? "/" : `/${rest}`;
}

/**
 * Builds a localized path. For the default locale (English), no prefix is
 * added. For other locales, prepends `/{locale}`.
 *
 * Accepts paths with or without a leading slash, with or without an
 * existing locale prefix (which is stripped before re-prefixing).
 *
 * Examples:
 *   buildLocalizedPath("en", "/sermons")     → "/sermons"
 *   buildLocalizedPath("es", "/sermons")     → "/es/sermons"
 *   buildLocalizedPath("es", "/")            → "/es"
 *   buildLocalizedPath("ar", "/es/sermons")  → "/ar/sermons"
 *   buildLocalizedPath("en", "/es/sermons")  → "/sermons"
 */
export function buildLocalizedPath(locale: Locale, pathname: string): string {
  const canonical = pathWithoutLocale(pathname);
  if (locale === DEFAULT_LOCALE) return canonical;
  if (canonical === "/") return `/${locale}`;
  return `/${locale}${canonical}`;
}

/**
 * Builds the alternates object for a given canonical (English) route,
 * suitable for `Next.js Metadata.alternates`.
 *
 * The `canonical` value is the absolute English URL. The `languages` map
 * keys are BCP-47 hreflang codes (including `x-default`) and values are
 * absolute URLs.
 *
 * Alternate URLs use locale-prefixed paths even before translations are
 * populated, so page metadata and sitemap integration can share one URL
 * shape throughout the multilingual rollout.
 *
 * @param canonicalPath  English path, with or without locale prefix. Query,
 *                       fragment, duplicate slashes, and non-root trailing
 *                       slashes are normalized away.
 * @param opts.siteUrl   Override the site origin. Defaults to NEXT_PUBLIC_SITE_URL.
 */
export function alternateLinks(
  canonicalPath: string,
  opts: { siteUrl?: string } = {},
): {
  canonical: string;
  languages: Record<string, string>;
} {
  const origin = resolveSiteUrl(opts.siteUrl);
  const canonicalRoute = pathWithoutLocale(canonicalPath);
  const canonical = absoluteUrl(origin, canonicalRoute);

  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    const localizedPath = buildLocalizedPath(locale, canonicalRoute);
    languages[HREFLANG_CODES[locale]] = absoluteUrl(origin, localizedPath);
  }
  // x-default points at the canonical English URL per Google guidance.
  languages["x-default"] = canonical;

  return { canonical, languages };
}
