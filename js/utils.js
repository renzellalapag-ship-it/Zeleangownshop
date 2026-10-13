/**
 * Zelean Gowns — Shared Utilities
 * ---------------------------------------------------------------------------
 * Small helper functions reused across the public site and admin dashboard to
 * avoid duplicated logic. Kept framework-free and dependency-free.
 */
window.ZeleanUtils = (function () {
  "use strict";

  /** Escape a string so it is safe to insert as text/HTML. */
  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /** Create a DOM element from an HTML string, returning the first element. */
  function htmlToElement(html) {
    const template = document.createElement("template");
    template.innerHTML = String(html).trim();
    return template.content.firstElementChild;
  }

  /** Format a number as Philippine pesos, e.g. 500 -> "₱500". */
  function formatPHP(amount) {
    const currency =
      (window.ZELEAN_CONFIG && window.ZELEAN_CONFIG.site.currency) || "₱";
    if (amount == null || isNaN(amount)) return "";
    // Keep whole pesos clean; show decimals only when needed.
    const hasCents = Math.round(amount) !== Number(amount);
    const formatted = hasCents
      ? Number(amount).toFixed(2)
      : Number(amount).toLocaleString("en-PH");
    return currency + formatted;
  }

  /** Return a debounced version of fn that waits `wait` ms. */
  function debounce(fn, wait) {
    let timer = null;
    return function debounced(...args) {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => fn.apply(this, args), wait);
    };
  }

  /** Read a query-string parameter safely. */
  function getQueryParam(name) {
    try {
      return new URL(window.location.href).searchParams.get(name);
    } catch (e) {
      return null;
    }
  }

  /**
   * Build a product-detail href from a product id or slug.
   * Prefers slug when available for readable, shareable URLs.
   */
  function productHref(product, fromPath) {
    const id = product && (product.slug || product.id);
    const base = fromPath || "product.html";
    return base + "?id=" + encodeURIComponent(id);
  }

  /**
   * Attach a graceful fallback: if an <img> fails to load, swap to the
   * configured fallback image so broken images never show.
   */
  function attachImageFallback(imgEl) {
    const fallback =
      (window.ZELEAN_CONFIG && window.ZELEAN_CONFIG.site.fallbackImage) ||
      "assets/images/samples/fallback.svg";
    imgEl.addEventListener(
      "error",
      function onError() {
        if (imgEl.dataset.fallbackApplied) return;
        imgEl.dataset.fallbackApplied = "true";
        imgEl.src = fallback;
      },
      { once: false }
    );
  }

  /** Human label for a listing type. */
  function listingLabel(listingType) {
    switch (listingType) {
      case "rent":
        return "For Rent";
      case "sale":
        return "For Sale";
      case "both":
        return "Rent or Buy";
      default:
        return "Available";
    }
  }

  /** Human label for an availability status. */
  function availabilityLabel(status) {
    switch (status) {
      case "available":
        return "Available";
      case "unavailable":
        return "Currently Unavailable";
      case "maintenance":
        return "Under Maintenance";
      default:
        return "Status Unknown";
    }
  }

  return {
    escapeHtml,
    htmlToElement,
    formatPHP,
    debounce,
    getQueryParam,
    productHref,
    attachImageFallback,
    listingLabel,
    availabilityLabel,
  };
})();
