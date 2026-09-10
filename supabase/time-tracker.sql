-- Shane Velez Time Tracker
-- Run this once in Supabase > SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  email text,
  billing_address text,
  hourly_rate_minor bigint not null check (hourly_rate_minor >= 0),
  currency text not null check (char_length(currency) = 3),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.time_entries (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete restrict,
  description text,
  started_at timestamptz not null,
  ended_at timestamptz,
  rate_minor bigint not null check (rate_minor >= 0),
  currency text not null check (char_length(currency) = 3),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sensible_time_range check (ended_at is null or ended_at > started_at)
);

-- Database-level protection: only one running timer per account.
create unique index if not exists one_running_timer_per_owner
  on public.time_entries(owner_id)
  where ended_at is null;

create index if not exists time_entries_owner_started_idx
  on public.time_entries(owner_id, started_at desc);

create table if not exists public.billing_profiles (
  owner_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  business_name text not null default 'Shane Velez',
  address text,
  email text,
  payment_instructions text,
  invoice_prefix text not null default 'SV',
  updated_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete restrict,
  invoice_number text not null,
  issue_date date not null,
  period_start date not null,
  period_end date not null,
  currency text not null check (char_length(currency) = 3),
  total_minor bigint not null check (total_minor >= 0),
  client_snapshot jsonb not null,
  sender_snapshot jsonb not null,
  line_items jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(owner_id, invoice_number),
  unique(owner_id, client_id, period_start)
);

alter table public.clients enable row level security;
alter table public.time_entries enable row level security;
alter table public.billing_profiles enable row level security;
alter table public.invoices enable row level security;

-- Each authenticated user can only see and modify their own rows.
-- Even if sign-ups are accidentally left enabled, another account cannot read your billing data.
drop policy if exists "clients_owner_all" on public.clients;
drop policy if exists "time_entries_owner_all" on public.time_entries;
drop policy if exists "billing_profiles_owner_all" on public.billing_profiles;
drop policy if exists "invoices_owner_all" on public.invoices;

create policy "clients_owner_all" on public.clients
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "time_entries_owner_all" on public.time_entries
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "billing_profiles_owner_all" on public.billing_profiles
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "invoices_owner_all" on public.invoices
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
