#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="/var/www/up2you"
BRANCH="live"
BACKEND_DIR="$REPO_DIR/backend"
JEWELRY_DIR="$REPO_DIR/jewelry"
PM2_NAME="up2you-backend"

if [ ! -d "$REPO_DIR/.git" ]; then
  echo "Repo not found at $REPO_DIR"
  exit 1
fi

if [ "$(id -u)" -eq 0 ]; then
  echo "Run this script as a regular user; it will sudo only for nginx reload."
  exit 1
fi

echo "Updating repo ($BRANCH)..."
git -C "$REPO_DIR" fetch origin "$BRANCH"
git -C "$REPO_DIR" checkout "$BRANCH"
git -C "$REPO_DIR" pull --ff-only origin "$BRANCH"

echo "Installing backend deps..."
npm ci --prefix "$BACKEND_DIR"
echo "Building backend..."
npm run build --prefix "$BACKEND_DIR"

echo "Installing frontend deps..."
npm ci --prefix "$JEWELRY_DIR"
echo "Building frontend..."
npm run build --prefix "$JEWELRY_DIR"

echo "Restarting backend via PM2..."
if pm2 restart "$PM2_NAME"; then
  pm2 save
else
  pm2 start "$BACKEND_DIR/dist/index.js" --name "$PM2_NAME"
  pm2 save
fi

echo "Reloading nginx..."
sudo systemctl reload nginx
echo "Deploy complete."
