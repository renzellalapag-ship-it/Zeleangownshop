/**
 * Zelean Gowns — Product Details Controller
 * Powers product.html?id=... Loads a product (Supabase or sample) and renders
 * the detail view: multi-image gallery, prices, sizes, colours, duration,
 * availability, and the Messenger inquiry button. All text uses textContent.
 */
window.ZeleanProductDetails = (function () {
  "use strict";

  const U = window.ZeleanUtils;
  let product = null;
  let els = {};

  function cacheEls() {
    els = {
      loading: document.getElementById("state-loading"),
      error: document.getElementById("state-error"),
      notFound: document.getElementById("state-not-found"),
      content: document.getElementById("product-content"),
      galleryMain: document.getElementById("gallery-main-image"),
      galleryThumbs: document.getElementById("gallery-thumbs"),
      category: document.getElementById("detail-category"),
      name: document.getElementById("detail-name"),
      sku: document.getElementById("detail-sku"),
      description: document.getElementById("detail-description"),
      priceBlock: document.getElementById("detail-prices"),
      sizes: document.getElementById("detail-sizes"),
      colors: document.getElementById("detail-colors"),
      duration: document.getElementById("detail-duration"),
      availability: document.getElementById("detail-availability"),
      inquiry: document.getElementById("detail-inquiry"),
    };
  }

  function showState(state) {
    const map = { loading: els.loading, error: els.error, notFound: els.notFound };
    Object.values(map).forEach((el) => el && el.classList.add("hidden"));
    if (state === "ready") {
      if (els.content) els.content.classList.remove("hidden");
      return;
    }
    if (els.content) els.content.classList.add("hidden");
    if (map[state]) map[state].classList.remove("hidden");
  }

  function setGallery() {
    const images =
      product.images && product.images.length
        ? product.images
        : [{ url: window.ZELEAN_CONFIG.site.fallbackImage, alt: product.name }];
    els.galleryMain.innerHTML = "";
    els.galleryThumbs.innerHTML = "";

    const mainImg = document.createElement("img");
    mainImg.className = "detail-gallery__main-img";
    mainImg.alt = images[0].alt || product.name + " photo";
    mainImg.src = images[0].url;
    U.attachImageFallback(mainImg);
    els.galleryMain.appendChild(mainImg);

    if (images.length > 1) {
      images.forEach((img, index) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className =
          "detail-gallery__thumb" + (index === 0 ? " is-active" : "");
        btn.setAttribute("aria-label", "View image " + (index + 1));
        const thumbImg = document.createElement("img");
        thumbImg.src = img.url;
        thumbImg.alt = img.alt || product.name + " thumbnail " + (index + 1);
        U.attachImageFallback(thumbImg);
        btn.appendChild(thumbImg);
        btn.addEventListener("click", () => {
          mainImg.src = img.url;
          mainImg.alt = img.alt || product.name + " photo";
          delete mainImg.dataset.fallbackApplied;
          els.galleryThumbs
            .querySelectorAll(".detail-gallery__thumb")
            .forEach((t) => t.classList.remove("is-active"));
          btn.classList.add("is-active");
        });
        els.galleryThumbs.appendChild(btn);
      });
    }
  }

  function renderChips(container, values) {
    container.innerHTML = "";
    if (!values || !values.length) {
      const span = document.createElement("span");
      span.className = "chip chip--muted";
      span.textContent = "Not specified";
      container.appendChild(span);
      return;
    }
    values.forEach((v) => {
      const span = document.createElement("span");
      span.className = "chip";
      span.textContent = v;
      container.appendChild(span);
    });
  }

  function renderPrices() {
    els.priceBlock.innerHTML = "";
    const rows = [];
    if (typeof product.rental_price === "number") {
      rows.push({ label: "Rental price", value: U.formatPHP(product.rental_price) });
    }
    if (typeof product.sale_price === "number") {
      rows.push({ label: "Sale price", value: U.formatPHP(product.sale_price) });
    }
    if (!rows.length) {
      const p = document.createElement("p");
      p.className = "detail-price__note";
      p.textContent = "Please inquire for pricing.";
      els.priceBlock.appendChild(p);
      return;
    }
    rows.forEach((r) => {
      const line = document.createElement("p");
      line.className = "detail-price__line";
      const label = document.createElement("span");
      label.className = "detail-price__label";
      label.textContent = r.label;
      const value = document.createElement("span");
      value.className = "detail-price__value";
      value.textContent = r.value;
      line.appendChild(label);
      line.appendChild(value);
      els.priceBlock.appendChild(line);
    });
  }

  function render() {
    document.title = product.name + " — Zelean Gowns";
    if (els.category) els.category.textContent = product.category;
    if (els.name) els.name.textContent = product.name;
    if (els.sku) els.sku.textContent = product.sku;
    if (els.description) els.description.textContent = product.description || "";
    renderPrices();
    setGallery();
    renderChips(els.sizes, product.sizes);
    renderChips(els.colors, product.colors);
    if (els.duration) {
      els.duration.textContent =
        typeof product.rental_duration_days === "number"
          ? product.rental_duration_days + "-day rental"
          : "Not applicable";
    }
    if (els.availability) {
      els.availability.textContent = U.availabilityLabel(product.availability_status);
      els.availability.className =
        "availability-badge availability-badge--" + product.availability_status;
    }
    window.ZeleanMessenger.renderInquiry(els.inquiry, product);
    showState("ready");
  }

  function showError(message) {
    if (!els.error) return;
    const msgEl = els.error.querySelector("[data-error-message]");
    if (msgEl) msgEl.textContent = message;
    showState("error");
  }

  async function load() {
    cacheEls();
    const id = U.getQueryParam("id");
    if (!id) {
      showState("notFound");
      return;
    }
    showState("loading");
    try {
      const result = await window.ZeleanData.fetchPublishedProduct(id);
      if (!result || !result.product) {
        showState("notFound");
        return;
      }
      product = result.product;
      render();
    } catch (err) {
      console.error("Failed to load product:", err);
      showError(
        "We couldn't load this product right now. Please refresh the page or " +
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

