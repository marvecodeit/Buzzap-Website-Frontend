const mongoose = require('mongoose');

const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'won', 'lost'];
const LEAD_SOURCES = ['contact_form', 'newsletter', 'booking', 'other'];

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: { type: String, trim: true, maxlength: 40 },
    company: { type: String, trim: true, maxlength: 160 },
    service: { type: String, trim: true, maxlength: 160 },
    budget: { type: String, trim: true, maxlength: 80 },
    message: { type: String, trim: true, maxlength: 5000 },
    status: {
      type: String,
      enum: LEAD_STATUSES,
      default: 'new',
      index: true,
    },
    source: {
      type: String,
      enum: LEAD_SOURCES,
      default: 'contact_form',
    },
    // Internal note added by staff/admin when triaging.
    note: { type: String, trim: true, maxlength: 2000 },
    // Optional link to a User once the lead becomes a client.
    convertedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

leadSchema.statics.STATUSES = LEAD_STATUSES;
leadSchema.statics.SOURCES = LEAD_SOURCES;

module.exports = mongoose.model('Lead', leadSchema);
