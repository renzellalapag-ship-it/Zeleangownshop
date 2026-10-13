-- ===========================================================================
-- Zelean Gowns — Additional Product Attributes
-- ---------------------------------------------------------------------------
-- File: supabase/migrations/0006_products_attributes.sql
--
-- Adds optional product attributes to `products`:
--   * sub_category      text           — e.g. "Mid Dress" (finer than category)
--   * fabric            text           — e.g. "Lace"
--   * deposit_required  numeric(10, 2) — refundable rental deposit (₱)
--   * replacement_value numeric(10, 2) — item replacement value (₱)
--
-- These are all nullable so existing rows and other categories (Barong, Suit,
-- Accessories) keep working without them. Uses ADD COLUMN IF NOT EXISTS so the
-- migration is idempotent and safe to re-run.
--
-- Run in the Supabase SQL Editor (Dashboard → SQL Editor) or: supabase db push
-- ===========================================================================

alter table public.products
  add column if not exists sub_category      text,
  add column if not exists fabric            text,
  add column if not exists deposit_required  numeric(10, 2) check (deposit_required is null or deposit_required >= 0),
  add column if not exists replacement_value numeric(10, 2) check (replacement_value is null or replacement_value >= 0);
