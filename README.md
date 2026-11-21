# Kaisutee Portfolio — easy-to-edit version

This version is designed so the website itself can stay simple while content is edited through Pages CMS.

## Where to edit

Use **Pages CMS** with this GitHub repository:
- Site Settings → edit name, tagline, bio, contact and social links
- Music → add/edit songs and albums
- Works → add/edit projects and credits
- Media → upload images

Pages CMS writes the changes directly to GitHub. Cloudflare Pages is already connected to this repository, so commits to `main` trigger a new deployment.

## Important

The website is intentionally data-driven. Do not edit `index.html` just to add a song or project.

## First setup

1. Push this repository to GitHub.
2. Open Pages CMS and sign in with GitHub.
3. Install/authorize Pages CMS for `kaisutee/sutee-portfolio`.
4. Open the repository.
5. The `.pages.yml` file defines the editable fields.
6. Add/edit content.
7. Save. GitHub receives the commit.
8. Cloudflare Pages deploys the update automatically.

## Cloudflare Pages

Production branch: `main`
Build command: `exit 0`
Build output directory: `.`
