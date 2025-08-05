const express = require("express");
const router = express.Router();
const authController = require("../controller/auth.controller");

// 1. Endpoint to send the OTP (You have this already)
router.post("/forgot-password", authController.forgotPassword);

// 2. Endpoint to verify the OTP (You need to create this)
router.post("/verify-otp", authController.verifyOtp);

// 3. Endpoint to reset the password (You need to create this)
router.post("/reset-password", authController.resetPassword);

module.exports = router;
