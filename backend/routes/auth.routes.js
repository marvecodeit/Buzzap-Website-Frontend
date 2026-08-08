const express = require('express');

const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { makeLimiter } = require('../middleware/rateLimiter');
const ctrl = require('../controllers/auth.controller');
const {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updatePasswordSchema,
} = require('../validators/auth.validators');

const router = express.Router();

// Tighter rate limit on sensitive auth actions (brute-force / abuse protection).
// Redis-backed when REDIS_URL is set, so it holds across serverless instances.
const authLimiter = makeLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many attempts, please try again later.',
  prefix: 'auth',
});

// No public signup — admin accounts are provisioned via the seed script.
router.post('/login', authLimiter, validate(loginSchema), ctrl.login);
router.post('/logout', ctrl.logout);

router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), ctrl.forgotPassword);
router.post('/reset-password/:token', authLimiter, validate(resetPasswordSchema), ctrl.resetPassword);

router.get('/me', protect, ctrl.getMe);
router.patch('/update-password', protect, validate(updatePasswordSchema), ctrl.updatePassword);

module.exports = router;
