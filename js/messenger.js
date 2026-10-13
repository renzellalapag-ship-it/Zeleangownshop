/**
 * Zelean Gowns — Messenger Inquiry Helper
 * ---------------------------------------------------------------------------
 * Builds a Facebook Messenger deep link with a prefilled inquiry message and
 * renders the inquiry button (or a clearly-labelled placeholder when the
 * Messenger URL has not been configured yet).
 *
 * The Messenger destination is stored centrally in window.ZELEAN_CONFIG.
 * Do NOT hardcode a Facebook page ID here.
 */
window.ZeleanMessenger = (function () {
  "use strict";

  function isConfigured() {
    const url =
      window.ZELEAN_CONFIG &&
      window.ZELEAN_CONFIG.messenger &&
      window.ZELEAN_CONFIG.messenger.url;
    return Boolean(url && url.trim().length > 0);
  }

  /** Build the default inquiry text for a product. */
  function defaultMessage(product) {
    const name = product && product.name ? product.name : "this item";
    const sku = product && product.sku ? product.sku : "N/A";
    return (
      "Hello, Zelean! I would like to inquire about " +
      name +
      ", product code " +
      sku +
      ". Is it available for my event date?"
    );
  }

  /**
   * Build a full Messenger URL with a prefilled message.
   * Uses the documented `?text=` deep-link parameter (m.me / facebook.com).
   */
  function buildInquiryUrl(product) {
    if (!isConfigured()) return "";
    const base = window.ZELEAN_CONFIG.messenger.url.trim();
    const message = defaultMessage(product);
    const separator = base.indexOf("?") === -1 ? "?" : "&";
    return base + separator + "text=" + encodeURIComponent(message);
  }

  /**
   * Render an inquiry button into a container.
   * - If configured: a real link that opens Messenger in a new tab.
   * - If not configured: a clearly labelled placeholder with setup guidance.
   */
  function renderInquiry(container, product) {
    if (!container) return;
    container.innerHTML = "";

    if (isConfigured()) {
      const url = buildInquiryUrl(product);
      const a = document.createElement("a");
      a.className = "btn btn-primary btn-inquiry";
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.setAttribute(
        "aria-label",
        "Inquire about " + (product ? product.name : "this item") + " via Messenger"
      );
      a.textContent = "Inquire via Messenger";
      container.appendChild(a);
    } else {
      const notice = document.createElement("div");
      notice.className = "inquiry-placeholder";
      notice.setAttribute("role", "note");

      const title = document.createElement("p");
      title.className = "inquiry-placeholder__title";
      title.textContent = "Messenger inquiries are not set up yet.";
      notice.appendChild(title);

      const body = document.createElement("p");
      body.className = "inquiry-placeholder__body";
      body.textContent =
        "To enable this button, add the official Zelean Messenger link to " +
        "messenger.url in js/config.js, for example: " +
        "https://m.me/YourPageUsername";
      notice.appendChild(body);

      container.appendChild(notice);
    }
  }

  return {
    isConfigured,
    defaultMessage,
    buildInquiryUrl,
    renderInquiry,
  };
})();
