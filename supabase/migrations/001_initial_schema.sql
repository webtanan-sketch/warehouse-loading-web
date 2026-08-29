create extension if not exists pgcrypto;

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  display_name text not null unique,
  role text not null check (role in ('manager','worker')),
  pin_salt text not null,
  pin_hash text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.app_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.app_users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.sheets (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references public.app_users(id),
  title text not null,
  status text not null default 'open' check (status in ('open','archived')),
  created_at timestamptz not null default now(),
  archived_at timestamptz
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_no text not null unique,
  customer_name text not null,
  created_by uuid not null references public.app_users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.load_stages (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id),
  sheet_id uuid not null references public.sheets(id),
  stage_no integer not null,
  amount_total bigint not null check (amount_total >= 0),
  notes text,
  created_by uuid not null references public.app_users(id),
  created_at timestamptz not null default now(),
  settled_at timestamptz,
  settled_by uuid references public.app_users(id),
  unique(invoice_id, stage_no)
);

create table if not exists public.stage_workers (
  id uuid primary key default gen_random_uuid(),
  stage_id uuid not null references public.load_stages(id) on delete cascade,
  worker_id uuid not null references public.app_users(id),
  amount bigint not null check (amount >= 0),
  unique(stage_id, worker_id)
);

create table if not exists public.audit_logs (
  id bigserial primary key,
  actor_user_id uuid references public.app_users(id),
  action text not null,
  entity_type text not null,
  entity_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.app_config (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

create unique index if not exists one_open_sheet_per_worker
  on public.sheets(owner_user_id)
  where status = 'open';

create index if not exists idx_sessions_token on public.app_sessions(token_hash);
create index if not exists idx_invoices_no on public.invoices(invoice_no);
create index if not exists idx_stages_created on public.load_stages(created_at desc);
create index if not exists idx_stage_workers_worker on public.stage_workers(worker_id);

alter table public.app_users enable row level security;
alter table public.app_sessions enable row level security;
alter table public.sheets enable row level security;
alter table public.invoices enable row level security;
alter table public.load_stages enable row level security;
alter table public.stage_workers enable row level security;
alter table public.audit_logs enable row level security;
alter table public.app_config enable row level security;

-- No public RLS policies are created intentionally.
-- Edge Functions use a server-side privileged Supabase client as the source of truth.
