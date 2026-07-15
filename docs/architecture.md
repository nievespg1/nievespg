# Architecture

## Layout hierarchy

```
BaseLayout          ← HTML shell, SEO, fonts, global CSS
└── ContentLayout   ← Navbar + Footer + page container
    ├── BlogLayout
    ├── ProjectLayout
    └── ResumeLayout
```

Each layout extends the one above it. `BaseLayout` handles the `<html>`, `<head>`, and global styles; `ContentLayout` adds navigation chrome; the leaf layouts add section-specific styling.

## Route structure

```
/                    → src/pages/index.astro
/blog/               → src/pages/blog/index.astro
/blog/hello-world/   → src/pages/blog/[...slug].astro (dynamic)
/projects/           → src/pages/projects/index.astro
/projects/hello-world/ → src/pages/projects/[...slug].astro (dynamic)
/resume/             → src/pages/resume.astro
```

Dynamic routes use `getStaticPaths()` to generate pages from content collections at build time.

## Content collections

Defined in `src/content.config.ts` with Zod schemas:

- **blog** — title, description, publishDate, tags, draft status
- **projects** — title, summary, technologies, links (github/website)
- **resume** — sectioned entries (education, experience, skills, etc.) with sort order

All content is Markdown stored in `src/content/`. Astro pre-renders it at build time.

## CSS design system

No framework — vanilla CSS custom properties in `src/styles/tokens.css`:

- **Colors** — warm neutral palette with light/dark themes via `[data-theme="dark"]`
- **Typography** — Inter (sans), Georgia (serif), JetBrains Mono (mono) with fluid `clamp()` scale
- **Spacing** — 2xs through 4xl scale
- **Widths** — content (72ch), page (1200px), article (65ch)

Supporting stylesheets handle reset, typography, prose (markdown content), animations, and utilities.