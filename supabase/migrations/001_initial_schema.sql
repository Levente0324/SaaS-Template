-- ============================================================
-- Migration: 001_initial_schema.sql
-- Creates profiles, usage_logs, webhook_events tables
-- with Row Level Security and policies.
-- ============================================================

-- ─── profiles ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id                    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                 TEXT,
  plan                  TEXT NOT NULL DEFAULT 'free',
  subscription_status   TEXT,
  stripe_customer_id    TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  current_period_end    TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── usage_logs ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS usage_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tool        TEXT NOT NULL,
  metadata    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── webhook_events (idempotency store) ──────────────────────
CREATE TABLE IF NOT EXISTS webhook_events (
  id            TEXT PRIMARY KEY,   -- Stripe event ID (e.g. evt_...)
  type          TEXT NOT NULL,
  processed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id       ON usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at    ON usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON profiles(stripe_customer_id);

-- ─── updated_at auto-bump trigger ────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── Auto-create profile on user sign-up ─────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── Row Level Security ───────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- profiles: users can read and update only their own row
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- usage_logs: users can read only their own logs
CREATE POLICY "usage_logs_select_own" ON usage_logs
  FOR SELECT USING (auth.uid() = user_id);

-- webhook_events: no user access (service role only)
-- No policies added = zero public access with RLS enabled
