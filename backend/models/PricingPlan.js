const mongoose = require('mongoose');

// A pricing tier shown on the public /pricing page and managed by admins.
// Prices are stored for both billing cycles so the UI toggle needs no math.
const pricingPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Plan name is required'], trim: true, maxlength: 80 },
    description: { type: String, trim: true, maxlength: 300 },
    monthlyPrice: { type: Number, required: true, min: 0 },
    yearlyPrice: { type: Number, required: true, min: 0 },
    // Marketing label for the price (e.g. "/month"); kept flexible.
    priceSuffix: { type: String, trim: true, default: '/month' },
    features: [{ type: String, trim: true, maxlength: 200 }],
    ctaLabel: { type: String, trim: true, default: 'Get started', maxlength: 60 },
    // Highlight one plan as the "popular" pick.
    popular: { type: Boolean, default: false },
    // Only active plans are returned to the public.
    active: { type: Boolean, default: true, index: true },
    // Display order (ascending) on the pricing page.
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PricingPlan', pricingPlanSchema);
