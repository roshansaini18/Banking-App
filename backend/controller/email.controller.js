require("dotenv").config();
const nodemailer = require("nodemailer");

// ----------------------------------------------------------------
// 1. YOUR REUSABLE EMAIL SERVICE (This part is already correct)
// It knows how to send any email but knows nothing about web routes.
// ----------------------------------------------------------------
const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"S.O Bank" <${process.env.ADMIN_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${options.to}`);
  } catch (error) {
    console.error("Error from email service: ", error);
    throw new Error("Email service failed to send email.");
  }
};


// ----------------------------------------------------------------
// 2. NEW CONTROLLER FUNCTION (This part is new)
// This function is specifically for the route that sends new credentials.
// It knows how to handle `req` and `res`, and it calls the service.
// ----------------------------------------------------------------
const sendCredentialsEmail = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required.", emailSend: false });
  }

  // Your original email template
  const emailTemplate = `
Dear Customer,

Thank you for registering with S.O Bank. We are pleased to provide you with your login credentials. Please find your account details below:

Username: ${email}
Password: ${password}

Kindly ensure that this information is kept confidential. For your security, we recommend changing your password upon first login.

Sincerely,
S.O Bank`;

  try {
    // Call the reusable service with the specific details for this email
    await sendEmail({
      to: email,
      subject: "Your S.O Bank Account Credentials",
      text: emailTemplate,
    });
    
    res.status(200).json({ message: "Credentials sent successfully!", emailSend: true });

  } catch (error) {
    res.status(500).json({ message: "Failed to send credentials email.", emailSend: false });
  }
};


// 3. EXPORT BOTH FUNCTIONS
module.exports = {
  sendEmail,              // The reusable service
  sendCredentialsEmail,   // The new controller for your route
};
