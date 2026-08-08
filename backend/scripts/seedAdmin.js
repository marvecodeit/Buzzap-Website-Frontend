// One-off script to create (or update) the single admin account.
// Usage: npm run seed
// Reads ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME from .env.
// (On hosts without shell access, set SEED_ADMIN_ON_START=true instead.)
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const ensureAdmin = require('../services/ensureAdmin');

async function run() {
  await connectDB();
  const ok = await ensureAdmin();
  await mongoose.connection.close();
  process.exit(ok ? 0 : 1);
}

run().catch(async (err) => {
  // eslint-disable-next-line no-console
  console.error(`Seed failed: ${err.message}`);
  try {
    await mongoose.connection.close();
  } catch {
    /* ignore */
  }
  process.exit(1);
});
