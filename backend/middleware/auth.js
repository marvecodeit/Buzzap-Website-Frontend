const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { verifyToken, getTokenFromRequest } = require('../utils/jwt');

// Verifies the JWT cookie, loads the user, and attaches it to req.user.
const protect = asyncHandler(async (req, res, next) => {
  const token = getTokenFromRequest(req);
  if (!token) {
    throw ApiError.unauthorized('Not authenticated');
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch {
    throw ApiError.unauthorized('Invalid or expired session');
  }

  const user = await User.findById(decoded.sub);
  if (!user || !user.isActive) {
    throw ApiError.unauthorized('Account no longer available');
  }

  // Invalidate tokens issued before the last password change.
  if (user.passwordChangedAfter(decoded.iat)) {
    throw ApiError.unauthorized('Password recently changed — please log in again');
  }

  req.user = user;
  next();
});

// Restricts a route to one or more roles. Use after `protect`.
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(ApiError.unauthorized('Not authenticated'));
  }
  if (!roles.includes(req.user.role)) {
    return next(ApiError.forbidden('You do not have permission to perform this action'));
  }
  next();
};

module.exports = { protect, requireRole };
