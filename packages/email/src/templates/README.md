# Email Lifecycle

Templates for the Hope of Glory Ministry lifecycle. The package now covers the seven email-program rows from the brief plus the 30-Day Hope for the Hurting Heart companion path.

All templates return `{ subject, html, text }`, use the shared `shell()` wrapper in `_shell.ts`, and include the literal `{{unsubscribeUrl}}` token for the Resend client to substitute. WEB Bible only.

## 1. New Believer Welcome - `new-believer-welcome.ts`

Trigger: user clicks "I prayed" on `/come-to-christ`.
Cadence: day 0, 1, 3, 5, 7, 10, 14.
CTA: Start the 40-Day Journey.
Functions: `newBelieverDay0`, `newBelieverDay1`, `newBelieverDay3`, `newBelieverDay5`, `newBelieverDay7`, `newBelieverDay10`, `newBelieverDay14`.
Send helper: `sendNewBelieverWelcomeEmail`.

## 2. 40-Day Journey - `journey-day.ts`

Trigger: user starts the discipleship journey.
Cadence: daily for 40 days.
CTA: Open today's reading.
Function: `journeyDayTemplate(day, opts)`.
Send helper: `sendFortyDayJourneyDayEmail`.

## 3. 30-Day Hope for the Hurting Heart - `hurting-heart-day.ts`

Trigger: user starts the soul-care journey.
Cadence: daily for 30 days.
CTA: Open today's comfort.
Function: `hurtingHeartDayTemplate(day, opts)`.
Send helper: `sendHurtingHeartDayEmail`.
Safety: days 2 and 20 automatically include a direct 988/911 line; callers can force it with `includeSafetyLine`.

## 4. Daily Faith - `daily-faith.ts`

Trigger: journey completion or daily-list subscription.
Cadence: daily or 3x/week.
CTA: Open today's reading.
Function: `dailyFaithTemplate(opts)`.
Send helper: `sendDailyFaithEmail`.

## 5. Prayer Request Follow-up - `prayer-followup.ts`

Trigger: prayer request submitted.
Cadence: same day, day 3, day 7.
CTA: Pray again / Ask Hope.
Functions: `prayerSameDayAck`, `prayerThreeDayFollowup`, `prayerSevenDayCheckIn`.
Send helper: `sendPrayerFollowupEmail`.
Safety: never solicits donations. If a request is crisis-flagged, callers suppress day 3/day 7 and escalate to a human responder; same-day ack includes 988/911.

## 6. Weekly Digest - `weekly-digest.ts`

Trigger: opted-in readers.
Cadence: weekly.
CTA: section-specific Read / Watch / Listen links.
Function: `weeklyDigestTemplate(opts)`.
Send helper: `sendWeeklyDigestEmail`.

## 7. Re-engagement - `re-engagement.ts`

Trigger: dormant subscribers at 14, 21, or 30 days.
Cadence: 2-4 gentle emails.
CTA: Resume your journey.
Functions: `reengagement14day`, `reengagement21day`, `reengagement30day`.
Send helper: `sendReengagementEmail`.
Safety: never solicits donations; day 30 surfaces unsubscribe prominently.

## 8. Donor Stewardship - `donor-stewardship.ts`

Trigger: a gift is recorded.
Cadence: immediate thank-you plus monthly impact summary.
CTA: See what your gift supports.
Functions: `donorImmediateThanks`, `donorMonthlyImpact`.
Send helpers: `sendDonorStewardshipEmail`, `sendDonorImmediateThanksEmail`, `sendDonorMonthlyImpactEmail`.
Safety: no prosperity promises, no urgency, no crisis-flow fundraising. Caller suppresses donor emails for open crisis cases. Tax-deductibility disclosure is included until 501(c)(3) status is granted.

## Universal Rules

- Pastoral tone. No guilt, urgency, prosperity language, or outcome promises.
- Email bodies target 120-220 words where practical; long caller-supplied reflections are compacted with a web CTA.
- Every HTML body contains `{{unsubscribeUrl}}`; `sendEmail` and lifecycle send helpers substitute it before Resend sends.
- Every email has a plain-text alternative.
- Subject lines should stay under 60 characters.
- No images by default.
- Re-use `shell()` from `_shell.ts`; do not redefine the wrapper in flow files.
- Ask Hope is the chat product. Do not use it as the name for journeys, digests, or devotionals.
