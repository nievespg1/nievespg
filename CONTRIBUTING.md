# CONTRIBUTING.md

# Personal Website with Astro

This document defines the development standards for this repository.

It is intended for both human contributors and AI coding agents.

When making changes, follow this document even if an alternative implementation would also work.

The objective is consistency, maintainability, and long-term readability.

---

# Project Philosophy

This project is **content-first**.

The technology exists to present content beautifully.

Every architectural decision should prioritize:

- readability
- maintainability
- accessibility
- performance
- simplicity

Avoid introducing complexity unless it solves a measurable problem.

---

# Primary Goals

This repository should remain:

- easy to understand
- easy to extend
- easy to refactor
- pleasant to read

The project should feel intentionally engineered rather than rapidly assembled.

---

# Architecture Principles

## 1. Separation of Concerns

Content belongs in Markdown.

Layouts define page structure.

Components define reusable UI.

CSS defines appearance.

Utilities define shared logic.

Never mix responsibilities.

---

## 2. Composition over Inheritance

Prefer

```
<ArticleHeader />
<TagList />
<ReadingTime />
<ArticleBody />
```

instead of

```
<MassiveBlogComponent />
```

Small components are preferred.

---

## 3. Components Should Be Predictable

Each component should have one responsibility.

Examples

Good

```
Button

Card

Heading

Tag

ProjectCard

TableOfContents
```

Avoid

```
ContentRenderer

UniversalCard

PageRenderer

MegaLayout
```

---

# Folder Responsibilities

```
components/
```

Reusable UI.

No routing.

No page-specific logic.

---

```
layouts/
```

Compose pages.

Layouts may use components.

Layouts should not contain business logic.

---

```
content/
```

Markdown only.

No styling.

No HTML unless absolutely necessary.

---

```
styles/
```

Global CSS.

Typography.

Tokens.

Utilities.

Animations.

---

```
pages/
```

Routing only.

Minimal implementation.

Prefer delegating work to layouts.

---

```
utils/
```

Pure utility functions.

Utilities should never manipulate the DOM.

---

# Naming Conventions

Use PascalCase

```
ProjectCard.astro

BlogLayout.astro

ReadingTime.ts
```

Collections

lowercase

```
blog

projects

resume
```

CSS

Use kebab-case

```
article-header

project-card

content-grid
```

Variables

```
--color-background

--radius-medium

--spacing-xl
```

---

# Component Design

Components should

- accept explicit props
- have no hidden side effects
- avoid global state
- avoid direct DOM manipulation

Every component should be reusable.

---

# Props

Prefer

```
<ArticleHeader

title

description

publishDate

tags

/>
```

Avoid

```
<ArticleHeader

article

/>
```

Explicit props improve readability.

---

# CSS Philosophy

Avoid inline styles.

Avoid CSS-in-JS.

Avoid utility class explosions.

Prefer semantic class names.

Good

```
.article-header

.project-grid

.callout
```

Bad

```
.mt-8

.flex

.items-center

.justify-between
```

---

# Design Tokens

Never hardcode

colors

spacing

radius

font sizes

Use

```
tokens.css
```

Example

```
color: var(--color-text);

border-radius: var(--radius-medium);

max-width: var(--content-width);
```

---

# Typography

Typography is one of the most important parts of this project.

Do not invent typography.

Use existing typography tokens.

---

# Markdown

Markdown should remain clean.

Good

```
# Heading

Paragraph

## Section
```

Bad

```
<div>

<span>

style=

inline html

presentation
```

Markdown is content only.

---

# MDX

Only use MDX when necessary.

Examples

Interactive diagrams

Videos

Image galleries

Alerts

Tabs

Everything else should remain Markdown.

---

# Images

Always use Astro image optimization.

Do not use raw img tags unless required.

Every image should include

alt text

width

height

lazy loading

---

# Accessibility

Every PR should maintain accessibility.

Requirements

Semantic HTML

Keyboard navigation

Visible focus

ARIA only when necessary

Correct heading hierarchy

---

# Performance

Assume JavaScript is expensive.

Before adding JavaScript ask

Does this improve the experience?

If not,

do not add it.

---

# Client Islands

Astro Islands should only exist for

Theme toggle

Search

Interactive diagrams

Copy buttons

Expandable figures

Never hydrate an entire page.

---

# Dependencies

Before adding a dependency ask

Can Astro already do this?

Can this be implemented simply?

Does this reduce maintenance?

If not,

do not add it.

---

# Error Handling

Fail loudly.

Prefer compile-time errors.

Avoid silent failures.

Validate all content collections.

---

# TypeScript

Prefer explicit types.

Avoid

```
any
```

Prefer

```
interface

type

readonly

const
```

---

# Comments

Write comments explaining

WHY

not

WHAT

Bad

```ts
// Increment i
i++;
```

Good

```ts
// Skip draft articles during production builds
```

---

# AI Agent Guidelines

When modifying this repository

DO

- preserve architecture
- reuse existing components
- reuse design tokens
- reuse layouts
- maintain accessibility
- maintain performance
- write explicit code
- prefer readability

DO NOT

- introduce frameworks
- duplicate components
- duplicate CSS
- hardcode colors
- hardcode spacing
- add dependencies unnecessarily
- increase JavaScript bundle size
- replace working architecture

---

# Pull Request Checklist

Every change should satisfy

☐ Builds successfully

☐ No lint errors

☐ No TypeScript errors

☐ Accessible

☐ Responsive

☐ Uses design tokens

☐ Uses existing components

☐ No duplicated logic

☐ No duplicated CSS

☐ No unnecessary JavaScript

---

# Code Review Philosophy

Code should optimize for

clarity over cleverness

explicit over implicit

simple over abstract

boring over magical

future maintainers over current convenience

---

# Long-Term Vision

The project should be able to grow for many years.

Future additions should naturally fit into the existing architecture.

The codebase should feel cohesive regardless of when a feature was added.

Every contribution should leave the repository in a better state than it was found.