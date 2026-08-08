const rateLimit = require('express-rate-limit');

// Factory for rate limiters using the in-memory store.
// NOTE: on serverless/multi-instance hosting (e.g. Vercel) counters are
// per-instance and reset on cold starts, so throttling is best-effort there.
// For a single long-lived server it works as expected.
function makeLimiter({ windowMs, max, message }) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 'error', message },
  });
}

module.exports = { makeLimiter };
