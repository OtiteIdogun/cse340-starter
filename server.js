/**
 * Main Application Server
 * Express.js server configuration and setup
 */

// ============================================================================
// Imports (Require Statements)
// ============================================================================
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const staticRoutes = require("./routes/static")
const baseController = require("./controllers/baseController")

// ============================================================================
// Application Setup
// ============================================================================

// View Engine and Templates
// Configure view engine and layouts
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// ============================================================================
// Routes
// ============================================================================
app.use(staticRoutes);

// Index (Home) route
app.get("/", baseController.buildHome);

// ============================================================================
// Server Configuration
// ============================================================================

// Local Server Information
// Values from .env (environment) file
const PORT = process.env.PORT;
const HOST = process.env.HOST;

// ============================================================================
// Start Server
// ============================================================================

// Log statement to confirm server operation
app.listen(PORT, () => {
  console.log(`✓ App Server listening at http://${HOST}:${PORT}`);
});
