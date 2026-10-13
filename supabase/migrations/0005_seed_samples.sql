-- ===========================================================================
-- Zelean Gowns — Seed Sample Products
-- ---------------------------------------------------------------------------
-- File: supabase/migrations/0005_seed_samples.sql
--
-- Inserts the 9 sample catalogue items (the four named gowns + suit, barong,
-- Filipiniana, cocktail dress, and clutch) into the `products` table and
-- their placeholder images into `product_images`. These are the SAME items
-- shown locally in js/sample-data.js.
--
-- HOW TO RUN
--   Supabase Dashboard -> SQL Editor -> New query -> paste this file -> Run.
--   Running it in the SQL Editor uses the postgres role, so it works even
--   though normal RLS only allows admins to write.
--
-- SAFE TO RE-RUN: it first deletes any existing rows with these sample SKUs
-- (their images cascade-delete), then re-inserts. Re-running simply resets
-- these 9 samples to this default set.
--
-- TO REMOVE THE SAMPLES LATER:
--   delete from public.products where sku like 'ZL-%';
-- ===========================================================================

-- 1) Remove any previous copies of these sample rows (images cascade-delete).
delete from public.products
where sku in (
  'ZL-GWN-0001','ZL-GWN-0002','ZL-GWN-0003','ZL-GWN-0004',
  'ZL-CKT-0101','ZL-SUT-0201','ZL-BRG-0301','ZL-FIL-0401','ZL-ACC-0501'
);

-- 2) Insert the 9 products.
insert into public.products
  (sku, name, slug, category, description, listing_type,
   rental_price, sale_price, rental_duration_days, sizes, colors,
   availability_status, is_published, created_at, updated_at)
values
  ('ZL-GWN-0001','Adelie','adelie','Ballgowns','SAMPLE DESCRIPTION: A graceful floor-length ballgown with a fitted bodice and full skirt, ideal for debut, pageant, or formal ball occasions. This is placeholder text and will be replaced with the real product details from the Zelean catalogue.','rent',500,NULL,3,'{XS,S,M,L}','{Blush,Ivory}','available',true,'2024-01-01T00:00:00Z','2024-01-01T00:00:00Z'),
  ('ZL-GWN-0002','Arielle','arielle','Long Gowns','SAMPLE DESCRIPTION: An elegant long gown with a soft drape and flowing silhouette, suited to evening events and formal receptions. This is placeholder text pending the real catalogue details.','rent',500,NULL,3,'{S,M,L}','{Champagne}','available',true,'2024-01-02T00:00:00Z','2024-01-02T00:00:00Z'),
  ('ZL-GWN-0003','Aurelia','aurelia','Mermaid Gowns','SAMPLE DESCRIPTION: A sophisticated mermaid-cut gown that follows the body''s lines before flaring gently at the hem. Placeholder text for demonstration until real details are imported.','rent',500,NULL,3,'{S,M}','{Mauve,Champagne}','available',true,'2024-01-03T00:00:00Z','2024-01-03T00:00:00Z'),
  ('ZL-GWN-0004','Celestia','celestia','Night Gowns','SAMPLE DESCRIPTION: A refined night gown with a flattering neckline and sweeping skirt, perfect for gala nights and formal dinners. This is sample content and will be updated with real information.','rent',500,NULL,3,'{XS,S,M,L,XL}','{Ivory,Mauve}','available',true,'2024-01-04T00:00:00Z','2024-01-04T00:00:00Z'),
  ('ZL-CKT-0101','Lila Cocktail Dress','lila-cocktail-dress','Cocktail Dresses','SAMPLE DESCRIPTION: A knee-length cocktail dress with a flattering cut, ideal for semi-formal gatherings and celebrations. Placeholder text for demonstration only.','both',500,2500,3,'{S,M,L}','{Blush,Black}','available',true,'2024-02-01T00:00:00Z','2024-02-01T00:00:00Z'),
  ('ZL-SUT-0201','Noir Men''s Suit','noir-mens-suit','Men''s Suits','SAMPLE DESCRIPTION: A classic tailored men''s suit suitable for weddings and formal events. Placeholder description to be replaced with real details.','rent',1500,NULL,3,'{S,M,L,XL}','{Black,Navy}','available',true,'2024-02-05T00:00:00Z','2024-02-05T00:00:00Z'),
  ('ZL-BRG-0301','Classic Barong Tagalog','classic-barong-tagalog','Barong','SAMPLE DESCRIPTION: A traditional Barong Tagalog, appropriate for Filipino formal occasions such as weddings and receptions. Sample text only.','both',800,3500,3,'{S,M,L,XL}','{White,Ivory}','available',true,'2024-02-10T00:00:00Z','2024-02-10T00:00:00Z'),
  ('ZL-FIL-0401','Maria Filipiniana','maria-filipiniana','Filipiniana','SAMPLE DESCRIPTION: An elegant Filipiniana gown inspired by traditional Filipino dress, ideal for cultural events and formal celebrations. Placeholder description.','rent',1200,NULL,3,'{S,M,L}','{Ivory,Champagne}','maintenance',true,'2024-02-15T00:00:00Z','2024-02-15T00:00:00Z'),
  ('ZL-ACC-0501','Eve Evening Clutch','eve-evening-clutch','Bags & Accessories','SAMPLE DESCRIPTION: A refined evening clutch to complete a formal look. Sample accessory item for demonstration of the accessories category.','sale',NULL,900,NULL,'{One Size}','{Champagne,Brown}','available',true,'2024-02-20T00:00:00Z','2024-02-20T00:00:00Z');

-- 3) Insert placeholder images for each product (matched by SKU, position order).
--    These point at the local SVG placeholders, which resolve correctly on the
--    public site (e.g. https://<site>/assets/images/samples/gown-rose.svg).
insert into public.product_images (product_id, url, alt, position)
select p.id, t.url, t.alt, t.position
from (
  values
    -- Adelie
    ('ZL-GWN-0001','assets/images/samples/gown-rose.svg','Adelie ballgown — front view (sample photo)',0),
    ('ZL-GWN-0001','assets/images/samples/gown-champagne.svg','Adelie ballgown — alternate view (sample photo)',1),
    -- Arielle
    ('ZL-GWN-0002','assets/images/samples/gown-champagne.svg','Arielle long gown — front view (sample photo)',0),
    ('ZL-GWN-0002','assets/images/samples/gown-rose.svg','Arielle long gown — alternate view (sample photo)',1),
    -- Aurelia
    ('ZL-GWN-0003','assets/images/samples/gown-mauve.svg','Aurelia mermaid gown — front view (sample photo)',0),
    ('ZL-GWN-0003','assets/images/samples/gown-champagne.svg','Aurelia mermaid gown — alternate view (sample photo)',1),
    -- Celestia
    ('ZL-GWN-0004','assets/images/samples/gown-champagne.svg','Celestia night gown — front view (sample photo)',0),
    ('ZL-GWN-0004','assets/images/samples/gown-mauve.svg','Celestia night gown — alternate view (sample photo)',1),
    -- Lila
    ('ZL-CKT-0101','assets/images/samples/gown-rose.svg','Lila cocktail dress (sample photo)',0),
    -- Noir Suit
    ('ZL-SUT-0201','assets/images/samples/suit.svg','Noir men''s suit (sample photo)',0),
    -- Barong
    ('ZL-BRG-0301','assets/images/samples/barong.svg','Classic Barong Tagalog (sample photo)',0),
    -- Maria Filipiniana
    ('ZL-FIL-0401','assets/images/samples/gown-champagne.svg','Maria Filipiniana (sample photo)',0),
    -- Eve Clutch
    ('ZL-ACC-0501','assets/images/samples/accessories.svg','Eve evening clutch (sample photo)',0)
) as t(sku, url, alt, position)
join public.products p on p.sku = t.sku;

-- 4) Quick check — should list 9 products.
-- select sku, name, category, listing_type, is_published from public.products order by sku;
