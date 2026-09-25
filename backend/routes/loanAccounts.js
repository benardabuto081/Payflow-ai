const express = require('express');
const { getLoanAccountById } = require('../models/loanAccount');

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const account = await getLoanAccountById(req.params.id);

    if (!account) {
      return res.status(404).json({ reason: 'No loan account found with this ID.' });
    }

    return res.status(200).json(account);
  } catch (err) {
    console.error('Unexpected error retrieving loan account:', err);
    return res.status(500).json({ reason: 'Internal server error.' });
  }
});

module.exports = router;
