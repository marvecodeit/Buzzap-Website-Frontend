const express = require('express');
const router = express.Router();
const { handleCalcomWebhook } = require('../controllers/webhook.controller');

router.post('/calcom', handleCalcomWebhook);

module.exports = router;
