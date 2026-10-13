/**
 * Zelean Admin — Mock Data Store (DEMONSTRATION)
 * ---------------------------------------------------------------------------
 * An in-memory product store used by the demo dashboard. It is seeded from the
 * public sample data (../js/sample-data.js) but lives entirely in this admin
 * page's memory — it does NOT touch Supabase or the real catalogue.
 *
 * When Supabase is configured, replace the async methods here with real
 * `supabase.from('products')...` calls guarded by admin authentication + RLS.
 * The dashboard (admin.js) only depends on this module's interface, so the UI
 * does not need to change when you swap the implementation.
 */
window.AdminData = (function () {
  "use strict";

  let products = [];
  const listeners = [];

  function notify() {
    listeners.forEach((fn) => {
      try { fn(products.slice()); } catch (e) { console.error(e); }
    });
  }

  /** Deep clone so the demo store never mutates the shared sample data. */
  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  /** Seed the store from the public sample products (deep-cloned). */
  function load() {
    const source = window.ZELEAN_SAMPLE_PRODUCTS || [];
    products = source.map(clone);
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

  /** Create a product. Ensures a stable id/slug and timestamps. */
  function create(data) {
    const now = new Date().toISOString();
    const record = Object.assign({}, data, {
      id: data.id || window.AdminUtils.uid("prod"),
      slug: data.slug || window.AdminUtils.slugify(data.name),
      created_at: now,
      updated_at: now,
      images: Array.isArray(data.images) ? data.images : [],
    });
    products.unshift(record);
    notify();
    return clone(record);
  }

  /** Update an existing product by id. */
  function update(id, data) {
    const index = products.findIndex((p) => String(p.id) === String(id));
    if (index === -1) return null;
    const updated = Object.assign({}, products[index], data, {
      updated_at: new Date().toISOString(),
    });
    products[index] = updated;
    notify();
    return clone(updated);
  }

  /** Delete a product by id. */
  function remove(id) {
    const index = products.findIndex((p) => String(p.id) === String(id));
    if (index === -1) return false;
    products.splice(index, 1);
    notify();
    return true;
  }

  /** Reset back to the original sample data. */
  function reset() {
    load();
  }

  return { load, onChange, all, get, create, update, remove, reset };
})();
