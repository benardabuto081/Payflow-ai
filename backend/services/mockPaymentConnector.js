/**
 * Simulates an external payment provider (M-Pesa/bank/USSD).
 * Deterministic, not random: a specific trigger amount reliably
 * produces a simulated failure, so demo/test scenarios are reproducible.
 */

const FAILURE_TRIGGER_AMOUNT = 999999;

const FAILURE_REASONS = {
  mpesa: 'Simulated M-Pesa timeout: provider did not confirm the transaction.',
  bank: 'Simulated bank rejection: insufficient funds reported by provider.',
  ussd: 'Simulated USSD session failure: session expired before confirmation.',
};

/**
 * Process a mock payment.
 * Returns { success: true, providerRef } or { success: false, reason }.
 */
async function processMockPayment(amount, channel) {
  if (Number(amount) === FAILURE_TRIGGER_AMOUNT) {
    return {
      success: false,
      reason: FAILURE_REASONS[channel] || 'Simulated payment provider failure.',
    };
  }

  return {
    success: true,
    providerRef: `MOCK-${channel.toUpperCase()}-${Date.now()}`,
  };
}

module.exports = { processMockPayment, FAILURE_TRIGGER_AMOUNT };
