-- GutBuddy Database Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)

-- 1. Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  nickname text default '',
  gender text default '',
  goal text default '',
  issues text[] default '{}',
  stool_frequency text default '',
  notification_time text default '09:00',
  level integer default 1,
  exp integer default 0,
  streak integer default 0,
  total_days integer default 0,
  current_plan text default 'Basic',
  billing_cycle text default 'monthly',
  strava_connected boolean default false,
  onboarding_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Daily records (gut logs)
create table if not exists public.daily_records (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  date date not null,
  feeling text,
  score integer default 70,
  memo text default '',
  stool_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, date)
);

-- 3. Exercise records
create table if not exists public.exercise_records (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  date date not null,
  exercises jsonb default '[]',
  total_duration integer default 0,
  total_calories integer default 0,
  source text default 'manual',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, date)
);

-- 4. Chat messages
create table if not exists public.chat_messages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Photos (metadata, actual files go to Supabase Storage)
create table if not exists public.photos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  storage_path text not null,
  meal_type text,
  date date default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security on all tables
alter table public.profiles enable row level security;
alter table public.daily_records enable row level security;
alter table public.exercise_records enable row level security;
alter table public.chat_messages enable row level security;
alter table public.photos enable row level security;

-- RLS Policies: Users can only access their own data
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can view own daily records"
  on public.daily_records for select using (auth.uid() = user_id);
create policy "Users can insert own daily records"
  on public.daily_records for insert with check (auth.uid() = user_id);
create policy "Users can update own daily records"
  on public.daily_records for update using (auth.uid() = user_id);

create policy "Users can view own exercise records"
  on public.exercise_records for select using (auth.uid() = user_id);
create policy "Users can insert own exercise records"
  on public.exercise_records for insert with check (auth.uid() = user_id);
create policy "Users can update own exercise records"
  on public.exercise_records for update using (auth.uid() = user_id);

create policy "Users can view own chat messages"
  on public.chat_messages for select using (auth.uid() = user_id);
create policy "Users can insert own chat messages"
  on public.chat_messages for insert with check (auth.uid() = user_id);

create policy "Users can view own photos"
  on public.photos for select using (auth.uid() = user_id);
create policy "Users can insert own photos"
  on public.photos for insert with check (auth.uid() = user_id);
create policy "Users can delete own photos"
  on public.photos for delete using (auth.uid() = user_id);

-- Auto-create profile when user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at on profiles
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create or replace trigger on_profile_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- Create storage bucket for photos
insert into storage.buckets (id, name, public)
values ('photos', 'photos', false)
on conflict (id) do nothing;

-- Storage policy: users can upload/view/delete their own photos
create policy "Users can upload photos"
  on storage.objects for insert
  with check (bucket_id = 'photos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can view own photos"
  on storage.objects for select
  using (bucket_id = 'photos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete own photos"
  on storage.objects for delete
  using (bucket_id = 'photos' and auth.uid()::text = (storage.foldername(name))[1]);
