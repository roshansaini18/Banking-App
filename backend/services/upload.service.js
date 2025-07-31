const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const folder = req.query.folderName || 'default';
    return {
      folder: folder,
      format: 'jpg', // or file.originalname.split('.').pop()
      public_id: file.fieldname + '-' + Date.now(),
    };
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
