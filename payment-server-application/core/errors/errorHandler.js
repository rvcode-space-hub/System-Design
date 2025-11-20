const logger = require('../../config/logger');

function errorHandler(err, req, res, next) {
  logger.error(err);

  const status = Number(err.status) || 500;

  res.status(status).json({
    error: err.message || "Internal server error",
    code: err.code || "INTERNAL_ERROR",
    timestamp: new Date().toISOString()
  });
}

module.exports = errorHandler;
