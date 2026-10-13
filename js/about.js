/**
 * Zelean Gowns — About Page Controller
 * ---------------------------------------------------------------------------
 * Renders the contact cards from the central config. Fields that have not yet
 * been provided are shown as clearly-labelled placeholders — no invented phone
 * numbers, emails, or social links. The Maps card only appears once an exact
 * Google Maps URL is supplied.
 *
 * All text uses textContent to stay safe.
 */
window.ZeleanAbout = (function () {
  "use strict";

  function card(title, lines, action) {
    const el = document.createElement("div");
    el.className = "contact-card";
    const h = document.createElement("h3");
    h.textContent = title;
    el.appendChild(h);
    lines.forEach((line) => {
      const p = document.createElement("p");
      if (line.href) {
        const a = document.createElement("a");
        a.href = line.href;
        a.textContent = line.text;
        if (line.external) {
          a.target = "_blank";
          a.rel = "noopener noreferrer";
        }
        p.appendChild(a);
      } else {
        p.textContent = line.text;
      }
      el.appendChild(p);
    });
    if (action) {
      const tag = document.createElement("span");
      tag.className = "placeholder-tag";
      tag.textContent = action;
      el.appendChild(tag);
    }
    return el;
  }

  function render() {
    const host = document.getElementById("contact-grid");
    if (!host) return;
    const c = window.ZELEAN_CONFIG;
    const contact = c.contact;

    // Location (known).
    host.appendChild(
      card("Visit the Shop", [
        { text: c.business.addressLines.join(", ") },
        ...(contact.businessHours
          ? [{ text: contact.businessHours }]
          : [{ text: "Business hours: to be announced." }]),
      ])
    );

    // Phone / Viber.
    host.appendChild(
      card(
        "Phone / Viber",
        contact.phone
          ? [{ text: contact.phone, href: contact.phoneHref || "#" }]
          : [{ text: "Phone number coming soon." }],
        contact.phone ? null : "To be added"
      )
    );

    // Messenger.
    host.appendChild(
      card(
        "Messenger",
        contact.facebook
          ? [{ text: "Message us on Facebook", href: contact.facebook, external: true }]
          : [{ text: "Messenger inquiries available from each product page." }],
        c.messenger.url ? null : "To be added"
      )
    );

    // Email.
    host.appendChild(
      card(
        "Email",
        contact.email
          ? [{ text: contact.email, href: "mailto:" + contact.email }]
          : [{ text: "Email address coming soon." }],
        contact.email ? null : "To be added"
      )
    );

    // Maps (only if supplied).
    if (contact.googleMapsUrl) {
      host.appendChild(
        card("Find Us", [
          {
            text: "Open in Google Maps",
            href: contact.googleMapsUrl,
            external: true,
          },
        ])
      );
    }
  }

  function init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", render);
    } else {
      render();
    }
  }

  return { init };
})();
