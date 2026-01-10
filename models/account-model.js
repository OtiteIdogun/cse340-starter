// Import the database connection pool from the database module.
const pool = require("../database/");
const { get } = require("../routes/static");

/* ============================================================================ *
 * Register new account
 * ============================================================================ */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = `
      INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) 
      VALUES ($1, $2, $3, $4, 'Client') 
      RETURNING *`
    
    // // If account already exists, prevent duplicate registration
    // const existingAccount = await pool.query("SELECT * FROM account WHERE account_email = $1", [account_email]);
    // if (existingAccount.rows.length > 0) {
    //   throw new Error("Account already exists");
    // }

    // If account already exists, prevent duplicate registration
    accountEmail = await checkExistingAccountByEmail(account_email)
    if (accountEmail) {
      throw new Error("Account already exists");
    }

    return await pool.query(sql, [
        account_firstname, account_lastname, account_email, account_password
      ])
  } catch (error) {
    return error.message
  }
}

getAccountByEmail = async function (account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    return await pool.query(sql, [account_email])
  } catch (error) {
    return error.message
  }
}

/* ============================================================================ *
 *   Check for existing email
 * ============================================================================ */
async function checkExistingAccountByEmail(account_email){
  try {
    const sql = `SELECT * FROM account 
                 WHERE account_email = $1`
                 
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

module.exports = { registerAccount, getAccountByEmail, checkExistingAccountByEmail };