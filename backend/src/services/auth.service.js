const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/User");
const Otp = require("../models/Otp");
const ApiError = require("../utils/ApiError");
const { sendEmail } = require("./emailService");
const otpEmailTemplate = require("./otpEmailTemplate");
const otpService = require("./otp.service");
const tokenService = require("./token.service");
const { hashValue } = require("../utils/crypto");

const signup = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const { otp } = await otpService.createOtpRecord({
    email,
    purpose: "signup",
    signupData: {
      name,
      password: hashedPassword,
      role
    }
  });

  await sendEmail(email, "MarketNest Verification OTP", otpEmailTemplate(otp));
};

const verifySignupOtp = async ({ email, otp }) => {
  const record = await otpService.verifyOtp({ email, otp, purpose: "signup" });

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    await Otp.deleteOne({ _id: record._id });
    throw new ApiError(400, "User already exists");
  }

  await User.create({
    name: record.name,
    email: record.email,
    password: record.password,
    role: record.role
  });

  await Otp.deleteOne({ _id: record._id });
};

const resendSignupOtp = async ({ email }) => {
  const { otp } = await otpService.resendOtp({ email, purpose: "signup" });
  await sendEmail(email, "MarketNest Verification OTP", otpEmailTemplate(otp));
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(400, "Invalid credentials");
  }

  return await loginUser(user);
};

const loginUser = async (user) => {
  const accessToken = tokenService.generateAccessToken(user);
  const refreshToken = tokenService.generateRefreshToken(user);

  user.refreshToken = tokenService.hashToken(refreshToken);
  await user.save();

  return {
    accessToken,
    refreshToken,
    user
  };
};

const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError(401, "Unauthorized");
  }

  const decoded = tokenService.verifyRefreshToken(refreshToken);
  const user = await User.findById(decoded.id);

  if (!user || user.refreshToken !== tokenService.hashToken(refreshToken)) {
    throw new ApiError(403, "Invalid refresh token");
  }

  return tokenService.generateAccessToken(user);
};

const logout = async (refreshToken) => {
  if (!refreshToken) {
    return;
  }

  const tokenHash = tokenService.hashToken(refreshToken);
  await User.findOneAndUpdate({ refreshToken: tokenHash }, { refreshToken: null });
};

const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const { otp } = await otpService.createOtpRecord({
    email,
    purpose: "reset-password"
  });

  await sendEmail(email, "MarketNest Password Reset OTP", otpEmailTemplate(otp));
};

const verifyResetOtp = async ({ email, otp }) => {
  const record = await otpService.verifyOtp({ email, otp, purpose: "reset-password" });
  return otpService.markResetVerified(record);
};

const resetPassword = async ({ email, password, resetToken }) => {
  const record = await Otp.findOne({
    email,
    purpose: "reset-password",
    isVerified: true,
    resetTokenHash: hashValue(resetToken)
  });

  if (!record || record.resetTokenExpiresAt < new Date()) {
    throw new ApiError(400, "OTP verification required");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.findOneAndUpdate(
    { email },
    {
      password: hashedPassword,
      refreshToken: null
    }
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await Otp.deleteMany({ email, purpose: "reset-password" });
};

const completeGoogleSignup = async ({ email, googleId, name, avatar, role }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  if (!["customer", "brand"].includes(role)) {
    throw new ApiError(400, "Invalid role selected");
  }

  const hashedPassword = await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    provider: "google",
    googleId,
    avatar: avatar || null
  });

  return loginUser(user);
};

const googleLoginExistingUser = async (user, { googleId, picture }) => {
  if (user.provider === "local") {
    user.provider = "google";
    user.googleId = googleId;
    user.avatar = picture || user.avatar;
    await user.save();
  }

  return loginUser(user);
};

module.exports = {
  signup,
  verifySignupOtp,
  resendSignupOtp,
  login,
  loginUser,
  refreshAccessToken,
  logout,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  completeGoogleSignup,
  googleLoginExistingUser
};
