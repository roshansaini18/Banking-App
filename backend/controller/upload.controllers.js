const imagekit = require('../services/imagekit.service.js');

const uploadFile = async (req, res) => {
    // Check if a file was provided in the request
    if (!req.file) {
        return res.status(400).json({
            message: "No file uploaded. Please select a file to upload."
        });
    }

    try {
        // The file is available in memory as a buffer
        const fileBuffer = req.file.buffer;
        const originalName = req.file.originalname;

        // The folder name can be passed from the client if needed,
        // otherwise it will upload to the root of your media library.
        const folderName = req.body.folderName || "general";

        console.log(`Uploading file: ${originalName} to folder: ${folderName}`);

        // Upload the file to ImageKit
        const response = await imagekit.upload({
            file: fileBuffer,           // required
            fileName: originalName,     // required
            folder: folderName,         // optional
            useUniqueFileName: true,    // optional: true to generate a unique name
        });

        // Send the successful response from ImageKit back to the client
        res.status(200).json(response);

    } catch (error) {
        // Handle errors from the ImageKit upload
        console.error("Error uploading to ImageKit:", error);
        res.status(500).json({
            message: "Failed to upload file to ImageKit.",
            error: error.message
        });
    }
};

module.exports = {
    uploadFile
};
