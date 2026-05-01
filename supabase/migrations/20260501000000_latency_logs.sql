create table if not exists latency_logs (
  id            uuid        default gen_random_uuid() primary key,
  created_at    timestamptz default now(),

  -- session context
  session_id    text        not null,
  turn_number   int         not null,
  language      text,
  interview_type text,

  -- timestamps (ms epoch)
  -- t0: frontend — VAD end / browser STT complete (user stopped talking)
  -- t3/t4: backend clock — LLM call start/end
  -- t5/t6: backend clock — TTS call start/end
  -- t7: frontend — AudioContext.start() (audio begins playing)
  t0_ms         bigint,
  t3_ms         bigint,
  t4_ms         bigint,
  t5_ms         bigint,
  t6_ms         bigint,
  t7_ms         bigint,

  -- derived metrics (ms) — computed on insert for easy querying
  llm_latency_ms  int generated always as (t4_ms - t3_ms) stored,
  tts_latency_ms  int generated always as (t6_ms - t5_ms) stored,
  total_gap_ms    int generated always as (t7_ms - t0_ms) stored
);

-- No RLS needed — this table is only written server-side via service role key
