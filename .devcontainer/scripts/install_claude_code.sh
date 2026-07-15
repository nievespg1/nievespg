#!/bin/bash
# Script to install Claude Code CLI

set -e

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required to install Claude Code CLI but was not found on PATH." >&2
  echo "Rebuild the devcontainer so Node.js/npm are installed from .devcontainer/Dockerfile." >&2
  exit 1
fi

echo "Installing Claude Code CLI..."
npm install -g @anthropic-ai/claude-code
