-- Simulations Hub
-- Adds support for the new "Simulations" section: a generic, catalog-driven
-- engine that runs many types of conversational simulations (work, study, visa,
-- love, legal, other) sharing a single interview pipeline but with their own
-- onboarding schemas, system prompts and a simplified 4-dimension feedback.

-- ── Extend interview_type enum ─────────────────────────
alter type interview_type add value if not exists 'simulation';

-- ── Catalog table ──────────────────────────────────────
-- Mirrors the JS catalog so we can reference simulations by FK and run analytics
-- queries. Source of truth for runtime is still the JS catalog; this table is
-- seeded from it.
create table public.simulations (
  id          text         primary key,
  category    text         not null check (category in ('work','study','visa','love','legal','other')),
  title       text         not null,
  active      boolean      not null default true,
  metadata    jsonb        not null default '{}'::jsonb,
  created_at  timestamptz  not null default now()
);

create index idx_simulations_category on public.simulations(category) where active = true;

-- Read-only for everyone authenticated (catalog is public to logged-in users)
alter table public.simulations enable row level security;

create policy "Authenticated can read simulations"
  on public.simulations
  for select
  using (auth.role() = 'authenticated');

-- ── Extend interviews table ────────────────────────────
alter table public.interviews
  add column simulation_id        text  references public.simulations(id) on delete set null,
  add column simulation_category  text  check (simulation_category is null or simulation_category in ('work','study','visa','love','legal','other'));

create index idx_interviews_simulation_id on public.interviews(simulation_id) where simulation_id is not null;

-- ── Simulation feedback ────────────────────────────────
-- Simplified feedback structure for non-job-interview simulations.
-- The renovated FeedbackSummary (PR #35) keeps using interview_feedback for
-- the job interview flow.
create table public.simulation_feedback (
  id              uuid         primary key default gen_random_uuid(),
  interview_id    uuid         not null references public.interviews(id) on delete cascade,
  user_id         uuid         not null references public.profiles(id)    on delete cascade,
  simulation_id   text         not null references public.simulations(id),

  -- Headline scoring
  general_score   integer      check (general_score between 0 and 1000),
  summary         text,                   -- e.g. "Lograste el objetivo pero cediste más de lo necesario"

  -- 4 dimensions, 0-1000 each
  clarity_score    integer  check (clarity_score    is null or clarity_score    between 0 and 1000),
  emotional_score  integer  check (emotional_score  is null or emotional_score  between 0 and 1000),
  listening_score  integer  check (listening_score  is null or listening_score  between 0 and 1000),
  objective_score  integer  check (objective_score  is null or objective_score  between 0 and 1000),

  -- Free-form sections
  patterns        jsonb  not null default '[]'::jsonb,  -- array of strings (chips)
  strengths       jsonb  not null default '[]'::jsonb,  -- [{title, description}] max 3
  opportunities   jsonb  not null default '[]'::jsonb,  -- [{title, description}] max 3
  next_steps      jsonb  not null default '[]'::jsonb,  -- array of strings max 4

  -- Full LLM response for auditing
  raw_response    jsonb,

  created_at      timestamptz  not null default now()
);

create index idx_simulation_feedback_user_id      on public.simulation_feedback(user_id, created_at desc);
create index idx_simulation_feedback_interview_id on public.simulation_feedback(interview_id);
create index idx_simulation_feedback_simulation   on public.simulation_feedback(simulation_id);

-- RLS: users only see their own feedback
alter table public.simulation_feedback enable row level security;

create policy "Users view own simulation feedback"
  on public.simulation_feedback
  for select
  using (auth.uid() = user_id);

create policy "Users insert own simulation feedback"
  on public.simulation_feedback
  for insert
  with check (auth.uid() = user_id);

-- Service role bypasses RLS automatically; no extra policy needed for the
-- server-side scoring endpoint that writes feedback after a session.
