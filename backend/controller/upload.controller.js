const cloudinary = require("../config/cloudinary");

exports.uploadFile = async (req, res) => {
  try {
    const folderName = req.query.folderName || "bank-projects"; // default folder

    // Validate file
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: folderName,
    });

    // Return Cloudinary URL (store this in DB)
    return res.status(200).json({
      message: "File uploaded successfully",
      url: result.secure_url,
      public_id: result.public_id, // useful for deletion later
    });
  } catch (error) {
    return res.status(500).json({ message: "Upload failed", error: error.message });
  }
};
