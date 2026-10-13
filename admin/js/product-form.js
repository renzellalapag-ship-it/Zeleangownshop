/**
 * Zelean Admin — Product Form (modal) [DEMONSTRATION]
 * ---------------------------------------------------------------------------
 * Renders an add/edit product modal with validation, image URL management,
 * sizes/colours, pricing, listing type, availability, and publish toggle.
 *
 * In this demo build, "image upload" is represented by pasting image URLs
 * (e.g. local sample paths). When Supabase is configured, the image section
 * will upload files to the zelean-products Storage bucket and store metadata
 * rows in product_images.
 *
 * All rendering uses DOM methods / textContent where product data is involved.
 */
window.AdminProductForm = (function () {
  "use strict";

  const U = window.AdminUtils;
  let root = null;
  let onSave = null;

  function close() {
    if (root) {
      root.innerHTML = "";
      root.classList.add("hidden");
    }
    document.body.style.overflow = "";
  }

  function field(config) {
    const wrap = document.createElement("div");
    wrap.className = "field" + (config.full ? " field--full" : "");
    const id = "pf-" + config.name;
    const label = document.createElement("label");
    label.setAttribute("for", id);
    label.textContent = config.label + (config.required ? " " : "");
    if (config.required) {
      const req = document.createElement("span");
      req.className = "req";
      req.textContent = "*";
      label.appendChild(req);
    }
    wrap.appendChild(label);

    let input;
    if (config.type === "textarea") {
      input = document.createElement("textarea");
      input.className = "textarea";
    } else {
      input = document.createElement("input");
      input.className = "input";
      input.type = config.type || "text";
    }
    input.id = id;
    input.name = config.name;
    if (config.placeholder) input.placeholder = config.placeholder;
    wrap.appendChild(input);

    if (config.hint) {
      const hint = document.createElement("span");
      hint.className = "field-hint";
      hint.textContent = config.hint;
      wrap.appendChild(hint);
    }
    const err = document.createElement("span");
    err.className = "field-error hidden";
    err.setAttribute("data-error-for", config.name);
    wrap.appendChild(err);
    return { wrap, input };
  }

  function selectField(config, options) {
    const wrap = document.createElement("div");
    wrap.className = "field" + (config.full ? " field--full" : "");
    const id = "pf-" + config.name;
    const label = document.createElement("label");
    label.setAttribute("for", id);
    label.textContent = config.label;
    wrap.appendChild(label);
    const select = document.createElement("select");
    select.className = "select";
    select.id = id;
    select.name = config.name;
    options.forEach(function (o) {
      const opt = document.createElement("option");
      opt.value = o.value;
      opt.textContent = o.label;
      select.appendChild(opt);
    });
    wrap.appendChild(select);
    return { wrap, input: select };
  }

  /** Collect + validate the form, returning { ok, data } or { ok, errors }. */
  function readForm(modal) {
    const val = function (name) {
      const el = modal.querySelector('[name="' + name + '"]');
      return el ? el.value.trim() : "";
    };
    const errors = {};

    const name = val("name");
    if (!name) errors.name = "Product name is required.";

    const sku = val("sku");
    if (!sku) errors.sku = "SKU is required.";

    const category = val("category");
    if (!category) errors.category = "Category is required.";

    const description = val("description");
    if (!description) errors.description = "Description is required.";

    const listingType = val("listing_type");

    const parseNum = function (v) {
      if (!v) return null;
      const n = Number(String(v).replace(/[^0-9.]/g, ""));
      return isNaN(n) ? NaN : n;
    };

    const rentalPrice = parseNum(val("rental_price"));
    const salePrice = parseNum(val("sale_price"));

    if ((listingType === "rent" || listingType === "both") && (rentalPrice === null || isNaN(rentalPrice))) {
      errors.rental_price = "Rental price is required for rent listings.";
    }
    if ((listingType === "sale" || listingType === "both") && (salePrice === null || isNaN(salePrice))) {
      errors.sale_price = "Sale price is required for sale listings.";
    }
    if (rentalPrice !== null && isNaN(rentalPrice)) errors.rental_price = "Enter a valid number.";
    if (salePrice !== null && isNaN(salePrice)) errors.sale_price = "Enter a valid number.";

    const duration = val("rental_duration_days");
    if ((listingType === "rent" || listingType === "both") && duration) {
      const d = Number(duration);
      if (isNaN(d) || d <= 0) errors.rental_duration_days = "Enter a positive number of days.";
    }

    const splitList = function (v) {
      return String(v || "")
        .split(/[|,]/)
        .map(function (s) { return s.trim(); })
        .filter(Boolean);
    };

    const data = {
      sku: sku,
      name: name,
      slug: U.slugify(name),
      category: category,
      description: description,
      listing_type: listingType,
      rental_price: rentalPrice,
      sale_price: salePrice,
      rental_duration_days: duration ? Number(duration) : null,
      sizes: splitList(val("sizes")),
      colors: splitList(val("colors")),
      availability_status: val("availability_status"),
      is_published: modal.querySelector('[name="is_published"]').checked,
      images: collectImages(modal),
    };

    if (Object.keys(errors).length) return { ok: false, errors };
    return { ok: true, data };
  }

  function collectImages(modal) {
    const rows = modal.querySelectorAll("[data-image-url]");
    const images = [];
    rows.forEach(function (input) {
      const url = input.value.trim();
      const altInput = input.parentElement.querySelector("[data-image-alt]");
      const alt = altInput ? altInput.value.trim() : "";
      if (url) images.push({ url, alt });
    });
    return images;
  }

  function showErrors(modal, errors) {
    modal.querySelectorAll(".field-error").forEach(function (el) { el.classList.add("hidden"); });
    Object.keys(errors).forEach(function (name) {
      const el = modal.querySelector('[data-error-for="' + name + '"]');
      if (el) {
        el.textContent = errors[name];
        el.classList.remove("hidden");
      }
    });
  }


  function addImageRow(container, image) {
    const row = document.createElement("div");
    row.className = "image-row";
    row.style.cssText =
      "display:grid; grid-template-columns: 1fr 1fr auto; gap:0.5rem; margin-bottom:0.5rem; align-items:center;";

    const urlInput = document.createElement("input");
    urlInput.className = "input";
    urlInput.type = "text";
    urlInput.placeholder = "Image URL or local path";
    urlInput.setAttribute("data-image-url", "");
    if (image && image.url) urlInput.value = image.url;

    const altInput = document.createElement("input");
    altInput.className = "input";
    altInput.type = "text";
    altInput.placeholder = "Alt text";
    altInput.setAttribute("data-image-alt", "");
    if (image && image.alt) altInput.value = image.alt;

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "btn btn-outline btn-sm";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", function () { row.remove(); });

    row.appendChild(urlInput);
    row.appendChild(altInput);
    row.appendChild(removeBtn);
    container.appendChild(row);
  }

  /**
   * Open the modal.
   * @param {Object|null} product  existing product to edit, or null to add.
   * @param {Function} saveHandler  called with validated data on save.
   */
  function open(product, saveHandler) {
    onSave = saveHandler;
    root = document.getElementById("modal-root");
    root.innerHTML = "";
    root.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";

    const modal = document.createElement("div");
    modal.className = "modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", product ? "Edit product" : "Add product");

    const head = document.createElement("div");
    head.className = "modal__head";
    const h3 = document.createElement("h3");
    h3.textContent = product ? "Edit Product" : "Add Product";
    head.appendChild(h3);
    const closeBtn = document.createElement("button");
    closeBtn.className = "modal__close";
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.textContent = "×";
    closeBtn.addEventListener("click", close);
    head.appendChild(closeBtn);
    modal.appendChild(head);

    const body = document.createElement("div");
    body.className = "modal__body";
    const form = document.createElement("form");
    form.id = "product-form";
    form.noValidate = true;
    const grid = document.createElement("div");
    grid.className = "form-grid";

    function addField(config) {
      const f = field(config);
      grid.appendChild(f.wrap);
      return f.input;
    }
    function addSelect(config, options) {
      const f = selectField(config, options);
      grid.appendChild(f.wrap);
      return f.input;
    }

    const nameInput = addField({ name: "name", label: "Product name", required: true, placeholder: "e.g. Adelie" });
    const skuInput = addField({ name: "sku", label: "SKU", required: true, placeholder: "e.g. ZL-GWN-0001" });
    const categoryInput = addField({ name: "category", label: "Category", required: true, placeholder: "e.g. Ballgowns" });
    const listingInput = addSelect({ name: "listing_type", label: "Listing type" }, [
      { value: "rent", label: "Rent" },
      { value: "sale", label: "Sale" },
      { value: "both", label: "Rent or Buy" },
    ]);
    const rentalInput = addField({ name: "rental_price", label: "Rental price (₱)", type: "number", placeholder: "500" });
    const saleInput = addField({ name: "sale_price", label: "Sale price (₱)", type: "number", placeholder: "2500" });
    const durationInput = addField({ name: "rental_duration_days", label: "Rental duration (days)", type: "number", placeholder: "3" });
    const sizesInput = addField({ name: "sizes", label: "Sizes", hint: "Separate with commas or pipes, e.g. S, M, L", placeholder: "S, M, L" });
    const colorsInput = addField({ name: "colors", label: "Colours", hint: "Separate with commas or pipes", placeholder: "Blush, Ivory" });
    const availInput = addSelect({ name: "availability_status", label: "Availability" }, [
      { value: "available", label: "Available" },
      { value: "unavailable", label: "Unavailable" },
      { value: "maintenance", label: "Maintenance" },
    ]);
    const descInput = addField({ name: "description", label: "Description", required: true, type: "textarea", full: true, placeholder: "Full product description…" });

    form.appendChild(grid);


    // Images section
    const imgSection = document.createElement("div");
    imgSection.className = "field field--full";
    imgSection.style.marginTop = "1rem";
    const imgLabel = document.createElement("label");
    imgLabel.textContent = "Product images";
    imgSection.appendChild(imgLabel);
    const imgHint = document.createElement("span");
    imgHint.className = "field-hint";
    imgHint.textContent =
      "Demo build: paste image URLs or local sample paths. Supabase uploads are added when configured.";
    imgSection.appendChild(imgHint);
    const imgList = document.createElement("div");
    imgList.id = "pf-image-list";
    imgList.style.marginTop = "0.5rem";
    imgSection.appendChild(imgList);
    const addImgBtn = document.createElement("button");
    addImgBtn.type = "button";
    addImgBtn.className = "btn btn-outline btn-sm";
    addImgBtn.textContent = "+ Add image";
    addImgBtn.addEventListener("click", function () { addImageRow(imgList, null); });
    imgSection.appendChild(addImgBtn);
    form.appendChild(imgSection);

    // Publish toggle
    const pubField = document.createElement("div");
    pubField.className = "field field--full";
    pubField.style.marginTop = "1rem";
    const pubLabel = document.createElement("label");
    pubLabel.style.cssText = "display:flex; align-items:center; gap:0.5rem;";
    const pubCheck = document.createElement("input");
    pubCheck.type = "checkbox";
    pubCheck.name = "is_published";
    pubCheck.style.width = "auto";
    const pubText = document.createElement("span");
    pubText.textContent = "Published (visible on the public catalogue)";
    pubLabel.appendChild(pubCheck);
    pubLabel.appendChild(pubText);
    pubField.appendChild(pubLabel);
    form.appendChild(pubField);

    body.appendChild(form);
    modal.appendChild(body);

    const foot = document.createElement("div");
    foot.className = "modal__foot";
    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.className = "btn btn-outline";
    cancelBtn.textContent = "Cancel";
    cancelBtn.addEventListener("click", close);
    const saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.className = "btn btn-primary";
    saveBtn.textContent = product ? "Save changes" : "Add product";
    foot.appendChild(cancelBtn);
    foot.appendChild(saveBtn);
    modal.appendChild(foot);

    backdrop.appendChild(modal);
    root.appendChild(backdrop);

    // Populate existing values.
    if (product) {
      nameInput.value = product.name || "";
      skuInput.value = product.sku || "";
      categoryInput.value = product.category || "";
      listingInput.value = product.listing_type || "rent";
      rentalInput.value = product.rental_price != null ? product.rental_price : "";
      saleInput.value = product.sale_price != null ? product.sale_price : "";
      durationInput.value = product.rental_duration_days != null ? product.rental_duration_days : "";
      sizesInput.value = (product.sizes || []).join(", ");
      colorsInput.value = (product.colors || []).join(", ");
      availInput.value = product.availability_status || "available";
      descInput.value = product.description || "";
      pubCheck.checked = Boolean(product.is_published);
      (product.images || []).forEach(function (img) { addImageRow(imgList, img); });
    } else {
      addImageRow(imgList, null);
    }

    saveBtn.addEventListener("click", function () {
      const result = readForm(modal);
      if (!result.ok) {
        showErrors(modal, result.errors);
        return;
      }
      if (onSave) onSave(result.data);
      close();
    });
  }

  return { open, close };
})();

