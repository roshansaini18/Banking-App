const express = require("express");
const router = express.Router();

// IMPORTANT: Import the NEW middleware, not the old service
const { verifyAuthToken } = require("../middleware/authMiddleware");

//
// Use the middleware directly in the route definition.
// It will run and verify the token. If it's valid, it will call the next
// function (req, res) => { ... }. If it's invalid, it will stop and send a 401 error.
//
router.get("/", verifyAuthToken, (req, res) => {
  // If the code execution reaches this point, it means the token was valid.
  // The decoded user data is now available in `req.user`.
  return res.status(200).json({
    message: "Token verified",
    data: req.user,
    isVarified: true,
  });
});

module.exports = router;
