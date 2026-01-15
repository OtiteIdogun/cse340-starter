"use strict";

// Get a list of items in inventory based on the classification_id
let classificationList = document.querySelector("#classification-list");

classificationList.addEventListener("change", function () {
  let classification_id = classificationList.value;
  console.log(`classification_id is: ${classification_id}`);
  let classIdURL = "/inv/getInventory/" + classification_id;
  
  fetch(classIdURL)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw Error("Network response was not OK");
    })
    .then(function (data) {
      console.log(data);
      buildInventoryList(data); // OR buildInventoryListWithTemplateLiteral(data);
    })
    .catch(function (error) {
      console.log("There was a problem: ", error.message);
    });
});

/* =============================================================================== *
 * UI Components for Building Vehicle Inventory Grid View
 * =============================================================================== */

// Build inventory items into HTML table components and inject into DOM 
function buildInventoryList(data) {
  let inventoryDisplay = document.getElementById("inventory-display");
  // Set up the table labels
  let dataTable = "<thead>";
  dataTable += "<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>";
  dataTable += "</thead>";
  // Set up the table body
  dataTable += "<tbody>";
  // Iterate over all vehicles in the array and put each in a row
  data.forEach(function (element) {
    console.log(element.inv_id + ", " + element.inv_model);
    dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`;
    dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`;
    dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`;
  });
  dataTable += "</tbody>";
  // Display the contents in the Inventory Management view
  inventoryDisplay.innerHTML = dataTable;
}

InventoryListWithTemplateLiteral = async function (req, res, next) {
  return `
    <thead>
      <tr>
        <th>Vehicle Name</th>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
      </tr>
    </thead>
    <tbody>
      ${data.map((element) => `
        <tr>
          <td>${element.inv_make} ${element.inv_model}</td>
          <td><a href='/inv/edit/${element.inv_id}' title='Click to update' id="update">Modify</a></td>
          <td><a href='/inv/delete/${element.inv_id}' title='Click to delete' id="delete"><span class="delete">Delete</span> </a></td>
        </tr>
      `).join("")}
    </tbody>
  `;
}
// function buildInventoryList(data) {
//   let inventoryDisplay = document.getElementById("inventory-display");
//   let dataTable = InventoryListWithTemplateLiteral(data);
//   inventoryDisplay.innerHTML = dataTable;
// }