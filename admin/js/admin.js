/**
 * Zelean Admin — Dashboard Controller [DEMONSTRATION]
 * ---------------------------------------------------------------------------
 * Wires the mock dashboard: auth guard, stats, product table, search/filter,
 * and add/edit/delete actions using the in-memory store (admin-data.js).
 *
 * Product text is rendered with textContent to stay safe. This is a demo and
 * does not persist data or talk to Supabase.
 */
window.AdminDashboard = (function () {
  "use strict";

  const U = window.AdminUtils;
  let els = {};
  let query = "";
  let category = "";

  // The dashboard lives in /admin, one level below the site root, while sample
  // product images are stored as root-relative paths (e.g. "assets/...").
  // Prefix those with "../" so they resolve correctly from this page. Absolute
  // (http/https/data) and already-relative paths are left untouched.
  const FALLBACK_IMG = "../assets/images/samples/fallback.svg";
  function assetUrl(url) {
    if (!url) return FALLBACK_IMG;
    const s = String(url);
    if (/^(https?:)?\/\//i.test(s) || s.charAt(0) === "/" || s.indexOf("data:") === 0 || s.indexOf("../") === 0) {
      return s;
    }
    return "../" + s;
  }

  function cacheEls() {
    els = {
      stats: document.getElementById("stats"),
      rows: document.getElementById("product-rows"),
      search: document.getElementById("admin-search"),
      category: document.getElementById("admin-category"),
      clear: document.getElementById("admin-clear"),
      add: document.getElementById("add-product-btn"),
      logout: document.getElementById("logout-btn"),
      sidebar: document.getElementById("sidebar"),
      sidebarToggle: document.getElementById("sidebar-toggle"),
      backdrop: document.getElementById("admin-backdrop"),
    };
  }

  /** Open the mobile drawer + show its backdrop. */
  function openSidebar() {
    if (!els.sidebar) return;
    els.sidebar.classList.add("is-open");
    if (els.backdrop) els.backdrop.classList.add("is-visible");
  }

  /** Close the mobile drawer + hide its backdrop. */
  function closeSidebar() {
    if (!els.sidebar) return;
    els.sidebar.classList.remove("is-open");
    if (els.backdrop) els.backdrop.classList.remove("is-visible");
  }

  /** Toggle the mobile drawer open/closed. */
  function toggleSidebar() {
    if (els.sidebar && els.sidebar.classList.contains("is-open")) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }

  function computeStats(products) {
    return {
      total: products.length,
      published: products.filter((p) => p.is_published).length,
      unpublished: products.filter((p) => !p.is_published).length,
      unavailable: products.filter((p) => p.availability_status !== "available").length,
    };
  }

  function renderStats(products) {
    const s = computeStats(products);
    const cards = [
      { label: "Total Products", value: s.total },
      { label: "Published", value: s.published, mod: "success" },
      { label: "Unpublished", value: s.unpublished, mod: "warning" },
      { label: "Unavailable / Maintenance", value: s.unavailable, mod: "danger" },
    ];
    els.stats.innerHTML = "";
    cards.forEach(function (c) {
      const card = document.createElement("div");
      card.className = "stat-card" + (c.mod ? " stat-card--" + c.mod : "");
      const label = document.createElement("div");
      label.className = "stat-card__label";
      label.textContent = c.label;
      const value = document.createElement("div");
      value.className = "stat-card__value";
      value.textContent = String(c.value);
      card.appendChild(label);
      card.appendChild(value);
      els.stats.appendChild(card);
    });
  }

  function populateCategoryFilter(products) {
    if (!els.category) return;
    while (els.category.options.length > 1) els.category.remove(1);
    const cats = Array.from(new Set(products.map((p) => p.category))).sort();
    cats.forEach(function (c) {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      els.category.appendChild(opt);
    });
  }

  function matches(product) {
    const q = query.trim().toLowerCase();
    if (category && product.category !== category) return false;
    if (!q) return true;
    return [
      product.name,
      product.sku,
      product.category,
      (product.colors || []).join(" "),
      (product.sizes || []).join(" "),
    ]
      .join(" ")
      .toLowerCase()
      .includes(q);
  }

  function priceLabel(p) {
    const parts = [];
    if (typeof p.rental_price === "number") parts.push(U.formatPHP(p.rental_price) + " rent");
    if (typeof p.sale_price === "number") parts.push(U.formatPHP(p.sale_price) + " sale");
    return parts.length ? parts.join(" · ") : "—";
  }

  /** Show a loading placeholder row while products are fetched. */
  function renderLoading() {
    if (!els.rows) return;
    els.rows.innerHTML = "";
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 9;
    td.className = "empty-row";
    td.textContent = "Loading products…";
    tr.appendChild(td);
    els.rows.appendChild(tr);
  }

  /** Show a persistent error row if the initial product fetch fails. */
  function renderLoadError(err) {
    if (!els.rows) return;
    els.rows.innerHTML = "";
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 9;
    td.className = "empty-row";
    td.textContent =
      "Could not load products: " +
      (err && err.message ? err.message : "unknown error") +
      ". Check your connection and refresh the page.";
    tr.appendChild(td);
    els.rows.appendChild(tr);
  }

  function renderRows(products) {
    const list = products.filter(matches);
    els.rows.innerHTML = "";

    if (!list.length) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 9;
      td.className = "empty-row";
      td.textContent = products.length
        ? "No products match your search."
        : "No products yet. Click “+ Add Product” to create your first one.";
      tr.appendChild(td);
      els.rows.appendChild(tr);
      return;
    }

    list.forEach(function (p) {
      const tr = document.createElement("tr");

      const tdImg = document.createElement("td");
      const img = document.createElement("img");
      img.className = "cell-thumb";
      img.alt = p.name + " thumbnail";
      img.src = p.images && p.images[0] ? assetUrl(p.images[0].url) : FALLBACK_IMG;
      img.addEventListener("error", function () {
        img.src = FALLBACK_IMG;
      });
      tdImg.appendChild(img);
      tr.appendChild(tdImg);

      const tdName = document.createElement("td");
      const nameDiv = document.createElement("div");
      nameDiv.className = "cell-name";
      nameDiv.textContent = p.name;
      tdName.appendChild(nameDiv);
      tr.appendChild(tdName);

      const tdSku = document.createElement("td");
      tdSku.className = "cell-sku";
      tdSku.textContent = p.sku;
      tr.appendChild(tdSku);

      const tdCat = document.createElement("td");
      tdCat.textContent = p.category;
      tr.appendChild(tdCat);

      const tdType = document.createElement("td");
      tdType.textContent = p.listing_type;
      tr.appendChild(tdType);

      const tdPrice = document.createElement("td");
      tdPrice.textContent = priceLabel(p);
      tr.appendChild(tdPrice);

      const tdAvail = document.createElement("td");
      const badge = document.createElement("span");
      badge.className = "badge badge--" + p.availability_status;
      badge.textContent = p.availability_status;
      tdAvail.appendChild(badge);
      tr.appendChild(tdAvail);

      const tdStatus = document.createElement("td");
      const status = document.createElement("span");
      status.className = "badge " + (p.is_published ? "badge--published" : "badge--draft");
      status.textContent = p.is_published ? "Published" : "Draft";
      tdStatus.appendChild(status);
      tr.appendChild(tdStatus);

      const tdActions = document.createElement("td");
      const actions = document.createElement("div");
      actions.className = "row-actions";

      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "btn btn-outline btn-sm";
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", function () { editProduct(p.id); });
      actions.appendChild(editBtn);

      const toggleBtn = document.createElement("button");
      toggleBtn.type = "button";
      toggleBtn.className = "btn btn-outline btn-sm";
      toggleBtn.textContent = p.is_published ? "Unpublish" : "Publish";
      toggleBtn.addEventListener("click", function () {
        const nextState = !p.is_published;
        window.AdminData.update(p.id, { is_published: nextState })
          .then(function () {
            U.toast(nextState ? "Product published." : "Product unpublished.", "success");
          })
          .catch(function (err) {
            U.toast("Could not update status: " + (err && err.message ? err.message : "unknown error"), "error");
          });
      });
      actions.appendChild(toggleBtn);

      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "btn btn-danger btn-sm";
      delBtn.textContent = "Delete";
      delBtn.addEventListener("click", function () { deleteProduct(p); });
      actions.appendChild(delBtn);

      tdActions.appendChild(actions);
      tr.appendChild(tdActions);

      els.rows.appendChild(tr);
    });
  }

  function renderAll(products) {
    renderStats(products);
    renderRows(products);
  }


  function addProduct() {
    window.AdminProductForm.open(null, function (data) {
      window.AdminData.create(data)
        .then(function () { U.toast("Product added.", "success"); })
        .catch(function (err) {
          U.toast("Could not add product: " + (err && err.message ? err.message : "unknown error"), "error");
        });
    });
  }

  function editProduct(id) {
    const product = window.AdminData.get(id);
    if (!product) return;
    window.AdminProductForm.open(product, function (data) {
      window.AdminData.update(id, data)
        .then(function () { U.toast("Product updated.", "success"); })
        .catch(function (err) {
          U.toast("Could not update product: " + (err && err.message ? err.message : "unknown error"), "error");
        });
    });
  }

  function deleteProduct(product) {
    const ok = window.confirm(
      "Delete \"" + product.name + "\" (" + product.sku + ")? This cannot be undone."
    );
    if (!ok) return;
    window.AdminData.remove(product.id)
      .then(function () { U.toast("Product deleted.", "success"); })
      .catch(function (err) {
        U.toast("Could not delete product: " + (err && err.message ? err.message : "unknown error"), "error");
      });
  }

  function bindEvents() {
    if (els.search) {
      els.search.addEventListener("input", U.debounceLike(function () {
        query = els.search.value;
        renderRows(window.AdminData.all());
      }, 180));
    }
    if (els.category) {
      els.category.addEventListener("change", function () {
        category = els.category.value;
        renderRows(window.AdminData.all());
      });
    }
    if (els.clear) {
      els.clear.addEventListener("click", function () {
        query = "";
        category = "";
        if (els.search) els.search.value = "";
        if (els.category) els.category.value = "";
        renderRows(window.AdminData.all());
      });
    }
    if (els.add) els.add.addEventListener("click", addProduct);
    if (els.logout) {
      els.logout.addEventListener("click", function () {
        window.AdminAuth.signOut();
        window.location.replace("login.html");
      });
    }
    if (els.sidebarToggle) {
      els.sidebarToggle.addEventListener("click", toggleSidebar);
    }
    // Mobile: tap the dimmed backdrop to dismiss the drawer.
    if (els.backdrop) {
      els.backdrop.addEventListener("click", closeSidebar);
    }
    // Mobile: tapping a sidebar link should close the drawer behind you.
    if (els.sidebar) {
      els.sidebar.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closeSidebar);
      });
    }
    // Escape closes the drawer (nice on tablets with keyboards too).
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeSidebar();
    });
    // If the window grows to desktop width, make sure no stale open state remains.
    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) closeSidebar();
    });
  }

  function init() {
    // requireAuth() is async (checks Supabase session + admin_roles). Wait for it,
    // then boot the dashboard only if access is allowed; otherwise it redirects.
    window.AdminAuth.requireAuth().then(function (allowed) {
      if (!allowed) return;
      cacheEls();
      bindEvents();

      // Confirm to the user exactly who is signed in.
      window.AdminAuth.currentUser().then(function (u) {
        const line = document.getElementById("welcome-line");
        if (line && u && u.email) {
          line.textContent = "Signed in as " + u.email + " — manage your catalogue.";
        }
      });

      renderLoading();
      window.AdminData.onChange(function (products) {
        populateCategoryFilter(products);
        renderAll(products);
      });
      // load() is async and re-renders via onChange; handle failures clearly.
      window.AdminData.load().catch(function (err) {
        renderLoadError(err);
        U.toast(
          "Could not load products: " + (err && err.message ? err.message : "unknown error"),
          "error"
        );
      });
    });
  }

  return { init };
})();

// Lightweight debounce helper (local to the admin app).
window.AdminUtils.debounceLike = function (fn, wait) {
  let timer = null;
  return function () {
    const args = arguments;
    window.clearTimeout(timer);
    timer = window.setTimeout(function () { fn.apply(null, args); }, wait);
  };
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", window.AdminDashboard.init);
} else {
  window.AdminDashboard.init();
}

