// routes/auth.routes.js
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Temporary OTP store (for production use Redis/DB)
const otpStore = {};

// Create transporter for Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASSWORD,
  },
});

// POST /api/auth/send-otp
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // 1. Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // 2. Save OTP with expiry
    otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

    // 3. Send OTP via Gmail
    await transporter.sendMail({
      from: `"Bank Support" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    });

    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});

// POST /api/auth/verify-otp
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: "Email and OTP required" });
  }

  const record = otpStore[email];
  if (!record) {
    return res.status(400).json({ success: false, message: "OTP expired or not found" });
  }

  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ success: false, message: "OTP expired" });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ success: false, message: "Incorrect OTP" });
  }

  delete otpStore[email]; // Clear OTP after successful verification
  return res.json({ success: true, message: "OTP verified successfully" });
});

module.exports = router;
