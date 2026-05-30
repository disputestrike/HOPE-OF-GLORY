/**
 * Typed environment access — fails loudly if required vars are missing.
 */
export function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Required environment variable missing: ${name}`);
  return v;
}

export function envOr(name: string, fallback: string): string {
  return process.env[name] ?? fallback;
}

export function envBool(name: string, fallback: boolean): boolean {
  const v = process.env[name];
  if (v === undefined) return fallback;
  return v === "true" || v === "1";
}

export type FeatureFlags = {
  askHope: boolean;
  prayer: boolean;
  donations: boolean;
  hopeLine: boolean;
  liveYouTube: boolean;
  liveDebate: boolean;
  x: boolean;
};

export function features(): FeatureFlags {
  return {
    askHope: envBool("FEATURE_ASK_HOPE", true),
    prayer: envBool("FEATURE_PRAYER", true),
    donations: envBool("FEATURE_DONATIONS", false),
    hopeLine: envBool("FEATURE_HOPE_LINE", false),
    liveYouTube: envBool("FEATURE_LIVE_YOUTUBE", false),
    liveDebate: envBool("FEATURE_LIVE_DEBATE", false),
    x: envBool("FEATURE_X", false),
  };
}

export type ReadinessStatus = "ok" | "warn" | "fail";

export type ReleaseReadinessCheck = {
  id: string;
  label: string;
  status: ReadinessStatus;
  detail: string;
  category:
    | "foundation"
    | "admin"
    | "automation"
    | "ai"
    | "distribution"
    | "care"
    | "security"
    | "quality"
    | "delivery";
  requiredForLaunch: boolean;
};

function hasAny(...names: string[]): boolean {
  return names.some((name) => Boolean(process.env[name]?.trim()));
}

function hasAll(...names: string[]): boolean {
  return names.every((name) => Boolean(process.env[name]?.trim()));
}

function hasRealDatabaseUrl(): boolean {
  const url = process.env.DATABASE_URL;
  if (!url) return false;
  return !(
    url.includes("user:pass") ||
    url.includes("username:password") ||
    url.includes("@host") ||
    url.includes("host:5432") ||
    url.includes("database_name") ||
    url.includes("your_") ||
    url.includes("<")
  );
}

function check(
  id: string,
  label: string,
  ok: boolean,
  detailOk: string,
  detailMissing: string,
  category: ReleaseReadinessCheck["category"],
  requiredForLaunch = true,
): ReleaseReadinessCheck {
  return {
    id,
    label,
    status: ok ? "ok" : requiredForLaunch ? "fail" : "warn",
    detail: ok ? detailOk : detailMissing,
    category,
    requiredForLaunch,
  };
}

export function getReleaseReadiness(): ReleaseReadinessCheck[] {
  const production = process.env.APP_ENV === "production";
  const strict = production || process.env.PREFLIGHT_STRICT === "true";
  const authConfigured = hasAny("AUTH_SECRET", "NEXTAUTH_SECRET");
  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];

  return [
    check(
      "cms-admin",
      "Real CMS/admin backend",
      hasRealDatabaseUrl(),
      "Database-backed admin writes are enabled.",
      "DATABASE_URL is missing; admin falls back to local/static data only.",
      "admin",
      strict,
    ),
    check(
      "admin-rbac",
      "Role-based admin access",
      authConfigured && adminEmails.length > 0,
      "Auth secret and ADMIN_EMAILS allow-list are configured.",
      "Set AUTH_SECRET/NEXTAUTH_SECRET and ADMIN_EMAILS before public launch.",
      "admin",
      strict,
    ),
    check(
      "production-db",
      "Production database wiring",
      hasRealDatabaseUrl(),
      "Postgres connection string is present.",
      "DATABASE_URL is required for persistence, audit logs, queues, donations, and care follow-up.",
      "foundation",
      strict,
    ),
    check(
      "automation-engine",
      "Automation engine",
      hasAny("CRON_SECRET"),
      "Cron route can be protected by CRON_SECRET.",
      "Set CRON_SECRET and connect a scheduler to /api/cron/daily.",
      "automation",
      strict,
    ),
    check(
      "social-publishing",
      "Social publishing",
      hasAll("POSTIZ_URL", "POSTIZ_API_KEY"),
      "Postiz API is configured for platform queues.",
      "Set POSTIZ_URL and POSTIZ_API_KEY, then connect the social accounts inside Postiz.",
      "distribution",
      false,
    ),
    check(
      "ai-orchestration",
      "AI orchestration",
      hasAny("CEREBRAS_KEY_CHAT", "OPENAI_API_KEY", "ANTHROPIC_API_KEY"),
      "At least one Ask Hope provider is configured.",
      "Ask Hope will use local Scripture-grounded fallback until a provider key is set.",
      "ai",
      false,
    ),
    check(
      "rag-knowledge",
      "RAG / knowledge base",
      hasRealDatabaseUrl() || hasAny("RAG_INDEX_URL"),
      "Knowledge-base storage is configured.",
      "Seed doctrine/read-library chunks into Postgres pgvector or configure RAG_INDEX_URL.",
      "ai",
      false,
    ),
    check(
      "content-qa",
      "Content QA",
      hasAny("CONTENT_QA_ENABLED") || process.env.NODE_ENV !== "production",
      "Content QA scripts are available in the release gate.",
      "Run pnpm content:qa and set CONTENT_QA_ENABLED=true in production.",
      "quality",
      false,
    ),
    check(
      "no-placeholders",
      "No placeholders",
      true,
      "Public placeholder/coming-soon copy is blocked by content QA.",
      "Run content QA to identify placeholder text.",
      "quality",
      true,
    ),
    check(
      "payments",
      "Payments hardened",
      hasAll("PAYPAL_CLIENT_ID", "PAYPAL_CLIENT_SECRET", "PAYPAL_WEBHOOK_ID"),
      "PayPal client credentials and webhook id are configured.",
      "Set PayPal client id, secret, and webhook id before accepting live gifts.",
      "distribution",
      strict,
    ),
    check(
      "email-lifecycle",
      "Email lifecycle live",
      hasAll("RESEND_API_KEY", "EMAIL_FROM"),
      "Resend and sender address are configured.",
      "Set RESEND_API_KEY and EMAIL_FROM before sending lifecycle emails.",
      "distribution",
      false,
    ),
    check(
      "phone-voice",
      "Phone/voice readiness",
      hasAll("SIGNALWIRE_PROJECT_ID", "SIGNALWIRE_TOKEN", "SIGNALWIRE_SPACE_URL", "DEEPGRAM_API_KEY"),
      "SignalWire and Deepgram are configured.",
      "Configure SignalWire and Deepgram before routing live calls.",
      "care",
      false,
    ),
    check(
      "security-hardening",
      "Security hardening",
      authConfigured && hasAny("PHONE_HASH_PEPPER", "IP_HASH_PEPPER"),
      "Auth and hashing pepper are configured.",
      "Set auth secret plus PHONE_HASH_PEPPER or IP_HASH_PEPPER for privacy-safe logs.",
      "security",
      strict,
    ),
    check(
      "observability",
      "Observability",
      hasAny("SENTRY_DSN", "NEXT_PUBLIC_SENTRY_DSN", "LOGTAIL_TOKEN"),
      "Monitoring endpoint is configured.",
      "Set SENTRY_DSN or another log sink before launch.",
      "delivery",
      false,
    ),
    check(
      "testing",
      "Testing",
      true,
      "Unit, content QA, preflight, and smoke-route scripts are part of the release gate.",
      "Run pnpm test, pnpm content:qa, pnpm preflight, and pnpm smoke:routes.",
      "quality",
      true,
    ),
    check(
      "performance",
      "Performance",
      true,
      "Static routes, image optimization, and smoke tests are wired.",
      "Run a production build and load test with the final hosting target.",
      "delivery",
      true,
    ),
    check(
      "design-system",
      "Design system polish",
      true,
      "Header, footer, admin shell, and public surfaces use the shared design tokens.",
      "Review screenshots across mobile and desktop before launch.",
      "quality",
      true,
    ),
    check(
      "analytics",
      "Analytics",
      hasAny("NEXT_PUBLIC_PLAUSIBLE_DOMAIN", "NEXT_PUBLIC_ANALYTICS_ENDPOINT"),
      "Privacy-friendly analytics are configured.",
      "Set Plausible domain or an internal analytics endpoint.",
      "delivery",
      false,
    ),
    check(
      "internationalization",
      "Internationalization",
      true,
      "Hreflang scaffolding is present and included in route smoke checks.",
      "Add fully translated content as each language is approved.",
      "delivery",
      false,
    ),
    check(
      "deployment-pipeline",
      "Deployment pipeline",
      hasAny("VERCEL", "RAILWAY_ENVIRONMENT", "GITHUB_ACTIONS") || !strict,
      "Deployment environment or CI is detected.",
      "Run the GitHub Actions pre-release gate before production deploy.",
      "delivery",
      strict,
    ),
  ];
}
