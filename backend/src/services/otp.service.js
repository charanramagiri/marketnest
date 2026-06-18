const bcrypt = require("bcrypt");
const Otp = require("../models/Otp");
const ApiError = require("../utils/ApiError");
const generateOtp = require("../utils/generateOtp");
const { createSecureToken, hashValue } = require("../utils/crypto");

const OTP_TTL_MS = 5 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;

const createOtpRecord = async ({ email, purpose, signupData = null }) => {
  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);

  await Otp.deleteMany({ email, purpose });

  const record = await Otp.create({
    email,
    otpHash,
    purpose,
    attempts: 0,
    isVerified: false,
    resendAvailableAt: new Date(Date.now() + RESEND_COOLDOWN_MS),
    expiresAt: new Date(Date.now() + OTP_TTL_MS),
    ...(signupData || {})
  });

  return { otp, record };
};

const resendOtp = async ({ email, purpose }) => {
  const record = await Otp.findOne({ email, purpose });

  if (!record) {
    throw new ApiError(400, purpose === "signup" ? "No pending verification found" : "No reset request found");
  }

  if (record.resendAvailableAt && record.resendAvailableAt > new Date()) {
    throw new ApiError(429, "Please wait before requesting another OTP");
  }

  const otp = generateOtp();
  record.otpHash = await bcrypt.hash(otp, 10);
  record.attempts = 0;
  record.expiresAt = new Date(Date.now() + OTP_TTL_MS);
  record.resendAvailableAt = new Date(Date.now() + RESEND_COOLDOWN_MS);

  await record.save();
  return { otp, record };
};

const verifyOtp = async ({ email, otp, purpose }) => {
  const record = await Otp.findOne({ email, purpose });

  if (!record) {
    throw new ApiError(400, "OTP not found");
  }

  if (record.expiresAt < new Date()) {
    await Otp.deleteOne({ _id: record._id });
    throw new ApiError(400, "OTP expired");
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    await Otp.deleteOne({ _id: record._id });
    throw new ApiError(429, "Too many invalid OTP attempts");
  }

  const isMatch = await bcrypt.compare(otp, record.otpHash);

  if (!isMatch) {
    record.attempts += 1;
    await record.save();
    throw new ApiError(400, "Invalid OTP");
  }

  return record;
};

const markResetVerified = async (record) => {
  const resetToken = createSecureToken();

  record.isVerified = true;
  record.resetTokenHash = hashValue(resetToken);
  record.resetTokenExpiresAt = new Date(Date.now() + OTP_TTL_MS);
  await record.save();

  return resetToken;
};

module.exports = {
  createOtpRecord,
  resendOtp,
  verifyOtp,
  markResetVerified
};
