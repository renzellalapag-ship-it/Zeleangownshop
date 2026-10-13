/**
 * Zelean Admin — Shared Utilities
 * Small helpers reused across the dashboard. Framework-free.
 */
window.AdminUtils = (function () {
  "use strict";

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatPHP(amount) {
    if (amount == null || isNaN(amount)) return "—";
    const hasCents = Math.round(amount) !== Number(amount);
    return "₱" + (hasCents ? Number(amount).toFixed(2) : Number(amount).toLocaleString("en-PH"));
  }

  /** Show a transient toast message. */
  function toast(message, type) {
    const host = document.getElementById("toast-root");
    if (!host) return;
    const el = document.createElement("div");
    el.className = "toast" + (type ? " toast--" + type : "");
    el.setAttribute("role", "status");
    el.textContent = message;
    host.appendChild(el);
    setTimeout(function () {
      el.style.opacity = "0";
      el.style.transition = "opacity 300ms ease";
      setTimeout(function () { el.remove(); }, 320);
    }, 2600);
  }

  /** Generate a URL-friendly slug from a string. */
  function slugify(text) {
    return String(text || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  /** Generate a simple unique id for mock records. */
  function uid(prefix) {
    return (prefix || "id") + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
  }

  return { escapeHtml, formatPHP, toast, slugify, uid };
})();
