# PayFlow AI

**AI-assisted loan repayment processing and compliance workflow, grounded in the Sita Fintech case study.**

*IBM Tech Training — Phase 3 Cornerstone Project (Product Development pathway)*

![Status](https://img.shields.io/badge/status-active%20development-yellow)
![Node](https://img.shields.io/badge/node-20.x-339933?logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-16-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-compose-2496ED?logo=docker&logoColor=white)

> **Core engineering principle:** AI assists the payment workflow. Deterministic systems control the financial state.

---

## What PayFlow AI Is

Digital lenders receive loan repayments through channels like M-Pesa, bank, and USSD. Processing a repayment means identifying the right loan account, validating the request, recording the transaction, and preserving an auditable trail.

PayFlow AI turns that workflow into a demonstrable, AI-assisted experience — **without ever letting an LLM mutate financial state directly.** Watson Orchestrate coordinates the workflow. watsonx.ai interprets natural-language requests and explains results. A deterministic Node/Express backend validates and records every repayment transaction.

This project is explicitly grounded in the **Sita Fintech** sector data model (customers, loan accounts, repayment transactions, regulatory reports) rather than being a generic payment demo. See [`docs/architecture.md`](docs/architecture.md) *(planned)* for the full blueprint this build follows.

## Current Status

**This is an active 8-day build, not a finished product.** Honest state as of the date of the last commit touching this file:

| Component | Status |
|---|---|
| Repository scaffolding | Complete |
| Backend Node/Express project | Complete — runs locally, `/health` endpoint verified |
| Local dev environment (Node 20 via nvm, Docker) | Complete |
| Database schema (`customers`, `loan_accounts`, `repayment_transactions`, `audit_logs`, `regulatory_reports`) | Complete — applied and verified against PostgreSQL 16 |
| Seed data (demo-scenario accounts) | Complete — applied and verified |
| Repayment validation logic | Not started |
| `POST /repayments` + mock payment connector | Not started |
| Watson Orchestrate workflow | Not started |
| watsonx.ai interpretation/explanation | Not started |
| Frontend | Not started |
| Tests | Not started |
| TechZone deployment | Not started |

## Problem Statement

Digital lenders and payment platforms receive repayment requests through mobile money, bank, and USSD channels. Processing a repayment requires identifying the relevant loan account, validating the request, recording the transaction, and preserving an auditable trail — the exact structure the Sita Fintech live model represents through customers, loan accounts, repayment transactions, and regulatory reports.

## Architecture

User / Payment Operator
|
Watson Orchestrate Agent / Workflow
|
watsonx.ai — intent and information interpretation
|
Repayment Processing API (this repo: backend/)
|
Validation Service -> Compliance/Eligibility Rules
|
Repayment Transaction Ledger (PostgreSQL)
|
Audit Event
|
watsonx.ai — explanation / summary


### Non-negotiable architecture rules

1. AI does not directly modify the financial ledger.
2. Every financial mutation happens through deterministic backend logic.
3. The database is the source of truth for transaction state.
4. External payment providers are mocked for the MVP — no real M-Pesa/bank integration.
5. Every important workflow outcome is auditable.
6. Sita terminology and data structures stay visible in the implementation and this README.
7. No feature gets added unless it strengthens the core Payment Processing demonstration.

## Sita Fintech Grounding

| Sita Fintech reference | PayFlow AI implementation |
|---|---|
| Customer | Customer lookup and identity context |
| Loan Account | Repayment target and account validation |
| Repayment Transaction | Core Payment Processing audience feature |
| M-Pesa / bank / USSD channels | Supported mock payment channels |
| Regulatory transformation | Future reporting extension — not core MVP |
| Audit / traceability | `audit_logs` for every important processing outcome |

## Repository Structure

Payflow-ai/
├── README.md
├── docker-compose.yml PostgreSQL 16 container definition
├── .env.example Template for local environment variables
├── backend/ Node.js / Express API
│ ├── index.js Entry point + health check
│ ├── routes/ (planned) Express route handlers
│ ├── services/ (planned) Validation, compliance, mock connector
│ ├── models/ (planned) Database access layer
│ └── tests/ (planned) Business-logic tests
├── database/
│ ├── schema.sql Core Sita-grounded schema (5 tables)
│ └── seed.sql Deterministic demo/test data
├── frontend/ (planned) Minimal repayment UI
├── orchestrate/ (planned) Watson Orchestrate agents/workflows/tools
├── watsonx/ (planned) watsonx.ai prompts
├── docs/ (planned) Architecture, blueprint, demo script
└── tests/ (planned) Integration/end-to-end tests


## Data Model

Five tables, defined in [`database/schema.sql`](database/schema.sql):

| Table | Role |
|---|---|
| `customers` | Identity, KYC tier, risk score |
| `loan_accounts` | Loan product, principal, status (`active` / `defaulted` / `closed`) |
| `repayment_transactions` | Every repayment attempt and its outcome |
| `audit_logs` | Auditable event trail tied to transactions |
| `regulatory_reports` | Scaffolded only — not part of MVP logic |

Design notes: UUID primary keys (non-sequential, matches real fintech ID conventions), `NUMERIC` (never `FLOAT`) for all money fields, `CHECK` constraints for enumerated values, `ON DELETE RESTRICT` foreign keys to protect audit integrity.

## Getting Started (Local Development)

**Prerequisites:** Node 20 (via [nvm](https://github.com/nvm-sh/nvm)), Docker with the Compose plugin.

```bash
# 1. Clone and enter the repo
git clone https://github.com/benardabuto081/Payflow-ai.git
cd Payflow-ai

# 2. Start PostgreSQL
docker compose up -d

# 3. Apply schema and seed data
docker exec -i payflow-ai-db psql -U payflow -d payflow_ai < database/schema.sql
docker exec -i payflow-ai-db psql -U payflow -d payflow_ai < database/seed.sql

# 4. Install backend dependencies and run
cd backend
npm install
npm run dev

# 5. Verify
curl http://localhost:3000/health
# -> {"status":"ok","service":"payflow-ai-backend"}
```

## API Blueprint

| Endpoint | Purpose | Status |
|---|---|---|
| `GET /health` | Service health check | Implemented |
| `POST /repayments` | Submit a repayment request | Planned |
| `GET /repayments/:id` | Retrieve a repayment transaction | Planned |
| `GET /loan-accounts/:id` | Retrieve loan account info | Planned |
| `GET /customers/:id` | Retrieve customer info | Planned |
| `GET /repayments/:id/audit` | Retrieve audit events | Planned |
| `GET /repayments/:id/compliance` | Retrieve rule results | Planned |
| `POST /ai/explain` | Generate human-readable explanation from a deterministic result | Planned |

## Demo Scenarios (Target)

| Scenario | Input | Expected result |
|---|---|---|
| Successful repayment | KSh 5,000 to active LA001 via M-Pesa | `COMPLETED`; transaction recorded; audit created |
| Invalid account | Repayment to unknown account | `REJECTED`; no ledger mutation; audit created |
| Invalid amount | KSh 0 or negative amount | `REJECTED`; validation error; audit created |
| Compliance exception | High-value repayment or insufficient KYC tier | `FLAGGED` / `REJECTED` per deterministic rule |
| AI explanation | "Why did this transaction fail?" | watsonx.ai explains the stored deterministic reason |

## IBM Technology Roles

- **Watson Orchestrate** — coordinates the repayment workflow and invokes backend tools/APIs.
- **watsonx.ai** — interprets natural-language repayment requests into structured data; explains stored deterministic outcomes.
- Both are functional participants in the workflow, not decorative — see Architecture above for exactly where each sits.

## Roadmap

| Date | Phase | Gate |
|---|---|---|
| Sep 13 | Architecture + setup | Backend runs locally — **done** |
| Sep 14 | Core data + validation | Invalid requests rejected correctly |
| Sep 15 | Repayment engine | Successful repayment changes ledger correctly |
| Sep 16 | Watson Orchestrate | Natural-language request reaches backend |
| Sep 17 | watsonx.ai | AI feature works on real workflow data |
| Sep 18 | Frontend | End-to-end UI demo works |
| Sep 19 | Integration + tests | All demo scenarios pass |
| Sep 20 | Deployment + polish | Reviewer can access working environment |
| Sep 21 | Submission | Project submitted |

## Explicitly Out of Scope (MVP)

- Real M-Pesa, bank, or USSD money movement
- A complete AML/fraud platform
- A full regulatory-reporting platform
- Production banking infrastructure

## Project Owner

- **Bernard Abuto** — solo build, IBM Tech Training Phase 3 Cornerstone Project

## Status of This README

This README reflects the project's actual state as of the backend/database setup phase (Sep 13, 2026) and will be expanded — API usage examples, Watson Orchestrate config, watsonx.ai prompts, deployment instructions — as those pieces are genuinely built, not before.

## License

TBD.
