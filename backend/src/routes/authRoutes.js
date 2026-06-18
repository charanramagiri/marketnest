const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const validate = require("../middleware/validate.middleware");
const authValidation = require("../validations/auth.validation");

router.post("/signup", validate(authValidation.signup), authController.signup);
router.post("/login", validate(authValidation.login), authController.login);
router.post("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);

router.post("/verify-otp", validate(authValidation.verifyOtp), authController.verifyOtp);
router.post("/resend-otp", validate(authValidation.emailOnly), authController.resendOtp);

router.post("/forgot-password", validate(authValidation.emailOnly), authController.forgotPassword);
router.post("/verify-reset-otp", validate(authValidation.verifyOtp), authController.verifyResetOtp);
router.post("/reset-password", validate(authValidation.resetPassword), authController.resetPassword);

module.exports = router;
