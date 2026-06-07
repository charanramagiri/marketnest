const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const { sendEmail } = require("../services/emailService");

const Otp = require("../models/Otp");

const generateOtp = require("../utils/generateOtp");

const otpEmailTemplate = require("../services/otpEmailTemplate");

const {
  generateAccessToken,
  generateRefreshToken
} = require("../utils/jwt");




// SIGNUP
exports.signup = async (req, res) => {
  try {

    const { name, email, password, role } = req.body;

    // Check if user already exists

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // Remove previous OTP if exists

    await Otp.deleteMany({ email });

    // Hash password

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP

    const otp = generateOtp();

    // Save OTP record

    await Otp.create({
      email,
      otp,
      name,
      password: hashedPassword,
      role,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });

    // Send OTP Email

    await sendEmail(
      email,
      "MarketNest Verification OTP",
      otpEmailTemplate(otp)
    );

    res.status(200).json({
      message: "OTP sent successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Signup failed"
    });
  }
};


// LOGIN
exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false
    });

    res.json({
      accessToken
    });

  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};


// REFRESH TOKEN
exports.refreshToken = async (req, res) => {

  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);

    const accessToken = generateAccessToken(user);

    res.json({
      accessToken
    });

  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};


// LOGOUT
exports.logout = async (req, res) => {

  const token = req.cookies.refreshToken;

  if (!token) {
    return res.sendStatus(204);
  }

  res.clearCookie("refreshToken");

  res.json({
    message: "Logged out successfully"
  });
};

// TEST EMAIL
exports.testEmail = async (req, res) => {
  try {

    await sendEmail(
      req.body.email,
      "MarketNest Test Email",
      `
        <h2>MarketNest</h2>
        <p>Email service is working successfully.</p>
      `
    );

    res.json({
      message: "Email sent successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to send email"
    });

  }
};

// VERIFY OTP
exports.verifyOtp = async (req, res) => {
  try {

    const { email, otp } = req.body;

    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({
        message: "OTP not found"
      });
    }

    // Check expiry
    if (otpRecord.expiresAt < new Date()) {

      await Otp.deleteOne({ _id: otpRecord._id });

      return res.status(400).json({
        message: "OTP expired"
      });
    }

    // Check OTP match
    if (otpRecord.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    // Create user
    await User.create({
      name: otpRecord.name,
      email: otpRecord.email,
      password: otpRecord.password,
      role: otpRecord.role
    });

    // Remove OTP record
    await Otp.deleteOne({ _id: otpRecord._id });

    res.status(201).json({
      message: "Account verified successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "OTP verification failed"
    });
  }
};