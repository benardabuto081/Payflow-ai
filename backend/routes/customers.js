const express = require('express');
const { getCustomerById } = require('../models/customer');

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const customer = await getCustomerById(req.params.id);

    if (!customer) {
      return res.status(404).json({ reason: 'No customer found with this ID.' });
    }

    return res.status(200).json(customer);
  } catch (err) {
    console.error('Unexpected error retrieving customer:', err);
    return res.status(500).json({ reason: 'Internal server error.' });
  }
});

module.exports = router;
