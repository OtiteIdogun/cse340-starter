/**
 * Database Connection Module
 * PostgreSQL connection pool with environment-specific configuration
 
 * SSL configuration is required for local development
 * but will cause issues in production environment.
 * The conditional logic below determines which configuration to use.
*/

const { Pool } = require("pg");
require("dotenv").config();

// ============================================================================
// Connection Pool Configuration
// ============================================================================
const poolConfig = {
  connectionString: process.env.DATABASE_URL,
};

// Add SSL configuration for development only
if (process.env.NODE_ENV === "development") {
  poolConfig.ssl = {
    rejectUnauthorized: false,
  };
}

const pool = new Pool(poolConfig);

// ============================================================================
// Query Wrapper (Development Logging)
// ============================================================================
const query = async (text, params) => {
  try {
    const result = await pool.query(text, params);
    if (process.env.NODE_ENV === "development") {
      console.log("Query executed:", { text });
    }
    return result;
  } catch (error) {
    console.error("Database query error:", { text, error: error.message });
    throw error;
  }
};

// ============================================================================
// Exports
// ============================================================================
module.exports = process.env.NODE_ENV === "development"
  ? { query }
  : pool;
