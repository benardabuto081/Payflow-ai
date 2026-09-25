require('dotenv').config();
const express = require('express');
const repaymentsRouter = require('./routes/repayments');
const loanAccountsRouter = require('./routes/loanAccounts');
const customersRouter = require('./routes/customers');

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

app.listen(PORT, () => {
  console.log(`PayFlow AI backend listening on port ${PORT}`);
});
