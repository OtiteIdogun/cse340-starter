const utilities = require(".")
const { body, validationResult } = require("express-validator")
const editInventoryValidation = {}
const invModel = require("../models/inventory-model")

/* ============================================================================ *
 *  Check inventory data and return errors or continue to next function
 * ============================================================================ */
editInventoryValidation.editInventoryRules = () => {
  return [
    // classification_id is required and must be an integer
    body("classification_id")
      .trim() // Remove leading/trailing whitespace
      .escape() // Escape HTML characters
      .notEmpty() // required
      .isInt() // must be integer
      .withMessage("Please select a classification."), // on error this message is sent.

    // inv_make is required and must be string
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a make."),

    // inv_model is required and must be string
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a model."),

    // inv_year is required and must be an integer
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isInt()
      .withMessage("Please provide a year."),

    // inv_color is required and must be string
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a color."),

    // inv_miles is required and must be an integer
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .isInt()
      .withMessage("Please provide miles."),

    // inv_description is required and must be string
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a description."),
    
    // inv_price is required and must be an integer
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isInt()
      .withMessage("Please provide a price."),  

    // inv_image is required and must be a string
    body("inv_image")
      // `body("inv_image")` would not need to be escaped (no need for `.escape()`) as it is a URL
      // And so does `inv_thumbnail` below
      .trim()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide an image URL."),  
    
    // inv_thumbnail is required and must be a string
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a thumbnail URL."),  
  ];
};

/* ============================================================================ *
 *  Check inventory data and return errors or continue to next function
 * ============================================================================ */
editInventoryValidation.checkInventoryData = async (req, res, next) => {
  const {
    classification_id,
    inv_make, 
    inv_model, 
    inv_color, 
    inv_year, 
    inv_description,
    inv_miles, 
    inv_thumbnail,
    inv_image,
    inv_price,
    inv_id
  } = req.body;
  let errors = [];
  errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const inventoryItemData = await invModel.getInventoryById(inv_id)
    classificationSelectionOptionsList = await utilities.buildClassificationListWithTemplateLiteral(); // Build the classification selection list for the form.
    const itemName = `${inventoryItemData.inv_make} ${inventoryItemData.inv_model}`
    
    res.render("./inventory/edit-inventory", {
      title: `Edit Inventory - ${itemName}`, // Render the title within an H1 tag.
      nav,
      inv_id,
      classification_id,
      inv_make,
      inv_model,
      inv_color,
      inv_year,
      inv_description,
      inv_miles,
      inv_thumbnail,
      inv_image,
      inv_price,
      classificationSelectionOptionsList,
      errors: errors.array(),
      accountData: res.locals.accountData
    });
    return;
  } else {
    next();
  }
}

module.exports = editInventoryValidation;
