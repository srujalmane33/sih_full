const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  logger.error(err.message);

  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json({
      success: false,
      error: "Python ML Service is unreachable. Ensure port 8000 is active."
    });
  }

  const statusCode = err.response?.status || 500;
  const message = err.response?.data?.detail || err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    error: message
  });
};