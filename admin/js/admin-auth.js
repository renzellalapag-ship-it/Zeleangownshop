/**
 * Zelean Admin — Authentication (Supabase)
 * ---------------------------------------------------------------------------
 * Real sign-in using Supabase Auth (email + password). A user may only reach
 * the dashboard if:
 *   1. They sign in successfully, AND
 *   2. They have a row in the `admin_roles` table (enforced server-side too,
 *      via the RLS policies in supabase/migrations/0001_init.sql).
 *
 * Because signups are disabled and you are the only user in `admin_roles`,
 * only YOU can log in. Being merely signed-in is NOT enough — the admin_roles
 * check gates access.
 *
 * This file only ever uses the publishable (anon) key from js/config.js. The
 * service-role key must never appear here.
 */
window.AdminAuth = (function () {
  "use strict";

  let _client = null;

  /** Read the Supabase settings from config; null if still placeholders. */
  function cfg() {
    const s = window.ZELEAN_CONFIG && window.ZELEAN_CONFIG.supabase;
    if (
      !s ||
      !s.url ||
      !s.publishableKey ||
      /YOUR-/.test(s.url) ||
      /YOUR-/.test(s.publishableKey)
    ) {
      return null;
    }
    return s;
  }

  /** True when Supabase keys are present and the client library has loaded. */
  function isConfigured() {
    return Boolean(
      cfg() &&
        typeof window.supabase !== "undefined" &&
        window.supabase.createClient
    );
  }

  /** Lazily create (and cache) the Supabase client for the admin app. */
  function client() {
    if (_client) return _client;
    if (!isConfigured()) return null;
    const s = cfg();
    _client = window.supabase.createClient(s.url, s.publishableKey);
    return _client;
  }

  /** The currently signed-in user, or null. */
  async function currentUser() {
    const sb = client();
    if (!sb) return null;
    try {
      const { data, error } = await sb.auth.getUser();
      if (error || !data) return null;
      return data.user || null;
    } catch (e) {
      return null;
    }
  }

  /** Does this user have a row in admin_roles? */
  async function isAdmin(userId) {
    const sb = client();
    if (!sb || !userId) return false;
    try {
      const { data, error } = await sb
        .from("admin_roles")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();
      return !error && data ? true : false;
    } catch (e) {
      return false;
    }
  }

  async function isSignedIn() {
    return Boolean(await currentUser());
  }

  /**
   * Sign in with email + password, then confirm admin status.
   * Returns { ok: true, user } or { ok: false, error }.
   */
  async function signIn(email, password) {
    if (!isConfigured()) {
      return {
        ok: false,
        error:
          "Supabase is not configured yet. Add your project URL and publishable key in js/config.js.",
      };
    }
    if (!email || !password) {
      return { ok: false, error: "Please enter your email and password." };
    }
    const sb = client();
    const { data, error } = await sb.auth.signInWithPassword({
      email: String(email).trim(),
      password: String(password),
    });
    if (error || !data || !data.user) {
      // Generic message — do not reveal whether the email exists.
      return { ok: false, error: "Incorrect email or password." };
    }
    const admin = await isAdmin(data.user.id);
    if (!admin) {
      // Signed in, but not an authorized admin — sign them straight back out.
      try { await sb.auth.signOut(); } catch (e) {}
      return {
        ok: false,
        error: "This account is not authorized to access the admin dashboard.",
      };
    }
    return { ok: true, user: data.user };
  }

  async function signOut() {
    const sb = client();
    if (sb) {
      try { await sb.auth.signOut(); } catch (e) {}
    }
  }

  /**
   * Guard a dashboard page (async). Redirects to login.html unless the visitor
   * is signed in AND is an admin. Resolves true when access is allowed.
   */
  async function requireAuth() {
    const user = await currentUser();
    if (!user) {
      window.location.replace("login.html");
      return false;
    }
    const admin = await isAdmin(user.id);
    if (!admin) {
      await signOut();
      window.location.replace("login.html");
      return false;
    }
    return true;
  }

  return {
    isConfigured,
    getClient: client,
    currentUser,
    isAdmin,
    isSignedIn,
    signIn,
    signOut,
    requireAuth,
  };
})();

/* ---------------------------------------------------------------------------
 * Login page wiring (only runs on login.html where #login-form exists).
 * ------------------------------------------------------------------------- */
(function () {
  "use strict";
  function initLogin() {
    var form = document.getElementById("login-form");
    if (!form) return;

    var emailInput = document.getElementById("email");
    var passwordInput = document.getElementById("password");
    var errorBox = document.getElementById("login-error");
    var submitBtn = form.querySelector('button[type="submit"]');

    function showError(message) {
      errorBox.textContent = message;
      errorBox.classList.remove("hidden");
    }

    // If already signed in AS AN ADMIN, skip to the dashboard. Otherwise stay
    // on the login page and show the form. (Never redirect the login page to
    // itself — that caused an infinite refresh loop.)
    window.AdminAuth
      .currentUser()
      .then(function (user) {
        if (!user) return;
        return window.AdminAuth.isAdmin(user.id).then(function (admin) {
          if (admin) window.location.replace("index.html");
        });
      })
      .catch(function () { /* stay on login page */ });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      errorBox.classList.add("hidden");
      if (submitBtn) submitBtn.disabled = true;
      window.AdminAuth
        .signIn(emailInput.value, passwordInput.value)
        .then(function (result) {
          if (submitBtn) submitBtn.disabled = false;
          if (!result.ok) {
            showError(result.error);
            return;
          }
          window.location.replace("index.html");
        });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLogin);
  } else {
    initLogin();
  }
})();


