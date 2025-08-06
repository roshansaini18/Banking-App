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
  // Get the data from the request body
  let { payeeName, accountNumber } = req.body;
  const ownerId = req.user._id;

  // Basic validation
  if (!payeeName || !accountNumber) {
    return res.status(400).json({ success: false, message: "Payee Name and Account Number are required." });
  }

  try {
    // FIX: Convert the incoming string from the form into a Number to match the database.
    const accountNumberAsNumber = Number(accountNumber.trim());

    // Now, the query will correctly search for a Number.
    const recipientAccount = await Customer.findOne({ accountNumber: accountNumberAsNumber });

    if (!recipientAccount) {
      return res.status(404).json({ success: false, message: 'Recipient account number not found.' });
    }

    if (recipientAccount.email === req.user.email) {
      return res.status(400).json({ success: false, message: "You cannot add yourself as a beneficiary." });
    }

    // Use the original string version for consistency if you save it elsewhere, or the number.
    // Sticking to the original string from the form is fine here.
    const existingBeneficiary = await Beneficiary.findOne({ owner: ownerId, accountNumber: accountNumber.trim() });
    if (existingBeneficiary) {
      return res.status(400).json({ success: false, message: 'This beneficiary is already in your list.' });
    }

    const newBeneficiary = await Beneficiary.create({
      owner: ownerId,
      payeeName,
      accountNumber: accountNumber.trim(), // Save the original string to the beneficiary document
    });
    res.status(201).json({ success: true, data: newBeneficiary });
  } catch (error) {
    console.error("Create Beneficiary Error:", error);
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
