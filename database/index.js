const { Pool } = require("pg");
require("dotenv").config();

/**
 * Database Connection Module (Pool)
 * PostgreSQL connection pool with environment-specific configuration

 * SSL configuration is required for local development
 * but will cause issues in production environment.
 * The conditional logic below determines which configuration to use.
 */

let pool;

if (process.env.NODE_ENV === "development") {
  // Development configuration with SSL disabled
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  // Added for troubleshooting queries
  // during development   
  module.exports = {
    async query(text, params) {
      try {
        const res = await pool.query(text, params);
        console.log("executed query", { text });
        return res;
      } catch (error) {
        console.error("error in query", { text });
        throw error;
      }
    },
  };
} else {
  // Production configuration
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  module.exports = pool;
}



// /**
//  * Database Connection Module
//  * PostgreSQL connection pool with environment-specific configuration
 
//  * SSL configuration is required for local development
//  * but will cause issues in production environment.
//  * The conditional logic below determines which configuration to use.
// */

// const { Pool } = require("pg");
// require("dotenv").config();

// // ============================================================================
// // Connection Pool Configuration
// // ============================================================================
// const poolConfig = {
//   connectionString: process.env.DATABASE_URL,
// };

// // Add SSL configuration for development only
// if (process.env.NODE_ENV === "development") {
//   poolConfig.ssl = {
//     rejectUnauthorized: false,
//   };
// }

// const pool = new Pool(poolConfig);

// // ============================================================================
// // Query Wrapper (Development Logging)
// // ============================================================================
// const query = async (text, params) => {
//   try {
//     const result = await pool.query(text, params);
//     if (process.env.NODE_ENV === "development") {
//       console.log("Query executed:", { text });
//     }
//     return result;
//   } catch (error) {
//     console.error("Database query error:", { text, error: error.message });
//     throw error;
//   }
// };

// // ============================================================================
// // Exports
// // ============================================================================
// module.exports = process.env.NODE_ENV === "development"
//   ? { query }
//   : pool;
