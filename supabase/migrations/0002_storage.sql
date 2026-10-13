-- ===========================================================================
-- Zelean Gowns — Storage Bucket & Policies
-- ---------------------------------------------------------------------------
-- File: supabase/migrations/0002_storage.sql
--
-- Creates the public, read-only "zelean-products" bucket and its RLS:
--   * Anyone may READ product images (they are shown on the public site).
--   * Only admins may upload / update / delete images.
--
-- Recommended image path convention (used by the admin uploader):
--   zelean-products/<product_id>/<sku>-01.jpg
--   zelean-products/<product_id>/<sku>-02.jpg
--
-- Allowed types: image/jpeg, image/png, image/webp, image/gif, image/avif.
-- ===========================================================================

-- Create the bucket if it does not already exist.
insert into storage.buckets (id, name, public)
values ('zelean-products', 'zelean-products', true)
on conflict (id) do nothing;

-- Allow public read access to all objects in the bucket.
drop policy if exists "zelean products public read" on storage.objects;
create policy "zelean products public read"
  on storage.objects
  for select
  using (bucket_id = 'zelean-products');

-- Admins may upload new images.
drop policy if exists "zelean products admin insert" on storage.objects;
create policy "zelean products admin insert"
  on storage.objects
  for insert
  with check (
    bucket_id = 'zelean-products'
    and public.is_admin()
  );

-- Admins may replace/update images.
drop policy if exists "zelean products admin update" on storage.objects;
create policy "zelean products admin update"
  on storage.objects
  for update
  using (bucket_id = 'zelean-products' and public.is_admin())
  with check (bucket_id = 'zelean-products' and public.is_admin());

-- Admins may delete images.
drop policy if exists "zelean products admin delete" on storage.objects;
create policy "zelean products admin delete"
  on storage.objects
  for delete
  using (bucket_id = 'zelean-products' and public.is_admin());
