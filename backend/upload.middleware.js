const multer = require("multer");

// Configure multer to use memory storage.
// This means the file will be stored in memory as a Buffer object.
const storage = multer.memoryStorage();

// Initialize multer with the memory storage configuration.
const upload = multer({ storage: storage });

module.exports = upload;
