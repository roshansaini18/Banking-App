
exports.uploadFile = (req, res) => {
    const folderName = req.query.folderName; // <-- read from query
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    return res.status(200).json({
        message: "File uploaded successfully",
        filePath: `/${folderName}/${req.file.filename}`,
    });
};
