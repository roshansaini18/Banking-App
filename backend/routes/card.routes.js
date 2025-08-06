const express = require('express');
const router = express.Router();
const cardController = require('../controller/card.controller');
const { verifyAuthToken } = require('../middleware/authMiddleware');

router.use(verifyAuthToken);

router.get('/', cardController.getCardDetails);
router.put('/', cardController.updateCardSettings);

module.exports = router;
