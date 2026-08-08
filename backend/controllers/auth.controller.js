const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../utils/logger');
const config = require('../config/env');
const { signToken, setAuthCookie, clearAuthCookie } = require('../utils/jwt');
const { sendMail } = require('../email/mailer');
const { passwordResetEmail } = require('../email/templates');

// Shape the user object we return to clients (never leak password/reset fields).
function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

function issueSession(res, user) {
  const token = signToken({ sub: user._id.toString(), role: user.role });
  setAuthCookie(res, token);
}

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // password has select:false — explicitly include it.
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized('Invalid email or password');
  }
  if (!user.isActive) {
    throw ApiError.forbidden('Account is disabled');
  }

  issueSession(res, user);
  res.status(200).json({ status: 'success', user: publicUser(user) });
});

// POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);
  res.status(200).json({ status: 'success' });
});

// GET /api/auth/me  (protected)
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ status: 'success', user: publicUser(req.user) });
});

// POST /api/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  // Always respond the same way to avoid leaking which emails exist.
  const genericResponse = () =>
    res.status(200).json({
      status: 'success',
      message: 'If an account exists for that email, a reset link has been sent.',
    });

  if (!user) return genericResponse();

  const rawToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${config.CLIENT_URL}/reset-password/${rawToken}`;
  const tmpl = passwordResetEmail(user.name, resetUrl);
  const result = await sendMail({ to: user.email, ...tmpl });

  // If email couldn't be sent, roll back the token so it can be retried cleanly.
  if (!result.sent) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    logger.error(`Password reset email not sent for ${user.email}`);
  }

  return genericResponse();
});

// POST /api/auth/reset-password/:token
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashed = User.hashResetToken(token);
  const user = await User.findOne({
    passwordResetToken: hashed,
    passwordResetExpires: { $gt: new Date() },
  }).select('+passwordResetToken +passwordResetExpires');

  if (!user) {
    throw ApiError.badRequest('Reset token is invalid or has expired');
  }

  user.password = password; // pre-save hook hashes + stamps passwordChangedAt
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Log the user in with a fresh session.
  issueSession(res, user);
  res.status(200).json({ status: 'success', message: 'Password has been reset' });
});

// PATCH /api/auth/update-password  (protected)
const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(currentPassword))) {
    throw ApiError.unauthorized('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  // Re-issue session (old tokens are now invalid via passwordChangedAt).
  issueSession(res, user);
  res.status(200).json({ status: 'success', message: 'Password updated' });
});

module.exports = {
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword,
};
