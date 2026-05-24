/**
 * Email templates. Plain HTML — no fancy MJML/React-email dependency at launch.
 * All templates respect brand palette and use the wordmark.
 */

const BASE_STYLE = `
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, system-ui, sans-serif;
  color: #FFF8E7;
  background: #0B1F3A;
  line-height: 1.6;
`;

function shell(inner: string): string {
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

export function dailyDevotionalTemplate(opts: {
  title: string;
  scriptureRef: string;
  scriptureText: string;
  reflection: string;
  sermonUrl: string;
  askUrl: string;
}): { html: string; subject: string; text: string } {
  const inner = `
    <h1 style="font-family:'Cormorant Garamond', Georgia, serif; font-size:32px; line-height:1.15; color:#FFF8E7; margin:24px 0 16px 0;">${opts.title}</h1>
    <blockquote style="font-family:'Cormorant Garamond', Georgia, serif; font-style:italic; font-size:20px; line-height:1.4; border-left:2px solid #D4AF37; padding-left:16px; margin:24px 0; color:#FFF8E7;">
      ${opts.scriptureText}
    </blockquote>
    <p style="font-size:12px; letter-spacing:0.12em; text-transform:uppercase; color:#D4AF37; margin:0 0 32px 0;">${opts.scriptureRef} · WEB</p>
    <div style="font-size:17px; color:#FFF8E7;">${opts.reflection}</div>
    <table cellpadding="0" cellspacing="0" border="0" style="margin:32px 0 0 0;"><tr><td>
      <a href="${opts.sermonUrl}" style="display:inline-block; padding:14px 28px; background:#D4AF37; color:#050B18; font-weight:600; font-size:15px; letter-spacing:0.1em; text-transform:uppercase; text-decoration:none; border-radius:2px;">Read today's sermon</a>
    </td><td style="padding-left:12px;">
      <a href="${opts.askUrl}" style="display:inline-block; padding:14px 28px; background:transparent; color:#D4AF37; border:1px solid #D4AF37; font-weight:600; font-size:15px; letter-spacing:0.1em; text-transform:uppercase; text-decoration:none; border-radius:2px;">Ask Hope</a>
    </td></tr></table>`;
  return {
    subject: opts.title,
    html: shell(inner),
    text: `${opts.title}\n\n${opts.scriptureText}\n— ${opts.scriptureRef} (WEB)\n\n${opts.reflection.replace(/<[^>]+>/g, "")}\n\nRead today's sermon: ${opts.sermonUrl}\nAsk Hope: ${opts.askUrl}`,
  };
}

export function prayerReceivedTemplate(opts: {
  givenName?: string;
}): { html: string; subject: string; text: string } {
  const name = opts.givenName ? `, ${opts.givenName}` : "";
  const inner = `
    <h1 style="font-family:'Cormorant Garamond', Georgia, serif; font-size:28px; line-height:1.15; color:#FFF8E7; margin:24px 0 16px 0;">We received your prayer request${name}.</h1>
    <p style="font-size:17px;">Thank you for trusting us with what you shared. A member of the ministry will read it and pray.</p>
    <p style="font-size:17px;">If your situation is urgent or worsening, please call <strong style="color:#D4AF37;">911</strong> for emergencies or <strong style="color:#D4AF37;">988</strong> for the U.S. Suicide & Crisis Lifeline. You are not alone.</p>
    <blockquote style="font-family:'Cormorant Garamond', Georgia, serif; font-style:italic; font-size:18px; line-height:1.4; border-left:2px solid #D4AF37; padding-left:16px; margin:24px 0; color:#FFF8E7;">
      The Lord is near to the brokenhearted, and saves those who have a crushed spirit.
    </blockquote>
    <p style="font-size:12px; letter-spacing:0.12em; text-transform:uppercase; color:#D4AF37; margin:0;">Psalm 34:18 · WEB</p>`;
  return {
    subject: "We received your prayer request",
    html: shell(inner),
    text: `We received your prayer request${name}.\n\nThank you for trusting us with what you shared. A member of the ministry will read it and pray.\n\nIf urgent, call 988 or 911.\n\n"The Lord is near to the brokenhearted, and saves those who have a crushed spirit." — Psalm 34:18 (WEB)`,
  };
}

export function newBelieverWelcomeTemplate(opts: { givenName?: string }): {
  html: string;
  subject: string;
  text: string;
} {
  const name = opts.givenName ? `, ${opts.givenName}` : "";
  const inner = `
    <h1 style="font-family:'Cormorant Garamond', Georgia, serif; font-size:30px; line-height:1.15; color:#FFF8E7; margin:24px 0 16px 0;">Welcome to the family${name}.</h1>
    <p style="font-size:17px;">If you have just begun to follow Jesus — or you are still wondering who He is — we are so glad you are here.</p>
    <p style="font-size:17px;">Over the next 30 days we will walk with you through the gospel of John, basic prayer, what baptism and communion mean, and how to find a faithful local church.</p>
    <blockquote style="font-family:'Cormorant Garamond', Georgia, serif; font-style:italic; font-size:18px; line-height:1.4; border-left:2px solid #D4AF37; padding-left:16px; margin:24px 0; color:#FFF8E7;">
      You will know the truth, and the truth will make you free.
    </blockquote>
    <p style="font-size:12px; letter-spacing:0.12em; text-transform:uppercase; color:#D4AF37; margin:0;">John 8:32 · WEB</p>`;
  return {
    subject: "Welcome to the family",
    html: shell(inner),
    text: `Welcome to the family${name}.\n\nIf you have just begun to follow Jesus — or you are still wondering who He is — we are so glad you are here.\n\nOver the next 30 days we will walk with you through the gospel of John, basic prayer, what baptism and communion mean, and how to find a faithful local church.\n\n"You will know the truth, and the truth will make you free." — John 8:32 (WEB)`,
  };
}
