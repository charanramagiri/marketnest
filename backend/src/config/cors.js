const env = require("./env");
const ApiError = require("../utils/ApiError");

const corsOptions = {
  origin(origin, callback) {
    if (!origin || env.allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new ApiError(403, "Origin not allowed by CORS"));
  },
  credentials: true
};

module.exports = corsOptions;
