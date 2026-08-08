const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { makeLimiter } = require('./middleware/rateLimiter');

const config = require('./config/env');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const leadRoutes = require('./routes/lead.routes');
const projectRoutes = require('./routes/project.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const notificationRoutes = require('./routes/notification.routes');
const blogRoutes = require('./routes/blog.routes');
const messageRoutes = require('./routes/message.routes');
const pricingRoutes = require('./routes/pricing.routes');
const caseStudyRoutes = require('./routes/caseStudy.routes');
const webhookRoutes = require('./routes/webhook.routes');

// App factory: builds and returns the Express app WITHOUT starting a listener,
// so tests can import it directly (supertest) and index.js owns the lifecycle.
function createApp() {
  const app = express();

  // Behind a hosting proxy (Render/Cloudflare), the client IP arrives in
  // X-Forwarded-For. Trust exactly one hop so express-rate-limit can identify
  // clients correctly. NOT `true` — that would trust a client-spoofed header
  // and let attackers dodge rate limits by forging the IP.
  if (config.TRUST_PROXY) {
    app.set('trust proxy', config.TRUST_PROXY);
  }

  // Security headers.
  app.use(helmet());

  // CORS — allow the configured frontend origins and send/receive the auth cookie.
  app.use(
    cors({
      origin(origin, cb) {
        // Allow non-browser clients (curl, server-to-server) that send no Origin.
        if (!origin) return cb(null, true);
        if (config.CLIENT_ORIGINS.includes(origin)) return cb(null, true);
        // Disallowed origin: resolve false (no CORS headers) rather than throwing.
        // Throwing bubbles to the error handler as a 500; returning false lets the
        // browser surface a clean CORS block and logs the offending origin for us.
        logger.warn(`CORS blocked origin: ${origin}`);
        return cb(null, false);
      },
      credentials: true,
    })
  );

  // Body + cookie parsing.
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Request logging (skip noise during tests).
  if (config.NODE_ENV !== 'test') {
    app.use(morgan(config.NODE_ENV === 'production' ? 'combined' : 'dev'));
  }

  // Global rate limit on the API surface (Redis-backed when REDIS_URL is set).
  const apiLimiter = makeLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300,
    message: 'Too many requests, please try again later.',
    prefix: 'global',
  });
  app.use('/api', apiLimiter);

  // Root + health-style ping (Render/uptime checks hit '/'). Returns 200 so
  // platform health checks don't log as 404s.
  app.get('/', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'buzzaphq-api' });
  });

  // Routes.
  app.use('/api/health', healthRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/leads', leadRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/blog', blogRoutes);
  app.use('/api/conversations', messageRoutes);
  app.use('/api/pricing', pricingRoutes);
  app.use('/api/case-studies', caseStudyRoutes);
  app.use('/api/webhooks', webhookRoutes);

  // 404 + central error handler (must be last).
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
