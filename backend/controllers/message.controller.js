const mongoose = require('mongoose');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { notify } = require('../utils/notify');

// GET /api/conversations — threads the current user participates in
const listConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ participants: req.user._id })
    .sort({ lastMessageAt: -1 })
    .populate('participants', 'name email')
    .populate('project', 'title');
  res.status(200).json({ status: 'success', results: conversations.length, conversations });
});

// POST /api/conversations — start a thread (creator auto-added as participant)
const createConversation = asyncHandler(async (req, res) => {
  const participants = new Set((req.body.participants || []).map(String));
  participants.add(req.user._id.toString());

  const conversation = await Conversation.create({
    subject: req.body.subject,
    project: req.body.project || null,
    participants: [...participants],
  });

  res.status(201).json({ status: 'success', conversation });
});

// Load a conversation the user belongs to, or throw 404.
async function loadOwnedConversation(convId, userId) {
  if (!mongoose.isValidObjectId(convId)) return null;
  return Conversation.findOne({ _id: convId, participants: userId });
}

// GET /api/conversations/:id/messages
const listMessages = asyncHandler(async (req, res) => {
  const conversation = await loadOwnedConversation(req.params.id, req.user._id);
  if (!conversation) throw ApiError.notFound('Conversation not found');

  const messages = await Message.find({ conversation: conversation._id })
    .sort({ createdAt: 1 })
    .populate('sender', 'name');

  // Mark messages from others as read by this user.
  await Message.updateMany(
    { conversation: conversation._id, readBy: { $ne: req.user._id } },
    { $addToSet: { readBy: req.user._id } }
  );

  res.status(200).json({ status: 'success', results: messages.length, messages });
});

// POST /api/conversations/:id/messages
const sendMessage = asyncHandler(async (req, res) => {
  const conversation = await loadOwnedConversation(req.params.id, req.user._id);
  if (!conversation) throw ApiError.notFound('Conversation not found');

  const message = await Message.create({
    conversation: conversation._id,
    sender: req.user._id,
    body: req.body.body,
    readBy: [req.user._id],
  });

  conversation.lastMessageAt = new Date();
  await conversation.save();

  // Notify the other participants.
  conversation.participants
    .filter((p) => p.toString() !== req.user._id.toString())
    .forEach((p) => {
      notify({
        user: p,
        type: 'message_received',
        title: 'New message',
        message: `${req.user.name}: ${req.body.body.slice(0, 80)}`,
        link: `/dashboard/messages/${conversation._id}`,
        email: true,
      }).catch(() => {});
    });

  const populated = await message.populate('sender', 'name');
  res.status(201).json({ status: 'success', message: populated });
});

module.exports = { listConversations, createConversation, listMessages, sendMessage };
