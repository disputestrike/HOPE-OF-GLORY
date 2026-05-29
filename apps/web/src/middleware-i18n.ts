/**
 * Optional locale-detection middleware.
 *
 * Gated behind `FEATURE_I18N=true`. Default is OFF — when off, every
 * request hits the canonical English route and translated routes are
 * still reachable directly via `/{lang}/...`. This preserves bookmarks,
 * keeps URLs predictable, and lets search engines see canonical English.
 *
 * When enabled, this middleware inspects the `Accept-Language` header on
 * GET requests to bare (unprefixed) paths and 307-redirects to the user's
 * preferred supported locale if it is not the default. Static assets,
 * API routes, and already-prefixed paths pass through untouched.
 *
 * IMPORTANT: this module is NOT wired into `apps/web/middleware.ts` by
 * default. To activate, import `i18nMiddleware` from this file and chain
 * it into the existing NextAuth middleware. See
 * `docs/runbook/multilingual.md` for the exact wiring snippet.
 */
import { NextResponse, type NextRequest } from "next/server";
import {
  DEFAULT_LOCALE,
  LOCALES,
  buildLocalizedPath,
  isLocale,
  type Locale,
} from "@/lib/i18n";

const SUPPORTED: readonly Locale[] = LOCALES;

/**
 * Parse an Accept-Language header and return the best-matching supported
 * locale. Returns null if no supported locale is preferred.
 */
export function pickLocale(acceptLanguage: string | null): Locale | null {
  if (!acceptLanguage) return null;

  const entries = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const qParam = params.find((p) => p.trim().startsWith("q="));
      const q = qParam ? Number.parseFloat(qParam.trim().slice(2)) : 1.0;
      return {
        tag: (tag ?? "").trim().toLowerCase(),
        q: Number.isFinite(q) ? q : 0,
      };
    })
    .filter((e) => e.tag.length > 0 && e.q > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of entries) {
    // Exact match
    if (isLocale(tag)) return tag;
    // Primary subtag match (e.g. "es-MX" → "es")
    const primary = tag.split("-")[0];
    if (!primary) continue;
    if (isLocale(primary)) return primary;
    // BCP-47 region-specific Chinese variants → "zh"
    if (primary === "zh") return "zh";
  }

  return null;
}

/**
 * Returns true if this request path should be considered for locale
 * redirect. Excludes API, static, image, and asset paths, as well as
 * paths already prefixed with a known locale.
 */
function shouldHandle(pathname: string): boolean {
  if (pathname.startsWith("/api/")) return false;
  if (pathname.startsWith("/_next/")) return false;
  if (pathname.startsWith("/admin/")) return false; // admin is English-only
  if (pathname === "/favicon.ico") return false;
  if (pathname.startsWith("/static/")) return false;
  // Skip anything that looks like a file with an extension.
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) return false;
  // Skip already-localized paths.
  const first = pathname.split("/").filter(Boolean)[0];
  if (first && SUPPORTED.includes(first as Locale)) return false;
  return true;
}

/**
 * Edge-safe middleware. Returns either a redirect to a localized path or
 * `NextResponse.next()` to defer to the next handler in the chain.
 *
 * No-op unless `process.env.FEATURE_I18N === "true"`.
 */
export function i18nMiddleware(request: NextRequest): NextResponse {
  if (process.env.FEATURE_I18N !== "true") {
    return NextResponse.next();
  }
  if (request.method !== "GET") return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  if (!shouldHandle(pathname)) return NextResponse.next();

  // Honour a sticky locale cookie if present.
  const cookieLocale = request.cookies.get("hog_locale")?.value;
  const sticky = cookieLocale && isLocale(cookieLocale) ? cookieLocale : null;

  const detected =
    sticky ?? pickLocale(request.headers.get("accept-language"));
  if (!detected || detected === DEFAULT_LOCALE) return NextResponse.next();

  const target = buildLocalizedPath(detected, pathname);
  if (target === pathname) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = target;
  url.search = search;
  return NextResponse.redirect(url, 307);
}

export const i18nMiddlewareConfig = {
  matcher: [
    // Match everything except static assets, _next internals, and api routes.
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
};
