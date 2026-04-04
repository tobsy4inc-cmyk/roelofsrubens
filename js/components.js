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
    navLink("trade.html", "Trade");

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
        '</div>' +
      '</div>' +
    '</footer>';

  // --- Cookie consent ---
  var COOKIE_KEY = "rr_cookies";

  function getCookieConsent() {
    try { return localStorage.getItem(COOKIE_KEY); } catch (e) { return null; }
  }

  function setCookieConsent(val) {
    try { localStorage.setItem(COOKIE_KEY, val); } catch (e) {}
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
    return (
      '<div class="cookie-banner" id="cookie-banner" role="region" aria-label="Cookie notice">' +
        '<p>We use cookies to improve your experience on our site. By continuing to browse, you agree to our use of cookies. <a href="' + p + 'terms.html">Terms &amp; Conditions</a></p>' +
        '<div class="cookie-banner-actions">' +
          '<button class="cookie-btn-accept" id="cookie-accept">Accept</button>' +
          '<button class="cookie-btn-decline" id="cookie-decline">Decline</button>' +
        '</div>' +
      '</div>'
    );
  }

  function initCookieBanner() {
    var consent = getCookieConsent();
    if (consent === "accepted") {
      activateMaps();
      return;
    }
    if (consent === "declined") {
      return;
    }
    // Show banner
    var div = document.createElement("div");
    div.innerHTML = buildCookieBanner();
    document.body.appendChild(div.firstChild);

    document.getElementById("cookie-accept").addEventListener("click", function () {
      setCookieConsent("accepted");
      document.getElementById("cookie-banner").remove();
      activateMaps();
    });

    document.getElementById("cookie-decline").addEventListener("click", function () {
      setCookieConsent("declined");
      document.getElementById("cookie-banner").remove();
    });
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
