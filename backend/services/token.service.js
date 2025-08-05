const express = require("express");
const router = express.Router();
// Import the new middleware
const { verifyAuthToken } = require("../authMiddleware");

// 1. Use the middleware first. It will handle all verification.
// 2. If the middleware succeeds, the next function will run.
router.get("/", verifyAuthToken, (req, res) => {
  // If the code reaches here, it means the token was successfully verified
  // The user's decoded data is available in req.user from the middleware
  return res.status(200).json({
    message: "Token verified",
    data: req.user, // Send back the decoded user data
    isVarified: true,
  });
});

module.exports = router;
