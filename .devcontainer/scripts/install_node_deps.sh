#!/bin/bash
# Install Node.js project dependencies via pnpm
#
# Prerequisites: pnpm must already be installed (handled in the Dockerfile).
# The package.json "pnpm.onlyBuiltDependencies" field pre-approves esbuild
# and sharp native builds, so no manual approve-builds step is needed.

set -e

echo "Installing Node.js dependencies with pnpm..."

cd /workspace/nievespg

# Install all dependencies (lockfile is committed, so this is reproducible)
pnpm install --frozen-lockfile

echo "Node.js dependencies installed."