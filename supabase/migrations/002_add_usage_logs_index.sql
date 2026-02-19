-- ============================================================
-- Migration: 002_add_usage_logs_index.sql
-- Optimizes daily usage limit checks.
-- ============================================================

-- Create a composite index on user_id and created_at
-- This allows the usage limit check to efficiently count rows
-- for a specific user within a time range.
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_created 
ON usage_logs(user_id, created_at);
