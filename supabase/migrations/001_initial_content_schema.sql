-- Chia-SN content and admin schema
-- This migration creates the tables that replace the hardcoded frontend content.

create extension if not exists pgcrypto;

create table if not exists public.services (
  id text primary key,
  icon_name text not null,
  badge_fr text,
  badge_en text,
  title_fr text not null,
  title_en text not null,
  description_fr text not null,
  description_en text not null,
  deliverables_fr jsonb not null default '[]'::jsonb,
  deliverables_en jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.carousel_slides (
  id text primary key,
  image_url text not null,
  title_fr text not null,
  title_en text not null,
  description_fr text not null,
  description_en text not null,
  tag_fr text not null,
  tag_en text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.office_locations (
  id uuid primary key default gen_random_uuid(),
  city_fr text not null,
  city_en text not null,
  address text not null,
  phone text not null,
  email text not null,
  schedule_fr text not null,
  schedule_en text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id text primary key,
  author text not null,
  role_fr text not null,
  role_en text not null,
  company text not null,
  industry_fr text not null,
  industry_en text not null,
  location text not null,
  rating integer not null check (rating between 1 and 5),
  quote_fr text not null,
  quote_en text not null,
  highlight_value text,
  highlight_label_fr text,
  highlight_label_en text,
  service_used_fr text not null,
  service_used_en text not null,
  avatar_initials text not null,
  badge_fr text,
  badge_en text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.faq_categories (
  id text primary key,
  label_fr text not null,
  label_en text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.faq_items (
  id text primary key,
  category text not null references public.faq_categories(id),
  badge_fr text not null,
  badge_en text not null,
  question_fr text not null,
  question_en text not null,
  answer_fr text not null,
  answer_en text not null,
  takeaway_fr text,
  takeaway_en text,
  reference text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.page_translations (
  id uuid primary key default gen_random_uuid(),
  locale text not null check (locale in ('FR', 'EN')),
  key text not null,
  value text not null,
  created_at timestamptz not null default now(),
  unique(locale, key)
);

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  full_name text not null,
  email text not null unique,
  role text not null check (role in ('super_admin', 'admin', 'tax_consultant', 'auditor', 'editor')),
  password_hash text not null,
  is_active boolean not null default true,
  phone text,
  last_login timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.consultation_requests (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_person text not null,
  email text not null,
  phone text,
  service_type text not null,
  message text not null,
  tracking_ref text not null unique,
  created_at timestamptz not null default now()
);

alter table public.services enable row level security;
alter table public.carousel_slides enable row level security;
alter table public.office_locations enable row level security;
alter table public.testimonials enable row level security;
alter table public.faq_categories enable row level security;
alter table public.faq_items enable row level security;
alter table public.page_translations enable row level security;
alter table public.admin_users enable row level security;
alter table public.consultation_requests enable row level security;

create policy "public can read services"
on public.services
for select
using (true);

create policy "public can read carousel slides"
on public.carousel_slides
for select
using (true);

create policy "public can read office locations"
on public.office_locations
for select
using (true);

create policy "public can read testimonials"
on public.testimonials
for select
using (true);

create policy "public can read faq categories"
on public.faq_categories
for select
using (true);

create policy "public can read faq items"
on public.faq_items
for select
using (true);

create policy "public can read translations"
on public.page_translations
for select
using (true);

create policy "public can read admin users"
on public.admin_users
for select
using (true);

create policy "public can read consultation requests"
on public.consultation_requests
for select
using (true);

create policy "public can insert consultation requests"
on public.consultation_requests
for insert
with check (true);

create index if not exists idx_services_sort_order on public.services(sort_order);
create index if not exists idx_carousel_sort_order on public.carousel_slides(sort_order);
create index if not exists idx_offices_sort_order on public.office_locations(sort_order);
create index if not exists idx_testimonials_sort_order on public.testimonials(sort_order);
create index if not exists idx_faq_items_category on public.faq_items(category);
create index if not exists idx_faq_items_sort_order on public.faq_items(sort_order);
create index if not exists idx_page_translations_locale_key on public.page_translations(locale, key);
