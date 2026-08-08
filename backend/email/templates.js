const config = require('../config/env');

// Simple, dependency-free HTML templates. Keep inline styles minimal so they
// render acceptably across email clients. Swap for MJML/react-email later.
const brand = {
  name: 'Buzzap',
  color: '#2563eb',
};

function layout(title, bodyHtml) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f4f6fb;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
    <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
      <div style="background:#ffffff;border-radius:12px;padding:32px;">
        <h1 style="margin:0 0 16px;font-size:20px;color:${brand.color};">${brand.name}</h1>
        <h2 style="margin:0 0 16px;font-size:18px;">${title}</h2>
        ${bodyHtml}
      </div>
      <p style="text-align:center;color:#94a3b8;font-size:12px;margin-top:16px;">
        © ${brand.name} — this is an automated message.
      </p>
    </div>
  </body>
</html>`;
}

function button(href, label) {
  return `<a href="${href}" style="display:inline-block;background:${brand.color};color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:bold;">${label}</a>`;
}

function welcomeEmail(name) {
  const safeName = name || 'there';
  return {
    subject: `Welcome to ${brand.name}`,
    html: layout(
      `Welcome, ${safeName}!`,
      `<p>Your account is ready. You can now sign in and access your client dashboard.</p>
      <p style="margin-top:24px;">${button(config.CLIENT_URL, 'Go to dashboard')}</p>`
    ),
    text: `Welcome, ${safeName}! Your ${brand.name} account is ready. Visit ${config.CLIENT_URL} to sign in.`,
  };
}

function passwordResetEmail(name, resetUrl) {
  const safeName = name || 'there';
  return {
    subject: `Reset your ${brand.name} password`,
    html: layout(
      'Reset your password',
      `<p>Hi ${safeName}, we received a request to reset your password.</p>
      <p>This link expires in 30 minutes. If you didn't request it, you can ignore this email.</p>
      <p style="margin-top:24px;">${button(resetUrl, 'Reset password')}</p>
      <p style="margin-top:16px;color:#64748b;font-size:13px;word-break:break-all;">${resetUrl}</p>`
    ),
    text: `Hi ${safeName}, reset your ${brand.name} password using this link (expires in 30 min): ${resetUrl}`,
  };
}

// Sent to the person who submitted a lead/inquiry.
function leadConfirmationEmail(name) {
  const safeName = name || 'there';
  return {
    subject: `We received your message — ${brand.name}`,
    html: layout(
      `Thanks, ${safeName}!`,
      `<p>We've received your inquiry and a member of our team will get back to you shortly.</p>
      <p>In the meantime, feel free to explore what we do.</p>
      <p style="margin-top:24px;">${button(config.CLIENT_URL, 'Visit our site')}</p>`
    ),
    text: `Thanks, ${safeName}! We've received your inquiry and will get back to you shortly.`,
  };
}

// Sent to the agency inbox when a new lead arrives.
function newLeadNotificationEmail(lead) {
  const rows = [
    ['Name', lead.name],
    ['Email', lead.email],
    ['Phone', lead.phone],
    ['Company', lead.company],
    ['Service', lead.service],
    ['Budget', lead.budget],
    ['Source', lead.source],
  ]
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#64748b;">${k}</td><td style="padding:4px 0;">${v}</td></tr>`
    )
    .join('');

  return {
    subject: `New lead: ${lead.name}${lead.service ? ` (${lead.service})` : ''}`,
    html: layout(
      'New lead received',
      `<table style="border-collapse:collapse;font-size:14px;">${rows}</table>
      ${lead.message ? `<p style="margin-top:16px;white-space:pre-wrap;">${lead.message}</p>` : ''}
      <p style="margin-top:24px;">${button(`${config.CLIENT_URL}/admin/leads`, 'Open admin')}</p>`
    ),
    text: `New lead: ${lead.name} <${lead.email}>${lead.company ? ` — ${lead.company}` : ''}\n${lead.message || ''}`,
  };
}

function notificationAlertEmail(notification) {
  const link = notification.link || config.CLIENT_URL;
  return {
    subject: `Buzzap alert: ${notification.title}`,
    html: layout(
      notification.title,
      `<p>You have a new ${notification.type.replace(/_/g, ' ')} alert.</p>
      ${notification.message ? `<p style="margin-top:12px;white-space:pre-wrap;">${notification.message}</p>` : ''}
      ${link ? `<p style="margin-top:24px;">${button(link, 'Open Buzzap')}</p>` : ''}`
    ),
    text: `${notification.title}\n${notification.message || ''}\n${link || ''}`,
  };
}

module.exports = {
  welcomeEmail,
  passwordResetEmail,
  leadConfirmationEmail,
  newLeadNotificationEmail,
  notificationAlertEmail,
};
