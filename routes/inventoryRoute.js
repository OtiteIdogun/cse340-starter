// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

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
router.get("/type/:classificationId", invController.buildViewByClassificationId); // /inv is the base route used in server.js 

// Route to build inventory item detail view
router.get("/detail/:invId", invController.buildViewByInvId);

module.exports = router;