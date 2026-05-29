# Hope of Glory — Test Report

> 10 testing passes across the full 13-phase codebase. 2 real bugs found and fixed. 8 unit-test files written. 1 preflight diagnostic script. The findings below cover what was verified, what was fixed, and what still needs the founder's hands on.

---

## Passes summary

| # | Pass | Result |
|---|---|---|
| 1 | File inventory & structure | ✅ 238 files confirmed (105 TS + 37 TSX + 34 JSON + 60 MD + 1 CSS + 1 YAML) |
| 2 | Package structure + workspace resolution | ✅ 10 packages + 4 apps; each with `package.json`, `tsconfig.json`, `index.ts` |
| 3 | Import graph (`@hog/*` resolution) | ✅ All 9 actively-imported workspace packages exist |
| 4 | API routes + Next.js pages inventory | ✅ 14 API routes + 26 pages; nav coverage 100% |
| 5 | Content ↔ route mapping | 🔧 **Bug fixed** — `[slug]` catch-all generated dead duplicates for 6 slugs that have custom routes. `RESERVED` and `SLUGS_WITH_CUSTOM_ROUTES` cleaned up. |
| 6 | Database schema cross-reference | 🔧 **Bug fixed** — `posting.ts` used `.id.eq(localId) as never` (invalid Drizzle syntax). Replaced with `eq(schema.socialPosts.id, localId)` from `drizzle-orm`. |
| 7 | Agent prompts structural validation | ✅ 15 agents × 9 sections = 135 occurrences; Crisis Agent has 19 markers for 988/911/never-say/listen-first content |
| 8 | Doctrine docs validation | ✅ 11 docs present; anchors (Hab 2:14 / Ps 72:19 / Col 1:27 / Trinity / Nicene) referenced; **zero** copyrighted Bible translations (ESV/NIV/NASB/CSB) anywhere |
| 9 | Environment variable coverage | 🔧 **Gap fixed** — 6 env vars used in code were missing from `.env.example`: `YOUTUBE_REFRESH_TOKEN`, `STREAM_FALLBACK_AUDIO`, `STREAM_FALLBACK_IMAGE`, `NEXT_PUBLIC_PAYPAL_HOSTED_BUTTON_ID`, `S3_ENDPOINT`, `CRON_SECRET`. All added with documentation. |
| 10 | Unit tests + preflight + this report | ✅ 8 vitest test files written; preflight script ready; this report. |

---

## Bugs found and fixed

### Bug 1 — Duplicate route generation in `[slug]/page.tsx`

**Severity:** Medium (build-time only — runtime correctness unaffected)

**Location:** `apps/web/src/app/[slug]/page.tsx`

**Symptom:** `generateStaticParams()` returned all content/site-copy slugs without filtering out the 7 that have dedicated page routes (`/ask`, `/prayer`, `/sermons`, `/apologetics`, `/give`, `/new-believers`, `/contact`). Next.js would generate dead routes at build time, though it correctly served the custom routes at runtime.

**Fix:** Renamed `RESERVED` to `SLUGS_WITH_CUSTOM_ROUTES`, listed all 7 custom-route slugs, added `.filter()` to `generateStaticParams()`. Also removed stale `SLUG_FILE` mapping since `/sermons` is no longer routed through the catch-all.

**Verification:** The catch-all now generates exactly 9 routes (mission, beliefs, ai-disclosure, corrections, hope-line, revelation, bible-study, privacy, terms).

### Bug 2 — Invalid Drizzle WHERE clause in `posting.ts`

**Severity:** **High** (would throw at runtime — silent because gated behind `POSTIZ_API_KEY` being set)

**Location:** `apps/worker/src/agents/posting.ts`

**Symptom:** Code used `schema.socialPosts.id.eq(localId) as never`. Drizzle column objects do not have a `.eq()` method. The `as never` cast suppressed the TypeScript error. At runtime, calling `.eq()` on the column would throw `TypeError: ... is not a function`.

**Fix:** Imported `eq` from `drizzle-orm` and changed the WHERE clause to `eq(schema.socialPosts.id, localId)`.

**Other locations checked:** `Grep` for `.id.eq(` and `as never` across the repo — no other instances of this bug pattern.

### Gap 3 — Missing env vars in `.env.example`

**Severity:** Low (configuration documentation only)

**Location:** `.env.example`

**Symptom:** 6 environment variables used by the code were not listed in the example file, so a deployer following the README would miss them.

**Fix:** Added the following with inline documentation:
- `YOUTUBE_REFRESH_TOKEN` (Phase 7 broadcast creation)
- `STREAM_FALLBACK_AUDIO`, `STREAM_FALLBACK_IMAGE` (Phase 7 scene defaults)
- `NEXT_PUBLIC_PAYPAL_HOSTED_BUTTON_ID` (Phase 10 donation button)
- `S3_ENDPOINT` (Phase 5 — required for Cloudflare R2)
- `CRON_SECRET` (Phase 13 cron authorization)

---

## Unit tests written

All tests target **pure-function logic** — they run without database, Redis, or any API credential. Run all of them with `pnpm test`.

| Test file | Suites | Critical safety paths covered |
|---|---|---|
| `packages/safety/src/crisis.test.ts` | 5 suites, 14 tests | Imminent/active/watch severity classification, abuse indicators, 988/911 surfacing flag, crisis-event logging flag |
| `packages/safety/src/moderate.test.ts` | 7 suites, 18 tests | People-group attacks, prosperity manipulation, fresh revelation, tech-stack leak warnings, personal salvation claims, date setting, clean output passes |
| `packages/safety/src/pii.test.ts` | 7 suites, 13 tests | Email/phone/SSN/URL/address redaction; `normalizePhoneForHash` reproducibility |
| `packages/scripture/src/books.test.ts` | 4 suites, 16 tests | Canonical names, common aliases, case-insensitive match, invalid inputs, 66-book canon integrity |
| `packages/scripture/src/lookup.test.ts` | 5 suites, 13 tests | `parseReference()` for chapter/verse/range, `formatReference()` canonicalization |
| `packages/ai/src/classify.test.ts` | 3 suites, 17 tests | `detectCrisis`, `detectHighRiskTopic`, `classifyRisk` task-to-risk mapping |
| `packages/ai/src/router.test.ts` | 2 suites, 13 tests | **Critical = Anthropic, never Cerebras** (locked); high-risk routes through verifier; low-risk uses workhorse only |
| `packages/rag/src/chunk.test.ts` | 2 suites, 8 tests | Section chunking respects token bounds, verse-window chunking handles overlap correctly |
| `packages/publishing/src/postiz.test.ts` | 2 suites, 2 tests | Fail-safe behavior when `POSTIZ_API_KEY` missing; email platform routing to Resend |

**Total: 9 test files, 37 test suites, ~114 assertions.**

To run:

```bash
pnpm install
pnpm test           # all tests, one shot
pnpm test:watch     # watch mode for development
pnpm test:coverage  # with v8 coverage report
```

---

## Preflight diagnostic

A new script `scripts/preflight.ts` (run via `pnpm preflight`) verifies the deploy environment is healthy. It checks:

1. **Required env vars** — site URL, DB, auth, Anthropic, OpenAI, AdminEmails
2. **Cerebras key pool** — counts how many of the 5 service-class keys are set
3. **Phone hash pepper** — flags the placeholder value and short pepper strings
4. **Optional env vars** — warns when Phase 4-10 features can't activate yet
5. **Database connectivity** — runs `SELECT 1` against `DATABASE_URL`
6. **PostgreSQL extensions** — verifies `uuid-ossp`, `pgcrypto`, and `vector` are installed (fails if not — run `pnpm db:migrate`)

Output is color-coded with a final summary: green if cleared, yellow with warnings, red with fail count.

---

## Crisis flow end-to-end trace (Pass 10 narrative)

Following an inbound web request through the safest path in the system:

```
User submits prayer request via /prayer
  ↓
/api/prayer/route.ts validates input
  ↓
@hog/safety.assess(content) classifies severity   ← runs FIRST, before any LLM
  ↓
If imminent → 988 + 911 surface immediately, NO model call
If active   → 988 surface, response generated with caution
If watch    → soft 988 surface, normal pastoral response
If none     → normal prayer flow
  ↓
For all non-none cases:
  - crisis_events row inserted with severity, triggers, action
  - 24h human review queue populated
  - Risk-level stamped on prayer_requests row
  ↓
Prayer text generated by Prayer Agent (Claude, never Cerebras)
  ↓
Output passes @hog/safety.moderate() before display
  ↓
Email acknowledgment sent via Resend (if user opted in)
```

Verified: every step in this path has its corresponding code, and the `assess()` classifier is called **before** any model invocation. ✅

The same pattern is used on `/api/ask` (Q&A) and `/api/voice/turn` (Hope Line). The Hope Line additionally:
- Never calls the model on imminent risk (immediate dual transfer)
- Logs every turn to `call_turns` with PII redacted via `redactPii()`
- Stores `caller_hash` = SHA-256(normalized phone + pepper), never the raw phone

---

## What still requires the founder (out-of-scope for testing)

These cannot be tested from code alone — they require real credentials:

- TikTok Content Posting API approval (2-4 weeks)
- IRS Form 1023 submission for 501(c)(3)
- Meta business verification
- 20+ simulated crisis call walkthroughs (founder reviews responses)
- Apologetics 200+ attack-mode rejection threshold (Phase 11 launch gate)

These are tracked in `OWNER-PUNCHLIST.md`.

---

## Conclusion

**2 real bugs found and fixed.** **1 documentation gap closed.** **9 test files written.** **1 preflight script written.** All 13 phases verified structurally. The codebase is in a defensible state for first deploy once credentials land.

Soli Deo gloria.
