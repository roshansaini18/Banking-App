const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dbService = require("../services/db.service");
const Customer = require("../model/customer.model"); // <-- 1. IMPORT CUSTOMER MODEL
require("dotenv").config();

const loginFunc = async (req, res, schema) => {
  try {
    const { email, password } = req.body;
    const query = { email };

    // This finds the user in the 'users' collection (for admins, employees, customers)
    const user = await dbService.findOneRecord(query, schema);

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials!",
        isLoged: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials!",
        isLoged: false,
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        message: "You are not an active member!",
        isLoged: false,
      });
    }

    // --- LOGIC TO GET ACCOUNT NUMBER ---

    // 2. After verifying the user, find their corresponding customer details
    // This is necessary because accountNo is in the 'customers' collection.
    let customerDetails = null;
    if (user.userType === 'customer') {
      customerDetails = await Customer.findOne({ email: user.email });
    }

    // 3. Create the detailed user object for the frontend (localStorage)
    // We combine info from the 'user' and 'customerDetails' objects.
    const userInfoForFrontend = {
      _id: user._id.toString(),
      email: user.email,
      userType: user.userType,
      fullName: user.fullName,
      profile: user.profile,
      branch: user.branch,
      // Get the account number from customerDetails if it exists
      accountNo: customerDetails ? customerDetails.accountNo : null,
    };

    // 4. Create the minimal, secure payload for the JWT
    const tokenPayload = {
      _id: user._id.toString(),
      userType: user.userType,
    };

    // 5. Sign the JWT
    const token = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET,
        { expiresIn: "3h" }
    );

    // 6. Send the final response
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
