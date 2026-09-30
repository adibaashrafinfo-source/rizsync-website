-- NBR income-tax audit lists: structure for the bulk PDF importer
-- (scripts/import-nbr-audit-pdfs.ts).
--
-- * A TIN can be selected in more than one assessment year (and appear in
--   more than one PDF), so audit_tin is keyed on (tin, assessment_year)
--   instead of tin alone.
-- * Zone, circle, submission type and an optional BIN get real columns.
-- * Every row keeps its provenance: source PDF, page and SL/row number.
-- * audit_imports records each importer run for traceability.
-- * audit_lookup() returns every matching year for a TIN.
--
-- audit_tin was empty when this was written, so the key change is safe.

alter table public.audit_tin
  add column if not exists id bigint generated always as identity,
  add column if not exists zone text not null default '',
  add column if not exists circle text not null default '',
  add column if not exists submission_type text not null default '',
  add column if not exists bin text,
  add column if not exists source_pdf text not null default '',
  add column if not exists source_page integer,
  add column if not exists source_row text,
  add column if not exists updated_at timestamptz not null default now();

alter table public.audit_tin drop constraint if exists audit_tin_pkey;
alter table public.audit_tin add constraint audit_tin_pkey primary key (id);
alter table public.audit_tin
  add constraint audit_tin_tin_assessment_year_key unique (tin, assessment_year);
alter table public.audit_tin
  add constraint audit_tin_bin_check check (bin is null or bin ~ '^\d{9}-\d{4}$');

alter table public.audit_bin
  add column if not exists source_page integer,
  add column if not exists source_row text;

create table if not exists public.audit_imports (
  id bigint generated always as identity primary key,
  kind text not null check (kind in ('tin', 'bin')),
  source_pdf text not null,
  file_sha256 text not null,
  pages integer not null default 0,
  rows_parsed integer not null default 0,
  rows_upserted integer not null default 0,
  rows_rejected integer not null default 0,
  status text not null default 'running' check (status in ('running', 'completed', 'failed')),
  error text,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

alter table public.audit_imports enable row level security;
create policy "admins read audit_imports" on public.audit_imports
  for select to authenticated using (public.is_admin());

-- Exact-match lookup. Accepts digits with or without separators.
-- TIN results: `record` is the latest assessment year, `records` all years.
create or replace function public.audit_lookup(p_kind text, p_query text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  digits text := regexp_replace(coalesce(p_query, ''), '\D', '', 'g');
  result jsonb;
  records jsonb;
begin
  if p_kind = 'bin' then
    if length(digits) <> 13 then
      return jsonb_build_object('found', false, 'error', 'invalid');
    end if;
    select jsonb_build_object(
             'bin', b.bin, 'name', b.name, 'address', b.address,
             'list_label', b.list_label, 'source', b.source)
      into result
      from public.audit_bin b
     where b.bin = substr(digits, 1, 9) || '-' || substr(digits, 10, 4);
  elsif p_kind = 'tin' then
    if length(digits) <> 12 then
      return jsonb_build_object('found', false, 'error', 'invalid');
    end if;
    select jsonb_agg(
             jsonb_build_object(
               'tin', t.tin,
               'name', t.name,
               'assessment_year', t.assessment_year,
               'details', jsonb_strip_nulls(jsonb_build_object(
                   'Zone', nullif(t.zone, ''),
                   'Circle', nullif(t.circle, ''),
                   'Submission type', nullif(t.submission_type, ''),
                   'BIN', t.bin
                 )) || t.details,
               'source', t.source)
             order by t.assessment_year desc)
      into records
      from public.audit_tin t
     where t.tin = digits;
    result := records -> 0;
  else
    return jsonb_build_object('found', false, 'error', 'invalid');
  end if;

  insert into public.audit_lookups (kind, found) values (p_kind, result is not null);
  return jsonb_build_object(
    'found', result is not null,
    'record', result,
    'records', coalesce(records, case when result is null then '[]'::jsonb else jsonb_build_array(result) end)
  );
end;
$$;

revoke all on function public.audit_lookup(text, text) from public;
grant execute on function public.audit_lookup(text, text) to anon, authenticated;
