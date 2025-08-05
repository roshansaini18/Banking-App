require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyAuthToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized: No token provided or token is malformed.",
      isVarified: false,
    });
  }

  // FIX: Correctly split the header to get the token
  // "Bearer <token>" becomes an array ['Bearer', '<token>']
  // We take the second element [1]
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the decoded user payload to the request object
    // so subsequent routes can access it if needed
    req.user = decoded; 

    // If verification is successful, call next() to proceed
    next();

  } catch (error) {
    // This will catch errors for expired or invalid tokens
    return res.status(401).json({
      message: "Unauthorized: Invalid token.",
      isVarified: false,
      error: error.message, // Send back a clear error message
    });
  }
};

module.exports = {
  verifyAuthToken,
};
