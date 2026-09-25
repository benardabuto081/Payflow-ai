const express = require('express');
const { processRepayment } = require('../services/repaymentService');
const { getRepaymentTransactionById } = require('../models/repaymentTransaction');

const router = express.Router();

router.post('/', async (req, res) => {
  const { accountId, amount, channel } = req.body;

  if (!accountId || amount === undefined || !channel) {
    return res.status(400).json({
      outcome: 'REJECTED',
      code: 'MISSING_FIELDS',
      reason: 'accountId, amount, and channel are all required.',
    });
  }

  try {
    const result = await processRepayment({ accountId, amount, channel });

    if (result.outcome === 'REJECTED') {
      return res.status(400).json(result);
    }
    if (result.outcome === 'FAILED') {
      return res.status(422).json(result);
    }
    return res.status(201).json(result);
  } catch (err) {
    console.error('Unexpected error processing repayment:', err);
    return res.status(500).json({ outcome: 'ERROR', reason: 'Internal server error.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const transaction = await getRepaymentTransactionById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ reason: 'No repayment transaction found with this ID.' });
    }

    return res.status(200).json(transaction);
  } catch (err) {
    console.error('Unexpected error retrieving repayment:', err);
    return res.status(500).json({ reason: 'Internal server error.' });
  }
});

module.exports = router;
