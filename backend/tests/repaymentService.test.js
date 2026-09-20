const { test } = require('node:test');
const assert = require('node:assert');
const { processRepayment } = require('../services/repaymentService');
const { FAILURE_TRIGGER_AMOUNT } = require('../services/mockPaymentConnector');

// LA004 - spare seeded active account, kept separate from LA001 (demo account)
const TEST_ACCOUNT = 'a4444444-0000-0000-0000-000000000004';
const UNKNOWN_ACCOUNT = '99999999-9999-9999-9999-999999999999';

test('processRepayment: completes a valid repayment and persists it', async () => {
  const result = await processRepayment({ accountId: TEST_ACCOUNT, amount: 1000, channel: 'mpesa' });

  assert.strictEqual(result.outcome, 'COMPLETED');
  assert.strictEqual(result.transaction.status, 'COMPLETED');
  assert.strictEqual(result.transaction.account_id, TEST_ACCOUNT);
  assert.ok(result.transaction.transaction_id);
});

test('processRepayment: records a FAILED transaction when the mock provider declines', async () => {
  const result = await processRepayment({ accountId: TEST_ACCOUNT, amount: FAILURE_TRIGGER_AMOUNT, channel: 'mpesa' });

  assert.strictEqual(result.outcome, 'FAILED');
  assert.strictEqual(result.transaction.status, 'FAILED');
  assert.ok(result.reason);
});

test('processRepayment: rejects an invalid request without creating a transaction', async () => {
  const result = await processRepayment({ accountId: UNKNOWN_ACCOUNT, amount: 1000, channel: 'mpesa' });

  assert.strictEqual(result.outcome, 'REJECTED');
  assert.strictEqual(result.code, 'ACCOUNT_NOT_FOUND');
  assert.strictEqual(result.transaction, undefined);
});
