const express = require('express');

const validate = require('../middleware/validate').validate;
const { protect, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/message.controller');
const {
  createConversationSchema,
  createMessageSchema,
} = require('../validators/message.validators');

const router = express.Router();

router.use(protect);
router.use(requireRole('staff', 'admin'));

router
  .route('/')
  .get(ctrl.listConversations)
  .post(validate(createConversationSchema), ctrl.createConversation);

router
  .route('/:id/messages')
  .get(ctrl.listMessages)
  .post(validate(createMessageSchema), ctrl.sendMessage);

module.exports = router;
