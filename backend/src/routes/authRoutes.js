const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const otpController = require("../controllers/otpController");
const passwordController = require("../controllers/passwordController");
const googleAuthController = require("../controllers/googleAuthController");
const validate = require("../middleware/validate.middleware");
const authValidation = require("../validations/auth.validation");

router.post("/signup", validate(authValidation.signup), otpController.signup);

router.post("/verify-otp", validate(authValidation.verifyOtp), otpController.verifyOtp);

router.post("/resend-otp", validate(authValidation.emailOnly), otpController.resendOtp);

router.post("/login", validate(authValidation.login), authController.login);

router.post("/logout", authController.logout);

router.post("/refresh", authController.refreshToken);

router.post(
  "/forgot-password",
  validate(authValidation.emailOnly),
  passwordController.forgotPassword
);

router.post(
  "/verify-reset-otp",
  validate(authValidation.verifyOtp),
  passwordController.verifyResetOtp
);

router.post(
  "/reset-password",
  validate(authValidation.resetPassword),
  passwordController.resetPassword
);

// Google
router.post(
  "/google",
  validate(authValidation.googleLogin),
  googleAuthController.googleLogin
);

router.post(
  "/google/complete",
  validate(authValidation.completeGoogleSignup),
  googleAuthController.completeGoogleSignup
);
module.exports = router;
