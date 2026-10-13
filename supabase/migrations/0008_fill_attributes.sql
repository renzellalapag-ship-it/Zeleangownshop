-- ===========================================================================
-- Zelean Gowns — Fill in the new product attributes
-- ---------------------------------------------------------------------------
-- File: supabase/migrations/0008_fill_attributes.sql
--
-- HOW TO USE
--   1. For EACH product below, replace the placeholder values with your REAL
--      numbers/text (or delete a product's line if it doesn't apply).
--   2. Paste the whole file into Supabase → SQL Editor → Run.
--
-- Rules:
--   * deposit_required, replacement_value → numbers only (no ₱, no commas).
--   * Use NULL to leave a field blank (e.g. replacement_value => NULL).
--   * sub_category / fabric → text in single quotes, or NULL.
--
-- The columns are added automatically if they don't already exist, so this is
-- safe to run even if you haven't run 0006/0007 yet.
-- ===========================================================================

-- Ensure columns exist (no-op if already added).
alter table public.products
  add column if not exists sub_category      text,
  add column if not exists fabric            text,
  add column if not exists deposit_required  numeric(10, 2) check (deposit_required is null or deposit_required >= 0),
  add column if not exists replacement_value numeric(10, 2) check (replacement_value is null or replacement_value >= 0);

-- ---------------------------------------------------------------------------
-- UPDATE each product's new attributes (matched by SKU). Fill in real values.
-- ---------------------------------------------------------------------------

-- Adelie (Ballgown)
update public.products set
  sub_category      = NULL,   -- e.g. 'Ballgown', 'Mid Dress'
  fabric            = NULL,   -- e.g. 'Lace', 'Satin'
  deposit_required  = NULL,   -- e.g. 500
  replacement_value = NULL    -- e.g. 3000
where sku = 'ZL-GWN-0001';

-- Arielle (Long Gown)
update public.products set
  sub_category      = NULL,
  fabric            = NULL,
  deposit_required  = NULL,
  replacement_value = NULL
where sku = 'ZL-GWN-0002';

-- Aurelia (Mermaid Gown)
update public.products set
  sub_category      = NULL,
  fabric            = NULL,
  deposit_required  = NULL,
  replacement_value = NULL
where sku = 'ZL-GWN-0003';

-- Celestia (Night Gown)
update public.products set
  sub_category      = NULL,
  fabric            = NULL,
  deposit_required  = NULL,
  replacement_value = NULL
where sku = 'ZL-GWN-0004';

-- Lila Cocktail Dress
update public.products set
  sub_category      = NULL,
  fabric            = NULL,
  deposit_required  = NULL,
  replacement_value = NULL
where sku = 'ZL-CKT-0101';

-- Maria Filipiniana
update public.products set
  sub_category      = NULL,
  fabric            = NULL,
  deposit_required  = NULL,
  replacement_value = NULL
where sku = 'ZL-FIL-0401';

-- Classic Barong Tagalog
update public.products set
  sub_category      = NULL,
  fabric            = NULL,
  deposit_required  = NULL,
  replacement_value = NULL
where sku = 'ZL-BRG-0301';

-- Noir Men's Suit
update public.products set
  sub_category      = NULL,
  fabric            = NULL,
  deposit_required  = NULL,
  replacement_value = NULL
where sku = 'ZL-SUT-0201';

-- Eve Evening Clutch
update public.products set
  sub_category      = NULL,
  fabric            = NULL,
  deposit_required  = NULL,
  replacement_value = NULL
where sku = 'ZL-ACC-0501';

-- Vietnam Dress (already filled — kept here as a reference / example)
update public.products set
  sub_category      = 'Mid Dress',
  fabric            = 'Lace',
  deposit_required  = 500,
  replacement_value = 3000
where sku = 'ZL-VND-0601';

-- ---------------------------------------------------------------------------
-- OPTIONAL: delete the test product "Renzell" (has junk values). Uncomment to run.
-- ---------------------------------------------------------------------------
-- delete from public.products where sku = 'ZL-GWN-0232';
