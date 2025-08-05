const User = require("../model/users.model");
const bcrypt = require("bcrypt");
// const sendEmail = require("../services/email.service"); // You will need an email service for production

/**
 * @description Step 1: Find user by email, generate OTP, and send it.
 */
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email address is required." });
  }

  try {
    const user = await User.findOne({ email });

    // To prevent attackers from checking which emails are registered,
    // we send a generic success message even if the user is not found.
    if (!user) {
      return res.status(200).json({ message: "If an account with that email exists, a password reset OTP has been sent." });
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Set OTP to expire in 10 minutes
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Save the OTP and its expiry time to the user's document
    user.passwordResetOTP = otp;
    user.passwordResetExpires = otpExpires;
    await user.save();

    // In a real application, you would send the email here
    // await sendEmail({ to: user.email, subject: "Your Password Reset OTP", text: `Your OTP is: ${otp}` });
    
    // For testing purposes, we can log the OTP to the console
    console.log(`Password Reset OTP for ${user.email}: ${otp}`);

    res.status(200).json({ message: "If an account with that email exists, a password reset OTP has been sent." });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};


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
      passwordResetExpires: { $gt: Date.now() }, // Check that OTP is not expired
    });

    // If no user is found with that email, a matching OTP, and a valid expiry time
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
    }

    // If verification is successful
    res.status(200).json({ success: true, message: "OTP verified successfully." });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};


/**
 * @description Step 3: Reset the user's password after successful OTP verification.
 */
exports.resetPassword = async (req, res) => {
  const { email, otp, password } = req.body;

  if (!email || !otp || !password) {
    return res.status(400).json({ message: "Email, OTP, and new password are required." });
  }

  try {
    // For security, we re-verify the OTP one last time before changing the password
    const user = await User.findOne({
      email,
      passwordResetOTP: otp,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP. Cannot reset password." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password
    user.password = hashedPassword;
    
    // CRUCIAL: Clear the OTP fields after use to prevent them from being used again
    user.passwordResetOTP = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.status(200).json({ success: true, message: "Password has been reset successfully." });

  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
