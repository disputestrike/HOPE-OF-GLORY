# Hope of Glory Ministry — Launch Asset Checklist

> Every brand asset required for launch, with exact dimensions, formats, and source-of-truth notes. Sized to current 2026 platform specs.

Conventions used in this document:

- All raster exports: PNG-24 unless noted. SVG for icons and lockups when supported. JPG (q=85) for photographic content where file weight matters.
- `Primary lockup` = Concept A (Radiant Cross Over Horizon).
- `Glyph mark` = Concept B medallion or Concept A cross-only variant, depending on context (see notes per asset).
- `Wordmark only` = Concept C pure wordmark.
- Color always references the locked palette in `visual-style-guide.md`.

---

## 1. Favicon family

| File | Dimensions | Format | Contents |
|---|---|---|---|
| `favicon.ico` | 16×16, 32×32, 48×48 multi-resolution | ICO | Glyph mark (cross-only or medallion) on Midnight Navy |
| `favicon-16x16.png` | 16×16 | PNG-24 | Glyph mark on Midnight Navy |
| `favicon-32x32.png` | 32×32 | PNG-24 | Glyph mark on Midnight Navy |
| `favicon-48x48.png` | 48×48 | PNG-24 | Glyph mark on Midnight Navy |
| `favicon-96x96.png` | 96×96 | PNG-24 | Glyph mark on Midnight Navy |
| `favicon-192x192.png` | 192×192 | PNG-24 | Glyph mark on Midnight Navy (PWA Android) |
| `favicon-512x512.png` | 512×512 | PNG-24 | Glyph mark on Midnight Navy (PWA splash) |
| `favicon.svg` | viewBox 0 0 64 64 | SVG | Glyph mark, monochrome gold + dark, supports prefers-color-scheme |
| `safari-mask-icon.svg` | viewBox 0 0 64 64 | SVG monochrome | Single-color mask icon for Safari pinned tab |

Notes:
- Below 48px, drop the horizon line (Concept A) and render the cross with thicker stroke for legibility.
- Test against both light and dark browser chrome.

---

## 2. Apple touch icons

| File | Dimensions | Format | Contents |
|---|---|---|---|
| `apple-touch-icon.png` | 180×180 | PNG-24 | Glyph mark on Deep Heaven Blue, 12px radius bleed (iOS auto-masks) |
| `apple-touch-icon-152.png` | 152×152 | PNG-24 | Same |
| `apple-touch-icon-167.png` | 167×167 | PNG-24 | Same (iPad Pro) |
| `apple-touch-icon-120.png` | 120×120 | PNG-24 | Same |

Notes:
- Do NOT round corners in the source — iOS rounds them.
- Do NOT add transparency — iOS replaces with black.

---

## 3. Web manifest + PWA

| File | Dimensions | Format | Contents |
|---|---|---|---|
| `manifest.webmanifest` | — | JSON | Theme color `#0B1F3A`, background `#050B18` |
| `pwa-192.png` | 192×192 | PNG-24 | Glyph + wordmark stacked, on Deep Heaven Blue |
| `pwa-512.png` | 512×512 | PNG-24 | Glyph + wordmark stacked, on Deep Heaven Blue |
| `pwa-maskable-512.png` | 512×512 | PNG-24 | Glyph centered with 20% safe-zone padding (maskable spec) |

---

## 4. OG / Twitter card image

| File | Dimensions | Format | Contents |
|---|---|---|---|
| `og-default.jpg` | 1200×630 | JPG q=88 | Sunrise-over-earth photographic background + primary lockup overlay + tagline |
| `og-square.jpg` | 1200×1200 | JPG q=88 | Same composition reframed square for X / LinkedIn fallbacks |
| `twitter-card.jpg` | 1200×675 | JPG q=88 | 16:9 variant (closest to Twitter recommended) |
| `og-article-template.psd` / `.fig` | 1200×630 | layered | Editable template for article-specific OG images |

Notes:
- OG image safe-zone: keep text inside the centered 1080×540 area (10% padding all sides) — some platforms crop.
- Avoid sub-16px equivalent text in the OG image.

---

## 5. Social profile pictures (avatars)

All profile pictures use the **glyph mark** (Concept B medallion preferred for circular crops; Concept A favicon variant acceptable). Background: Deep Heaven Blue. Foreground: Glory Gold. Always centered with ~12% safe-zone padding because most platforms apply circular crops.

| Platform | File | Source size | Displayed | Format |
|---|---|---|---|---|
| YouTube | `avatar-youtube.png` | 800×800 | 98×98 cropped circular | PNG-24 |
| Instagram | `avatar-instagram.png` | 720×720 | 110×110 cropped circular | PNG-24 |
| Facebook | `avatar-facebook.png` | 720×720 | 170×170 cropped circular | PNG-24 |
| TikTok | `avatar-tiktok.png` | 400×400 | 200×200 cropped circular | PNG-24 |
| X (Twitter) | `avatar-x.png` | 400×400 | 400×400 cropped circular | PNG-24 |
| LinkedIn (org page) | `avatar-linkedin.png` | 400×400 | 300×300 cropped square w/ slight rounding | PNG-24 |
| BlueSky | `avatar-bluesky.png` | 1000×1000 | cropped circular | PNG-24 |
| Substack | `avatar-substack.png` | 512×512 | cropped circular | PNG-24 |
| Threads | `avatar-threads.png` | 720×720 | cropped circular | PNG-24 |
| Spotify (podcast) | `avatar-spotify.png` | 3000×3000 | 3000×3000 square (Spotify requires) | PNG-24, sRGB, < 500 KB |
| Apple Podcasts | `avatar-apple-podcasts.png` | 3000×3000 | 3000×3000 square | PNG-24, sRGB, < 500 KB |

Notes:
- Spotify and Apple Podcasts: 3000×3000 is a hard minimum spec; design composition for both circular and square crops since podcast players vary.
- Stage cohort: build a master 3000×3000 PNG and downscale to each platform.

---

## 6. Social banners / cover images

All banners: dark backgrounds (Deep Heaven Blue or Midnight Navy), photographic dawn/horizon scene, primary lockup positioned in the centered safe-zone for each platform.

| Platform | File | Size | Safe-zone notes |
|---|---|---|---|
| YouTube channel art | `banner-youtube.jpg` | 2560×1440 | TV-safe area 1546×423 centered, all-device-safe area 1235×338 centered |
| Instagram (no native banner) | — | — | Avatar only |
| Facebook page cover | `banner-facebook.jpg` | 1640×624 | Mobile-safe area 820×312 centered |
| Facebook event cover | `banner-facebook-event.jpg` | 1920×1005 | — |
| TikTok (no banner, but bio image) | `bio-image-tiktok.png` | 1080×1920 | Vertical art for linked pages |
| X (Twitter) header | `banner-x.jpg` | 1500×500 | Avatar overlaps lower-left, keep that corner clear |
| LinkedIn page cover | `banner-linkedin.jpg` | 1128×191 | Logo/avatar overlap on left, keep clear |
| LinkedIn personal cover | `banner-linkedin-personal.jpg` | 1584×396 | — |
| BlueSky banner | `banner-bluesky.jpg` | 3000×1000 | Avatar overlaps lower-left |
| Substack banner | `banner-substack.jpg` | 1184×288 | — |
| Threads (no native banner) | — | — | Avatar only |
| YouTube watermark | `watermark-youtube.png` | 150×150 | Transparent PNG, glyph only, gold on transparent |

Notes:
- Build a master 3840×1440 horizon image; reframe and export each banner from it for visual consistency across the ministry's social presence.
- All banners must accommodate the avatar overlap zone for the relevant platform (X, LinkedIn, Facebook, BlueSky).

---

## 7. Email header

| File | Dimensions | Format | Contents |
|---|---|---|---|
| `email-header.png` | 1500×500 (3:1) | PNG-24 < 200 KB | Dawn over water photographic background + primary lockup centered |
| `email-header-2x.png` | 3000×1000 | PNG-24 < 400 KB | Retina variant |
| `email-header-light.png` | 1500×500 | PNG-24 | Inverted: Warm Light background, deep blue lockup (for light-mode email clients) |
| `email-footer-mark.png` | 240×240 | PNG-24 | Small glyph mark for email footer signatures |

Notes:
- Email images must be < 200 KB to avoid Gmail clipping at 102 KB total body weight in many clients — but the header image itself can be larger; it loads from URL.
- Always include `alt="Hope of Glory Ministry"`.
- Use the same `email-header.png` across daily devotionals to build visual recognition.

---

## 8. Sermon card templates

| File | Dimensions | Format | Aspect | Use |
|---|---|---|---|---|
| `sermon-card-square.fig` / `.psd` | 2160×2160 | layered | 1:1 | Instagram feed, Facebook, blog cover |
| `sermon-card-landscape.fig` / `.psd` | 3840×2160 | layered | 16:9 | YouTube thumbnail, OG image |
| `sermon-card-vertical.fig` / `.psd` | 2160×3840 | layered | 9:16 | Reels, Shorts, TikTok, Stories |

Each template includes:
- Photographic background slot (drop image from `image-prompts.md` set)
- 18% opacity Deep Heaven Blue overlay for text legibility
- Sermon title (Cormorant Garamond SemiBold)
- Series name eyebrow (Inter uppercase, Glory Gold)
- Speaker line (Inter, Warm Light, optional)
- Date (Inter small, Warm Light, optional)
- Logo watermark in lower-right at 20% opacity

Notes:
- Export final cards as JPG q=88 for delivery (< 500 KB target).
- For YouTube thumbnails specifically, export at 1280×720 JPG q=85 to stay under YouTube's 2 MB cap.

---

## 9. Scripture card templates

| File | Dimensions | Format | Aspect | Use |
|---|---|---|---|---|
| `scripture-card-square.fig` / `.psd` | 2160×2160 | layered | 1:1 | Instagram, Facebook, Pinterest |
| `scripture-card-vertical.fig` / `.psd` | 2160×3840 | layered | 9:16 | Reels, Shorts, Stories, TikTok |
| `scripture-card-landscape.fig` / `.psd` | 3840×2160 | layered | 16:9 | Email pull-quote, YouTube interstitial |

Each template includes:
- Photographic background slot (from Scripture-card image set in `image-prompts.md` items 7–16)
- Centered Scripture in Cormorant Garamond italic SemiBold, Warm Light
- Top and bottom thin gold rule, 3rem from text
- Scripture reference in Inter uppercase, Glory Gold, +120 tracking
- Small logo glyph at lower-center, 18% opacity

Notes:
- Max line length for scripture: 22 characters (display) or 52 characters (block).
- Always include a translation tag in the reference line (e.g., `JOHN 1 : 14 · ESV`).

---

## 10. Live stream overlay templates

| File | Dimensions | Format | Use |
|---|---|---|---|
| `livestream-backdrop-1.png` | 1920×1080 | PNG-24 | Royal Hall I (`image-prompts.md` item 22) |
| `livestream-backdrop-2.png` | 1920×1080 | PNG-24 | Dawn arched window (item 23) |
| `livestream-backdrop-3.png` | 1920×1080 | PNG-24 | Quiet study with lamp (item 24) |
| `livestream-backdrop-4.png` | 1920×1080 | PNG-24 | Royal Hall II (item 25) |
| `livestream-backdrop-5.png` | 1920×1080 | PNG-24 | Dawn over distant mountains (item 26) |
| `lower-third.png` | 1920×1080 | PNG-32 (transparent) | Lower-third graphic: thin gold rule + speaker name (Inter uppercase) + role |
| `lower-third-scripture.png` | 1920×1080 | PNG-32 (transparent) | Lower-third for displaying current Scripture being read |
| `bug-corner.png` | 1920×1080 | PNG-32 (transparent) | Corner bug: glyph + "HOPE OF GLORY" wordmark, lower-right |
| `bug-corner-live.png` | 1920×1080 | PNG-32 (transparent) | Same with `LIVE` indicator in Blood Crimson (sparing use) |
| `intro-card.mp4` | 1920×1080, 6s, 30fps, ProRes 422 | MP4 (H.264 mezzanine) | Fade-in primary lockup over photographic dawn |
| `outro-card.mp4` | 1920×1080, 8s, 30fps | MP4 | Outro: thank-you message + Hope Line + give CTA + glyph |
| `transition-fade.mp4` | 1920×1080, 1.5s | MP4 alpha | Gentle gold-cross-fade transition between segments |
| `scripture-interstitial.mp4` | 1920×1080, 8s | MP4 | Scripture display interstitial card (read-aloud overlay) |
| `holding-slide.png` | 1920×1080 | PNG-24 | "We are starting shortly" slide, primary lockup + Cormorant tagline |
| `praying-slide.png` | 1920×1080 | PNG-24 | "We are praying now" slide with gentle gold candle motif |

Notes:
- Provide 4K variants (`-4k.png` at 3840×2160) for ministry events that stream to YouTube in 4K.
- For OBS: provide a Streamer Studio scene-collection JSON template with sources pre-wired (delivered separately).

---

## 11. Document templates

| File | Dimensions | Format | Use |
|---|---|---|---|
| `sermon-notes-template.docx` | US Letter | Word | Sermon notes template for downloads from sermon pages |
| `sermon-notes-template.pdf` | US Letter | PDF | Same, flat |
| `study-guide-template.docx` | US Letter | Word | Multi-week study guide template |
| `letterhead.docx` | US Letter | Word | Official ministry letterhead |
| `slide-deck-template.pptx` / `.key` | 1920×1080 | PowerPoint / Keynote | Speaking + teaching slide deck template |

---

## 12. Print collateral (later phase, scaffold now)

| File | Dimensions | Format | Use |
|---|---|---|---|
| `business-card.pdf` | 3.5×2 inch (1050×600 @ 300dpi + 0.125" bleed) | PDF/X-1a | Founder + team cards |
| `tract-trifold.pdf` | 8.5×11 trifold | PDF/X-1a | Gospel tract for distribution |
| `bookmark.pdf` | 2×6 inch | PDF/X-1a | Scripture bookmark giveaway |
| `poster-18x24.pdf` | 18×24 inch | PDF/X-1a | Speaking event poster |

---

## 13. Audio + podcast art

| File | Dimensions | Format | Use |
|---|---|---|---|
| `podcast-cover.png` | 3000×3000 | PNG-24, sRGB, < 500 KB | Apple Podcasts + Spotify primary cover |
| `podcast-cover-episode.psd` / `.fig` | 3000×3000 | layered | Per-episode cover template |
| `podcast-clip-square.fig` | 1080×1080 | layered | Audiogram square — waveform on Deep Heaven Blue |
| `podcast-clip-vertical.fig` | 1080×1920 | layered | Audiogram vertical for Reels / Shorts / TikTok |

---

## 14. Brand source files

| File | Format | Contents |
|---|---|---|
| `brand-master.fig` | Figma | Single source of truth: palette, type, lockups, all templates |
| `brand-master.afdesign` / `.psd` | Affinity / Photoshop | Backup raster source |
| `logo-system.ai` / `.svg` | Adobe Illustrator / SVG | Vector source for all three logo concepts and their variants |
| `palette.ase` | Adobe Swatch Exchange | Importable swatch file |
| `palette.clr` | macOS Color Picker palette | For desktop apps |
| `palette.css` / `.scss` / `.json` | CSS / SCSS / JSON design-tokens | Code-side source of truth |
| `fonts/` | OTF + WOFF2 self-hosted | Cormorant Garamond + Inter (license-cleared) |

---

## 15. Pre-launch QA checklist

- [ ] Favicons display correctly in Chrome, Safari, Firefox, Edge (light + dark themes)
- [ ] Apple touch icon renders cleanly on iOS home screen (no white halo)
- [ ] PWA install icon appears correctly on Android
- [ ] OG image displays correctly on Facebook, X, LinkedIn, Slack, Discord, iMessage (use opengraph.xyz to verify)
- [ ] All social avatars survive circular crop without losing the mark
- [ ] All social banners reserve safe zones for platform-specific avatar overlap
- [ ] Email header renders correctly in Gmail, Outlook 365, Apple Mail, iOS Mail, Yahoo
- [ ] Email header renders without distortion at Outlook's automatic image-scaling
- [ ] Livestream overlays preview correctly in OBS at 1080p and 4K
- [ ] All exported imagery has been reviewed against `visual-style-guide.md` section 9 forbidden-imagery list
- [ ] All photographic assets pass: no realistic faces of fictional preachers, no depictions of Jesus' face, no scary/violent Revelation imagery, no money/currency on Give pages
- [ ] Color profile is sRGB on all exports (not Adobe RGB, not Display P3)
- [ ] All text in images uses brand typography (Cormorant + Inter only)
- [ ] All brand source files committed to private brand repo with semantic version tags
