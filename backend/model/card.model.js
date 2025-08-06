const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  // Link the card to the user's login ID for easy lookups and security
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Also link to the specific customer document
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  cardNumber: {
    type: String,
    required: true,
    unique: true,
  },
  cardHolderName: {
    type: String,
    required: true,
  },
  expiryDate: { // Stored as "MM/YY"
    type: String,
    required: true,
  },
  cvv: {
    // IMPORTANT: Storing CVV is heavily regulated (PCI DSS).
    // For this project this is fine, but never do this in a real production application.
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active',
  },
  spendingLimits: {
    dailyOnline: { type: Number, default: 50000 },
    dailyAtm: { type: Number, default: 25000 },
  },
  enabledTransactions: {
    online: { type: Boolean, default: true },
    atm: { type: Boolean, default: true },
    international: { type: Boolean, default: false },
  }
}, { timestamps: true });

module.exports = mongoose.model('Card', cardSchema);
