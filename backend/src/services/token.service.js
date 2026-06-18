const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { hashValue } = require("../utils/crypto");

const REFRESH_COOKIE_NAME = "refreshToken";
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const generateAccessToken = (user) => jwt.sign(
  { id: user._id, role: user.role },
  env.jwtSecret,
  { expiresIn: "15m" }
);

const generateRefreshToken = (user) => jwt.sign(
  { id: user._id },
  env.jwtRefreshSecret,
  { expiresIn: "7d" }
);

const verifyAccessToken = (token) => jwt.verify(token, env.jwtSecret);

const verifyRefreshToken = (token) => jwt.verify(token, env.jwtRefreshSecret);

const getRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: env.nodeEnv === "production" ? "none" : "lax",
  maxAge: REFRESH_COOKIE_MAX_AGE
});

const hashToken = (token) => hashValue(token);

module.exports = {
  REFRESH_COOKIE_NAME,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  getRefreshCookieOptions,
  hashToken
};
