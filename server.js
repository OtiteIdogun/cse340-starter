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
const utilities = require("./utilities/")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const session = require("express-session")
const pool = require('./database/') // db.json')
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

/* ============================================================================ *
 * Middleware
 * ============================================================================ */
// const connectPgSimple = require('connect-pg-simple'); // PostgreSQL session store

/**
 * Session Configuration
 */
app.use(session({
  store: new (require('connect-pg-simple')(session))({  // Same as require('connect-pg-simple')(session) | // Configure the session store using PostgreSQL
    createTableIfMissing: true, // Automatically create the session table if it doesn't exist
    pool, // Use the provided pool for managing database connections
  }),
  secret: process.env.SESSION_SECRET, // Secret used to sign the session ID cookie, should be kept confidential
  resave: true, // Forces the session to be saved back to the session store, even if unmodified
  saveUninitialized: true, // Forces a session that is uninitialized (new, but not modified) to be saved
  name: 'sessionId', // Name of the session ID cookie
}));

/**
 * Middleware for Express Messages (Used for flash messages)
 */
const flash = require('connect-flash') // Middleware for flash messages

app.use(flash()); // Same as app.use(require('connect-flash')()); Initializes the flash middleware for showing messages to users (to be used in the entire application)

/** 
 * Middleware to attach flash messages to the response local variables
 */
const expressMessages = require('express-messages') // Middleware that manages flash messages and allows you to display flash messages in views;

app.use(function(req, res, next) {
  res.locals.flashMessage = expressMessages(req, res); // Store flash messages in the response.locals object so they can be accessed in HTML templates
  
  // Call next(): Used to indicate that this middleware (the anonymous function defined within the app.use() that processes requests) has finished its task
  // This allows Express to move on to the next middleware function or route handler
  // If next() is not called, the request will hang, and the user won't receive a response
  next(); // Proceed to the next middleware or route handler
});

// Body Parser Middleware
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cookieParser()) // Parse Cookie header and populate req.cookies with an object keyed by the cookie names
app.use(utilities.checkJWTToken) // Check the JWT token for authentication

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

// Account routes
app.use("/account", accountRoute)

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


