const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// A user sees their own notifications plus broadcasts (user: null).
function scopeFor(userId) {
  return { $or: [{ user: userId }, { user: null }] };
}

// GET /api/notifications  — recent notifications + unread count
const listNotifications = asyncHandler(async (req, res) => {
  const scope = scopeFor(req.user._id);
  const [notifications, unread] = await Promise.all([
    Notification.find(scope).sort({ createdAt: -1 }).limit(50),
    Notification.countDocuments({ ...scope, read: false }),
  ]);
  res.status(200).json({ status: 'success', unread, notifications });
});

// PATCH /api/notifications/:id/read
const markRead = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw ApiError.notFound('Notification not found');
  const n = await Notification.findOneAndUpdate(
    { _id: req.params.id, ...scopeFor(req.user._id) },
    { read: true },
    { new: true }
  );
  if (!n) throw ApiError.notFound('Notification not found');
  res.status(200).json({ status: 'success', notification: n });
});

// PATCH /api/notifications/read-all
const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ ...scopeFor(req.user._id), read: false }, { read: true });
  res.status(200).json({ status: 'success' });
});

module.exports = { listNotifications, markRead, markAllRead };
