/**
 * Crisis Alert — internal pastoral alert.
 *
 * Fires the moment a Crisis Agent classifies an event as "imminent" on any
 * surface (Ask Hope, Scroll, Prayer form, Hope Line voice loop, Apologetics).
 *
 * RULES:
 *   - This email is the ALERT, not the CONTENT. We never paste the caller's
 *     exact words here. The trigger pattern + severity + admin link are
 *     sufficient context — the actual words live in the DB and only an
 *     authenticated admin should read them on /admin.
 *   - NO marketing footer, NO unsubscribe, NO donation prompts.
 *   - Subject is unmistakable: "[CRISIS — IMMINENT]" so it cuts through
 *     inbox noise even on a phone lock screen.
 */
import { BASE_STYLE } from "./_shell";

export type CrisisAlertSource = "voice" | "scroll" | "ask" | "prayer" | "apologetics";

export type CrisisAlertOpts = {
  /** Always 'imminent' for this template — passed in for safety/audit. */
  severity: "imminent";
  /** Surface the user was on. */
  source: CrisisAlertSource;
  /** Public admin URL the on-call human should open (e.g. /admin/calls/{id}). */
  adminUrl: string;
  /** ISO timestamp when the event landed (defaults to now). */
  occurredAt?: string;
  /** Hashed caller identifier — NEVER the raw phone or email. */
  callerHash?: string;
  /**
   * Short pattern names that triggered classification (e.g. "imminent-overdose").
   * NEVER the caller's exact words.
   */
  triggerPhrases?: string[];
  /** Action the system took (e.g. "988_and_911", "warm_transfer_988"). */
  actionTaken?: string;
  /** Site URL prefix for the admin link if adminUrl is a path. */
  siteUrl?: string;
};

type Built = { subject: string; html: string; text: string };

function sourceLabel(s: CrisisAlertSource): string {
  switch (s) {
    case "voice": return "Hope Line (voice)";
    case "scroll": return "Scroll";
    case "ask": return "Ask Hope";
    case "prayer": return "Prayer form";
    case "apologetics": return "Apologetics";
  }
}

function resolveAdminLink(adminUrl: string, siteUrl?: string): string {
  if (/^https?:\/\//i.test(adminUrl)) return adminUrl;
  const base = (siteUrl ?? "https://hopeofglory.ministry").replace(/\/$/, "");
  return `${base}${adminUrl.startsWith("/") ? adminUrl : `/${adminUrl}`}`;
}

/**
 * Minimal alert shell — NO public-facing footer, NO unsubscribe link, NO
 * donation language. This is an internal pager email, not a newsletter.
 */
function alertShell(inner: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background:#050B18;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="${BASE_STYLE}">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; background:#0B1F3A;">
        <tr><td style="padding:24px 32px 8px 32px; text-align:center; background:#7a1414;">
          <div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size:22px; font-weight:600; letter-spacing:0.18em; color:#FFF8E7; text-transform:uppercase;">CRISIS &middot; IMMINENT</div>
          <div style="font-size:11px; letter-spacing:0.4em; color:#FFF8E7; margin-top:4px;">HOPE OF GLORY MINISTRY</div>
        </td></tr>
        <tr><td style="padding:24px 32px 16px 32px;">${inner}</td></tr>
        <tr><td style="padding:16px 32px 28px 32px; border-top:1px solid rgba(255,248,231,0.12); font-size:12px; color:rgba(255,248,231,0.6);">
          <p style="margin:0;">Internal pastoral alert. Not for distribution. Caller words live in the database &mdash; open the admin link to read them.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function crisisAlertTemplate(opts: CrisisAlertOpts): Built {
  const occurredAt = opts.occurredAt ?? new Date().toISOString();
  const link = resolveAdminLink(opts.adminUrl, opts.siteUrl);
  const sourceText = sourceLabel(opts.source);
  const triggers =
    opts.triggerPhrases && opts.triggerPhrases.length
      ? opts.triggerPhrases.slice(0, 8).join(", ")
      : "(none recorded)";
  const action = opts.actionTaken ?? "(none)";
  const caller = opts.callerHash ?? "(unknown)";

  const inner = `
    <h1 style="font-family:'Cormorant Garamond', Georgia, serif; font-size:26px; line-height:1.2; color:#FFF8E7; margin:8px 0 16px 0;">
      A Hope Line caller needs human follow-up.
    </h1>
    <p style="font-size:16px; margin:0 0 16px 0;">
      An <strong style="color:#D4AF37;">imminent</strong>-severity event was just classified.
      The system has already taken its automated step. A human now needs to
      review the conversation and decide what comes next.
    </p>
    <table cellpadding="0" cellspacing="0" border="0" style="margin:16px 0 24px 0; width:100%;">
      <tr>
        <td style="padding:6px 0; font-size:13px; letter-spacing:0.14em; text-transform:uppercase; color:#D4AF37; width:38%;">Severity</td>
        <td style="padding:6px 0; font-size:15px; color:#FFF8E7;">IMMINENT</td>
      </tr>
      <tr>
        <td style="padding:6px 0; font-size:13px; letter-spacing:0.14em; text-transform:uppercase; color:#D4AF37;">When</td>
        <td style="padding:6px 0; font-size:15px; color:#FFF8E7;">${occurredAt}</td>
      </tr>
      <tr>
        <td style="padding:6px 0; font-size:13px; letter-spacing:0.14em; text-transform:uppercase; color:#D4AF37;">Source</td>
        <td style="padding:6px 0; font-size:15px; color:#FFF8E7;">${sourceText}</td>
      </tr>
      <tr>
        <td style="padding:6px 0; font-size:13px; letter-spacing:0.14em; text-transform:uppercase; color:#D4AF37;">Caller hash</td>
        <td style="padding:6px 0; font-size:13px; color:#FFF8E7; font-family:'SFMono-Regular', Consolas, monospace;">${caller}</td>
      </tr>
      <tr>
        <td style="padding:6px 0; font-size:13px; letter-spacing:0.14em; text-transform:uppercase; color:#D4AF37;">Trigger pattern</td>
        <td style="padding:6px 0; font-size:13px; color:#FFF8E7; font-family:'SFMono-Regular', Consolas, monospace;">${triggers}</td>
      </tr>
      <tr>
        <td style="padding:6px 0; font-size:13px; letter-spacing:0.14em; text-transform:uppercase; color:#D4AF37;">Action taken</td>
        <td style="padding:6px 0; font-size:15px; color:#FFF8E7;">${action}</td>
      </tr>
    </table>
    <table cellpadding="0" cellspacing="0" border="0" style="margin:16px 0 8px 0;"><tr><td>
      <a href="${link}" style="display:inline-block; padding:14px 28px; background:#D4AF37; color:#050B18; font-weight:600; font-size:15px; letter-spacing:0.1em; text-transform:uppercase; text-decoration:none; border-radius:2px;">Open in admin</a>
    </td></tr></table>
    <p style="font-size:13px; color:rgba(255,248,231,0.7); margin:16px 0 0 0;">
      This email does <strong>not</strong> contain the caller&rsquo;s words. They live in the database. Authenticate to <a href="${link}" style="color:#D4AF37; text-decoration:none;">${link}</a> to read the conversation.
    </p>
  `;

  const text =
    `[CRISIS - IMMINENT] Hope of Glory Ministry\n\n` +
    `An imminent-severity event was just classified.\n` +
    `A human now needs to review the conversation and decide what comes next.\n\n` +
    `Severity:       IMMINENT\n` +
    `When:           ${occurredAt}\n` +
    `Source:         ${sourceText}\n` +
    `Caller hash:    ${caller}\n` +
    `Trigger pattern: ${triggers}\n` +
    `Action taken:   ${action}\n\n` +
    `Open in admin: ${link}\n\n` +
    `This email does NOT contain the caller's words. They live in the database.\n` +
    `Authenticate to the admin link above to read the conversation.\n`;

  return {
    subject: "[CRISIS — IMMINENT] Hope Line caller needs human follow-up",
    html: alertShell(inner),
    text,
  };
}
