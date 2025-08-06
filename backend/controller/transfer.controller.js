const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Customer = require('../model/customer.model');
const Beneficiary = require('../model/beneficiary.model');
const Transaction = require('../model/transaction.model'); // Assuming you have a transaction model
const User = require('../model/users.model');

exports.createTransfer = async (req, res) => {
  // 1. Start a MongoDB Session for an atomic transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { beneficiaryId, amount, password, reference } = req.body;
    const senderUserId = req.user._id;

    // --- VALIDATION ---
    if (!beneficiaryId || !amount || !password) {
      throw new Error('Beneficiary, amount, and password are required.');
    }
    if (Number(amount) <= 0) {
      throw new Error('Transfer amount must be positive.');
    }

    // --- RE-AUTHENTICATE USER ---
    const senderLogin = await User.findById(senderUserId);
    const isPasswordMatch = await bcrypt.compare(password, senderLogin.password);
    if (!isPasswordMatch) {
      throw new Error('Incorrect password.');
    }

    // --- FIND ALL PARTIES WITHIN THE TRANSACTION ---
    const senderAccount = await Customer.findOne({ email: senderLogin.email }).session(session);
    const beneficiary = await Beneficiary.findOne({ _id: beneficiaryId, owner: senderUserId }).session(session);
    
    if (!beneficiary) {
      throw new Error('Beneficiary not found or does not belong to you.');
    }
    
    const recipientAccount = await Customer.findOne({ accountNo: beneficiary.accountNo }).session(session);
    if (!recipientAccount) {
      throw new Error('Recipient account no longer exists.');
    }

    // --- CHECK BALANCE AND PERFORM THE TRANSFER ---
    if (senderAccount.finalBalance < Number(amount)) {
      throw new Error('Insufficient funds.');
    }

    // Debit the sender
    senderAccount.finalBalance -= Number(amount);
    await senderAccount.save({ session });

    // Credit the recipient
    recipientAccount.finalBalance += Number(amount);
    await recipientAccount.save({ session });

    // --- RECORD TRANSACTIONS ---
    const transactionTime = new Date();
    // Record debit for sender
    await Transaction.create([{
      customerId: senderAccount._id,
      accountNo: senderAccount.accountNo,
      transactionType: 'dr',
      transactionAmount: amount,
      currentBalance: senderAccount.finalBalance,
      reference: reference || `Transfer to ${beneficiary.payeeName}`,
      branch: senderAccount.branch,
      createdAt: transactionTime,
    }], { session });

    // Record credit for recipient
    await Transaction.create([{
      customerId: recipientAccount._id,
      accountNo: recipientAccount.accountNo,
      transactionType: 'cr',
      transactionAmount: amount,
      currentBalance: recipientAccount.finalBalance,
      reference: `Transfer from ${senderAccount.fullName}`,
      branch: recipientAccount.branch,
      createdAt: transactionTime,
    }], { session });

    // --- COMMIT THE TRANSACTION ---
    // If all operations were successful, commit the changes to the database
    await session.commitTransaction();

    res.status(200).json({ success: true, message: 'Transfer successful!' });

  } catch (error) {
    // If any step failed, abort the entire transaction
    await session.abortTransaction();
    res.status(400).json({ success: false, message: error.message || 'Transfer failed.' });
  } finally {
    // End the session
    session.endSession();
  }
};
