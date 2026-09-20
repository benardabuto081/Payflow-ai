const pool = require('./db');

/**
 * Insert a new repayment transaction record.
 * Only called when a transaction actually needs a ledger row —
 * i.e. after validation passes (whether the mock payment then succeeds or fails).
 */
async function createRepaymentTransaction({ accountId, amountPaid, channel, status }) {
  const result = await pool.query(
    `INSERT INTO repayment_transactions (account_id, amount_paid, channel, status)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [accountId, amountPaid, channel, status]
  );
  return result.rows[0];
}

async function getRepaymentTransactionById(transactionId) {
  const result = await pool.query(
    'SELECT * FROM repayment_transactions WHERE transaction_id = $1',
    [transactionId]
  );
  return result.rows[0] || null;
}

module.exports = { createRepaymentTransaction, getRepaymentTransactionById };
