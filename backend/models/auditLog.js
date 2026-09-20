const pool = require('./db');

/**
 * Insert an audit log entry. transactionId may be null
 * (e.g. when a request is rejected before any transaction row exists).
 */
async function createAuditLog({ transactionId, eventType, details }) {
  const result = await pool.query(
    `INSERT INTO audit_logs (transaction_id, event_type, details)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [transactionId, eventType, details]
  );
  return result.rows[0];
}

async function getAuditLogsByTransactionId(transactionId) {
  const result = await pool.query(
    'SELECT * FROM audit_logs WHERE transaction_id = $1 ORDER BY created_at ASC',
    [transactionId]
  );
  return result.rows;
}

module.exports = { createAuditLog, getAuditLogsByTransactionId };
