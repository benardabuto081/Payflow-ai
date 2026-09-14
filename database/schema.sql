-- PayFlow AI Database Schema
-- Grounded in the Sita Fintech data model (customers, loan_accounts, repayment_transactions)
-- See: PayFlow_AI_Project_Architecture_Blueprint_Roadmap, Section 3

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================================================
-- CUSTOMERS
-- =========================================================
CREATE TABLE customers (
    customer_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_number     VARCHAR(50) NOT NULL UNIQUE,
    kyc_tier      VARCHAR(20) NOT NULL CHECK (kyc_tier IN ('tier_1', 'tier_2', 'tier_3')),
    risk_score    INTEGER NOT NULL DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================
-- LOAN ACCOUNTS
-- =========================================================
CREATE TABLE loan_accounts (
    account_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id       UUID NOT NULL REFERENCES customers(customer_id) ON DELETE RESTRICT,
    product_type      VARCHAR(20) NOT NULL CHECK (product_type IN ('personal', 'business', 'asset')),
    principal_amount  NUMERIC(14,2) NOT NULL CHECK (principal_amount > 0),
    interest_rate     NUMERIC(5,2) NOT NULL CHECK (interest_rate >= 0),
    disbursement_date DATE NOT NULL,
    maturity_date     DATE NOT NULL,
    status            VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'defaulted', 'closed')),
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (maturity_date > disbursement_date)
);

CREATE INDEX idx_loan_accounts_customer_id ON loan_accounts(customer_id);

-- =========================================================
-- REPAYMENT TRANSACTIONS
-- =========================================================
CREATE TABLE repayment_transactions (
    transaction_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id      UUID NOT NULL REFERENCES loan_accounts(account_id) ON DELETE RESTRICT,
    amount_paid     NUMERIC(14,2) NOT NULL CHECK (amount_paid > 0),
    payment_date    TIMESTAMPTZ NOT NULL DEFAULT now(),
    channel         VARCHAR(20) NOT NULL CHECK (channel IN ('mpesa', 'bank', 'ussd')),
    status          VARCHAR(20) NOT NULL DEFAULT 'RECEIVED'
                      CHECK (status IN ('RECEIVED', 'VALIDATING', 'REJECTED', 'PROCESSING', 'COMPLETED', 'FLAGGED', 'FAILED')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_repayment_transactions_account_id ON repayment_transactions(account_id);

-- =========================================================
-- AUDIT LOGS
-- =========================================================
CREATE TABLE audit_logs (
    audit_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id  UUID REFERENCES repayment_transactions(transaction_id) ON DELETE RESTRICT,
    event_type      VARCHAR(50) NOT NULL,
    details         JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_transaction_id ON audit_logs(transaction_id);

-- =========================================================
-- REGULATORY REPORTS (scaffolded only — not part of MVP logic)
-- =========================================================
CREATE TABLE regulatory_reports (
    report_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    regulator     VARCHAR(20) NOT NULL CHECK (regulator IN ('CBK', 'CMA', 'SASRA')),
    period        VARCHAR(20) NOT NULL,
    generated_at  TIMESTAMPTZ,
    status        VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'generated', 'submitted')),
    file_path     TEXT
);
