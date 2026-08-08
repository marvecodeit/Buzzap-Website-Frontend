const CaseStudy = require('../models/CaseStudy');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/case-studies (public)
const getCaseStudies = asyncHandler(async (req, res) => {
  const { featured } = req.query;
  const filter = {};
  if (featured === 'true') filter.isFeatured = true;

  const caseStudies = await CaseStudy.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ status: 'success', results: caseStudies.length, caseStudies });
});

// GET /api/case-studies/:id (public)
const getCaseStudy = asyncHandler(async (req, res) => {
  const caseStudy = await CaseStudy.findById(req.params.id);
  if (!caseStudy) throw ApiError.notFound('Case study not found');
  res.status(200).json({ status: 'success', caseStudy });
});

// POST /api/case-studies (admin)
const createCaseStudy = asyncHandler(async (req, res) => {
  const caseStudy = await CaseStudy.create(req.body);
  res.status(201).json({ status: 'success', caseStudy });
});

// PATCH /api/case-studies/:id (admin)
const updateCaseStudy = asyncHandler(async (req, res) => {
  const caseStudy = await CaseStudy.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!caseStudy) throw ApiError.notFound('Case study not found');
  res.status(200).json({ status: 'success', caseStudy });
});

// DELETE /api/case-studies/:id (admin)
const deleteCaseStudy = asyncHandler(async (req, res) => {
  const caseStudy = await CaseStudy.findByIdAndDelete(req.params.id);
  if (!caseStudy) throw ApiError.notFound('Case study not found');
  res.status(204).send();
});

module.exports = {
  getCaseStudies,
  getCaseStudy,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
};
