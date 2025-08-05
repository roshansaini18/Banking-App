const express = require("express");
const router = express.Router();

// Import the new controller and middleware
const uploadController = require("../controller/upload.controllers");
const uploadMiddleware = require("../middleware/upload.middleware");

// Define the route.
// The 'uploadMiddleware.single("file")' part will process the incoming file
// and make it available in 'req.file' before calling 'uploadController.uploadFile'.
router.post("/", uploadMiddleware.single("file"), uploadController.uploadFile);

module.exports = router;
