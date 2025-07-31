require("dotenv").config();
const mongoose = require("mongoose");

const url = process.env.DB_URL;

// Connect to MongoDB Atlas once at startup
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB Atlas"))
.catch((err) => {
  console.error("MongoDB connection error:", err.message);
  process.exit(1); // Exit process if DB connection fails
});

// Get all records
const findAllRecord = async (schema) => {
  try {
    return await schema.find();
  } catch (err) {
    throw new Error(err.message);
  }
};

// Get one record
const findOneRecord = async (query, schema) => {
  try {
    return await schema.findOne(query);
  } catch (err) {
    throw new Error(err.message);
  }
};

// Create new record
const createNewRecord = async (data, schema) => {
  try {
    return await new schema(data).save();
  } catch (err) {
    throw new Error(err.message);
  }
};

// Update record by ID
const updateRecord = async (id, data, schema) => {
  try {
    return await schema.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
  } catch (err) {
    throw new Error(err.message);
  }
};

// Delete record by ID
const deleteRecord = async (id, schema) => {
  try {
    return await schema.findByIdAndDelete(id);
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  findAllRecord,
  createNewRecord,
  updateRecord,
  deleteRecord,
  findOneRecord,
};
