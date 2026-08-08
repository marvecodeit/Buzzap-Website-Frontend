const mongoose = require('mongoose');
const config = require('./env');
const logger = require('../utils/logger');

// Connect to MongoDB. Guards against duplicate connections (readyState),
// which matters for tests and serverless-style reuse.
async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  try {
    await mongoose.connect(config.MONGO_URI);
    logger.info(`MongoDB connected: ${mongoose.connection.host}`);
    return mongoose.connection;
  } catch (err) {
    logger.error(`MongoDB connection failed: ${err.message}`);
    process.exit(1);
  }
}

module.exports = connectDB;
