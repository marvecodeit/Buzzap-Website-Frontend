const { ZodError } = require('zod');
const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const config = require('../config/env');

// Central error handler (must be the LAST middleware, with 4 args).
// Maps known error types to clean JSON; hides internals in production.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let statusCode = 500;
  let message = 'Internal server error';
  let details;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    details = err.issues.map((i) => ({
      path: i.path.join('.'),
      message: i.message,
    }));
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = 'Validation failed';
    details = Object.values(err.errors).map((e) => ({
      path: e.path,
      message: e.message,
    }));
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value for ${field}`;
    details = err.keyValue;
  } else if (err.message) {
    message = err.message;
  }

  // Log server-side faults with stack; client faults are expected, log lightly.
  if (statusCode >= 500) {
    logger.error(`${statusCode} ${req.method} ${req.originalUrl} - ${err.stack || err.message}`);
  } else {
    logger.warn(`${statusCode} ${req.method} ${req.originalUrl} - ${message}`);
  }

  const body = { status: 'error', message };
  if (details) body.details = details;
  if (config.NODE_ENV !== 'production' && err.stack) body.stack = err.stack;

  res.status(statusCode).json(body);
}

module.exports = errorHandler;
