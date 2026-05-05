alter table latency_logs
  add column if not exists llm_cost_usd          numeric(10,6),
  add column if not exists llm_tokens_input      int,
  add column if not exists llm_tokens_output     int,
  add column if not exists llm_tokens_cache_read int,
  add column if not exists llm_tokens_cache_write int,
  add column if not exists tts_chars             int,
  add column if not exists tts_cost_usd          numeric(10,6);
