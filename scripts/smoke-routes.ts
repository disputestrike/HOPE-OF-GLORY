/**
 * HTTP route smoke test for public and admin surfaces.
 *
 * Start the app first:
 *   pnpm dev
 * Then run:
 *   pnpm smoke:routes
 */
const baseUrl = (process.env.SMOKE_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");

const routes = [
  "/",
  "/come-to-christ",
  "/journey/40-day",
  "/journey/40-day/1",
  "/journey/hope-for-the-hurting-heart",
  "/journey/hope-for-the-hurting-heart/1",
  "/ask",
  "/scroll",
  "/scroll/word-of-god-foundation",
  "/read",
  "/read/come-to-christ",
  "/read/come-to-christ/why-you-need-jesus",
  "/read/what-the-world-needs",
  "/daily-faith",
  "/messages",
  "/messages/teachings",
  "/help",
  "/help/crisis-resources",
  "/trust-the-scriptures",
  "/gallery",
  "/give",
  "/contact",
  "/beliefs",
  "/admin",
  "/admin/calendar",
  "/admin/release",
];

const banned = [/coming soon/i, /not connected in this preview/i, /paypal-placeholder/i];

async function main(): Promise<void> {
  const failures: string[] = [];

  for (const route of routes) {
    const url = `${baseUrl}${route}`;
    try {
      const res = await fetch(url, { redirect: "manual" });
      if (res.status >= 400 && res.status !== 401 && res.status !== 403) {
        failures.push(`${route}: HTTP ${res.status}`);
        continue;
      }
      const text = await res.text().catch(() => "");
      for (const pattern of banned) {
        if (pattern.test(text)) failures.push(`${route}: banned copy ${pattern}`);
      }
      console.log(`OK ${route} (${res.status})`);
    } catch (err) {
      failures.push(`${route}: ${err instanceof Error ? err.message : "request failed"}`);
    }
  }

  if (failures.length > 0) {
    console.error("\nSmoke route failures:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`\nSmoke routes passed: ${routes.length}`);
}

main().catch((err) => {
  console.error("Smoke routes crashed:", err);
  process.exit(2);
});

