# Content

All content lives in `src/content/` as Markdown files. Astro's content collections validate frontmatter and generate pages at build time.

## Blog posts

Create a new `.md` file in `src/content/blog/`:

```markdown
---
title: "My Post Title"
description: "A short summary for previews and SEO"
publishDate: 2026-07-14
tags: ["astro", "javascript"]
draft: false
featured: false
---

Post content in Markdown here...
```

**Optional fields:** `updatedDate`, `image`, `draft` (default `false`), `featured` (default `false`).

## Projects

Create a `.md` file in `src/content/projects/`:

```markdown
---
title: "My Project"
summary: "What it does and why it matters"
technologies: ["Python", "TypeScript"]
github: "https://github.com/user/repo"
website: "https://example.com"
featured: true
---

Project description in Markdown...
```

## Resume sections

Create a `.md` file in `src/content/resume/`:

```markdown
---
section: "experience"
order: 1
title: "Software Engineer — Company Name"
---

Description of role, achievements, and responsibilities.
```

Available sections: `education`, `experience`, `certifications`, `awards`, `skills`. The `order` field controls display order within each section group.

## Drafts

Set `draft: true` in the frontmatter to keep a post unpublished. Draft posts are excluded from the build and won't appear in listings or dynamic routes.