-- TrueBond database starter. Run in Supabase SQL Editor.
-- Supabase Auth owns credentials; never store passwords in your own tables.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 60),
  age int check (age is null or age between 18 and 100),
  city text check (city is null or char_length(city) <= 100),
  bio text check (bio is null or char_length(bio) <= 500),
  interests text[] not null default '{}',
  photo_url text,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  from_user uuid not null references public.profiles(id) on delete cascade,
  to_user uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint likes_not_self check (from_user <> to_user),
  constraint likes_unique_pair unique (from_user, to_user)
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  user_a uuid not null references public.profiles(id) on delete cascade,
  user_b uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint matches_not_self check (user_a <> user_b),
  constraint matches_unique_pair unique (user_a, user_b)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists profiles_visible_idx on public.profiles(is_visible, created_at desc);
create index if not exists likes_to_user_idx on public.likes(to_user);
create index if not exists messages_match_created_idx on public.messages(match_id, created_at);

alter table public.profiles enable row level security;
alter table public.likes enable row level security;
alter table public.matches enable row level security;
alter table public.messages enable row level security;

-- Public discovery only exposes profiles marked visible. Consider a restricted view
-- or RPC before production if you add sensitive profile fields.
drop policy if exists "Visible profiles can be discovered" on public.profiles;
create policy "Visible profiles can be discovered"
on public.profiles for select to authenticated
using (is_visible = true or id = auth.uid());

drop policy if exists "Members create own profile" on public.profiles;
create policy "Members create own profile"
on public.profiles for insert to authenticated
with check (id = auth.uid() and age >= 18);

drop policy if exists "Members update own profile" on public.profiles;
create policy "Members update own profile"
on public.profiles for update to authenticated
using (id = auth.uid())
with check (id = auth.uid() and age >= 18);

drop policy if exists "Members delete own profile" on public.profiles;
create policy "Members delete own profile"
on public.profiles for delete to authenticated
using (id = auth.uid());

drop policy if exists "Members can see likes they sent or received" on public.likes;
create policy "Members can see likes they sent or received"
on public.likes for select to authenticated
using (from_user = auth.uid() or to_user = auth.uid());

drop policy if exists "Members can send likes as themselves" on public.likes;
create policy "Members can send likes as themselves"
on public.likes for insert to authenticated
with check (from_user = auth.uid() and to_user <> auth.uid());

drop policy if exists "Members can remove likes they sent" on public.likes;
create policy "Members can remove likes they sent"
on public.likes for delete to authenticated
using (from_user = auth.uid());

drop policy if exists "Members can see their matches" on public.matches;
create policy "Members can see their matches"
on public.matches for select to authenticated
using (user_a = auth.uid() or user_b = auth.uid());

-- Matches are created only by the database trigger below.
drop policy if exists "Members can create mutual matches" on public.matches;
create policy "Members can create mutual matches"
on public.matches for insert to authenticated
with check (user_a = auth.uid() or user_b = auth.uid());

drop policy if exists "Members can read messages in their matches" on public.messages;
create policy "Members can read messages in their matches"
on public.messages for select to authenticated
using (exists (
  select 1 from public.matches m
  where m.id = match_id and (m.user_a = auth.uid() or m.user_b = auth.uid())
));

drop policy if exists "Members can send messages in their matches" on public.messages;
create policy "Members can send messages in their matches"
on public.messages for insert to authenticated
with check (
  sender_id = auth.uid() and exists (
    select 1 from public.matches m
    where m.id = match_id and (m.user_a = auth.uid() or m.user_b = auth.uid())
  )
);

-- Create a match when a reciprocal like exists. Store IDs in deterministic order.
create or replace function public.create_mutual_match()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (
    select 1 from public.likes l
    where l.from_user = new.to_user and l.to_user = new.from_user
  ) then
    insert into public.matches(user_a, user_b)
    values (least(new.from_user, new.to_user), greatest(new.from_user, new.to_user))
    on conflict (user_a, user_b) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_mutual_like on public.likes;
create trigger on_mutual_like
after insert on public.likes
for each row execute function public.create_mutual_match();

-- Canonical order is required for the unique constraint. Prevent arbitrary match
-- creation by clients: trigger-generated matches are created with definer rights.
drop policy if exists "Members can create mutual matches" on public.matches;
create policy "Members can create mutual matches"
on public.matches for insert to authenticated
with check (false);

-- Keep messages realtime-capable. In Supabase dashboard, add public.messages
-- to the Realtime publication if you want live updates.
-- Photo storage: create a private bucket named profile-photos in Storage UI.
-- Storage policies are provided in SETUP.md.
