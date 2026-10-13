-- 0010: Fix the Vietnam Dress to the values provided by the owner, and
-- remove the leftover "Renzell" test product.
-- Safe to run more than once.

-- 1) Delete the junk test product (and its images, via ON DELETE CASCADE).
delete from public.products where sku = 'ZL-GWN-0232';

-- 2) Set the Vietnam Dress to the correct owner-provided values.
update public.products
set
  sub_category      = 'Mid Dress',
  fabric            = 'Lace',
  colors            = array['Floral Pink', 'Violet'],
  sizes             = array['M'],
  deposit_required  = 500.00,
  replacement_value = 3000.00,
  updated_at        = now()
where sku = 'ZL-VND-0601';
