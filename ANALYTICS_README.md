# Google Analytics 4 Setup

GA4 is wired into this static site via `js/analytics.js`, behind a Google
Consent Mode v2 cookie banner. It exists to give a behavioural baseline
before the redesign — specifically, which placements send people to Etsy
and how people use the stockist content.

## How it fits together

| File | Role |
|---|---|
| `scripts/build-analytics-config.js` | Build step. Reads `GA_MEASUREMENT_ID` and `VERCEL_ENV`, writes `js/analytics-config.js`. |
| `js/analytics-config.js` | **Generated — do not edit.** Carries the Measurement ID and an `enabled` flag. Committed in a disabled state. |
| `js/analytics.js` | The tracking helper. Consent Mode defaults, gtag loader, and all event functions. |
| `js/components.js` | Injects the two scripts above into `<head>`, and owns the consent banner. |
| `js/main.js` | Calls the helper for stockist events. |

The Measurement ID is **never hardcoded**. It is read from an environment
variable at build time only.

No HTML files are involved. `js/components.js` already runs synchronously in
the `<head>` of all 173 pages, so it injects the analytics scripts itself —
which is why adding GA4 did not require editing every page the way the
Speed Insights integration did.

## Production only

GA loads only when **both** are true at build time:

- `VERCEL_ENV === "production"` — so preview deployments and local builds never send data
- `GA_MEASUREMENT_ID` is set and looks like a GA4 ID (`G-…`)

If the build never runs, the committed `js/analytics-config.js` leaves GA
disabled, so the failure mode is "no tracking", never a broken page.
`js/analytics.js` additionally refuses to start on `localhost` / `127.0.0.1`.

## Vercel setup

1. **Settings → Environment Variables**
   - Key: `GA_MEASUREMENT_ID`
   - Value: your `G-XXXXXXXXXX` ID
   - Environment: **Production only** (leave Preview and Development unticked)
2. **Settings → Build & Deployment → Build Command** must be `npm run build`.
3. Redeploy. The build log will print either
   `✓ Analytics config written — GA4 ENABLED (G-…)` or a line saying why it is disabled.

## Consent

- Banner appears on first visit. Nothing is stored until the visitor chooses.
- Choice is kept in `localStorage` under **`rr_consent_v1`** (`granted` / `denied`).
- Consent Mode v2 defaults all four signals (`analytics_storage`, `ad_storage`,
  `ad_user_data`, `ad_personalization`) to `denied` before gtag.js is requested.
- Accepting also un-gates the Google Maps embed on the contact block.
- The footer **"Cookie settings"** button reopens the banner so a choice can be changed.

The key is versioned (`_v1`) because the previous banner used implied consent
and never mentioned analytics, so old choices could not carry over.

## Events

All tracking goes through `window.RRAnalytics`. Every call is wrapped in
try/catch — if GA is blocked or consent was refused, nothing happens and
nothing breaks.

| Event | Fires when | Parameters |
|---|---|---|
| `etsy_click` | Any `etsy.com` link is clicked | `link_url`, `link_location` |
| `stockist_click` | Retailer link in a product description is clicked | `stockist_name`, `link_url`, `product_name` |
| `stockist_map_interaction` | Product venue map is unlocked | `interaction_type: "map_unlock"`, `stockist_name`, `product_name` |
| `stockist_map_interaction` | Stockists-map marker is clicked | `interaction_type: "marker_click"`, `stockist_name` |
| `stockist_map_interaction` | Stockist search is used (debounced 700ms) | `interaction_type: "search"`, `search_term` |
| `stockist_click` | Stockist card link is clicked | `stockist_name`, `link_url` |

`link_location` values: `home_carousel`, `collections_hero`,
`collections_category_grid`, `header`, `footer`, `product_description`,
`carousel`, or the nearest section's class name as a fallback.

The last three rows are **dormant**: the stockists map section is not
currently on the site (it lives in `archive/collections-stockists-section.html`).
The tracking is already wired, so it starts reporting by itself if that
section is restored.

GA4 enhanced measurement separately records a generic outbound `click` event.
`etsy_click` is additive — it adds the per-placement breakdown that the
automatic event cannot give.

## Adding a new event

Add a method to `js/analytics.js` next to the existing ones, then call it via
`window.RRAnalytics`. Keep call sites guarded:

```js
const a = window.RRAnalytics;
if (a) a.track("my_event", { some_param: "value" });
```

## Verifying after deploy

1. **Realtime** — GA4 → Reports → Realtime. Load the live site, accept cookies,
   and confirm your visit appears within ~30s. If it does not, check the build
   log line from step 3 above.
2. **DebugView** — append `?ga_debug=1` to any live URL. That sets
   `debug_mode`, so the session shows in GA4 → Admin → DebugView, where you can
   inspect individual events and their parameters.
3. **Check consent actually gates** — in a private window, open the site and
   *reject*. In DevTools → Application → Cookies there should be **no `_ga`
   cookie**. Accept, and `_ga` should appear.
4. **Check the events** — with `?ga_debug=1` active:
   - Click an Etsy card on the homepage → `etsy_click`, `link_location: home_carousel`
   - Click the Etsy link in the collections hero → `etsy_click`, `link_location: collections_hero`
   - Click a collections category card → `etsy_click`, `link_location: collections_category_grid`
   - Open any product page, click "Click to interact with map" → `stockist_map_interaction`
   - Click the retailer link in a product description → `stockist_click` with the venue name
5. **Confirm preview deploys are clean** — open a preview deployment URL and
   confirm there is no request to `googletagmanager.com` in the Network tab.
6. **Register the custom parameters** — GA4 → Admin → Custom definitions. Add
   `link_location`, `stockist_name`, `interaction_type`, `product_name` and
   `search_term` as custom dimensions (event-scoped), otherwise they are
   collected but not reportable. Data only accrues from the point you add them.
