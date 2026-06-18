const ApiError = require("../utils/ApiError");
const env = require("../config/env");

const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const payload = {
    message: statusCode === 500 ? "Internal server error" : error.message
  };

  if (error.details) {
    payload.details = error.details;
  }

  if (env.nodeEnv !== "production" && statusCode === 500) {
    console.error(error);
  }

  res.status(statusCode).json(payload);
};

module.exports = {
  notFoundHandler,
  errorHandler
};
