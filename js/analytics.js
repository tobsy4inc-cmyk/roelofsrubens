/* ============================================
   Roelofs & Rubens — Analytics (GA4)
   ============================================
   Single source of truth for all site tracking.

   Loaded by js/components.js on every page, straight
   after js/analytics-config.js (which is generated at
   build time and carries the Measurement ID).

   Design rules:
   - GA only ever loads when analytics-config.js says
     enabled === true. That file is written by
     scripts/build-analytics-config.js and is only
     enabled for VERCEL_ENV=production builds, so local
     dev and preview deployments never send data.
   - Google Consent Mode v2 defaults everything to
     "denied". Nothing is stored until the visitor
     accepts in the cookie banner.
   - Every public method is wrapped in try/catch. If GA
     is blocked, failed to load, or consent was refused,
     tracking calls do nothing and never throw.
   ============================================ */

(function () {
  "use strict";

  // Second line of defence against this file being loaded twice, which
  // would otherwise register the click listener twice and double-count.
  if (window.RRAnalytics) return;

  var CONSENT_KEY = "rr_consent_v1";
  var GRANTED = "granted";

  var cfg = window.__RR_ANALYTICS__ || {};
  var gaId = cfg.gaId || null;

  // ?ga_debug=1 on a live URL surfaces the session in GA4 DebugView.
  // Verified against the live property: passing debug_mode through
  // gtag("config", ...) is NOT honoured — events still arrive without the
  // debug flag and DebugView stays empty. It only works when set on each
  // individual event, so track() adds it to every event's params below.
  var debugMode = /[?&]ga_debug=1(&|$)/.test(window.location.search);

  // --- Helpers ---------------------------------------------------------

  function readConsent() {
    try {
      return localStorage.getItem(CONSENT_KEY);
    } catch (e) {
      return null;
    }
  }

  // Never report from a dev machine, even if a config file
  // with enabled:true somehow got committed.
  function isLocalHost() {
    var h = (window.location.hostname || "").toLowerCase();
    return (
      h === "" ||
      h === "localhost" ||
      h === "127.0.0.1" ||
      h === "[::1]" ||
      /\.local$/.test(h) ||
      /\.localhost$/.test(h)
    );
  }

  function closest(el, selector) {
    if (!el || !selector) return null;
    var node = el.nodeType === 1 ? el : el.parentElement;
    if (!node || !node.closest) return null;
    try {
      return node.closest(selector);
    } catch (e) {
      return null;
    }
  }

  // GA4 rejects undefined/null param values — drop them.
  function clean(params) {
    var out = {};
    if (!params) return out;
    for (var key in params) {
      if (!Object.prototype.hasOwnProperty.call(params, key)) continue;
      var val = params[key];
      if (val === undefined || val === null || val === "") continue;
      out[key] = val;
    }
    return out;
  }

  // --- Bootstrap -------------------------------------------------------

  var active = cfg.enabled === true && !!gaId && !isLocalHost();

  function gtagPush() {
    window.dataLayer.push(arguments);
  }

  if (active) {
    try {
      window.dataLayer = window.dataLayer || [];
      if (typeof window.gtag !== "function") {
        window.gtag = gtagPush;
      }

      // Consent Mode v2 — denied by default. This MUST be queued
      // before gtag.js is requested, which is why the script tag
      // below is appended last.
      window.gtag("consent", "default", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "denied",
        wait_for_update: 500,
      });

      window.gtag("js", new Date());

      // GA4 anonymises IPs by default and ignores anonymize_ip; it is kept
      // as an explicit statement of intent, not because it changes behaviour.
      var configParams = { anonymize_ip: true };
      // Kept so the page_view that config emits is also flagged, even though
      // on its own this is not enough — see the debugMode note above.
      if (debugMode) {
        configParams.debug_mode = true;
      }
      window.gtag("config", gaId, configParams);

      // Returning visitor who already opted in — lift consent now.
      if (readConsent() === GRANTED) {
        window.gtag("consent", "update", { analytics_storage: "granted" });
      }

      var tag = document.createElement("script");
      tag.async = true;
      tag.src =
        "https://www.googletagmanager.com/gtag/js?id=" +
        encodeURIComponent(gaId);
      (document.head || document.documentElement).appendChild(tag);
    } catch (e) {
      active = false;
    }
  }

  // --- Public API ------------------------------------------------------

  function track(name, params) {
    if (!active || !name) return;
    try {
      var payload = clean(params);
      // Per-event, because config-level debug_mode does not reach the wire.
      if (debugMode) {
        payload.debug_mode = true;
      }
      window.gtag("event", name, payload);
    } catch (e) {
      /* analytics must never break the page */
    }
  }

  function setConsent(granted) {
    if (!active) return;
    try {
      window.gtag("consent", "update", {
        analytics_storage: granted ? "granted" : "denied",
      });
    } catch (e) {
      /* no-op */
    }
  }

  // --- Etsy outbound clicks -------------------------------------------
  // GA4 enhanced measurement already logs a generic outbound `click`.
  // This adds a named event with the placement, so we can tell which
  // part of the site actually drives traffic to the shop.

  function etsyLocation(link) {
    if (closest(link, ".site-header")) return "header";
    if (closest(link, ".site-footer")) return "footer";
    if (closest(link, "section.seasonal") && closest(link, ".carousel-card")) {
      return "home_carousel";
    }
    if (
      closest(link, ".collections-categories") &&
      closest(link, ".category-card")
    ) {
      return "collections_category_grid";
    }
    if (closest(link, ".page-hero-intro")) return "collections_hero";
    if (closest(link, ".product-description")) return "product_description";
    if (closest(link, ".carousel-card")) return "carousel";

    var section = closest(link, "section[class]");
    if (section && section.className) {
      var first = String(section.className).split(/\s+/)[0];
      if (first) return first;
    }
    return "unknown";
  }

  function isEtsyHost(host) {
    host = (host || "").toLowerCase();
    return host === "etsy.com" || /\.etsy\.com$/.test(host);
  }

  function onDocumentClick(ev) {
    var link = closest(ev.target, "a[href]");
    if (!link) return;
    if (!isEtsyHost(link.hostname)) return;
    track("etsy_click", {
      link_url: link.href,
      link_location: etsyLocation(link),
    });
  }

  // Capture phase, so we still record the click even if something
  // downstream calls stopPropagation().
  try {
    document.addEventListener("click", onDocumentClick, true);
  } catch (e) {
    /* no-op */
  }

  // --- Exported surface ------------------------------------------------

  window.RRAnalytics = {
    track: track,
    setConsent: setConsent,
    isActive: function () {
      return active;
    },
    trackEtsyClick: function (data) {
      data = data || {};
      track("etsy_click", {
        link_url: data.link_url,
        link_location: data.link_location,
      });
    },
    trackStockistClick: function (data) {
      data = data || {};
      track("stockist_click", {
        stockist_name: data.stockist_name,
        link_url: data.link_url,
        product_name: data.product_name,
      });
    },
    trackStockistMapInteraction: function (data) {
      data = data || {};
      track("stockist_map_interaction", {
        interaction_type: data.interaction_type,
        stockist_name: data.stockist_name,
        product_name: data.product_name,
        search_term: data.search_term,
      });
    },
  };
})();
