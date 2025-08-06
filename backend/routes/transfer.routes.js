const express = require('express');
const router = express.Router();
const transferController = require('../controller/transfer.controller');
const { verifyAuthToken } = require('../middleware/authMiddleware');

// A single, protected route for creating a transfer
router.post('/', verifyAuthToken, transferController.createTransfer);

module.exports = router;
