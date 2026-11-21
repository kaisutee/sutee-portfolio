# Kaisutee Portfolio

This is a static portfolio for Cloudflare Pages + Pages CMS.

## Main Page Cover
Pages CMS > Site Settings > Main Page Cover uploads into `public/media`.
The homepage reads `data/site.json` and uses `hero_image` as the background.

## Content
Pages CMS manages:
- Artists
- Albums
- Songs
- Singles
- Producer works
- Composer works
- Arranger works
- Other works
- Archive
- Gallery

## Important
A GitHub Action builds `data/**/index.json` after CMS content changes. The public pages use those indexes to list collection items.

## Cloudflare Pages
- Branch: main
- Framework preset: None
- Build command: exit 0
- Output directory: .
