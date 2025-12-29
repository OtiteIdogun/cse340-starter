const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/index")

// Route to display the account management view
router.get("/login", utilities.handleErrors(accountController.buildAccountLoginView));

// Route to display the account registration view
router.get("/register", utilities.handleErrors(accountController.buildAccountRegistrationView));

module.exports = router;
