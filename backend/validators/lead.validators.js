const { z } = require('zod');

const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'won', 'lost'];
const LEAD_SOURCES = ['contact_form', 'newsletter', 'booking', 'other'];

// Public submission (contact form / newsletter). Keep required fields minimal
// so we don't reject genuine leads; message optional to support newsletter signups.
const createLeadSchema = z.object({
  name: z.string().min(2, 'Please enter your name').max(120).trim(),
  email: z.string().email('Please enter a valid email').toLowerCase().trim(),
  phone: z.string().max(40).trim().optional(),
  company: z.string().max(160).trim().optional(),
  service: z.string().max(160).trim().optional(),
  budget: z.string().max(80).trim().optional(),
  message: z.string().max(5000).trim().optional(),
  source: z.enum(LEAD_SOURCES).optional(),
});

// Admin/staff update — only status and internal note are editable.
const updateLeadSchema = z
  .object({
    status: z.enum(LEAD_STATUSES).optional(),
    note: z.string().max(2000).trim().optional(),
  })
  .refine((d) => d.status !== undefined || d.note !== undefined, {
    message: 'Provide at least one field to update (status or note)',
  });

// Query params for admin list (filtering + pagination).
const listLeadsSchema = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  source: z.enum(LEAD_SOURCES).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

module.exports = { createLeadSchema, updateLeadSchema, listLeadsSchema };
