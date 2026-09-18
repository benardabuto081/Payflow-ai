const { test } = require('node:test');
const assert = require('node:assert');
const { validateRepaymentRequest } = require('../services/validation');

const ACTIVE_ACCOUNT = 'a1111111-0000-0000-0000-000000000001';
const CLOSED_ACCOUNT = 'a2222222-0000-0000-0000-000000000002';
const DEFAULTED_ACCOUNT = 'a3333333-0000-0000-0000-000000000003';
const NONEXISTENT_ACCOUNT = '99999999-9999-9999-9999-999999999999';

test('accepts a valid repayment on an active account', async () => {
  const result = await validateRepaymentRequest(ACTIVE_ACCOUNT, 5000, 'mpesa');
  assert.strictEqual(result.valid, true);
});

test('rejects an unknown account', async () => {
  const result = await validateRepaymentRequest(NONEXISTENT_ACCOUNT, 5000, 'mpesa');
  assert.strictEqual(result.valid, false);
  assert.strictEqual(result.code, 'ACCOUNT_NOT_FOUND');
});

test('rejects repayment on a closed account', async () => {
  const result = await validateRepaymentRequest(CLOSED_ACCOUNT, 5000, 'mpesa');
  assert.strictEqual(result.valid, false);
  assert.strictEqual(result.code, 'ACCOUNT_NOT_ACTIVE');
});

test('rejects repayment on a defaulted account', async () => {
  const result = await validateRepaymentRequest(DEFAULTED_ACCOUNT, 5000, 'mpesa');
  assert.strictEqual(result.valid, false);
  assert.strictEqual(result.code, 'ACCOUNT_NOT_ACTIVE');
});

test('rejects a zero amount', async () => {
  const result = await validateRepaymentRequest(ACTIVE_ACCOUNT, 0, 'mpesa');
  assert.strictEqual(result.valid, false);
  assert.strictEqual(result.code, 'INVALID_AMOUNT');
});

test('rejects a negative amount', async () => {
  const result = await validateRepaymentRequest(ACTIVE_ACCOUNT, -100, 'mpesa');
  assert.strictEqual(result.valid, false);
  assert.strictEqual(result.code, 'INVALID_AMOUNT');
});

test('rejects an unsupported channel', async () => {
  const result = await validateRepaymentRequest(ACTIVE_ACCOUNT, 5000, 'paypal');
  assert.strictEqual(result.valid, false);
  assert.strictEqual(result.code, 'UNSUPPORTED_CHANNEL');
});
