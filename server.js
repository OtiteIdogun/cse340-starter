/* ============================================================================ *
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 * ============================================================================ */
 
/* ============================================================================ *
 * Require Statements
 * ============================================================================ */
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities/")

/* ============================================================================ *
 * View Engine and Templates
 * ============================================================================ */
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root
 
/* ============================================================================ *
 * Routes
 * ============================================================================ */
app.use(static)

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome));

// Inventory routes
app.use("/inv", inventoryRoute)

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  // Call the next middleware with an error object specifying a 404 status and a message.
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ============================================================================ *
 * Express Error Handler
 * Place after all other middleware
 * ============================================================================ */
// This middleware function is designed to handle errors that occur during request processing.
// It must be placed after all other middleware and route definitions.
app.use(async (err, req, res, next) => {
  // Fetch the navigation data using a utility function to maintain consistency in the UI.
  let nav = await utilities.getNav();

  // Log the error details, including the original URL that caused the error.
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);

  if (err.status == 404)
    errorMessage = err.message
  else 
    errorMessage = 'Oh no! There was a crash. Maybe try a different route?'

  // Render a custom error page to display the error to the user.
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: errorMessage,
    nav
  });
});

/* ============================================================================ *
 * Local Server Information
 * Values from .env (environment) file
 * ============================================================================ */
const port = process.env.PORT
const host = process.env.HOST

/* ============================================================================ *
 * Log statement to confirm server operation
 * ============================================================================ */
app.listen(port, () => {
  console.log(`App server listening on http://${host}:${port}`)
})
