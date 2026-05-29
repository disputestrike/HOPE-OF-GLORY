# Hope of Glory Ministry — Visual Style Guide

> The visible voice of a Christ-centered, AI-native media ministry.
> Reverent. Luminous. Scriptural. Royal.

---

## 1. Brand essence

| Pillar | Description |
|---|---|
| Reverent | We design for the King. Whitespace, dignity, no clutter. |
| Luminous | Light is the visual hero. Gold on deep blue, dawn over horizon. |
| Scriptural | Every motif traces to a verse — light, water, mountain, sky, vineyard, dove, crown, throne, cross. |
| Royal | Christ is enthroned. Deep blue + gold is the visual translation of psalmist kingship. |

**We are not:** trendy church marketing, hipster Christianity, distressed grunge, watercolor cottage-core, cartoon clip-art, megachurch swooshes, neon worship-night posters, AI-generated cheese.

---

## 2. Color system

### 2.1 Palette tokens

| Token | Hex | RGB | When |
|---|---|---|---|
| `--glory-gold` | `#D4AF37` | 212, 175, 55 | Primary accent. Logo, headlines, divider lines, highlight strokes, CTA outlines. |
| `--deep-heaven-blue` | `#0B1F3A` | 11, 31, 58 | Primary background for marketing, video, social. Default canvas. |
| `--midnight-navy` | `#050B18` | 5, 11, 24 | Reverse-context background, late-night devotional, footer fills, OG image backdrop. |
| `--warm-light` | `#FFF8E7` | 255, 248, 231 | Primary text on dark; primary background for reading-heavy contexts (Scripture pages, longform). |
| `--blood-crimson` | `#8A1C1C` | 138, 28, 28 | **Sparing.** Communion, cross-references, Good Friday, Hope Line urgency. Never as primary fill. Max one occurrence per layout. |
| `--living-olive` | `#556B2F` | 85, 107, 47 | **Secondary.** Vineyard, garden, growth, new believer paths. Never on the same surface as crimson. |

### 2.2 Combinations (allowed)

| Foreground | Background | Use |
|---|---|---|
| Glory Gold | Deep Heaven Blue | **Primary lockup.** Headlines on dark. |
| Warm Light | Deep Heaven Blue | Body copy on dark. |
| Warm Light | Midnight Navy | Reverse / OG cards / footer. |
| Deep Heaven Blue | Warm Light | Body copy on light reading surfaces. |
| Glory Gold | Midnight Navy | Highest-contrast accents (favicon, watermark). |
| Blood Crimson | Warm Light | Communion + Good Friday surfaces only. |
| Living Olive | Warm Light | New believer content, vineyard motifs. |

### 2.3 Combinations (forbidden)

- Glory Gold on Warm Light at body-text sizes (insufficient contrast — only allowed for large display headers or accent rules at >24px)
- Blood Crimson + Living Olive on the same surface
- Any color outside the locked palette
- Gradients between palette colors (use solid fills + photographic light instead)
- Drop shadows in brand colors (shadows are always pure black at low opacity, never colored)

### 2.4 Tint / shade rules

Do not generate new colors. If you need a softer gold for a background, use `--warm-light` instead. If you need a darker blue, use `--midnight-navy`. The palette is exhaustive. No HSL math.

### 2.5 Two surfaces: dark default, warm care

The site renders on **two surfaces**, not one. Same palette, two contexts.

| Surface | Token mode | Where | Why |
|---|---|---|---|
| **Deep Heaven (default)** | `--bg: --deep-heaven`, `--fg: --warm-light` | Home, Sermons, Read, Apologetics, Ask, Give, About, Bible Study, declarative/teaching pages | The night sky of psalmist kingship. Gold-on-blue is the brand lockup. |
| **Care Surface (`.theme-warm`)** | `--bg: --warm-light`, `--fg: --deep-heaven` | `/help/*`, `/help-now`, `/come-to-christ` cluster (sinner's prayer, how-can-i-be-saved, what-happens-after-i-pray, new-believer-next-steps), `/prayer`, `/journey/30-day` (Hurting Heart), and the redirect parent `/journey/hope-for-the-hurting-heart` | Wounded readers — the grieving mother, the man in crisis, the one praying for the first time — should not land on a dark night sky. They land on a cream page that reads like a letter, not a cathedral at midnight. |

**The rule of thumb:** declarative pages (we teach, we proclaim, we explain doctrine) use Deep Heaven. Pastoral pages (we sit beside, we listen, we point gently to Christ) use Care Surface.

**Activation:** opt-in by adding `theme-warm` to the outer `<section>` class. Tokens re-bind for the subtree. The dark default is never touched.

**Token deltas between modes:**

| Token | Dark default | `.theme-warm` |
|---|---|---|
| `--bg` | `#0B1F3A` Deep Heaven | `#FFF8E7` Warm Light |
| `--bg-elevated` | `#0E2447` | `#FBEFD0` (deeper cream) |
| `--bg-deep` | `#050B18` Midnight Navy | `#F1E2B8` (warm sand) |
| `--fg` | `#FFF8E7` Warm Light | `#0B1F3A` Deep Heaven |
| `--fg-muted` | `rgba(255,248,231,0.78)` | `rgba(11,31,58,0.7)` |
| `--accent` | `#D4AF37` Glory Gold | `#D4AF37` Glory Gold (unchanged — the bridge between modes) |
| `--accent-soft` | `rgba(212,175,55,0.18)` | `rgba(212,175,55,0.18)` |
| `--border` | `rgba(212,175,55,0.22)` | `rgba(11,31,58,0.22)` |
| `--border-soft` | `rgba(255,248,231,0.12)` | `rgba(11,31,58,0.12)` |
| Eyebrow text | Gold on navy | Deep navy (gold on cream fails AA at body sizes) |
| Body text | Warm Light on navy | Deep Heaven on cream |
| `.btn--primary` | Gold fill, navy text | Gold fill, navy text (unchanged — the lockup is a constant) |
| `.btn--secondary` | Gold outline, gold text | Navy outline, navy text |
| Card background | Deep blue gradient | Cream gradient (`rgba(255,248,231,0.95)` → `rgba(251,239,208,0.85)`) |
| Card border | Soft gold | Navy at 22% (darker for contrast on cream) |
| Page wash | Deep-blue radial gradients | Warm-gold + sand radial gradients on cream |

**Crisis surfaces are exempt.** The crimson 988/911 banners, "highest priority" cards, and crisis aside on `/help/suicide` stay vivid red on both modes — they set their own border/background inline. Care Surface softens the *page*, never the *alarm*.

**Accessibility:** Deep Heaven `#0B1F3A` text on Warm Light `#FFF8E7` background tests ~13:1 — well above WCAG AA 4.5:1 and AAA 7:1 for body text.

---

## 3. Typography

See `typography.md` for full CSS-ready specs. Summary:

| Role | Family | Weight | Style |
|---|---|---|---|
| Display / H1 | Cormorant Garamond | 600 | Regular |
| H2 / H3 | Cormorant Garamond | 600 | Regular |
| H4 / overline | Inter | 600 | Uppercase, +200 tracking |
| Body | Inter | 400 | Regular |
| Body emphasis | Inter | 500 | Regular or italic |
| Scripture display | Cormorant Garamond | 500 | **Italic** |
| Scripture inline | Cormorant Garamond | 500 | Italic |
| Scripture reference | Inter | 500 | Uppercase, +120 tracking |
| Button | Inter | 600 | Uppercase, +100 tracking |
| Navigation | Inter | 500 | Uppercase, +160 tracking |
| Footer | Inter | 400 | Regular |

**Pairing principle:** Cormorant carries the eternal voice (Scripture, headlines, devotion). Inter carries the everyday voice (UI, navigation, body). Never use Cormorant for buttons, navigation, or form fields. Never use Inter for Scripture display.

**Alternates (when Cormorant unavailable):** Merriweather (web fallback). When Inter unavailable: Source Sans 3.

---

## 4. Layout, spacing, and grid

### 4.1 Spacing scale (8pt)

`0.25rem · 0.5rem · 0.75rem · 1rem · 1.5rem · 2rem · 3rem · 4rem · 6rem · 8rem · 12rem`

### 4.2 Grid

- Desktop: 12-column, 80px max gutter, 1280px max content width, 1440px max layout width
- Tablet: 8-column, 32px gutter
- Mobile: 4-column, 20px gutter, 16px outer margin

### 4.3 Density rules

- Minimum 50% whitespace on hero sections — the page must breathe
- Maximum line length for body copy: 68 characters
- Maximum line length for Scripture display: 52 characters
- Minimum vertical rhythm between sections: 6rem on desktop, 3rem on mobile
- Never set body text below 16px (1rem). Ever.

### 4.4 Alignment

- Headlines and Scripture: centered or left-aligned, never right-aligned
- Body: always left-aligned (never justified — justified text creates rivers and feels cheap)
- Captions and references: left-aligned, in Inter

---

## 5. Photography

### 5.1 Style

| Attribute | Rule |
|---|---|
| Lighting | Cinematic, directional, golden-hour or pre-dawn. Light is always the subject. |
| Palette | Dominated by Glory Gold + Deep Heaven Blue. Earth tones acceptable as supporting (sand, stone, wheat). |
| Subject | Landscape, sky, water, wilderness, mountain, vineyard, field, dawn, dusk, hands, doors, light through doorways, candles, open books. |
| Mood | Reverent, awe, silence, weight. Never frenetic. Never busy. |
| Composition | Wide negative space. Subject at horizon or rule-of-thirds. Long focal length compression where possible. |
| Faces | **No identifiable faces of fictional people.** Silhouettes, hands, backs of heads, shoulders, distant figures only. |

### 5.2 Forbidden photography

- Stock-photo Christianity (a man in a suit pointing at a Bible, a woman with her hand on her chest in worship, a "concerned counselor")
- Filter abuse (HDR, Instagram filters, vignette overload, color popping)
- Selfie / phone-camera aesthetic
- Anything that looks like a wedding photographer's portfolio
- Crying close-ups, "moved worshipper" shots, raised-hands silhouettes that have become cliché
- Doves with motion-blur wings
- Realistic faces of fictional pastors, preachers, prophets, apostles, or biblical figures
- Any depiction of Jesus' face
- Photographic crosses with sunbursts behind them (the cliché)

### 5.3 AI generation rule for photography

Every photographic prompt MUST include this canonical phrase block:

> `photographic, cinematic lighting, reverent, dignified, gold and deep blue palette`

And MUST include one of these subject-restriction phrases:

> `no people in foreground` — OR — `silhouetted figures only, no identifiable faces`

And MUST specify aspect ratio explicitly.

See `image-prompts.md` for 30 ready-to-run prompts.

---

## 6. Illustration

### 6.1 When we illustrate

Only when photography cannot carry the meaning — diagrams of doctrine, theology infographics, biblical genealogies, maps, timeline charts.

### 6.2 Style

- Single-weight line work in Glory Gold on Deep Heaven Blue
- No fills (line art only) OR flat fills in palette colors only
- Geometric precision — no hand-drawn wobble
- No characters, no faces, no figures
- Inspired by 17th-century engraving and medieval illuminated manuscript marginalia, executed with modern minimalism

### 6.3 Forbidden illustration

- Cartoon Jesus, cartoon disciples, cartoon "Bible characters"
- Hand-lettered watercolor Scripture (the entire Etsy genre)
- 3D rendered angels, doves, crowns, or crosses
- Flat illustration in non-palette colors (no teal, no coral, no mustard)
- Isometric "city of God" illustrations

---

## 7. Iconography

### 7.1 Style

- Single weight: 1.5px stroke at 24px size, scaling proportionally
- Round line caps, round joins
- 24×24 grid, 2px keyline padding
- Glory Gold on dark surfaces, Deep Heaven Blue on light surfaces
- No fills (outline only) by default
- Filled variant allowed only for selected/active state

### 7.2 Core icon set (must exist for launch)

- Cross (Latin, slender)
- Open book (Bible)
- Dove (silhouette, wings folded — not in flight)
- Lamp / lantern
- Sheaf of wheat
- Vine and branch
- Lighthouse (Hope Line)
- Open hands (palms up)
- Crown (simple three-point)
- Olive branch
- Mountain (single peak)
- Door (vertical rectangle with handle)
- Shield (heater shield, single curve)
- Sword (cruciform hilt, plain blade)
- Anchor

### 7.3 Forbidden

- Emoji-style icons
- Material Design defaults (replace them)
- Filled bubbly icons
- Icons in any non-palette color

---

## 8. Motion (video, OBS, livestream)

### 8.1 Principles

- Slow. Deliberate. Reverent. 4-second minimum on title cards.
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)` — soft entry, soft exit.
- Fades and gentle pans only. No quick cuts, no zoom-punches, no glitch effects, no "engagement" motion graphics.
- Lower-thirds slide in over 600ms and rest for the duration of the speaker beat.
- Scripture cards hold on screen for 6 seconds minimum.

### 8.2 Color grading for video

- Slight warm-shadow / cool-highlight grade
- Lift the gold tones; protect skin tones in neutral
- Crush blacks to Deep Heaven Blue, never to pure black
- Highlights roll off into Warm Light, never clip to white

---

## 9. AI image generation — global rules

These rules are non-negotiable and apply to every prompt the ministry's AI agents generate.

### 9.1 ALWAYS include

1. The canonical style phrase: `photographic, cinematic lighting, reverent, dignified, gold and deep blue palette`
2. An explicit aspect ratio
3. A subject-restriction phrase: `no people in foreground` OR `silhouetted figures only, no identifiable faces`
4. A negative prompt block (see 9.3)

### 9.2 NEVER generate

| Forbidden | Why |
|---|---|
| Realistic faces of fictional preachers, pastors, prophets, apostles | We will not put words in a manufactured human's mouth |
| Any depiction of **Jesus' face** | Reverence; theological care; the second commandment as applied |
| God the Father as a human figure | Reverence |
| The Holy Spirit as a human figure | Reverence |
| Violent or scary Revelation imagery | We teach Revelation as hope and Christ-victorious, not horror |
| Demons, devils, occult symbols | Out of scope |
| Money, cash, wallets, currency, credit cards (on the Give page or anywhere) | We do not visualize giving as transaction |
| Politicians, flags as primary subject, national/political imagery | We are a Christ-centered ministry, not a political brand |
| Cheesy worship-band stage photography | Cliché |
| Generic megachurch building exteriors | Cliché |
| Empty crosses with sunbursts behind them | Cliché |
| Praying hands in close-up (the Dürer cliché) | Cliché |

### 9.3 Canonical negative prompt block

Append to every prompt:

```
NEGATIVE: cartoon, clipart, distorted faces, deformed hands, extra fingers,
text artifacts, watermark, signature, low-resolution, blurry, oversaturated,
HDR halos, lens flare gimmicky, cheesy, stock photo, megachurch stage,
worship band, drum kit, electric guitar, glitter, neon, occult symbols,
demonic imagery, scary, violent, blood, money, currency, wallet, credit
card, political flag, politician, realistic face of pastor, realistic
face of preacher, depiction of Jesus' face, depiction of God the Father,
human figure for Holy Spirit, dove with motion blur, praying hands
close-up, hand-drawn watercolor, distressed grunge texture, vintage
filter, instagram filter, selfie aesthetic.
```

### 9.4 Aspect ratio cheat sheet

| Use | Ratio |
|---|---|
| Homepage hero, desk heroes, livestream backdrop, OG image | `16:9` |
| Sermon card, Scripture card, social square | `1:1` |
| Reels, Shorts, TikTok, Scripture vertical | `9:16` |
| Email header | `3:1` (e.g. 1500×500) |
| Favicon (final crop) | `1:1` |

---

## 10. Tone-of-voice quick check (so design and copy match)

Headlines should feel like one of these registers, never the others:

| Yes | No |
|---|---|
| Psalmist | Sales copy |
| Prophetic-pastoral | Influencer-confessional |
| Quiet authority | Hype |
| Confident in Christ | Confident in the ministry |
| Old-souled | Trend-chasing |
| Verse-anchored | Vague-spiritual |

---

## 11. Application examples (use these as visual checkpoints)

- **Homepage hero:** sunrise over earth, light filling horizon, awe; H1 in Cormorant on Deep Heaven Blue; gold hairline divider; single sentence subhead in Warm Light Inter.
- **Sermon card:** square; abstract luminous background (one of the five sermon card images); centered Scripture display in Cormorant italic; reference in Inter uppercase; tiny logo watermark bottom-right.
- **Daily devotional email:** email header (3:1 dawn image with overlaid wordmark); H2 in Cormorant; body in Inter; pull-quote scripture in Cormorant italic centered with gold hairline above and below.
- **Live stream:** Deep Heaven Blue backdrop with subtle gold ornament; lower-third in Inter uppercase; Scripture interstitial card in Cormorant italic.

---

## 12. Governance

- The palette is locked. No additions, no substitutions, no "for this campaign only" exceptions.
- The typography is locked. No "fun" display fonts. No script faces.
- The forbidden-imagery list is locked. If an asset request would require violating it, escalate rather than ship a workaround.
- Every AI-generated image must pass the rules in section 9 before publication. The default answer to "can we just this once?" is no.
