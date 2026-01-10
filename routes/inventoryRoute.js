// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")
const addClassificationValidate = require('../utilities/add-classification-validation')
const addInventoryValidate = require('../utilities/add-inventory-validation')

// Route to build inventory by classification view
/* ============================================================================ *
  This GET route allows access to inventory items based on their classification ID. 
  The base route "/inv" is defined in server.js, so when a request is made 
  to the complete URL "/inv/type/:classificationId", this route will be triggered. 
  
  The application then invokes the buildViewByClassificationId function from 
  the invController, which retrieves and displays the information associated 
  with the specified classification ID.

  Example Usage: For a request to "/inv/type/123", the application will
  fetch and present items classified under the ID 123.
 * ============================================================================ */
router.get("/type/:classificationId", utilities.handleErrors(invController.buildInventoryViewByClassificationId)); // /inv is the base route used in server.js 

// Route to build inventory item detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildInventoryDetailViewByInvId));

// Route to build inventory management view
router.get("/management", invController.buildInventoryManagementView);

// The view must:
// Contain a form for adding a new classification (you will only need to add the classification name, the primary key in the table is auto-incrementing).
// The form must contain a direction that the new classification name cannot contain a space or special character of any kind.
// The form must contain client-side validation.
// The view must be delivered via a route and using the MVC architecture as with all other views.
// The view must meet the requirements of the frontend checklist.
// The form must send all data through the appropriate router, where server-side validation middleware is present, then on to the inventory controller and then to a function within the inventory model for insertion to the database.
// The view must have the means of displaying a flash message returned to it from the controller, as well as errors returned as a result of the server-side validation.
// If the insertion works, the controller should create a new navigation bar (which shows the new classification) and render the management view, along with a success message. Note: if it works, the new classification should appear as a navigation item immediately, without a page refresh. However, if it fails, then the add classification view should be rendered with a clear failure message.

// Route to build add new classification form view
router.get("/add-classification", utilities.handleErrors(invController.buildAddNewClassificationView));

// Route to handle registration form submission
router.post("/add-classification",
  addClassificationValidate.addClassificationRules(),
  addClassificationValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// // Route to build add new inventory form view
router.get("/add-inventory", invController.buildAddNewInventoryView);

// // Route to handle add new inventory form submission
router.post("/add-inventory",
  addInventoryValidate.addInventoryRules(),
  addInventoryValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

// // Route to build delete classification view
// router.get("/delete-classification/:classificationId", invController.buildDeleteClassificationView);

// // Route to build update classification view
// router.get("/update-classification/:classificationId", invController.buildUpdateClassificationView);

// Export the router to be used in other parts of the application.
module.exports = router;