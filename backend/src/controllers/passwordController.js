const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/response");
const authService = require("../services/auth.service");

exports.forgotPassword = asyncHandler(async (req, res) => {
    await authService.forgotPassword(req.body);
    sendSuccess(res, null, "Password reset OTP sent");
  });
  
  exports.verifyResetOtp = asyncHandler(async (req, res) => {
    const resetToken = await authService.verifyResetOtp(req.body);
    res.json({ message: "OTP verified successfully", resetToken });
  });
  
  exports.resetPassword = asyncHandler(async (req, res) => {
    await authService.resetPassword(req.body);
    sendSuccess(res, null, "Password updated successfully");
  });
  