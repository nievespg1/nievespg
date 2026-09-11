#!/bin/bash
# Refresh container credentials from the read-only Windows export.
set -euo pipefail

source_file=/mnt/host-gh/hosts.yml
config_dir="${GH_CONFIG_DIR:-$HOME/.config/gh-devcontainer}"

if [ ! -r "$source_file" ]; then
    echo "Windows GitHub CLI credential export is unavailable at $source_file." >&2
    echo "Rebuild the devcontainer to run the Windows export and mount it." >&2
    exit 1
fi

# gh may migrate its configuration even when running 'gh --version'.
# Keep its working copy writable and separate from the host export.
umask 077
mkdir -p "$config_dir"
chmod 700 "$config_dir"
install -m 600 "$source_file" "$config_dir/hosts.yml"
echo "GitHub CLI credentials refreshed in the container."
