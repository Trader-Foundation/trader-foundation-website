#!/bin/bash
# ============================================================
# TF ELITE TERMINAL — Vercel Deployment Script
# ============================================================
# Prerequisites:
#   - Vercel CLI installed (npm i -g vercel)
#   - Vercel account linked (vercel login)
#
# Usage: ./deploy/vercel-deploy.sh
# ============================================================

set -euo pipefail

echo "╔══════════════════════════════════════════════════╗"
echo "║  TF ELITE TERMINAL — VERCEL DEPLOYMENT          ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

# Step 1: Build the application
echo "▸ Step 1: Building application..."
pnpm build

# Step 2: Copy vercel config
echo "▸ Step 2: Setting up Vercel config..."
cp deploy/vercel.json ./vercel.json

# Step 3: Deploy to Vercel
echo "▸ Step 3: Deploying to Vercel..."
echo ""
echo "  For first-time setup, run:"
echo "    vercel --prod"
echo ""
echo "  For subsequent deployments:"
echo "    vercel --prod"
echo ""
echo "  Set environment variables in Vercel dashboard:"
echo "    - DATABASE_URL"
echo "    - JWT_SECRET"
echo "    - VITE_APP_ID"
echo "    - OAUTH_SERVER_URL"
echo "    - BUILT_IN_FORGE_API_URL"
echo "    - BUILT_IN_FORGE_API_KEY"
echo "    - PLAID_CLIENT_ID (optional)"
echo "    - PLAID_SECRET (optional)"
echo ""

# Run deployment
vercel --prod

echo ""
echo "✅ Deployment complete!"
