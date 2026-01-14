const accountModel = require("../models/account-model"); // Import the account model to interact with account data in the database.
const utilities = require("../utilities/"); // Import utility functions for additional functionality (e.g., building UI components).
const accountValidation = require("../utilities/account-validation");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const accountCont = {}; // Initialize an empty object to hold account controller methods.

/* ============================================================================ *
 * Build Account Login View
 * ============================================================================ */
// Define an asynchronous method 'buildAccountManagementView' within the accountController object.
accountCont.buildAccountLoginView = async function (req, res, next) {
  let nav = await utilities.getNav(); // Get the navigation data for rendering the navigation menu.
  let loginForm = utilities.buildLoginForm(); // Build the login form using a utility function.
  
  res.render("./account/login", { 
      title: "Account Login", 
      nav,
      loginForm,
      errors: null,  // Add this line to add the error variable to the view
      accountData: res.locals.accountData
    }); // Render the account management view using the navigation data.
};

/* ============================================================================ *
 * Build Account Registration View
 * ============================================================================ */
accountCont.buildAccountRegistrationView = async function (req, res, next) {
  let nav = await utilities.getNav(); // Get the navigation data for rendering the navigation menu.

  let account_firstname = res.locals.account_firstname || "";
  let account_lastname = res.locals.account_lastname || "";
  let account_email = res.locals.account_email || "";
  let registerForm = utilities.buildRegisterForm(account_firstname, account_lastname, account_email); // Build the registration form using a utility function.

  res.render("account/register", {
      title: "Account Registration", 
      nav,
      errors: null,
      registerForm,
      accountData: res.locals.accountData
    }); // Render the account registration view using the navigation data.
};

/* ============================================================================ *
 * Process Registration
 * ============================================================================ */
accountCont.registerAccount = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword

  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      accountData: res.locals.accountData
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword // Changed to from plain text account_password to hashed password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, ${account_firstname.toUpperCase()} you're registered. Please log in.`
    )

    res.status(201).render("account/login", { // the number 201 indicates that a resource has been successfully created
      title: "Account Login",
      nav,
      errors: null, // Ensure errors is null if none are present when rendering the login view
      loginForm: utilities.buildLoginForm(),
      accountData: res.locals.accountData
    })

  } else {
    req.flash("notice", "Sorry, the registration failed.")
    
    // Question: what does all these numbers mean?
    // Answer: They are HTTP status codes that indicate the result of the HTTP request.
    //         All the numbers are:
    //         200: OK - The request was successful.
    //         201: Created - The request was successful and a resource was created.
    //         400: Bad Request - The server could not understand the request due to invalid syntax.
    //         401: Unauthorized - The request requires user authentication.
    //         403: Forbidden - The server understood the request, but refused to fulfill it.
    //         404: Not Found - The server could not find the requested resource.
    //         500: Internal Server Error - The server encountered an unexpected condition that prevented it from fulfilling the request.
    //         501: Not Implemented - The server does not support the functionality required to fulfill the request.

    res.status(501).render("account/register", { // the number 501 indicates that the server does not support the functionality required to fulfill the request
      title: "Account Registration",
      nav,
      errors: null, // Ensures errors is null if none are present when rendering the login view
      registerForm: utilities.buildRegisterForm(),
      accountData: res.locals.accountData
    })
  }
}

/* ============================================================================ *
 * Account Management View
 * ============================================================================ */
accountCont.buildAccountManagementView = async function (req, res, next) {
  let nav = await utilities.getNav(); // Get the navigation data for rendering the navigation menu.
  const account_email = res.locals.accountData.account_email;
  let retrievedAccountData = await accountModel.getAccountByEmail(account_email);
  let accountDetails = await utilities.buildAccountManagemetDetailPage(retrievedAccountData);

  res.render("./account/management", {
      title: "Account Management",
      nav,
      accountDetails,
      errors: null,  // Add this line to add the error variable to the view
      accountData: res.locals.accountData
    }); // Render the account management view using the navigation data.
}

/* ============================================================================ *
 * Process Login
 * ============================================================================ */
accountCont.loginAccount = async function (req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  const accountDataRetrieved = await accountModel.getAccountByEmail(account_email);

  // if (accountData && await bcrypt.compare(account_password, accountData.account_password)) {
  //   req.flash("notice", "Login successful.");
  //   res.redirect("/account/management");
  // } else {
  //   req.flash("notice", "Login failed.");
  //   res.status(401).render("account/login", {
  //     title: "Account Login",
  //     nav,
  //     errors: null, // Ensure errors is null if none are present when rendering the login view
  //     loginForm: utilities.buildLoginForm(),
  //   });
  // }

  if (!accountDataRetrieved) { // No account found
    req.flash("notice", "No account found. Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Account Login",
      nav,
      errors: null,
      account_email,
      accountData: res.locals.accountData
    });
    return;
  }

  try {
    if (await bcrypt.compare(account_password, accountDataRetrieved.account_password)) {
      delete accountDataRetrieved.account_password;

      const accessToken = jwt.sign(
        accountDataRetrieved,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );

      if (process.env.NODE_ENV === "development") { // In development, set cookie without 'secure' flag
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true, // Cookie set with 'secure' flag and only sent over HTTPS in production
          maxAge: 3600 * 1000,
        });
      }
      
      req.flash(
        "message notice",
        "Login successful."
      );

      return res.redirect("/account/");
    } else {
      req.flash(
        "message notice",
        "Please check your credentials and try again."
      );

      res.status(400).render("account/login", {
        title: "Account Login",
        nav,
        errors: null,
        account_email,
        accountData: res.locals.accountData
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
};

module.exports = accountCont; // Export the account controller object for use in other parts of the application.