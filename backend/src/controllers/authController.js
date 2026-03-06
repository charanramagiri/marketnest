const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const {
  generateAccessToken,
  generateRefreshToken
} = require("../utils/jwt");


// SIGNUP
exports.signup = async (req, res) => {
  try {

    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      message: "User created successfully"
    });

  } catch (error) {
    res.status(500).json({ message: "Signup failed" });
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