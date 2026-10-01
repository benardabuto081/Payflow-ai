require('dotenv').config();

const IAM_TOKEN_URL = 'https://iam.cloud.ibm.com/identity/token';

let cachedToken = null;
let tokenExpiresAt = 0;

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const response = await fetch(IAM_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
      apikey: process.env.WATSONX_API_KEY,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get IAM token: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;
  return cachedToken;
}

async function generateText(prompt, { modelId = 'ibm/granite-4-h-small', maxTokens = 200 } = {}) {
  const token = await getAccessToken();

  const response = await fetch(
    `${process.env.WATSONX_URL}/ml/v1/text/chat?version=2024-05-31`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        model_id: modelId,
        space_id: process.env.WATSONX_SPACE_ID,
        messages: [
          { role: 'user', content: prompt },
        ],
        max_tokens: maxTokens,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`watsonx.ai generation failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}

module.exports = { generateText };
