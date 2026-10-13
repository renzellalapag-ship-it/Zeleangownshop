# Zelean Gowns, Dresses, Suits and Barong — Catalogue Website

A polished, responsive catalogue website for a family-owned gown rental and
formalwear business in **Purok 4, Santor, Malolos City, Bulacan, Philippines**.

Built with **HTML5, CSS3, and vanilla JavaScript (ES6+)**, designed for a later
**Supabase** integration (PostgreSQL + Auth + Storage). No frontend framework,
no build tools — just open the files in a browser.

> **Status:** Frontend + mock admin are complete and run on **sample data**.
> Supabase SQL migrations, a CSV template, and an import guide are ready for
> when the real catalogue and credentials are available.

---

## Quick start

Because the site is plain static files, you can open it directly:

1. In VS Code, install the **Live Server** extension (optional but recommended).
2. Right-click `index.html` → **Open with Live Server**.
   - Or simply double-click `index.html` to open it in your browser.

The catalogue works **without any Supabase configuration** — it uses the local
sample products in `js/sample-data.js`.

### Try the admin demo

1. Open `admin/login.html`.
2. Sign in with **any** valid-looking email and a password of 6+ characters
   (e.g. `admin@zelean.test` / `secret123`). This is a **mock** login and is
   **not secure** — it only stores a demo session in your browser.
3. Explore the dashboard: stats, search, filter, add/edit/delete, publish
   toggle. Changes are in-memory only and reset on reload.

---

## Project structure

```
zelean-gowns/
├── index.html                 # Homepage + catalogue + categories
├── product.html               # Product detail page (product.html?id=SKU_OR_SLUG)
├── about.html                 # About + contact
├── README.md
├── .gitignore
├── assets/
│   └── images/
│       └── samples/           # Local SVG placeholder images (sample only)
├── css/
│   ├── styles.css             # Design system (CSS variables) + components
│   └── responsive.css         # Tablet / mobile breakpoints
├── js/
│   ├── config.js              # CENTRAL config: Supabase, Messenger, contact
│   ├── sample-data.js         # Sample products (replace when importing real data)
│   ├── utils.js               # Shared helpers (format, escape, fallback images)
│   ├── filters.js             # Pure search / filter / sort logic
│   ├── supabase-client.js     # Data access: Supabase OR sample fallback
│   ├── messenger.js           # Messenger inquiry links + placeholder handling
│   ├── site-chrome.js         # Shared header, footer, notice, mobile nav
│   ├── catalogue.js           # Homepage catalogue controller
│   ├── product-details.js     # Product detail page controller
│   └── about.js               # Contact cards (respects placeholders)
├── admin/
│   ├── index.html             # Demo dashboard
│   ├── login.html             # Mock login (not secure)
│   ├── css/admin.css
│   └── js/
│       ├── admin-utils.js     # Shared admin helpers
│       ├── admin-auth.js      # MOCK auth (replace with Supabase Auth)
│       ├── admin-data.js      # In-memory demo store (replace with Supabase)
│       ├── product-form.js    # Add/edit modal with validation
│       └── admin.js           # Dashboard controller
└── supabase/
    ├── migrations/
    │   ├── 0001_init.sql      # Tables, RLS, triggers, indexes
    │   └── 0002_storage.sql   # zelean-products bucket + policies
    ├── import-template.csv    # CSV template for importing real products
    └── IMPORT_GUIDE.md        # Step-by-step import instructions
```

---

## What you must configure manually

Everything below lives in **`js/config.js`** (single source of truth):

| Setting | Where | Notes |
|---|---|---|
| `supabase.enabled` | `js/config.js` | Set to `true` only after creating a Supabase project. |
| `supabase.url` | `js/config.js` | Project URL from Supabase → Settings → API. |
| `supabase.publishableKey` | `js/config.js` | The **anon / publishable** key. **Never** the service-role key. |
| `messenger.url` | `js/config.js` | Official Messenger link, e.g. `https://m.me/YourPage`. Until set, product pages show a labelled placeholder. |
| `contact.phone` / `phoneHref` | `js/config.js` | Add when confirmed. |
| `contact.email`, `facebook`, `instagram` | `js/config.js` | Add when confirmed. |
| `contact.googleMapsUrl` | `js/config.js` | Add the **exact** Maps URL when supplied. |
| `contact.businessHours` | `js/config.js` | Add when confirmed. |
| `site.showSampleDataNotice` | `js/config.js` | Set to `false` once real data is live. |

---

## Security notes

- Only the **publishable (anon)** Supabase key belongs in the browser.
- The **service-role / secret key and database password must never** appear in
  frontend code.
- Row Level Security (RLS) is enforced **in the database** (`supabase/migrations`):
  - Public users can read **only published** products and their images.
  - Only users listed in `admin_roles` can insert/update/delete.
  - Being signed in does **not** automatically make someone an admin.
- The mock admin login is a **demonstration only** and is not secure. Replace
  `admin/js/admin-auth.js` and `admin/js/admin-data.js` with real Supabase Auth
  + `admin_roles` checks before relying on it.

---

## Running the SQL migrations

1. Create a project at [supabase.com](https://supabase.com).
2. Dashboard → **SQL Editor** → New query.
3. Paste and run `supabase/migrations/0001_init.sql`, then
   `supabase/migrations/0002_storage.sql`.
4. Create your admin user (Auth → Users), then grant admin rights:
   ```sql
   insert into public.admin_roles (user_id) values ('THE-USER-UUID');
   ```
5. Fill in `js/config.js` with the URL + publishable key and set
   `supabase.enabled = true`.

(If you prefer the CLI: `supabase db push` inside a linked project.)

---

## Importing the real catalogue

See **`supabase/IMPORT_GUIDE.md`** for the full 10-step process and
**`supabase/import-template.csv`** for the column layout. Never overwrite real
products with the sample data.

---

## Next recommended step

1. Confirm the Supabase project + credentials, then enable them in
   `js/config.js`.
2. Set the real `messenger.url`.
3. Export the Google Sheet, clean it, upload images to Storage, and import via
   the guide above.
4. Set `site.showSampleDataNotice = false` and swap the placeholder images for
   the official Zelean logo and real product photos.

