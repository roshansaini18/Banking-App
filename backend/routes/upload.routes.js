const express = require('express');
const router = express.Router();
const upload = require('../cloudinaryStorage');

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ error: 'File upload failed' });
  }
  res.status(200).json({ url: req.file.path });
});

module.exports = router;
