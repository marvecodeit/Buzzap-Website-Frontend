const nodemailer = require('nodemailer');
const config = require('../config/env');
const logger = require('../utils/logger');

// Lazily create a single transport. If SMTP isn't configured, we run in
// "log-only" mode so local dev works without credentials.
let transporter = null;
let smtpConfigured = Boolean(config.SMTP_HOST && config.SMTP_USER && config.SMTP_PASS);

function getTransporter() {
  if (!smtpConfigured) return null;
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT || 587,
    secure: (config.SMTP_PORT || 587) === 465, // 465 = implicit TLS; 587 = STARTTLS
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS,
    },
  });
  return transporter;
}

/**
 * Send an email. In log-only mode (no SMTP env), it logs and resolves so
 * feature flows (signup, password reset) never break in dev.
 * @returns {Promise<{sent: boolean, messageId?: string}>}
 */
async function sendMail({ to, subject, html, text }) {
  const from = config.MAIL_FROM || 'Buzzap <no-reply@buzzaphq.com>';

  const tx = getTransporter();
  if (!tx) {
    logger.warn(`[email:log-only] would send "${subject}" to ${to}`);
    return { sent: false };
  }

  try {
    const info = await tx.sendMail({ from, to, subject, html, text });
    logger.info(`Email sent to ${to} (${subject}) — ${info.messageId}`);
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    // Don't let email failures break the request; log and report not-sent.
    logger.error(`Email send failed to ${to} (${subject}): ${err.message}`);
    return { sent: false };
  }
}

// Optional: verify SMTP connectivity (used by a diagnostics route/script).
async function verifyTransport() {
  const tx = getTransporter();
  if (!tx) return { ok: false, reason: 'SMTP not configured' };
  try {
    await tx.verify();
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: err.message };
  }
}

module.exports = { sendMail, verifyTransport, isConfigured: () => smtpConfigured };
