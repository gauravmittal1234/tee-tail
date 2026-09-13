# Tee & Tail

Matching tees for pet parents and their dogs and cats — a static storefront inspired by HUFT.

**Live site:** https://gauravmittal1234.github.io/tee-tail/

## What's inside

- Home with a live twin-colour preview, category tiles, bestseller tabs and a breed size finder
- Shop with filters (who it's for, pet, category, colour, size, price), sorting and search
- Product pages with colour/size pickers, size guide, pet-name personalisation and pincode delivery check
- Bag with coupons (`TWINNING15`, `FIRSTWOOF`, `ADOPT10`), checkout, order confirmation and tracking
- Wishlist and light/dark theme

It's a demo store: no payments are taken, and the bag, wishlist and orders are saved in the visitor's browser (`localStorage`). Product images are generated SVG illustrations.

## Editing

| File | What it holds |
| --- | --- |
| `data.js` | Products, prices, colours, size charts, breeds, coupons, reviews, FAQs |
| `index.html` | Header, navigation, footer, brand name |
| `styles.css` | Design tokens (colours, fonts) and layout |
| `art.js` | SVG artwork for tees, hoodies and bandanas |
| `core.js` | Cart, wishlist, search, router |
| `views.js` / `pages.js` | Page templates |

## Run locally

```bash
python3 -m http.server 5173
```

Then open http://localhost:5173.
