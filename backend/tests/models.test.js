const { test } = require('node:test');
const assert = require('node:assert');
const { getLoanAccountById } = require('../models/loanAccount');
const { getCustomerById } = require('../models/customer');

const ACTIVE_ACCOUNT = 'a1111111-0000-0000-0000-000000000001';
const KNOWN_CUSTOMER = '11111111-1111-1111-1111-111111111111';
const UNKNOWN_ID = '99999999-9999-9999-9999-999999999999';

test('getLoanAccountById returns the account for a known ID', async () => {
  const account = await getLoanAccountById(ACTIVE_ACCOUNT);
  assert.ok(account);
  assert.strictEqual(account.account_id, ACTIVE_ACCOUNT);
  assert.strictEqual(account.status, 'active');
});

test('getLoanAccountById returns null for an unknown ID', async () => {
  const account = await getLoanAccountById(UNKNOWN_ID);
  assert.strictEqual(account, null);
});

test('getCustomerById returns the customer for a known ID', async () => {
  const customer = await getCustomerById(KNOWN_CUSTOMER);
  assert.ok(customer);
  assert.strictEqual(customer.customer_id, KNOWN_CUSTOMER);
});

test('getCustomerById returns null for an unknown ID', async () => {
  const customer = await getCustomerById(UNKNOWN_ID);
  assert.strictEqual(customer, null);
});
