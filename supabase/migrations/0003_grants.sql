-- ===========================================================================
-- Zelean Gowns — Data API Grants
-- ---------------------------------------------------------------------------
-- File: supabase/migrations/0003_grants.sql
--
-- WHY THIS EXISTS
--   Row Level Security (RLS) controls WHICH ROWS a role can see. Table-level
--   GRANTs control WHETHER the Data API (PostgREST) can touch the table at
--   all. If these grants are missing, the public site (anon key) fails with:
--       permission denied for table products   (Postgres error 42501)
--
-- WHEN TO RUN
--   Run this AFTER 0001_init.sql and 0002_storage.sql, in the Supabase SQL
--   Editor (Dashboard -> SQL Editor). Safe to re-run.
--
-- SECURITY MODEL (matches the RLS policies in 0001_init.sql)
--   * anon         (public, not signed in) : read-only. RLS limits rows to
--                                            is_published = true.
--   * authenticated (signed in)            : read + write. RLS limits writes
--                                            to admins via is_admin().
--   * service_role : full access (default in Supabase; no grants needed here).
-- ===========================================================================

-- Schema usage (usually already granted by Supabase; defensive).
grant usage on schema public to anon, authenticated;

-- PUBLIC (anon): read-only. RLS restricts this to published products only.
grant select on public.products       to anon;
grant select on public.product_images to anon;

-- SIGNED-IN (authenticated): read + write. RLS restricts writes to admins.
grant select, insert, update, delete on public.products       to authenticated;
grant select, insert, update, delete on public.product_images to authenticated;

-- Let a signed-in user read ONLY their own admin_roles row (RLS-enforced).
-- Needed by the browser's is_admin() check in admin/js/admin-auth.js.
grant select on public.admin_roles to authenticated;
