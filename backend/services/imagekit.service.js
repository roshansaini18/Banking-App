const ImageKit = require("imagekit");

// It's highly recommended to use environment variables for your keys
// for better security. You can use a `.env` file and the `dotenv` package.
// For simplicity here, we are putting them directly.
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "YOUR_PUBLIC_KEY",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "YOUR_PRIVATE_KEY",
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "YOUR_URL_ENDPOINT"
});

module.exports = imagekit;
