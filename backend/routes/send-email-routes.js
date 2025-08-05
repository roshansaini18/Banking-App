const express = require("express");
const router = express.Router();
const emailController = require("../controller/email.controller");

// Route for sending NEW ACCOUNT credentials
router.post("/", emailController.sendCredentialsEmail);

// FIX: Add a new, dedicated route for sending TRANSACTION confirmations
router.post("/transaction", emailController.sendTransactionEmail);

module.exports = router;
