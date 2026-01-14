// Import the inventory model, which contains database interactions related to inventory.
const { Template } = require("ejs");
const invModel = require("../models/inventory-model");
const e = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config()

// Initialize an empty object to hold utility functions.
const Util = {};

/* ============================================================================ *
 * Navigation UI Component
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
};

// console.log("Utili ties loaded:", Util.getNav());

/* ============================================================================ *
 * UI Components for Building Vehicle Inventory Grid View
 * ============================================================================ */

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
                   width="300">
            </a>
            <div class="namePrice">
              <hr>
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

// Define an asynchronous function in the Util object to build HTML for the classification grid.
Util.buildClassificationGrid = async function (data) {
  // Return the constructed HTML string for the inventory grid.
  return classificationGridTemplateLiteral(data);
};

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
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

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

Util.buildLoginForm = (account_email="") => {
  return `
    <form action="/account/login" method="POST" class="login-form">
      <fieldset>
        <legend>Login</legend>

        <label for="account_email">Email Address:</label>
        <input type="email" 
               id="account_email" 
               name="account_email" 
               laceholder="Enter in email address e.g. johndoe@email.com" 
               placeholder="johndoe@email.com" 
               value="${account_email}"
               required>

        <label for="account_password">Password:</label>
        <input type="password" 
               id="account_password" 
               name="account_password" 
               laceholder="Enter in password" 
               placeholder="P@sswOrd123!" 
               required>
        
        <div class="show-password-container">
          <label for="show">Show Password</label>
          <input type="checkbox" name="show-password" id="show-password" onclick="togglePassword()">
        </div>
      </fieldset>

      <button type="submit">Login</button>

      <p>No account? <a href="/account/register">Sign-up</a></p>
    </form>
  `;
};

Util.buildRegisterForm = (account_firstname="", account_lastname="", account_email="") => {
  return `
    <form action="/account/register" method="POST" class="register-form">
      <fieldset>
        <legend>Register</legend>

        <label for="account_firstname">First Name: <span>*</span></label>
        <input type="text" 
               id="account_firstname" 
               name="account_firstname" 
               laceholder="Enter in first name e.g. John" 
               placeholder="John" 
               value="${account_firstname}" 
               required>

        <label for="account_lastname">Last Name: <span>*</span></label>
        <input type="text" 
               id="account_lastname" 
               name="account_lastname"  
               laceholder="Enter in last name e.g. Doe" 
               placeholder="Doe" 
               value="${account_lastname}" 
               required>

        <label for="account_email">Email Address: <span>*</span></label>
        <input type="email" 
               id="account_email" 
               name="account_email" 
               laceholder="Enter in email address e.g. johndoe@email.com" 
               placeholder="johndoe@email.com" 
               value="${account_email}" 
               required>

        <label for="account_password">Password: <span>*</span></label>
        <input type="password" 
               id="account_password" 
               name="account_password" 
               placeholder="P@sswOrd123!" 
               pattern="^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{12,}$" 
               required>
               
        <small>
          Password must include:<br>
          - At least one uppercase letter<br>
          - At least one digit<br>
          - At least one special character<br>
          - A total length of at least 12 characters
        </small>

        <div class="show-password-container">
          <label for="show">Show Password</label>
          <input type="checkbox" name="show-password" id="show-password" onclick="togglePassword()">
        </div>
      </fieldset>

      <button type="submit">Register</button>
    </form>
  `;
};

Util.cleanEmail = (account_email) => {
  let clean_email = account_email

  if (clean_email === '@') {
    clean_email = '';
  } else if (clean_email.startsWith('@')) {
    clean_email = clean_email.slice(1); // Use slice string method to remove first character
  }

  return clean_email
}

// The view must:
// Contain a form for adding a new classification (you will only need to add the classification name, the primary key in the table is auto-incrementing).
// The form must contain a direction that the new classification name cannot contain a space or special character of any kind.
// The form must contain client-side validation.
// The view must be delivered via a route and using the MVC architecture as with all other views.
// The view must meet the requirements of the frontend checklist.
// The form must send all data through the appropriate router, where server-side validation middleware is present, then on to the inventory controller and then to a function within the inventory model for insertion to the database.
// The view must have the means of displaying a flash message returned to it from the controller, as well as errors returned as a result of the server-side validation.
// If the insertion works, the controller should create a new navigation bar (which shows the new classification) and render the management view, along with a success message. Note: if it works, the new classification should appear as a navigation item immediately, without a page refresh. However, if it fails, then the add classification view should be rendered with a clear failure message.

Util.buildAddClassificationForm = (classification_name="") => {
  return `
    <form action="/inv/add-classification" method="POST" class="add-classification-form">
      <fieldset>
        <legend>Add Inventory Classification</legend>

        <label for="classification_name">Classification Name: <span>*</span></label>
        <input type="text" 
               id="classification_name" 
               name="classification_name" 
               laceholder="Enter in classification name e.g. Electronics" 
               placeholder="Caterpillar" 
               value="${classification_name}"
               pattern="^[A-Z][A-Za-z0-9]*$"
               required>
        <small>
          Name must have the following requirements:<br>
          - Begin with an uppercase letter<br>
          - Should not contain spaces<br>
          - Should not contain special characters<br>
        </small>
      </fieldset>

      <button type="submit">Add Classification</button>
    </form>
  `;
};

Util.buildAddInventoryForm = (classification_id="", inv_make="", inv_model="", inv_year="", inv_description="", inv_image="", inv_thumbnail="", inv_price="", inv_miles="", inv_color="") => {
  return `
    <form action="/inv/add-inventory" method="POST" id="add-inventory-form">
      <fieldset>
        <legend>Add New Inventory Item</legend>

        <label for="classification_id">Classification: <span>*</span></label>
        <select id="classification_id" name="classification_id" required>
          <option value="" disabled selected>Select Classification</option>
          <%= classificationSelect %>
        </select>

        <label for="inv_make">Make: <span>*</span></label>
        <input type="text" 
                id="inv_make" 
                name="inv_make" 
                placeholder="e.g. Toyota" 
                value="<%= locals.inv_make %>" 
                required>

        <label for="inv_model">Model: <span>*</span></label>
        <input type="text" 
                id="inv_model" 
                name="inv_model"  
                placeholder="e.g. Camry" 
                value="<%= locals.inv_model %>" 
                required>

        <label for="inv_year">Year: <span>*</span></label>
        <input type="number" 
                id="inv_year" 
                name="inv_year" 
                placeholder="e.g. 2020" 
                value="<%= locals.inv_year %>" 
                min="1900" max="2099" step="1"
                required>

        <label for="inv_description">Description: <span>*</span></label>
        <textarea id="inv_description" 
                  name="inv_description" 
                  placeholder="Enter vehicle description here..." 
                  required><%= locals.inv_description %></textarea>

        <label for="inv_image">Image URL: <span>*</span></label>
        <input type="url" 
                id="inv_image" 
                name="inv_image" 
                placeholder="e.g. /images/no-image.png" 
                value="<%= locals.inv_image %>" 
                required>

        <label for="inv_thumbnail">Thumbnail URL: <span>*</span></label>
        <input type="url" 
                id="inv_thumbnail" 
                name="inv_thumbnail"  
                placeholder="e.g. /images/no-image-tn.png" 
                value="<%= locals.inv_thumbnail %>" 
                required>

        <label for="inv_price">Price: <span>*</span></label>
        <input type="number" 
                id="inv_price" 
                name="inv_price" 
                placeholder="e.g. 10000" 
                value="<%= locals.inv_price %>" 
                min="0" step="0.01"
                required>

        <label for="inv_miles">Miles: <span>*</span></label>
        <input type="number" 
                id="inv_miles" 
                name="inv_miles" 
                placeholder="e.g. 10000" 
                value="<%= locals.inv_miles %>" 
                min="0" step="1"
                required>

        <label for="inv_color">Color: <span>*</span></label>
        <input type="text" 
                id="inv_color" 
                name="inv_color" 
                placeholder="e.g. Black" 
                value="<%= locals.inv_color %>" 
                required>

        <input type="submit" value="Add Inventory Item">
      </fieldset>
    </form>
  `;
};


/*
Task Three
Create an add inventory view in the views > inventory folder. The view must:
Contain a form for adding a new vehicle to the inventory table. (Hint: Check the inventory table in the database for the fields that will be needed in the form. DO NOT have a form field for the primary key as it is auto-incrementing in the database table).
The form must use client-side validation for all inputs.
Form inputs, including the select list for classifications, must be sticky, to retain the information when errors are detected and returned.
When indicating the classification the vehicle belongs to, the classification options must appear in a drop-down select list. The classification name must appear to the human eye, but the classification_id must be the value of each option. The select element drop-down list that should have been dynamically pre-built in the utilities > index file and passed to the view by the controller. (Hint: This will be similar to building the navigation bar, but will be wrapped inside a select element with options instead of an unordered list with list items.)
To help you, the following code exemplifies what the select list would look like:

Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
  }
An explanation of the code is not provided here. It is expected that you will study the code and discuss it with others in your learning team to ensure you understand it. If you have questions, please ask them in the discussion board.
When adding image paths, use the path to the No Image Available image and thumbnail respectively, that already exists in the vehicle images folder, or you could find and add a new image for the vehicle manually to the images folder and include the path in the form.
The view must have the means of displaying a flash message returned to it from the controller, as well as errors returned from the server-side validation process.
The view must meet the requirements of the frontend checklist.
The form must send all data via a route and using the MVC architecture as with other processes.
The data must be written to the inventory table within the database using a model-based function.
If the new inventory item is added successfully, a success message must be displayed in the management view. If successful, you can navigate through the appropriate navigation item to ensure the item appears in the inventory by classification view, and can be clicked to see all the item's details.
If the new item fails to be added to the database, a failure message must be displayed in the add inventory view.
*/

Util.classificationListTemplateLiteral = (data, classification_id) => {
  return `
      <!--
      <option value="">Choose a Classification</option>
      -->
      ${data.rows
        .map(
          (row) =>
            `<option label="${row.classification_name}" value="${row.classification_id}" ${
              classification_id == row.classification_id ? "selected" : ""
            }>${row.classification_name}</option>`
        )
        .join("")}
  `;
};

Util.buildClassificationListWithTemplateLiteral = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  return Util.classificationListTemplateLiteral(data, classification_id);
};

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList ='<select name="classification_id" id="classificationList" required>';

  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

Util.buildAccountManagemetDetailPage = async (data) => {
  data = data; // Object is in an array: Extract the first object from the array.
  // console.log(data);
  return `
    <div class="account-detail-container">
      <h2>Welcome, ${data.account_firstname} ${data.account_lastname}</h2>
      <div class="account-details">
        <p><strong>First Name:</strong> ${data.account_firstname}</p>
        <p><strong>Last Name:</strong> ${data.account_lastname}</p>
        <p><strong>Email:</strong> ${data.account_email}</p>
        <p><strong>Account Type:</strong> ${data.account_type}</p>
      </div>

      <a href="/account/edit/${data.account_id}" title="Edit Account Information">Edit Account Information</a>
    </div>
  `;
};

/* ============================================================================ *
* Middleware to check token validity
* ============================================================================ */

// Function to check for a valid JWT token in cookies
Util.checkJWTToken = (req, res, next) => {
  // Check if the JWT token exists in the cookies
  if (req.cookies.jwt) {
    // Verify the JWT token using the secret key
    jwt.verify(
      req.cookies.jwt, // The token to verify
      process.env.ACCESS_TOKEN_SECRET, // Secret used to validate the token
      function (err, accountData) {
        // Callback function that executes after verification
        
        // If there is an error during token verification (token is invalid or expired)
        if (err) {
          // Store a flash message to inform the user to log in
          req.flash("Please log in");
          
          // Clear the jwt cookie as it is no longer valid
          res.clearCookie("jwt");
          
          // Redirect the user to the login page
          return res.redirect("/account/login");
        }

        // If token is valid, store the account data in response locals for later use
        res.locals.accountData = accountData;
        
        // Set a flag indicating the user is logged in
        res.locals.loggedin = 1;
        
        // Proceed to the next middleware or route handler
        next();
      }
    );
  } else {
    // If there is no JWT token, call next() to continue without setting account data
    next();
  }
}

/* ============================================================================ *
 * Middleware to check if user is logged in
 * ============================================================================ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

// Export the Util object for use in other modules.
module.exports = Util;
