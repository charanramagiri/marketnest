const ApiError = require("../utils/ApiError");
const { verifyAccessToken } = require("../services/token.service");

const authMiddleware = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Unauthorized"));
  }

  const token = authHeader.split(" ")[1];

  try {

    const decoded = verifyAccessToken(token);

    req.user = decoded;

    next();

  } catch (error) {

    return next(new ApiError(403, "Invalid or expired token"));

  }
};

module.exports = authMiddleware;
