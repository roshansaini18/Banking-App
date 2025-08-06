const bcrypt = require("bcrypt");
const dbService = require("../services/db.service");
const Card = require('../model/card.model'); // Import the Card model
const Customer = require('../model/customer.model'); // Import the Customer model

// Helper function to generate card details
const generateCardDetails = () => {
  const cardNumber = '4' + Array.from({ length: 15 }, () => Math.floor(Math.random() * 10)).join('');
  const cvv = Array.from({ length: 3 }, () => Math.floor(Math.random() * 10)).join('');
  const expiry = new Date();
  expiry.setFullYear(expiry.getFullYear() + 5);
  const expiryDate = `${String(expiry.getMonth() + 1).padStart(2, '0')}/${String(expiry.getFullYear()).slice(-2)}`;
  return { cardNumber, cvv, expiryDate };
};

// CREATE new record
const createData = async (req, res, schema) => {
  try {
    const data = req.body;
    const dbRes = await dbService.createNewRecord(data, schema);

    // After creating a document, check if it was a Customer
    if (schema.modelName === Customer.modelName) {
      try {
        const cardDetails = generateCardDetails();
        await Card.create({
          owner: req.body.customerLoginId,
          customerId: dbRes._id,
          cardHolderName: dbRes.fullName,
          ...cardDetails
        });
        console.log(`Card created successfully for customer ${dbRes.fullName}`);
      } catch (cardError) {
        console.error("Customer was created, but failed to create a card:", cardError);
      }
    }

    res.status(200).json({ message: "Data inserted successfully", success: true, data: dbRes });
  } catch (error) {
    if (error.code == 11000) {
      res.status(422).json({ message: "Already exist", success: false, error });
    } else {
      res.status(500).json({ message: "Internal server error", error });
    }
  }
};

// ... (Your other functions: getData, updateData, deleteData, etc. remain unchanged)
// Make sure to include them and export them correctly at the bottom of the file.
module.exports = {
  createData,
  // ... your other exports
};
