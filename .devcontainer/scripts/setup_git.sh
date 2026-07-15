#!/bin/bash
# Configure git settings for the dev container

set -e

echo "Configuring git..."

# Point http.sslcainfo to the C: drive mount (mounted at /mnt/c in the container)
GIT_SSL_CAINFO="/mnt/c/Program Files/Git/mingw64/etc/ssl/certs/ca-bundle.crt"
if [ -f "$GIT_SSL_CAINFO" ]; then
    git config --global http.sslcainfo "$GIT_SSL_CAINFO"
    echo "Git SSL CA info set to $GIT_SSL_CAINFO"
else
    echo "WARNING: Git SSL CA bundle not found at $GIT_SSL_CAINFO"
fi

# git config --global http.sslbackend openssl
git config --global user.name "Gabriel Nieves"
git config --global user.email "gabriel@nievespg.com"
git config --global http.sslbackend gnutls
git config --global core.autocrlf false
git config --global pull.rebase true
git config --global credential.helper manager
echo "Git configuration complete."
