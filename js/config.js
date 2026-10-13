/**
 * Zelean Gowns — Central Configuration
 * ---------------------------------------------------------------------------
 * This is the SINGLE source of truth for site-wide settings.
 *
 * IMPORTANT:
 * - Only PUBLIC values belong here (publishable/anon key, public links).
 * - NEVER put the Supabase service-role key, secret key, or database password
 *   in this file. It runs in the browser and is fully visible to visitors.
 * - Replace the placeholders marked with "TODO" as information is confirmed.
 */

window.ZELEAN_CONFIG = {
  /* ---------------------------------------------------------------------
   * BUSINESS INFORMATION
   * ------------------------------------------------------------------- */
  business: {
    name: "Zelean Gowns, Dresses, Suits and Barong",
    shortName: "Zelean",
    tagline: "Elegant formalwear for rent and sale",
    addressLines: [
      "Purok 4, Santor",
      "Malolos City, Bulacan",
      "Philippines",
    ],
  },

  /* ---------------------------------------------------------------------
   * SUPABASE
   * -------------------------------------------------------------------
   * Set `enabled: true` ONLY after you have created a Supabase project and
   * filled in the URL + publishable (anon) key below. While disabled, the
   * site automatically falls back to local sample data so it still works.
   *
   * Get these from: Supabase Dashboard → Project Settings → API
   * Use the "anon" / "publishable" key. NEVER the service_role key.
   * ------------------------------------------------------------------- */
  supabase: {
    enabled: true,
    url: "https://xwrbyjlvhhyfwnetabsh.supabase.co",
    publishableKey: "sb_publishable_A-_OCAHjJl2_ZPIvvIw4Xw_VG663x1y",
    storageBucket: "zelean-products",
    productsTable: "products",
    productImagesTable: "product_images",
  },

  /* ---------------------------------------------------------------------
   * MESSENGER INQUIRY
   * -------------------------------------------------------------------
   * Paste the full Messenger link to the Zelean Facebook page here, e.g.
   *   https://m.me/YourPageUsername
   * or
   *   https://www.facebook.com/messages/t/YourPageID
   *
   * Until this is set, product pages show a clearly labelled placeholder
   * instead of a broken link.
   * ------------------------------------------------------------------- */
  messenger: {
    url: "", // TODO: paste the real Messenger URL, e.g. "https://m.me/zelean"
  },

  /* ---------------------------------------------------------------------
   * CONTACT / SOCIAL PLACEHOLDERS
   * -------------------------------------------------------------------
   * Leave blank to hide. Do NOT invent real phone numbers or profiles.
   * ------------------------------------------------------------------- */
  contact: {
    phone: "",                 // TODO: e.g. "+63 9XX XXX XXXX"
    phoneHref: "",             // TODO: e.g. "tel:+639XXXXXXXXX"
    email: "",                 // TODO: e.g. "zelean@example.com"
    viber: "",                 // TODO
    facebook: "",              // TODO: full profile/page URL
    instagram: "",             // TODO
    // Only add a Maps link once the exact business map URL is supplied.
    googleMapsUrl: "",         // TODO: exact Google Maps share/place URL
    businessHours: "",         // TODO: e.g. "Mon–Sat, 10:00 AM – 7:00 PM"
  },

  /* ---------------------------------------------------------------------
   * SITE BEHAVIOUR
   * ------------------------------------------------------------------- */
  site: {
    // When true, the public catalogue shows a subtle "sample data" banner so
    // visitors/team know the products shown are not yet final inventory.
    showSampleDataNotice: true,
    // Fallback image used when a product image is missing or fails to load.
    fallbackImage: "assets/images/samples/fallback.svg",
    currency: "₱",
    currencyCode: "PHP",
  },
};
