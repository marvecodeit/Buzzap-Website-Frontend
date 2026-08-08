const multer = require('multer');
const ApiError = require('../utils/ApiError');

// Keep files in memory; we stream them straight to Cloudinary (no disk writes).
const storage = multer.memoryStorage();

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB

// Block obviously dangerous executable types; allow common docs/images/archives.
const BLOCKED_EXT = /\.(exe|bat|cmd|sh|msi|com|scr|jar)$/i;

const upload = multer({
  storage,
  limits: { fileSize: MAX_BYTES },
  fileFilter: (req, file, cb) => {
    if (BLOCKED_EXT.test(file.originalname)) {
      return cb(ApiError.badRequest('This file type is not allowed'));
    }
    cb(null, true);
  },
});

// Single-file upload under field name "file", with multer errors normalized to ApiError.
const singleFile = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(ApiError.badRequest('File too large (max 15 MB)'));
      }
      return next(err instanceof ApiError ? err : ApiError.badRequest(err.message));
    }
    next();
  });
};

module.exports = { singleFile, MAX_BYTES };
