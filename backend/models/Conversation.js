const mongoose = require('mongoose');

// A conversation thread, optionally scoped to a project. Participants are
// admin/staff users (this is an internal, admin-only system for now).
const conversationSchema = new mongoose.Schema(
  {
    subject: { type: String, trim: true, maxlength: 200 },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null, index: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    lastMessageAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Conversation', conversationSchema);
