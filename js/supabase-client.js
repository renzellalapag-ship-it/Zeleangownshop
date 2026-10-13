/**
 * Zelean Gowns — Data Access Layer
 * ---------------------------------------------------------------------------
 * Single place that decides WHERE catalogue data comes from:
 *
 *  1. If Supabase is enabled in config AND the client loads successfully,
 *     products are fetched from the `products` + `product_images` tables.
 *     Only PUBLISHED products are returned to the public site (enforced by
 *     Row Level Security on the database, and double-checked here).
 *
 *  2. Otherwise (default for local development), the site falls back to the
 *     local sample data in js/sample-data.js so the catalogue always works.
 *
 * The site must "fail safely": any error results in a clear error state in
 * the UI rather than a blank page. No secret/service-role key is ever used
 * here — only the publishable (anon) key from config.
 */

window.ZeleanData = (function () {
  "use strict";

  let _client = null;
  let _usingSupabase = false;

  /** True if Supabase is switched on in config with the minimum values set. */
  function supabaseConfigured() {
    const s = window.ZELEAN_CONFIG && window.ZELEAN_CONFIG.supabase;
    return Boolean(
      s &&
        s.enabled &&
        s.url &&
        s.publishableKey &&
        !/YOUR-/.test(s.url) &&
        !/YOUR-/.test(s.publishableKey)
    );
  }

  /** Lazily create the Supabase client (only if the library is present). */
  function getClient() {
    if (_client) return _client;
    if (!supabaseConfigured()) return null;
    if (typeof window.supabase === "undefined" || !window.supabase.createClient) {
      // Library not loaded — fail safe by returning null (caller uses samples).
      return null;
    }
    _client = window.supabase.createClient(
      window.ZELEAN_CONFIG.supabase.url,
      window.ZELEAN_CONFIG.supabase.publishableKey
    );
    _usingSupabase = true;
    return _client;
  }

  function usingSupabase() {
    return _usingSupabase;
  }

  /** Normalise a DB product row (with joined images) to the app shape. */
  function normaliseProduct(row) {
    const images = Array.isArray(row.product_images)
      ? row.product_images
          .slice()
          .sort((a, b) => (a.position || 0) - (b.position || 0))
          .map((img) => ({ url: img.url, alt: img.alt || row.name }))
      : [];
    return {
      id: row.id,
      sku: row.sku,
      slug: row.slug,
      name: row.name,
      category: row.category,
      description: row.description || "",
      listing_type: row.listing_type,
      rental_price: row.rental_price,
      sale_price: row.sale_price,
      rental_duration_days: row.rental_duration_days,
      sizes: row.sizes || [],
      colors: row.colors || [],
      availability_status: row.availability_status,
      is_published: row.is_published,
      created_at: row.created_at,
      updated_at: row.updated_at,
      images: images.length
        ? images
        : [{ url: window.ZELEAN_CONFIG.site.fallbackImage, alt: row.name }],
    };
  }

  /**
   * Fetch all PUBLISHED products for the public catalogue.
   * Returns { source, products } or throws on a real Supabase error so the
   * caller can show an error state.
   */
  async function fetchPublishedProducts() {
    const client = getClient();
    if (!client) {
      // Local fallback: sample data, only published items, in original order.
      const products = (window.ZELEAN_SAMPLE_PRODUCTS || []).filter(
        (p) => p.is_published
      );
      return { source: "sample", products };
    }

    const s = window.ZELEAN_CONFIG.supabase;
    const { data, error } = await client
      .from(s.productsTable)
      .select(
        "*, product_images(id, url, alt, position)"
      )
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }
    return {
      source: "supabase",
      products: (data || []).map(normaliseProduct),
    };
  }

  /**
   * Fetch a single published product by id OR slug (used by product.html).
   * Falls back to sample data locally. Returns the product or null.
   */
  async function fetchPublishedProduct(idOrSlug) {
    const key = String(idOrSlug || "");
    const client = getClient();

    if (!client) {
      const found = (window.ZELEAN_SAMPLE_PRODUCTS || []).find(
        (p) =>
          p.is_published &&
          (String(p.id) === key || String(p.slug) === key || String(p.sku) === key)
      );
      return found ? { source: "sample", product: found } : null;
    }

    const s = window.ZELEAN_CONFIG.supabase;
    const { data, error } = await client
      .from(s.productsTable)
      .select("*, product_images(id, url, alt, position)")
      .eq("is_published", true)
      .or("id.eq." + key + ",slug.eq." + key + ",sku.eq." + key)
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }
    if (!data) return null;
    return { source: "supabase", product: normaliseProduct(data) };
  }

  return {
    supabaseConfigured,
    usingSupabase,
    getClient,
    fetchPublishedProducts,
    fetchPublishedProduct,
    normaliseProduct,
  };
})();
