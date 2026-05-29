# Hope of Glory Release Gates

Run these before public launch:

1. `pnpm content:qa`
2. `pnpm test`
3. `pnpm typecheck`
4. `pnpm build`
5. `pnpm preflight:strict`
6. Start the app and run `pnpm smoke:routes`

Production credentials required before live traffic:

- `DATABASE_URL`
- `AUTH_SECRET` or `NEXTAUTH_SECRET`
- `ADMIN_EMAILS`
- `CRON_SECRET`
- `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_WEBHOOK_ID`
- `RESEND_API_KEY`, `EMAIL_FROM`
- At least one AI provider key for Ask Hope
- `POSTIZ_URL`, `POSTIZ_API_KEY` after social accounts are connected
- SignalWire and Deepgram keys before Hope Line accepts live calls
- `SENTRY_DSN` or an equivalent monitoring sink

The admin page `/admin/release` shows the same twenty gates inside the app.

