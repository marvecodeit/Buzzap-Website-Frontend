const express = require('express');

const { protect, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/notification.controller');

const router = express.Router();

router.use(protect);
router.use(requireRole('staff', 'admin'));

router.get('/', ctrl.listNotifications);
router.patch('/read-all', ctrl.markAllRead);
router.patch('/:id/read', ctrl.markRead);

module.exports = router;
