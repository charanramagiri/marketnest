const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/response");
const ApiError = require("../utils/ApiError");

const googleAuthService = require("../services/googleAuthService");
const authService = require("../services/auth.service");
const tokenService = require("../services/token.service");
const User = require("../models/User");

const googleLogin = asyncHandler(async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return sendSuccess(
      res,
      null,
      "Google credential is required",
      400
    );
  }

  const googleUser =
    await googleAuthService.verifyGoogleToken(credential);

  const user = await User.findOne({
    email: googleUser.email
  });

  // Existing user
  if (user) {
    const { accessToken, refreshToken } =
      await authService.googleLoginExistingUser(user, googleUser);

    return sendSuccess(
      res,
      {
        isNewUser: false,
        accessToken,
        refreshToken,
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
      isNewUser: true,
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
      googleId: googleUser.googleId
    },
    "Complete signup"
  );
});

const completeGoogleSignup = asyncHandler(async (req, res) => {
  const { email, googleId, name, avatar, role } = req.body;

  if (!email || !googleId || !name || !role) {
    throw new ApiError(400, "Missing required fields");
  }

  const { accessToken, refreshToken } = await authService.completeGoogleSignup({
    email,
    googleId,
    name,
    avatar,
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
