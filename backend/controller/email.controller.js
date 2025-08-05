require("dotenv").config();
const nodemailer = require("nodemailer");

// ----------------------------------------------------------------
// 1. YOUR REUSABLE EMAIL SERVICE (No changes here)
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
// 2. CONTROLLER FOR SENDING NEW ACCOUNT CREDENTIALS (No changes here)
// ----------------------------------------------------------------
const sendCredentialsEmail = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required.", emailSend: false });
  }

  const emailTemplate = `
Dear Customer,
Thank you for registering with S.O Bank. Please find your login credentials below:
Username: ${email}
Password: ${password}
Sincerely,
S.O Bank`;

  try {
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


// ----------------------------------------------------------------
// 3. NEW CONTROLLER FOR SENDING TRANSACTION EMAILS (Add this function)
// ----------------------------------------------------------------
const sendTransactionEmail = async (req, res) => {
  // Destructure all the necessary data from the request body
  const { to, fullName, accountNo, transactionType, transactionAmount, newBalance, currency, reference } = req.body;

  // Basic validation
  if (!to || !fullName || !transactionType || !transactionAmount || !newBalance) {
      return res.status(400).json({ message: "Missing required fields for transaction email.", emailSend: false });
  }

  const type = transactionType === 'cr' ? 'Credit' : 'Debit';
  const currencySymbol = currency === 'inr' ? '₹' : '$';
  
  const subject = `Transaction Alert: ${type} of ${currencySymbol}${transactionAmount}`;
  const emailTemplate = `
Dear ${fullName},

This is a confirmation for a transaction on your account (${accountNo}).

Amount: ${currencySymbol}${Number(transactionAmount).toLocaleString()}
Type: ${type}
Reference: ${reference || 'N/A'}

Your new balance is: ${currencySymbol}${Number(newBalance).toLocaleString()}

Thank you for banking with S.O Bank.`;

  try {
    // Call the reusable service with the transaction details
    await sendEmail({
      to: to,
      subject: subject,
      text: emailTemplate,
    });
    res.status(200).json({ message: "Transaction email sent successfully!", emailSend: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to send transaction email.", emailSend: false });
  }
};


// 4. EXPORT ALL THREE FUNCTIONS
module.exports = {
  sendEmail,
  sendCredentialsEmail,
  sendTransactionEmail, // <-- Make sure to export the new function
};
