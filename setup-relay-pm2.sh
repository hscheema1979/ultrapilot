#!/bin/bash
# Setup Relay with PM2 process management

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║   🔧 CONFIGURING RELAY WITH PM2                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
    echo "✓ PM2 installed"
fi

# Check if Relay exists
if [ ! -d "relay" ]; then
    echo "⚠️  Relay not found in Ultrapilot plugin"
    echo "   Expected: ./relay/"
    echo "   Run: cp -r ~/claude-relay ./relay/"
    exit 1
fi

# Install Relay dependencies
echo ""
echo "Installing Relay dependencies..."
cd relay
if [ ! -d "node_modules" ]; then
    npm install
fi
echo "✓ Relay dependencies installed"
cd ..

# Create logs directory
echo ""
echo "Creating logs directory..."
mkdir -p relay/logs
echo "✓ Logs directory created"

# Start Relay with PM2
echo ""
echo "Starting Relay with PM2..."
pm2 start relay.ecosystem.config.js

# Save PM2 process list
pm2 save

# Setup PM2 startup script (if not already)
echo ""
echo "Setting up PM2 startup script..."
pm2 startup systemd -u ubuntu --hp /home/ubuntu/.npm-global/bin/pm2 | tail -1 || echo "PM2 startup already configured"

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║   ✅ RELAY RUNNING UNDER PM2                                 ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "PM2 Commands:"
echo "  pm2 status              - Check Relay status"
echo "  pm2 logs relay          - View Relay logs"
echo "  pm2 restart relay       - Restart Relay"
echo "  pm2 stop relay          - Stop Relay"
echo "  pm2 mon                 - Live monitoring"
echo ""
echo "Relay Web UI: http://localhost:3000"
echo ""
