# Git & workflow conventions

## Commit messages

- Use conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, etc.
- Do **not** add `Co-Authored-By` trailers to commit messages unless explicitly told so.

## Pushing

- Before pushing, always `git pull --rebase` to avoid non-fast-forward rejections.
- **Never push without explicit confirmation from the user.** This applies to all branches, not just `origin/main`.

## Branching

- Work on current working branch unless told otherwise.

## Versioning & releases

- Tags use the `v` prefix (e.g., `v0.2.0`). No manual version bumps — the tag is the version.
- Before tagging a release, ensure the working tree is clean and all changes are committed.