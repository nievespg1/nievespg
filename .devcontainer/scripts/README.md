# GitHub CLI in the devcontainer

`install_gh.sh` installs Linux `gh` from GitHub's signed apt repository during
post-create. Existing installations are reused.

Before container creation/start, `export_gh_auth.ps1` runs on Windows and exports
the active `github.com` token from Windows `gh` to
`%APPDATA%\nievespg-devcontainer\gh\hosts.yml`. This is a plaintext token copy
outside the repository, with Windows access restricted to your user and SYSTEM.
The token is never printed. The directory is mounted read-only at `/mnt/host-gh`.
`sync_gh_auth.sh` copies `hosts.yml` into a writable container directory,
`/home/vscode/.config/gh-devcontainer`, before the first `gh` invocation and on
every container start. `GH_CONFIG_DIR` directs Linux `gh` to this working copy
so configuration migrations can succeed. Its directory and file permissions are
700 and 600, respectively. Container processes running as your user or root can
read this credential. The original Windows Credential Manager entry is unchanged.

Rebuild the devcontainer after adding this configuration. Verify inside it with
`gh auth status`. To change accounts or refresh authentication, use Windows `gh`
and reopen the devcontainer so initialization exports the current token. Manage
authentication on Windows: the container's `hosts.yml` is replaced on each start.
Other GitHub hosts are not exported. Other Linux CLI settings remain writable.

If Windows `gh` has no token, initialization clears the previous export and
continues without authentication; installation still completes. Environment
tokens such as `GH_TOKEN` take precedence over this configuration.
