// Corrected loginFunc

const dbService = require("../services/db.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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

    // --- This payload is for the JWT and should remain minimal for security ---
    const payload = {
      _id: user._id.toString(),
      userType: user.userType,
      email: user.email,
      accountNo: user.accountNo || null,
    };

    // Sign the JWT
    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "3h" }
    );
    
    // --- FIX: This object is sent to the frontend to be stored in localStorage ---
    // We will add all the necessary fields here.
    const userInfoForFrontend = {
      _id: user._id.toString(),
      email: user.email,
      userType: user.userType,
      profile: user.profile,
      fullName: user.fullName, // <-- ADDED
      branch: user.branch,     // <-- ADDED
      accountNo: user.accountNo || null,
    };

    return res.status(200).json({
      message: "Login successful!",
      isLoged: true,
      token,
      userType: user.userType,
      user: userInfoForFrontend, // Send the complete user object for localStorage
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
