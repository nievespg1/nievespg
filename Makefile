.PHONY: help install dev build preview lint format format-check clean

.DEFAULT_GOAL := help

help: ## Show available targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*## "}; {printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies (pnpm install)
	pnpm install

dev: ## Start the dev server with HMR (--host for network access)
	pnpm dev --host

build: ## Build for production (type-check + static build)
	pnpm build

preview: ## Preview the production build (--host for network access)
	pnpm preview --host

lint: ## Run ESLint across the project
	pnpm lint

format: ## Format all files with Prettier
	pnpm format

format-check: ## Check formatting without writing changes
	pnpm format:check

clean: ## Remove build artifacts (dist, .astro, node_modules/.astro)
	pnpm clean