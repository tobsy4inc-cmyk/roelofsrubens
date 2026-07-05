#!/usr/bin/env python3
"""
Update bespoke decoration product images on R&R website.

Copies images from Desktop source folders into assets/images/products/,
updates all product pages and bespoke category listing pages, and
deletes product pages that have no matching image.

Run from project root:
    python3 scripts/update-bespoke-images.py
"""

import os
import re
import shutil
from pathlib import Path

# ── Paths ────────────────────────────────────────────────────────────────────

PROJECT_DIR = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
DESKTOP_BASE = "/Users/Toby-personal/Desktop/R&R/Bespoke Images"
C  = os.path.join(DESKTOP_BASE, "Castles, Museums, Buildings & Places")
CH = os.path.join(DESKTOP_BASE, "Churches, Cathedrals, Abbeys and Chapels")
A  = os.path.join(DESKTOP_BASE, "Real and Imaginary Animals and Objects of Interest")
DEST = os.path.join(PROJECT_DIR, "assets/images/products")

# ── Image mapping ─────────────────────────────────────────────────────────────
# slug → (source_dir, front_filename, back_filename)

IMAGES = {
    # CASTLES & LANDMARKS
    "anfield-stadium":              (C,  "prod-pic-anfield-front-full-1536x1536.jpg",                   "prod-pic-anfield-back-crop-1536x1536.jpg"),
    "battersea-power-station":      (C,  "Battersea-Power-Station-Front-Full.jpg",                     "Battersea-Power-Station-Back-Full.jpg"),
    "bayleaf-farmstead":            (C,  "Bayleaf-Farmstead-full-front-1-1536x1536.jpg",               "bayleaf-farmstead-back-full-1536x1536.jpg"),
    "beaulieu-palace-house":        (C,  "beaulieu-product-photo-front-full-1-1-1536x1536.jpg",        "beaulieu-product-photo-back-full-1536x1536.jpg"),
    "bibury-arlington-row":         (C,  "arlington-Row-front-full-1-1536x1536.jpg",                   "arlington-row-back-full-1536x1536.jpg"),
    "big-ben":                      (C,  "Big-Ben-Front-Full.jpg",                                     "Big-Ben-Back-Full-1536x1536.jpg"),
    "bournemouth-pier":             (C,  "bournemouth-pier-front-full.jpg",                            "bournemouth-pier-back-full-1-1536x1536.jpg"),
    "buckingham-palace":            (C,  "buckingham-palace-front-1536x1536.jpg",                      "buckingham-palace-back-1536x1536.jpg"),
    "cawdor-castle":                (C,  "cawdor-castle-front-full-1-1536x1536.jpg",                   "cawdor-castle-back-full.jpg"),
    "clifton-suspension-bridge":    (C,  "Clifton-Suspension-Bridge-Front-Full-1536x1536.jpg",         "Clifton-Suspension-Bridge-Back-Full-1536x1536.jpg"),
    "cyfarthfa-castle":             (C,  "Cyfarthfa-Castle-Front-Full (1).jpg",                        "Cyfarthfa-Castle-Back-Full.jpg"),
    "dunnottar-castle":             (C,  "Dunnottar-Castle-Front-Full.jpg",                            "Dunnottar-Castle-Back-Full-1536x1536.jpg"),
    "dunollie-castle":              (C,  "Dunollie-castle-front-full.jpg",                             "Dunollie-castle-back-full.jpg"),
    "edinburgh-castle":             (C,  "Edinburgh-Castle-Front-Photo-1536x1536.jpg",                 "Edinburgh-Castle-Back-Photo-1536x1536.jpg"),
    "elizabeth-tower":              (C,  "big-ben-front-full-1-1536x1536.jpg",                         "big-ben-back-full-copy-1536x1536.jpg"),
    "floors-castle":                (C,  "floors-castle-front-full-1-1536x1536.jpg",                   "floors-castle-back-full-1536x1536.jpg"),
    "goodison-park-stadium":        (C,  "prod-pic-goodison-front-full-1536x1536.jpg",                 "prod-pic-goodison-back-crop-1536x1536.jpg"),
    "gretna-green-blacksmiths-shop":(C,  "Gretna-Green-front-full-copy-1-1536x1536.jpg",              "gretna-green-back-full-copy-1536x1536.jpg"),
    "highclere-castle":             (C,  "highclere-front-full-1-1-1536x1536.jpg",                     "highclere-back-full-1536x1536.jpg"),
    "houses-of-parliament":         (C,  "houses-of-parliament-front-full-1-1536x1536.jpg",            "houses-of-paeliament-back-full--1536x1536.jpg"),
    "husavikurkirkja-iceland":      (C,  "Husavikurkirkja-Husavik-Island-Front-Full-1536x1536.jpg",    "Husavikurkirkja-Husavik-Island-Back-Full-1536x1536.jpg"),
    "inveraray-castle":             (C,  "Inveraray-Castle-front-full-1-1536x1536.jpg",                "Inveraray-Castle-back-full-1536x1536.jpg"),
    "liberty-building":             (C,  "liberty-front-full-1-1536x1536.jpg",                         "liberty-back-full-1536x1536.jpg"),
    "linlithgow-palace":            (C,  "linlithgow-full-front.jpg",                                  "linlithgow-full-back.jpg"),
    "liverpool-liver-building":     (C,  "prod-pic-liver-front-full-1536x1536.jpg",                    "prod-pic-liver-back-crop-2-1536x1536.jpg"),
    "liverpool-three-graces":       (C,  "prod-pic-3-graces-front-full-1536x1536.jpg",                 "prod-pic-3-graces-back-crop-1536x1536.jpg"),
    "longleat-house":               (C,  "longleat-house-front-full-1-1536x1536.jpg",                  "longleat-house-back-full--1536x1536.jpg"),
    "lossiemouth-east-beach-bridge":(C,  "eastbeach-bridge-lossiemouth-full-frontkopie-1536x1536.jpg", "eastbeach-back-full-1536x1536.jpg"),
    "lowther-castle":               (C,  "lowther-front-full-1-1536x1536.jpg",                         "lowther-back-full-copy-1536x1536.jpg"),
    "lulworth-castle":              (C,  "lulworth-decoration-front-full-2-1536x1536.jpg",             "lulworth-decoration-back-full-1536x1536.jpg"),
    "map-of-kintyre":               (C,  "kintyre-front-full-1-1536x1536.jpg",                         "kintyre-back-full--1536x1536.jpg"),
    "montreat-gate-north-carolina": (C,  "montreat-front-full-1536x1536.jpg",                          "montreat-back-full-1536x1536.jpg"),
    "nottingham-castle-ducal-palace":(C, "ducal-palace-front-full-1-1536x1536.jpg",                    "ducal-palace-back-full-1536x1536.jpg"),
    "nottingham-castle-gate-house": (C,  "gate-front-full-1-1-1536x1536.jpg",                          "gate-back-full--1536x1536.jpg"),
    "palace-of-holyroodhouse":      (C,  "palace-of-holyrood-front-e1729070223494.jpg",                "palace-of-holyroodhouse-back-1536x1536.jpg"),
    "portsmouth-spinnaker-tower":   (C,  "spinaker-tower-front-full-copy-1536x1536.jpg",               "spinaker-tower-back-full--1536x1536.jpg"),
    "raby-castle":                  (C,  "raby-castle-front-full-1-1536x1536.jpg",                     "raby-castle-back-full-1536x1536.jpg"),
    "raasay-house":                 (C,  "Raasay-House-Front-Full.jpg",                                "Raasay-House-Back-Full.jpg"),
    "robin-hoods-bay":              (C,  "robin-hoods-bay-front-full-1-1-1536x1536.jpg",               "robin-hoods-bay-back-full-1536x1536.jpg"),
    "royal-pavilion-brighton":      (C,  "royal-pavilion-decoration-front-full-1-1536x1536.jpg",       "royal-pavilion-back-full-1536x1536.jpg"),
    "shetland-crofthouse":          (C,  "crofthouse-front-full-1536x1536.jpg",                        "crofthouse-back-full-1536x1536.jpg"),
    "skara-brae-orkney":            (C,  "Scara-Brae-Dresser-Front-Full-1536x1536.jpg",                "Scara-Brae-Dresser-Back-Full-1536x1536.jpg"),
    "skaill-house":                 (C,  "Skaill-House-Front-Full-1536x1536.jpg",                      "Skaill-House-Back-Full-1536x1536.jpg"),
    "south-parade-pier-portsmouth": (C,  "South-Parade-pier-front-full-1536x1536.jpg",                 "South-parade-Pier-back-full-1536x1536.jpg"),
    "stonehenge":                   (C,  "Stonehenge-front-full.jpg",                                  "Stonehenge-back-full-1536x1536.jpg"),
    "tamworth-castle":              (C,  "Tamworth-Castle-Front-Full-1536x1536.jpg",                   "Tamworth-Castle-Back-Full-1536x1536.jpg"),
    "tower-bridge":                 (C,  "Tower-Bridge-Front-Full-1536x1536.jpg",                      "Tower-Bridge-Back-Full-1-1536x1536.jpg"),
    "windsor-castle":               (C,  "windsor-castle-front-1536x1536.jpg",                         "windsor-castle-back-1536x1536.jpg"),

    # CHURCHES & CATHEDRALS
    "bath-abbey":                           (CH, "bath-abbey-version-2-front-full-1536x1536.jpg",          "bath-abbey-version-2-back-full-300x300.jpg"),
    "beverley-minster":                     (CH, "beverly-minster-front-full-new-1.jpg",                   "beverly-minster-back-full-new--1536x1536.jpg"),
    "chester-cathedral":                    (CH, "chester-cathedral-front-full-1-1536x1536.jpg",           "chester-cathedral-back-full-1536x1536.jpg"),
    "christ-church-cathedral-falkland-islands": (CH, "cathedral-full-front-1536x1536.jpg",                "cathedral-full-back-300x300.jpg"),
    "coventry-cathedral":                   (CH, "coventry-cathedral-front-full-1-1536x1536.jpg",          "coventry-cathedral-back-full-1536x1536.jpg"),
    "durham-cathedral":                     (CH, "durham-cathedral-full-front-300x300.jpg",                "durham-cathedral-full-back-300x300.jpg"),
    "glastonbury-abbey":                    (CH, "glastonbury-front-full-e1609764742359.jpg",              "glastonbury-back-full-1536x1536.jpg"),
    "iona-abbey":                           (CH, "Iona-Abbey-decoration-front-full-1-1-1536x1536.jpg",    "Iona-Abbey-back-full-1536x1536.jpg"),
    "liverpool-anglican-cathedral":         (CH, "prod-pic-anglican-front-full-1536x1536.jpg",             "prod-pic-anglican-back-crop.jpg"),
    "liverpool-metropolitan-cathedral":     (CH, "prod-picture-metrop-front-full-1536x1536.jpg",           "prod-picture-metrop-back-crop-300x300.jpg"),
    "museum-schokland-kerk":               (CH, "museum-schokland-front-full-1.jpg",                      "museum-schokland-back-full-1536x1536.jpg"),
    "paisley-abbey":                        (CH, "paisley-abbey-front-full-1-1-1536x1536.jpg",             "paisley-abbey-back-full-300x300.jpg"),
    "reading-abbey":                        (CH, "reading-abbey-full-front-1536x1536.jpg",                 "Reading-Abbey-full-back-1536x1536.jpg"),
    "rosslyn-chapel":                       (CH, "rosslyn-chapel-full.jpg",                                "rosslyn-chapel-full-back-1536x1536.jpg"),
    "shrine-of-our-lady-of-walsingham":    (CH, "the-shrine-front-full-1-1536x1536.jpg",                  "the-shrine-back-full--1536x1536.jpg"),
    "st-albans-cathedral":                  (CH, "st-Albans-front-full-1536x1536.jpg",                     "st-albans-back-full-copy-1536x1536.jpg"),
    "st-davids-cathedral":                  (CH, "st-davids-front-full-1-300x300.jpg",                     "st-davids-back-full-1-1-300x300.jpg"),
    "st-giles-cathedral":                   (CH, "St-giles-front-full-1-300x300.jpg",                      "st-giles-back-full-300x300.jpg"),
    "st-laurence-church-ludlow":            (CH, "st-laurens-front-full-1-300x300.jpg",                    "st-laurens-back-full--300x300.jpg"),
    "st-machars-cathedral":                 (CH, "st-machars-front-full-1-1536x1536.jpg",                  "st-machar-back-full--300x300.jpg"),
    "st-magnus-cathedral-orkney":           (CH, "st-magnus-front-full-1536x1536.jpg",                     "st-magnus-back-full-1-1536x1536.jpg"),
    "st-mary-redcliffe":                    (CH, "st-mary-redcliff-front-full-1-1536x1536.jpg",            "st-mary-redcliffe-back-full-1536x1536.jpg"),
    "st-marys-church-hitchin":              (CH, "St-mary-front-full-1536x1536.jpg",                       "st-mary-back-full-1536x1536.jpg"),
    "st-marys-church-west-derby":           (CH, "st-mary-full-front-product-photo-1536x1536.jpg",         "st-mary-full-back-prod-photokopie-300x300.jpg"),
    "st-pauls-cathedral":                   (CH, "st-pauls-front-full-1-1-300x300.jpg",                    "st-pauls-back-full-300x300.jpg"),
    "tewkesbury-abbey":                     (CH, "tewkesbury-front-full-1536x1536.jpg",                    "tewkesbury-back-full-1536x1536.jpg"),
    "wells-cathedral":                      (CH, "wells-cathedral-product-photo-front-full-1-300x300.jpg", "well-cathedral-product-photo-back-full-300x300.jpg"),
    "york-minster":                         (CH, "york-minster-full-front-product-picturekopie.jpg",        "york-minster-full-back-product-photokopie-1.jpg"),

    # ANIMALS & OBJECTS
    "belted-galloway-cow":              (A, "belty-full-front.jpg",                          "belty-full-back-1536x1536.jpg"),
    "bibury-trout":                     (A, "trout-front-full-1-1536x1536.jpg",              "trout-back-full-1536x1536.jpg"),
    "black-mountain-rocking-chair":     (A, "rocking-chair-Europa-front-full-1536x1536.jpg", "rocking-chair-back-full-1536x1536.jpg"),
    "bowes-museum-swan":                (A, "The-Bowes-Museum-Swan-Front-Full.jpg",          "The-Bowes-Museum-Swan-Back-Full-1536x1536.jpg"),
    "christmas-jumper-spitfire":        (A, "jumper-stretcher-front-full-1-1536x1536.jpg",   "jumper-stretcher-back-full-copy-1536x1536.jpg"),
    "king-penguin-pair":                (A, "penguins-full-froont.jpg",                      "penguin-full-back.jpg"),
    "nottingham-robin-hood":            (A, "robin-hood-front-full-1-1536x1536.jpg",         "robin-hood-back-full--1536x1536.jpg"),
    "orca-in-fair-isle-jumper":         (A, "orca-black-full-front-19.jpg",                  "orca-black-full-back-19.jpg"),
    "otter-in-fair-isle-jumper":        (A, "otter-front-full-1536x1536.jpg",               "otter-back-full-1536x1536.jpg"),
    "puffin-in-fair-isle-jumper":       (A, "new-puffin-front-full-1536x1536.jpg",           "puffin-black-full-back-19.jpg"),
    "shetland-pony-in-fair-isle-jumper":(A, "Ishetland-pony-full-front-1536x1536.jpg",      "shetland-pony-brown-back-full-1536x1536.jpg"),
    "taxi":                             (A, "London-Taxi-Front-Full-1536x1536.jpg",          "London-Taxi-Back-Full.jpg"),

    # MUSEUMS & BUILDINGS
    "abbotsford-house":                         (C, "abbotsford-front-full-1.jpg",                                         "abbotsford-back-full-1536x1536.jpg"),
    "arley-hall":                               (C, "arley-hall-product-front-full-copy-1536x1536.jpg",                    "arley-hall-new-back-full--1536x1536.jpg"),
    "bath-roman-baths":                         (C, "Roman-Bath-Front-full-1-1536x1536.jpg",                               "roman-bath-back-full-1536x1536.jpg"),
    "beatles-abbey-road":                       (C, "beatles-front-full-1536x1536.jpg",                                    "beatles-back-crop-1536x1536.jpg"),
    "biggar-museum":                            (C, "biggar-museum-front-full-1-1-1536x1536.jpg",                          "biggar-museum-back-full--1536x1536.jpg"),
    "bluecoat-liverpool":                       (C, "The-Bluecoat-1717-Front-Full-1536x1536.jpg",                          "The-Bluecoat-1717-Back-Full-1536x1536.jpg"),
    "bowes-museum":                             (C, "The-Bowes-Museum-Front-Full-1536x1536.jpg",                           "The-Bowes-Museum-Back-Full-1536x1536.jpg"),
    "bridge-of-sighs-oxford":                   (C, "bridge-of-sighs-front-full-300x300.jpg",                              "bridge-of-sighs-back-full-1536x1536.jpg"),
    "court-barn":                               (C, "Court-barn-front-full-1.jpg",                                         "court-batn-back-full--1536x1536.jpg"),
    "cromarty-courthouse-museum":               (C, "cromarty-decoration-front-full-x-1-1536x1536.jpg",                    "cromarty-decoration-back-full-1536x1536.jpg"),
    "divinity-school-oxford":                   (C, "divinity-school-product-photo-front-full-1-1536x1536.jpg",            "divinity-school-product-phote-back-full-copy-1536x1536.jpg"),
    "doddington-hall":                          (C, "doddington-front-full-1-1536x1536.jpg",                               "doddington-back-full-copy-1536x1536.jpg"),
    "gawthorpe-hall":                           (C, "gawthorpe-hall-front-full-1-1536x1536.jpg",                           "gawthorpe-hall-back-full-1536x1536.jpg"),
    "glyndebourne-opera-house":                 (C, "Glyndebourne-front-full-1536x1536.jpg",                               "Glyndebourne-back-full-1536x1536.jpg"),
    "het-scheepvaartmuseum-amsterdam":          (C, "Het-Sheepvart-National-Museum-Front-Full-scaled.jpg",                 "Het-Sheepvart-National-Museum-Back-Full-scaled.jpg"),
    "kasteel-amerongen":                        (C, "kasteel-amerongen-front-full-1-1-1536x1536.jpg",                      "kasteel-amerongen-back-full-1536x1536.jpg"),
    "kasteel-de-haar":                          (C, "kasteel-de-haar-front-full-1-1536x1536.jpg",                          "kasteel-de-haar-back-full--1536x1536.jpg"),
    "kelmscott-manor":                          (C, "kelmscott-manor-front-full-1.jpg",                                    "kelmscott-manor-back-full--1536x1536.jpg"),
    "kew-botanic-gardens-palm-house":           (C, "palm-house-front-full-1536x1536.jpg",                                 "palmhouse-back-full-1536x1536.jpg"),
    "liverpool-liver-building-with-rainbow":    (C, "prod-pic-liver-rainbow-front-full-1536x1536.jpg",                     "prod-pic-liver-rainbow-back-crop-1536x1536.jpg"),
    "mcewan-hall-edinburgh":                    (C, "mc-ewan-full-front-1536x1536.jpg",                                    "mc-ewan-full-back-1536x1536.jpg"),
    "mg-abingdon-a-block":                      (C, "mg-front-full-1-1536x1536.jpg",                                       "mg-back-full--1536x1536.jpg"),
    "national-museum-cardiff":                  (C, "cardiff-museum-front-full-1-1-1536x1536.jpg",                         "cardiff-museum-back-full-1536x1536.jpg"),
    "new-college-edinburgh":                    (C, "new-college-full-front.jpg",                                          "new-college-full-back-1536x1536.jpg"),
    "newbury-cloth-hall":                       (C, "new-dec-cloth-hall-full-front-1536x1536.jpg",                         "new-dec-cloth-hall-full-back-300x300.jpg"),
    "old-college-edinburgh":                    (C, "old-college-front-fullkopie-1536x1536.jpg",                           "old-college-full-backkopie-1536x1536.jpg"),
    "old-royal-naval-college":                  (C, "ORNC-front-full-copy-1-1536x1536.jpg",                                "ORNC-back-full-1536x1536.jpg"),
    "ordsall-hall":                             (C, "ordsal-hall-slaford-front-full-copy-1-1536x1536.jpg",                 "ordsal-hall-salford-back-full-copy-1536x1536.jpg"),
    "oxford-christ-church-tom-tower":           (C, "tom-tower-front-full-1-1-1536x1536.jpg",                              "tom-tower-back-full--1536x1536.jpg"),
    "oxford-university-museum-of-natural-history": (C, "Natural-history-museum-front-full-new-1-1536x1536.jpg",           "natural-history-museum-back-full-new-1536x1536.jpg"),
    "peerie-shop-lerwick":                      (C, "peerie-lerwick-front-full-copy-1-1536x1536.jpg",                      "peerie-lerwick-back-full-copy-1536x1536.jpg"),
    "perth-art-gallery":                        (C, "art-gallery-front-full-copy-1-1536x1536.jpg",                         "art-gallery-back-full-copy-1536x1536.jpg"),
    "perth-museum":                             (C, "perth-museum-copy-1-1536x1536.jpg",                                   "perth-museum-back-copy-1536x1536.jpg"),
    "pump-street-chocolate":                    (C, "Pump-Street-Chocolate-Bakery-Cleaned-Up-Front-2-1536x1536.png",       "Pump-Street-Chocolate-Bakery-Cleaned-Up-2-Back-1-1536x1536.png"),
    "radcliffe-camera":                         (C, "radcliffe camera-front-full-copy-1536x1536.jpg",                      "radcliffe camera-back-full-copy-1536x1536.jpg"),
    "reading-town-hall-and-museum":             (C, "reading-museum-front-full-1-1536x1536.jpg",                           "reading-museum-back-full-1536x1536.jpg"),
    "richmond-theatre":                         (C, "Richmond-Theatre-Front-Full-2-1536x1536.jpg",                         "Richmond-Theatre-Back-Full-1-1536x1536.jpg"),
    "royal-opera-house":                        (C, "royal-opera-front-full-1-1536x1536.jpg",                              "royal-opera-back-full-1481x1536.jpg"),
    "salford-museum-and-art-gallery":           (C, "salford-museum-front-full-1-1-1536x1536.jpg",                         "salfors-museum-back-full-copy-1536x1536.jpg"),
    "shaw-house":                               (C, "shaw-house-front-full-1-1536x1536.jpg",                               "shaw-house-back-full-1536x1536.jpg"),
    "sheldonian-theatre":                       (C, "Sheldonian-Theatre-Front-Full-1536x1536.jpg",                         "Sheldonian-Theatre-Back-Full-1536x1536.jpg"),
    "skyfall":                                  (C, "Skyfall-007-Front-Full.jpg",                                          "Skyfall-007-Back-Full.jpg"),
    "teviot-row-house-edinburgh":               (C, "treviot-row-house-front-full-1-1536x1536.jpg",                        "treviot-row-house-back-full-copy-1536x1536.jpg"),
    "the-national-archives":                    (C, "national-archives-front-full-2.jpg",                                  "national-archives-back-full-1536x1536.jpg"),
    "titchfield-market-hall":                   (C, "thitchfield-full-front-1-1536x1536.jpg",                              "thitchfield-full-back--1536x1536.jpg"),
    "university-of-st-andrews":                 (C, "st-andrews-front-full-1-1536x1536.jpg",                               "st-andrews-back-full-1536x1536.jpg"),
}

TO_DELETE = [
    "chesterfield-crooked-spire",
    "oxford-botanic-garden",
    "liverpool-liver-building-black",
    "liverpool-sefton-park-palm-house",
]

LISTING_PAGES = [
    os.path.join(PROJECT_DIR, "bespoke-pages", "bespoke-castles.html"),
    os.path.join(PROJECT_DIR, "bespoke-pages", "bespoke-cathedrals.html"),
    os.path.join(PROJECT_DIR, "bespoke-pages", "bespoke-animals.html"),
    os.path.join(PROJECT_DIR, "bespoke-pages", "bespoke-museums.html"),
    os.path.join(PROJECT_DIR, "bespoke-pages", "bespoke-all.html"),
]


# ── Helpers ───────────────────────────────────────────────────────────────────

def read(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def write(path, content):
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)


def find_div_end(content, start):
    """Return the index just past the closing </div> that matches the <div at start."""
    depth = 0
    i = start
    while i < len(content):
        if content[i:i+4] == "<div":
            depth += 1
            i += 4
        elif content[i:i+6] == "</div>":
            depth -= 1
            if depth == 0:
                return i + 6
            i += 6
        else:
            i += 1
    return -1


def find_a_end(content, start):
    """Return the index just past the closing </a> matching the <a at start."""
    depth = 0
    i = start
    while i < len(content):
        if content[i:i+2] == "<a" and (len(content) <= i+2 or content[i+2] in (' ', '\n', '\t', '>')):
            depth += 1
            i += 2
        elif content[i:i+4] == "</a>":
            depth -= 1
            if depth == 0:
                return i + 4
            i += 4
        else:
            i += 1
    return -1


def make_thumbnail_section(slug, ext):
    """Generate the product-thumbnails div HTML with front and back."""
    img1 = f"../assets/images/products/{slug}-1{ext}"
    img2 = f"../assets/images/products/{slug}-2{ext}"
    return (
        f'<div class="product-thumbnails">\n'
        f'              <button class="product-thumbnail active" type="button">\n'
        f'                <img\n'
        f'                  src="{img1}"\n'
        f'                  data-full="assets/images/products/{slug}-1{ext}"\n'
        f'                  alt="{slug} view 1"\n'
        f'                />\n'
        f'              </button>\n'
        f'              <button class="product-thumbnail" type="button">\n'
        f'                <img\n'
        f'                  src="{img2}"\n'
        f'                  data-full="assets/images/products/{slug}-2{ext}"\n'
        f'                  alt="{slug} view 2"\n'
        f'                />\n'
        f'              </button>\n'
        f'            </div>'
    )


# ── Step 1: Copy images ───────────────────────────────────────────────────────

def copy_images():
    print("\n── Step 1: Copying images ──")
    ok = 0
    warn = 0
    for slug, (src_dir, front_file, back_file) in IMAGES.items():
        ext = Path(front_file).suffix
        front_src = os.path.join(src_dir, front_file)
        back_src  = os.path.join(src_dir, back_file)
        front_dst = os.path.join(DEST, f"{slug}-1{ext}")
        back_dst  = os.path.join(DEST, f"{slug}-2{ext}")

        if os.path.exists(front_src):
            shutil.copy2(front_src, front_dst)
            ok += 1
        else:
            print(f"  WARNING: missing front — {front_src}")
            warn += 1

        if os.path.exists(back_src):
            shutil.copy2(back_src, back_dst)
        else:
            print(f"  WARNING: missing back  — {back_src}")
            warn += 1

    print(f"  {ok} front images copied  ({warn} warnings)")


# ── Step 2: Update individual product pages ───────────────────────────────────

def update_product_page(filepath, slug, ext):
    if not os.path.exists(filepath):
        print(f"  WARNING: product page not found — {filepath}")
        return

    content = read(filepath)
    img1 = f"../assets/images/products/{slug}-1{ext}"

    # Update main image src (id="main-product-image")
    # Match src="..." that appears anywhere before id="main-product-image" in the same tag
    content = re.sub(
        r'src="[^"]*"(?=[^>]*id="main-product-image")',
        f'src="{img1}"',
        content,
        flags=re.DOTALL,
    )

    # Find and replace the product-thumbnails div
    marker = '<div class="product-thumbnails">'
    start = content.find(marker)
    if start != -1:
        end = find_div_end(content, start)
        if end != -1:
            new_section = make_thumbnail_section(slug, ext)
            content = content[:start] + new_section + content[end:]

    write(filepath, content)


def update_product_pages():
    print("\n── Step 2: Updating product pages ──")
    updated = 0
    for slug, (_, front_file, _) in IMAGES.items():
        ext = Path(front_file).suffix
        page = os.path.join(PROJECT_DIR, "products", f"product-{slug}.html")
        update_product_page(page, slug, ext)
        updated += 1
    print(f"  {updated} product pages updated")


# ── Step 3: Update category listing pages ────────────────────────────────────

def update_listing_page(filepath):
    if not os.path.exists(filepath):
        print(f"  WARNING: listing page not found — {filepath}")
        return

    content = read(filepath)
    updated_cards = 0
    deleted_cards = 0

    # Update card images for products in IMAGES map
    for slug, (_, front_file, _) in IMAGES.items():
        ext = Path(front_file).suffix
        new_src = f"../assets/images/products/{slug}-1{ext}"
        href_pattern = f"product-{slug}.html"

        # Find anchor containing this product's href
        anchor_match = re.search(
            rf'<a\b[^>]*href="[^"]*{re.escape(href_pattern)}"',
            content,
        )
        if not anchor_match:
            continue

        a_start = anchor_match.start()
        a_end = find_a_end(content, a_start)
        if a_end == -1:
            continue

        card_html = content[a_start:a_end]

        # Replace the img src inside this card
        new_card_html = re.sub(
            r'(<img\b[^>]*?)src="[^"]*"',
            rf'\1src="{new_src}"',
            card_html,
            count=1,
            flags=re.DOTALL,
        )

        if new_card_html != card_html:
            content = content[:a_start] + new_card_html + content[a_end:]
            updated_cards += 1

    # Delete cards for products in TO_DELETE
    for slug in TO_DELETE:
        href_pattern = f"product-{slug}.html"
        anchor_match = re.search(
            rf'[ \t]*<a\b[^>]*href="[^"]*{re.escape(href_pattern)}"',
            content,
        )
        if not anchor_match:
            continue

        # Back up to the start of the line (or beginning of whitespace before <a)
        line_start = anchor_match.start()

        a_tag_start = content.index("<a", line_start)
        a_end = find_a_end(content, a_tag_start)
        if a_end == -1:
            continue

        # Include surrounding blank line
        # Remove from the newline before the card to the newline after
        remove_start = line_start
        # consume trailing newline too
        if a_end < len(content) and content[a_end] == "\n":
            a_end += 1

        content = content[:remove_start] + content[a_end:]
        deleted_cards += 1

    # Update catalogue-count after deletions
    if deleted_cards:
        count_match = re.search(r'(\d+)( decorations)', content)
        if count_match:
            old_count = int(count_match.group(1))
            new_count = old_count - deleted_cards
            content = content[:count_match.start()] + str(new_count) + count_match.group(2) + content[count_match.end():]

    write(filepath, content)
    print(f"  {os.path.basename(filepath)}: {updated_cards} cards updated, {deleted_cards} cards deleted")


def update_listing_pages():
    print("\n── Step 3: Updating listing pages ──")
    for page in LISTING_PAGES:
        update_listing_page(page)


# ── Step 4: Delete product pages ─────────────────────────────────────────────

def delete_product_pages():
    print("\n── Step 4: Deleting product pages ──")
    for slug in TO_DELETE:
        page = os.path.join(PROJECT_DIR, "products", f"product-{slug}.html")
        if os.path.exists(page):
            os.remove(page)
            print(f"  Deleted: {os.path.basename(page)}")
        else:
            print(f"  WARNING: not found — {page}")


# ── Main ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print(f"Project dir : {PROJECT_DIR}")
    print(f"Desktop src : {DESKTOP_BASE}")
    print(f"Products:     {len(IMAGES)} to update, {len(TO_DELETE)} to delete")

    copy_images()
    update_product_pages()
    update_listing_pages()
    delete_product_pages()

    print("\nDone.")
