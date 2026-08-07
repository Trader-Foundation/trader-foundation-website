#!/usr/bin/env bash
set -euo pipefail

# Assemble the static half of the exam, and refuse to ship a damaged copy.
#
# This project lost roughly a dozen deployments to a corrupted upload of the
# engine, and the damage stayed invisible until a rep opened the page and got
# "Z_DATA_ERROR: invalid distance too far back". app.js is 84KB of plain text,
# so the safest thing that can happen to it on the way here is nothing.
#
# Two ways in, both ending at the same check:
#   - deploying from the repo, the files are already sitting next to this script
#   - uploading without them, pull from a deployment already proven byte-correct
# Either way the sha256 must match or the build fails loudly instead of going
# live. Update these sums in the same commit that changes app.js or index.html.

APP_SHA="94486304bdc0ad511634de0c5d2561329cd00be2a66f5f4bd4eec42570efa5c7"
IDX_SHA="52962cd059bdfc9cbff28c90ae74fc59292885b3d5009e57ff1e4176eb643614"

verify() {
  printf '%s  public/app.js\n%s  public/index.html\n' "$APP_SHA" "$IDX_SHA" |
    sha256sum -c - >/dev/null 2>&1
}

# The functions travel as text too, and unlike the engine there is no runtime
# check on them, so a damaged upload would only surface as a broken exam. Fail
# here instead. Regenerate with:
#   sha256sum api/*.js package.json > api.sha256
if [ -f api.sha256 ]; then
  echo "checking the functions against api.sha256"
  sha256sum -c api.sha256
else
  echo "FATAL: api.sha256 is missing, refusing to ship unverified functions." >&2
  exit 1
fi

mkdir -p public

if [ -f app.js ] && [ -f index.html ]; then
  echo "using the files in this checkout"
  cp app.js index.html public/
  if verify; then
    echo "engine verified against recorded sha256"
    exit 0
  fi
  echo "FATAL: the checkout copy does not match the recorded sha256." >&2
  exit 1
fi

# No local copy, so this is an upload that deliberately left the engine behind.
# Vercel deployment URLs are immutable, so they keep serving the exact bytes
# that were verified when they were built.
for src in \
  "https://dashboard-ouhwq0xwg-traderfoundations-projects.vercel.app" \
  "https://dashboard-traderfoundations-projects.vercel.app"; do
  echo "fetching the engine from $src"
  curl -fsSL --retry 3 --max-time 30 "$src/app.js" -o public/app.js || continue
  curl -fsSL --retry 3 --max-time 30 "$src/index.html" -o public/index.html || continue
  if verify; then
    echo "engine verified against recorded sha256, from $src"
    exit 0
  fi
  echo "hash mismatch from $src, trying the next source" >&2
done

echo "FATAL: no source produced an engine matching the recorded sha256." >&2
exit 1
