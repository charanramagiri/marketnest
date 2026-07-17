const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/response");
const authService = require("../services/auth.service");

exports.signup = asyncHandler(async (req, res) => {
  await authService.signup(req.body);
  sendSuccess(res, null, "OTP sent successfully");
});

exports.verifyOtp = asyncHandler(async (req, res) => {
  await authService.verifySignupOtp(req.body);
  sendSuccess(res, null, "Account verified successfully", 201);
});

exports.resendOtp = asyncHandler(async (req, res) => {
  await authService.resendSignupOtp(req.body);
  sendSuccess(res, null, "OTP resent successfully");
});