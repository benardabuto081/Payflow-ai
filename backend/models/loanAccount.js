const pool = require('./db');

/**
 * Fetch a loan account by its account_id.
 * Returns the account row, or null if no matching account exists.
 */
async function getLoanAccountById(accountId) {
  const result = await pool.query(
    'SELECT * FROM loan_accounts WHERE account_id = $1',
    [accountId]
  );
  return result.rows[0] || null;
}

module.exports = { getLoanAccountById };
