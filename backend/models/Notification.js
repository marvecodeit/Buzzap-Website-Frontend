const mongoose = require('mongoose');

const NOTIFICATION_TYPES = [
  'lead_created',
  'project_created',
  'milestone_completed',
  'file_uploaded',
  'message_received',
  'project_status',
  'generic',
];

// In an admin-only system, notifications target a specific admin/staff user.
// If `user` is null, it's a broadcast to all admins/staff (resolved on read).
const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    type: { type: String, enum: NOTIFICATION_TYPES, default: 'generic' },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, trim: true, maxlength: 1000 },
    link: { type: String, trim: true, maxlength: 500 },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

notificationSchema.statics.TYPES = NOTIFICATION_TYPES;

module.exports = mongoose.model('Notification', notificationSchema);
