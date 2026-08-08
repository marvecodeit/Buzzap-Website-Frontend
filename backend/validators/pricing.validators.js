const { z } = require('zod');

const createPlanSchema = z.object({
  name: z.string().min(2, 'Plan name is required').max(80).trim(),
  description: z.string().max(300).trim().optional(),
  monthlyPrice: z.number().min(0),
  yearlyPrice: z.number().min(0),
  priceSuffix: z.string().max(20).trim().optional(),
  features: z.array(z.string().trim().max(200)).optional(),
  ctaLabel: z.string().max(60).trim().optional(),
  popular: z.boolean().optional(),
  active: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
});

const updatePlanSchema = z
  .object({
    name: z.string().min(2).max(80).trim().optional(),
    description: z.string().max(300).trim().optional(),
    monthlyPrice: z.number().min(0).optional(),
    yearlyPrice: z.number().min(0).optional(),
    priceSuffix: z.string().max(20).trim().optional(),
    features: z.array(z.string().trim().max(200)).optional(),
    ctaLabel: z.string().max(60).trim().optional(),
    popular: z.boolean().optional(),
    active: z.boolean().optional(),
    order: z.number().int().min(0).optional(),
  })
  .refine((d) => Object.keys(d).length > 0, { message: 'Provide at least one field to update' });

module.exports = { createPlanSchema, updatePlanSchema };
