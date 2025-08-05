const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dbService = require("../services/db.service");
const Customer = require("../model/customer.model"); // Import the Customer model
require("dotenv").config();

const loginFunc = async (req, res, schema) => {
  try {
    const { email, password } = req.body;
    const query = { email };

    // Step 1: Authenticate against the primary 'users' collection first.
    const user = await dbService.findOneRecord(query, schema);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: "You are not an active member!" });
    }

    // --- This is the corrected logic ---

    // Step 2: Fetch customer-specific details ONLY if the user is a customer.
    let customerDetails = null;
    if (user.userType === 'customer') {
      customerDetails = await Customer.findOne({ email: user.email });
    }

    // Step 3: Build the detailed user object for the frontend.
    // Use the authenticated 'user' object as the base, and add customer details if they exist.
    const userInfoForFrontend = {
      _id: user._id.toString(),
      email: user.email,
      userType: user.userType,
      fullName: user.fullName,
      profile: user.profile,
      branch: user.branch,
      accountNo: customerDetails ? customerDetails.accountNo : null, // Safely get accountNo
    };

    // Step 4: Create the minimal payload for the JWT itself.
    const tokenPayload = {
      _id: user._id.toString(),
      userType: user.userType,
    };

    // Step 5: Sign the token.
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "3h" });

    // Step 6: Send the final, correct response.
    return res.status(200).json({
      message: "Login successful!",
      isLoged: true,
      token: token,
      userType: user.userType,
      user: userInfoForFrontend,
    });
    
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      message: "Internal server error!",
      isLoged: false,
    });
  }
};

module.exports = {
  loginFunc,
};
