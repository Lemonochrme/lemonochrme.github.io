# Lemonochrome — Portfolio

Personal portfolio of Robin Marin-Muller, built with [Astro](https://astro.build). Covers embedded systems, space software, electronics, and personal engineering projects.

Live at [lemonochrome.fr](https://lemonochrome.fr).

---

## Stack

- **Framework** — Astro 5 (static output)
- **Styles** — SCSS (ported from the original dark-poole/Poole design)
- **Content** — Astro Content Collections (Markdown / MDX)
- **Math** — MathJax 3 (inline `$...$` and block `$$...$$`)
- **Deployment** — GitHub Pages / any static host

---

## Getting started

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:4321)
npm run dev

# Production build → dist/
npm run build

# Preview the production build locally
npm run preview
```

---

## Project structure

```
src/
├── components/
│   ├── Head.astro          # <head> with meta/SEO tags
│   ├── Masthead.astro      # Header, navigation, theme toggle
│   └── ThemeScript.astro   # Inline script to prevent theme flash
├── content/
│   ├── config.ts           # Content collection schema
│   └── posts/              # All Markdown posts (personal + INSA)
├── layouts/
│   ├── Default.astro       # Base layout (container, masthead, footer)
│   ├── Post.astro          # Article layout with date and related posts
│   └── Page.astro          # Generic page layout
├── pages/
│   ├── index.astro         # Home — paginated post list (page 1)
│   ├── page/[page].astro   # Subsequent pages (/page/2, /page/3 …)
│   ├── posts/[slug].astro  # Dynamic post route
│   ├── archive.astro       # Archive grouped by month and category
│   ├── about.astro
│   ├── resume.astro
│   └── 404.astro
└── styles/
    ├── global.scss         # Entry point (@use)
    ├── _variables.scss     # CSS custom properties, theme tokens
    ├── _base.scss          # Resets and element defaults
    ├── _type.scss          # Typography
    ├── _layout.scss        # Container and footer
    ├── _masthead.scss      # Header, nav, burger, animations
    ├── _posts.scss         # Post and page article styles
    ├── _pagination.scss    # Pagination component
    ├── _code.scss          # Code blocks
    ├── _message.scss       # Alert messages
    └── _toc.scss           # Table of contents
public/
├── assets/                 # Logos, favicons, post images
├── simulations/            # Self-contained HTML simulations
└── download/               # PDF downloads (resume, reports)
```

---

## Adding a post

Create a Markdown file in `src/content/posts/` with the following frontmatter:

```markdown
---
title: My Post Title
date: 2026-01-01
categories: [Personnal]   # or [INSA]
description: "Short description shown on the home and archive pages."
image: https://...        # optional cover image URL
---

Post content here.
```

The post will automatically appear on the home page, the archive, and get its own route at `/posts/<slug>`.

---

## Theming

The site supports light and dark modes via a `data-theme` attribute on `<html>`:

- `light` — default light theme
- `dark-poole` — dark theme

The toggle button (`✷`) in the navigation switches themes and persists the choice in `localStorage`. A small inline script in `ThemeScript.astro` applies the saved theme before the first paint to prevent any flash.

---

## Deployment on GitHub Pages

1. Set `site` in `astro.config.mjs` to your domain (already set to `https://lemonochrome.fr`).
2. Run `npm run build` — output is in `dist/`.
3. Push `dist/` contents to your `gh-pages` branch, or configure a GitHub Actions workflow to build and deploy automatically.

Example GitHub Actions workflow:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [astro]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/deploy-pages@v4
        with:
          folder: dist
```

In `archive.md`, add `{{ site.baseurl }}` before `{{ post.url }}`

```html
<!-- Add "{{ site.baseurl }}" -->
<li><a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a></li>
```

In `index.html`, remove the `prepend:`:

```html
<!-- Remove "prepend:" in "prepend: relative_url" -->
<a
  class="pagination-item newer"
  href="{{ paginator.previous_page_path | relative_url }}"
  >Newer</a
>
```

### Customize Navbar

You can easily customize the navbar by tweaking the `_config.yml` file. Simply change the title and url of each of the nav elements, or add more. The order will be preserved in the site.

```yaml
nav:
  - title: Blog
    url: /archive

  - title: About
    url: /about
```

## License

Open sourced under the [MIT license](LICENSE.md).

<3
