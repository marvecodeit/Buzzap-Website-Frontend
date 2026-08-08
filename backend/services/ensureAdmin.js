const User = require('../models/User');
const config = require('../config/env');
const logger = require('../utils/logger');

// Creates or updates the single admin account from env credentials.
// Assumes a DB connection is already established. Returns true if it ran,
// false if skipped (no credentials configured). Never throws — logs and
// returns so it can be safely called during server startup.
async function ensureAdmin() {
  if (!config.ADMIN_EMAIL || !config.ADMIN_PASSWORD) {
    logger.warn('ADMIN_EMAIL/ADMIN_PASSWORD not set — skipping admin seed.');
    return false;
  }

  const email = config.ADMIN_EMAIL.toLowerCase();
  try {
    let user = await User.findOne({ email }).select('+password');

    if (user) {
      // Only touch the account if something actually changed, so we don't
      // rewrite the password hash on every boot.
      if (user.role !== 'admin' || !user.isActive) {
        user.role = 'admin';
        user.isActive = true;
        await user.save();
        logger.info(`Admin account re-activated: ${email}`);
      } else {
        logger.info(`Admin account present: ${email}`);
      }
    } else {
      await User.create({
        name: config.ADMIN_NAME || 'Admin',
        email,
        password: config.ADMIN_PASSWORD,
        role: 'admin',
      });
      logger.info(`Admin account created: ${email}`);
    }
    return true;
  } catch (err) {
    logger.error(`ensureAdmin failed: ${err.message}`);
    return false;
  }
}

module.exports = ensureAdmin;
