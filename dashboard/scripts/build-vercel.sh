#!/bin/bash
# ============================================================
# TF ELITE TERMINAL — Vercel Build (Build Output API v3)
# Produces .vercel/output/ with:
#   - static/          the Vite-built client
#   - functions/api.func/  the bundled Express API (self-contained)
#   - config.json      routing: /api/* -> function, rest -> SPA
# Run from the dashboard directory (Vercel buildCommand does this).
# ============================================================
set -euo pipefail

OUT=".vercel/output"
rm -rf "$OUT"
mkdir -p "$OUT/static" "$OUT/functions/api.func"

echo "▸ Building client (vite)..."
pnpm exec vite build
cp -r dist/public/. "$OUT/static/"

echo "▸ Bundling API function (esbuild, self-contained)..."
pnpm exec esbuild server/vercelEntry.ts \
  --bundle \
  --platform=node \
  --format=cjs \
  --target=node20 \
  --outfile="$OUT/functions/api.func/server.js" \
  --alias:@shared=./shared \
  --external:mock-aws-s3 --external:aws-sdk --external:nock \
  --log-level=warning

cat > "$OUT/functions/api.func/index.js" <<'EOF'
const mod = require("./server.js");
const app = mod.default || mod;
module.exports = (req, res) => app(req, res);
EOF

cat > "$OUT/functions/api.func/package.json" <<'EOF'
{ "type": "commonjs" }
EOF

cat > "$OUT/functions/api.func/.vc-config.json" <<'EOF'
{
  "runtime": "nodejs22.x",
  "handler": "index.js",
  "launcherType": "Nodejs",
  "maxDuration": 60,
  "memory": 1024
}
EOF

cat > "$OUT/config.json" <<'EOF'
{
  "version": 3,
  "routes": [
    { "src": "/api/.*", "dest": "/api" },
    { "handle": "filesystem" },
    { "src": "/.*", "dest": "/index.html" }
  ]
}
EOF

echo "✅ Build Output ready at $OUT"
