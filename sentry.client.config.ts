import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.APP_ENV ?? "development",
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,
  // Hard NO on PII collection — user prayer text, chat text, etc. must never leave the app.
  sendDefaultPii: false,
});
