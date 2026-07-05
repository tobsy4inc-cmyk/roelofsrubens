#!/usr/bin/env python3
"""
Geocode venue addresses from decoration-descriptions.md and update
the 'Where to find it' section in every bespoke product page.

Run from the project root:
  python3 scripts/update-stockist-sections.py
"""

import re, json, time, os, sys
import urllib.request, urllib.parse
from pathlib import Path

BASE       = Path(__file__).parent.parent
PRODUCTS   = BASE / "products"
MD_FILE    = Path("/Users/Toby-personal/Downloads/decoration-descriptions.md")
CACHE_FILE = BASE / "scripts/geocode-cache.json"

# ---------------------------------------------------------------------------
# 1. Parse markdown table
# ---------------------------------------------------------------------------

def parse_markdown(path):
    entries = []
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line.startswith("|") or "|---|" in line or line.startswith("| Decoration"):
                continue
            parts = [p.strip() for p in line.split("|")]
            parts = [p for p in parts if p]
            if len(parts) < 3:
                continue
            name, address, description = parts[0], parts[1], parts[2]
            entries.append({"name": name, "address": address, "description": description})
    return entries

# ---------------------------------------------------------------------------
# 2. Name → product slug
# ---------------------------------------------------------------------------

def name_to_slug(name):
    s = name.lower()
    s = s.replace("\u2019", "").replace("'", "")
    s = s.replace(" & ", " and ").replace("&", "and")
    s = re.sub(r"[^a-z0-9\s]", "", s)
    s = re.sub(r"\s+", "-", s.strip())
    return s

def get_slug(entry):
    name, addr = entry["name"], entry["address"].lower()
    # Two "Big Ben" rows: Brand Academy vs Houses of Parliament
    if name == "Big Ben":
        return "elizabeth-tower" if "parliament" in addr else "big-ben"
    return name_to_slug(name)

# ---------------------------------------------------------------------------
# 3. Geocode via Nominatim (free, no key needed — max 1 req/s)
# ---------------------------------------------------------------------------

SKIP_ADDRESSES = {"—", ""}
VAGUE_KEYWORDS = {"the 007 gift shop", "the university of edinburgh, scotland",
                  "the university of edinburgh, scotland"}

def geocode(address):
    if address in SKIP_ADDRESSES:
        return None
    if any(v in address.lower() for v in VAGUE_KEYWORDS):
        return None

    # Prefer UK postcode (very accurate); fall back to full address string
    uk = re.search(r"\b([A-Z]{1,2}\d[\d A-Z]?\s*\d[A-Z]{2})\b", address)
    query = uk.group(1).strip() if uk else address

    # Detect country code hints
    country = "gb"
    if any(k in address.lower() for k in ("netherlands", "nederland")):
        country = "nl"
    elif "iceland" in address.lower():
        country = "is"
    elif any(k in address.lower() for k in ("united states", "usa", "north carolina")):
        country = "us"
    elif "falkland" in address.lower():
        country = ""      # let Nominatim figure it out

    params = {"q": query, "format": "json", "limit": 1}
    if country:
        params["countrycodes"] = country

    url = "https://nominatim.openstreetmap.org/search?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "RoelofsRubens-website/1.0 (info@roelofsrubens.co.uk)"}
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
        if data:
            return [float(data[0]["lat"]), float(data[0]["lon"])]
    except Exception as e:
        print(f"    Geocode error for '{query}': {e}", file=sys.stderr)
    return None

# ---------------------------------------------------------------------------
# 4. Build HTML helpers
# ---------------------------------------------------------------------------

def md_link_to_html(text):
    """Convert [text](url) markdown links to HTML anchor tags."""
    return re.sub(
        r"\[([^\]]+)\]\(([^)]+)\)",
        r'<a href="\2" target="_blank" rel="noopener noreferrer">\1</a>',
        text,
    )

def osm_embed_url(lat, lng, margin=0.008):
    bbox = f"{lng - margin},{lat - margin},{lng + margin},{lat + margin}"
    return f"https://www.openstreetmap.org/export/embed.html?bbox={bbox}&layer=mapnik&marker={lat},{lng}"

def build_section(entry):
    desc = md_link_to_html(entry["description"])
    address = entry["address"].strip()
    has_address = address not in SKIP_ADDRESSES
    coords = entry.get("coords")

    if coords:
        lat, lng = coords
        iframe_src = osm_embed_url(lat, lng)
        map_block = f"""\
          <div class="venue-map">
            <iframe
              title="Map showing venue location"
              src="{iframe_src}"
              loading="lazy"
            ></iframe>
          </div>"""
        wrapper = "product-stockist-layout reveal"
    else:
        map_block = ""
        wrapper = "stockist-info-only reveal"

    address_block = (
        f'\n            <p class="venue-address">{address}</p>'
        if has_address else ""
    )

    map_indent = f"\n{map_block}" if map_block else ""

    return (
        '<!-- ====== WHERE TO FIND IT ====== -->\n'
        '    <section class="product-stockist about-section--mist">\n'
        '      <div class="container">\n'
        f'        <div class="{wrapper}">\n'
        '          <div class="stockist-info">\n'
        '            <h2>Where to find it</h2>\n'
        f'            <p>{desc}</p>'
        f'{address_block}\n'
        '          </div>'
        f'{map_indent}\n'
        '        </div>\n'
        '      </div>\n'
        '    </section>'
    )

# ---------------------------------------------------------------------------
# 5. Update a product HTML file
# ---------------------------------------------------------------------------

SECTION_RE = re.compile(
    r'<!-- ====== WHERE TO FIND IT ====== -->\n    <section class="product-stockist[^"]*"[^>]*>.*?</section>',
    re.DOTALL,
)

def update_file(slug, new_section):
    path = PRODUCTS / f"product-{slug}.html"
    if not path.exists():
        print(f"  ⚠  File not found: product-{slug}.html")
        return False
    with open(path, encoding="utf-8") as f:
        content = f.read()
    updated = SECTION_RE.sub(new_section, content)
    if updated == content:
        print(f"  ⚠  Pattern not found in product-{slug}.html")
        return False
    with open(path, "w", encoding="utf-8") as f:
        f.write(updated)
    return True

# ---------------------------------------------------------------------------
# 6. Main
# ---------------------------------------------------------------------------

def main():
    entries = parse_markdown(MD_FILE)
    print(f"Parsed {len(entries)} entries from markdown\n")

    # Load geocode cache
    cache = {}
    if CACHE_FILE.exists():
        with open(CACHE_FILE, encoding="utf-8") as f:
            cache = json.load(f)

    # Geocode any address not yet cached
    for entry in entries:
        addr = entry["address"]
        if addr in cache:
            entry["coords"] = cache[addr]
            continue
        print(f"Geocoding: {entry['name']}")
        result = geocode(addr)
        cache[addr] = result
        entry["coords"] = result
        print(f"  → {result}")
        time.sleep(1.1)   # Nominatim rate limit

    # Persist cache
    with open(CACHE_FILE, "w", encoding="utf-8") as f:
        json.dump(cache, f, indent=2)
    print(f"\nGeocoding complete — cache saved to {CACHE_FILE.name}\n")

    # Update product pages
    ok, skip = 0, 0
    for entry in entries:
        slug = get_slug(entry)
        section = build_section(entry)
        if update_file(slug, section):
            ok += 1
        else:
            skip += 1

    print(f"\nDone — updated: {ok}  skipped/not found: {skip}")

if __name__ == "__main__":
    main()
