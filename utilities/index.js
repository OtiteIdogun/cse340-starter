// Import the inventory model, which contains database interactions related to inventory.
const { Template } = require("ejs");
const invModel = require("../models/inventory-model");
const e = require("express");

// Initialize an empty object to hold utility functions.
const Util = {};

/* ============================================================================ *
 * Constructs the nav HTML unordered list
 * ============================================================================ */

let navTemplateLiteral = (data) => {
  return `
    <ul>
      <li><a href="/" title="Home page">Home</a></li>
      ${data.rows.map(row => `
        <li>
          <a href="/inv/type/${row.classification_id}" 
             title="See our inventory of ${row.classification_name} vehicles">
            ${row.classification_name}
          </a>
        </li>
      `).join('')}
    </ul>
  `;
};

// Define an asynchronous method 'getNav' within the Util object,
// which generates the navigation HTML as an unordered list.
Util.getNav = async function (req, res, next) {
  // Fetch classifications data from the inventory model.
  let data = await invModel.getClassifications(); // Retrieve classification data from the database.
  
  return navTemplateLiteral(data);
}

// console.log("Utili ties loaded:", Util.getNav());

let classificationGridTemplateLiteral = (data) => {
  // Check if data has entries
  if (data.length > 0) {
    return `
      <ul id="inv-display">
        ${data.map(vehicle => `
          <li>
            <a href="../../inv/detail/${vehicle.inv_id}" 
               title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
              <img src="${vehicle.inv_image}" 
                   alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" 
                   width="300"/>
            </a>
            <div class="namePrice">
              <hr />
              <h2>
                <a href="../../inv/detail/${vehicle.inv_id}" 
                   title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                  ${vehicle.inv_make} ${vehicle.inv_model}
                </a>
              </h2>
              <span>${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>
            </div>
          </li>
        `).join('')}
      </ul>
    `;
  } else {
    return '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
};

/* ============================================================================ *
 * Build the classification view HTML
 * ============================================================================ */

// Define an asynchronous function in the Util object to build HTML for the classification grid.
Util.buildClassificationGrid = async function(data) {
  // Return the constructed HTML string for the inventory grid.
  return classificationGridTemplateLiteral(data);
}

/* ============================================================================ *

 * Middleware (Any Function) For Handling Errors
 * 
 * This middleware function is designed to wrap other asynchronous functions 
 * (such as route handlers) to handle errors that may occur during their execution.
 * 
 * General Error Handling:
 * - It converts the input function (`fn`) into a middleware function that can handle 
 *   both the request and response objects, as well as the `next` function for 
 *   error propagation.
 * 
 * How It Works:
 * 1. The wrapped function (`fn`) is called with the request (`req`), response (`res`), 
 *    and next middleware function (`next`).
 * 2. The Promise.resolve() method is used to ensure that the function can handle both 
 *    synchronous and asynchronous code execution for request processing.
 * 3. If the function executes successfully (successfully completes request processing), 
 *    it returns the promise resolves without any issues.
 * 4. If any error occurs, the `.catch(next)` method catches it and calls the `next` 
 *    function with the error object, allowing the error-handling middleware to process it.
 * 
 * Usage:
 * - This utility can be used to wrap route handlers to ensure that any errors 
 *   they throw are correctly passed to the Express error-handling middleware.
 * ============================================================================ */
Util.handleErrors = fn => ( 
  (req, res, next) => 
  Promise.resolve(fn(req, res, next))
         .catch(next)
);


let inventoryItemDetailTemplateLiteral = (carData) => {
  carData = carData[0]; // Object is in an array: Extract the first object from the array

  if (carData && Object.keys(carData).length > 0) {
    return `
      <div class="vehicle-detail-container">
        <div class="vehicle-image-container">
          <img src="${carData.inv_image}" alt="Image of ${carData.inv_make} ${carData.inv_model}" class="vehicle-image">
        </div>
        
        <div class="vehicle-details">
          <p class="price">Price: $${new Intl.NumberFormat('en-US').format(carData.inv_price)}</p>
          <p><strong>Description:</strong> ${carData.inv_description}</p>
          <p><strong>Color:</strong> ${carData.inv_color}</p>
          <p><strong>Mileage:</strong> ${new Intl.NumberFormat('en-US').format(carData.inv_miles)} miles</p>
        </div>
      </div>
    `;
  } else {
    return '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
};

Util.buildInventoryItemDetailPage = async (data) => {
  // console.log(data.length)
  // Check if there is vehicle data (single data).
  if (data.length > 0) {
    // Use the function to build the HTML for the grid
    return inventoryItemDetailTemplateLiteral(data); // Store the HTML in a variable
  } else {
    // Handle the case where no vehicles are found.
    return '<p class="notice">Sorry, no matching vehicles could be found.</p>'; // Display a notice message.
  }

  // return inventoryItemDetailTemplateLiteral(data); // Store the HTML in a variable
};

// Export the Util object for use in other modules.
module.exports = Util;
