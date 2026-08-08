const PricingPlan = require('../models/PricingPlan');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// ---- Public ----

// GET /api/pricing — active plans in display order
const listPublic = asyncHandler(async (req, res) => {
  const plans = await PricingPlan.find({ active: true }).sort({ order: 1, monthlyPrice: 1 });
  res.status(200).json({ status: 'success', results: plans.length, plans });
});

// ---- Admin ----

// GET /api/pricing/admin/all — every plan (active + inactive)
const listAll = asyncHandler(async (req, res) => {
  const plans = await PricingPlan.find().sort({ order: 1, monthlyPrice: 1 });
  res.status(200).json({ status: 'success', results: plans.length, plans });
});

// POST /api/pricing
const createPlan = asyncHandler(async (req, res) => {
  const plan = await PricingPlan.create(req.body);
  res.status(201).json({ status: 'success', plan });
});

// PATCH /api/pricing/:id
const updatePlan = asyncHandler(async (req, res) => {
  const plan = await PricingPlan.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!plan) throw ApiError.notFound('Plan not found');
  res.status(200).json({ status: 'success', plan });
});

// DELETE /api/pricing/:id
const deletePlan = asyncHandler(async (req, res) => {
  const plan = await PricingPlan.findByIdAndDelete(req.params.id);
  if (!plan) throw ApiError.notFound('Plan not found');
  res.status(204).send();
});

module.exports = { listPublic, listAll, createPlan, updatePlan, deletePlan };
