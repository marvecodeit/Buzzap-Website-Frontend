// Loads and validates environment variables at boot.
// Fail fast with a clear message if anything required is missing/invalid,
// so we never hit silent `undefined` bugs deep in the app.
require('dotenv').config();

const { z } = require('zod');

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  // Number of proxy hops to trust for client IP (X-Forwarded-For). 0 = don't
  // trust any (local dev). Set to 1 on Render/Cloudflare so rate limiting works.
  TRUST_PROXY: z.coerce.number().int().min(0).max(10).default(0),
  // May be a single origin or a comma-separated list (dev + prod domains).
  // Parsed into CLIENT_ORIGINS[] below; CLIENT_URL is normalized to the first one.
  CLIENT_URL: z.string().default('http://localhost:3000'),

  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),

  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),

  // SMTP is optional for now — the email module fills these in a later milestone.
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  MAIL_FROM: z.string().optional(),
  // Where new-lead notifications are sent (falls back to SMTP_USER).
  // Treat an empty string in .env as "unset".
  LEADS_NOTIFY_EMAIL: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.string().email().optional()
  ),
  // Optional email destination for in-app notifications (messages, projects, assets).
  NOTIFY_EMAIL_ALERTS_TO: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.string().email().optional()
  ),

  CLOUDINARY_URL: z.string().optional(),

  // Admin seed credentials (used only by scripts/seedAdmin.js).
  ADMIN_EMAIL: z.preprocess((v) => (v === '' ? undefined : v), z.string().email().optional()),
  ADMIN_PASSWORD: z.preprocess((v) => (v === '' ? undefined : v), z.string().min(8).optional()),
  ADMIN_NAME: z.string().optional(),
  // Auto-create the admin on server startup (useful on hosts without shell access, e.g. Render free tier).
  SEED_ADMIN_ON_START: z
    .preprocess((v) => (v === '' ? undefined : v), z.enum(['true', 'false']).optional())
    .transform((v) => v === 'true'),
  // Set true when frontend & API are on different domains (Vercel + Render) so
  // the auth cookie uses sameSite=none; secure — required for cross-site cookies.
  COOKIE_CROSS_SITE: z
    .preprocess((v) => (v === '' ? undefined : v), z.enum(['true', 'false']).optional())
    .transform((v) => v === 'true'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`)
    .join('\n');
  // eslint-disable-next-line no-console
  console.error(`\n Invalid environment configuration:\n${issues}\n`);
  process.exit(1);
}

// Split CLIENT_URL into a clean list of allowed origins (trim spaces, drop blanks
// and any trailing slash so it matches the browser's Origin header exactly).
const clientOrigins = parsed.data.CLIENT_URL.split(',')
  .map((o) => o.trim().replace(/\/$/, ''))
  .filter(Boolean);

const config = Object.freeze({
  ...parsed.data,
  CLIENT_URL: clientOrigins[0] || 'http://localhost:3000',
  CLIENT_ORIGINS: clientOrigins,
});

module.exports = config;
