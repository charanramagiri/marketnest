const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/response");
const authService = require("../services/auth.service");
const tokenService = require("../services/token.service");

exports.signup = asyncHandler(async (req, res) => {
  await authService.signup(req.body);
  sendSuccess(res, null, "OTP sent successfully");
});

exports.login = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken } = await authService.login(req.body);

  res.cookie(
    tokenService.REFRESH_COOKIE_NAME,
    refreshToken,
    tokenService.getRefreshCookieOptions()
  );

  res.json({ accessToken });
});

exports.refreshToken = asyncHandler(async (req, res) => {
  const accessToken = await authService.refreshAccessToken(
    req.cookies[tokenService.REFRESH_COOKIE_NAME]
  );

  res.json({ accessToken });
});

exports.logout = asyncHandler(async (req, res) => {
  await authService.logout(req.cookies[tokenService.REFRESH_COOKIE_NAME]);
  res.clearCookie(tokenService.REFRESH_COOKIE_NAME, tokenService.getRefreshCookieOptions());
  sendSuccess(res, null, "Logged out successfully");
});

exports.verifyOtp = asyncHandler(async (req, res) => {
  await authService.verifySignupOtp(req.body);
  sendSuccess(res, null, "Account verified successfully", 201);
});

exports.resendOtp = asyncHandler(async (req, res) => {
  await authService.resendSignupOtp(req.body);
  sendSuccess(res, null, "OTP resent successfully");
});

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
