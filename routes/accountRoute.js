const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/index")
const accountValidate = require('../utilities/account-validation')

/* ============================================================================ *
 * Account Management Route
 * ============================================================================ */

// Route to display the account management view
router.get("/", utilities.handleErrors(accountController.buildAccountManagementView));

/* ============================================================================ *
 * Account Login Routes
 * ============================================================================ */

// Route to display the account login view
router.get("/login", utilities.handleErrors(accountController.buildAccountLoginView));

// Route to process the login login form submission attempt
router.post("/login",
  accountValidate.loginRules(), // Validate login data
  accountValidate.checkLoginData, // Check login data and return errors or continue to login
  utilities.handleErrors(accountController.loginAccount)
)

/* ============================================================================ *
 * Account Registration Routes
 * ============================================================================ */

// Route to display the account registration view
router.get("/register", utilities.handleErrors(accountController.buildAccountRegistrationView));

// Route to handle registration form submission
router.post("/register",
  accountValidate.registrationRules(),
  accountValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

module.exports = router;
