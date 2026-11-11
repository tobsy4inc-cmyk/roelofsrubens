/* ============================================
   Roelofs & Rubens — Shared Header & Footer
   ============================================
   Single source of truth for header and footer markup.
   Auto-detects page depth for correct relative paths
   and applies the active nav class to the current page.
   ============================================ */

(function () {
  "use strict";

  // --- Path prefix calculation ---
  var path = window.location.pathname.toLowerCase();
  var depth = 0;
  if (path.indexOf("/products/") !== -1 || path.indexOf("/exclusives-pages/") !== -1 || path.indexOf("/bespoke-pages/") !== -1) {
    depth = 1;
  }
  var p = depth > 0 ? "../" : "";

  // --- Analytics bootstrap ---
  // Injected from here rather than added to each of the 173 HTML
  // files, because this script already runs synchronously in <head>
  // on every page and already knows the correct path prefix.
  // async = false preserves execution order: analytics-config.js
  // (generated at build time, carries the Measurement ID) must run
  // before analytics.js reads it.
  (function injectAnalytics() {
    var head = document.head || document.documentElement;
    if (!head) return;
    // terms.html loads components.js twice (head and body end). Without
    // this guard that would load GA twice and double-count every event.
    if (window.__RR_ANALYTICS_INJECTED__) return;
    window.__RR_ANALYTICS_INJECTED__ = true;
    var files = ["js/analytics-config.js", "js/analytics.js"];
    for (var i = 0; i < files.length; i++) {
      var s = document.createElement("script");
      s.src = p + files[i];
      s.async = false;
      head.appendChild(s);
    }
  })();

  // --- Active page detection ---
  var segments = window.location.pathname.split("/").filter(Boolean);
  var filename = segments[segments.length - 1] || "index.html";
  if (path.indexOf("/products/") !== -1 || path.indexOf("/exclusives-pages/") !== -1 || path.indexOf("/bespoke-pages/") !== -1) {
    filename = "bespoke.html";
  }
  if (filename === "exclusives.html") {
    filename = "bespoke.html";
  }

  function navLink(href, label) {
    var isActive = filename === href;
    return '<li><a href="' + p + href + '"' + (isActive ? ' class="active"' : "") + ">" + label + "</a></li>";
  }

  var navLinks =
    navLink("index.html", "Home") +
    navLink("collections.html", "Collections") +
    navLink("bespoke.html", "Bespoke") +
    navLink("about.html", "About") +
    navLink("trade.html", "Trade") +
    navLink("contact.html", "Contact us");

  // --- Header ---
  var headerHTML =
    '<header class="site-header">' +
      '<div class="header-top">' +
        '<div class="header-top-inner">' +
          '<div class="logo">' +
            '<a href="' + p + 'index.html">' +
              '<span class="logo-title">roelofs <span>&amp;</span> rubens</span>' +
              '<span class="logo-tagline"><span>unique ceramics</span></span>' +
            '</a>' +
          '</div>' +
          '<div class="header-search">' +
            '<svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
              '<circle cx="11" cy="11" r="8" />' +
              '<line x1="21" y1="21" x2="16.65" y2="16.65" />' +
            '</svg>' +
            '<input type="text" placeholder="Search" aria-label="Search" />' +
          '</div>' +
          '<button class="hamburger" aria-label="Open menu" aria-expanded="false">' +
            '<span></span><span></span><span></span>' +
          '</button>' +
        '</div>' +
      '</div>' +
      '<nav class="main-nav">' +
        '<ul class="nav-list">' + navLinks + '</ul>' +
      '</nav>' +
      '<div class="mobile-menu-overlay"></div>' +
      '<div class="mobile-menu">' +
        '<button class="mobile-menu-close" aria-label="Close menu">&times;</button>' +
        '<ul>' + navLinks + '</ul>' +
      '</div>' +
    '</header>';

  // --- Footer ---
  var footerHTML =
    '<footer class="site-footer">' +
      '<div class="container">' +
        '<div class="footer-grid">' +
          '<div class="footer-col">' +
            '<h4>Shop</h4>' +
            '<ul>' +
              '<li><a href="' + p + 'index.html">Home</a></li>' +
              '<li><a href="' + p + 'collections.html">Collections</a></li>' +
              '<li><a href="' + p + 'bespoke.html">Bespoke</a></li>' +
            '</ul>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4>Explore</h4>' +
            '<ul>' +
              '<li><a href="' + p + 'about.html">About</a></li>' +
              '<li><a href="' + p + 'trade.html">Trade</a></li>' +
              '<li><a href="' + p + 'terms.html">Terms &amp; Conditions</a></li>' +
            '</ul>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4>Contact</h4>' +
            '<ul>' +
              '<li><a href="mailto:info@roelofsrubens.co.uk">info@roelofsrubens.co.uk</a></li>' +
              '<li><a href="tel:+441488668154">+44 (0)1488 668154</a></li>' +
            '</ul>' +
          '</div>' +
          '<div class="footer-col">' +
            '<div class="social-icons">' +
              '<a href="https://www.instagram.com/roelofs_and_rubens?igsh=MTJoeXo5MjhzNjB1eA==" class="social-circle" aria-label="Instagram" target="_blank" rel="noopener">' +
                '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                  '<rect x="2" y="2" width="20" height="20" rx="5" ry="5" />' +
                  '<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />' +
                  '<line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />' +
                '</svg>' +
              '</a>' +
              '<a href="https://www.facebook.com/share/1Keno32gbP/?mibextid=wwXIfr" class="social-circle" aria-label="Facebook" target="_blank" rel="noopener">' +
                '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                  '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />' +
                '</svg>' +
              '</a>' +
              '<a href="https://www.tiktok.com/@roelofsandrubens?_r=1&_t=ZN-957Qx8RfaxK" class="social-circle" aria-label="TikTok" target="_blank" rel="noopener">' +
                '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">' +
                  '<path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05z" />' +
                '</svg>' +
              '</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<p class="footer-tagline">Handmade ceramic decorations, designed in Berkshire.</p>' +
        '<div class="footer-bottom">' +
          '<p>&copy; 2026 Roelofs &amp; Rubens. All rights reserved.</p>' +
          '<div class="footer-legal">' +
            '<button type="button" class="footer-cookie-btn" id="cookie-settings">Cookie settings</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</footer>';

  // --- Shared SVGs ---
  var prevArrowSVG =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<polyline points="15 18 9 12 15 6" />' +
    '</svg>';

  var nextArrowSVG =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<polyline points="9 18 15 12 9 6" />' +
    '</svg>';

  // --- Bespoke Teaser Component ---
  // Placeholder: <div id="bespoke-teaser" data-body="..." data-btn-text="..." data-btn-href="..."></div>
  function buildBespokeTeaser(el) {
    var body = el.getAttribute("data-body") || "";
    var btnText = el.getAttribute("data-btn-text") || "Get in Touch";
    var btnHref = el.getAttribute("data-btn-href") || p + "trade.html";
    return (
      '<section class="bespoke-teaser">' +
        '<div class="container">' +
          '<div class="bespoke-inner reveal">' +
            '<h2>Looking for something bespoke?</h2>' +
            '<p>' + body + '</p>' +
            '<a href="' + btnHref + '" class="btn btn-primary">' + btnText + '</a>' +
          '</div>' +
        '</div>' +
      '</section>'
    );
  }

  // --- Contact Block Component ---
  // Placeholder: <div id="contact-block" data-heading="..." data-body="..."></div>
  // Map loads only after cookie consent is given.
  function buildContactBlock(el) {
    var heading = el.getAttribute("data-heading") || "Get in touch";
    var body = el.getAttribute("data-body") || "";
    var btnText = el.getAttribute("data-btn-text") || "Contact us";
    var mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d79468.27246417992!2d-1.4!3d51.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4876a5649c5b5281%3A0x48a3b1c82b912e15!2sNewbury%2C%20UK!5e0!3m2!1sen!2suk!4v1";
    var mapContent = getConsent() === GRANTED
      ? '<iframe src="' + mapSrc + '" width="100%" height="100%" style="border:0" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Roelofs &amp; Rubens location"></iframe>'
      : '<div class="map-consent-gate" data-map-src="' + mapSrc + '"><div class="map-consent-inner"><p>Accept cookies to view the interactive map.</p></div></div>';
    return (
      '<section class="about-section">' +
        '<div class="container">' +
          '<div class="feature-block reveal">' +
            '<div class="feature-text">' +
              '<h2>' + heading + '</h2>' +
              '<p>' + body + '</p>' +
              '<div class="location-details">' +
                '<p><strong>Email</strong><br /><a href="mailto:info@roelofsrubens.co.uk">info@roelofsrubens.co.uk</a></p>' +
                '<p><strong>Phone</strong><br /><a href="tel:+441488668154">+44 (0)1488 668154</a></p>' +
              '</div>' +
              '<a href="mailto:info@roelofsrubens.co.uk" class="btn btn-primary">' + btnText + '</a>' +
            '</div>' +
            '<div class="feature-image feature-image--map">' +
              mapContent +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>'
    );
  }

  // --- Carousel Component ---
  // Placeholder: <div class="carousel-component" data-items='[{"img":"...","alt":"...","label":"...","href":"..."}]'></div>
  function buildCarousel(el) {
    var items = [];
    try {
      items = JSON.parse(el.getAttribute("data-items") || "[]");
    } catch (e) {
      return "";
    }
    if (!items.length) return "";

    var cards = "";
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var tag = item.href ? "a" : "div";
      var hrefAttr = item.href ? ' href="' + item.href + '"' : "";
      var targetAttr = item.href && item.href.indexOf("http") === 0 ? ' target="_blank" rel="noopener"' : "";
      cards +=
        '<' + tag + ' class="carousel-card"' + hrefAttr + targetAttr + '>' +
          '<div class="card-image">' +
            '<img src="' + (item.img || "") + '" alt="' + (item.alt || "") + '" loading="lazy" />' +
          '</div>' +
          '<p class="card-label">' + (item.label || "") + '</p>' +
        '</' + tag + '>';
    }

    return (
      '<div class="carousel-wrapper reveal">' +
        '<button class="carousel-btn carousel-prev" aria-label="Previous">' + prevArrowSVG + '</button>' +
        '<div class="carousel-track">' + cards + '</div>' +
        '<button class="carousel-btn carousel-next" aria-label="Next">' + nextArrowSVG + '</button>' +
      '</div>'
    );
  }

  // --- Cookie consent (UK GDPR / PECR) ---
  // The key is versioned. The previous banner ("rr_cookies") relied on
  // implied consent and never mentioned analytics, so an old "accepted"
  // cannot be carried over to GA4 — every visitor is asked once more
  // against the explicit wording below.
  var CONSENT_KEY = "rr_consent_v1";
  var GRANTED = "granted";
  var DENIED = "denied";

  // Element that opened the banner, so focus can be returned to it.
  var consentTrigger = null;

  function getConsent() {
    try {
      var val = localStorage.getItem(CONSENT_KEY);
      return val === GRANTED || val === DENIED ? val : null;
    } catch (e) {
      return null;
    }
  }

  function storeConsent(val) {
    try { localStorage.setItem(CONSENT_KEY, val); } catch (e) {}
  }

  // Records the choice and applies it immediately — no reload needed.
  function applyConsent(val) {
    storeConsent(val);
    try {
      if (window.RRAnalytics && window.RRAnalytics.setConsent) {
        window.RRAnalytics.setConsent(val === GRANTED);
      }
    } catch (e) {}
    if (val === GRANTED) {
      activateMaps();
    }
  }

  function activateMaps() {
    var gates = document.querySelectorAll(".map-consent-gate");
    for (var i = 0; i < gates.length; i++) {
      var src = gates[i].getAttribute("data-map-src");
      if (src) {
        var iframe = document.createElement("iframe");
        iframe.src = src;
        iframe.width = "100%";
        iframe.height = "100%";
        iframe.style.border = "0";
        iframe.setAttribute("allowfullscreen", "");
        iframe.setAttribute("loading", "lazy");
        iframe.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
        iframe.setAttribute("title", "Roelofs & Rubens location — near Newbury, Berkshire");
        gates[i].outerHTML = iframe.outerHTML;
      }
    }
  }

  function buildCookieBanner() {
    var current = getConsent();
    var status = "";
    if (current === GRANTED) {
      status = '<span class="cookie-banner-status">You currently accept analytics cookies.</span> ';
    } else if (current === DENIED) {
      status = '<span class="cookie-banner-status">You currently reject analytics cookies.</span> ';
    }
    return (
      '<div class="cookie-banner" id="cookie-banner" role="dialog" aria-modal="false" aria-labelledby="cookie-banner-title" aria-describedby="cookie-banner-text">' +
        '<h2 class="visually-hidden" id="cookie-banner-title">Cookie choices</h2>' +
        '<p id="cookie-banner-text">' + status +
          'We\'d like to set Google Analytics cookies to measure how the site is used, ' +
          'and to load the Google map on our contact page. Nothing is set unless you accept. ' +
          '<a href="' + p + 'terms.html">Terms &amp; Conditions</a></p>' +
        '<div class="cookie-banner-actions">' +
          '<button type="button" class="cookie-btn cookie-btn-accept" id="cookie-accept">Accept</button>' +
          '<button type="button" class="cookie-btn cookie-btn-reject" id="cookie-reject">Reject</button>' +
        '</div>' +
      '</div>'
    );
  }

  function closeCookieBanner() {
    var banner = document.getElementById("cookie-banner");
    if (banner && banner.parentNode) {
      banner.parentNode.removeChild(banner);
    }
    if (consentTrigger) {
      try { consentTrigger.focus(); } catch (e) {}
      consentTrigger = null;
    }
  }

  // trigger: the element that opened the banner (the footer button),
  // or undefined on the first-visit automatic prompt.
  function showCookieBanner(trigger) {
    if (document.getElementById("cookie-banner")) return;
    consentTrigger = trigger || null;

    var wrap = document.createElement("div");
    wrap.innerHTML = buildCookieBanner();
    document.body.appendChild(wrap.firstChild);

    document.getElementById("cookie-accept").addEventListener("click", function () {
      applyConsent(GRANTED);
      closeCookieBanner();
    });

    document.getElementById("cookie-reject").addEventListener("click", function () {
      applyConsent(DENIED);
      closeCookieBanner();
    });

    // Only pull focus when the visitor asked for the banner. On first
    // visit, stealing focus would hijack the page. There is deliberately
    // no focus trap and no Escape-to-close: dismissing the banner must
    // never be read as a choice either way.
    if (trigger) {
      try { document.getElementById("cookie-accept").focus(); } catch (e) {}
    }
  }

  function initCookieBanner() {
    // Only prompt when no choice has been recorded yet.
    if (getConsent() === null) {
      showCookieBanner();
    }

    var settingsBtn = document.getElementById("cookie-settings");
    if (settingsBtn) {
      settingsBtn.addEventListener("click", function () {
        showCookieBanner(settingsBtn);
      });
    }
  }

  // --- Inject once DOM is ready ---
  function inject() {
    var headerEl = document.getElementById("site-header");
    if (headerEl) {
      headerEl.outerHTML = headerHTML;
    }

    var footerEl = document.getElementById("site-footer");
    if (footerEl) {
      footerEl.outerHTML = footerHTML;
    }

    // Bespoke teaser
    var teaserEl = document.getElementById("bespoke-teaser");
    if (teaserEl) {
      teaserEl.outerHTML = buildBespokeTeaser(teaserEl);
    }

    // Contact block
    var contactEl = document.getElementById("contact-block");
    if (contactEl) {
      contactEl.outerHTML = buildContactBlock(contactEl);
    }

    // Carousels
    var carouselEls = document.querySelectorAll(".carousel-component");
    for (var i = 0; i < carouselEls.length; i++) {
      var html = buildCarousel(carouselEls[i]);
      if (html) {
        carouselEls[i].outerHTML = html;
      }
    }

    initCookieBanner();

    // Signal to main.js that components are ready
    document.dispatchEvent(new Event("componentsLoaded"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
