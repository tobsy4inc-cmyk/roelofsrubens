# Roelofs & Rubens — Website Redesign Brief

## About the Business

Roelofs & Rubens is a Berkshire-based manufacturer of handmade ceramic hanging decorations, founded in 2006 by Dutch designer Piet van den Beuken and her husband Monty Abram. They sell two types of product:

1. **Seasonal Decorations** — Christmas, flowers, animals, hearts, seaside, vegetables, faith, Easter, etc. Sold direct-to-consumer via their website and Etsy shop. ~120 products at £18 each. Free UK shipping.
2. **Exclusive (In-Store) Decorations** — Bespoke designs for specific venues: cathedrals, castles, museums, chapels, and buildings across the UK and Europe. 100+ unique designs. These are only sold through the venues/stockists themselves, not direct online.

They also attend trade fairs (Museums & Heritage Show, Scotland's Trade Fair, Top Drawer, ACE and CCSA conferences) and offer wholesale accounts.

**Existing presences:**
- Current website: https://roelofsrubens.co.uk (WordPress + WooCommerce + Elementor)
- Etsy shop: https://www.etsy.com/uk/shop/roelofsrubens (120 items, 1.1k sales, 5.0 stars, 341 reviews)
- Instagram: @roelofs_and_rubens
- Email: roelofsrubens@btinternet.com / info@roelofsrubens.co.uk
- Phone: 01635 253671 / +44 (0)1488 668154

---

## The Redesign Goal

Rebuild roelofsrubens.co.uk on **Odoo Standard (hosted SaaS)** as a brand hub and catalogue — not a full e-commerce store. The key architectural change: **offload all direct-to-consumer purchasing to Etsy**, eliminating the need for on-site checkout flows, basket pages, and payment processing for seasonal and main collection products.

The site should feel handmade, warm, and ceramic — not corporate or generic. Think artisan craft brand, not SaaS landing page.

Odoo is a smart choice here because it's modular — the site can start with just the Website module, and if the business later wants to add inventory management, invoicing, CRM for wholesale accounts, or email marketing, those modules plug straight into the same system without migrating platforms.

---

## Site Architecture

```
Home
├── Collections                    → Category grid → links out to Etsy
├── Exclusives                     → Category grid → On-site product pages
│   ├── Cathedrals
│   ├── Castles
│   ├── Museums
│   ├── Chapels
│   ├── Historic Houses
│   └── Landmarks
├── Stockists                      → Map of UK/EU stockists
├── About
│   ├── Our Story (Meet the founders, Delft blue)
│   ├── Made by Hand (process)
│   ├── The Team (homegrown to studio)
│   ├── Exclusive Decorations (carousel showcase)
│   └── Where to Find Us (contact + map)
├── Wholesale
│   ├── Get in Touch
│   ├── Log In (existing accounts)
│   └── Trade Fairs & Events
└── Footer (all pages)
    ├── Shop links
    ├── Explore links
    ├── Contact info
    └── Subscribe / newsletter + social icons
```

### Navigation (Desktop)
Home · Collections · Exclusives · Stockists · About · Wholesale

Plus: Logo (left-aligned), Search bar, Hamburger (mobile)

### Navigation (Mobile)
Logo + Hamburger → Slide-out menu with overlay

---

## Design System

### Colour Palette
| Token | Value | Usage |
|-------|-------|-------|
| `--ink-blue` | `#1F3D73` | Headings, buttons, footer bg, nav text |
| `--ink-blue-hover` | `#172e57` | Button hover states |
| `--mist-blue` | `#EAF3F8` | Section backgrounds, page heroes, cards |
| `--soft-line-grey` | `#D9E1E8` | Borders, dividers |
| `--white` | `#FFFFFF` | Page background, card backgrounds |
| `--body-text` | `#4B5563` | Paragraph text |

### Typography
| Role | Font | Weights |
|------|------|---------|
| Headings | Lora (serif) | 400, 500, 600, 700 |
| Body | Inter (sans-serif) | 400, 500, 600 |

### Spacing & Radii
| Token | Value |
|-------|-------|
| `--section-pad` | `80px` (desktop), `48px` (mobile) |
| `--grid-gap` | `24px` |
| `--radius-card` | `20px` |
| `--radius-btn` | `16px` |
| `--radius-input` | `15px` |
| `--radius-img` | `20px` |
| `--max-width` | `1280px` |

### Key Design Elements

#### Scallop Wave Dividers
Signature decorative element — soft, undulating wave shapes that sit at the edges of mist-blue sections. Implemented via CSS `::before`/`::after` pseudo-elements with inline SVG data URIs. Rules:
- **Page hero sections** (top of page): bottom wave only
- **Mid-page mist sections**: both top and bottom waves
- **Sections directly above the footer**: bottom wave suppressed (via `:has(+ .site-footer)`)
- Waves are 30px tall, positioned absolutely outside section boundaries
- Adjacent sections get 30px margin to accommodate the wave

#### Decorative Accent Lines
A 48px gradient line (`transparent → ink-blue → transparent`) appears below:
- All page hero `h1` elements (via `::after`)
- All section `h2` elements (via `::after`)
- Creates a Delft-inspired underline motif carried across the entire site

#### Card Elevation Language
All card types share a unified shadow and hover treatment:
- **Rest**: `box-shadow: 0 1px 3px rgba(31,61,115,0.06), 0 4px 16px rgba(31,61,115,0.04)`
- **Hover**: `translateY(-6px)` lift + deeper shadow
- **Easing**: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- Applied to: category cards, path cards, stockist cards, process step cards, carousel cards

#### Buttons
| Variant | Style |
|---------|-------|
| Primary | Ink-blue bg, white text, shadow, hover darkens + lifts |
| Secondary | White bg, ink-blue border + text, hover fills with ink-blue |

### Reusable Components

| Component | Class | Used On |
|-----------|-------|---------|
| Feature block (50/50) | `.feature-block` | Home, About |
| Feature block reversed | `.feature-block--reversed` | Home, About |
| Carousel | `.carousel-wrapper` + `.carousel-card` | Home (seasonal), About (exclusives) |
| Category card grid | `.category-grid` + `.category-card` | Collections, Exclusives |
| Path card | `.path-card` | Home (two-path) |
| Process step | `.process-step` | About (made by hand) |
| Stockist card | `.stockist-card` | Stockists |
| Narrative block | `.narrative-block` | Wholesale |
| Page hero | `.page-hero` | All inner pages |
| Video embed | `.feature-image--video` | About |
| Map embed | `.feature-image--map` | About |

---

## Page-by-Page Spec

### 1. Home Page

**Hero:** Full-width lifestyle image (desktop/mobile responsive via `<picture>`), gradient overlay, heading + subtext + CTA. Editorial feel, not e-commerce.

**Two-path intro:** Section heading "Two ways to discover our decorations", two cards side-by-side — "Shop on Etsy" (primary CTA) and "Venue Exclusives" (secondary CTA). White background.

**Seasonal carousel:** Mist-blue background with scallop waves. Centered heading + intro text + horizontally scrolling carousel of category cards (image + label). Left/right arrow buttons on desktop, swipeable on mobile.

**Exclusive decorations:** White background. Two alternating feature blocks (image/text, text/image) showcasing the landmark collection and handmade process.

**Bespoke teaser:** Mist-blue background with scallop waves. Centered text block with heading, description, and CTA.

**Instagram:** White background. Heading with `@roelofs_and_rubens` handle, subtitle, 4×2 grid of Instagram post thumbnails with hover zoom effect.

**Footer:** Ink-blue background, 4-column grid (Shop, Explore, Contact, Subscribe + social icons). Tagline with decorative separator.

---

### 2. Collections (Category Browse)

**Page hero:** Mist-blue with bottom scallop wave. Heading + description.

**Category grid:** White background. 3-column responsive grid of category cards (1:1 aspect ratio images, labels below). Cards link out to Etsy shop sections.

---

### 3. Exclusives (Category Browse)

**Page hero:** Mist-blue with bottom scallop wave. Heading + long description explaining these are stockist-only products. Italic note: "Available from participating stockists."

**Category catalogue:** White background. 3-column grid of category cards: Cathedrals, Castles, Museums, Chapels, Historic Houses, Landmarks.

---

### 4. Stockists

**Page hero:** Mist-blue with bottom scallop wave. Heading + description.

**Map section:** White background. Map placeholder (to be replaced with interactive Google Maps embed).

**Featured stockists:** Mist-blue with scallop waves. 3-column grid of stockist cards: Canterbury Cathedral, Tower of London, Hampton Court Palace, Edinburgh Castle, Stonehenge, Windsor Castle. Each with location and "View on map" CTA.

---

### 5. About

**Page hero:** Mist-blue with bottom scallop wave. Heading + founding story paragraph.

**Meet the founders + Delft blue:** White background. Two feature blocks combined in one section:
- Video embed (YouTube) left + "Meet the founders" text right
- "Delft blue... with a twist" text left + lifestyle image right (reversed)

**Made by hand:** Mist-blue with scallop waves. Centered heading + intro text. 3-column grid of process step cards (Shape, Paint, Fire & finish) with images and descriptions.

**Homegrown to studio:** White background. Feature block with team photo + text about growing from homegrown operation to studio.

**Did somebody say... exclusive?:** Mist-blue with scallop waves. Centered heading + intro paragraph. Carousel of 6 exclusive decoration images (Stonehenge, Tower Bridge, Big Ben, Buckingham Palace, Windsor Castle, King's Guard). Centered CTA: "See Exclusive Collection" → exclusives.html.

**Where to find us:** White background. Feature block with contact text (email, phone, CTA) left + Google Maps embed right.

---

### 6. Wholesale

**Page hero:** Mist-blue with bottom scallop wave. Heading + description.

**Do we wholesale?:** White background. Centered narrative block: "Yes, we do." + CTA.

**Already have an account?:** Mist-blue with scallop waves. Centered narrative block + "Log In" CTA.

**Trade fairs & events:** White background. Centered narrative block with upcoming event info.

---

## Technical Notes

### Platform: Odoo Standard (Hosted SaaS)
- **Odoo Website module** as the core — drag-and-drop page builder with pre-designed blocks, themes, and responsive design out of the box
- **No e-commerce module needed initially** — seasonal and main collection purchasing is handled entirely by Etsy
- **Custom pages** built using Odoo's block-based editor
- **Built-in forms** for Contact and Newsletter subscribe
- **Built-in SEO tools** — meta tags, clean URLs, sitemap generation, Google Analytics integration
- **Free SSL certificate** and hosting included with Odoo Standard
- **Custom domain** — point roelofsrubens.co.uk to the Odoo instance

### Odoo Modules to Consider

**Start with:**
- **Website** — the core page builder, blog, forms, SEO

**Add later if needed:**
- **eCommerce** — only if they eventually want to sell exclusives online direct, or bring seasonal sales back on-site
- **CRM** — track wholesale leads and trade fair contacts
- **Email Marketing** — newsletter campaigns (replaces any current Mailchimp/similar)
- **Inventory** — if they want to track stock levels across Etsy + stockists
- **Invoicing** — wholesale order billing
- **Events** — manage and promote trade fair appearances

### Exclusive Products — Data Management
The In-Store Exclusives section needs structured data for 100+ products. In Odoo, this can be handled by:
- **Option A: Odoo eCommerce module (unpublished products)** — create products in the eCommerce backend but don't enable the cart/checkout. Use product pages purely as a catalogue with a "Where to buy" section instead of an "Add to cart" button.
- **Option B: Static pages** — build each exclusive product as a standalone page.
- **Recommended: Option A** — it gives you filtering, categories, and structured data without needing to build custom templates.

### Etsy Integration Pattern
The Collections section doesn't need product data on-site. The pattern is:
1. User browses **category cards** on the R&R site (static pages in Odoo)
2. Tapping a category card opens the **Etsy shop filtered to that section** in a new tab
3. Example URL pattern: `https://www.etsy.com/uk/shop/roelofsrubens?section_id=XXXXXXX`

No Etsy API integration required — just outbound links.

### Stockist Map Implementation
- **Google Maps embed** — create a custom Google My Maps with all stockist pins, embed via iframe. Easy to update, free.
- **On product pages (exclusives)** — embed a single-pin Google Map showing where that specific product is sold.

### SEO & Migration Considerations
- **301 redirects** — redirect old WooCommerce product URLs to the corresponding Etsy listing URL. Redirect old category URLs to the new Odoo category pages.
- **Domain continuity** — keep roelofsrubens.co.uk and preserve existing Google authority
- **Odoo's built-in SEO** — use the meta tag editor, clean URL slugs, and XML sitemap
- **Structured data** — add LocalBusiness schema for the workshop/business
- **Alt text** — all product and category images should have descriptive alt text

---

## Content To Migrate

From the current site, the following content needs to be carried over:

1. **Product photography** — all exclusive decoration images (100+ products)
2. **Stockist data** — venue names, locations, links for the map(s)
3. **About copy** — founding story, bespoke process description
4. **Wholesale info** — contact details, T&Cs, trade fair dates
5. **Category imagery** — photos representing each category
6. **Legal pages** — Privacy policy, cookie policy, terms of sale, website user terms

---

## Success Metrics

The redesigned site should:
- Load significantly faster than the current WordPress/Elementor site
- Have a clear path from browsing → Etsy purchase (for collections) or → stockist location (for exclusives)
- Be easy for the business owners to update via Odoo's drag-and-drop editor
- Look and feel like a premium artisan brand — not a generic Odoo template
- Work beautifully on mobile (most craft/gift browsing is mobile)
- Keep the door open for future Odoo modules without re-platforming
