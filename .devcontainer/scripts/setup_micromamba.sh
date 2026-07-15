#!/bin/bash
# Set up Micromamba environment for the dev container

set -e

echo "Setting up Micromamba environment..."

# Initialize micromamba for the current bash shell session
eval "$(micromamba shell hook --shell bash)"

# Create environment if it doesn't exist, otherwise update it
if [ ! -d "/home/vscode/micromamba/envs/nievespg" ]; then
    echo "Creating 'nievespg' environment..."
    micromamba env create -f /workspace/nievespg/environment.yml -y
else
    echo "Updating 'nievespg' environment..."
    micromamba env update -f /workspace/nievespg/environment.yml -y
fi

# echo "Installing project dependencies via uv..."
# micromamba run -n nievespg uv pip install -e "/workspace/nievespg[all]"

# Automatically activate nievespg environment in .bashrc
BASHRC="/home/vscode/.bashrc"
if [ -f "$BASHRC" ]; then
    if ! grep -q "micromamba activate nievespg" "$BASHRC"; then
        echo "" >> "$BASHRC"
        echo "# Activate nievespg micromamba environment by default" >> "$BASHRC"
        echo "micromamba activate nievespg" >> "$BASHRC"
        echo "Default environment activation added to $BASHRC"
    fi
fi

echo "Micromamba setup complete."
