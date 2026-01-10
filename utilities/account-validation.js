const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountValidation = {}
const accountModel = require("../models/account-model")

/* ============================================================================ *
 * Registration Data Validation Rules
 * ============================================================================ */
accountValidation.registrationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("account_email")
    .trim()
    .escape()
    .notEmpty()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required.")
    .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingAccountByEmail(account_email)
        if (emailExists){
          throw new Error("Email exists. Please log in or use a different email")
        }
      }),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ============================================================================ *
 * Login Data Validation Rules
 * ============================================================================ */
accountValidation.loginRules = () => {
  return [
    // valid email is required and must exist in the DB
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingAccountByEmail(account_email)
        if (!emailExists){
          throw new Error("Email not found. Please register or use different email")
        }
      }),

    // password is required
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ]
}

/* ============================================================================ *
 * Check data and return errors or continue to registration
 * ============================================================================ */
accountValidation.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)

  // Clean the email value if it's just '@' 
  // let clean_email = account_email === '@'  ? '' : account_email

  let clean_email = utilities.cleanEmail(account_email)

  // <% if (errors) { %>
  //   <ul class="notice">
  // <% errors.array().forEach(error => { %>
  //   <li><%= error.msg %></li>
  // <%  }) %>
  // </ul>
  // <% } %>
  // console.log(errors.errors)
  // console.log(req.body)
  // console.log(req.body.account_email)
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors: errors.array(), //OR errors.array() 
      title: "Account Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email: clean_email,
      registerForm: utilities.buildRegisterForm(account_firstname, account_lastname, clean_email)
    })
    return
  }
  next()
}

/* ============================================================================ *
 * Check login data and return errors or continue to login
 * ============================================================================ */
accountValidation.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = []
  errors = validationResult(req)

  // // Clean the email value if it's just '@'
  // let clean_email = account_email === '@' ? '' : account_email

  let clean_email = utilities.cleanEmail(account_email)

  // console.log(errors.errors)
  // console.log(req.body)

  for (let i = 0; i < errors.errors.length; i++) {
    if (errors.errors[i].value === '@') {
      // console.log(`Removing error msg with value '${errors.errors[i].value}' in error object...`)
      errors.errors.splice(i, 1)
    }
    // console.log(`Error msg: ${errors.errors[i].msg}`)
  }

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors: errors.array(),
      title: "Account Login",
      nav,
      account_email: clean_email,
      loginForm: utilities.buildLoginForm(clean_email)
    })
    return
  }
  next()
}

module.exports = accountValidation