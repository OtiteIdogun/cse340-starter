// Import utility functions from the utilities module.
const utilities = require("../utilities/");

// Initialize an empty object to hold controller methods.
const baseController = {};

// Define an asynchronous method 'buildHome' within the 'baseController' object,
// which handles rendering the home page.
baseController.buildHome = async function(req, res) {
  // Call the 'getNav' function from the utilities module to fetch navigation data.
  const nav = await utilities.getNav();
  
  // Render the 'index' view/template, passing the title and navigation data as context.
  res.render("index", { title: "Home", nav });
};

// Export the 'baseController' object for use in other modules.
module.exports = baseController;
