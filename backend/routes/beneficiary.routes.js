// In backend/routes/beneficiary.routes.js

const express = require('express');
const router = express.Router();
const beneficiaryController = require('../controller/beneficiary.controller');

// 1. Make sure you are importing your authentication middleware
const { verifyAuthToken } = require('../middleware/authMiddleware');

// 2. FIX: APPLY THE MIDDLEWARE TO ALL ROUTES IN THIS FILE
// This is the essential line you are missing. It runs the token check
// before any of the beneficiary controllers are called.
router.use(verifyAuthToken);

// 3. Now your routes are protected and will have `req.user` available in them
router.route('/')
  .get(beneficiaryController.getBeneficiaries)
  .post(beneficiaryController.createBeneficiary);

router.route('/:id')
  .delete(beneficiaryController.deleteBeneficiary);


module.exports = router;

