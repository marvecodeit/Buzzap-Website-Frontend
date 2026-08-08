const { z } = require('zod');

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

const createConversationSchema = z.object({
  subject: z.string().max(200).trim().optional(),
  project: objectId.optional(),
  // Other participant user ids (the creator is added automatically).
  participants: z.array(objectId).optional(),
});

const createMessageSchema = z.object({
  body: z.string().min(1, 'Message cannot be empty').max(5000).trim(),
});

module.exports = { createConversationSchema, createMessageSchema };
