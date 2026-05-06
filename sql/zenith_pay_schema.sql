-- Zenith Pay — reference PostgreSQL DDL (15+). Not executed by the Next.js prototype.
-- Map API DTO fields to `wallet_transactions` when you replace the in-memory store.

-- ─── Core identity & wallet ─────────────────────────────────────────────────

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_subject text NOT NULL UNIQUE,
  display_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  wallet_tag text UNIQUE,
  currency char(3) NOT NULL DEFAULT 'USD',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_wallets_user ON wallets (user_id);

CREATE TABLE wallet_balances (
  wallet_id uuid PRIMARY KEY REFERENCES wallets (id) ON DELETE CASCADE,
  available_cents bigint NOT NULL DEFAULT 0 CHECK (available_cents >= 0),
  pending_cents bigint NOT NULL DEFAULT 0 CHECK (pending_cents >= 0),
  version bigint NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- User-visible ledger lines (aligned with GET /api/v1/transactions DTO).

CREATE TABLE wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid NOT NULL REFERENCES wallets (id) ON DELETE CASCADE,
  idempotency_key text UNIQUE,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  direction text NOT NULL CHECK (direction IN ('debit', 'credit')),
  category text NOT NULL CHECK (
    category IN ('transfer', 'merchant', 'airtime', 'bills', 'received')
  ),
  status text NOT NULL CHECK (status IN ('success', 'pending', 'failed', 'reversed')),
  amount_cents bigint NOT NULL CHECK (amount_cents > 0),
  fee_cents bigint NOT NULL DEFAULT 0 CHECK (fee_cents >= 0),
  currency char(3) NOT NULL DEFAULT 'USD',
  title text NOT NULL,
  subtitle text,
  reference text NOT NULL,
  correlation_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_wallet_transactions_wallet_time ON wallet_transactions (wallet_id, occurred_at DESC);

CREATE INDEX idx_wallet_transactions_pending ON wallet_transactions (wallet_id)
WHERE status = 'pending';

-- ─── Money movement (quotes + execution; fee always re-validates server-side) ─

CREATE TABLE transfer_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid NOT NULL REFERENCES wallets (id) ON DELETE CASCADE,
  amount_cents bigint NOT NULL CHECK (amount_cents > 0),
  fee_cents bigint NOT NULL CHECK (fee_cents >= 0),
  currency char(3) NOT NULL DEFAULT 'USD',
  pricing_version text NOT NULL DEFAULT 'v1',
  valid_until timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_transfer_quotes_wallet ON transfer_quotes (wallet_id);

CREATE TABLE outbound_transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid NOT NULL REFERENCES wallets (id) ON DELETE CASCADE,
  wallet_transaction_id uuid UNIQUE REFERENCES wallet_transactions (id),
  amount_cents bigint NOT NULL CHECK (amount_cents > 0),
  fee_cents bigint NOT NULL DEFAULT 0 CHECK (fee_cents >= 0),
  recipient_rail text NOT NULL DEFAULT 'BOOK',
  recipient_display text NOT NULL,
  idempotency_key text NOT NULL UNIQUE,
  processor_ref text UNIQUE,
  state text NOT NULL DEFAULT 'requested' CHECK (
    state IN ('requested', 'posted', 'completed', 'failed')
  ),
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX idx_outbound_wallet ON outbound_transfers (wallet_id);

-- ─── Funding, schedules, operations ─────────────────────────────────────────

CREATE TABLE funding_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid NOT NULL REFERENCES wallets (id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('bank_account', 'card', 'crypto', 'external')),
  display_label text NOT NULL,
  external_token_ref text UNIQUE,
  last_four text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_funding_wallet ON funding_sources (wallet_id);

CREATE TABLE scheduled_transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid NOT NULL REFERENCES wallets (id) ON DELETE CASCADE,
  cron_expr text NOT NULL,
  recipient_display text NOT NULL,
  amount_cents bigint NOT NULL CHECK (amount_cents > 0),
  currency char(3) NOT NULL DEFAULT 'USD',
  next_run_at timestamptz NOT NULL,
  paused boolean NOT NULL DEFAULT FALSE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_scheduled_wallet ON scheduled_transfers (wallet_id);

-- ─── Security, disputes, alerts (UI routes already exist) ──────────────────

CREATE TABLE device_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  device_label text NOT NULL,
  user_agent_hash text NOT NULL,
  ip_subnet text,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz
);

CREATE INDEX idx_device_sessions_user ON device_sessions (user_id);

CREATE TABLE notification_preferences (
  user_id uuid PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
  email_enabled boolean NOT NULL DEFAULT TRUE,
  push_enabled boolean NOT NULL DEFAULT TRUE,
  sms_enabled boolean NOT NULL DEFAULT FALSE,
  txn_alerts_minimum_cents bigint NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE dispute_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid NOT NULL REFERENCES wallets (id) ON DELETE CASCADE,
  wallet_transaction_id uuid REFERENCES wallet_transactions (id),
  status text NOT NULL DEFAULT 'opened' CHECK (
    status IN ('opened', 'investigating', 'closed_won', 'closed_lost')
  ),
  reason text NOT NULL,
  opened_at timestamptz NOT NULL DEFAULT now(),
  closed_at timestamptz
);

CREATE INDEX idx_disputes_wallet ON dispute_cases (wallet_id);

COMMENT ON TABLE wallet_transactions IS 'Activity feed + regulatory narrative; reconcile to double-entry postings in production.';
COMMENT ON TABLE outbound_transfers IS 'POST /api/v1/transfers evolves into persisted execution + idempotent replay.';

-- Prototype: `POST /api/v1/wallet/fund` increments `wallet_balances.available_cents` and inserts a credited
-- `wallet_transactions` row. In production replace with ACH/RTP/card settlement ingestion + reconciliation jobs.
