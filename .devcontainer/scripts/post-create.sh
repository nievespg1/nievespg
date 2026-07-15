#!/bin/bash
# Post-create script to run initialization tasks in sequence

set -e

# Get the directory of the current script to reference sibling scripts reliably
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Running post-create scripts..."

# Run install_antigravity.sh
bash "$SCRIPT_DIR/install_antigravity.sh"

# Run install_codex.sh
bash "$SCRIPT_DIR/install_codex.sh"

# Run install_claude_code.sh
bash "$SCRIPT_DIR/install_claude_code.sh"

# Setup micromamba environment
bash "$SCRIPT_DIR/setup_micromamba.sh"

# Install Node.js project dependencies
bash "$SCRIPT_DIR/install_node_deps.sh"

# Configure git
bash "$SCRIPT_DIR/setup_git.sh"

