-- Allow anonymous Supabase users to save interviews
-- Anonymous users have no email, so we make it nullable in profiles

alter table public.profiles
  alter column email drop not null;

-- Update trigger to handle anonymous users (no email)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,  -- null for anonymous users (now nullable)
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
