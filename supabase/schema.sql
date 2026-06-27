-- GlucoTrack Supabase schema
-- Run this in Supabase SQL Editor.

create table if not exists public.blood_sugar_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  glucose_value numeric not null check (glucose_value > 0),
  unit text not null default 'mg/dL',
  measurement_type text not null default 'other',
  measured_at timestamptz not null,
  note text,
  created_at timestamptz default now()
);

create table if not exists public.insulin_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  insulin_type text not null default 'Not specified',
  units numeric not null check (units > 0),
  injected_at timestamptz not null,
  note text,
  created_at timestamptz default now()
);

create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  reminder_time time not null,
  repeat_daily boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

alter table public.blood_sugar_logs enable row level security;
alter table public.insulin_logs enable row level security;
alter table public.reminders enable row level security;

-- Remove old policies if you rerun this file.
drop policy if exists "Users can view own blood sugar logs" on public.blood_sugar_logs;
drop policy if exists "Users can insert own blood sugar logs" on public.blood_sugar_logs;
drop policy if exists "Users can update own blood sugar logs" on public.blood_sugar_logs;
drop policy if exists "Users can delete own blood sugar logs" on public.blood_sugar_logs;

drop policy if exists "Users can view own insulin logs" on public.insulin_logs;
drop policy if exists "Users can insert own insulin logs" on public.insulin_logs;
drop policy if exists "Users can update own insulin logs" on public.insulin_logs;
drop policy if exists "Users can delete own insulin logs" on public.insulin_logs;

drop policy if exists "Users can view own reminders" on public.reminders;
drop policy if exists "Users can insert own reminders" on public.reminders;
drop policy if exists "Users can update own reminders" on public.reminders;
drop policy if exists "Users can delete own reminders" on public.reminders;

create policy "Users can view own blood sugar logs"
on public.blood_sugar_logs for select
using (auth.uid() = user_id);

create policy "Users can insert own blood sugar logs"
on public.blood_sugar_logs for insert
with check (auth.uid() = user_id);

create policy "Users can update own blood sugar logs"
on public.blood_sugar_logs for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own blood sugar logs"
on public.blood_sugar_logs for delete
using (auth.uid() = user_id);

create policy "Users can view own insulin logs"
on public.insulin_logs for select
using (auth.uid() = user_id);

create policy "Users can insert own insulin logs"
on public.insulin_logs for insert
with check (auth.uid() = user_id);

create policy "Users can update own insulin logs"
on public.insulin_logs for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own insulin logs"
on public.insulin_logs for delete
using (auth.uid() = user_id);

create policy "Users can view own reminders"
on public.reminders for select
using (auth.uid() = user_id);

create policy "Users can insert own reminders"
on public.reminders for insert
with check (auth.uid() = user_id);

create policy "Users can update own reminders"
on public.reminders for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own reminders"
on public.reminders for delete
using (auth.uid() = user_id);
