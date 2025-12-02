const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}

module.exports = baseController


// /**
//  * Base Controller
//  * Handles primary page rendering and navigation
//  */

// const utilities = require("../utilities/");

// // ============================================================================
// // Home Page Handler
// // ============================================================================
// const buildHome = async (req, res) => {
//   try {
//     const nav = await utilities.getNav();
//     res.render("index", { title: "Home", nav });
//   } catch (error) {
//     console.error("Error building home page:", error);
//     res.status(500).send("Error loading home page");
//   }
// };

// // ============================================================================
// // Exports
// // ============================================================================
// module.exports = {
//   buildHome,
// };