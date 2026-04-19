-- Noblr — Supabase schema for demo shared state.
-- Run this in Supabase Dashboard → SQL Editor. One-click.
--
-- Design: single key/value table storing the entire app state as JSONB.
-- Each UI field (applications, verifiedAccords, phantomMode, etc.) is one row
-- identified by `key`. This keeps the demo simple and easy to evolve.
--
-- SECURITY NOTE: this schema enables anon read/write on all rows. Suitable for
-- a single-user demo / internal founder testing only. For multi-user or
-- production, introduce auth (Supabase Auth) and per-user scoped rows with
-- RLS policies keyed on auth.uid().

create table if not exists public.app_state (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- Auto-update updated_at on row change
create or replace function public.app_state_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists app_state_touch on public.app_state;
create trigger app_state_touch
  before update on public.app_state
  for each row execute function public.app_state_touch_updated_at();

-- Enable Row Level Security
alter table public.app_state enable row level security;

-- Granular policies: allow CRUD needed for demo UX, block DELETE so trivial
-- wipe attacks are prevented. Reset still works via UPDATE (upsert).
drop policy if exists "demo anon full access" on public.app_state;
drop policy if exists "public read" on public.app_state;
drop policy if exists "public insert" on public.app_state;
drop policy if exists "public update" on public.app_state;

create policy "public read" on public.app_state for select using (true);
create policy "public insert" on public.app_state for insert with check (true);
create policy "public update" on public.app_state for update using (true) with check (true);
-- intentionally no DELETE policy (anon cannot delete rows)

-- Enable realtime so multiple tabs stay in sync
alter publication supabase_realtime add table public.app_state;
