// const pool = require("../database/")
    
// /* ****************************
//  *  Get all classification data
//  * ************************** */
// async function getClassifications(){
//   const result = await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
//   return result.rows
// }

// module.exports = {getClassifications}


/**
 * Inventory Model
 * Database queries for classification and inventory data
 */

const pool = require("../database/");

// ============================================================================
// Classification Queries
// ============================================================================

/**
 * Retrieve all vehicle classifications
 * @returns {Promise<Array>} Array of classification objects
 */
const getClassifications = async () => {
  const sql = "SELECT * FROM public.classification ORDER BY classification_name;";
  const result = await pool.query(sql);
  return result.rows;
};

// ============================================================================
// Inventory Queries
// ============================================================================

/**
 * Retrieve inventory items by classification ID
 * @param {number} classificationId - The classification ID to filter by
 * @returns {Promise<Array>} Array of inventory objects
 */
const getInventoryByClassification = async (classificationId) => {
  const sql =
    "SELECT * FROM public.inventory WHERE classification_id = $1 ORDER BY inv_make;";
  const result = await pool.query(sql, [classificationId]);
  return result.rows;
};

/**
 * Retrieve a single inventory item by ID
 * @param {number} invId - The inventory item ID
 * @returns {Promise<Object|null>} The inventory object or null if not found
 */
const getInventoryById = async (invId) => {
  const sql = "SELECT * FROM public.inventory WHERE inv_id = $1;";
  const result = await pool.query(sql, [invId]);
  return result.rows[0] || null;
};

// ============================================================================
// Exports
// ============================================================================
module.exports = {
  getClassifications,
  getInventoryByClassification,
  getInventoryById,
};