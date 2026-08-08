const express = require('express');
const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// GET /api/health — liveness + DB state. Does not require a live DB connection;
// it reports the current mongoose readyState so ops can tell them apart.
router.get(
  '/',
  asyncHandler(async (req, res) => {
    res.status(200).json({
      status: 'ok',
      db: mongoose.connection.readyState, // 0=disconnected 1=connected 2=connecting 3=disconnecting
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  })
);

module.exports = router;
