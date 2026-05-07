-- Migración: campos de suscripción en profiles
-- Correr en Supabase SQL Editor

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS payment_provider       text,
  ADD COLUMN IF NOT EXISTS provider_customer_id   text,
  ADD COLUMN IF NOT EXISTS provider_subscription_id text,
  ADD COLUMN IF NOT EXISTS plan                   text DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS plan_status            text DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS plan_period            text,
  ADD COLUMN IF NOT EXISTS plan_expires_at        timestamptz;
