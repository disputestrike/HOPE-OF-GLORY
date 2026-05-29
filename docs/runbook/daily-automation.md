# Daily Automation Runbook

This is the operational map for how Hope of Glory Ministry publishes something new each day.

## Current preview behavior

Before production credentials are added, the site uses `apps/web/src/data/launch-schedule.ts` as the launch backbone. That one file feeds:

- `/sermons` and individual sermon pages
- `/messages/daily-word`
- `/daily-faith`
- `/admin`
- `/admin/calendar`
- `/admin/social`
- `/admin/email`

This means the site does not look empty while the database, API keys, PayPal, Postiz, SignalWire, Deepgram, and Resend accounts are still being configured.

## Daily production sequence

1. **05:30 CT - Calendar Agent**
   - Reads the sermon calendar from the database.
   - Selects the item scheduled for today.
   - Outputs the sermon brief, Daily Word seed, email subject, and social brief.

2. **06:00 CT - Sermon Pipeline**
   - Drafts or loads the sermon.
   - Checks scripture references.
   - Runs doctrine/safety review.
   - Attaches the approved image or media prompt.
   - Publishes the sermon page when status is `published` or `ready`.

3. **06:15 CT - Daily Faith Agent**
   - Builds the six Daily Faith modules:
     - Today's Scripture
     - Today's Prayer
     - Today's Message
     - Today's Question
     - Today's Obedience Step
     - Today's Share
   - Sends the payload to the website and email template layer.

4. **07:00 CT - Image and Video Agents**
   - Create or attach sermon art.
   - Prepare captions, clips, and visual cards.
   - Place assets in the media review queue.

5. **09:00 CT - Posting Agent**
   - Sends platform-specific posts to Postiz.
   - Platforms: Facebook, Instagram, X, YouTube Shorts, LinkedIn.
   - Stores status and URLs in the social queue.

6. **All day - Care Agents**
   - Ask Hope questions, prayer requests, contacts, calls, and crisis flags flow into admin queues.
   - Crisis and high-risk items are surfaced for human review.

## Credential gates

These features are intentionally credential-gated:

- **Resend:** live email sending
- **Postiz:** social posting
- **PayPal:** donation processing
- **SignalWire + Deepgram:** Hope Line phone ministry
- **LLM providers:** live sermon/image/video generation
- **Database:** persistent logs, queues, engagement, donations, calls, and contacts

The UI shows the queues and fallback launch content now; live external actions begin only after credentials are configured.

