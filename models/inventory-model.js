// Import the database connection pool from the database module.
const pool = require("../database/");

/* ============================================================================ *
 *  Get all classification data
 * ============================================================================ */

// Define an asynchronous function to retrieve classifications from the database.
async function getClassifications() {
  // Execute a SQL query to fetch all records from the 'classification' table,
  // sorting the results by the 'classification_name' column.
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

// console.log("Inventory model loaded:", getClassifications()); // Log the Promise result for troubleshooting.

/* ============================================================================ *
 *  Get all inventory items and classification_name by classification_id
 * ============================================================================ */

// Define an asynchronous function to retrieve inventory items based on classification ID.
async function getInventoryByClassificationId(classification_id) {
  try {
    // Execute a parameterized SQL query to fetch inventory items along with their classification names.
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1
      ORDER BY i.inv_id`,  // Sort the results by inv_id. Also, query used a parameterized query `$1` to prevent SQL injection.
      [classification_id] // Bind the classification ID to the query.
    );

    // Return the rows of data retrieved from the query.
    return data.rows; // This contains the inventory items and their associated classification names.
  } catch (error) {
    // Log any errors encountered during the database query execution.
    console.error("getInventoryByClassificationId error: " + error);
  }
}

// getInventoryByClassificationId(2);

/* ============================================================================ *
 *  Get inventory item details by inv_id
 * ============================================================================ */  
async function getInventoryItemDetailsById(inv_id) {
  try {
    let sql = `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.inv_id = $1`; // Use a parameterized query to prevent SQL injection.

    // Execute a parameterized SQL query to fetch inventory items along with their classification names.
    const data = await pool.query(
      sql,
      [inv_id] // Bind the inventory ID to the query.
    );

    // console.log("(models/inventory-model.js) getInventoryItemDetailsById", data.rows);

    // Return the rows of data retrieved from the query.
    return data.rows; // This contains the inventory item and its associated classification name.
  } catch (error) {
    // Log any errors encountered during the database query execution.
    console.error("getInventoryItemDetailsById error: " + error);
  }
}

// getInventoryItemDetailsById(2);

/* ============================================================================ *
 *  Add new inventory classification
 * ============================================================================ */
addNewInventoryClassification = async (classificationName) => {
  try {
    let sql = `INSERT INTO public.classification (classification_name) 
               VALUES ($1)`;
    const data = await pool.query(sql, [classificationName]);

    // console.log(`addNewInventoryClassification (models/inventory-model.js): \n${'-'.repeat(30)}\n Added new classification: ${classificationName}\n data.rowCount: ${data.rowCount}\n${'-'.repeat(30)}`);
    return data;
  } catch (error) {
    console.error("addNewClassification error: " + error);
  }
}

/* ============================================================================ *
 *  Check for existing classification
 * ============================================================================ */
checkExistingClassification = async (classification_name) => {
  try {
    const sql = "SELECT classification_name FROM public.classification WHERE classification_name = $1";
    const data = await pool.query(sql, [classification_name]);
    return data.rowCount // OR data.rows.length > 0;
  } catch (error) {
    console.error("checkExistingClassification error: " + error);
    return error.message
  }
}

/* ============================================================================ *
 *  Get classification name by ID
 * ============================================================================ */
getClassificationName = async (classification_id) => {
  try {
    const sql = "SELECT classification_name FROM public.classification WHERE classification_id = $1";
    const data = await pool.query(sql, [classification_id]);
    return data.rows[0].classification_name;
  } catch (error) {
    console.error("getClassificationName error: " + error);
    return error.message
  }
}

addNewInventoryItem = async (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) => {
  try {
    let sql = `INSERT INTO public.inventory 
                   (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) 
               VALUES 
                   ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
    const data = await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id]);

    console.log("(models/inventory-model.js) addNewInventoryItem", data.rows);
    return data;
  } catch (error) {
    console.error("addNewInventoryItem error: " + error);
  }
}

checkExistingInventoryItem = async (inv_make, inv_model, inv_year, inv_color, classification_id) => {
  try {
    const sql = `SELECT * FROM public.inventory 
                 WHERE inv_make = $1 
                 AND inv_model = $2 
                 AND inv_year = $3 
                 AND inv_color = $4 
                 AND classification_id = $5`;

    const data = await pool.query(sql, [inv_make, inv_model, inv_year, inv_color, classification_id]);
    return data.rowCount > 0;
  } catch (error) {
    console.error("checkExistingInventoryItem error: " + error);
    return error.message;
  }
}

async function getInventoryById(inv_id) {
  try {
    const sql = `SELECT * FROM public.inventory 
                 WHERE inv_id = $1
                 ORDER BY inv_id`;

    const data = await pool.query(sql, [inv_id]);

    return data.rows[0];
  } catch (error) {
    console.error("getInventoryById error: " + error);
  }
}

async function updateInventory(inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
  try {
    const sql = `UPDATE public.inventory 
                 SET inv_make = $1, 
                     inv_model = $2, 
                     inv_year = $3, 
                     inv_description = $4, 
                     inv_image = $5, 
                     inv_thumbnail = $6, 
                     inv_price = $7, 
                     inv_miles = $8, 
                     inv_color = $9, 
                     classification_id = $10 
                 WHERE inv_id = $11`;
                 
    const data = await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id]);
    return data; // OR return data.rows // OR return data.rows[0] OR return data.rowCount. The best is to return the entire result object.   
                /*
                Note: 
                - If `return data` is used, the calling function will receive the entire result object, including 
                  `rows`, `rowCount`, and other metadata. This allows for comprehensive handling of the result.

                - If `return data.rows` is used, the calling function will receive an array of rows returned from 
                  the query. For an `UPDATE` statement, this may not be applicable unless specified with `RETURNING *`.
                  
                  e.g. (example of using RETURNING *)
                  ===============================================================
                  const sql =
                  `UPDATE public.inventory 
                    SET inv_make = $1, 
                        inv_model = $2, 
                        inv_year = $3, 
                        inv_description = $4,
                        inv_image = $5, 
                        inv_thumbnail = $6, 
                        inv_price = $7, 
                        inv_miles = $8, 
                        inv_color = $9, 
                        classification_id = $10 
                    WHERE inv_id = $11
                    RETURNING *; // OR RETURNING inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id`.

                    Using RETURNING * helps to return all columns in the table after the update.
                  
                - If `return data.rows[0]` is used, the calling function will receive only the first row of the 
                  result set. For an `UPDATE`, this typically yields `undefined` unless the query explicitly returns 
                  rows.

                  e.g. (example of returning with data.rows[0] after using `RETURNING *` in the update)
                  ===============================================================
                  ```js
                  console.log("(models/inventory-model.js) updateInventory", data.rows[0]);
                  ```

                  OUTPUT - the console.log below would show `undefined` unless `RETURNING *` is added to the SQL statement.:
                  ```
                  (models/inventory-model.js) updateInventory undefined
                  ```

                  If using `RETURNING *`, it would return the updated row.
                  OUTPUT:
                  ```
                  (models/inventory-model.js) updateInventory {
                    inv_id: 1,
                    inv_make: 'Honda',
                    inv_model: 'Civic',
                    inv_year: 2022,
                    inv_description: 'A great car',
                    inv_image: 'https://example.com/image.jpg',
                    inv_thumbnail: 'https://example.com/thumbnail.jpg',
                    inv_price: 25000, 
                    inv_miles: 10000,
                    inv_color: 'Red', 
                    classification_id: 1
                  }
                  ```
                  ===============================================================

                - If `return data.rowCount` is used, the calling function will receive the number of rows affected 
                  by the `UPDATE` statement. This is useful for confirming whether any records were updated.

                  e.g. (Example of using data.rowCount after using `RETURNING *` in the update)
                  ===============================================================
                  ```js
                  console.log("(models/inventory-model.js) updateInventory", data.rowCount);
                  ```

                  OUTPUT:
                  ```
                  (models/inventory-model.js) updateInventory 1
                  ```
                  ===============================================================

                In all cases, the calling function in the controller must be updated to handle the returned value 
                appropriately based on which return statement is implemented.
                */ 

  } catch (error) {
    console.error("updateInventory error: " + error);
  }
}

/* ============================================================================ *
 * Exported Functions
 * ============================================================================ */
// module.exports = { getClassifications , getInventoryByClassificationId, getInventoryItemDetailsById, addNewInventoryClassification, checkExistingClassification , addNewInventoryItem };
module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryItemDetailsById,
  addNewInventoryClassification,
  checkExistingClassification,
  getClassificationName,
  addNewInventoryItem,
  checkExistingInventoryItem,
  getInventoryById,
  updateInventory
};
