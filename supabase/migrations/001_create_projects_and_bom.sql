create extension if not exists pgcrypto;
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  name text not null,
  payload jsonb not null,
  totals jsonb,
  public boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  archived boolean default false,
  archived_at timestamptz
);
create table if not exists bom_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  label text not null,
  qty int not null,
  spec text,
  unit_cost numeric(12,2),
  created_at timestamptz default now(),
  archived boolean default false,
  archived_at timestamptz
);

