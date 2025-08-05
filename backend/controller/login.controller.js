// Corrected loginFunc

const dbService = require("../services/db.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// Customer model is not needed here anymore, we can remove it.

const loginFunc = async (req, res, schema) => {
  try {
    const { email, password } = req.body;
    const query = { email };

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

    // --- FIX: Create a minimal and secure payload ---
    // Only include essential, non-sensitive information.
    const payload = {
      _id: user._id.toString(),
      userType: user.userType,
      email: user.email,
      // You can add accountNo if it's frequently needed and not highly sensitive
      accountNo: user.accountNo || null 
    };

    // Sign the new, smaller payload
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );
    
    // We can also send back some user info to the frontend if needed
    const userInfoForFrontend = {
        email: user.email,
        userType: user.userType,
        profile: user.profile,
        accountNo: user.accountNo
    }

    return res.status(200).json({
      message: "Login successful!",
      isLoged: true,
      token,
      userType: user.userType,
      user: userInfoForFrontend // Send minimal user object for localStorage
    });

  } catch (error) {
    console.error("Login Error:", error); // Log the actual error on the server
    return res.status(500).json({
      message: "Internal server error!",
      isLoged: false,
    });
  }
};

module.exports = {
  loginFunc,
};
