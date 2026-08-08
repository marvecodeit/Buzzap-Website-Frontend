const ApiError = require('../utils/ApiError');

function formatIssues(error) {
  return error.issues.map((i) => ({ path: i.path.join('.'), message: i.message }));
}

// Validate req.body against a Zod schema; replaces body with parsed values.
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return next(ApiError.badRequest('Validation failed', formatIssues(result.error)));
  }
  req.body = result.data;
  next();
};

// Validate req.query against a Zod schema; writes parsed values onto req.query.
// (Express 5 exposes req.query as a getter, so mutate in place rather than reassign.)
const validateQuery = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);
  if (!result.success) {
    return next(ApiError.badRequest('Invalid query parameters', formatIssues(result.error)));
  }
  Object.assign(req.query, result.data);
  next();
};

module.exports = validate;
module.exports.validate = validate;
module.exports.validateQuery = validateQuery;
