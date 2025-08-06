// In backend/controller/customer.controller.js
const Customer = require('../model/customer.model');
const Card = require('../model/card.model'); // <-- 1. Import the Card model

// Helper function to generate card details (you can place this in the same file)
const generateCardDetails = () => {
  const cardNumber = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');
  const cvv = Array.from({ length: 3 }, () => Math.floor(Math.random() * 10)).join('');
  const expiry = new Date();
  expiry.setFullYear(expiry.getFullYear() + 5); // Card expires in 5 years
  const expiryDate = `${String(expiry.getMonth() + 1).padStart(2, '0')}/${String(expiry.getFullYear()).slice(-2)}`;
  return { cardNumber, cvv, expiryDate };
};


exports.createCustomer = async (req, res) => {
    try {
        const newCustomer = await Customer.create(req.body);

        // --- ADD THIS NEW LOGIC ---
        // After creating the customer, automatically create a card for them
        const cardDetails = generateCardDetails();
        await Card.create({
            owner: req.body.customerLoginId, // The User's login ID
            customerId: newCustomer._id,      // The new Customer document's ID
            cardHolderName: newCustomer.fullName,
            cardNumber: cardDetails.cardNumber,
            cvv: cardDetails.cvv,
            expiryDate: cardDetails.expiryDate,
        });
        // --- END OF NEW LOGIC ---
        
        res.status(201).json({ success: true, data: newCustomer });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to create customer', error });
    }
};

// ... your other customer controller functions ...
