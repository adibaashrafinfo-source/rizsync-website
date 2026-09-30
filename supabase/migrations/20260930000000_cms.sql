-- RizSync CMS schema — as applied to the Supabase project.
-- Content tables are public-readable (published rows only) and writable only
-- by users listed in public.admin_users. Seed data: supabase/seed.sql.

-- ---------------------------------------------------------------------------
-- Leads (consultation form backup)
-- ---------------------------------------------------------------------------
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  company text,
  email text not null,
  phone text not null,
  client_type text not null,
  subject text not null,
  subject_label text not null,
  message text not null,
  preferred_contact text,
  source text,
  ip text,
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  notes text
);
create index leads_created_at_idx on public.leads (created_at desc);
alter table public.leads enable row level security;
create policy "anon can insert leads" on public.leads for insert to anon with check (true);

-- ---------------------------------------------------------------------------
-- Admins
-- ---------------------------------------------------------------------------
create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create policy "admins read admins" on public.admin_users
  for select to authenticated using (public.is_admin());

create policy "admins read leads" on public.leads
  for select to authenticated using (public.is_admin());
create policy "admins update leads" on public.leads
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete leads" on public.leads
  for delete to authenticated using (public.is_admin());

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Singleton documents: settings, home, about
-- ---------------------------------------------------------------------------
create table public.site_content (
  key text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.site_content enable row level security;
create trigger site_content_touch before update on public.site_content
  for each row execute function public.touch_updated_at();
create policy "public read content" on public.site_content
  for select to anon, authenticated using (true);
create policy "admins write content" on public.site_content
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Collections
-- ---------------------------------------------------------------------------
create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  sort_order integer not null default 0,
  published boolean not null default true,
  title text not null,
  short_title text not null,
  h1 text not null default '',
  nav_description text not null default '',
  intro text not null default '',
  color text not null default 'teal' check (color in ('teal', 'orange', 'gold')),
  icon text not null default 'Briefcase',
  bullets text[] not null default '{}',
  hero_card jsonb,
  items jsonb not null default '[]'::jsonb,
  why_rizsync jsonb not null default '[]'::jsonb,
  faqs jsonb not null default '[]'::jsonb,
  seo_title text not null default '',
  seo_description text not null default '',
  seo_keywords text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.insights (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  excerpt text not null default '',
  category text not null,
  tags text[] not null default '{}',
  author text not null default 'RizSync Advisory Team',
  published_on date not null default current_date,
  cover text,
  featured boolean not null default false,
  content text not null default '',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text not null default '',
  bio text not null default '',
  photo text,
  linkedin text,
  email text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  name text not null,
  role text not null default '',
  company text not null default '',
  rating integer not null default 5 check (rating between 1 and 5),
  photo text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
declare t text;
begin
  foreach t in array array['services', 'insights', 'team_members', 'testimonials', 'faqs'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create trigger %I before update on public.%I for each row execute function public.touch_updated_at()', t || '_touch', t);
    execute format('create policy "public read published" on public.%I for select to anon, authenticated using (published or public.is_admin())', t);
    execute format('create policy "admins insert" on public.%I for insert to authenticated with check (public.is_admin())', t);
    execute format('create policy "admins update" on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin())', t);
    execute format('create policy "admins delete" on public.%I for delete to authenticated using (public.is_admin())', t);
  end loop;
end $$;

create index services_sort_idx on public.services (sort_order);
create index insights_published_on_idx on public.insights (published_on desc);
create index team_members_sort_idx on public.team_members (sort_order);
create index testimonials_sort_idx on public.testimonials (sort_order);
create index faqs_sort_idx on public.faqs (sort_order);

-- ---------------------------------------------------------------------------
-- Media storage
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 10485760,
        array['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/gif']);

create policy "admins read media" on storage.objects
  for select to authenticated using (bucket_id = 'media' and public.is_admin());
create policy "admins upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
create policy "admins update media" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin());
create policy "admins delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());

-- To make someone an admin (after creating their user in Supabase Auth):
--   insert into public.admin_users (user_id, email)
--   select id, email from auth.users where email = 'someone@example.com';
