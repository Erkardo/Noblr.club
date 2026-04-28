/**
 * Noblr invite email template.
 *
 * HTML email rules are older than the web: nested <table> for layout,
 * inline styles for compatibility, no CSS vars, no web fonts beyond
 * the few that render everywhere. The look matches the site's register
 * — paper cream background, oxblood accent, serif display, restrained copy.
 *
 * A plain-text version is included for clients that strip HTML (or
 * users who prefer it). Keep the two in rough parity.
 */

export interface InviteEmailInput {
  applicantName: string;
  memberNumber: string;   // "No. 0249"
  dispatchCode: string;   // "NBLR-0249"
  dispatchKey: string;    // short welcome key
  sponsorMemberNumber?: string; // "No. 0247"
  sponsorName?: string;
  loginUrl: string;       // where to click to log in
}

// Cream editorial palette — matches the site's @theme tokens. The email
// must read as a sibling of the website, not a different brand.
const ACCENT = '#8E2C2A';                    // oxblood
const BG = '#F5EFE2';                        // warm paper cream
const BG_2 = '#ECE4D0';                      // card cream
const INK = '#1A1612';                       // warm charcoal
const INK_DIM = '#5C534B';                   // warm gray
const DIVIDER = 'rgba(26, 22, 18, 0.14)';    // hairline on cream

export function renderInviteEmail(input: InviteEmailInput): { subject: string; html: string; text: string } {
  const { applicantName, memberNumber, dispatchCode, dispatchKey, sponsorMemberNumber, sponsorName, loginUrl } = input;

  const subject = `Invitation extended · ${memberNumber} · Noblr`;

  const sponsoredLine = sponsorMemberNumber && sponsorName
    ? `<tr><td style="padding:6px 0;color:${INK_DIM};font-family:Georgia,serif;font-style:italic;font-size:13px;line-height:1.7;">Таныг ${sponsorMemberNumber} · ${sponsorName} нэгийн уриагаар хорооны шалгалтад оруулсан.</td></tr>`
    : '';

  const html = `<!DOCTYPE html>
<html lang="mn">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${BG};font-family:'Helvetica Neue',Arial,sans-serif;color:${INK};-webkit-font-smoothing:antialiased;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};">
  <tr>
    <td align="center" style="padding:48px 16px;">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#FFFFFF;border:1px solid ${DIVIDER};">

        <!-- Wordmark header -->
        <tr>
          <td align="center" style="padding:40px 48px 32px 48px;border-bottom:1px solid ${DIVIDER};">
            <div style="font-family:Georgia,serif;font-style:italic;font-weight:300;color:${INK_DIM};font-size:11px;letter-spacing:0.04em;line-height:1;margin-bottom:-2px;">The</div>
            <div style="font-family:Georgia,serif;font-weight:300;color:${INK};font-size:32px;letter-spacing:-0.02em;line-height:1;">Noblr</div>
            <div style="font-family:Georgia,serif;font-style:italic;font-weight:300;color:${INK_DIM};font-size:11px;letter-spacing:0.04em;line-height:1;margin-top:-2px;">club</div>
          </td>
        </tr>

        <!-- Heading -->
        <tr>
          <td style="padding:48px 48px 0 48px;">
            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;letter-spacing:0.3em;color:${ACCENT};text-transform:uppercase;margin-bottom:16px;">Committee Decision</div>
            <div style="font-family:Georgia,serif;font-weight:300;color:${INK};font-size:32px;line-height:1.15;letter-spacing:-0.01em;margin:0;">Урилга<br><span style="font-style:italic;color:${INK_DIM};">баталгаажлаа.</span></div>
          </td>
        </tr>

        <!-- Greeting + body -->
        <tr>
          <td style="padding:32px 48px 0 48px;">
            <p style="font-family:Georgia,serif;font-style:italic;color:${INK};font-size:15px;line-height:1.8;margin:0 0 16px 0;">
              Эрхэм ${escapeHtml(applicantName || 'гишүүн')},
            </p>
            <p style="font-family:Georgia,serif;color:${INK_DIM};font-size:14px;line-height:1.85;margin:0 0 12px 0;">
              Хорооны хаалттай хуралдаан таны dossier-ийг хүлээн зөвшөөрлөө.
              Таныг Noblr-ийн гишүүнчлэлд албан ёсоор урьж байна.
            </p>
            <p style="font-family:Georgia,serif;color:${INK_DIM};font-size:14px;line-height:1.85;margin:0 0 0 0;">
              Доорхи код болон түлхүүр нь зөвхөн танд хамаарна. Бусдад дамжуулах,
              мессенжерт хуулахыг хориглоно. Анхны нэвтрэлтийн дараа Dispatch Key-г
              шинээр үүсгэж болно.
            </p>
            ${sponsoredLine ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">${sponsoredLine}</table>` : ''}
          </td>
        </tr>

        <!-- Credentials card -->
        <tr>
          <td style="padding:32px 48px 0 48px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG_2};border:1px solid ${DIVIDER};">
              <tr>
                <td style="padding:28px 28px 16px 28px;border-bottom:1px solid ${DIVIDER};">
                  <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:9px;letter-spacing:0.3em;color:${INK_DIM};text-transform:uppercase;margin-bottom:8px;">Member Number</div>
                  <div style="font-family:Georgia,serif;font-weight:300;font-size:28px;color:${INK};letter-spacing:0.02em;">${escapeHtml(memberNumber)}</div>
                </td>
              </tr>
              <tr>
                <td style="padding:20px 28px;border-bottom:1px solid ${DIVIDER};">
                  <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:9px;letter-spacing:0.3em;color:${INK_DIM};text-transform:uppercase;margin-bottom:6px;">Dispatch Code</div>
                  <div style="font-family:'Courier New',monospace;font-size:18px;color:${ACCENT};letter-spacing:0.1em;">${escapeHtml(dispatchCode)}</div>
                </td>
              </tr>
              <tr>
                <td style="padding:20px 28px 28px 28px;">
                  <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:9px;letter-spacing:0.3em;color:${INK_DIM};text-transform:uppercase;margin-bottom:6px;">Dispatch Key</div>
                  <div style="font-family:'Courier New',monospace;font-size:18px;color:${ACCENT};letter-spacing:0.15em;">${escapeHtml(dispatchKey)}</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Login button -->
        <tr>
          <td align="center" style="padding:36px 48px 16px 48px;">
            <a href="${escapeAttr(loginUrl)}" style="display:inline-block;padding:16px 40px;background:${ACCENT};color:${BG};text-decoration:none;font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;font-weight:500;">Enter Member Portal</a>
          </td>
        </tr>

        <!-- Link for clients that block button -->
        <tr>
          <td align="center" style="padding:0 48px 40px 48px;">
            <div style="font-family:Georgia,serif;font-style:italic;color:${INK_DIM};font-size:12px;line-height:1.6;">
              эсвэл хуулж авна: <a href="${escapeAttr(loginUrl)}" style="color:${ACCENT};text-decoration:none;border-bottom:1px dotted ${ACCENT};">${escapeHtml(loginUrl)}</a>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:32px 48px 40px 48px;border-top:1px solid ${DIVIDER};">
            <p style="font-family:Georgia,serif;font-style:italic;color:${INK_DIM};font-size:12px;line-height:1.8;margin:0 0 8px 0;">
              Энэхүү мессежийг зөвхөн ${escapeHtml(memberNumber)} гишүүнд зориулан илгээв.
              Хэрэв та энэ өргөдлийг илгээгээгүй бол committee@noblr.club-руу мэдэгдэнэ үү.
            </p>
            <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:9px;letter-spacing:0.25em;color:${INK_DIM};text-transform:uppercase;margin:16px 0 0 0;">
              Noblr Private Club · Ulaanbaatar · Confidential
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;

  const text = [
    'NOBLR — Committee Decision',
    '',
    `Эрхэм ${applicantName || 'гишүүн'},`,
    '',
    'Хорооны хаалттай хуралдаан таны dossier-ийг хүлээн зөвшөөрлөө.',
    'Таныг Noblr-ийн гишүүнчлэлд албан ёсоор урьж байна.',
    '',
    `Member Number:  ${memberNumber}`,
    `Dispatch Code:  ${dispatchCode}`,
    `Dispatch Key:   ${dispatchKey}`,
    '',
    `Нэвтрэх:  ${loginUrl}`,
    '',
    sponsorMemberNumber && sponsorName
      ? `Таныг ${sponsorMemberNumber} · ${sponsorName} нэгийн уриагаар хороонд оруулсан.`
      : '',
    '',
    `Энэхүү мессежийг зөвхөн ${memberNumber} гишүүнд зориулан илгээв.`,
    'Хэрэв та энэ өргөдлийг илгээгээгүй бол committee@noblr.club-руу мэдэгдэнэ үү.',
    '',
    'Noblr Private Club · Ulaanbaatar · Confidential',
  ].filter(Boolean).join('\n');

  return { subject, html, text };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(s: string): string {
  return escapeHtml(s);
}
