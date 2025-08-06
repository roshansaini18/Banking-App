// In backend/controller/beneficiary.controller.js

// FIX: Ensure all required models are imported at the top
const Beneficiary = require('../model/beneficiary.model');
const Customer = require('../model/customer.model');
const User = require('../model/users.model');

// Controller to get all beneficiaries for the logged-in user
exports.getBeneficiaries = async (req, res) => {
  try {
    const beneficiaries = await Beneficiary.find({ owner: req.user._id });
    res.status(200).json({ success: true, data: beneficiaries });
  } catch (error) {
    console.error("Get Beneficiaries Error:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Controller to create a new beneficiary
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
    // This will log the specific database error to your console
    console.error("Create Beneficiary Error:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Controller to delete a beneficiary
// In backend/controller/beneficiary.controller.js

exports.deleteBeneficiary = async (req, res) => {
  try {
    const beneficiaryIdToDelete = req.params._id;
    const loggedInUserId = req.user._id;

    // --- START OF DEBUGGING BLOCK ---
    console.log("\n--- DEBUGGING deleteBeneficiary ---");
    
    // 1. Log the ID of the user who is currently logged in (from the JWT)
    console.log("Step 1: ID of the currently logged-in user (req.user._id):", loggedInUserId);

    // 2. Find the beneficiary document in the database without checking for the owner
    const beneficiaryDocument = await Beneficiary.findById(beneficiaryIdToDelete);

    if (!beneficiaryDocument) {
      console.log("Step 2: Could not find any beneficiary with the ID:", beneficiaryIdToDelete);
      console.log("--- END OF DEBUGGING ---\n");
      return res.status(404).json({ success: false, message: 'Beneficiary document not found at all.' });
    }

    // 3. Log the 'owner' ID that is stored inside that document
    console.log("Step 2: The beneficiary document was found. Its 'owner' field is:", beneficiaryDocument.owner);
    
    // 4. Log the comparison result
    const isOwner = String(beneficiaryDocument.owner) === String(loggedInUserId);
    console.log(`Step 3: Does the logged-in user ID match the document's owner ID?`, isOwner);

    console.log("--- END OF DEBUGGING ---\n");
    // --- END OF DEBUGGING BLOCK ---


    // This is the original security check
    if (!isOwner) {
      return res.status(404).json({ success: false, message: 'Beneficiary not found or you do not have permission to delete it.' });
    }

    // If the check passes, delete the document
    await Beneficiary.findByIdAndDelete(beneficiaryIdToDelete);
    
    res.status(200).json({ success: true, message: 'Beneficiary deleted successfully.' });

  } catch (error) {
    console.error("CRASH in deleteBeneficiary:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
