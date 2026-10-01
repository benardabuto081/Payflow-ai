const { test } = require('node:test');
const assert = require('node:assert');
const { explainTransaction } = require('../services/explanationService');

// NOTE: this only tests the not-found path, which returns before any
// watsonx.ai network call. The live generation path (a real transaction ID,
// calling watsonx.ai's chat API) is NOT covered by an automated test here -
// doing so would make the suite slow, network-dependent, and consume real
// API usage on every run. That path has been manually verified multiple
// times via curl and the frontend UI (see docs/watson-orchestrate.md).

const UNKNOWN_TRANSACTION = '99999999-9999-9999-9999-999999999999';

test('explainTransaction returns found:false for an unknown transaction', async () => {
  const result = await explainTransaction(UNKNOWN_TRANSACTION);
  assert.strictEqual(result.found, false);
  assert.ok(result.reason);
});
