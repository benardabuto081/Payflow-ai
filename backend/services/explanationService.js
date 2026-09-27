const { getRepaymentTransactionById } = require('../models/repaymentTransaction');
const { getAuditLogsByTransactionId } = require('../models/auditLog');
const { generateText } = require('./watsonxClient');

/**
 * Generates a plain-language explanation of a stored repayment transaction,
 * grounded strictly in the actual transaction and audit log data - the model
 * narrates real facts, it never invents a transaction outcome.
 */
async function explainTransaction(transactionId) {
  const transaction = await getRepaymentTransactionById(transactionId);

  if (!transaction) {
    return { found: false, reason: 'No transaction found with this ID.' };
  }

  const auditLogs = await getAuditLogsByTransactionId(transactionId);
  const latestEvent = auditLogs[auditLogs.length - 1];

  const prompt = `You are a helpful assistant explaining a loan repayment transaction to a customer in plain, friendly language. Do not invent any information beyond what is provided below.

Transaction facts:
- Transaction ID: ${transaction.transaction_id}
- Account ID: ${transaction.account_id}
- Amount paid: ${transaction.amount_paid}
- Channel: ${transaction.channel}
- Status: ${transaction.status}
- Payment date: ${transaction.payment_date}
${latestEvent ? `- Latest audit event: ${latestEvent.event_type}, details: ${JSON.stringify(latestEvent.details)}` : ''}

Write a short, clear explanation (2-3 sentences) of what happened with this transaction, in plain language a non-technical customer would understand.

Explanation:`;

  const explanation = await generateText(prompt);

  return { found: true, transaction, explanation };
}

module.exports = { explainTransaction };
