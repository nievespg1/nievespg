#!/bin/bash
# Script to install Antigravity CLI and setup alias

set -e

echo "Installing Antigravity..."
curl -fsSL https://antigravity.google/cli/install.sh | bash

# Create an alias called antigravity which calls the agy cli
BASHRC="$HOME/.bashrc"
ALIAS_DEF="alias antigravity='agy'"

if [ -f "$BASHRC" ]; then
    if ! grep -q "alias antigravity=" "$BASHRC"; then
        echo "" >> "$BASHRC"
        echo "# Antigravity CLI alias" >> "$BASHRC"
        echo "$ALIAS_DEF" >> "$BASHRC"
        echo "Alias 'antigravity' added to $BASHRC"
    else
        echo "Alias 'antigravity' already exists in $BASHRC"
    fi
else
    echo "# Antigravity CLI alias" > "$BASHRC"
    echo "$ALIAS_DEF" >> "$BASHRC"
    echo "Created $BASHRC and added 'antigravity' alias"
fi
