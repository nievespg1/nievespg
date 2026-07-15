# Design Document: Personal Website with Astro

**Project Name:** Personal Portfolio & Blog

**Status:** Design Specification

**Owner:** Gabriel Nieves-Ponce

**Version:** 1.0

---

# 1. Overview

The goal of this project is to build a modern, high-performance personal website using **Astro**.

The website will serve four primary purposes:

- Resume
- Technical Portfolio
- Research Projects
- Technical Blog

The site should emphasize:

- Fast loading
- Excellent typography
- Clean reading experience
- Long-term maintainability
- Component-driven architecture
- Markdown-first authoring
- Minimal client-side JavaScript

This is **not** intended to be a web application.

The website should remain entirely static except where interactive components are intentionally introduced.

---

# 2. Design Philosophy

The website should resemble the reading experience of Claude.ai:

- Warm neutral colors
- Lots of whitespace
- Narrow reading width
- Beautiful typography
- Minimal chrome
- Soft rounded elements
- Almost invisible UI

The emphasis should always be on the content.

The design should feel like a premium digital publication rather than a marketing website.

---

# 3. Technology Stack

## Core

- Astro
- TypeScript
- Markdown
- MDX
- CSS Modules OR Vanilla CSS

## Build

- Vite (included with Astro)

## Package Manager

- pnpm

## Linting

- ESLint

## Formatting

- Prettier

## Deployment

The architecture should remain deployment agnostic.

Examples:

- Cloudflare Pages
- GitHub Pages
- Netlify
- Vercel

No deployment-specific code should exist.

---

# 4. Design Goals

The architecture should optimize for:

- readability
- maintainability
- extensibility
- performance

The architecture should discourage:

- duplicated layouts
- duplicated CSS
- duplicated markdown metadata

---

# 5. Folder Structure

```
.
├── .claude/                        ← Claude project context (this directory)
├── .devcontainer/                  ← Development container configuration, editor settings, and environment bootstrap scripts
├── docs/                           ← Project documentation, architecture, ADRs, style guides, roadmaps, and contributor documentation
├── public/                         ← Static assets served directly (favicon, robots.txt, fonts, downloadable files, etc.)
├── src/                            ← Application source code
│   ├── assets/                     ← Images, icons, illustrations, and other assets processed by Astro
│   ├── components/                 ← Reusable presentation components organized by feature
│   │   ├── blog/                   ← Components specific to blog articles (metadata, TOC, reading time, related posts, etc.)
│   │   ├── navigation/             ← Site navigation components (header, footer, menus, breadcrumbs, pagination, etc.)
│   │   ├── project/                ← Components used throughout project pages (project cards, galleries, technology badges, etc.)
│   │   ├── resume/                 ← Components used to render resume sections and timelines
│   │   ├── shared/                 ← Shared layout and presentation components used across multiple features
│   │   └── ui/                     ← Generic design system components (buttons, cards, badges, alerts, callouts, icons, etc.)
│   │
│   ├── content/                    ← Markdown and MDX source content organized into Astro Content Collections
│   │   ├── blog/                   ← Technical articles and blog posts
│   │   ├── projects/               ← Project case studies and portfolio entries
│   │   └── resume/                 ← Structured resume content (experience, education, skills, certifications, etc.)
│   │
│   ├── layouts/                    ← Reusable page layouts that compose pages from components and content
│   ├── pages/                      ← Astro routes defining the site's URL structure
│   ├── styles/                     ← Global styles, design tokens, typography, utilities, and Markdown styling
│   ├── utils/                      ← Shared utility functions, helpers, and formatting logic
│   ├── types/                      ← Shared TypeScript interfaces and type definitions
│   ├── hooks/                      ← Reusable client-side behavior for interactive Astro islands (when needed)
│   └── content.config.ts           ← Astro Content Collections schemas and validation rules
│
├── scripts/                        ← Build automation, content generation, maintenance, and developer utility scripts
├── tests/                          ← Automated tests, fixtures, and testing utilities
├── .github/                        ← GitHub workflows, issue templates, pull request templates, and repository configuration
└── Makefile                        ← Common task-runner targets (install, lint, format, build, test, preview, clean, deploy)
```

---

# 6. Content Collections

The project should use Astro Content Collections.

Collections:

```
blog

projects

resume
```

Each collection should have a schema.

Example:

Blog

- title
- description
- publishDate
- updatedDate
- tags
- featured
- draft
- image

Projects

- title
- summary
- technologies
- github
- website
- featured

Resume

- section
- order
- title
```

Validation should happen during build.

---

# 7. Global Design Tokens

A single design system should exist.

```
tokens.css
```

It should define:

Colors

Typography

Spacing

Border Radius

Widths

Shadows

Transitions

Example

```
--color-background

--color-surface

--color-border

--color-primary

--content-width

--page-width

--radius-medium
```

No component should define hardcoded colors.

---

# 8. Layout Hierarchy

```
BaseLayout

↓

ContentLayout

↓

BlogLayout
ProjectLayout
ResumeLayout
```

Responsibilities

BaseLayout

- html
- head
- SEO
- fonts
- metadata
- global styles

ContentLayout

- navigation
- footer
- page container

BlogLayout

- article metadata
- tags
- TOC
- article body

ProjectLayout

- hero
- technologies
- links
- screenshots

ResumeLayout

- sections
- timeline
- experience
- education

---

# 9. Component Hierarchy

## Foundation

Container

Stack

Cluster

Grid

Divider

Spacer

Surface

Section

---

## Typography

Heading

Paragraph

Label

Caption

Code

Quote

---

## Navigation

Navbar

Sidebar

Footer

Breadcrumb

ThemeToggle

---

## Blog

ArticleHeader

ArticleMetadata

ArticleBody

TableOfContents

TagList

ReadingTime

RelatedPosts

ArticleNavigation

---

## Projects

ProjectCard

TechnologyBadge

ProjectHero

Gallery

RepositoryLink

LiveDemoButton

---

## Resume

Timeline

ExperienceCard

EducationCard

SkillsGrid

CertificationList

---

## Shared UI

Button

Card

Alert

Callout

CodeBlock

Tabs

Accordion

Badge

Avatar

Pill

Icon

---

# 10. Styling Strategy

Markdown should never contain styling.

Markdown only contains content.

Styling should come from:

```
BlogLayout

↓

prose.css

↓

components
```

Example

Markdown

```
# Heading

Paragraph

## Section
```

Should automatically become

- styled headings
- proper spacing
- syntax highlighted code
- styled lists
- responsive tables

---

# 11. Markdown Authoring

Standard posts should use

```
.md
```

Interactive posts should use

```
.mdx
```

Examples of interactive components

```
<Callout />

<ArchitectureDiagram />

<Video />

<ImageGallery />

<ComparisonTable />
```

---

# 12. Dynamic Routes

Routes should be generated automatically.

```
/blog/[slug]

/projects/[slug]
```

No manual page creation.

Adding a markdown file should automatically generate a page.

---

# 13. Homepage

Sections

Hero

Latest Blog Posts

Featured Projects

Resume Summary

Contact

Footer

---

# 14. Blog Landing Page

Features

Search

Tag filtering

Featured article

Article cards

Pagination

Estimated reading time

Publication date

---

# 15. Project Pages

Each project should support

Hero

Overview

Architecture

Problem Statement

Solution

Lessons Learned

Gallery

GitHub

Live Demo

Related Articles

---

# 16. Resume

Resume should not exist as one markdown file.

Instead:

```
resume/

    education.md

    experience.md

    certifications.md

    awards.md

    skills.md
```

The ResumeLayout should assemble these automatically.

---

# 17. SEO

Every page should include

Title

Description

Canonical URL

OpenGraph

Twitter Card

Structured Data

Sitemap support

RSS feed

---

# 18. Performance

Goals

100 Lighthouse Performance

100 Accessibility

100 Best Practices

100 SEO

No unnecessary JavaScript.

Astro Islands should only be used where interactivity is required.

---

# 19. Accessibility

Use semantic HTML.

Proper heading hierarchy.

Visible focus states.

Keyboard navigation.

ARIA only when necessary.

High color contrast.

---

# 20. Images

Images should use Astro image optimization.

Support

responsive images

lazy loading

automatic sizing

captions

---

# 21. Dark Mode

The project should support

Light

Dark

System

The implementation should use CSS variables.

No duplicated stylesheets.

---

# 22. Blog Features

Future support should include

Reading progress

Footnotes

Mathematical notation

Syntax highlighting

Mermaid diagrams

Callouts

Copy code button

Code line highlighting

Image zoom

Embedded YouTube

Embedded Tweets

---

# 23. Project Features

Projects should support

Architecture diagrams

Benchmark tables

Interactive demos

Expandable figures

Technology badges

Repository metadata

---

# 24. Future Expansion

The architecture should easily support

Publications

Talks

Research Papers

Course Notes

Digital Garden

Book Notes

Travel Notes

Photography

Without requiring major architectural changes.

---

# 25. CSS Organization

```
styles/

    global.css

    reset.css

    typography.css

    prose.css

    tokens.css

    utilities.css

    animations.css
```

Each file should have a single responsibility.

---

# 26. Guiding Principles

1. Markdown is content.

2. Components define structure.

3. CSS defines appearance.

4. Layouts compose pages.

5. Content Collections provide data.

6. Every page should be generated automatically.

7. Prefer composition over inheritance.

8. Avoid duplicated styling.

9. Avoid duplicated layouts.

10. Keep JavaScript to the absolute minimum.

11. Every component should have one responsibility.

12. The design should prioritize readability above aesthetics.

13. Performance should never be sacrificed for visual effects.

14. The codebase should remain understandable to a new contributor after years of growth.