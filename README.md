# Kaisutee Portfolio

Static HTML/CSS/JS portfolio designed for Cloudflare Pages + Pages CMS.

## Important
Pages CMS writes content into `data/*.json` and media into `public/media`.
The homepage reads `data/site.json` and uses `hero_image` as the Main Page Cover.

## Cloudflare Pages
- Production branch: `main`
- Framework preset: None
- Build command: `exit 0`
- Build output directory: `.`

## Pages
- `/` Home
- `/music.html` Music
- `/works.html` Works
- `/archive.html` Archive
- `/gallery.html` Gallery
- `/about.html` About
- `/contact.html` Contact

## CMS
Edit `.pages.yml` in Pages CMS. Do not edit the generated JSON manually unless necessary.
