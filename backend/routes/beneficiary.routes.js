const express = require('express');
const router = express.Router();
const beneficiaryController = require('../controller/beneficiary.controller');
const { verifyAuthToken } = require('../middleware/authMiddleware');

router.use(verifyAuthToken);

router.route('/')
  .get(beneficiaryController.getBeneficiaries)
  .post(beneficiaryController.createBeneficiary);

// FIX: The route parameter MUST be named '/:_id' to match the controller
router.route('/:_id')
  .delete(beneficiaryController.deleteBeneficiary);

module.exports = router;
