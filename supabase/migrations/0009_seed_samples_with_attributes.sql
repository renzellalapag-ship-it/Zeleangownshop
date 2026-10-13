-- ===========================================================================
-- Zelean Gowns — Seed Sample Products (with the new attributes)
-- ---------------------------------------------------------------------------
-- File: supabase/migrations/0009_seed_samples_with_attributes.sql
--
-- UPDATED version of 0005_seed_samples.sql that also fills the 4 new columns:
--   sub_category, fabric, deposit_required, replacement_value.
--
-- The deposit / replacement / fabric / sub-category values below are SAMPLE
-- demonstration values (these are placeholder products) — edit them to your
-- real numbers before launch.
--
-- Idempotent: deletes any existing rows with these SKUs (images cascade),
-- then re-inserts. Safe to re-run.
--
-- Run in Supabase → SQL Editor → Run.
-- ===========================================================================

-- Ensure the columns exist (no-op if already added).
alter table public.products
  add column if not exists sub_category      text,
  add column if not exists fabric            text,
  add column if not exists deposit_required  numeric(10, 2) check (deposit_required is null or deposit_required >= 0),
  add column if not exists replacement_value numeric(10, 2) check (replacement_value is null or replacement_value >= 0);

-- 1) Remove previous copies of these sample rows (images cascade-delete).
delete from public.products
where sku in (
  'ZL-GWN-0001','ZL-GWN-0002','ZL-GWN-0003','ZL-GWN-0004',
  'ZL-CKT-0101','ZL-SUT-0201','ZL-BRG-0301','ZL-FIL-0401','ZL-ACC-0501'
);

-- 2) Insert the 9 products (including the new attributes).
insert into public.products
  (sku, name, slug, category, sub_category, description, listing_type,
   rental_price, sale_price, deposit_required, replacement_value,
   rental_duration_days, sizes, colors, fabric,
   availability_status, is_published, created_at, updated_at)
values
 ('ZL-GWN-0001','Adelie','adelie','Ballgowns','Ballgown','SAMPLE DESCRIPTION: A graceful floor-length ballgown with a fitted bodice and full skirt, ideal for debut, pageant, or formal ball occasions.','rent',500,NULL,500,3000,3,'{XS,S,M,L}','{Blush,Ivory}','Satin','available',true,'2024-01-01T00:00:00Z','2024-01-01T00:00:00Z'),
 ('ZL-GWN-0002','Arielle','arielle','Long Gowns','Long Gown','SAMPLE DESCRIPTION: An elegant long gown with a soft drape and flowing silhouette.','rent',500,NULL,500,3000,3,'{S,M,L}','{Champagne}','Chiffon','available',true,'2024-01-02T00:00:00Z','2024-01-02T00:00:00Z'),
 ('ZL-GWN-0003','Aurelia','aurelia','Mermaid Gowns','Mermaid Gown','SAMPLE DESCRIPTION: A sophisticated mermaid-cut gown that follows the body''s lines before flaring at the hem.','rent',500,NULL,500,3000,3,'{S,M}','{Mauve,Champagne}','Lace','available',true,'2024-01-03T00:00:00Z','2024-01-03T00:00:00Z'),
 ('ZL-GWN-0004','Celestia','celestia','Night Gowns','Night Gown','SAMPLE DESCRIPTION: A refined night gown with a flattering neckline and sweeping skirt.','rent',500,NULL,500,3000,3,'{XS,S,M,L,XL}','{Ivory,Mauve}','Satin','available',true,'2024-01-04T00:00:00Z','2024-01-04T00:00:00Z'),
 ('ZL-CKT-0101','Lila Cocktail Dress','lila-cocktail-dress','Cocktail Dresses','Cocktail Dress','SAMPLE DESCRIPTION: A knee-length cocktail dress with a flattering cut.','both',500,2500,500,2500,3,'{S,M,L}','{Blush,Black}','Lace','available',true,'2024-02-01T00:00:00Z','2024-02-01T00:00:00Z'),
 ('ZL-SUT-0201','Noir Men''s Suit','noir-mens-suit','Men''s Suits','Men''s Suit','SAMPLE DESCRIPTION: A classic tailored men''s suit suitable for weddings and formal events.','rent',1500,NULL,1500,8000,3,'{S,M,L,XL}','{Black,Navy}','Wool Blend','available',true,'2024-02-05T00:00:00Z','2024-02-05T00:00:00Z'),
 ('ZL-BRG-0301','Classic Barong Tagalog','classic-barong-tagalog','Barong','Barong Tagalog','SAMPLE DESCRIPTION: A traditional Barong Tagalog for Filipino formal occasions such as weddings and receptions.','both',800,3500,800,3500,3,'{S,M,L,XL}','{White,Ivory}','Jusi','available',true,'2024-02-10T00:00:00Z','2024-02-10T00:00:00Z'),
 ('ZL-FIL-0401','Maria Filipiniana','maria-filipiniana','Filipiniana','Filipiniana','SAMPLE DESCRIPTION: An elegant Filipiniana gown inspired by traditional Filipino dress.','rent',1200,NULL,1200,6000,3,'{S,M,L}','{Ivory,Champagne}','Pina','maintenance',true,'2024-02-15T00:00:00Z','2024-02-15T00:00:00Z'),
 ('ZL-ACC-0501','Eve Evening Clutch','eve-evening-clutch','Bags & Accessories','Clutch','SAMPLE DESCRIPTION: A refined evening clutch to complete a formal look.','sale',NULL,900,NULL,900,NULL,'{One Size}','{Champagne,Brown}','Satin','available',true,'2024-02-20T00:00:00Z','2024-02-20T00:00:00Z');

-- 3) Insert placeholder images for each product (matched by SKU, position order).
insert into public.product_images (product_id, url, alt, position)
select p.id, t.url, t.alt, t.position from (
  values
   ('ZL-GWN-0001','assets/images/samples/gown-rose.svg','Adelie (sample photo)',0),
   ('ZL-GWN-0002','assets/images/samples/gown-champagne.svg','Arielle (sample photo)',0),
   ('ZL-GWN-0003','assets/images/samples/gown-mauve.svg','Aurelia (sample photo)',0),
   ('ZL-GWN-0004','assets/images/samples/gown-champagne.svg','Celestia (sample photo)',0),
   ('ZL-CKT-0101','assets/images/samples/gown-rose.svg','Lila (sample photo)',0),
   ('ZL-SUT-0201','assets/images/samples/suit.svg','Noir suit (sample photo)',0),
   ('ZL-BRG-0301','assets/images/samples/barong.svg','Classic Barong Tagalog (sample photo)',0),
   ('ZL-FIL-0401','assets/images/samples/gown-champagne.svg','Maria Filipiniana (sample photo)',0),
   ('ZL-ACC-0501','assets/images/samples/accessories.svg','Eve clutch (sample photo)',0)
) as t(sku, url, alt, position) join public.products p on p.sku = t.sku;
