/* ============================================
   Roelofs & Rubens — Homepage Interactions
   ============================================ */

(function () {
  "use strict";

  function init() {
  // --- Navbar hide/show on scroll ---
  const header = document.querySelector(".site-header");
  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateHeader() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 80) {
      // Scrolling down — hide
      header.classList.add("header-hidden");
    } else {
      // Scrolling up — show
      header.classList.remove("header-hidden");
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  });

  // --- Carousel ---
  const track = document.querySelector(".carousel-track");
  const prevBtn = document.querySelector(".carousel-prev");
  const nextBtn = document.querySelector(".carousel-next");

  if (track && prevBtn && nextBtn) {
    const scrollAmount = () => {
      const card = track.querySelector(".carousel-card");
      if (!card) return 300;
      return card.offsetWidth + 24; // card width + gap
    };

    prevBtn.addEventListener("click", () => {
      track.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
    });

    nextBtn.addEventListener("click", () => {
      track.scrollBy({ left: scrollAmount(), behavior: "smooth" });
    });
  }

  // --- Mobile Menu (full-screen overlay) ---
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.querySelector(".mobile-menu");
  const overlay = document.querySelector(".mobile-menu-overlay");
  const closeBtn = document.querySelector(".mobile-menu-close");

  function openMenu() {
    mobileMenu.classList.add("active");
    overlay.classList.add("active");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    mobileMenu.classList.remove("active");
    overlay.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  if (hamburger) {
    hamburger.addEventListener("click", openMenu);
  }
  if (closeBtn) {
    closeBtn.addEventListener("click", closeMenu);
  }
  if (overlay) {
    overlay.addEventListener("click", closeMenu);
  }

  // Close mobile menu on link click
  document.querySelectorAll(".mobile-menu a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close mobile menu on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("active")) {
      closeMenu();
    }
  });

  // --- Catalogue Subcategory Filter ---
  const filterSelect = document.getElementById("subcategory-filter");
  const countEl = document.getElementById("catalogue-count");

  if (filterSelect && countEl) {
    const catalogueH1 = document.querySelector(".catalogue-heading h1");
    const catalogueIntro = document.querySelector(".catalogue-heading .catalogue-intro");

    const categoryContent = {
      all: {
        title: "All Bespoke Decorations",
        intro: "Browse our complete catalogue of bespoke ceramic decorations, created for venues across the UK and beyond. Each piece is handmade in our Berkshire studio and available exclusively through its retailer."
      },
      cathedrals: {
        title: "Cathedrals &amp; Churches",
        intro: "Handmade ceramic decorations created exclusively for cathedrals, churches, abbeys and chapels across the UK and beyond. Each piece captures the architecture and character of its venue."
      },
      castles: {
        title: "Castles &amp; Landmarks",
        intro: "Handmade ceramic decorations capturing iconic castles, palaces, bridges and landmarks. Each piece is individually shaped and painted in our Berkshire studio, available exclusively through its venue."
      },
      museums: {
        title: "Museums &amp; Buildings",
        intro: "Handmade ceramic decorations created for museums, galleries, historic houses and cultural venues. Each design is crafted to capture the character of its building."
      },
      animals: {
        title: "Animals &amp; Objects",
        intro: "From Highland cows to rollercoasters, these handmade ceramic decorations capture the character and charm of animals, objects and curiosities found at venues across the UK."
      }
    };

    filterSelect.addEventListener("change", function () {
      const value = this.value;
      const cards = document.querySelectorAll(".product-card");
      let visible = 0;

      cards.forEach(function (card) {
        const sub = card.getAttribute("data-subcategory");
        if (value === "all" || sub === value) {
          card.style.display = "";
          visible++;
        } else {
          card.style.display = "none";
        }
      });

      countEl.textContent =
        visible + " decoration" + (visible !== 1 ? "s" : "");

      if (catalogueH1 && catalogueIntro && categoryContent[value]) {
        catalogueH1.innerHTML = categoryContent[value].title;
        catalogueIntro.textContent = categoryContent[value].intro;
      }
    });
  }

  // --- Product Image Gallery ---
  const thumbnails = document.querySelectorAll(".product-thumbnail");
  const mainImage = document.querySelector(".product-image-main img");

  if (thumbnails.length > 0 && mainImage) {
    thumbnails.forEach(function (thumb) {
      thumb.addEventListener("click", function () {
        thumbnails.forEach(function (t) {
          t.classList.remove("active");
        });
        thumb.classList.add("active");
        mainImage.src = thumb.querySelector("img").getAttribute("data-full");
        mainImage.alt = thumb.querySelector("img").alt;
      });
    });
  }

  // --- Stockists Map (Leaflet) ---
  const mapEl = document.getElementById("stockists-map");
  if (mapEl && typeof L !== "undefined") {
    const stockists = [
      {
        name: "Welford Park",
        city: "Welford, Newbury",
        county: "Berkshire",
        postcode: "RG20 8HU",
        lat: 51.456052,
        lng: -1.413604,
      },
      {
        name: "Loch Lomond Trading Co.",
        city: "Luss, Loch Lomond",
        county: "Argyll",
        postcode: "G83 8NN",
        lat: 56.10115,
        lng: -4.637231,
      },
      {
        name: "St Laurence Church",
        city: "Ludlow",
        county: "Shropshire",
        postcode: "SY8 1AN",
        lat: 52.368267,
        lng: -2.719545,
      },
      {
        name: "St Giles' Cathedral Shop",
        city: "Edinburgh",
        county: "",
        postcode: "EH1 1RE",
        lat: 55.949575,
        lng: -3.190897,
      },
      {
        name: "Helensburgh Cultural Centre",
        city: "Helensburgh",
        county: "Argyll",
        postcode: "G84 9LD",
        lat: 56.010123,
        lng: -4.737986,
      },
      {
        name: "St Machar's Cathedral",
        city: "Aberdeen",
        county: "",
        postcode: "AB24 1RQ",
        lat: 57.169395,
        lng: -2.100183,
      },
      {
        name: "Giulianotti",
        city: "Stonehaven",
        county: "",
        postcode: "AB39 2EQ",
        lat: 56.963852,
        lng: -2.209878,
      },
      {
        name: "Ingram Cafe",
        city: "Alnwick",
        county: "Northumberland",
        postcode: "NE66 4LT",
        lat: 55.4402,
        lng: -1.972813,
      },
      {
        name: "Grasmere Trading Co.",
        city: "Grasmere, Ambleside",
        county: "",
        postcode: "LA22 9SW",
        lat: 54.457842,
        lng: -3.024203,
      },
      {
        name: "Westmorland Limited",
        city: "Douglas, Lanark",
        county: "",
        postcode: "ML11 0RJ",
        lat: 55.58572,
        lng: -3.825562,
      },
      {
        name: "Timeless Art and Antiques",
        city: "Dunkeld",
        county: "",
        postcode: "PH8 0AH",
        lat: 56.565372,
        lng: -3.585611,
      },
      {
        name: "Farm Ness",
        city: "Inverness",
        county: "",
        postcode: "IV3 8JX",
        lat: 57.444672,
        lng: -4.293668,
      },
      {
        name: "Ness Gifts",
        city: "Dores, Inverness",
        county: "",
        postcode: "IV2 6TR",
        lat: 57.38217,
        lng: -4.332187,
      },
      {
        name: "The Old School Shop",
        city: "Aviemore",
        county: "",
        postcode: "PH22 1QH",
        lat: 57.17609,
        lng: -3.816343,
      },
      {
        name: "Ailsa Craig Gifts",
        city: "Maidens",
        county: "South Ayrshire",
        postcode: "KA26 9NS",
        lat: 55.335559,
        lng: -4.814073,
      },
      {
        name: "Islander UK / Baa Baa Sheep",
        city: "Edinburgh",
        county: "",
        postcode: "EH11 4DT",
        lat: 55.926576,
        lng: -3.300637,
      },
      {
        name: "The Found Gallery",
        city: "Dunbar",
        county: "",
        postcode: "EH42 1JH",
        lat: 56.0016,
        lng: -2.516009,
      },
    ];

    const map = L.map("stockists-map", {
      scrollWheelZoom: false,
    }).setView([55.5, -3.5], 6);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      },
    ).addTo(map);

    var pinIcon = L.divIcon({
      className: "stockist-pin",
      html: '<svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.268 21.732 0 14 0z" fill="#1F3D73"/><circle cx="14" cy="13" r="5" fill="#fff"/></svg>',
      iconSize: [28, 36],
      iconAnchor: [14, 36],
      popupAnchor: [0, -34],
    });

    stockists.forEach(function (s) {
      var location = s.city;
      if (s.county) location += ", " + s.county;
      var popup =
        "<strong>" +
        s.name +
        '</strong><span class="popup-address">' +
        location +
        "<br>" +
        s.postcode +
        "</span>";
      L.marker([s.lat, s.lng], { icon: pinIcon }).addTo(map).bindPopup(popup);
    });

    // Search/filter stockists
    var searchInput = document.getElementById("stockist-search");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        var query = this.value.toLowerCase().trim();
        var listEl = document.getElementById("stockist-list");
        if (!listEl) return;
        var cards = listEl.querySelectorAll(".stockist-card");
        cards.forEach(function (card) {
          var text = card.textContent.toLowerCase();
          card.style.display =
            !query || text.indexOf(query) !== -1 ? "" : "none";
        });
      });
    }
  }

  // --- Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll(".reveal, .reveal-stagger");

  if (revealElements.length > 0 && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    // Fallback: show everything if no IntersectionObserver
    revealElements.forEach((el) => el.classList.add("revealed"));
  }
  } // end init

  // Wait for components.js to inject header/footer, then initialise
  if (document.querySelector(".site-header")) {
    init();
  } else {
    document.addEventListener("componentsLoaded", init);
  }
})();
