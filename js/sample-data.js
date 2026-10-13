/**
 * Zelean Gowns — Sample Data (PLACEHOLDER)
 * ---------------------------------------------------------------------------
 * This module holds SAMPLE products used to build and preview the catalogue
 * BEFORE the real inventory is imported from the Google Sheet.
 *
 * EVERY entry is explicitly sample content:
 *  - Descriptions are clearly marked as sample content.
 *  - Prices use the ₱500 demonstration value seen in the catalogue screenshot
 *    for the four named gowns. This is NOT verified current pricing.
 *  - The 3-day rental duration is marked UNVERIFIED sample information.
 *  - Photos are local SVG placeholders, NOT real Zelean gown photos.
 *
 * This file is intentionally kept SEPARATE from all Supabase code so it can be
 * deleted/replaced cleanly once real data is imported. The catalogue runs
 * locally using this data even when Supabase is not configured.
 */

window.ZELEAN_SAMPLE_PRODUCTS = [
  /* -----------------------------------------------------------------------
   * Vietnam Dress — demonstration of the additional product attributes
   * (sub-category, fabric, deposit required, replacement value).
   * Values below are SAMPLE/demonstration data.
   * --------------------------------------------------------------------- */
  {
    id: "sample-vietnam-mid-dress",
    sku: "ZL-VND-0601",
    slug: "vietnam-mid-dress",
    name: "Vietnam Dress",
    category: "Vietnam Dress",
    sub_category: "Mid Dress",
    description:
      "SAMPLE DESCRIPTION: A lace mid dress in a floral pink and violet palette. " +
      "Demonstrates the additional product attributes (sub-category, fabric, " +
      "deposit required, and replacement value). Placeholder text.",
    listing_type: "rent",            // "rent" | "sale" | "both"
    rental_price: 500,               // DEMONSTRATION price only
    sale_price: null,
    deposit_required: 500,           // refundable rental deposit (₱)
    replacement_value: 3000,         // item replacement value (₱)
    rental_duration_days: 3,         // UNVERIFIED sample rental duration
    sizes: ["M"],
    colors: ["Floral Pink", "Violet"],
    fabric: "Lace",
    availability_status: "available", // "available" | "unavailable" | "maintenance"
    is_published: true,
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
    images: [
      { url: "assets/images/samples/gown-rose.svg", alt: "Vietnam Dress — front view (sample photo)" },
      { url: "assets/images/samples/gown-mauve.svg", alt: "Vietnam Dress — alternate view (sample photo)" },
    ],
  },
  /* -----------------------------------------------------------------------
   * GOWNS — the four named examples from the catalogue screenshot.
   * Price shown as ₱500 (demonstration). 3-day rental marked unverified.
   * --------------------------------------------------------------------- */
  {
    id: "sample-adelie",
    sku: "ZL-GWN-0001",
    slug: "adelie",
    name: "Adelie",
    category: "Ballgowns",
    description:
      "SAMPLE DESCRIPTION: A graceful floor-length ballgown with a fitted bodice " +
      "and full skirt, ideal for debut, pageant, or formal ball occasions. " +
      "This is placeholder text and will be replaced with the real product " +
      "details from the Zelean catalogue.",
    listing_type: "rent",            // "rent" | "sale" | "both"
    rental_price: 500,               // DEMONSTRATION price only
    sale_price: null,
    rental_duration_days: 3,         // UNVERIFIED sample rental duration
    sizes: ["XS", "S", "M", "L"],
    colors: ["Blush", "Ivory"],
    availability_status: "available", // "available" | "unavailable" | "maintenance"
    is_published: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    images: [
      { url: "assets/images/samples/gown-rose.svg", alt: "Adelie ballgown — front view (sample photo)" },
      { url: "assets/images/samples/gown-champagne.svg", alt: "Adelie ballgown — alternate view (sample photo)" },
    ],
  },
  {
    id: "sample-arielle",
    sku: "ZL-GWN-0002",
    slug: "arielle",
    name: "Arielle",
    category: "Long Gowns",
    description:
      "SAMPLE DESCRIPTION: An elegant long gown with a soft drape and flowing " +
      "silhouette, suited to evening events and formal receptions. This is " +
      "placeholder text pending the real catalogue details.",
    listing_type: "rent",
    rental_price: 500,               // DEMONSTRATION price only
    sale_price: null,
    rental_duration_days: 3,         // UNVERIFIED sample rental duration
    sizes: ["S", "M", "L"],
    colors: ["Champagne"],
    availability_status: "available",
    is_published: true,
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
    images: [
      { url: "assets/images/samples/gown-champagne.svg", alt: "Arielle long gown — front view (sample photo)" },
      { url: "assets/images/samples/gown-rose.svg", alt: "Arielle long gown — alternate view (sample photo)" },
    ],
  },
  {
    id: "sample-aurelia",
    sku: "ZL-GWN-0003",
    slug: "aurelia",
    name: "Aurelia",
    category: "Mermaid Gowns",
    description:
      "SAMPLE DESCRIPTION: A sophisticated mermaid-cut gown that follows the " +
      "body's lines before flaring gently at the hem. Placeholder text for " +
      "demonstration until real details are imported.",
    listing_type: "rent",
    rental_price: 500,               // DEMONSTRATION price only
    sale_price: null,
    rental_duration_days: 3,         // UNVERIFIED sample rental duration
    sizes: ["S", "M"],
    colors: ["Mauve", "Champagne"],
    availability_status: "available",
    is_published: true,
    created_at: "2024-01-03T00:00:00Z",
    updated_at: "2024-01-03T00:00:00Z",
    images: [
      { url: "assets/images/samples/gown-mauve.svg", alt: "Aurelia mermaid gown — front view (sample photo)" },
      { url: "assets/images/samples/gown-champagne.svg", alt: "Aurelia mermaid gown — alternate view (sample photo)" },
    ],
  },
  {
    id: "sample-celestia",
    sku: "ZL-GWN-0004",
    slug: "celestia",
    name: "Celestia",
    category: "Night Gowns",
    description:
      "SAMPLE DESCRIPTION: A refined night gown with a flattering neckline and " +
      "sweeping skirt, perfect for gala nights and formal dinners. This is " +
      "sample content and will be updated with real information.",
    listing_type: "rent",
    rental_price: 500,               // DEMONSTRATION price only
    sale_price: null,
    rental_duration_days: 3,         // UNVERIFIED sample rental duration
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Ivory", "Mauve"],
    availability_status: "available",
    is_published: true,
    created_at: "2024-01-04T00:00:00Z",
    updated_at: "2024-01-04T00:00:00Z",
    images: [
      { url: "assets/images/samples/gown-champagne.svg", alt: "Celestia night gown — front view (sample photo)" },
      { url: "assets/images/samples/gown-mauve.svg", alt: "Celestia night gown — alternate view (sample photo)" },
    ],
  },

  /* -----------------------------------------------------------------------
   * ADDITIONAL SAMPLES to demonstrate the other category filters.
   * These illustrate suits, barong, Filipiniana, cocktail dresses, and
   * accessories, and show rent / sale / both listing types.
   * --------------------------------------------------------------------- */
  {
    id: "sample-cocktail-lila",
    sku: "ZL-CKT-0101",
    slug: "lila-cocktail-dress",
    name: "Lila Cocktail Dress",
    category: "Cocktail Dresses",
    description:
      "SAMPLE DESCRIPTION: A knee-length cocktail dress with a flattering " +
      "cut, ideal for semi-formal gatherings and celebrations. Placeholder " +
      "text for demonstration only.",
    listing_type: "both",
    rental_price: 500,
    sale_price: 2500,
    rental_duration_days: 3,
    sizes: ["S", "M", "L"],
    colors: ["Blush", "Black"],
    availability_status: "available",
    is_published: true,
    created_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-02-01T00:00:00Z",
    images: [
      { url: "assets/images/samples/gown-rose.svg", alt: "Lila cocktail dress (sample photo)" },
    ],
  },
  {
    id: "sample-suit-noir",
    sku: "ZL-SUT-0201",
    slug: "noir-mens-suit",
    name: "Noir Men's Suit",
    category: "Men's Suits",
    description:
      "SAMPLE DESCRIPTION: A classic tailored men's suit suitable for weddings " +
      "and formal events. Placeholder description to be replaced with real " +
      "details.",
    listing_type: "rent",
    rental_price: 1500,
    sale_price: null,
    rental_duration_days: 3,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Navy"],
    availability_status: "available",
    is_published: true,
    created_at: "2024-02-05T00:00:00Z",
    updated_at: "2024-02-05T00:00:00Z",
    images: [
      { url: "assets/images/samples/suit.svg", alt: "Noir men's suit (sample photo)" },
    ],
  },
  {
    id: "sample-barong-classic",
    sku: "ZL-BRG-0301",
    slug: "classic-barong-tagalog",
    name: "Classic Barong Tagalog",
    category: "Barong",
    description:
      "SAMPLE DESCRIPTION: A traditional Barong Tagalog, appropriate for " +
      "Filipino formal occasions such as weddings and receptions. Sample " +
      "text only.",
    listing_type: "both",
    rental_price: 800,
    sale_price: 3500,
    rental_duration_days: 3,
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Ivory"],
    availability_status: "available",
    is_published: true,
    created_at: "2024-02-10T00:00:00Z",
    updated_at: "2024-02-10T00:00:00Z",
    images: [
      { url: "assets/images/samples/barong.svg", alt: "Classic Barong Tagalog (sample photo)" },
    ],
  },
  {
    id: "sample-filipiniana-maria",
    sku: "ZL-FIL-0401",
    slug: "maria-filipiniana",
    name: "Maria Filipiniana",
    category: "Filipiniana",
    description:
      "SAMPLE DESCRIPTION: An elegant Filipiniana gown inspired by " +
      "traditional Filipino dress, ideal for cultural events and formal " +
      "celebrations. Placeholder description.",
    listing_type: "rent",
    rental_price: 1200,
    sale_price: null,
    rental_duration_days: 3,
    sizes: ["S", "M", "L"],
    colors: ["Ivory", "Champagne"],
    availability_status: "maintenance",
    is_published: true,
    created_at: "2024-02-15T00:00:00Z",
    updated_at: "2024-02-15T00:00:00Z",
    images: [
      { url: "assets/images/samples/gown-champagne.svg", alt: "Maria Filipiniana (sample photo)" },
    ],
  },
  {
    id: "sample-clutch-eve",
    sku: "ZL-ACC-0501",
    slug: "eve-evening-clutch",
    name: "Eve Evening Clutch",
    category: "Bags & Accessories",
    description:
      "SAMPLE DESCRIPTION: A refined evening clutch to complete a formal " +
      "look. Sample accessory item for demonstration of the accessories " +
      "category.",
    listing_type: "sale",
    rental_price: null,
    sale_price: 900,
    rental_duration_days: null,
    sizes: ["One Size"],
    colors: ["Champagne", "Brown"],
    availability_status: "available",
    is_published: true,
    created_at: "2024-02-20T00:00:00Z",
    updated_at: "2024-02-20T00:00:00Z",
    images: [
      { url: "assets/images/samples/accessories.svg", alt: "Eve evening clutch (sample photo)" },
    ],
  },
];

/**
 * A helper used by the demo admin dashboard to reset mock data to the samples.
 * Kept here so sample data stays in one place.
 */
window.ZELEAN_SAMPLE_PRODUCTS_SNAPSHOT = JSON.parse(
  JSON.stringify(window.ZELEAN_SAMPLE_PRODUCTS)
);
