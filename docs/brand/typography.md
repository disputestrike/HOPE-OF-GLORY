# Hope of Glory Ministry — Typography

> Exact CSS-ready specifications. All sizes in `rem` (root = 16px). Mobile and desktop values for every role.

---

## 1. Font stacks

```css
:root {
  --font-display: 'Cormorant Garamond', 'Merriweather', 'EB Garamond',
                  'Times New Roman', serif;
  --font-body:    'Inter', 'Source Sans 3', -apple-system,
                  BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
}
```

**Loading recommendation (self-hosted or Google Fonts):**

- Cormorant Garamond: weights 400, 500, 600 + italic 400, 500
- Inter: weights 400, 500, 600, 700
- Subset to Latin Extended for now; add Greek + Hebrew when biblical-language content ships

---

## 2. Type scale tokens

```css
:root {
  /* Mobile defaults (< 768px) */
  --fs-h1:        2.25rem;   /* 36px */
  --fs-h2:        1.75rem;   /* 28px */
  --fs-h3:        1.375rem;  /* 22px */
  --fs-h4:        1rem;      /* 16px */
  --fs-body:      1rem;      /* 16px */
  --fs-body-lg:   1.125rem;  /* 18px */
  --fs-small:     0.875rem;  /* 14px */
  --fs-xs:        0.75rem;   /* 12px */
  --fs-scripture-display: 1.875rem; /* 30px */
  --fs-scripture-inline:  1.125rem; /* 18px */
  --fs-scripture-ref:     0.75rem;  /* 12px */
  --fs-button:    0.9375rem; /* 15px */
  --fs-nav:       0.875rem;  /* 14px */
  --fs-footer:    0.875rem;  /* 14px */
}

@media (min-width: 768px) {
  :root {
    /* Desktop overrides (>= 768px) */
    --fs-h1:        3.75rem;   /* 60px */
    --fs-h2:        2.75rem;   /* 44px */
    --fs-h3:        1.875rem;  /* 30px */
    --fs-h4:        1.0625rem; /* 17px */
    --fs-body:      1.0625rem; /* 17px */
    --fs-body-lg:   1.25rem;   /* 20px */
    --fs-small:     0.9375rem; /* 15px */
    --fs-xs:        0.8125rem; /* 13px */
    --fs-scripture-display: 3rem;     /* 48px */
    --fs-scripture-inline:  1.25rem;  /* 20px */
    --fs-scripture-ref:     0.8125rem; /* 13px */
    --fs-button:    1rem;      /* 16px */
    --fs-nav:       0.9375rem; /* 15px */
    --fs-footer:    0.9375rem; /* 15px */
  }
}
```

---

## 3. Role specifications

### 3.1 H1 — display headline

```css
.h1, h1 {
  font-family: var(--font-display);
  font-weight: 600;
  font-style: normal;
  font-size: var(--fs-h1);
  line-height: 1.1;
  letter-spacing: -0.01em;
  color: var(--warm-light);
  text-wrap: balance;
  max-width: 22ch;
}
```

| Breakpoint | Size | Line-height | Letter-spacing |
|---|---|---|---|
| Mobile | 2.25rem (36px) | 1.1 (39.6px) | -0.01em |
| Desktop | 3.75rem (60px) | 1.1 (66px) | -0.01em |

Use only once per page. Hero only.

---

### 3.2 H2 — section headline

```css
.h2, h2 {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: var(--fs-h2);
  line-height: 1.15;
  letter-spacing: -0.005em;
  color: var(--warm-light);
  text-wrap: balance;
  max-width: 28ch;
}
```

| Breakpoint | Size | Line-height | Letter-spacing |
|---|---|---|---|
| Mobile | 1.75rem (28px) | 1.15 (32.2px) | -0.005em |
| Desktop | 2.75rem (44px) | 1.15 (50.6px) | -0.005em |

---

### 3.3 H3 — subsection headline

```css
.h3, h3 {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: var(--fs-h3);
  line-height: 1.25;
  letter-spacing: 0;
  color: var(--warm-light);
  text-wrap: balance;
  max-width: 36ch;
}
```

| Breakpoint | Size | Line-height | Letter-spacing |
|---|---|---|---|
| Mobile | 1.375rem (22px) | 1.25 (27.5px) | 0 |
| Desktop | 1.875rem (30px) | 1.25 (37.5px) | 0 |

---

### 3.4 H4 — overline / eyebrow

```css
.h4, h4 {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: var(--fs-h4);
  line-height: 1.4;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--glory-gold);
}
```

| Breakpoint | Size | Line-height | Letter-spacing |
|---|---|---|---|
| Mobile | 1rem (16px) | 1.4 (22.4px) | 0.16em |
| Desktop | 1.0625rem (17px) | 1.4 (23.8px) | 0.16em |

Used as eyebrow text above an H1/H2/H3. Always Glory Gold.

---

### 3.5 Body

```css
.body, p {
  font-family: var(--font-body);
  font-weight: 400;
  font-size: var(--fs-body);
  line-height: 1.65;
  letter-spacing: 0;
  color: var(--warm-light);
  max-width: 68ch;
}

.body--lg {
  font-size: var(--fs-body-lg);
  line-height: 1.6;
}

.body--emphasis,
strong, b {
  font-weight: 500;
  color: var(--warm-light);
}

em, i {
  font-style: italic;
  font-weight: 400;
}
```

| Breakpoint | Body size | Body line-height | Body-lg size |
|---|---|---|---|
| Mobile | 1rem (16px) | 1.65 (26.4px) | 1.125rem (18px) |
| Desktop | 1.0625rem (17px) | 1.65 (28.05px) | 1.25rem (20px) |

---

### 3.6 Small + extra-small

```css
.small, small {
  font-family: var(--font-body);
  font-weight: 400;
  font-size: var(--fs-small);
  line-height: 1.55;
  letter-spacing: 0.005em;
  color: var(--warm-light);
  opacity: 0.85;
}

.xs {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: var(--fs-xs);
  line-height: 1.5;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--glory-gold);
}
```

| Role | Mobile | Desktop | Line-height |
|---|---|---|---|
| `.small` | 0.875rem (14px) | 0.9375rem (15px) | 1.55 |
| `.xs` | 0.75rem (12px) | 0.8125rem (13px) | 1.5 |

---

### 3.7 Scripture display (block-quote on sermon/Scripture cards)

```css
.scripture-display {
  font-family: var(--font-display);
  font-weight: 500;
  font-style: italic;
  font-size: var(--fs-scripture-display);
  line-height: 1.3;
  letter-spacing: 0;
  color: var(--warm-light);
  text-wrap: balance;
  text-align: center;
  max-width: 22ch;
  margin-inline: auto;
}

.scripture-display::before,
.scripture-display::after {
  content: '';
  display: block;
  width: 3rem;
  height: 1px;
  background: var(--glory-gold);
  margin-inline: auto;
  margin-block: 1.5rem;
}
```

| Breakpoint | Size | Line-height | Max-width |
|---|---|---|---|
| Mobile | 1.875rem (30px) | 1.3 (39px) | 22ch |
| Desktop | 3rem (48px) | 1.3 (62.4px) | 22ch |

---

### 3.8 Scripture inline (verse appearing in body copy)

```css
.scripture-inline {
  font-family: var(--font-display);
  font-weight: 500;
  font-style: italic;
  font-size: var(--fs-scripture-inline);
  line-height: 1.55;
  letter-spacing: 0;
  color: var(--warm-light);
  border-left: 2px solid var(--glory-gold);
  padding-left: 1rem;
  margin-block: 1.5rem;
  max-width: 60ch;
}
```

| Breakpoint | Size | Line-height |
|---|---|---|
| Mobile | 1.125rem (18px) | 1.55 |
| Desktop | 1.25rem (20px) | 1.55 |

---

### 3.9 Scripture reference

```css
.scripture-ref {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: var(--fs-scripture-ref);
  line-height: 1.4;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--glory-gold);
  margin-top: 1rem;
  display: block;
  text-align: center;
}
```

| Breakpoint | Size | Letter-spacing |
|---|---|---|
| Mobile | 0.75rem (12px) | 0.12em |
| Desktop | 0.8125rem (13px) | 0.12em |

Example: `JOHN 1 : 14`

---

### 3.10 Button

```css
.btn {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: var(--fs-button);
  line-height: 1;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.875rem 1.75rem;
  border-radius: 2px;
}

.btn--primary {
  background: var(--glory-gold);
  color: var(--midnight-navy);
  border: 1px solid var(--glory-gold);
}

.btn--secondary {
  background: transparent;
  color: var(--glory-gold);
  border: 1px solid var(--glory-gold);
}

.btn--ghost {
  background: transparent;
  color: var(--warm-light);
  border: 1px solid var(--warm-light);
  opacity: 0.8;
}
```

| Breakpoint | Size | Letter-spacing |
|---|---|---|
| Mobile | 0.9375rem (15px) | 0.1em |
| Desktop | 1rem (16px) | 0.1em |

---

### 3.11 Navigation

```css
.nav-link {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: var(--fs-nav);
  line-height: 1;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--warm-light);
  text-decoration: none;
  transition: color 200ms ease;
}

.nav-link:hover,
.nav-link[aria-current='page'] {
  color: var(--glory-gold);
}
```

| Breakpoint | Size | Letter-spacing |
|---|---|---|
| Mobile | 0.875rem (14px) | 0.16em |
| Desktop | 0.9375rem (15px) | 0.16em |

---

### 3.12 Footer

```css
.footer,
.footer p,
.footer a {
  font-family: var(--font-body);
  font-weight: 400;
  font-size: var(--fs-footer);
  line-height: 1.6;
  letter-spacing: 0.005em;
  color: var(--warm-light);
  opacity: 0.75;
}

.footer a:hover {
  color: var(--glory-gold);
  opacity: 1;
}

.footer-heading {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: var(--fs-xs);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--glory-gold);
  margin-bottom: 1rem;
}
```

| Breakpoint | Size | Line-height |
|---|---|---|
| Mobile | 0.875rem (14px) | 1.6 |
| Desktop | 0.9375rem (15px) | 1.6 |

---

## 4. Vertical rhythm

Base line-height for body is 1.65. All vertical spacing should snap to the 8pt scale defined in `visual-style-guide.md` section 4.1.

```css
:root {
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-24: 6rem;
  --space-32: 8rem;
  --space-48: 12rem;
}

/* Vertical spacing between heading + following body */
h1 + p, h2 + p, h3 + p { margin-top: var(--space-4); }

/* Section separation */
section + section { margin-top: var(--space-24); }
@media (max-width: 767px) {
  section + section { margin-top: var(--space-12); }
}
```

---

## 5. OpenType features

```css
html {
  font-feature-settings:
    'kern' 1,
    'liga' 1,
    'calt' 1,
    'ss01' 1;
  font-variant-numeric: oldstyle-nums proportional-nums;
}

.scripture-display,
.scripture-inline,
h1, h2, h3 {
  font-feature-settings:
    'kern' 1,
    'liga' 1,
    'dlig' 1,
    'swsh' 0;
}

.scripture-ref,
.nav-link,
.btn,
.h4,
.xs {
  font-variant-numeric: lining-nums tabular-nums;
}
```

---

## 6. Accessibility

- Minimum body size: 16px on mobile (we use 16–17px).
- Minimum interactive target: 44×44px (buttons reach this via padding).
- Color contrast: Warm Light (`#FFF8E7`) on Deep Heaven Blue (`#0B1F3A`) yields ~14:1 — exceeds WCAG AAA for normal text.
- Glory Gold (`#D4AF37`) on Deep Heaven Blue yields ~7.3:1 — passes WCAG AAA for large text and AA for normal text. **Do not use Glory Gold for body text** — use it only for headings, accents, and large UI.
- Provide `prefers-reduced-motion` overrides for any animated text.
- Always use semantic heading order (no skipping levels).
- `text-wrap: balance` is progressive enhancement; falls back gracefully.

---

## 7. Print

```css
@media print {
  body {
    color: var(--midnight-navy);
    background: var(--warm-light);
  }
  h1, h2, h3 { color: var(--midnight-navy); }
  .scripture-display,
  .scripture-inline { color: var(--midnight-navy); }
  .h4, .xs, .scripture-ref { color: #6b5a1c; /* darkened gold for paper */ }
}
```
