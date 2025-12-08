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
      WHERE i.classification_id = $1`,  // Use a parameterized query to prevent SQL injection.
      [classification_id] // Bind the classification ID to the query.
    );

    // Return the rows of data retrieved from the query.
    return data.rows; // This contains the inventory items and their associated classification names.
  } catch (error) {
    // Log any errors encountered during the database query execution.
    console.error("getInventoryByClassificationId error: " + error);
  }
}

// Export the 'getClassifications' function for use in other modules.
module.exports = { getClassifications , getInventoryByClassificationId };
