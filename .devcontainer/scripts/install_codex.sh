#!/bin/bash
# Script to install Codex CLI

set -e

echo "Installing Codex CLI..."
curl -fsSL https://chatgpt.com/codex/install.sh | CODEX_NON_INTERACTIVE=1 bash
