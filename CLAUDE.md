# CLAUDE.md — Austin Core Legal Website

This file documents the codebase structure, conventions, and workflows for AI assistants working on this project.

## Project Overview

**Austin Core Legal** is a professional law firm website for Austin Core Legal Pty Ltd (ACN: 641 023 136), a Sydney/Melbourne boutique firm led by principal Megan Zhou. The tagline is "Practical. Commercial. Efficient."

**Tech Stack:**
- **Framework**: Astro 5 (static site generation)
- **Styling**: Tailwind CSS 4 (via `@tailwindcss/vite`)
- **Language**: TypeScript (strict mode)
- **CMS**: Decap CMS (formerly Netlify CMS) at `/admin`
- **Deployment**: Netlify (auto-deploy on git push)
- **Payments**: Stripe (buy-button embed on `/pay`)

---

## Directory Structure

```
/
├── src/
│   ├── assets/              # Static images (astro.svg, background.svg)
│   ├── components/          # Reusable Astro components
│   │   ├── PracticeAreaCard.astro   # Card for practice area listings
│   │   └── SEO.astro                # SEO meta tag component
│   ├── content/             # Content collections (markdown)
│   │   ├── config.ts        # Zod schemas for all collections
│   │   ├── practice-areas/  # 7 markdown files (one per practice area)
│   │   └── blog/            # Blog post markdown files
│   ├── layouts/
│   │   └── Layout.astro     # Master layout (navbar, footer, scripts)
│   ├── pages/               # File-based routing
│   │   ├── index.astro      # Homepage (/)
│   │   ├── contact.astro    # Contact page (/contact)
│   │   ├── pay.astro        # Stripe payment page (/pay)
│   │   ├── admin.astro      # Decap CMS wrapper (/admin)
│   │   └── blog/
│   │       ├── index.astro  # Blog listing (/blog)
│   │       └── [slug].astro # Dynamic blog post pages (/blog/[slug])
│   └── styles/
│       └── global.css       # Tailwind imports + brand CSS custom properties
├── public/                  # Static assets (copied as-is to dist/)
│   ├── admin/config.yml     # Decap CMS backend/collection config
│   ├── emails/              # Netlify Identity email templates
│   ├── favicon.svg/.ico
│   ├── logo.png
│   ├── megan.jpg
│   └── megan-zhou.jpg
├── astro.config.mjs         # Astro + Vite configuration
├── tsconfig.json            # TypeScript strict config
├── netlify.toml             # Netlify build settings
└── package.json             # Scripts and dependencies
```

---

## Development Commands

```bash
npm run dev       # Start dev server at http://localhost:4321 (hot reload)
npm run build     # Production build → ./dist/
npm run preview   # Preview the production build locally
```

No test runner is configured. This is a content/presentation site with no test files.

---

## Content Collections

Defined in `src/content/config.ts` using Zod schemas:

### Practice Areas (`src/content/practice-areas/`)
```ts
{ title: string, description: string }
```
7 markdown files: `bankruptcy-insolvency.md`, `conveyancing.md`, `debt-recovery.md`, `dispute-resolution.md`, `estate-planning.md`, `family-law.md`, `strata.md`

### Blog (`src/content/blog/`)
```ts
{
  title: string,
  description: string,   // Used for SEO meta description
  date: date,
  author: string,        // Default: "Austin Core Legal"
  image?: string,
  tags?: string[]
}
```

To add a new blog post, create `src/content/blog/your-slug.md` with the required frontmatter. The `/blog/[slug].astro` route handles rendering automatically via `getStaticPaths()`.

---

## Styling Conventions

### Brand Colors (defined in `src/styles/global.css`)
```css
--color-brand-blue: #8eb6dc           /* Light blue */
--color-brand-blue-deep: #10629a      /* Primary blue (CTA buttons, links) */
--color-brand-blue-dark: #0a3d5c      /* Dark blue (headings, footer bg) */
--color-brand-blue-light: #dce8f3     /* Light blue tints */
--color-brand-blue-pale: #f0f5fa      /* Section backgrounds */
--color-brand-gold: #D4AF37           /* Accent gold */
--color-brand-text: #1e293b           /* Primary dark text */
--color-brand-text-light: #64748b     /* Secondary gray text */
```

Use Tailwind's `text-brand-blue-deep`, `bg-brand-blue-pale`, etc. (mapped via `@theme` in global.css).

### Typography
- **Headers**: `font-serif` → Playfair Display (loaded from Google Fonts)
- **Body**: `font-sans` → Inter (loaded from Google Fonts)
- All `h1`–`h6` use serif by default via global CSS

### Layout Patterns
- Max-width container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Responsive grids: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`
- Sections: padded with `py-16` or `py-20`

---

## Layout & Navigation

**`src/layouts/Layout.astro`** is the single master layout used by all pages. It provides:

1. **Fixed navbar** — transparent over hero, turns opaque white on scroll (JS scroll listener)
2. **Mobile hamburger menu** — toggled via `hidden` class on `#mobile-menu`
3. **Footer** — 4-column grid with branding, links, contact, and office info
4. **Netlify Identity widget** — loaded for Decap CMS authentication
5. **Scroll animations** — Intersection Observer adds `.animate-visible` to `.animate-on-scroll` elements
6. **Google Fonts** — Inter + Playfair Display via `<link>` in `<head>`

Props accepted by Layout:
```ts
{ title: string }  // Sets <title> and page-specific heading
```

---

## Scroll Animation Pattern

To add entrance animations to any element:
```html
<div class="animate-on-scroll">...</div>
<div class="animate-on-scroll animate-delay-1">...</div>  <!-- 100ms delay -->
<div class="animate-on-scroll animate-delay-2">...</div>  <!-- 200ms delay -->
<div class="animate-on-scroll animate-delay-3">...</div>  <!-- 300ms delay -->
```

The Intersection Observer in Layout.astro adds `animate-visible` when elements enter the viewport. Starting state is `opacity: 0; transform: translateY(30px)` defined in Tailwind utilities.

---

## CMS Configuration

Decap CMS is configured in `public/admin/config.yml`:
- **Backend**: `git-gateway` (Netlify-hosted, requires Netlify Identity)
- **Branch**: `main`
- **Media uploads**: `public/images/uploads/`
- **Collections**: Practice Areas and Blog Posts

The `/admin` route (`src/pages/admin.astro`) is a thin HTML wrapper that loads the Decap CMS bundle. Editors access it at `/admin` and authenticate via Netlify Identity.

---

## Deployment

**Netlify** auto-deploys on push to `main`. Configuration in `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"
```

Environment variables (`.env` / `.env.production`) are git-ignored. Store secrets in Netlify dashboard environment variables.

---

## Firm Information (Reference)

| Field | Value |
|---|---|
| Firm name | Austin Core Legal Pty Ltd |
| ACN | 641 023 136 |
| Principal | Megan Zhou |
| Email | info@austincorelegal.com.au |
| Phone | 0481 225-870 |
| Sydney office | Suite 10 Level 3, 88 Pitt Street, Sydney NSW 2000 |
| Melbourne office | Suite 42, 139 Cardigan St, Carlton VIC 3053 |

Practice areas: Bankruptcy/Insolvency, Conveyancing, Debt Recovery, Dispute Resolution, Estate Planning, Family Law, Strata.

---

## Key Conventions

1. **No test files** — this is a content site; no testing framework is configured.
2. **Pure Astro components** — no React/Vue/Svelte. Use `.astro` files only.
3. **Tailwind for all styling** — no CSS modules or separate stylesheets other than `global.css`.
4. **Markdown for content** — use content collections for all structured content; avoid hardcoding copy in page files.
5. **Static generation only** — no server-side rendering (`output: 'static'` is default). All pages pre-render at build time.
6. **Minimal JavaScript** — inline `<script>` tags in Layout.astro handle all interactivity (nav, animations). Keep JS minimal.
7. **Brand colors via CSS custom properties** — always use the `--color-brand-*` variables, not raw hex values.
8. **Semantic HTML** — use `<article>`, `<section>`, `<nav>`, `<header>`, `<footer>` appropriately.
9. **Images in `/public/`** — place all public images in `public/` and reference as `/image.jpg` (no import needed for static assets).
10. **Commit to `main` triggers deploy** — Netlify auto-deploys; only merge to `main` when changes are production-ready.
