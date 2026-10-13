-- ===========================================================================
-- Zelean Gowns — Supabase Schema & Row Level Security
-- ---------------------------------------------------------------------------
-- File: supabase/migrations/0001_init.sql
--
-- Run these statements in the Supabase SQL Editor (Dashboard → SQL Editor),
-- or via the Supabase CLI:  supabase db push
--
-- Creates: products, product_images, admin_roles, an updated_at trigger,
-- Row Level Security (RLS) policies, and a public Storage bucket.
--
-- SECURITY MODEL
--   * Public visitors can SELECT only PUBLISHED products and their images.
--   * Only users present in admin_roles can INSERT/UPDATE/DELETE.
--   * An ordinary signed-in user is NOT automatically an admin.
--   * The browser only ever uses the publishable (anon) key.
-- ===========================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- 1. ADMIN ROLES
-- ---------------------------------------------------------------------------
-- A user is an administrator ONLY if they have a row here. After a user signs
-- up, grant admin manually, e.g.:
--   insert into public.admin_roles (user_id) values ('THE-USER-UUID');
create table if not exists public.admin_roles (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_roles enable row level security;

-- A user may read ONLY their own admin status (cannot grant themselves admin).
drop policy if exists "admin_roles read own" on public.admin_roles;
create policy "admin_roles read own"
  on public.admin_roles
  for select
  using (auth.uid() = user_id);

-- Helper used by the policies below: is the current user an admin?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_roles ar where ar.user_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- 2. PRODUCTS
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'listing_type') then
    create type public.listing_type as enum ('rent', 'sale', 'both');
  end if;
  if not exists (select 1 from pg_type where typname = 'availability_status') then
    create type public.availability_status as enum ('available', 'unavailable', 'maintenance');
  end if;
end $$;

create table if not exists public.products (
  id                   uuid primary key default gen_random_uuid(),
  sku                  text not null unique,
  name                 text not null,
  slug                 text not null unique,
  category             text not null,
  sub_category         text,
  description          text default '',
  listing_type         public.listing_type not null default 'rent',
  rental_price         numeric(10, 2) check (rental_price is null or rental_price >= 0),
  sale_price           numeric(10, 2) check (sale_price is null or sale_price >= 0),
  deposit_required     numeric(10, 2) check (deposit_required is null or deposit_required >= 0),
  replacement_value    numeric(10, 2) check (replacement_value is null or replacement_value >= 0),
  rental_duration_days integer check (rental_duration_days is null or rental_duration_days > 0),
  sizes                text[] not null default '{}',
  colors               text[] not null default '{}',
  fabric               text,
  availability_status  public.availability_status not null default 'available',
  is_published         boolean not null default false,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index if not exists products_is_published_idx on public.products (is_published);
create index if not exists products_category_idx on public.products (category);
create index if not exists products_created_at_idx on public.products (created_at desc);
create index if not exists products_slug_idx on public.products (slug);

-- ---------------------------------------------------------------------------
-- 3. PRODUCT IMAGES
-- ---------------------------------------------------------------------------
create table if not exists public.product_images (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url        text not null,
  alt        text default '',
  position   integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists product_images_product_idx on public.product_images (product_id, position);

-- ---------------------------------------------------------------------------
-- 4. UPDATED_AT TRIGGER
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY — PRODUCTS
-- ---------------------------------------------------------------------------
alter table public.products enable row level security;

-- Public: read ONLY published products.
drop policy if exists "products public read published" on public.products;
create policy "products public read published"
  on public.products
  for select
  using (is_published = true);

-- Admins: full write access.
drop policy if exists "products admin insert" on public.products;
create policy "products admin insert"
  on public.products
  for insert
  with check (public.is_admin());

drop policy if exists "products admin update" on public.products;
create policy "products admin update"
  on public.products
  for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "products admin delete" on public.products;
create policy "products admin delete"
  on public.products
  for delete
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY — PRODUCT IMAGES
-- ---------------------------------------------------------------------------
alter table public.product_images enable row level security;

-- Public: read images that belong to a published product.
drop policy if exists "product_images public read" on public.product_images;
create policy "product_images public read"
  on public.product_images
  for select
  using (
    exists (
      select 1 from public.products p
      where p.id = product_images.product_id and p.is_published = true
    )
  );

drop policy if exists "product_images admin insert" on public.product_images;
create policy "product_images admin insert"
  on public.product_images
  for insert
  with check (public.is_admin());

drop policy if exists "product_images admin update" on public.product_images;
create policy "product_images admin update"
  on public.product_images
  for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "product_images admin delete" on public.product_images;
create policy "product_images admin delete"
  on public.product_images
  for delete
  using (public.is_admin());

-- ===========================================================================
-- STORAGE — see supabase/migrations/0002_storage.sql for the
-- "zelean-products" bucket and its access policies.
-- ===========================================================================

