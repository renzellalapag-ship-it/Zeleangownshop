-- ===========================================================================
-- Zelean Gowns — Admin Read Policies
-- ---------------------------------------------------------------------------
-- File: supabase/migrations/0004_admin_read.sql
--
-- WHY THIS EXISTS
--   The RLS in 0001_init.sql only lets ANYONE (including signed-in admins)
--   SELECT published products. But the admin dashboard must also see DRAFTS
--   (unpublished) to manage them, show the correct "Published/Unpublished"
--   counts, and toggle publish state. RLS SELECT policies are combined with
--   OR, so adding an admin policy simply widens what an admin can read; the
--   public is still limited to published rows.
--
-- WHEN TO RUN
--   Run AFTER 0001/0002/0003 in the Supabase SQL Editor. Safe to re-run.
-- ===========================================================================

-- Admins may read ALL products (published + drafts). Public read is unaffected.
drop policy if exists "products admin read all" on public.products;
create policy "products admin read all"
  on public.products
  for select
  using (public.is_admin());

-- Admins may read ALL product images (including images of draft products).
drop policy if exists "product_images admin read all" on public.product_images;
create policy "product_images admin read all"
  on public.product_images
  for select
  using (public.is_admin());
