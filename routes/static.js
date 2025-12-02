/**
 * Static File Routes
 * Serves CSS, JavaScript, and image assets
 */

const express = require("express");
const path = require("path");

const router = express.Router();

// ============================================================================
// Static File Middleware (Set up "public" folder / subfolders for static files)
// ============================================================================

// Serve all static files from public directory
router.use(express.static("public"));

// Serve CSS files
router.use("/css", express.static(path.join(__dirname, "../public/css")));

// Serve JavaScript files
router.use("/js", express.static(path.join(__dirname, "../public/js")));

// Serve image files
router.use("/images", express.static(path.join(__dirname, "../public/images")));

// ============================================================================
// Exports
// ============================================================================
module.exports = router;



