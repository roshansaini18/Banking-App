const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  // Link the card to the user's login ID
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // We'll also store the customer ID for easier lookups if needed
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
    // IMPORTANT: In a real production app, storing CVV is heavily regulated (PCI DSS).
    // For this project, we store it as a string, but this is NOT for production.
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
