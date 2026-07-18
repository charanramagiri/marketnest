const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/response");
const googleAuthService = require("../services/googleAuthService");
const authService = require("../services/auth.service");
const tokenService = require("../services/token.service");
const User = require("../models/User");

const googleLogin = asyncHandler(async (req, res) => {
  const { credential } = req.body;

  const googleUser =
    await googleAuthService.verifyGoogleToken(credential);

  const user = await User.findOne({
    email: googleUser.email
  });

  // Existing user
  if (user) {
    const { accessToken, refreshToken } =
      await authService.googleLoginExistingUser(user, googleUser);

    res.cookie(
      tokenService.REFRESH_COOKIE_NAME,
      refreshToken,
      tokenService.getRefreshCookieOptions()
    );

    return sendSuccess(
      res,
      {
        isNewUser: false,
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        }
      },
      "Login successful"
    );
  }

  // New Google user
  return sendSuccess(
    res,
    {
      isNewUser: true
    },
    "Complete signup"
  );
});

const completeGoogleSignup = asyncHandler(async (req, res) => {
  const { credential, role } = req.body;
  const googleUser = await googleAuthService.verifyGoogleToken(credential);

  const { accessToken, refreshToken } = await authService.completeGoogleSignup({
    email: googleUser.email,
    googleId: googleUser.googleId,
    name: googleUser.name,
    avatar: googleUser.picture,
    role
  });

  res.cookie(
    tokenService.REFRESH_COOKIE_NAME,
    refreshToken,
    tokenService.getRefreshCookieOptions()
  );

  res.json({ accessToken });
});

module.exports = {
  googleLogin,
  completeGoogleSignup
};
