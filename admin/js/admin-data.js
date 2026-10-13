/**
 * Zelean Admin — Data Store (Supabase-backed)
 * ---------------------------------------------------------------------------
 * Reads and writes the real catalogue in Supabase (`products` +
 * `product_images`). Access is allowed only for signed-in admins, enforced by
 * Row Level Security (see supabase/migrations/0001_init.sql + 0004_admin_read.sql).
 *
 * Interface (unchanged from the demo store so the dashboard UI need not change):
 *   load()            async  — fetch all products (published + drafts) from DB
 *   all()             sync   — return the cached product list
 *   get(id)           sync   — return one cached product (clone) or null
 *   create(data)      async  — insert a product (+ its images), returns record
 *   update(id, data)  async  — update a product (+ replace its images)
 *   remove(id)        async  — delete a product (images cascade)
 *   onChange(fn)      — register a listener fired after every refresh
 *
 * `all()` / `get()` read from an in-memory cache refreshed after each mutation,
 * so the dashboard can keep rendering synchronously.
 */
window.AdminData = (function () {
  "use strict";

  const PRODUCTS = () =>
    (window.ZELEAN_CONFIG.supabase.productsTable) || "products";
  const IMAGES = () =>
    (window.ZELEAN_CONFIG.supabase.productImagesTable) || "product_images";

  let products = [];        // cache used by the synchronous all()/get()
  const listeners = [];

  /** The authenticated Supabase client (from admin-auth.js). */
  function client() {
    return window.AdminAuth && window.AdminAuth.getClient
      ? window.AdminAuth.getClient()
      : null;
  }

  function isReady() {
    return Boolean(client());
  }

  function notify() {
    const snapshot = products.slice();
    listeners.forEach((fn) => {
      try { fn(snapshot); } catch (e) { console.error(e); }
    });
  }

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  /** Map a DB row (with joined product_images) to the app shape. */
  function mapRow(row) {
    const images = Array.isArray(row.product_images)
      ? row.product_images
          .slice()
          .sort((a, b) => (a.position || 0) - (b.position || 0))
          .map((img) => ({ url: img.url, alt: img.alt || "" }))
      : [];
    return {
      id: row.id,
      sku: row.sku,
      slug: row.slug,
      name: row.name,
      category: row.category,
      sub_category: row.sub_category || "",
      description: row.description || "",
      listing_type: row.listing_type,
      rental_price: row.rental_price,
      sale_price: row.sale_price,
      deposit_required: row.deposit_required,
      replacement_value: row.replacement_value,
      rental_duration_days: row.rental_duration_days,
      sizes: row.sizes || [],
      colors: row.colors || [],
      fabric: row.fabric || "",
      availability_status: row.availability_status,
      is_published: row.is_published,
      created_at: row.created_at,
      updated_at: row.updated_at,
      images: images,
    };
  }

  const SELECT = "*, product_images(id, url, alt, position)";

  /** Fetch all products from Supabase and refresh the cache. */
  async function load() {
    const sb = client();
    if (!sb) {
      // Not configured — fall back to the sample data so the UI is never blank.
      products = (window.ZELEAN_SAMPLE_PRODUCTS || []).map(clone);
      notify();
      return products.slice();
    }
    const { data, error } = await sb
      .from(PRODUCTS())
      .select(SELECT)
      .order("created_at", { ascending: false });
    if (error) throw error;
    products = (data || []).map(mapRow);
    notify();
    return products.slice();
  }

  function onChange(fn) {
    listeners.push(fn);
  }

  function all() {
    return products.slice();
  }

  function get(id) {
    const found = products.find((p) => String(p.id) === String(id));
    return found ? clone(found) : null;
  }

  /** Turn form data into a products-table row (without images). */
  function toProductRow(data) {
    return {
      sku: data.sku,
      name: data.name,
      slug: data.slug || window.AdminUtils.slugify(data.name),
      category: data.category,
      sub_category: data.sub_category || null,
      description: data.description || "",
      listing_type: data.listing_type,
      rental_price: data.rental_price,
      sale_price: data.sale_price,
      deposit_required: data.deposit_required,
      replacement_value: data.replacement_value,
      rental_duration_days: data.rental_duration_days,
      sizes: data.sizes || [],
      colors: data.colors || [],
      fabric: data.fabric || null,
      availability_status: data.availability_status || "available",
      is_published: Boolean(data.is_published),
    };
  }

  /** Replace all image rows for a product with the given list. */
  async function replaceImages(sb, productId, images) {
    const { error: delErr } = await sb
      .from(IMAGES())
      .delete()
      .eq("product_id", productId);
    if (delErr) throw delErr;

    const list = (images || []).filter((img) => img && img.url);
    if (!list.length) return;

    const rows = list.map((img, index) => ({
      product_id: productId,
      url: img.url,
      alt: img.alt || "",
      position: index,
    }));
    const { error: insErr } = await sb.from(IMAGES()).insert(rows);
    if (insErr) throw insErr;
  }

  /** Insert a product, then its images. Returns the created record. */
  async function create(data) {
    const sb = client();
    if (!sb) throw new Error("Supabase is not configured.");

    const { data: inserted, error } = await sb
      .from(PRODUCTS())
      .insert(toProductRow(data))
      .select()
      .single();
    if (error) throw error;

    await replaceImages(sb, inserted.id, data.images || []);
    await load();
    return get(inserted.id);
  }

  /** Update a product row, then replace its images if provided. */
  async function update(id, data) {
    const sb = client();
    if (!sb) throw new Error("Supabase is not configured.");

    // A partial update (e.g. publish toggle) may only include some fields.
    const patch = {};
    const rowKeys = [
      "sku", "name", "slug", "category", "sub_category", "description", "listing_type",
      "rental_price", "sale_price", "deposit_required", "replacement_value",
      "rental_duration_days", "sizes", "colors", "fabric",
      "availability_status", "is_published",
    ];
    rowKeys.forEach((k) => {
      if (Object.prototype.hasOwnProperty.call(data, k)) patch[k] = data[k];
    });

    if (Object.keys(patch).length) {
      const { error } = await sb.from(PRODUCTS()).update(patch).eq("id", id);
      if (error) throw error;
    }

    // If images were supplied in the payload, replace the image set.
    if (Object.prototype.hasOwnProperty.call(data, "images")) {
      await replaceImages(sb, id, data.images || []);
    }

    await load();
    return get(id);
  }

  /** Delete a product (its images are removed by ON DELETE CASCADE). */
  async function remove(id) {
    const sb = client();
    if (!sb) throw new Error("Supabase is not configured.");
    const { error } = await sb.from(PRODUCTS()).delete().eq("id", id);
    if (error) throw error;
    await load();
    return true;
  }

  /** Reset back to a fresh fetch from the database. */
  async function reset() {
    return load();
  }

  return { isReady, load, onChange, all, get, create, update, remove, reset };
})();
