/**
 * Zelean Gowns — Catalogue Controller (Homepage)
 * ---------------------------------------------------------------------------
 * Wires the homepage catalogue: loads products (Supabase or sample), populates
 * the filter controls, applies search + filters + sorting, and renders the
 * responsive product grid with proper loading, error, and empty states.
 *
 * All product text is rendered with textContent (never innerHTML) so sample
 * and future imported data can never inject markup.
 */
window.ZeleanCatalogue = (function () {
  "use strict";

  const U = window.ZeleanUtils;
  const F = window.ZeleanFilters;

  let allProducts = [];
  let currentSort = "featured";
  let els = {};

  function cacheEls() {
    els = {
      grid: document.getElementById("product-grid"),
      search: document.getElementById("search-input"),
      category: document.getElementById("filter-category"),
      size: document.getElementById("filter-size"),
      color: document.getElementById("filter-color"),
      listing: document.getElementById("filter-listing"),
      sort: document.getElementById("sort-select"),
      clear: document.getElementById("clear-filters"),
      resultsCount: document.getElementById("results-count"),
      loading: document.getElementById("state-loading"),
      error: document.getElementById("state-error"),
      empty: document.getElementById("state-empty"),
      stateRegion: document.getElementById("catalogue-state"),
    };
  }

  function showState(state) {
    if (!els.loading) return;
    const states = { loading: els.loading, error: els.error, empty: els.empty };
    Object.values(states).forEach((el) => el && el.classList.add("hidden"));
    if (state === "results") {
      if (els.stateRegion) els.stateRegion.classList.add("hidden");
      return;
    }
    if (states[state]) {
      if (els.stateRegion) els.stateRegion.classList.remove("hidden");
      states[state].classList.remove("hidden");
    }
  }

  function populateSelect(select, values) {
    if (!select) return;
    while (select.options.length > 1) select.remove(1);
    values.forEach((v) => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      select.appendChild(opt);
    });
  }

  function populateFilters() {
    populateSelect(els.category, F.distinctValues(allProducts, "category"));
    populateSelect(els.size, F.distinctValues(allProducts, "sizes"));
    populateSelect(els.color, F.distinctValues(allProducts, "colors"));
  }

  function readFilters() {
    return {
      search: els.search ? els.search.value : "",
      category: els.category ? els.category.value : "",
      size: els.size ? els.size.value : "",
      color: els.color ? els.color.value : "",
      listingType: els.listing ? els.listing.value : "",
    };
  }
  /** Build a single product card element using safe DOM methods. */
  function buildCard(product) {
    const card = document.createElement("article");
    card.className = "product-card";
    card.setAttribute("data-category", product.category);

    const image = product.images && product.images[0];
    const link = document.createElement("a");
    link.className = "product-card__media";
    link.href = U.productHref(product);
    link.setAttribute("aria-label", "View details for " + product.name);

    const img = document.createElement("img");
    img.className = "product-card__img";
    img.loading = "lazy";
    img.src = image ? image.url : window.ZELEAN_CONFIG.site.fallbackImage;
    img.alt = image && image.alt ? image.alt : product.name + " photo";
    U.attachImageFallback(img);
    link.appendChild(img);

    const badge = document.createElement("span");
    badge.className = "product-card__badge";
    badge.textContent = U.listingLabel(product.listing_type);
    link.appendChild(badge);
    card.appendChild(link);

    const body = document.createElement("div");
    body.className = "product-card__body";

    const cat = document.createElement("p");
    cat.className = "product-card__category";
    cat.textContent = product.category;
    body.appendChild(cat);

    const name = document.createElement("h3");
    name.className = "product-card__name";
    name.textContent = product.name;
    body.appendChild(name);

    const price = document.createElement("p");
    price.className = "product-card__price";
    const priceParts = [];
    if (typeof product.rental_price === "number") {
      priceParts.push(U.formatPHP(product.rental_price) + " / rental");
    }
    if (typeof product.sale_price === "number") {
      priceParts.push(U.formatPHP(product.sale_price) + " to buy");
    }
    price.textContent = priceParts.length ? priceParts.join("  ·  ") : "Price on request";
    body.appendChild(price);

    if (product.availability_status && product.availability_status !== "available") {
      const avail = document.createElement("span");
      avail.className =
        "product-card__availability product-card__availability--" +
        product.availability_status;
      avail.textContent = U.availabilityLabel(product.availability_status);
      body.appendChild(avail);
    }

    const cta = document.createElement("a");
    cta.className = "btn btn-outline btn-sm";
    cta.href = U.productHref(product);
    cta.textContent = "View details";
    body.appendChild(cta);

    card.appendChild(body);
    return card;
  }

  function render(list) {
    if (!els.grid) return;
    els.grid.innerHTML = "";
    if (!list.length) {
      showState("empty");
      if (els.resultsCount) els.resultsCount.textContent = "0 items";
      return;
    }
    showState("results");
    const frag = document.createDocumentFragment();
    list.forEach((product) => frag.appendChild(buildCard(product)));
    els.grid.appendChild(frag);
    if (els.resultsCount) {
      els.resultsCount.textContent =
        list.length + (list.length === 1 ? " item" : " items");
    }
  }

  function apply() {
    const filters = readFilters();
    currentSort = els.sort ? els.sort.value : "featured";
    const results = F.applyAll(allProducts, filters, currentSort);
    render(results);
  }

  function clearFilters() {
    if (els.search) els.search.value = "";
    if (els.category) els.category.value = "";
    if (els.size) els.size.value = "";
    if (els.color) els.color.value = "";
    if (els.listing) els.listing.value = "";
    apply();
  }

  function bindEvents() {
    if (els.search) els.search.addEventListener("input", U.debounce(apply, 180));
    [els.category, els.size, els.color, els.listing, els.sort].forEach((el) => {
      if (el) el.addEventListener("change", apply);
    });
    if (els.clear) els.clear.addEventListener("click", clearFilters);
  }

  function showError(message) {
    if (!els.error) return;
    const msgEl = els.error.querySelector("[data-error-message]");
    if (msgEl) msgEl.textContent = message;
    showState("error");
  }

  async function load() {
    cacheEls();
    bindEvents();
    showState("loading");
    try {
      const result = await window.ZeleanData.fetchPublishedProducts();
      allProducts = result.products;
      populateFilters();
      apply();
    } catch (err) {
      console.error("Failed to load catalogue:", err);
      showError(
        "We couldn't load the catalogue right now. Please refresh the page or " +
          "try again later."
      );
    }
  }

  function init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", load);
    } else {
      load();
    }
  }

  return { init, load };
})();

