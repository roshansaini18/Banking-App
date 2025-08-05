const User = require("../model/users.model");
const bcrypt = require("bcrypt");
const { sendEmail } = require("./email.controller.js"); // FIX: Import the new email service

/**
 * @description Step 1: Find user by email, generate OTP, and send it via email.
 */
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email address is required." });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({ message: "If an account with that email exists, an OTP has been sent." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.passwordResetOTP = otp;
    user.passwordResetExpires = otpExpires;
    await user.save();

    // FIX: Use the email service instead of console.log
    // We wrap this in a try/catch in case the email fails to send.
    try {
      await sendEmail({
        to: user.email,
        subject: "Your S.O Bank Password Reset OTP",
        text: `Your One-Time Password (OTP) for resetting your password is: ${otp}. This code will expire in 10 minutes.`,
      });
      res.status(200).json({ message: "An OTP has been sent to your email." });
    } catch (emailError) {
      // If the email fails to send, we should undo the OTP save so the user can try again later.
      user.passwordResetOTP = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      
      console.error("Failed to send password reset email:", emailError);
      return res.status(500).json({ message: "Could not send OTP email. Please try again." });
    }

  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// --- NO CHANGES ARE NEEDED FOR THE FUNCTIONS BELOW ---

/**
 * @description Step 2: Verify the OTP sent by the user.
 */
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: "Email and OTP are required." });
  }
  try {
    const user = await User.findOne({
      email,
      passwordResetOTP: otp,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
    }
    res.status(200).json({ success: true, message: "OTP verified successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};

/**
 * @description Step 3: Reset the user's password after successful OTP verification.
 */
exports.resetPassword = async (req, res) => {
  const { email, otp, password } = req.body;
  if (!email || !otp || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    const user = await User.findOne({
      email,
      passwordResetOTP: otp,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }
    user.password = password;
    user.passwordResetOTP = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.status(200).json({ success: true, message: "Password has been reset successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};
