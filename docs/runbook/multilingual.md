# Multilingual / Hreflang Runbook

Phase 12 scaffold for Hope of Glory Ministry. This document covers the
hreflang scaffolding that ships today and the work the Translation Agent
will plug into it later.

## Supported locales

Eight locales total — English plus seven translated. Codes must match
`apps/worker/src/agents/translation-glossary.ts` exactly.

| Code | Language          | Bible used (public domain)         | RTL |
| ---- | ----------------- | ---------------------------------- | --- |
| `en` | English (default) | (source — KJV / public domain)     |     |
| `es` | Spanish           | Reina-Valera 1909 (RV1909)         |     |
| `pt` | Portuguese        | Almeida Corrigida Fiel (ACF)       |     |
| `fr` | French            | Louis Segond 1910 (LSG)            |     |
| `ar` | Arabic            | Van Dyck (VAN)                     | yes |
| `zh` | Mandarin Chinese  | Chinese Union Version 和合本 (CUV) |     |
| `hi` | Hindi             | Hindi Old Version (HOV)            |     |
| `ko` | Korean            | Korean Revised Version (KRV)       |     |

The locale list is defined in `apps/web/src/lib/i18n.ts` as `LOCALES`.
Adding or removing a locale requires updating that array, the worker
glossary, and re-running the sitemap.

## URL strategy

- English (default): `/foo`
- Other locales: `/{lang}/foo` e.g. `/es/foo`, `/ar/help/suicide`
- `x-default` hreflang: canonical English URL
- Self-referencing hreflang is always emitted (`en` → English URL,
  `es` → Spanish URL, etc.)
- Canonical paths are normalized before links are emitted: locale prefixes
  are stripped from the canonical, duplicate slashes are collapsed, query
  strings/fragments are removed, and non-root trailing slashes are dropped.

This pattern follows the recommendation in Google's "Tell Google about
localized versions of your page" documentation:
<https://developers.google.com/search/docs/specialty/international/localized-versions>

### Why no auto-redirect by default

`FEATURE_I18N=false` is the default. We do not redirect users based on
their `Accept-Language` header in the default configuration because:

- **Bookmarks stay valid.** A user who bookmarks `/sermons` continues to
  land on the English version even if they later browse from a device with
  a different language preference.
- **URLs are predictable.** Operators, link shares, and email campaigns
  can rely on a single canonical English URL.
- **Search engines see the canonical.** Crawlers without a meaningful
  `Accept-Language` header always land on English, the source content.
- **Translated pages are still reachable.** A user can visit `/es/sermons`
  directly, and the language switcher (when shipped) sets a sticky cookie.

When the user base is large enough to justify it, flip `FEATURE_I18N=true`
to opt into header-based detection (see "Enabling auto-redirect" below).

## How translation flows (Phase 12)

```
1. Sermon (or other content) ships in English
2. Translation Agent reads it from DB, applies the locked theological
   glossary in apps/worker/src/agents/translation-glossary.ts
3. Translated rows are stored in the same content tables with a `language`
   column set to "es" / "pt" / etc.
4. Route handlers under app/[lang]/... (future) call localeFromPath()
   to look up content by both slug AND language.
5. The Hreflang scaffold here advertises the alternate URLs to crawlers.
```

The scaffolding in this phase delivers items 4-5 only. The Translation
Agent + DB schema changes for item 3 land separately.

## How hreflang is emitted

Two layers, deliberately redundant:

### 1. Next.js Metadata (primary)

Every route's metadata can include:

```ts
import { alternateLinks } from "@/lib/i18n";

export const metadata = {
  alternates: alternateLinks("/sermons"),
};
```

`alternateLinks(canonicalPath)` returns `{ canonical, languages }`. Next.js
injects the correct `<link rel="canonical">` and
`<link rel="alternate" hreflang="...">` tags into the document head.
`languages` includes every supported locale plus `x-default`, and every URL
is absolute.

The root layout (`apps/web/src/app/layout.tsx`) does this for `/`.
Individual pages with their own `metadata` export should call
`alternateLinks(theirCanonicalPath)` to override.

### Page metadata integration audit

Current shared scaffold status:

- `apps/web/src/app/layout.tsx` emits root alternates for `/`.
- `apps/web/src/lib/i18n.ts` emits canonical, self-referencing hreflang,
  locale-prefixed alternates, and `x-default`.
- Page-level route metadata still needs parent integration. Do not rely on
  the root layout's `/` alternates for non-root pages.

Parent integration should add `alternates: alternateLinks(path)` to each
public page metadata export or generated metadata response. Static public
paths found in this audit:

`/`, `/apologetics`, `/ask`, `/come-to-christ`, `/contact`, `/daily-faith`,
`/donation-ethics`, `/give`, `/help`, `/help/crisis-resources`,
`/help/prayer-request`, `/help/suicide`, `/help-now`,
`/how-can-i-be-saved`, `/journey/30-day`, `/journey/40-day`, `/messages`,
`/messages/daily-word`, `/messages/healing-and-miracles`,
`/messages/meditating-on-the-word`, `/messages/prayers`,
`/messages/studies`, `/messages/teachings`,
`/new-believer-next-steps`, `/new-believers`, `/prayer`, `/read`,
`/ask`, `/sermons`, `/sinners-prayer`,
`/what-happens-after-i-pray`.

Dynamic public route patterns found in this audit:

`/[slug]`, `/help/[topic]`, `/journey/30-day/[day]`,
`/journey/40-day/[day]`, `/read/[hub]`, `/read/[hub]/[article]`,
`/sermons/[slug]`.

Admin routes are intentionally excluded from the public hreflang checklist.

### 2. `<Hreflang>` component (belt-and-suspenders)

`apps/web/src/components/Hreflang.tsx` emits the same `<link>` tags inline.
It exists for two cases:

- Route segments that cannot rely on the layout's metadata (rare).
- Defence-in-depth for older crawlers that miss head-mutation patterns.

Usage:

```tsx
import { Hreflang } from "@/components/Hreflang";

export default function Page() {
  return (
    <>
      <Hreflang pathname="/sermons" />
      ...
    </>
  );
}
```

### 3. Sitemap

`apps/web/src/app/sitemap.ts` includes an `alternates.languages` block for
every route. Current sitemap behavior is still a placeholder outside this
scaffold file set: every locale's URL points to the canonical English URL.
When translated routes are ready, parent integration should rebuild those
entries with `alternateLinks(path).languages` or
`${BASE}${buildLocalizedPath(locale, path)}` so sitemap hreflang matches
page metadata.

## Arabic / RTL handling

Arabic (`ar`) is a right-to-left language. The locale-aware layout must
set `<html lang="ar" dir="rtl">` when serving an Arabic route. Tailwind's
RTL utilities (`rtl:`) handle most of the rest.

In the scaffold layout this is **deferred**: `<html lang="en" dir="ltr">`
is hard-coded. The Phase 12 follow-up will introduce a locale-aware
`app/[lang]/layout.tsx` that resolves `dir` from
`isRtlLocale(localeFromPath(...))`.

## Enabling auto-redirect (`FEATURE_I18N=true`)

The module `apps/web/src/middleware-i18n.ts` exports `i18nMiddleware` and
`i18nMiddlewareConfig`. It is intentionally NOT imported by
`apps/web/middleware.ts` — wiring it up is a deliberate operator action.

To enable:

1. Set `FEATURE_I18N=true` in the environment.
2. Update `apps/web/middleware.ts` to chain the i18n middleware before
   the NextAuth middleware. A minimal pattern:

   ```ts
   import NextAuth from "next-auth";
   import { type NextRequest, NextResponse } from "next/server";
   import authConfig from "./auth.config";
   import { i18nMiddleware } from "./src/middleware-i18n";

   const { auth } = NextAuth(authConfig);

   export default async function middleware(request: NextRequest) {
     const i18nResponse = i18nMiddleware(request);
     if (i18nResponse.headers.get("location")) return i18nResponse;
     return auth(request as unknown as Parameters<typeof auth>[0]);
   }

   export const config = {
     matcher: [
       "/admin/:path*",
       "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.).*)",
     ],
   };
   ```

3. Smoke-test with curl:

   ```bash
   # Spanish browser → /sermons should 307 → /es/sermons
   curl -I -H "Accept-Language: es-MX,es;q=0.9,en;q=0.5" \
     http://localhost:3000/sermons

   # English browser → /sermons should 200
   curl -I -H "Accept-Language: en-US,en;q=0.9" \
     http://localhost:3000/sermons
   ```

The middleware honours a sticky `hog_locale` cookie if present, so a
language switcher can opt the user out of header-based detection by
setting the cookie to their chosen locale.

## References

- Google Search Central — Localized versions:
  <https://developers.google.com/search/docs/specialty/international/localized-versions>
- Next.js Metadata `alternates`:
  <https://nextjs.org/docs/app/api-reference/functions/generate-metadata#alternates>
- `hreflang` and the `x-default` value:
  <https://developers.google.com/search/blog/2013/04/x-default-hreflang-for-international-pages>
