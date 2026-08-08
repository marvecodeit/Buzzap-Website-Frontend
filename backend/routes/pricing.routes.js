const express = require('express');

const validate = require('../middleware/validate').validate;
const { protect, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/pricing.controller');
const { createPlanSchema, updatePlanSchema } = require('../validators/pricing.validators');

const router = express.Router();

const managers = [protect, requireRole('staff', 'admin')];

// --- Admin (before any dynamic segments) ---
router.get('/admin/all', ...managers, ctrl.listAll);
router.post('/', ...managers, validate(createPlanSchema), ctrl.createPlan);
router.patch('/:id', ...managers, validate(updatePlanSchema), ctrl.updatePlan);
router.delete('/:id', ...managers, ctrl.deletePlan);

// --- Public ---
router.get('/', ctrl.listPublic);

module.exports = router;
