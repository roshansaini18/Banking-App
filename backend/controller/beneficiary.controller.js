const Beneficiary = require('../model/beneficiary.model');
const Customer = require('../model/customer.model');
const User = require('../model/users.model');

exports.getBeneficiaries = async (req, res) => {
  try {
    const beneficiaries = await Beneficiary.find({ owner: req.user._id });
    res.status(200).json({ success: true, data: beneficiaries });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createBeneficiary = async (req, res) => {
  let { payeeName, accountNo } = req.body;
  const ownerId = req.user._id;

  if (!payeeName || !accountNo) {
    return res.status(400).json({ success: false, message: "Payee Name and Account Number are required." });
  }

  try {
    accountNo = accountNo.trim();
    const recipientAccount = await Customer.findOne({ accountNo: Number(accountNo) });

    if (!recipientAccount) {
      return res.status(404).json({ success: false, message: 'Recipient account number not found.' });
    }
    if (recipientAccount.email === req.user.email) {
      return res.status(400).json({ success: false, message: "You cannot add yourself as a beneficiary." });
    }
    const existingBeneficiary = await Beneficiary.findOne({ owner: ownerId, accountNo: accountNo });
    if (existingBeneficiary) {
      return res.status(400).json({ success: false, message: 'This beneficiary is already in your list.' });
    }
    const newBeneficiary = await Beneficiary.create({
      owner: ownerId,
      payeeName,
      accountNo: accountNo,
    });
    res.status(201).json({ success: true, data: newBeneficiary });
  } catch (error) {
    console.error("Create Beneficiary Error:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteBeneficiary = async (req, res) => {
  try {
    // This now correctly reads the '_id' parameter from the route
    const beneficiaryId = req.params._id;
    const ownerId = req.user._id;

    const beneficiary = await Beneficiary.findOneAndDelete({ _id: beneficiaryId, owner: ownerId });

    if (!beneficiary) {
      return res.status(404).json({ success: false, message: 'Beneficiary not found or you do not have permission to delete it.' });
    }

    res.status(200).json({ success: true, message: 'Beneficiary deleted successfully.' });
  } catch (error) {
    console.error("Delete Beneficiary Error:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
