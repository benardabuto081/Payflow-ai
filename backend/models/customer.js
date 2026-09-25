const pool = require('./db');

async function getCustomerById(customerId) {
  const result = await pool.query(
    'SELECT * FROM customers WHERE customer_id = $1',
    [customerId]
  );
  return result.rows[0] || null;
}

module.exports = { getCustomerById };
