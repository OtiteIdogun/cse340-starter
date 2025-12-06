// Import the database connection pool from the database module.
const pool = require("../database/");

/* ============================================================================ *\
 *  Get all classification data
\* ============================================================================ */

// Define an asynchronous function to retrieve classifications from the database.
async function getClassifications() {
  // Execute a SQL query to fetch all records from the 'classification' table,
  // sorting the results by the 'classification_name' column.
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

// console.log("Inventory model loaded:", getClassifications()); // Log the Promise result for troubleshooting.

// Export the 'getClassifications' function for use in other modules.
module.exports = { getClassifications };
