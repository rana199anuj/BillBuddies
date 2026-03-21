#!/bin/bash
# BillBuddies EC2 Deploy Script
# Run this on your EC2 server after cloning the repo

set -e

echo "=== BillBuddies Deploy Script ==="

# Pull latest code
echo "→ Pulling latest code from GitHub..."
git pull origin main

# Install dependencies
echo "→ Installing dependencies..."
npm install --production=false

# Build the Next.js app
echo "→ Building Next.js app..."
npm run build

# Restart PM2 (or start if not running)
echo "→ Restarting PM2 process..."
pm2 startOrRestart ecosystem.config.js --env production

echo ""
echo "✅ Deployment complete!"
echo "   App running at: http://ec2-3-27-230-133.ap-southeast-2.compute.amazonaws.com"
echo ""
echo "Useful commands:"
echo "  pm2 status         - Check app status"
echo "  pm2 logs billbuddies - View app logs"
echo "  pm2 restart billbuddies - Restart the app"
