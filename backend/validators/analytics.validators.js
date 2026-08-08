const { z } = require('zod');

// Public page-view beacon payload. Everything optional except path; we coerce
// and clamp to avoid junk/oversized data from an untrusted public endpoint.
const pageViewSchema = z.object({
  path: z.string().min(1).max(512).trim(),
  referrer: z.string().max(512).trim().optional().or(z.literal('')),
  visitorId: z.string().max(64).trim().optional(),
  device: z.enum(['mobile', 'tablet', 'desktop', 'unknown']).optional(),
});

module.exports = { pageViewSchema };
