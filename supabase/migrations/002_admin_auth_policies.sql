-- Final admin auth setup for Chia-SN
-- This script assumes Supabase Auth users already exist in auth.users.
-- Each auth user must have a matching row in public.admin_users keyed by the same UUID.

-- Make the admin profile table compatible with Supabase Auth-managed identities.
alter table public.admin_users
  alter column password_hash drop not null;

alter table public.admin_users
  add column if not exists phone text,
  add column if not exists last_login timestamptz,
  add column if not exists is_active boolean default true;

update public.admin_users
set is_active = true
where is_active is null;

alter table public.admin_users
  alter column is_active set not null;

-- Keep admin_users.id aligned to auth.users.id.
alter table public.admin_users
  drop constraint if exists admin_users_id_fkey;

alter table public.admin_users
  add constraint admin_users_id_fkey
  foreign key (id) references auth.users(id) on delete cascade;

-- RLS: allow authenticated admins to read their own active profile and let a super-admin manage the rest.
alter table public.admin_users enable row level security;

create policy "admin_profiles_select_self_or_superadmin"
on public.admin_users
for select
to authenticated
using (
  is_active = true
  and (
    id = auth.uid()
    or exists (
      select 1
      from public.admin_users as current_admin
      where current_admin.id = auth.uid()
        and current_admin.role = 'super_admin'
    )
  )
);

create policy "admin_profiles_insert_only_superadmin"
on public.admin_users
for insert
to authenticated
with check (
  exists (
    select 1
    from public.admin_users as current_admin
    where current_admin.id = auth.uid()
      and current_admin.role = 'super_admin'
  )
);

create policy "admin_profiles_update_self_or_superadmin"
on public.admin_users
for update
to authenticated
using (
  id = auth.uid()
  or exists (
    select 1
    from public.admin_users as current_admin
    where current_admin.id = auth.uid()
      and current_admin.role = 'super_admin'
  )
)
with check (
  id = auth.uid()
  or exists (
    select 1
    from public.admin_users as current_admin
    where current_admin.id = auth.uid()
      and current_admin.role = 'super_admin'
  )
);

create policy "admin_profiles_delete_only_superadmin"
on public.admin_users
for delete
to authenticated
using (
  exists (
    select 1
    from public.admin_users as current_admin
    where current_admin.id = auth.uid()
      and current_admin.role = 'super_admin'
  )
);

-- Seed script for the initial admin accounts.
-- Replace each <AUTH_USER_ID_...> placeholder with the real UUID from auth.users.
-- You can fetch them from Supabase Studio -> Authentication -> Users.
insert into public.admin_users (id, username, full_name, email, role, phone, is_active, created_at)
values
  ('<AUTH_USER_ID_SUPER_ADMIN>', 'admin', 'Associé Principal (Master Admin)', 'chia2nuh@gmail.com', 'super_admin', '+237 670 12 34 56', true, now()),
  ('<AUTH_USER_ID_FLORE>', 'febouele', 'Flore Ebouélé', 'f.ebouele@chiasn.cm', 'admin', '+237 699 87 65 43', true, now()),
  ('<AUTH_USER_ID_JP>', 'jtchouamo', 'Jean-Paul Tchouamo', 'j.tchouamo@chiasn.cm', 'auditor', '+237 677 44 22 11', true, now())
on conflict (username) do update set
  full_name = excluded.full_name,
  email = excluded.email,
  role = excluded.role,
  phone = excluded.phone,
  is_active = excluded.is_active,
  last_login = public.admin_users.last_login;

-- Optional helper check:
-- select a.id, a.email, p.username, p.role, p.is_active
-- from public.admin_users p
-- join auth.users a on a.id = p.id;
