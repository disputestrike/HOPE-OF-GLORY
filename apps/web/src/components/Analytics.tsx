"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    const endpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;
    const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
    const search = typeof window === "undefined" ? "" : window.location.search;
    const url = `${pathname}${search}`;

    if (endpoint) {
      navigator.sendBeacon?.(
        endpoint,
        JSON.stringify({
          type: "pageview",
          path: url,
          ts: new Date().toISOString(),
        }),
      );
      return;
    }

    if (plausibleDomain && typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("plausible-pageview", {
          detail: { domain: plausibleDomain, path: url },
        }),
      );
    }
  }, [pathname]);

  return null;
}
