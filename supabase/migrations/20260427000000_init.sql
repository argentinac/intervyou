-- ══════════════════════════════════════════════════════
-- Intervyou — initial schema
-- Designed to support: auth, tiers, interviews,
-- feedback, CV/LinkedIn upload, history, payments
-- ══════════════════════════════════════════════════════

-- ── Enums ──────────────────────────────────────────────
create type user_tier as enum ('free', 'premium');
create type subscription_status as enum ('active', 'canceled', 'past_due', 'trialing', 'incomplete');
create type interview_type as enum ('hr', 'technical', 'real_simulation', 'coach');
create type interview_length as enum ('short', 'standard', 'long');
create type interview_status as enum ('in_progress', 'completed', 'abandoned');
create type document_type as enum ('cv', 'linkedin');

-- ── Profiles ───────────────────────────────────────────
-- Extends auth.users with app-specific data
create table public.profiles (
  id            uuid        primary key references auth.users(id) on delete cascade,
  email         text        not null,
  full_name     text,
  avatar_url    text,
  tier          user_tier   not null default 'free',
  interviews_this_month integer not null default 0,
  month_reset_at timestamptz not null default date_trunc('month', now()) + interval '1 month',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ── Subscriptions ──────────────────────────────────────
create table public.subscriptions (
  id                     uuid        primary key default gen_random_uuid(),
  user_id                uuid        not null references public.profiles(id) on delete cascade,
  stripe_customer_id     text        unique,
  stripe_subscription_id text        unique,
  tier                   user_tier   not null default 'premium',
  status                 subscription_status not null default 'active',
  current_period_start   timestamptz,
  current_period_end     timestamptz,
  canceled_at            timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- ── Documents (CV / LinkedIn) ──────────────────────────
create table public.documents (
  id               uuid          primary key default gen_random_uuid(),
  user_id          uuid          not null references public.profiles(id) on delete cascade,
  type             document_type not null,
  filename         text,
  storage_path     text,          -- Supabase Storage path
  parsed_content   text,          -- extracted text
  opportunities    jsonb,         -- AI-detected improvement areas
  created_at       timestamptz   not null default now(),
  updated_at       timestamptz   not null default now()
);

-- ── Interviews ─────────────────────────────────────────
create table public.interviews (
  id               uuid             primary key default gen_random_uuid(),
  user_id          uuid             not null references public.profiles(id) on delete cascade,
  type             interview_type   not null default 'hr',
  length           interview_length not null default 'standard',
  config           jsonb            not null default '{}',
  -- config shape: { language, country, difficulty, jobTitle, companyName, jobDescription }
  status           interview_status not null default 'in_progress',
  document_id      uuid             references public.documents(id) on delete set null,
  -- linked CV/LinkedIn used to personalize questions
  duration_seconds integer,
  started_at       timestamptz      not null default now(),
  completed_at     timestamptz,
  created_at       timestamptz      not null default now()
);

-- ── Interview transcripts ──────────────────────────────
create table public.interview_transcripts (
  id           uuid        primary key default gen_random_uuid(),
  interview_id uuid        not null references public.interviews(id) on delete cascade,
  user_id      uuid        not null references public.profiles(id) on delete cascade,
  messages     jsonb       not null default '[]',
  -- array of { role: 'user'|'assistant', content: string }
  created_at   timestamptz not null default now()
);

-- ── Interview feedback ─────────────────────────────────
create table public.interview_feedback (
  id           uuid        primary key default gen_random_uuid(),
  interview_id uuid        not null references public.interviews(id) on delete cascade,
  user_id      uuid        not null references public.profiles(id) on delete cascade,
  score        integer     check (score >= 0 and score <= 1000),
  headline     text,
  went_well    jsonb       default '[]',
  to_improve   jsonb       default '[]',
  suggestions  jsonb       default '[]',
  raw_response jsonb,      -- full Claude response for debugging
  created_at   timestamptz not null default now()
);

-- ── Indexes ────────────────────────────────────────────
create index idx_interviews_user_id         on public.interviews(user_id);
create index idx_interviews_completed_at    on public.interviews(completed_at desc);
create index idx_feedback_interview_id      on public.interview_feedback(interview_id);
create index idx_feedback_user_id           on public.interview_feedback(user_id);
create index idx_transcripts_interview_id   on public.interview_transcripts(interview_id);
create index idx_documents_user_id          on public.documents(user_id);
create index idx_subscriptions_user_id      on public.subscriptions(user_id);
create index idx_subscriptions_stripe_cust  on public.subscriptions(stripe_customer_id);

-- ── RLS ────────────────────────────────────────────────
-- Server uses service_role (bypasses RLS).
-- RLS protects against direct client access.
alter table public.profiles            enable row level security;
alter table public.subscriptions       enable row level security;
alter table public.documents           enable row level security;
alter table public.interviews          enable row level security;
alter table public.interview_transcripts enable row level security;
alter table public.interview_feedback  enable row level security;

create policy "Own profile" on public.profiles
  for all using (auth.uid() = id);

create policy "Own subscriptions" on public.subscriptions
  for all using (auth.uid() = user_id);

create policy "Own documents" on public.documents
  for all using (auth.uid() = user_id);

create policy "Own interviews" on public.interviews
  for all using (auth.uid() = user_id);

create policy "Own transcripts" on public.interview_transcripts
  for all using (auth.uid() = user_id);

create policy "Own feedback" on public.interview_feedback
  for all using (auth.uid() = user_id);

-- ── Auto-create profile on signup ─────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
