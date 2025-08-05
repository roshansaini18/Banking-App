const express = require("express");
const router = express.Router();

const emailController = require("../controller/email.controller");

// FIX: Point the route to the new 'sendCredentialsEmail' controller function,
// not the 'sendEmail' service.
router.post("/", emailController.sendCredentialsEmail);

module.exports = router;
