#!/bin/bash
# Script to install Claude Code CLI
#
# npm 11+ blocks install scripts by default as a security measure.
# The --allow-scripts flag whitelists the @anthropic-ai/claude-code
# postinstall so the native binary download runs as expected.

set -e

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required to install Claude Code CLI but was not found on PATH." >&2
  echo "Rebuild the devcontainer so Node.js/npm are installed from .devcontainer/Dockerfile." >&2
  exit 1
fi

echo "Installing Claude Code CLI..."
npm install -g --allow-scripts=@anthropic-ai/claude-code @anthropic-ai/claude-code

# copy global settings if available
if [ -n "$CLAUDE_CODE_SETTINGS" ]; then
  echo "Copying global Claude Code CLI settings to devcontainer..."
  mkdir -p "$HOME/.claude"
  cp "$CLAUDE_CODE_SETTINGS" "$HOME/.claude/"
else
  echo "No global Claude Code CLI settings found at $CLAUDE_CODE_SETTINGS. Skipping copy."
fi
