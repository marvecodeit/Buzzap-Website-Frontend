const ApiError = require('../utils/ApiError');

// 404 handler for unmatched routes. Placed after all routes.
function notFound(req, res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

module.exports = notFound;
