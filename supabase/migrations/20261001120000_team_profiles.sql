-- Our Team page: richer profiles, grouped into sections.
--
-- `group` matches a section key in the `team` site_content document, so the
-- /our-team page can be reorganised from the admin panel without a migration.

alter table public.team_members
  add column if not exists credentials text not null default '',
  add column if not exists "group" text not null default 'advisory',
  add column if not exists expertise jsonb not null default '[]'::jsonb;

create index if not exists team_members_group_idx on public.team_members ("group");
