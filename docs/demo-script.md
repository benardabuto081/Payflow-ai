# PayFlow AI — Cornerstone Submission

## Declared choices
- **Pathway:** Product Development — watsonx.ai + Watson Orchestrate
- **Team Option:** Solo
- **Sector:** Fintech (Sita case study)
- **Audience Feature:** Payment Processing (loan repayment)

## Problem
Digital lenders receive loan repayments through mobile money, bank, and USSD.
Processing one means identifying the loan account, validating the request,
recording the transaction, and keeping an auditable trail. PayFlow AI builds
this as a working, AI-assisted workflow grounded in the Sita Fintech data
model (customers, loan accounts, repayment transactions) — not a generic
payment demo.

## What I built
- Deterministic Node/Express + PostgreSQL backend: validates and records
  every repayment (`POST /repayments`), with full read access
  (`GET /repayments/:id`, `/loan-accounts/:id`, `/customers/:id`)
- Mock M-Pesa/bank/USSD payment connector, audit logging on every outcome
- **Watson Orchestrate**: an agent that takes natural-language repayment
  requests, calls the backend as a tool, and explains the result
- **watsonx.ai**: a standalone `POST /ai/explain` endpoint that generates
  grounded, plain-language explanations of stored transactions
  (granite-4-h-small via the chat API)
- A frontend (ledger-terminal UI) covering the full flow: submit, look up,
  explain
- 15 automated tests covering validation, repayment orchestration, and
  data access

## Architecture rule (non-negotiable, demonstrated throughout)
AI never writes the ledger. All validation, state transitions, and database
writes happen in deterministic backend code. AI interprets, explains, and
orchestrates — it never decides a transaction's outcome.

## Demo flow (what I'll walk through live)
1. Submit a repayment via the frontend → COMPLETED stamp, real transaction ID
2. Submit to a closed/defaulted account → REJECTED, no ledger mutation
3. Look up a transaction → ask watsonx.ai to explain it → grounded explanation
4. Same repayment via natural language in Watson Orchestrate → same backend,
   same deterministic outcome
5. Show the database directly confirming the transaction and audit log

## What I'd do with more time
- Permanent TechZone/cloud deployment (currently local + ngrok tunnel for dev)
- Compliance/eligibility service (KYC tier / threshold rules — Section 6 of
  the architecture blueprint, intentionally scoped out of this MVP)
- Regulatory reporting extension (CBK/CMA/SASRA — explicitly future work per
  the Sita model)
