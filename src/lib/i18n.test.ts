/**
 * Unit tests for the i18n core module. Covers locale detection, path
 * rewriting, and hreflang alternate URL construction.
 */
import { describe, it, expect } from "vitest";
import {
  LOCALES,
  DEFAULT_LOCALE,
  HREFLANG_CODES,
  isLocale,
  localeFromPath,
  pathWithoutLocale,
  buildLocalizedPath,
  alternateLinks,
} from "./i18n";

const SITE = "https://hopeofglory.ministry";

describe("isLocale()", () => {
  it("recognizes every supported locale", () => {
    for (const locale of LOCALES) {
      expect(isLocale(locale)).toBe(true);
    }
  });

  it("rejects unknown codes", () => {
    expect(isLocale("xx")).toBe(false);
    expect(isLocale("")).toBe(false);
    expect(isLocale("EN")).toBe(false); // case-sensitive
    expect(isLocale("eng")).toBe(false);
  });
});

describe("localeFromPath()", () => {
  it("returns default for root path", () => {
    expect(localeFromPath("/")).toBe(DEFAULT_LOCALE);
  });

  it("returns default for English (no-prefix) path", () => {
    expect(localeFromPath("/sermons")).toBe(DEFAULT_LOCALE);
  });

  it("extracts a known prefix", () => {
    expect(localeFromPath("/es/sermons")).toBe("es");
    expect(localeFromPath("/ar")).toBe("ar");
    expect(localeFromPath("/zh/help/suicide")).toBe("zh");
  });

  it("falls back to default for unknown prefix", () => {
    expect(localeFromPath("/xx/sermons")).toBe(DEFAULT_LOCALE);
    expect(localeFromPath("/eng/anything")).toBe(DEFAULT_LOCALE);
  });

  it("handles deep paths", () => {
    expect(localeFromPath("/fr/help/crisis-resources/inner")).toBe("fr");
  });

  it("handles missing leading slash defensively", () => {
    expect(localeFromPath("es/sermons")).toBe("es");
    expect(localeFromPath("")).toBe(DEFAULT_LOCALE);
  });

  it("normalizes duplicate and trailing slashes", () => {
    expect(localeFromPath("//es//sermons//")).toBe("es");
  });
});

describe("pathWithoutLocale()", () => {
  it("strips a known locale prefix", () => {
    expect(pathWithoutLocale("/es/sermons")).toBe("/sermons");
    expect(pathWithoutLocale("/ar/help/suicide")).toBe("/help/suicide");
  });

  it("returns root for a bare locale path", () => {
    expect(pathWithoutLocale("/es")).toBe("/");
    expect(pathWithoutLocale("/ko")).toBe("/");
  });

  it("leaves non-locale paths untouched", () => {
    expect(pathWithoutLocale("/sermons")).toBe("/sermons");
    expect(pathWithoutLocale("/help/crisis-resources")).toBe(
      "/help/crisis-resources",
    );
  });

  it("returns / for root", () => {
    expect(pathWithoutLocale("/")).toBe("/");
    expect(pathWithoutLocale("")).toBe("/");
  });

  it("does not treat unknown prefixes as locales", () => {
    expect(pathWithoutLocale("/xx/sermons")).toBe("/xx/sermons");
  });

  it("normalizes search, hash, duplicate slashes, and trailing slashes", () => {
    expect(pathWithoutLocale("/es//sermons/?utm=source#top")).toBe("/sermons");
    expect(pathWithoutLocale("/sermons//")).toBe("/sermons");
  });

  it("accepts an absolute URL and keeps only its path", () => {
    expect(pathWithoutLocale("https://example.test/es/sermons?utm=1")).toBe(
      "/sermons",
    );
  });
});

describe("buildLocalizedPath()", () => {
  it("returns the canonical path for the default locale", () => {
    expect(buildLocalizedPath("en", "/sermons")).toBe("/sermons");
    expect(buildLocalizedPath("en", "/")).toBe("/");
  });

  it("strips an existing locale before applying the new one", () => {
    expect(buildLocalizedPath("ar", "/es/sermons")).toBe("/ar/sermons");
    expect(buildLocalizedPath("en", "/es/sermons")).toBe("/sermons");
  });

  it("prefixes non-default locales", () => {
    expect(buildLocalizedPath("es", "/sermons")).toBe("/es/sermons");
    expect(buildLocalizedPath("zh", "/help/suicide")).toBe("/zh/help/suicide");
  });

  it("handles root path", () => {
    expect(buildLocalizedPath("es", "/")).toBe("/es");
    expect(buildLocalizedPath("ar", "/")).toBe("/ar");
  });

  it("is idempotent when re-localizing", () => {
    const once = buildLocalizedPath("es", "/sermons");
    const twice = buildLocalizedPath("es", once);
    expect(twice).toBe(once);
  });
});

describe("alternateLinks()", () => {
  it("produces a canonical English URL", () => {
    const { canonical } = alternateLinks("/sermons", { siteUrl: SITE });
    expect(canonical).toBe(`${SITE}/sermons`);
  });

  it("uses the site root for canonical when path is '/'", () => {
    const { canonical } = alternateLinks("/", { siteUrl: SITE });
    expect(canonical).toBe(`${SITE}/`);
  });

  it("includes every supported locale plus x-default", () => {
    const { languages } = alternateLinks("/sermons", { siteUrl: SITE });
    for (const locale of LOCALES) {
      expect(languages[HREFLANG_CODES[locale]]).toBeDefined();
    }
    expect(languages["x-default"]).toBeDefined();
  });

  it("self-references English without a locale prefix", () => {
    const { languages } = alternateLinks("/sermons", { siteUrl: SITE });
    expect(languages.en).toBe(`${SITE}/sermons`);
  });

  it("prefixes non-default locales", () => {
    const { languages } = alternateLinks("/sermons", { siteUrl: SITE });
    expect(languages.es).toBe(`${SITE}/es/sermons`);
    expect(languages.ar).toBe(`${SITE}/ar/sermons`);
    expect(languages.zh).toBe(`${SITE}/zh/sermons`);
    expect(languages.ko).toBe(`${SITE}/ko/sermons`);
  });

  it("sets x-default to the canonical English URL", () => {
    const { canonical, languages } = alternateLinks("/sermons", {
      siteUrl: SITE,
    });
    expect(languages["x-default"]).toBe(canonical);
  });

  it("strips a leading locale before building alternates", () => {
    const { canonical, languages } = alternateLinks("/es/sermons", {
      siteUrl: SITE,
    });
    expect(canonical).toBe(`${SITE}/sermons`);
    expect(languages.en).toBe(`${SITE}/sermons`);
    expect(languages.es).toBe(`${SITE}/es/sermons`);
  });

  it("handles deep paths", () => {
    const { languages } = alternateLinks("/help/crisis-resources", {
      siteUrl: SITE,
    });
    expect(languages.fr).toBe(`${SITE}/fr/help/crisis-resources`);
    expect(languages.hi).toBe(`${SITE}/hi/help/crisis-resources`);
  });

  it("handles root path alternates", () => {
    const { languages } = alternateLinks("/", { siteUrl: SITE });
    expect(languages.en).toBe(`${SITE}/`);
    expect(languages.es).toBe(`${SITE}/es`);
    expect(languages.ar).toBe(`${SITE}/ar`);
  });

  it("respects an overridden siteUrl with a trailing slash", () => {
    const { canonical, languages } = alternateLinks("/sermons", {
      siteUrl: "https://example.test/",
    });
    expect(canonical).toBe("https://example.test/sermons");
    expect(languages.es).toBe("https://example.test/es/sermons");
  });

  it("normalizes canonical paths before building absolute URLs", () => {
    const { canonical, languages } = alternateLinks(
      "//es//help/crisis-resources/?utm=source#top",
      { siteUrl: SITE },
    );
    expect(canonical).toBe(`${SITE}/help/crisis-resources`);
    expect(languages.en).toBe(`${SITE}/help/crisis-resources`);
    expect(languages.es).toBe(`${SITE}/es/help/crisis-resources`);
    expect(languages["x-default"]).toBe(canonical);
  });

  it("accepts an absolute canonical URL without creating malformed hrefs", () => {
    const { canonical, languages } = alternateLinks(
      "https://preview.example/es/sermons/?draft=true#heading",
      { siteUrl: SITE },
    );
    expect(canonical).toBe(`${SITE}/sermons`);
    expect(languages.fr).toBe(`${SITE}/fr/sermons`);
  });

  it("falls back to the production origin for blank or invalid site URLs", () => {
    expect(alternateLinks("/sermons", { siteUrl: "   " }).canonical).toBe(
      `${SITE}/sermons`,
    );
    expect(alternateLinks("/sermons", { siteUrl: "https:// " }).canonical).toBe(
      `${SITE}/sermons`,
    );
  });

  it("produces parseable absolute URLs without duplicate slashes in paths", () => {
    const { canonical, languages } = alternateLinks("/sermons", {
      siteUrl: "example.test/",
    });
    const hrefs = [canonical, ...Object.values(languages)];

    for (const href of hrefs) {
      const url = new URL(href);
      expect(url.protocol).toBe("https:");
      expect(url.pathname).not.toMatch(/\/{2,}/);
      if (url.pathname !== "/") {
        expect(url.pathname.endsWith("/")).toBe(false);
      }
    }
  });
});
