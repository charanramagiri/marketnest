const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/response");
const authService = require("../services/auth.service");
const tokenService = require("../services/token.service");



exports.login = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken } = await authService.login(req.body);

  res.cookie(
    tokenService.REFRESH_COOKIE_NAME,
    refreshToken,
    tokenService.getRefreshCookieOptions()
  );

  res.json({ accessToken });
});


exports.logout = asyncHandler(async (req, res) => {
  await authService.logout(req.cookies[tokenService.REFRESH_COOKIE_NAME]);
  res.clearCookie(tokenService.REFRESH_COOKIE_NAME, tokenService.getRefreshCookieOptions());
  sendSuccess(res, null, "Logged out successfully");
});


exports.refreshToken = asyncHandler(async (req, res) => {
  const accessToken = await authService.refreshAccessToken(
    req.cookies[tokenService.REFRESH_COOKIE_NAME]
  );

  res.json({ accessToken });
});