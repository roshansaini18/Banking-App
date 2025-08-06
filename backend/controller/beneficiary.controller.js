const Beneficiary = require('../model/beneficiary.model');
const Customer = require('../model/customer.model'); // To validate account numbers
const User = require('../model/users.model'); // To find the customer's account

// Controller to get all beneficiaries for the logged-in user
exports.getBeneficiaries = async (req, res) => {
  try {
    const beneficiaries = await Beneficiary.find({ owner: req.user._id });
    res.status(200).json({ success: true, data: beneficiaries });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Controller to create a new beneficiary
// In backend/controller/beneficiary.controller.js

exports.createBeneficiary = async (req, res) => {
  // FIX: Destructure 'accountNo' to match the form and schema
  const { payeeName, accountNo } = req.body;
  const ownerId = req.user._id;

  try {
    // 1. Check if the recipient account number exists
    // FIX: The query now uses the correct field name 'accountNo'
    const recipientAccount = await Customer.findOne({ accountNo: Number(accountNo.trim()) });
    
    if (!recipientAccount) {
      return res.status(404).json({ success: false, message: 'Recipient account number not found.' });
    }

    // 2. Check if the user is trying to add themselves
    if (recipientAccount.email === req.user.email) {
      return res.status(400).json({ success: false, message: "You cannot add yourself as a beneficiary." });
    }

    // 3. Check if this beneficiary already exists for this user
    // FIX: Use 'accountNo' for the check
    const existingBeneficiary = await Beneficiary.findOne({ owner: ownerId, accountNo: accountNo.trim() });
    if (existingBeneficiary) {
      return res.status(400).json({ success: false, message: 'This beneficiary is already in your list.' });
    }

    // 4. Create and save the new beneficiary
    const newBeneficiary = await Beneficiary.create({
      owner: ownerId,
      payeeName,
      accountNo: accountNo.trim(), // FIX: Use 'accountNo'
    });
    res.status(201).json({ success: true, data: newBeneficiary });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Controller to delete a beneficiary
exports.deleteBeneficiary = async (req, res) => {
  const beneficiaryId = req.params.id;
  const ownerId = req.user._id;

  try {
    // Find the beneficiary by its ID AND make sure it belongs to the logged-in user
    const beneficiary = await Beneficiary.findOneAndDelete({ _id: beneficiaryId, owner: ownerId });

    if (!beneficiary) {
      return res.status(404).json({ success: false, message: 'Beneficiary not found or you do not have permission to delete it.' });
    }

    res.status(200).json({ success: true, message: 'Beneficiary deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }

};

