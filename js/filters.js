/**
 * Zelean Gowns — Filters, Search & Sorting Logic
 * ---------------------------------------------------------------------------
 * Pure functions that operate on an array of product objects. Keeping this
 * separate from the DOM makes the catalogue logic easy to test and reuse in
 * both the public site and the admin dashboard.
 *
 * Expected product shape (a subset of what sample-data / Supabase returns):
 *   {
 *     id, sku, name, category, description, listing_type,
 *     rental_price, sale_price, sizes: [], colors: [],
 *     availability_status, is_published, images: [{ url, alt }]
 *   }
 */
window.ZeleanFilters = (function () {
  "use strict";

  /** Collect the distinct, sorted values for a given array field. */
  function distinctValues(products, field) {
    const set = new Set();
    products.forEach((p) => {
      const value = p[field];
      if (Array.isArray(value)) {
        value.forEach((v) => v && set.add(v));
      } else if (value) {
        set.add(value);
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }

  /** Case-insensitive text search across the main product fields. */
  function matchesSearch(product, query) {
    const q = String(query || "").trim().toLowerCase();
    if (!q) return true;
    const haystack = [
      product.name,
      product.category,
      product.sku,
      product.description,
      (product.colors || []).join(" "),
      (product.sizes || []).join(" "),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  }

  /** Does the product match a single filter dimension? */
  function matchesFilters(product, filters) {
    if (filters.category && product.category !== filters.category) {
      return false;
    }
    if (filters.size && !(product.sizes || []).includes(filters.size)) {
      return false;
    }
    if (filters.color && !(product.colors || []).includes(filters.color)) {
      return false;
    }
    if (filters.listingType) {
      const lt = product.listing_type;
      // "both" products should also match a request for "rent" or "sale".
      if (filters.listingType === "rent" && !(lt === "rent" || lt === "both")) {
        return false;
      }
      if (filters.listingType === "sale" && !(lt === "sale" || lt === "both")) {
        return false;
      }
      if (filters.listingType === "both" && lt !== "both") {
        return false;
      }
    }
    if (
      filters.availability &&
      product.availability_status !== filters.availability
    ) {
      return false;
    }
    return true;
  }

  /** Compute a sortable "starting price" for a product. */
  function startingPrice(product) {
    const prices = [];
    if (typeof product.rental_price === "number") prices.push(product.rental_price);
    if (typeof product.sale_price === "number") prices.push(product.sale_price);
    return prices.length ? Math.min.apply(null, prices) : Number.POSITIVE_INFINITY;
  }

  /** Sort a copy of the products array by the given key. */
  function sortProducts(products, sortKey) {
    const list = products.slice();
    switch (sortKey) {
      case "price-asc":
        list.sort((a, b) => startingPrice(a) - startingPrice(b));
        break;
      case "price-desc":
        list.sort((a, b) => startingPrice(b) - startingPrice(a));
        break;
      case "name-asc":
        list.sort((a, b) => String(a.name).localeCompare(String(b.name)));
        break;
      case "name-desc":
        list.sort((a, b) => String(b.name).localeCompare(String(a.name)));
        break;
      case "newest":
        list.sort(
          (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
        );
        break;
      case "featured":
      default:
        // Keep the original (curated) order.
        break;
    }
    return list;
  }

  /**
   * Apply search + filters + sorting in one pass.
   * @param {Array} products  full product list
   * @param {Object} filters  { search, category, size, color, listingType, availability }
   * @param {String} sortKey  one of the sortProducts keys
   */
  function applyAll(products, filters, sortKey) {
    const filtered = (products || []).filter(
      (p) => matchesSearch(p, filters.search) && matchesFilters(p, filters)
    );
    return sortProducts(filtered, sortKey);
  }

  return {
    distinctValues,
    matchesSearch,
    matchesFilters,
    startingPrice,
    sortProducts,
    applyAll,
  };
})();
