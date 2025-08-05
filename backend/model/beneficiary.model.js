const mongoose = require('mongoose');

const beneficiarySchema = new mongoose.Schema({
  // The user who owns this beneficiary
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This links it to your User model
    required: true,
  },
  payeeName: {
    type: String,
    required: true,
    trim: true,
  },
  accountNumber: {
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