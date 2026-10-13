/**
 * Zelean Gowns — Site Chrome (shared header, footer, notice)
 * ---------------------------------------------------------------------------
 * Renders the header navigation and footer on every public page so the brand,
 * links, and contact placeholders live in ONE place. Also handles the mobile
 * nav toggle and the optional "sample data" disclosure banner.
 *
 * All dynamic text uses textContent to stay safe.
 */
window.ZeleanChrome = (function () {
  "use strict";

  function renderHeader() {
    const host = document.getElementById("site-header");
    if (!host) return;
    const business = window.ZELEAN_CONFIG.business;
    const current = window.location.pathname.split("/").pop() || "index.html";

    const header = document.createElement("header");
    header.className = "site-header";

    const inner = document.createElement("div");
    inner.className = "container header-inner";

    // Brand
    const brand = document.createElement("a");
    brand.className = "brand";
    brand.href = "index.html";
    brand.setAttribute("aria-label", business.name + " — home");
    const logo = document.createElement("span");
    logo.className = "brand__logo";
    logo.setAttribute("aria-hidden", "true");
    logo.textContent = "Z";
    brand.appendChild(logo);
    const text = document.createElement("span");
    text.className = "brand__text";
    const script = document.createElement("span");
    script.className = "brand__script";
    script.textContent = business.shortName;
    const sub = document.createElement("span");
    sub.className = "brand__sub";
    sub.textContent = "Gowns · Suits · Barong";
    text.appendChild(script);
    text.appendChild(sub);
    brand.appendChild(text);
    inner.appendChild(brand);

    // Nav
    const nav = document.createElement("nav");
    nav.className = "nav";
    nav.id = "primary-nav";
    nav.setAttribute("aria-label", "Primary");
    const links = [
      { href: "index.html", label: "Home" },
      { href: "index.html#catalogue", label: "Catalogue" },
      { href: "index.html#categories", label: "Categories" },
      { href: "about.html", label: "About" },
      { href: "about.html#contact", label: "Contact" },
    ];
    links.forEach((l) => {
      const a = document.createElement("a");
      a.className = "nav__link";
      a.href = l.href;
      a.textContent = l.label;
      const target = l.href.split("#")[0];
      if (target === current && !l.href.includes("#")) {
        a.classList.add("is-active");
        a.setAttribute("aria-current", "page");
      }
      nav.appendChild(a);
    });
    const cta = document.createElement("a");
    cta.className = "btn btn-primary btn-sm nav__cta";
    cta.href = "index.html#catalogue";
    cta.textContent = "Browse Catalogue";
    nav.appendChild(cta);
    inner.appendChild(nav);

    // Mobile toggle
    const toggle = document.createElement("button");
    toggle.className = "nav-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Toggle menu");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "primary-nav");
    for (let i = 0; i < 3; i++) {
      const bar = document.createElement("span");
      bar.className = "nav-toggle__bar";
      toggle.appendChild(bar);
    }
    inner.appendChild(toggle);

    header.appendChild(inner);
    host.appendChild(header);

    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  function renderNotice() {
    if (!window.ZELEAN_CONFIG.site.showSampleDataNotice) return;
    const main = document.querySelector("main");
    if (!main) return;
    const notice = document.createElement("div");
    notice.className = "site-notice";
    notice.setAttribute("role", "status");
    notice.textContent =
      "Preview build — the products shown are sample data for layout purposes " +
      "and are not final inventory.";
    main.prepend(notice);
  }

  function renderFooter() {
    const host = document.getElementById("site-footer");
    if (!host) return;
    const c = window.ZELEAN_CONFIG;
    const business = c.business;
    const contact = c.contact;

    const footer = document.createElement("footer");
    footer.className = "site-footer";
    const inner = document.createElement("div");
    inner.className = "container footer__inner";

    // Brand column
    const brandCol = document.createElement("div");
    brandCol.className = "footer__brand";
    const script = document.createElement("span");
    script.className = "brand__script";
    script.textContent = business.shortName;
    brandCol.appendChild(script);
    const p = document.createElement("p");
    p.textContent = business.tagline + " in Malolos, Bulacan.";
    brandCol.appendChild(p);
    inner.appendChild(brandCol);

    // Explore column
    const explore = document.createElement("div");
    const h4a = document.createElement("h4");
    h4a.textContent = "Explore";
    explore.appendChild(h4a);
    const ulA = document.createElement("ul");
    [
      { href: "index.html#catalogue", label: "Catalogue" },
      { href: "index.html#categories", label: "Categories" },
      { href: "about.html", label: "About Zelean" },
      { href: "about.html#contact", label: "Contact" },
    ].forEach((l) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = l.href;
      a.textContent = l.label;
      li.appendChild(a);
      ulA.appendChild(li);
    });
    explore.appendChild(ulA);
    inner.appendChild(explore);

    // Visit column
    const visit = document.createElement("div");
    const h4b = document.createElement("h4");
    h4b.textContent = "Visit the Shop";
    visit.appendChild(h4b);
    const addr = document.createElement("address");
    business.addressLines.forEach((line) => {
      addr.appendChild(document.createTextNode(line));
      addr.appendChild(document.createElement("br"));
    });
    if (contact.googleMapsUrl) {
      const map = document.createElement("a");
      map.href = contact.googleMapsUrl;
      map.target = "_blank";
      map.rel = "noopener noreferrer";
      map.textContent = "View on Google Maps";
      addr.appendChild(document.createElement("br"));
      addr.appendChild(map);
    }
    if (contact.phone) {
      const phone = document.createElement("a");
      phone.href = contact.phoneHref || "#";
      phone.textContent = contact.phone;
      addr.appendChild(document.createElement("br"));
      addr.appendChild(phone);
    }
    visit.appendChild(addr);
    inner.appendChild(visit);

    footer.appendChild(inner);

    const bottom = document.createElement("div");
    bottom.className = "footer__bottom";
    const bottomInner = document.createElement("div");
    bottomInner.className = "container";
    const year = new Date().getFullYear();
    bottomInner.textContent =
      "© " + year + " " + business.name + ". All rights reserved.";
    bottom.appendChild(bottomInner);
    footer.appendChild(bottom);

    host.appendChild(footer);
  }

  function init() {
    renderHeader();
    renderNotice();
    renderFooter();
  }

  return { init };
})();

