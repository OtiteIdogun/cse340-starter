// Import the inventory model to interact with inventory data in the database.
const invModel = require("../models/inventory-model");

// Import utility functions for additional functionality (e.g., building UI components).
const utilities = require("../utilities/");

// Initialize an empty object to hold inventory controller methods.
const invCont = {};

/* ============================================================================ *
 *  Build inventory by classification view
 * ============================================================================ */

// Define an asynchronous method 'buildByClassificationId' within the invCont object.
// This method handles the request to render the inventory for a specific classification.
invCont.buildByClassificationId = async function (req, res, next) {
  // Extract the classification ID from the request parameters.
  const classification_id = req.params.classificationId;

  // Fetch inventory data associated with the classification ID from the inventory model.
  const data = await invModel.getInventoryByClassificationId(classification_id);
  
  // Generate a grid display for the inventory items using a utility function.
  const grid = await utilities.buildClassificationGrid(data);
  
  // Get the navigation data for rendering the navigation menu.
  let nav = await utilities.getNav();
  
  // Extract the classification name for setting the page title.
  const className = data[0].classification_name;
  
  // Render the inventory view for the specific classification using the provided data.
  res.render("./inventory/classification", {
    title: className + " vehicles", // Set the title of the rendered page dynamically.
    nav, // Pass the navigation data to the template.
    grid, // Pass the grid data for displaying the inventory items.
  });
}

// Export the inventory controller object for use in other parts of the application.
module.exports = invCont;
