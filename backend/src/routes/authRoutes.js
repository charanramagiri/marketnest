const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const otpController = require("../controllers/otpController");
const passwordController = require("../controllers/passwordController");
const googleAuthController = require("../controllers/googleAuthController");
const validate = require("../middleware/validate.middleware");
const authValidation = require("../validations/auth.validation");

router.post("/signup", otpController.signup);

router.post("/verify-otp", otpController.verifyOtp);

router.post("/resend-otp", otpController.resendOtp);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

router.post("/refresh", authController.refreshToken);

router.post(
  "/forgot-password",
  passwordController.forgotPassword
);

router.post(
  "/verify-reset-otp",
  passwordController.verifyResetOtp
);

router.post(
  "/reset-password",
  passwordController.resetPassword
);

// Google
router.post(
  "/google",
  googleAuthController.googleLogin
);

router.post(
  "/google/complete",
  googleAuthController.completeGoogleSignup
);
module.exports = router;
