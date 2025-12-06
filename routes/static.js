// Import the Express framework to create an Express application.
const express = require('express');

// Create a new router object to define application routes.
const router = express.Router();

// Static Routes
// Set up "public" folder and its subfolders for serving static files.

// Middleware to serve static files from the "public" directory.
// This allows all files located in the "public" directory to be accessible to clients.
router.use(express.static("public"));

// Serve static files specifically from the "public/css" subdirectory.
// Using __dirname ensures the correct path is used, and the files are accessible at /css.
router.use("/css", express.static(__dirname + "/public/css"));

// Serve static files specifically from the "public/js" subdirectory.
// Accessible at /js, uses __dirname to ensure the correct path.
router.use("/js", express.static(__dirname + "/public/js"));

// Serve static files specifically from the "public/images" subdirectory.
// Accessible at /images, uses __dirname to construct the path.
router.use("/images", express.static(__dirname + "/public/images"));

// Export the router object so it can be used in other parts of the application (e.g., main app file).
module.exports = router;
