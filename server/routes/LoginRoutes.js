const express = require("express");
const router = express.Router();
const LoginController = require("../controllers/LoginController");

// Define routes for appointments
// router.post('/login', LoginController.fetchDetails);
router.post("/superadmin/login", LoginController.superAdminLogin);
router.post("/salonadmin/login", LoginController.salonAdminLogin);

// OTP Login routes
router.post("/salonadmin/send-login-otp", LoginController.salonAdminSendLoginOtp);
router.post("/salonadmin/login-with-otp", LoginController.salonAdminLoginWithOtp);
router.post("/superadmin/send-login-otp", LoginController.superAdminSendLoginOtp);
router.post("/superadmin/login-with-otp", LoginController.superAdminLoginWithOtp);

router.post(
  "/salonadmin/forgot-password",
  LoginController.salonAdminForgotPassword
);
router.post(
  "/salonadmin/reset-password",
  LoginController.salonAdminResetPassword
);
router.post("/salonadmin/verify-otp", LoginController.salonAdminVerifyOtp);

router.post(
  "/superadmin/forgot-password",
  LoginController.superAdminForgotPassword
);
router.post("/superadmin/verify-otp", LoginController.superAdminVerifyOtp);
router.post(
  "/superadmin/reset-password",
  LoginController.superAdminResetPassword
);

module.exports = router;
