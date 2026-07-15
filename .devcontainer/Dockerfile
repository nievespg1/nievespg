# Use NVIDIA CUDA base image which includes the NVIDIA drivers/tools (nvidia-smi)
FROM nvidia/cuda:13.1.0-devel-ubuntu22.04

# Install common build tools required for native extension compilation
USER root
RUN apt-get update \
 && DEBIAN_FRONTEND=noninteractive apt-get -y install --no-install-recommends \
   build-essential \
   cmake \
   git \
   curl \
   ca-certificates \
   pkg-config \
   libssl-dev \
   bubblewrap \
   libxcb1 \
   libx11-6 \
   libglib2.0-0 \
   libgl1-mesa-glx \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

# Install Node.js/npm for CLI tools that are distributed through npm.
# pnpm is the project's package manager — install it via corepack (the recommended way).
# COREPACK_ENABLE_DOWNLOAD_PROMPT=0 suppresses the interactive "[Y/n]" prompt
# that newer Node.js versions show before downloading the package manager binary.
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
 && DEBIAN_FRONTEND=noninteractive apt-get -y install --no-install-recommends nodejs \
 && npm install -g npm@latest \
 && COREPACK_ENABLE_DOWNLOAD_PROMPT=0 corepack enable pnpm \
 && COREPACK_ENABLE_DOWNLOAD_PROMPT=0 corepack prepare pnpm@latest --activate \
 && rm -rf /var/lib/apt/lists/*

# Persist the env var so that any subsequent on-demand download (e.g. during
# `pnpm install`) also skips the prompt in headless/CI environments.
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0


# Create a non-root `vscode` user expected by Dev Containers
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=1000
RUN groupadd -g ${USER_GID} ${USERNAME} || true \
 && useradd -m -s /bin/bash -u ${USER_UID} -g ${USER_GID} ${USERNAME} || true \
 && apt-get update \
 && DEBIAN_FRONTEND=noninteractive apt-get -y install --no-install-recommends sudo \
 && echo "${USERNAME} ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/${USERNAME} \
 && chmod 0440 /etc/sudoers.d/${USERNAME} \
 && rm -rf /var/lib/apt/lists/*

# Try to install nvtop from package repo; if not available, build from source
RUN apt-get update \
 && if apt-cache show nvtop >/dev/null 2>&1; then \
      apt-get -y install nvtop; \
    else \
      git clone --depth 1 https://github.com/Syllo/nvtop.git /tmp/nvtop && \
      mkdir -p /tmp/nvtop/build && cd /tmp/nvtop/build && \
      cmake .. && make -j$(nproc) && make install && \
      rm -rf /tmp/nvtop; \
    fi \
 && rm -rf /var/lib/apt/lists/*

# Copy micromamba and uv binaries from official Docker images
COPY --from=mambaorg/micromamba:2.0.5 /bin/micromamba /usr/local/bin/micromamba
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /usr/local/bin/

# Ensure nvidia-smi is available (provided by the CUDA image/runtime)

USER vscode
# Point npm's global prefix to a user-writable directory so `npm install -g`
# never requires root.
RUN npm config set prefix /home/vscode/.npm-global \
 && echo 'export PATH="/home/vscode/.npm-global/bin:$PATH"' >> /home/vscode/.bashrc

# Initialize micromamba shell for the vscode user
RUN micromamba shell init -s bash -r /home/vscode/micromamba

WORKDIR /workspace/sensor-fusion
