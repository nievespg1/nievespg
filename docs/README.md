# nievespg.dev

Personal portfolio and blog built with [Astro](https://astro.build).

## Quick start

```bash
pnpm install        # install dependencies
pnpm dev            # start dev server at localhost:4321
pnpm build          # build for production
pnpm preview        # preview production build
```

## Project structure

```
src/
├── components/     # UI components (ui/, navigation/)
├── content/        # Markdown content (blog/, projects/, resume/)
├── layouts/        # Page layouts (BaseLayout → ContentLayout → *)
├── pages/          # Route pages
├── styles/         # Vanilla CSS design system
└── content.config.ts  # Content collection schemas
```

## Stack

| Tool | Purpose |
|---|---|
| Astro 5 | Static site generator |
| TypeScript | Types & validation |
| pnpm | Package manager |
| Vanilla CSS | Design tokens, no framework |
| Markdown | Content via Astro collections |

## Design

Warm neutral palette inspired by Claude.ai's reading experience — serif headings, generous whitespace, and a narrow reading width. Full light/dark theme via `[data-theme]`.

## Commands

| `make` | `pnpm` | Action |
|---|---|---|
| `make dev` | `pnpm dev` | Start dev server |
| `make build` | `pnpm build` | Build for production |
| `make lint` | `pnpm lint` | Lint all files |
| `make format` | `pnpm format` | Format all files |
| `make clean` | `pnpm clean` | Remove build artifacts |

See [development.md](development.md) for the full workflow.
See [deployment.md](deployment.md) for build and deploy instructions.