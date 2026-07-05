#!/usr/bin/env python3
"""
Convert all product pages from OSM iframe maps to Leaflet maps.
- Extracts lat/lng from existing iframe src (marker param)
- Moves buy link from stockist section into product description
- Replaces stockist section with Leaflet map + address/icon layout
- Adds Leaflet CSS+JS to <head>

Run from project root:
  python3 scripts/convert-to-leaflet.py
"""

import re
from pathlib import Path
from urllib.parse import parse_qs

BASE = Path(__file__).parent.parent
PRODUCTS = BASE / "products"

LEAFLET_CSS = '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />'
LEAFLET_JS  = '<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>'

SECTION_RE  = re.compile(
    r'<!-- ====== WHERE TO FIND IT ====== -->\n    <section class="product-stockist[^"]*"[^>]*>.*?</section>',
    re.DOTALL,
)
IFRAME_RE   = re.compile(r'src="https://www\.openstreetmap\.org/export/embed\.html\?([^"]+)"')
ADDRESS_RE  = re.compile(r'<p class="venue-address">(.*?)</p>', re.DOTALL)
BUY_LINK_RE = re.compile(r'href="([^"]+)"[^>]*>here</a>', re.IGNORECASE)
PROD_DESC_RE = re.compile(r'(<p class="product-description">.*?)(</p>)', re.DOTALL)


def build_leaflet_section(lat, lng, address):
    return (
        '<!-- ====== WHERE TO FIND IT ====== -->\n'
        '    <section class="product-stockist about-section--mist">\n'
        '      <div class="container">\n'
        '        <div class="product-stockist-layout reveal">\n'
        '          <div class="stockist-info">\n'
        '            <h2>Where to find it</h2>\n'
        '            <div class="venue-location">\n'
        '              <svg class="location-icon" width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">\n'
        '                <path d="M8 0C3.589 0 0 3.589 0 8c0 6 8 12 8 12s8-6 8-12C16 3.589 12.411 0 8 0z" fill="#1F3D73" opacity="0.7"/>\n'
        '                <circle cx="8" cy="8" r="3" fill="#fff"/>\n'
        '              </svg>\n'
        f'              <p class="venue-address">{address}</p>\n'
        '            </div>\n'
        '          </div>\n'
        f'          <div class="venue-map" id="product-map" data-lat="{lat}" data-lng="{lng}">\n'
        '            <div class="map-click-overlay"><span>Click to interact with map</span></div>\n'
        '          </div>\n'
        '        </div>\n'
        '      </div>\n'
        '    </section>'
    )


def add_buy_link(content, url):
    """Append buy link sentence to product description if not already present."""
    if 'You can buy these directly' in content:
        return content
    buy_sentence = (
        f' You can buy these directly from their website'
        f' <a href="{url}" target="_blank" rel="noopener noreferrer" class="inline-link">here</a>.'
    )
    def replacer(m):
        return m.group(1) + buy_sentence + m.group(2)
    updated, n = PROD_DESC_RE.subn(replacer, content, count=1)
    return updated if n else content


def add_leaflet_to_head(content):
    """Insert Leaflet CSS + JS after the main stylesheet link."""
    marker = '    <link rel="stylesheet" href="../css/styles.css" />'
    if LEAFLET_CSS in content:
        return content  # already added
    replacement = marker + '\n    ' + LEAFLET_CSS + '\n    ' + LEAFLET_JS
    return content.replace(marker, replacement, 1)


def process_file(path):
    content = path.read_text(encoding='utf-8')

    # Skip already converted
    if 'id="product-map"' in content:
        return False, 'already converted'

    # Skip old feature-block format (no venue data available)
    if 'feature-block' in content:
        return False, 'feature-block — skipped'

    section_m = SECTION_RE.search(content)
    if not section_m:
        return False, 'WHERE TO FIND IT section not matched'

    section_html = section_m.group()

    # ── Info-only pages (no iframe, no address) ──────────────────────────────
    if '<iframe' not in section_html:
        buy_m = BUY_LINK_RE.search(section_html)
        if not buy_m:
            return False, 'info-only, no buy link to move'
        updated = add_buy_link(content, buy_m.group(1))
        # Remove the description <p> from the stockist section, leave the rest
        updated = updated.replace(section_html,
            section_html[:section_html.find('<p>')] +
            section_html[section_html.rfind('</p>') + 4:])
        if updated == content:
            return False, 'info-only: no change made'
        path.write_text(updated, encoding='utf-8')
        return True, 'info-only: moved buy link'

    # ── Pages with OSM iframe ─────────────────────────────────────────────────
    iframe_m = IFRAME_RE.search(section_html)
    if not iframe_m:
        return False, 'iframe src not matched'

    params = parse_qs(iframe_m.group(1))
    marker = params.get('marker', [None])[0]
    if not marker:
        return False, 'no marker param in iframe src'
    lat, lng = marker.split(',')

    addr_m = ADDRESS_RE.search(section_html)
    if not addr_m:
        return False, 'venue-address not found'
    address = addr_m.group(1).strip()

    # Capitalise first letter of address if lowercase
    if address and address[0].islower():
        address = address[0].upper() + address[1:]

    buy_m = BUY_LINK_RE.search(section_html)
    buy_url = buy_m.group(1) if buy_m else None

    # Replace stockist section
    new_section = build_leaflet_section(lat, lng, address)
    updated = SECTION_RE.sub(new_section, content)
    if updated == content:
        return False, 'section substitution had no effect'

    # Move buy link into product description
    if buy_url:
        updated = add_buy_link(updated, buy_url)

    # Add Leaflet to <head>
    updated = add_leaflet_to_head(updated)

    path.write_text(updated, encoding='utf-8')
    return True, 'converted'


def main():
    files = sorted(PRODUCTS.glob('product-*.html'))
    ok = skip = 0
    for f in files:
        success, reason = process_file(f)
        if success:
            ok += 1
            print(f'  ✓  {f.name}  ({reason})')
        else:
            skip += 1
            print(f'  ⚠  {f.name}  — {reason}')

    print(f'\nDone — updated: {ok}  skipped: {skip}')


if __name__ == '__main__':
    main()
