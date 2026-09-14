-- PayFlow AI Seed Data
-- Minimal, deliberate dataset covering the demo scenarios in the blueprint (Section 11)

-- =========================================================
-- CUSTOMERS
-- =========================================================
INSERT INTO customers (customer_id, id_number, kyc_tier, risk_score, created_at) VALUES
  ('11111111-1111-1111-1111-111111111111', '32000001', 'tier_2', 15, now() - interval '180 days'),
  ('22222222-2222-2222-2222-222222222222', '32000002', 'tier_1', 40, now() - interval '90 days'),
  ('33333333-3333-3333-3333-333333333333', '32000003', 'tier_3', 5,  now() - interval '30 days');

-- =========================================================
-- LOAN ACCOUNTS
-- =========================================================
-- LA001: active, belongs to customer 1 - happy path account
INSERT INTO loan_accounts (account_id, customer_id, product_type, principal_amount, interest_rate, disbursement_date, maturity_date, status) VALUES
  ('a1111111-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'personal', 50000.00, 12.5, '2026-01-15', '2027-01-15', 'active');

-- LA002: closed - should reject any repayment attempt
INSERT INTO loan_accounts (account_id, customer_id, product_type, principal_amount, interest_rate, disbursement_date, maturity_date, status) VALUES
  ('a2222222-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'business', 200000.00, 14.0, '2025-06-01', '2026-06-01', 'closed');

-- LA003: defaulted - should reject any repayment attempt
INSERT INTO loan_accounts (account_id, customer_id, product_type, principal_amount, interest_rate, disbursement_date, maturity_date, status) VALUES
  ('a3333333-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'asset', 75000.00, 13.0, '2025-03-01', '2026-03-01', 'defaulted');

-- LA004: active, second account - for a second/duplicate transaction test
INSERT INTO loan_accounts (account_id, customer_id, product_type, principal_amount, interest_rate, disbursement_date, maturity_date, status) VALUES
  ('a4444444-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333', 'personal', 30000.00, 11.0, '2026-05-01', '2027-05-01', 'active');

-- =========================================================
-- REPAYMENT TRANSACTIONS
-- =========================================================
-- One prior completed transaction on LA001 - useful for duplicate-detection and GET /repayments/:id tests
INSERT INTO repayment_transactions (transaction_id, account_id, amount_paid, payment_date, channel, status) VALUES
  ('b1111111-0000-0000-0000-000000000001', 'a1111111-0000-0000-0000-000000000001', 5000.00, now() - interval '5 days', 'mpesa', 'COMPLETED');

-- =========================================================
-- AUDIT LOGS
-- =========================================================
INSERT INTO audit_logs (transaction_id, event_type, details) VALUES
  ('b1111111-0000-0000-0000-000000000001', 'REPAYMENT_COMPLETED', '{"channel": "mpesa", "amount": 5000.00, "note": "seed data - initial completed repayment"}');
