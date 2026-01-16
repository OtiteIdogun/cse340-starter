// Import the inventory model to interact with inventory data in the database.
const invModel = require("../models/inventory-model");

// Import utility functions for additional functionality (e.g., building UI components).
const utilities = require("../utilities/");

// Initialize an empty object to hold inventory controller methods.
const invCont = {};

/* ============================================================================ *
 *  Build inventory by classification view
 * ============================================================================ */

// Define an asynchronous method 'buildViewByClassificationId' within the invCont object.
// This method handles the request to render the inventory for a specific classification.
invCont.buildInventoryViewByClassificationId = async function (req, res, next) {
  // Extract the classification ID from the request parameters.
  const classification_id = req.params.classificationId;

  // Fetch inventory data associated with the classification ID from the inventory model.
  const data = await invModel.getInventoryByClassificationId(classification_id);
  // console.log(data);
  
  // Generate a grid display for the inventory items using a utility function.
  const grid = await utilities.buildClassificationGrid(data);
  
  // Get the navigation data for rendering the navigation menu.
  let nav = await utilities.getNav();
  
  // Extract the classification name for setting the page title.
  const className = data[0].classification_name; // OR data.classification_name;
  
  // Render the inventory view for the specific classification using the provided data.
  res.render("./inventory/classification", {
    title: className + " Vehicles", // Set the title of the rendered page dynamically.
    nav, // Pass the navigation data to the template.
    grid, // Pass the grid data for displaying the inventory items.
    accountData: res.locals.accountData
  });
}

invCont.buildInventoryDetailViewByInvId = async function (req, res, next) {
  const inv_id = req.params.invId;
  // console.log("(invController.js) inv_id from req.params:", inv_id);

  const carData = await invModel.getInventoryItemDetailsById(inv_id);
  // console.log("(invController.js) carData from invModel:", carData);

  let navigation = await utilities.getNav();
  let carDetails = await utilities.buildInventoryItemDetailPage(carData);

  // console.log("(invController.js) carDetails being passed to template:", carDetails);

  res.render("./inventory/detail", {
    title: `${carData[0].inv_year} ${carData[0].inv_make} ${carData[0].inv_model}`,
    nav: navigation,
    carDetails: carDetails,
    accountData: res.locals.accountData
  });
}

invCont.buildInventoryManagementView = async function (req, res, next) {
  let nav = await utilities.getNav(); // Get the navigation data for rendering the navigation menu.
  let classificationSelectionOptionsList = await utilities.buildClassificationListWithTemplateLiteral();

  res.render("./inventory/management", { 
    errors: null,
    title: "Inventory Management", 
    nav,
    classificationSelectionOptionsList,
    accountData: res.locals.accountData
  }); // Render the inventory management view using the navigation data.
};

invCont.buildAddNewClassificationView = async function (req, res, next) {
  // const { classification_name } = req.body; // Only used
  let nav = await utilities.getNav(); // Get the navigation data for rendering the navigation menu.
  let addClassificationForm = utilities.buildAddClassificationForm();

  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    // classification_name,
    addClassificationForm,
    errors: null,
    accountData: res.locals.accountData
  }); // Render the add new classification view using the navigation data.
};

invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav(); // Get the navigation data for rendering the navigation menu.
  let classification_name = req.body.classification_name; // Get the classification name from the request body.
  let addClassificationForm = utilities.buildAddClassificationForm(classification_name); // Build the add classification form using a utility function.

  const addClassificationResult = await invModel.addNewInventoryClassification(classification_name); // Attempt to add the new classification using the inventory model.

  if (addClassificationResult) {
    req.flash(
      "notice",
      `Congratulations, the ${classification_name.toUpperCase()} classification was added successfully.`
    );

    res.status(201).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      addClassificationForm,
      errors: null,
      accountData: res.locals.accountData
    });
  } else {
    req.flash(
      "notice",
      `Sorry, the ${classification_name.toUpperCase()} classification could not be added. Please try again.`
    );

    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      addClassificationForm,
      errors: null,
      accountData: res.locals.accountData
    });
  }
};


/* ============================================================================ *
 *  Build add new inventory view
 * ============================================================================ */
invCont.buildAddNewInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav(); // Get the navigation data for rendering the navigation menu.
  let addInventoryForm = utilities.buildAddInventoryForm();
  let classificationSelectionOptionsList = await utilities.buildClassificationListWithTemplateLiteral(); // Build the classification selection list for the form.

  // console.log("(invController.js) classificationSelectionOptionsList:", classificationSelectionOptionsList);

  res.render("./inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    addInventoryForm,
    classificationSelectionOptionsList,
    errors: null,
    accountData: res.locals.accountData
  }); // Render the add new inventory view using the navigation data.
};

invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav(); // Get the navigation data for rendering the navigation menu.
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_color, inv_price, inv_miles, classification_id } = req.body; // Get the form data from the request body.
  let addInventoryForm = utilities.buildAddInventoryForm(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color); // Build the add inventory form using a utility function.
  let classificationSelectionList = await utilities.buildClassificationListWithTemplateLiteral(); // Build the classification selection list for the form.
  let addInventoryResult = null;
  
  let checkExistingInventoryItem = await invModel.checkExistingInventoryItem(inv_make, inv_model, inv_year, inv_color, classification_id);
  if (checkExistingInventoryItem) {
    let classificationName = await invModel.getClassificationName(classification_id);
    req.flash(
      "notice",
      // `Sorry, the Inventory Item ${inv_make.toUpperCase()} ${inv_model.toUpperCase()} already exists. Please try again.`
      `Sorry, the Inventory Item ${inv_make.toUpperCase()} ${inv_model.toUpperCase()} of classification ${classificationName.toUpperCase()} already exists. Please try again.`
    );

    // console.log("(invController.js) classification_id:", classification_id, "type:", typeof classification_id);
    // console.log("(invController.js) req.body:", req.body);

    res.status(501).render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      addInventoryForm,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_color,
      inv_price,
      inv_miles,
      classification_id,
      classificationSelectionOptionsList: classificationSelectionList,
      errors: null,
      accountData: res.locals.accountData
    });
    return;
  } else if (!checkExistingInventoryItem) {
    addInventoryResult = await invModel.addNewInventoryItem(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color);
    
    let classificationName = await invModel.getClassificationName(classification_id);

    req.flash(
      "notice",
      `Congratulations, the Inventory Item ${inv_make.toUpperCase()} ${inv_model.toUpperCase()} - ${classificationName.toUpperCase()} was added successfully.`
    );

    res.status(201).render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationSelectionOptionsList: classificationSelectionList,
      addInventoryForm,
      errors: null,
      accountData: res.locals.accountData
    });
  } else {
    req.flash(
      "notice",
      `Sorry, the ${inv_make.toUpperCase()} ${inv_model.toUpperCase()} could not be added. Please try again.`
    );  

    res.status(501).render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      addInventoryForm,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_color,
      inv_price,
      inv_miles,
      classification_id,
      classificationSelectionOptionsList: classificationSelectionList,
      errors: null,
      accountData: res.locals.accountData
    });
  }
};

/* ============================================================================ *
 *  Return Inventory by Classification As JSON
 * ============================================================================ */
invCont.getInventoryJSONByClassificationId = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(classification_id);
  
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
}

invCont.buildModifyInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const inventoryItemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(inventoryItemData.classification_id)
  const itemName = `${inventoryItemData.inv_make} ${inventoryItemData.inv_model}`

  res.render("./inventory/edit-inventory", {
    title: "Edit Inventory - " + itemName,
    nav,
    classificationSelectionOptionsList: classificationSelect,
    errors: null,
    inv_id: inventoryItemData.inv_id,
    inv_make: inventoryItemData.inv_make,
    inv_model: inventoryItemData.inv_model,
    inv_year: inventoryItemData.inv_year,
    inv_description: inventoryItemData.inv_description,
    inv_image: inventoryItemData.inv_image,
    inv_thumbnail: inventoryItemData.inv_thumbnail,
    inv_price: inventoryItemData.inv_price,
    inv_miles: inventoryItemData.inv_miles,
    inv_color: inventoryItemData.inv_color,
    classification_id: inventoryItemData.classification_id,
    accountData: res.locals.accountData
  })
};

/* ============================================================================ *
 *  Export the controller
 * ============================================================================ */
module.exports = invCont; // Export the inventory controller object for use in other parts of the application.
