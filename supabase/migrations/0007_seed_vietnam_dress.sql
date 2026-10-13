-- ===========================================================================
-- Zelean Gowns — Seed the "Vietnam Dress" product with the new attributes
-- ---------------------------------------------------------------------------
-- File: supabase/migrations/0007_seed_vietnam_dress.sql
--
-- This is idempotent and safe to run repeatedly:
--   1. Ensures the optional attribute columns exist (same as 0006).
--   2. Inserts the "Vietnam Dress" product with the requested values, OR
--      updates it if a row with the same SKU already exists.
--   3. Replaces its images with the two sample photos.
--
-- Requested values:
--   Category           Vietnam Dress
--   Sub-Category       Mid Dress
--   Size               M
--   Color              Floral Pink / Violet
--   Fabric             Lace
--   Rental Price       ₱500.00
--   Deposit Required   ₱500.00
--   Replacement Value  ₱3,000.00
--
-- Run in the Supabase SQL Editor (Dashboard → SQL Editor) or: supabase db push
-- ===========================================================================

-- 1) Make sure the optional columns exist (no-op if 0006 already ran).
alter table public.products
  add column if not exists sub_category      text,
  add column if not exists fabric            text,
  add column if not exists deposit_required  numeric(10, 2) check (deposit_required is null or deposit_required >= 0),
  add column if not exists replacement_value numeric(10, 2) check (replacement_value is null or replacement_value >= 0);

-- 2) Insert (or update) the Vietnam Dress product.
do $$
declare
  v_id uuid;
begin
  insert into public.products (
    sku, name, slug, category, sub_category, description, listing_type,
    rental_price, sale_price, deposit_required, replacement_value,
    rental_duration_days, sizes, colors, fabric, availability_status, is_published
  )
  values (
    'ZL-VND-0601',
    'Vietnam Dress',
    'vietnam-mid-dress',
    'Vietnam Dress',
    'Mid Dress',
    'A lace mid dress in a floral pink and violet palette. Demo product showing the sub-category, fabric, deposit, and replacement value attributes.',
    'rent',
    500.00, null, 500.00, 3000.00,
    3,
    array['M'],
    array['Floral Pink', 'Violet'],
    'Lace',
    'available',
    true
  )
  on conflict (sku) do update set
    name               = excluded.name,
    slug               = excluded.slug,
    category           = excluded.category,
    sub_category       = excluded.sub_category,
    description        = excluded.description,
    listing_type       = excluded.listing_type,
    rental_price       = excluded.rental_price,
    sale_price         = excluded.sale_price,
    deposit_required   = excluded.deposit_required,
    replacement_value  = excluded.replacement_value,
    rental_duration_days = excluded.rental_duration_days,
    sizes              = excluded.sizes,
    colors             = excluded.colors,
    fabric             = excluded.fabric,
    availability_status = excluded.availability_status,
    is_published       = excluded.is_published
  returning id into v_id;

  -- 3) Replace its images with the two sample photos.
  delete from public.product_images where product_id = v_id;

  insert into public.product_images (product_id, url, alt, position)
  values
    (v_id, 'assets/images/samples/gown-rose.svg', 'Vietnam Dress — front view (sample photo)', 0),
    (v_id, 'assets/images/samples/gown-mauve.svg', 'Vietnam Dress — alternate view (sample photo)', 1);
end $$;
