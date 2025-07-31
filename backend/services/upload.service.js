const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('../config/cloudinary');

// Configure multer storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'sobank_uploads', // your Cloudinary folder
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage });

// POST route to upload single image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      url: req.file.path,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message,
    });
  }
});

module.exports = router;
