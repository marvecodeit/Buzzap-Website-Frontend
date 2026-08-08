const { z } = require('zod');

const PROJECT_STATUSES = ['planning', 'in-progress', 'review', 'completed', 'on-hold'];
const SERVICE_TYPES = [
  'ai-marketing',
  'brand-seo',
  'crm-automation',
  'ai-agents',
  'content-strategy',
  'growth-consulting',
  'other',
];
const MILESTONE_STATUSES = ['pending', 'in-progress', 'completed'];

// Mongo ObjectId as a 24-char hex string.
const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

// Accept ISO date strings / anything Date can parse; coerce to Date.
const dateField = z.coerce.date().optional();

const createProjectSchema = z.object({
  title: z.string().min(2, 'Title is required').max(160).trim(),
  client: objectId,
  serviceType: z.enum(SERVICE_TYPES).optional(),
  description: z.string().max(5000).trim().optional(),
  status: z.enum(PROJECT_STATUSES).optional(),
  progress: z.number().int().min(0).max(100).optional(),
  startDate: dateField,
  dueDate: dateField,
});

// All fields optional on update; require at least one.
const updateProjectSchema = z
  .object({
    title: z.string().min(2).max(160).trim().optional(),
    serviceType: z.enum(SERVICE_TYPES).optional(),
    description: z.string().max(5000).trim().optional(),
    status: z.enum(PROJECT_STATUSES).optional(),
    progress: z.number().int().min(0).max(100).optional(),
    startDate: dateField,
    dueDate: dateField,
  })
  .refine((d) => Object.keys(d).length > 0, { message: 'Provide at least one field to update' });

const listProjectsSchema = z.object({
  status: z.enum(PROJECT_STATUSES).optional(),
  client: objectId.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

const createMilestoneSchema = z.object({
  title: z.string().min(2, 'Title is required').max(160).trim(),
  description: z.string().max(2000).trim().optional(),
  dueDate: dateField,
  status: z.enum(MILESTONE_STATUSES).optional(),
  order: z.number().int().min(0).optional(),
});

const updateMilestoneSchema = z
  .object({
    title: z.string().min(2).max(160).trim().optional(),
    description: z.string().max(2000).trim().optional(),
    dueDate: dateField,
    status: z.enum(MILESTONE_STATUSES).optional(),
    order: z.number().int().min(0).optional(),
  })
  .refine((d) => Object.keys(d).length > 0, { message: 'Provide at least one field to update' });

module.exports = {
  createProjectSchema,
  updateProjectSchema,
  listProjectsSchema,
  createMilestoneSchema,
  updateMilestoneSchema,
};
