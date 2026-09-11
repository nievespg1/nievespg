#!/bin/bash
# Install GitHub CLI from its official signed apt repository.
set -euo pipefail

# Override the old read-only path when repairing an existing container.
export GH_CONFIG_DIR="$HOME/.config/gh-devcontainer"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
bash "$SCRIPT_DIR/sync_gh_auth.sh"

if ! command -v gh >/dev/null 2>&1; then
    echo "Installing GitHub CLI..."
    keyring=$(mktemp)
    trap 'rm -f "$keyring"' EXIT
    curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg -o "$keyring"
    sudo install -D -m 644 "$keyring" /etc/apt/keyrings/githubcli-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
        | sudo tee /etc/apt/sources.list.d/github-cli.list >/dev/null
    sudo apt-get update
    sudo apt-get install -y --no-install-recommends gh
fi

gh --version
if gh auth status --hostname github.com >/dev/null 2>&1; then
    echo "GitHub CLI authentication is available."
else
    echo "GitHub CLI installed, but GitHub.com authentication is unavailable."
    echo "Run 'gh auth login --hostname github.com' on Windows, then reopen the devcontainer."
fi
