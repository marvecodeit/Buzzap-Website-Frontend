const { v2: cloudinary } = require('cloudinary');
const config = require('./env');
const logger = require('../utils/logger');

// The Cloudinary SDK auto-reads process.env.CLOUDINARY_URL, but we configure
// explicitly so we can detect misconfiguration and expose an `isConfigured` flag.
let configured = false;

// CLOUDINARY_URL format: cloudinary://<api_key>:<api_secret>@<cloud_name>
// Some .env files wrap the parts in <angle brackets> — strip those defensively.
function parseCloudinaryUrl(url) {
  if (!url) return null;
  const cleaned = url.replace(/[<>]/g, '');
  const match = cleaned.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
  if (!match) return null;
  return { api_key: match[1], api_secret: match[2], cloud_name: match[3] };
}

const creds = parseCloudinaryUrl(config.CLOUDINARY_URL);
if (creds && creds.cloud_name && creds.api_key && creds.api_secret) {
  cloudinary.config({ ...creds, secure: true });
  configured = true;
} else if (config.CLOUDINARY_URL) {
  logger.warn('CLOUDINARY_URL is set but could not be parsed — uploads will be disabled.');
}

module.exports = {
  cloudinary,
  isConfigured: () => configured,
};
