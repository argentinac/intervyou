create table if not exists public.session_ratings (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete set null,
  rating      smallint not null check (rating between 1 and 5),
  comment     text,
  session_type text,        -- 'interview' | 'simulation' | 'skill'
  created_at  timestamptz not null default now()
);

alter table public.session_ratings enable row level security;

create policy "Users can insert their own ratings"
  on public.session_ratings for insert
  with check (auth.uid() = user_id or user_id is null);

create policy "Users can read their own ratings"
  on public.session_ratings for select
  using (auth.uid() = user_id);
