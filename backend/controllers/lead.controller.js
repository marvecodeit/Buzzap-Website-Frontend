const Lead = require('../models/Lead');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../utils/logger');
const config = require('../config/env');
const { sendMail } = require('../email/mailer');
const { leadConfirmationEmail, newLeadNotificationEmail } = require('../email/templates');
const { notify } = require('../utils/notify');

// POST /api/leads  (public)
const createLead = asyncHandler(async (req, res) => {
  const lead = await Lead.create(req.body);

  // Fire-and-forget emails: confirmation to submitter, notification to agency.
  // Never block or fail the request on email issues.
  const confirm = leadConfirmationEmail(lead.name);
  sendMail({ to: lead.email, ...confirm }).catch((e) => logger.error(e.message));

  const notifyTo = config.LEADS_NOTIFY_EMAIL || config.SMTP_USER;
  if (notifyTo) {
    const notifyEmail = newLeadNotificationEmail(lead);
    sendMail({ to: notifyTo, ...notifyEmail }).catch((e) => logger.error(e.message));
  }

  // In-app notification (broadcast to all admins/staff).
  notify({
    type: 'lead_created',
    title: 'New lead',
    message: `${lead.name}${lead.service ? ` — ${lead.service}` : ''}`,
    link: '/dashboard/leads',
  }).catch(() => {});

  res.status(201).json({
    status: 'success',
    message: "Thanks — we've received your message and will be in touch shortly.",
    lead: { id: lead._id, name: lead.name, email: lead.email },
  });
});

// GET /api/leads  (admin/staff) — filter + paginate
const listLeads = asyncHandler(async (req, res) => {
  const { status, source, page, limit } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (source) filter.source = source;

  const skip = (page - 1) * limit;
  const [leads, total] = await Promise.all([
    Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Lead.countDocuments(filter),
  ]);

  res.status(200).json({
    status: 'success',
    results: leads.length,
    total,
    page,
    pages: Math.ceil(total / limit) || 1,
    leads,
  });
});

// GET /api/leads/:id  (admin/staff)
const getLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) throw ApiError.notFound('Lead not found');
  res.status(200).json({ status: 'success', lead });
});

// PATCH /api/leads/:id  (admin/staff) — update status/note
const updateLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!lead) throw ApiError.notFound('Lead not found');
  res.status(200).json({ status: 'success', lead });
});

// DELETE /api/leads/:id  (admin only)
const deleteLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) throw ApiError.notFound('Lead not found');
  res.status(204).send();
});

module.exports = { createLead, listLeads, getLead, updateLead, deleteLead };
