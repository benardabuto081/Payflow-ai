const { getLoanAccountById } = require('../models/loanAccount');

const VALID_CHANNELS = ['mpesa', 'bank', 'ussd'];

/**
 * Validates a repayment request against deterministic business rules.
 * Returns { valid: true, account } on success,
 * or { valid: false, reason, code } on failure.
 */
async function validateRepaymentRequest(accountId, amount, channel) {
  const account = await getLoanAccountById(accountId);

  if (!account) {
    return { valid: false, code: 'ACCOUNT_NOT_FOUND', reason: 'No loan account exists with this ID.' };
  }

  if (account.status !== 'active') {
    return {
      valid: false,
      code: 'ACCOUNT_NOT_ACTIVE',
      reason: `Loan account is ${account.status}, not active. Repayments cannot be processed.`,
    };
  }

  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return { valid: false, code: 'INVALID_AMOUNT', reason: 'Repayment amount must be a positive number.' };
  }

  if (!VALID_CHANNELS.includes(channel)) {
    return {
      valid: false,
      code: 'UNSUPPORTED_CHANNEL',
      reason: `Channel '${channel}' is not supported. Use one of: ${VALID_CHANNELS.join(', ')}.`,
    };
  }

  return { valid: true, account };
}

module.exports = { validateRepaymentRequest, VALID_CHANNELS };
