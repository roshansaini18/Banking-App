const mongoose = require('mongoose');

const beneficiarySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  payeeName: {
    type: String,
    required: true,
    trim: true,
  },
  // FIX: Change 'accountNumber' to 'accountNo' to match your customer model
  accountNo: {
    type: String,
    required: true,
    trim: true,
  },
  bankName: {
    type: String,
    required: true,
    default: 'S.O. Bank',
  },
}, { timestamps: true });

module.exports = mongoose.model('Beneficiary', beneficiarySchema);
