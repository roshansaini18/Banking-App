require("dotenv").config();
const nodemailer = require("nodemailer");

// This is now a reusable 'service' function.
// It accepts an 'options' object so it can send any email.
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      // Using your original environment variables
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"S.O Bank" <${process.env.ADMIN_EMAIL}>`, // Sender display name
    to: options.to,
    subject: options.subject,
    text: options.text,
  };

  // Use await to send the mail and handle errors
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${options.to}`);
  } catch (error) {
    console.error("Error sending email: ", error);
    // Throw the error so the function that called this knows it failed
    throw new Error("Failed to send email.");
  }
};

module.exports = {
  sendEmail,
};
