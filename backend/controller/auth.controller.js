const User = require("../model/users.model"); // Assuming your user model is here
// You will need a service to send emails, like Nodemailer
// const sendEmail = require("../services/email.service"); 

// This function handles the start of the password reset process
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    // 1. Find the user by email in the database
    const user = await User.findOne({ email });
    if (!user) {
      // IMPORTANT: To prevent attacks, don't reveal if a user exists or not.
      return res.status(200).json({ message: "If a user with this email exists, an OTP has been sent." });
    }

    // 2. Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 3. Set an expiry time for the OTP (e.g., 10 minutes from now)
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // 4. Save the OTP and its expiry to the user's document
    user.passwordResetOTP = otp;
    user.passwordResetExpires = otpExpires;
    await user.save();

    // 5. Send the OTP to the user's email
    // You need to implement an email sending service (like Nodemailer) for this to work
    /*
    await sendEmail({
      to: user.email,
      subject: "Your Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`,
    });
    */
    console.log(`OTP for ${user.email}: ${otp}`); // For testing without a real email service

    res.status(200).json({ message: "If a user with this email exists, an OTP has been sent." });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// You will also need to create functions for verify-otp and reset-password
// exports.verifyOtp = ...
// exports.resetPassword = ...
