const { validateRepaymentRequest } = require('./validation');
const { processMockPayment } = require('./mockPaymentConnector');
const { createRepaymentTransaction } = require('../models/repaymentTransaction');
const { createAuditLog } = require('../models/auditLog');

/**
 * Orchestrates a full repayment attempt: validate -> mock payment -> record -> audit.
 * This is the single entry point that enforces Rule 1/2 (AI/callers never
 * mutate the ledger directly) and Rule 5 (every outcome is auditable).
 */
async function processRepayment({ accountId, amount, channel }) {
  const validation = await validateRepaymentRequest(accountId, amount, channel);

  if (!validation.valid) {
    await createAuditLog({
      transactionId: null,
      eventType: 'REPAYMENT_REJECTED',
      details: { accountId, amount, channel, code: validation.code, reason: validation.reason },
    });
    return { outcome: 'REJECTED', code: validation.code, reason: validation.reason };
  }

  const paymentResult = await processMockPayment(amount, channel);

  if (!paymentResult.success) {
    const transaction = await createRepaymentTransaction({
      accountId,
      amountPaid: amount,
      channel,
      status: 'FAILED',
    });
    await createAuditLog({
      transactionId: transaction.transaction_id,
      eventType: 'REPAYMENT_FAILED',
      details: { reason: paymentResult.reason },
    });
    return { outcome: 'FAILED', transaction, reason: paymentResult.reason };
  }

  const transaction = await createRepaymentTransaction({
    accountId,
    amountPaid: amount,
    channel,
    status: 'COMPLETED',
  });
  await createAuditLog({
    transactionId: transaction.transaction_id,
    eventType: 'REPAYMENT_COMPLETED',
    details: { providerRef: paymentResult.providerRef },
  });

  return { outcome: 'COMPLETED', transaction };
}

module.exports = { processRepayment };
