const API_BASE = '';

async function checkHealth() {
  const statusEl = document.getElementById('apiStatus');
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (res.ok) {
      statusEl.textContent = 'Backend connected';
    } else {
      statusEl.textContent = 'Backend unreachable';
    }
  } catch {
    statusEl.textContent = 'Backend unreachable';
  }
}

function stampFor(outcome) {
  const cls = outcome.toLowerCase();
  return `<span class="stamp stamp--${cls}">${outcome}</span>`;
}

document.getElementById('repaymentForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const accountId = document.getElementById('accountId').value.trim();
  const amount = Number(document.getElementById('amount').value);
  const channel = document.querySelector('input[name="channel"]:checked').value;

  const resultEl = document.getElementById('repaymentResult');
  resultEl.hidden = false;
  resultEl.innerHTML = 'Processing…';

  try {
    const res = await fetch(`${API_BASE}/repayments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId, amount, channel }),
    });
    const data = await res.json();

    if (data.outcome === 'COMPLETED') {
      resultEl.innerHTML = `
        ${stampFor('completed')}
        <p>Transaction ID: ${data.transaction.transaction_id}</p>
      `;
    } else if (data.outcome === 'FAILED') {
      resultEl.innerHTML = `
        ${stampFor('failed')}
        <p>${data.reason}</p>
      `;
    } else {
      resultEl.innerHTML = `
        ${stampFor('rejected')}
        <p>${data.reason}</p>
      `;
    }
  } catch (err) {
    resultEl.innerHTML = `<p>Could not reach the backend. Is it running?</p>`;
  }
});

let currentLookupId = null;

document.getElementById('lookupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('lookupId').value.trim();
  const resultEl = document.getElementById('lookupResult');
  const explainBtn = document.getElementById('explainBtn');
  const explanationEl = document.getElementById('explanation');

  resultEl.hidden = false;
  resultEl.innerHTML = 'Looking up…';
  explainBtn.hidden = true;
  explanationEl.hidden = true;

  try {
    const res = await fetch(`${API_BASE}/repayments/${id}`);

    if (res.status === 404) {
      resultEl.innerHTML = 'No transaction found with this ID.';
      return;
    }

    const tx = await res.json();
    currentLookupId = tx.transaction_id;

    resultEl.innerHTML = `
      ${stampFor(tx.status)}
      <p>Account: ${tx.account_id}</p>
      <p>Amount: ${tx.amount_paid} via ${tx.channel}</p>
      <p>Recorded: ${new Date(tx.created_at).toLocaleString()}</p>
    `;
    explainBtn.hidden = false;
  } catch (err) {
    resultEl.innerHTML = 'Could not reach the backend. Is it running?';
  }
});

document.getElementById('explainBtn').addEventListener('click', async () => {
  const explanationEl = document.getElementById('explanation');
  explanationEl.hidden = false;
  explanationEl.innerHTML = 'Asking watsonx.ai…';

  try {
    const res = await fetch(`${API_BASE}/ai/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactionId: currentLookupId }),
    });
    const data = await res.json();
    explanationEl.innerHTML = data.explanation || 'No explanation was returned.';
  } catch (err) {
    explanationEl.innerHTML = 'Could not reach the backend. Is it running?';
  }
});

checkHealth();
