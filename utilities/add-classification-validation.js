const utilities = require(".")
const { body, validationResult } = require("express-validator")
const addClassificationValidation = {}
const invModel = require("../models/inventory-model")

// The form must send all data through the appropriate router, where server-side validation middleware is present, then on to the inventory controller and then to a function within the inventory model for insertion to the database.
// The view must have the means of displaying a flash message returned to it from the controller, as well as errors returned as a result of the server-side validation.
// If the insertion works, the controller should create a new navigation bar (which shows the new classification) and render the management view, along with a success message. Note: if it works, the new classification should appear as a navigation item immediately, without a page refresh. However, if it fails, then the add classification view should be rendered with a clear failure message.


/* ============================================================================ *
 *  Check classification data and return errors or continue to next function
 * ============================================================================ */
addClassificationValidation.addClassificationRules = () => {
  return [
    // classification_name is required and must be alphanumeric
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.") // on error this message is sent.
      .custom(async (classification_name) => {
        const classificationExists = await invModel.checkExistingClassification(classification_name)
        if (classificationExists){
          throw new Error("Classification already exists. Please choose a different name.")
        }
      }),
  ];
};

addClassificationValidation.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body; // Or const classification_name = req.body.classification_name
  let errors = [];
  errors = validationResult(req);

  // console.log(errors.errors)
  // console.log(req.body)
  // console.log(req.body.classification_name)

  // invModel.checkExistingClassification

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();

    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      classification_name,
      errors: errors.array(),
      addClassificationForm: utilities.buildAddClassificationForm(classification_name),
      accountData: res.locals.accountData
    });
    return;
  } else {
    next();
  }
};

module.exports = addClassificationValidation;
