/**
 * Shared shell + style primitives for lifecycle templates.
 *
 * Mirrors the exact markup of `shell()` in `packages/email/src/templates.ts`
 * so all lifecycle emails are visually identical to the three existing
 * templates (dailyDevotional, prayerReceived, newBelieverWelcome).
 *
 * Do not redefine the wrapper in individual template files — always import
 * `shell` from here.
 */

export const BASE_STYLE = `
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, system-ui, sans-serif;
  color: #FFF8E7;
  background: #0B1F3A;
  line-height: 1.6;
`;

/** Wrap inner email body markup in the brand shell (header + footer). */
export function shell(inner: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background:#050B18;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="${BASE_STYLE}">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; background:#0B1F3A;">
        <tr><td style="padding:32px 32px 16px 32px; text-align:center;">
          <div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size:22px; font-weight:600; letter-spacing:0.18em; color:#FFF8E7; text-transform:uppercase;">HOPE OF GLORY</div>
          <div style="font-size:11px; letter-spacing:0.4em; color:#D4AF37; margin-top:4px;">MINISTRY</div>
        </td></tr>
        <tr><td style="padding:0 32px 24px 32px;">${inner}</td></tr>
        <tr><td style="padding:24px 32px 32px 32px; border-top:1px solid rgba(255,248,231,0.12); font-size:13px; color:rgba(255,248,231,0.6);">
          <p style="margin:0 0 8px 0;">Washington, D.C. · <a href="https://hopeofglory.ministry" style="color:#D4AF37; text-decoration:none;">hopeofglory.ministry</a></p>
          <p style="margin:0 0 8px 0;">In crisis? Call <strong style="color:#D4AF37;">988</strong> · Emergency? Call <strong style="color:#D4AF37;">911</strong></p>
          <p style="margin:0;">You're receiving this because you opted in. <a href="{{unsubscribeUrl}}" style="color:#D4AF37; text-decoration:none;">Unsubscribe</a>.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/* ---------- Brand primitives (shared inline-style snippets) ---------- */

/** Display heading — Cormorant Garamond on Warm Light. */
export function heading(text: string, size = 30): string {
  return `<h1 style="font-family:'Cormorant Garamond', Georgia, serif; font-size:${size}px; line-height:1.15; color:#FFF8E7; margin:24px 0 16px 0;">${text}</h1>`;
}

/** Body paragraph at the standard reading size. */
export function paragraph(text: string): string {
  return `<p style="font-size:17px; margin:0 0 16px 0;">${text}</p>`;
}

/** Scripture pull-quote with gold left border + WEB ref. */
export function scripture(ref: string, text: string): string {
  return `
    <blockquote style="font-family:'Cormorant Garamond', Georgia, serif; font-style:italic; font-size:20px; line-height:1.4; border-left:2px solid #D4AF37; padding-left:16px; margin:24px 0; color:#FFF8E7;">
      ${text}
    </blockquote>
    <p style="font-size:12px; letter-spacing:0.12em; text-transform:uppercase; color:#D4AF37; margin:0 0 24px 0;">${ref} · WEB</p>`;
}

/** Primary (filled gold) CTA button. */
export function primaryButton(href: string, label: string): string {
  return `
    <table cellpadding="0" cellspacing="0" border="0" style="margin:32px 0 0 0;"><tr><td>
      <a href="${href}" style="display:inline-block; padding:14px 28px; background:#D4AF37; color:#050B18; font-weight:600; font-size:15px; letter-spacing:0.1em; text-transform:uppercase; text-decoration:none; border-radius:2px;">${label}</a>
    </td></tr></table>`;
}

/** Secondary (outline) CTA button — useful as second action in a pair. */
export function secondaryButton(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block; padding:14px 28px; background:transparent; color:#D4AF37; border:1px solid #D4AF37; font-weight:600; font-size:15px; letter-spacing:0.1em; text-transform:uppercase; text-decoration:none; border-radius:2px;">${label}</a>`;
}

/** Two-button row (primary + secondary). */
export function buttonRow(
  primary: { href: string; label: string },
  secondary: { href: string; label: string }
): string {
  return `
    <table cellpadding="0" cellspacing="0" border="0" style="margin:32px 0 0 0;"><tr><td>
      <a href="${primary.href}" style="display:inline-block; padding:14px 28px; background:#D4AF37; color:#050B18; font-weight:600; font-size:15px; letter-spacing:0.1em; text-transform:uppercase; text-decoration:none; border-radius:2px;">${primary.label}</a>
    </td><td style="padding-left:12px;">
      <a href="${secondary.href}" style="display:inline-block; padding:14px 28px; background:transparent; color:#D4AF37; border:1px solid #D4AF37; font-weight:600; font-size:15px; letter-spacing:0.1em; text-transform:uppercase; text-decoration:none; border-radius:2px;">${secondary.label}</a>
    </td></tr></table>`;
}

/** Small all-caps section eyebrow (gold). */
export function eyebrow(text: string): string {
  return `<p style="font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:#D4AF37; margin:24px 0 8px 0;">${text}</p>`;
}

/** Strip basic HTML tags for plain-text fallback. */
export function stripHtml(s: string): string {
  return s
    .replace(/<br\s*\/?>(\s*)/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Format an optional given name as ", Name" or "". */
export function nameSuffix(givenName?: string): string {
  return givenName ? `, ${givenName}` : "";
}

/** Brand URL — used for sensible default links inside templates. */
export const BRAND_URL = "https://hopeofglory.ministry";
