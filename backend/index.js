require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Health check endpoint - confirms the server is running
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'payflow-ai-backend' });
});

app.listen(PORT, () => {
  console.log(`PayFlow AI backend listening on port ${PORT}`);
});
