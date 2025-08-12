# Bamboo Pergola Planner (Minimal)

A tiny, drop-in React app that helps visitors pick a pergola size that fits their space and links them to matching plans.

## Features
- Simple form: width + depth (ft), use case, style
- Lightweight matching engine (by size) with a basic score
- No external UI libs, no router — single-file React component
- Easy to embed or host on GitHub Pages / Hostinger

## Quick Start (with Vite)

```bash
# 1) create a new vite react app (if you don't already have one)
npm create vite@latest bamboo-pergola-planner -- --template react
cd bamboo-pergola-planner

# 2) install
npm i

# 3) replace src/App.jsx with the App.jsx from this repo
#    (also keep src/main.jsx and index.html from Vite as-is)

# 4) run it
npm run dev
```
## Customize Products
Open src/App.jsx and edit the PRODUCTS array:

title, slug, image, specs (must include a "Size" spec like "14x14 ft"),

product_url (where the plan is sold/hosted).

Tip: You can fetch from your open catalog later:

// future:
// const PRODUCTS = await (await fetch('https://bamboodesigns.com/open-catalog/catalog-v1.0.json')).json();

## Embed on Your Site
Once deployed (GitHub Pages/Hostinger), drop this in any page:

<iframe src="https://your-domain.com/bamboo-pergola-planner/" width="100%" height="1200" style="border:0"></iframe>

## License
Code: MIT
