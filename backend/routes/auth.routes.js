// POST /api/auth/forgot-password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  
  // 1. Find the user by email in the database
  const user = await User.findOne({ email });
  if (!user) {
    // IMPORTANT: Always send a success-like message to prevent email enumeration attacks
    return res.status(200).json({ message: "If a user with this email exists, an OTP has been sent." });
  }

  // 2. Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // 3. Set an expiry time for the OTP (e.g., 10 minutes from now)
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  // 4. Save the OTP and its expiry time to the user's document in the database
  user.passwordResetOTP = otp;
  user.passwordResetExpires = otpExpires;
  await user.save();

  // 5. Send the OTP to the user's email using a service like Nodemailer
  try {
    await sendEmail({
      to: user.email,
      subject: "Your Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`,
    });
    res.status(200).json({ message: "If a user with this email exists, an OTP has been sent." });
  } catch (error) {
    // If email fails, clear the OTP fields to allow a retry
    user.passwordResetOTP = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.status(500).json({ message: "Error sending email." });
  }
});
