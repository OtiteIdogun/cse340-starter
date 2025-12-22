// Import the Pool class from the 'pg' module, which is used to interact with PostgreSQL databases.
const { Pool } = require("pg");

// Load environment variables from a .env file into process.env
require("dotenv").config();

/* ============================================================================ *\
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
\* ============================================================================ */

// Configuration
const dbConfig = {
    host: 'localhost', // Or 'localhost'
    port: 5432, // PostgreSQL default port
    user: 'postgres',
    password: '20april2002(PostgreSQL)',
    database: 'cse340_db'
};

// Declare a variable 'pool' to hold the connection pool instance.
let pool;

// Check if the environment is 'development'.
if (process.env.NODE_ENV == "development") {

  // // Create a connection pool (recommended for efficiency)
  // pool = new Pool(dbConfig);
  
  // Create a new Pool instance for PostgreSQL with SSL configuration for development.
  pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Use the DATABASE_URL environment variable to establish the connection.
    ssl: {
      // SSL settings to allow self-signed certificates during development.
      rejectUnauthorized: false,  // Accept connections even if the certificate is not authorized.
    },
  });

  // Export an object with a query method for executing SQL queries.
  module.exports = {
    async query(text, params) {
      try {
        // Execute the SQL query using the pool's query method.
        const res = await pool.query(text, params);
        // console.log("executed query", { text }); // Log the executed query for troubleshooting.
        return res; // Return the result of the query.
      } catch (error) {
        throw error; // Rethrow the error for further handling.
      }
    },
  };
} else {
  
  // // Create a connection pool (recommended for efficiency)
  // pool = new Pool(dbConfig);

  // In non-development environments (production), create a Pool without SSL settings.
  pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Connection string remains the same.
  });
  
  // Export the pool instance directly for use in other modules.
  module.exports = pool;
}
