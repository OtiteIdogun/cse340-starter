const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/index")
const accoutValidate = require('../utilities/account-validation')

// Route to display the account management view
router.get("/login", utilities.handleErrors(accountController.buildAccountLoginView));

// Route to handle login form submission
// router.post("/login", utilities.handleErrors(accountController.loginAccount));

// Process the login attempt
router.post("/login",
  (req, res) => {
    res.status(200).send('login process...')
  }
)

// Route to display the account registration view
router.get("/register", utilities.handleErrors(accountController.buildAccountRegistrationView));

// Route to handle registration form submission
router.post("/register",
  accoutValidate.registationRules(),
  accoutValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

module.exports = router;
