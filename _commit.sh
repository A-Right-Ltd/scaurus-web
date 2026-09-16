#!/usr/bin/env zsh
cd /mnt/d/aittorney/scaurus-web
git add -A
git status
git commit -m "$(cat <<'EOF'
Add Scaurus marketing shell with Quant rewrites.

Landing is the only app surface; login and the product load same-origin from quant-web so the session cookie is shared.
EOF
)"
git status
git log -1 --format='%an %ae%n%s'
