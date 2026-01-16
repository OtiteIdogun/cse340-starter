// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")
const addClassificationValidate = require('../utilities/add-classification-validation')
const addInventoryValidate = require('../utilities/add-inventory-validation')
const editInventoryValidate = require('../utilities/edit-inventory-validation')

/* ============================================================================ *
 * Inventory by Classification View Routes - Route to build inventory by classification view
 * ============================================================================ */

/***
  Example URL: "/inv/type/:classificationId"

  This GET route allows access to inventory items based on their classification ID. 
  The base route "/inv" is defined in server.js, so when a request is made 
  to the complete URL "/inv/type/:classificationId", this route will be triggered. 
  
  The application then invokes the buildViewByClassificationId function from 
  the invController, which retrieves and displays the information associated 
  with the specified classification ID.

  Example Usage: For a request to "/inv/type/123", the application will
  fetch and present items classified under the ID 123.
 */
router.get("/type/:classificationId", utilities.handleErrors(invController.buildInventoryViewByClassificationId)); // /inv is the base route used in server.js 

/* ============================================================================ *
 * Inventory Item Detail Routes
 * ============================================================================ */
router.get("/detail/:invId", utilities.handleErrors(invController.buildInventoryDetailViewByInvId)); // Route to build inventory item detail view

/* ============================================================================ *
 * Inventory Management View Routes
 * ============================================================================ */
router.get("/", invController.buildInventoryManagementView); /* OR /management as route */ // Route to build inventory management view

/* ============================================================================ *
 * Add Classification View Routes
 * ============================================================================ */
router.get("/add-classification", utilities.handleErrors(invController.buildAddNewClassificationView)); // Route to build add new classification form view

/* ============================================================================ *
 * Add Classification Processing Routes
 * ============================================================================ */
router.post("/add-classification", // Route to handle add new classification form submission
  addClassificationValidate.addClassificationRules(),
  addClassificationValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

/* ============================================================================ *
 * Add Inventory View Routes
 * ============================================================================ */
router.get("/add-inventory", invController.buildAddNewInventoryView); // Route to build add new inventory form view

/* ============================================================================ *
 * Add Inventory Processing Routes
 * ============================================================================ */
router.post("/add-inventory", // Route to handle add new inventory form submission
  addInventoryValidate.addInventoryRules(),
  addInventoryValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

/* ============================================================================ *
 * Get Inventory JSON by Classification ID Route
 * ============================================================================ */
router.get("/getInventory/:classification_id", 
  // utilities.checkAccountType,
  utilities.handleErrors(invController.getInventoryJSONByClassificationId));

/* ============================================================================ *
 * Update and Delete Inventory Item Routes
 * ============================================================================ */
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildModifyInventoryView)); // Route to build modify inventory item view

router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteInventoryView)); // Route to build delete inventory item view

router.post("/update-inventory", // Route to handle update inventory item form submission
  editInventoryValidate.editInventoryRules(),
  editInventoryValidate.checkInventoryData,
  utilities.handleErrors(invController.updateInventory)
);

/* ============================================================================ *
 * Classification Management View Routes
 * ============================================================================ */
// // Route to build classification management view
// router.get("/classification-management", invController.buildClassificationManagementView);

// /* ============================================================================ *
//  * Classification Processing Routes
//  * ============================================================================ */
// // Route to build delete classification view
// router.get("/delete-classification/:classificationId", invController.buildDeleteClassificationView);

// // Route to build update classification view
// router.get("/update-classification/:classificationId", invController.buildUpdateClassificationView);

// Export the router to be used in other parts of the application.
module.exports = router;