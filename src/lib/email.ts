import { Resend } from 'resend';
import { siteConfig } from '@/config/site';
import { subjectLabel, type ConsultationInput } from '@/lib/validators';

/** Escape anything that came from the form before it enters an HTML email. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const NAVY = '#00204A';
const GOLD = '#C9A24D';
const INK = '#0F172A';
const MUTED = '#475569';
const LINE = '#E2E8F0';

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid ${LINE};color:${MUTED};font-size:13px;width:180px;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:10px 0;border-bottom:1px solid ${LINE};color:${INK};font-size:14px;font-weight:600;">${escapeHtml(value)}</td>
    </tr>`;
}

function shell(title: string, inner: string): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:24px;background:#F5F7FA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;margin:0 auto;background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid ${LINE};">
    <tr>
      <td style="background:${NAVY};padding:24px 28px;">
        <p style="margin:0;color:#FFFFFF;font-size:19px;font-weight:700;letter-spacing:-0.3px;">RizSync</p>
        <p style="margin:4px 0 0;color:${GOLD};font-size:11px;font-weight:600;letter-spacing:2px;">SERVICE SOLUTION</p>
      </td>
    </tr>
    <tr><td style="padding:28px;">${inner}</td></tr>
    <tr>
      <td style="background:#F5F7FA;padding:18px 28px;border-top:1px solid ${LINE};color:${MUTED};font-size:12px;line-height:1.6;">
        ${escapeHtml(siteConfig.name)} &middot; ${escapeHtml(siteConfig.offices.corporate.full)}<br>
        ${escapeHtml(siteConfig.contact.phoneDisplay)} &middot; ${escapeHtml(siteConfig.contact.email)}
      </td>
    </tr>
  </table>
</body></html>`;
}

function notificationHtml(data: ConsultationInput): string {
  return shell(
    'New consultation request',
    `
    <h1 style="margin:0 0 6px;color:${NAVY};font-size:20px;">New consultation request</h1>
    <p style="margin:0 0 20px;color:${MUTED};font-size:14px;">Submitted through the website consultation form.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row('Name', data.name)}
      ${data.company ? row('Company / Family', data.company) : ''}
      ${row('Email', data.email)}
      ${row('Phone', data.phone)}
      ${row('Client type', data.clientType)}
      ${row('Subject', subjectLabel(data.subject))}
      ${data.preferredContact ? row('Preferred contact', data.preferredContact) : ''}
    </table>
    <h2 style="margin:24px 0 8px;color:${NAVY};font-size:15px;">Message</h2>
    <div style="white-space:pre-wrap;color:${INK};font-size:14px;line-height:1.7;background:#F5F7FA;border-radius:10px;padding:16px;">${escapeHtml(
      data.message,
    )}</div>
    <p style="margin:24px 0 0;">
      <a href="mailto:${escapeHtml(data.email)}" style="display:inline-block;background:${GOLD};color:${NAVY};font-weight:700;font-size:14px;text-decoration:none;padding:12px 22px;border-radius:10px;">Reply to ${escapeHtml(
        data.name,
      )}</a>
    </p>`,
  );
}

function autoReplyHtml(data: ConsultationInput): string {
  return shell(
    'We have received your request',
    `
    <h1 style="margin:0 0 12px;color:${NAVY};font-size:20px;">Assalamu Alaikum ${escapeHtml(
      data.name,
    )},</h1>
    <p style="margin:0 0 14px;color:${INK};font-size:15px;line-height:1.7;">
      Thank you for contacting ${escapeHtml(siteConfig.name)}. We have received your request
      regarding <strong>${escapeHtml(subjectLabel(data.subject))}</strong> and a member of our
      team will contact you within one business day, In sh&#257;&rsquo; All&#257;h.
    </p>
    <p style="margin:0 0 20px;color:${MUTED};font-size:14px;line-height:1.7;">
      If your matter is urgent, the fastest way to reach us is WhatsApp or a direct call.
    </p>
    <p style="margin:0 0 24px;">
      <a href="${siteConfig.contact.whatsappHref}" style="display:inline-block;background:#25D366;color:#FFFFFF;font-weight:700;font-size:14px;text-decoration:none;padding:12px 22px;border-radius:10px;margin-right:8px;">WhatsApp us</a>
      <a href="${siteConfig.contact.phoneHref}" style="display:inline-block;background:${NAVY};color:#FFFFFF;font-weight:700;font-size:14px;text-decoration:none;padding:12px 22px;border-radius:10px;">${escapeHtml(
        siteConfig.contact.phoneDisplay,
      )}</a>
    </p>
    <div style="border-top:1px solid ${LINE};padding-top:16px;">
      <p style="margin:0 0 6px;color:${MUTED};font-size:12px;">Your message</p>
      <div style="white-space:pre-wrap;color:${INK};font-size:13px;line-height:1.7;">${escapeHtml(
        data.message,
      )}</div>
    </div>
    <p style="margin:22px 0 0;color:${MUTED};font-size:12px;font-style:italic;line-height:1.6;">
      ${escapeHtml(siteConfig.ethicsStatement)}
    </p>`,
  );
}

/**
 * Sends the internal notification and the client auto-reply.
 * Returns false when email is not configured, so the caller can still persist
 * the lead and respond honestly.
 */
export async function sendConsultationEmails(
  data: ConsultationInput,
): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return { sent: false, error: 'email-not-configured' };
  }

  const resend = new Resend(apiKey);

  const notification = await resend.emails.send({
    from,
    to,
    replyTo: data.email,
    subject: `New consultation: ${subjectLabel(data.subject)} — ${data.name}`,
    html: notificationHtml(data),
  });

  if (notification.error) {
    return { sent: false, error: notification.error.message };
  }

  // The auto-reply is a courtesy: a failure here must not fail the request,
  // because the lead has already reached the team.
  try {
    await resend.emails.send({
      from,
      to: data.email,
      subject: `We have received your request — ${siteConfig.name}`,
      html: autoReplyHtml(data),
    });
  } catch {
    // Intentionally ignored.
  }

  return { sent: true };
}
