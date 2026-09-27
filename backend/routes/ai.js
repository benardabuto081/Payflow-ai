const express = require('express');
const { explainTransaction } = require('../services/explanationService');

const router = express.Router();

router.post('/explain', async (req, res) => {
  const { transactionId } = req.body;

  if (!transactionId) {
    return res.status(400).json({ reason: 'transactionId is required.' });
  }

  try {
    const result = await explainTransaction(transactionId);

    if (!result.found) {
      return res.status(404).json({ reason: result.reason });
    }

    return res.status(200).json({
      transactionId,
      status: result.transaction.status,
      explanation: result.explanation,
    });
  } catch (err) {
    console.error('Unexpected error generating explanation:', err);
    return res.status(500).json({ reason: 'Internal server error.' });
  }
});

module.exports = router;
