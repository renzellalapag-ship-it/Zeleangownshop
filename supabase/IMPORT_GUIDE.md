# Zelean Catalogue Import Guide

This guide explains how to bring your **real** catalogue data (currently in a
Google Sheet) into Supabase, replacing the sample products shown on the site.

> **Golden rule:** Never overwrite real products with the sample data. Keep the
> sample rows (`is_published` demonstration items) in a separate spreadsheet or
> clearly delete them before importing real rows.

---

## CSV column reference

The template is at `supabase/import-template.csv`. Columns map to the
`products` table like this:

| CSV column            | Table column          | Notes |
|-----------------------|-----------------------|-------|
| `sku`                 | `sku`                 | Unique. Used to match images. |
| `name`                | `name`                | Product name. |
| `slug`                | `slug`                | URL-friendly, unique, lowercase-hyphenated. |
| `category`            | `category`            | e.g. Ballgowns, Men's Suits, Barong. |
| `sub_category`        | `sub_category`        | Optional finer grouping, e.g. Mid Dress. |
| `listing_type`        | `listing_type`        | One of `rent`, `sale`, `both`. |
| `rental_price`        | `rental_price`        | Number only (no ₱ or commas). Blank if N/A. |
| `sale_price`          | `sale_price`          | Number only. Blank if N/A. |
| `deposit_required`    | `deposit_required`    | Number only. Refundable rental deposit (₱). Blank if N/A. |
| `replacement_value`   | `replacement_value`   | Number only. Item replacement value (₱). Blank if N/A. |
| `rental_duration_days`| `rental_duration_days`| Whole number of days. Blank if N/A. |
| `sizes`               | `sizes`               | Pipe-separated: `S\|M\|L`. |
| `colors`              | `colors`              | Pipe-separated: `Blush\|Ivory`. |
| `fabric`              | `fabric`              | Optional fabric, e.g. Lace. |
| `availability_status` | `availability_status` | `available`, `unavailable`, or `maintenance`. |
| `is_published`        | `is_published`        | `true` or `false`. |
| `image_1..image_3`    | `product_images.url`  | File names matched by SKU (see step 6). |
| `description`         | `description`         | Full text. |

> The four optional columns (`sub_category`, `fabric`, `deposit_required`,
> `replacement_value`) were added in `supabase/migrations/0006_products_attributes.sql`.
> Run that migration **before** importing a CSV that includes these columns.

---

## The 10 steps

1. **Export the Google Sheet as CSV**
   File → Download → Comma-separated values (.csv).

2. **Inspect the original column names**
   Open the CSV and note the exact headers. Your sheet will not match the
   template exactly — that's expected.

3. **Map source columns to the schema**
   For each original column, decide which template column it becomes. If a
   source value doesn't fit (e.g. a combined "Price" column), split or clean it.

4. **Clean the data**
   - Prices: remove `₱`, commas, and text → keep numbers (e.g. `₱1,500` → `1500`).
   - Sizes/colors: use a single consistent separator, then convert to pipes (`|`).
   - Categories: standardise spelling (e.g. always "Men's Suits", not "mens suit").
   - Slugs: lowercase, spaces → hyphens, remove special characters.

5. **Identify duplicates**
   Sort by `sku` and look for repeats. Decide which row is correct and remove or
   fix the others. `sku` must be unique in the database.

6. **Match images to products by SKU**
   Name your image files with the SKU, e.g. `ZL-GWN-0001-01.jpg`,
   `ZL-GWN-0001-02.jpg`. Put each product's images in a folder named by SKU if
   that's easier.

7. **Upload images to Supabase Storage**
   Upload to the `zelean-products` bucket. Recommended path:
   `zelean-products/<product_id>/<sku>-01.jpg`. (You can also upload first and
   record the returned public URLs.) Copy each public URL into the
   `image_1..image_3` columns of your CSV.

8. **Import product records**
   Use the Supabase Table Editor (Import data from CSV) into `products`, then
   add rows to `product_images` for each image (one row per image, with
   `position` 0,1,2…). Run the import while signed in as an admin so RLS allows
   the write.

9. **Verify image links and product counts**
   - Compare the number of rows imported vs. rows in your CSV.
   - Open the public site and confirm images load and counts look right.

10. **Confirm before launch**
    Spot-check several products on the live site (name, price, sizes, images).
    Set `is_published = true` only for items ready to show. Then turn off the
    sample-data notice (`site.showSampleDataNotice = false` in `js/config.js`).

---

## Safety checklist

- [ ] Real rows use unique SKUs that do not collide with the `sample-` ids.
- [ ] Prices contain no currency symbols or thousands separators.
- [ ] `sizes`/`colors` use pipe (`|`) separators, not commas (commas break CSV).
- [ ] Every image URL is a Supabase Storage public URL, **not** a Google Drive
      sharing link (Drive links cannot be used directly as image sources).
- [ ] No private Google Drive files or credentials are shared anywhere.
- [ ] `is_published` is `false` until you've verified each product.

> If you later build an automated CSV importer, it must validate every row and
> produce an error report — never silently discard invalid rows.
