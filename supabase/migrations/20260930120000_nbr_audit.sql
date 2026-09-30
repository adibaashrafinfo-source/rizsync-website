-- NBR audit selection lists (BIN = VAT, TIN = income tax) and the public
-- exact-match lookup behind /nbr-audit-check.
--
-- The tables are NOT readable by visitors: the lists are only reachable one
-- record at a time through audit_lookup(), so they cannot be scraped with a
-- single select. Admins can read and manage everything.

create table if not exists public.audit_bin (
  bin text primary key check (bin ~ '^\d{9}-\d{4}$'),
  name text not null,
  address text not null default '',
  list_label text not null default 'NBR e-VAT Risk Management Module — 600 institutions selected for VAT audit',
  source text not null default 'Audit_BIN_List.pdf',
  created_at timestamptz not null default now()
);

create table if not exists public.audit_tin (
  tin text primary key check (tin ~ '^\d{12}$'),
  name text not null default '',
  assessment_year text not null default '',
  details jsonb not null default '{}'::jsonb,
  source text not null default '',
  created_at timestamptz not null default now()
);

-- One row per search, for abuse monitoring. Stores no search terms.
create table if not exists public.audit_lookups (
  id bigint generated always as identity primary key,
  kind text not null check (kind in ('tin', 'bin')),
  found boolean not null,
  created_at timestamptz not null default now()
);

alter table public.audit_bin enable row level security;
alter table public.audit_tin enable row level security;
alter table public.audit_lookups enable row level security;

create policy "admins manage audit_bin" on public.audit_bin
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage audit_tin" on public.audit_tin
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins read audit_lookups" on public.audit_lookups
  for select to authenticated using (public.is_admin());

create index if not exists audit_lookups_created_at_idx on public.audit_lookups (created_at desc);

-- Exact-match lookup. Accepts digits with or without separators.
create or replace function public.audit_lookup(p_kind text, p_query text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  digits text := regexp_replace(coalesce(p_query, ''), '\D', '', 'g');
  result jsonb;
begin
  if p_kind = 'bin' then
    if length(digits) <> 13 then
      return jsonb_build_object('found', false, 'error', 'invalid');
    end if;
    select to_jsonb(b) - 'created_at' into result
      from public.audit_bin b
     where b.bin = substr(digits, 1, 9) || '-' || substr(digits, 10, 4);
  elsif p_kind = 'tin' then
    if length(digits) <> 12 then
      return jsonb_build_object('found', false, 'error', 'invalid');
    end if;
    select to_jsonb(t) - 'created_at' into result
      from public.audit_tin t
     where t.tin = digits;
  else
    return jsonb_build_object('found', false, 'error', 'invalid');
  end if;

  insert into public.audit_lookups (kind, found) values (p_kind, result is not null);
  return jsonb_build_object('found', result is not null, 'record', result);
end;
$$;

create or replace function public.audit_stats()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'tin', (select count(*) from public.audit_tin),
    'bin', (select count(*) from public.audit_bin)
  );
$$;

revoke all on function public.audit_lookup(text, text) from public;
revoke all on function public.audit_stats() from public;
grant execute on function public.audit_lookup(text, text) to anon, authenticated;
grant execute on function public.audit_stats() to anon, authenticated;
