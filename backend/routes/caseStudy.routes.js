const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/auth');
const {
  getCaseStudies,
  getCaseStudy,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
} = require('../controllers/caseStudy.controller');

router.get('/', getCaseStudies);
router.get('/:id', getCaseStudy);

router.use(protect);
router.use(requireRole('admin'));

router.post('/', createCaseStudy);
router.patch('/:id', updateCaseStudy);
router.delete('/:id', deleteCaseStudy);

module.exports = router;
