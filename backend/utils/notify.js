const Notification = require('../models/Notification');
const config = require('../config/env');
const logger = require('./logger');
const { sendMail } = require('../email/mailer');
const { notificationAlertEmail } = require('../email/templates');

/**
 * Create a notification. Best-effort: callers should not let a failure here
 * break the primary action (use .catch(() => {})).
 * Pass `user` to target one admin/staff, or omit for a broadcast (user: null).
 * @returns {Promise<object|null>}
 */
async function notify({ user = null, type = 'generic', title, message, link, email = false } = {}) {
  try {
    const notification = await Notification.create({ user, type, title, message, link });

    if (email) {
      const recipient = config.NOTIFY_EMAIL_ALERTS_TO || config.LEADS_NOTIFY_EMAIL || config.SMTP_USER;
      if (recipient) {
        const template = notificationAlertEmail(notification);
        sendMail({ to: recipient, ...template }).catch((err) => logger.error(`notify email failed: ${err.message}`));
      }
    }

    return notification;
  } catch (err) {
    logger.error(`notify() failed: ${err.message}`);
    return null;
  }
}

module.exports = { notify };
