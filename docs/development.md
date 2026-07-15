# Development

## Prerequisites

- **Node.js 22+** — installed via [NodeSource](https://deb.nodesource.com)
- **pnpm** — installed via corepack: `corepack enable pnpm`
- **Docker** — for the devcontainer (optional, but recommended)

## Devcontainer

The repo includes a `.devcontainer/` with GPU support, micromamba, and pnpm pre-installed. After building, dependencies are installed automatically via `post-create.sh`.

Rebuild the container from VS Code: `Ctrl+Shift+P → Dev Containers: Rebuild Container`.

## Workflow

1. **Dev** — `pnpm dev` starts the dev server with HMR at `localhost:4321`
2. **Lint** — `pnpm lint` runs ESLint (flat config with typescript-eslint + astro plugin)
3. **Format** — `pnpm format` formats with Prettier (includes `.astro` files)
4. **Build** — `pnpm build` runs `astro check` then `astro build` — output goes to `dist/`
5. **Preview** — `pnpm preview` serves the production build locally

## Testing

No test framework is configured yet. The build itself (`astro check && astro build`) validates types, content schemas, and route generation.

## Code style

- TypeScript strict mode
- No `any` types — use proper generics or `unknown` with narrowing
- Astro components use `---` frontmatter for logic, template below
- CSS custom properties for all design values — no hardcoded colors or spacing
- Prefer semantic class names over utility classes

## Adding a page

1. Create a `.astro` file in `src/pages/` (Astro generates the route from the filename)
2. Use one of the existing layouts (`ContentLayout` for most pages)
3. For dynamic routes, use `[...slug].astro` with `getStaticPaths()`