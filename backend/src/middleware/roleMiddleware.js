const ApiError = require("../utils/ApiError");

const roleMiddleware = (...allowedRoles) => {

    return (req, res, next) => {
  
      if (!allowedRoles.includes(req.user.role)) {
        return next(new ApiError(403, "Access denied"));
      }
  
      next();
    };
  };
  
  module.exports = roleMiddleware;
