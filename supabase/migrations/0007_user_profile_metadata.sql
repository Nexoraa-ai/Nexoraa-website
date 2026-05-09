-- NeuralForge Layer 0: User profile metadata
-- Stores lightweight profile preferences that do not need dedicated columns yet.
alter table user_profiles
  add column if not exists metadata jsonb not null default '{}'::jsonb;
