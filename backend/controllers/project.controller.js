const mongoose = require('mongoose');
const Project = require('../models/Project');
const Milestone = require('../models/Milestone');
const Lead = require('../models/Lead');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { notify } = require('../utils/notify');

// All project routes are admin/staff-only (enforced in the router), so there's
// no per-client ownership scoping here — every authed user manages everything.

// POST /api/projects
const createProject = asyncHandler(async (req, res) => {
  // The "client" is a Lead (the contact who inquired). Verify it exists.
  const lead = await Lead.findById(req.body.client);
  if (!lead) throw ApiError.badRequest('Client (lead) not found');

  const project = await Project.create({ ...req.body, createdBy: req.user._id });

  notify({
    type: 'project_created',
    title: 'Project created',
    message: `"${project.title}" for ${lead.name}`,
    link: `/dashboard/projects/${project._id}`,
    email: true,
  }).catch(() => {});

  res.status(201).json({ status: 'success', project });
});

// GET /api/projects
const listProjects = asyncHandler(async (req, res) => {
  const { status, client, page, limit } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (client) filter.client = client;

  const skip = (page - 1) * limit;
  const [projects, total] = await Promise.all([
    Project.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('client', 'name email company'),
    Project.countDocuments(filter),
  ]);

  res.status(200).json({
    status: 'success',
    results: projects.length,
    total,
    page,
    pages: Math.ceil(total / limit) || 1,
    projects,
  });
});

// GET /api/projects/:id — includes milestones
const getProject = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw ApiError.notFound('Project not found');
  const project = await Project.findById(req.params.id).populate('client', 'name email company');
  if (!project) throw ApiError.notFound('Project not found');

  const milestones = await Milestone.find({ project: project._id }).sort({ order: 1, createdAt: 1 });
  res.status(200).json({ status: 'success', project, milestones });
});

// PATCH /api/projects/:id
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw ApiError.notFound('Project not found');

  Object.assign(project, req.body);
  await project.save(); // save (not findByIdAndUpdate) so slug hook runs on title change
  res.status(200).json({ status: 'success', project });
});

// DELETE /api/projects/:id — cascades milestones
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) throw ApiError.notFound('Project not found');
  await Milestone.deleteMany({ project: project._id });
  res.status(204).send();
});

// --- Milestones (nested under a project) ---

// GET /api/projects/:id/milestones
const listMilestones = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw ApiError.notFound('Project not found');
  const project = await Project.findById(req.params.id);
  if (!project) throw ApiError.notFound('Project not found');

  const milestones = await Milestone.find({ project: project._id }).sort({ order: 1, createdAt: 1 });
  res.status(200).json({ status: 'success', results: milestones.length, milestones });
});

// POST /api/projects/:id/milestones
const createMilestone = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw ApiError.notFound('Project not found');

  const milestone = await Milestone.create({ ...req.body, project: project._id });
  res.status(201).json({ status: 'success', milestone });
});

// PATCH /api/projects/:id/milestones/:milestoneId
const updateMilestone = asyncHandler(async (req, res) => {
  const milestone = await Milestone.findOne({
    _id: mongoose.isValidObjectId(req.params.milestoneId) ? req.params.milestoneId : null,
    project: req.params.id,
  });
  if (!milestone) throw ApiError.notFound('Milestone not found');

  const wasCompleted = milestone.status === 'completed';
  Object.assign(milestone, req.body);
  await milestone.save(); // save so completedAt hook runs

  // Notify when a milestone transitions into "completed".
  if (!wasCompleted && milestone.status === 'completed') {
    notify({
      type: 'milestone_completed',
      title: 'Milestone completed',
      message: milestone.title,
      link: `/dashboard/projects/${req.params.id}`,
      email: true,
    }).catch(() => {});
  }

  res.status(200).json({ status: 'success', milestone });
});

// DELETE /api/projects/:id/milestones/:milestoneId
const deleteMilestone = asyncHandler(async (req, res) => {
  const milestone = await Milestone.findOneAndDelete({
    _id: mongoose.isValidObjectId(req.params.milestoneId) ? req.params.milestoneId : null,
    project: req.params.id,
  });
  if (!milestone) throw ApiError.notFound('Milestone not found');
  res.status(204).send();
});

module.exports = {
  createProject,
  listProjects,
  getProject,
  updateProject,
  deleteProject,
  listMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
};
