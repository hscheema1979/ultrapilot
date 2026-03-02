#!/bin/bash
# UltraX Unified Startup Script
# Starts Relay (3000) and UltraX Gateway (3001) together

PLUGIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PLUGIN_DIR"

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║           🦎 ULTRAX - All-in-One Plugin for Claude Code          ║"
echo "║                                                                   ║"
echo "║  One plugin. Zero setup. Everything you need.                 ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Check if Relay is already running
if curl -s http://localhost:3000 > /dev/null; then
  echo "✅ Relay already running on port 3000"
else
  echo "🚀 Starting Relay Web UI (port 3000)..."
  cd relay && node bin/cli.js &
  RELAY_PID=$!
  echo "   Relay PID: $RELAY_PID"
  cd ..
  sleep 3
fi

# Check if Gateway is already running
if systemctl is-active --quiet ultrax-server; then
  echo "✅ UltraX Gateway already running (systemd service)"
else
  echo "🚀 Starting UltraX Gateway (port 3001)..."
  sudo systemctl start ultrax-server
  sleep 3
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                   ✨ ALL SERVICES RUNNING ✨                   ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "📡 Access Points:"
echo "   • Web UI:         http://localhost:3000"
echo "   • API Gateway:     http://localhost:3001"
echo "   • Tailscale:       http://vps5:3001"
echo "   • Public IP:       http://51.81.34.78:3001"
echo ""
echo "🔧 Management:"
echo "   • Stop:           ./stop.sh"
echo "   • Status:         ./status.sh"
echo "   • Restart:        ./start.sh"
echo ""
echo "🎯 Ready for development!"
echo ""

# Save PIDs for cleanup
echo $RELAY_PID > .ultra/pids.txt
