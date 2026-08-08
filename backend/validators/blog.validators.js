const { z } = require('zod');

const createPostSchema = z.object({
  title: z.string().min(2, 'Title is required').max(200).trim(),
  excerpt: z.string().max(500).trim().optional(),
  content: z.string().min(1, 'Content is required'),
  coverImage: z.string().optional().or(z.literal('')),
  tags: z.array(z.string().trim()).optional(),
  published: z.boolean().optional(),
});

const updatePostSchema = z
  .object({
    title: z.string().min(2).max(200).trim().optional(),
    excerpt: z.string().max(500).trim().optional(),
    content: z.string().min(1).optional(),
    coverImage: z.string().optional().or(z.literal('')),
    tags: z.array(z.string().trim()).optional(),
    published: z.boolean().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, { message: 'Provide at least one field to update' });

const listPostsSchema = z.object({
  tag: z.string().trim().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

module.exports = { createPostSchema, updatePostSchema, listPostsSchema };
