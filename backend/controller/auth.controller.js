const User = require("../model/users.model");
const bcrypt = require("bcrypt");
// const sendEmail = require("../services/email.service"); // You will need an email service for production

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
    console.log(`Password Reset OTP for ${user.email}: ${otp}`); // For testing
    res.status(200).json({ message: "An OTP has been sent to your email." });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

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
    console.error("Verify OTP Error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, otp, password } = req.body;
  if (!email || !otp || !password) {
    return res.status(400).json({ message: "Email, OTP, and new password are required." });
  }
  try {
    const user = await User.findOne({
      email,
      passwordResetOTP: otp,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP. Cannot reset password." });
    }
    user.password = password; // Set plain-text password, the pre-save hook will hash it
    user.passwordResetOTP = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.status(200).json({ success: true, message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
