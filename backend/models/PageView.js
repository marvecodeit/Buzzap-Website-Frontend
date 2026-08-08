const mongoose = require('mongoose');

// A single page view recorded from the public site. Kept intentionally light —
// no PII, just path + coarse referrer/device info for the admin dashboard.
const pageViewSchema = new mongoose.Schema(
  {
    path: {
      type: String,
      required: true,
      trim: true,
      maxlength: 512,
      index: true,
    },
    referrer: { type: String, trim: true, maxlength: 512 },
    // Anonymous session id (random, set client-side) to approximate "visitors"
    // without cookies or tracking real identity.
    visitorId: { type: String, trim: true, maxlength: 64, index: true },
    device: { type: String, enum: ['mobile', 'tablet', 'desktop', 'unknown'], default: 'unknown' },
  },
  { timestamps: true }
);

// Support "views over the last N days" range scans efficiently.
pageViewSchema.index({ createdAt: -1 });

module.exports = mongoose.model('PageView', pageViewSchema);
