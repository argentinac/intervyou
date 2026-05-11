-- skill_progress: tracks which techniques each user has completed per skill
create table if not exists skill_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  skill_id text not null,
  technique_idx integer not null,
  completed_at timestamptz not null default now(),
  unique (user_id, skill_id, technique_idx)
);

alter table skill_progress enable row level security;

create policy "Users can read own skill progress"
  on skill_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own skill progress"
  on skill_progress for insert
  with check (auth.uid() = user_id);
