const express = require('express');

const validateModule = require('../middleware/validate');
const validate = validateModule.validate;
const validateQuery = validateModule.validateQuery;
const { protect, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/lead.controller');
const {
  createLeadSchema,
  updateLeadSchema,
  listLeadsSchema,
} = require('../validators/lead.validators');

const router = express.Router();

// Public: submit a lead / inquiry (contact form, newsletter).
router.post('/', validate(createLeadSchema), ctrl.createLead);

// Everything below requires an authenticated staff/admin.
router.use(protect);

router.get('/', requireRole('staff', 'admin'), validateQuery(listLeadsSchema), ctrl.listLeads);
router.get('/:id', requireRole('staff', 'admin'), ctrl.getLead);
router.patch('/:id', requireRole('staff', 'admin'), validate(updateLeadSchema), ctrl.updateLead);
router.delete('/:id', requireRole('admin'), ctrl.deleteLead);

module.exports = router;
