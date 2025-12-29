// const accountModel = require("../models/account-model"); // Import the account model to interact with account data in the database.
const utilities = require("../utilities/"); // Import utility functions for additional functionality (e.g., building UI components).

const accountCont = {}; // Initialize an empty object to hold account controller methods.

// Define an asynchronous method 'buildAccountManagementView' within the accountController object.
accountCont.buildAccountLoginView = async function (req, res, next) {
  let nav = await utilities.getNav(); // Get the navigation data for rendering the navigation menu.
  let loginForm = utilities.buildLoginForm(); // Build the login form using a utility function.

  req.flash("notice", "This is a flash message.")
  
  res.render("./account/login", { 
      title: "Account Login", 
      nav,
      loginForm
    }); // Render the account management view using the navigation data.
};

accountCont.buildAccountRegistrationView = async function (req, res, next) {
  let nav = await utilities.getNav(); // Get the navigation data for rendering the navigation menu.
  let registerForm = utilities.buildRegisterForm(); // Build the registration form using a utility function.

  res.render("./account/register", {
      title: "Account Registration", 
      nav,
      registerForm
    }); // Render the account registration view using the navigation data.
};

module.exports = accountCont; // Export the account controller object for use in other parts of the application.