const express = require('express');
const rateLimit = require('express-rate-limit');

const { protect, requireRole } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { pageViewSchema } = require('../validators/analytics.validators');
const ctrl = require('../controllers/analytics.controller');

const router = express.Router();

// --- Public: page-view beacon ---
// Generous limit (it fires on every route change) but capped to blunt abuse.
const pageViewLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many requests.' },
});
router.post('/pageview', pageViewLimiter, validate(pageViewSchema), ctrl.recordPageView);

// --- Everything below is admin/staff only ---
router.use(protect);
router.use(requireRole('staff', 'admin'));

router.get('/overview', ctrl.overview);
router.get('/leads-timeseries', ctrl.leadsTimeseries);
router.get('/traffic', ctrl.traffic);

module.exports = router;
