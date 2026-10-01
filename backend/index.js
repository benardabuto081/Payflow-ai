require('dotenv').config();
const express = require('express');
const path = require('path');
const repaymentsRouter = require('./routes/repayments');
const loanAccountsRouter = require('./routes/loanAccounts');
const customersRouter = require('./routes/customers');
const aiRouter = require('./routes/ai');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Health check endpoint - confirms the server is running
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'payflow-ai-backend' });
});

app.use('/repayments', repaymentsRouter);
app.use('/loan-accounts', loanAccountsRouter);
app.use('/customers', customersRouter);
app.use('/ai', aiRouter);

// Serve the frontend
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.listen(PORT, () => {
  console.log(`PayFlow AI backend listening on port ${PORT}`);
});
