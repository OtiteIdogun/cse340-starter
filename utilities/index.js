// Import the inventory model, which contains database interactions related to inventory.
const { Template } = require("ejs");
const invModel = require("../models/inventory-model");

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
  
  // // Initialize a string to build the HTML for the navigation list.
  // let list = "<ul>";

  // // Add a static "Home" link to the navigation list.
  // list += '<li><a href="/" title="Home page">Home</a></li>';

  // // Iterate over the rows of classification data to build the list items dynamically.
  // data.rows.forEach((row) => {
  //   list += "<li>"; // Start a new list item.

  //   // Create a link for each classification, using its ID and name for dynamic content.
  //   list +=
  //     '<a href="/inv/type/' +
  //     row.classification_id +
  //     '" title="See our inventory of ' +
  //     row.classification_name +
  //     ' vehicles">' +
  //     row.classification_name +
  //     "</a>";

  //     // OR using template literals:
  //     // list += `
  //     //   <li>
  //     //     <a href="/inv/type/${row.classification_id}" 
  //     //       title="See our inventory of ${row.classification_name} vehicles">
  //     //       ${row.classification_name}
  //     //     </a>
  //     //   </li>
  //     // `;

  //   list += "</li>"; // Close the list item.
  // });

  // list += "</ul>"; // Close the unordered list.

  // // Return the constructed HTML as a string.
  // return list;

  // OR using the templateLiteral function:
  return navTemplateLiteral(data);
}

// console.log("Utilities loaded:", Util.getNav());

let classificationGridTemplateLiteral = (data) => {
  // Check if data has entries
  if (data.length > 0) {
    return `
      <ul id="inv-display">
        ${data.map(vehicle => `
          <li>
            <a href="../../inv/detail/${vehicle.inv_id}" 
               title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
              <img src="${vehicle.inv_thumbnail}" 
                   alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
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
  let grid; // Initialize a variable to hold the HTML string for the grid.

  // // Check if there are any vehicle data entries.
  // if (data.length > 0) {
  //   // Start building the unordered list for inventory display.
  //   grid = '<ul id="inv-display">';

  //   // Loop through each vehicle in the data array to create list items.
  //   data.forEach(vehicle => { 
  //     grid += '<li>'; // Start a new list item.

  //     // Create a link for each vehicle that points to its detailed view.
  //     grid += '<a href="../../inv/detail/' + vehicle.inv_id 
  //       + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model 
  //       + ' details"><img src="' + vehicle.inv_thumbnail 
  //       + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model 
  //       + ' on CSE Motors" /></a>'; // Add vehicle thumbnail image with a link.

  //     // Add a div to display the vehicle name and price.
  //     grid += '<div class="namePrice">';
  //     grid += '<hr />'; // Horizontal rule for separation.
  //     grid += '<h2>'; // Start the heading for vehicle name.
      
  //     // Create a link for the vehicle name pointing to its detail page.
  //     grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View ' 
  //       + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
  //       + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'; // Vehicle make and model.

  //     grid += '</h2>'; // Close the heading.
  //     grid += '<span>$' 
  //       + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'; // Format and display the price.
  //     grid += '</div>'; // Close the div for name and price.
  //     grid += '</li>'; // Close the list item.
  //   });

  //   grid += '</ul>'; // Close the unordered list.
  // } else { 
  //   // Handle the case where no vehicles are found.
  //   grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'; // Display a notice message.
  // }
  
  // // Return the constructed HTML string for the inventory grid.
  // return grid;

  // OR using the buildClassificationGridTemplate function:
  // Check if there are any vehicle data entries.
  if (data.length > 0) {
    // Use the function to build the HTML for the grid
    grid = classificationGridTemplateLiteral(data); // Store the HTML in a variable
  } else {
    // Handle the case where no vehicles are found.
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'; // Display a notice message.
  }
  
  // Return the constructed HTML string for the inventory grid.
  return grid;
}

// Export the Util object for use in other modules.
module.exports = Util;
