const express = require('express');

const validateModule = require('../middleware/validate');
const validate = validateModule.validate;
const validateQuery = validateModule.validateQuery;
const { protect, requireRole } = require('../middleware/auth');
const { singleFile } = require('../middleware/upload');
const ctrl = require('../controllers/project.controller');
const assetCtrl = require('../controllers/asset.controller');
const {
  createProjectSchema,
  updateProjectSchema,
  listProjectsSchema,
  createMilestoneSchema,
  updateMilestoneSchema,
} = require('../validators/project.validators');

const router = express.Router();

// Everything here requires an authenticated staff/admin (no client accounts exist).
router.use(protect);
router.use(requireRole('staff', 'admin'));

const managers = requireRole('staff', 'admin');

// Projects
router
  .route('/')
  .get(validateQuery(listProjectsSchema), ctrl.listProjects)
  .post(managers, validate(createProjectSchema), ctrl.createProject);

router
  .route('/:id')
  .get(ctrl.getProject)
  .patch(managers, validate(updateProjectSchema), ctrl.updateProject)
  .delete(requireRole('admin'), ctrl.deleteProject);

// Milestones (nested)
router
  .route('/:id/milestones')
  .get(ctrl.listMilestones)
  .post(managers, validate(createMilestoneSchema), ctrl.createMilestone);

router
  .route('/:id/milestones/:milestoneId')
  .patch(managers, validate(updateMilestoneSchema), ctrl.updateMilestone)
  .delete(managers, ctrl.deleteMilestone);

// Assets (files) — nested under a project
router
  .route('/:id/assets')
  .get(assetCtrl.listAssets)
  .post(managers, singleFile, assetCtrl.uploadAsset);

router.delete('/:id/assets/:assetId', managers, assetCtrl.deleteAsset);

module.exports = router;
