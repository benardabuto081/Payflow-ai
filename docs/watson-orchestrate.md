# Watson Orchestrate Configuration

This documents the Watson Orchestrate agent configuration, since Orchestrate
itself is IBM cloud-hosted and this configuration doesn't live in git.

## Environment

- IBM Cloud account: ITZ-WATSONX-18
- Region: eu-de (Frankfurt)
- Product: watsonx Orchestrate (Trial plan)
- Instance: itz-wxo-6ab69e3584b2abfcb97...

## Agent

- **Name:** PayFlow Repayment Assistant
- **Model:** GPT-OSS 120B (OpenAI, via Groq)
- **Description:** Interprets natural-language loan repayment requests, validates
  and processes them through the PayFlow AI backend, and explains the outcome
  to the user in plain language.

## Tools (imported via OpenAPI spec, see `docs/openapi.yaml`)

1. **Submit a loan repayment** (`POST /repayments`) — validates and processes
   a repayment request against the live backend.
2. **Retrieve a repayment transaction by ID** (`GET /repayments/:id`) —
   fetches a stored transaction's outcome.

Both imported with No Auth (matches current backend, which has no
authentication layer yet — acceptable for MVP scope).

## Guidelines

### Guideline 1 — Submit a repayment
- **Condition:** The user describes a loan repayment they want to make,
  providing or implying a loan account, an amount, and a payment channel
  (mpesa, bank, or ussd).
- **Action:** Extract account ID, amount, and channel. Ask for clarification
  if any are missing. Call the "Submit a loan repayment" tool. Never fabricate
  a result. Explain the outcome (COMPLETED / REJECTED / FAILED) in plain
  language based on the tool's actual response.

### Guideline 2 — Explain a stored transaction
- **Condition:** The user asks about the status/outcome of an existing
  transaction, or why it succeeded/failed, providing or implying a
  transaction ID.
- **Action:** Call the "Retrieve a repayment transaction by ID" tool. Explain
  the result based only on what the tool returns.

## Connectivity (development/demo only)

The backend runs locally (`localhost:3000`) and is exposed to Orchestrate via
an ngrok tunnel for development and testing purposes:

ngrok http 3000


The resulting public URL is used as the `servers.url` in `docs/openapi.yaml`.
**This URL changes every time ngrok restarts on the free tier** — the OpenAPI
spec and the Orchestrate tool import must be updated/re-imported if the
tunnel is restarted. For a permanent setup, the backend should be deployed to
a stable, publicly reachable host (tracked as the Sep 20 roadmap item).

## Verified test scenarios

1. **Successful repayment** — "Pay KSh 5,000 toward loan account
   a1111111-0000-0000-0000-000000000001 using M-Pesa" → agent correctly
   called the tool, transaction created as COMPLETED, confirmed against the
   database directly.
2. **Rejected repayment (closed account)** — same request against
   a2222222-0000-0000-0000-000000000002 → agent correctly explained the
   account is closed, no ledger mutation.
3. **Transaction explanation** — "Why did transaction [ID] succeed?" → agent
   correctly retrieved and explained the stored outcome.
