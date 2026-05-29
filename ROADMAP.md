# Hope of Glory — Expansion Roadmap (post-master-brief)

This document tracks the master-instruction expansion on top of the 13-phase build.

## Locked product names (preserve exactly)

- **Ask Hope** - the AI Scripture-and-prayer chat product.
- **Read** — the canonical knowledge library
- **Come to Christ** — the primary conversion page
- **Give Your Life to Jesus** — primary CTA
- **Pray With Me** — prayer entry
- **Start the 40-Day Hope of Glory Journey** — discipleship pathway
- **Daily Faith** — long-term daily rhythm
- **Word, Prayer, and Power** — hub
- **Christ in All Scripture** — hub
- **What the World Needs** — hub
- **Hope for the Human Heart** — hub
- **Need Help Today?** — persistent banner
- **Messages** — sermons / teachings / studies / prayers hub
- **Hope Line** — phone ministry
- **Support the Mission** — give

## Locked navigation

Header (primary): **Come to Christ · Start the 40-Day Hope of Glory Journey · Ask Hope · Read · Daily Faith · Messages · Help · Give**

## Locked homepage order (18 sections)

1. Come to Christ / Sinner's Prayer
2. Start the 40-Day Journey
3. Ask Hope
4. Daily Word / Daily Faith
5. What the World Needs
6. Life's Biggest Questions
7. The Gospel
8. Christ in All Scripture
9. The Holy Spirit and New Birth
10. Prayer, Healing, and the Word
11. Following Jesus in Real Life
12. Worship, Love, and Obedience
13. The Church and Discipleship
14. Nations, Unity, and Glory
15. Apologetics and Hard Questions
16. Hope for the Human Heart
17. Need Help Today?
18. Support the Mission

## Batches

### Batch 1 — Brand, nav, primary conversion, Help triage, SEO foundation (this batch)

- Header / Footer with new structure
- `/come-to-christ` — the gospel page with sinner's prayer
- `/sinners-prayer`, `/how-can-i-be-saved`, `/what-happens-after-i-pray`, `/new-believer-next-steps`
- `/ask` - new primary chat route; `/scroll` redirects to `/ask`
- `AskHopeChat` component
- `/api/ask` - primary endpoint; `/api/scroll` kept for back-compat
- `NeedHelpBanner` — persistent help affordance
- `/help` — overview
- `/help/crisis-resources` — 988, 911, 211, IASP, Befrienders, HUD Find Shelter, SAMHSA
- `Breadcrumbs` component
- `StructuredData` components (Organization, Article, BreadcrumbList)
- `/sitemap.ts`, `/robots.ts`
- Home page rewrite with 18-section order

### Batch 2 — Read library + hubs (next)

- `/read` overview
- All 12 topic hubs with their full sub-page lists

### Batch 3 — Help/[topic] dynamic system (next)

- All `/help/suicide`, `/help/grief`, etc. pages
- Help topic data with crisis-aware content

### Batch 4 — Messages hub + sub-routes

- `/messages`, `/messages/daily-word`, `/messages/sermons`, etc.

### Batch 5 — 40-Day Journey + Daily Faith pathways

- `/journey/40-day` overview + per-day pages
- `/daily-faith` overview
- Rewrite of new-believer flow to extend from 30 → 40 days

### Batch 6 — Engagement (Amen / Helpful / Save / Share / Download)

- Component + API + schema additions

### Batch 7 — Legal & policy pages

- `/community-guidelines`, `/crisis-disclaimer`, `/doctrinal-basis`, `/cookies`, `/disclaimer`

### Batch 8 — Multilingual hreflang scaffold

- Per-page `Alternate` metadata + sitemap variants

### Batch 9 — Donation expansion (Give Once / Give Monthly)

- Refresh of `/give` to match Donor Bill of Rights

### Batch 10 — Hope Line phone-menu update

- Reorder to: 1. Give your life to Jesus · 2. Pray with me · 3. Ask a Bible question · 4. I am suffering · 5. Overcoming sin · 6. Today's message · 7. Crisis resources

## What this does NOT change

- Doctrine documents (locked)
- Agent prompts (locked, but Ask Hope prompts get refreshed in Batch 2)
- Database schema (still solid)
- AI gateway routing (still solid)
- Brand palette / typography (already aligned with the brief)
