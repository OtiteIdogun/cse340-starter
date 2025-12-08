// Import the inventory model, which contains database interactions related to inventory.
const { Template } = require("ejs");
const invModel = require("../models/inventory-model");

// Initialize an empty object to hold utility functions.
const Util = {};

/* ============================================================================ *\
 * Constructs the nav HTML unordered list
\* ============================================================================ */

let templateLiteral = (data) => {
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
  
  // Initialize a string to build the HTML for the navigation list.
  let list = "<ul>";

  // Add a static "Home" link to the navigation list.
  list += '<li><a href="/" title="Home page">Home</a></li>';

  // Iterate over the rows of classification data to build the list items dynamically.
  data.rows.forEach((row) => {
    list += "<li>"; // Start a new list item.

    // Create a link for each classification, using its ID and name for dynamic content.
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";

      // OR using template literals:
      // list += `
      //   <li>
      //     <a href="/inv/type/${row.classification_id}" 
      //       title="See our inventory of ${row.classification_name} vehicles">
      //       ${row.classification_name}
      //     </a>
      //   </li>
      // `;

    list += "</li>"; // Close the list item.

    // // OR using the templateLiteral function:
    // templateLiteral(data);
  });

  list += "</ul>"; // Close the unordered list.

  // Return the constructed HTML as a string.
  return list;
}

// console.log("Utilities loaded:", Util.getNav());

// Export the Util object for use in other modules.
module.exports = Util;
