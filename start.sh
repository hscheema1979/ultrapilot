#!/bin/bash
# UltraX Unified Startup Script
# Starts Ultrapilot Relay (3002) and UltraX Gateway (3001) alongside existing claude-relay (3000)

PLUGIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PLUGIN_DIR"

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║           🦎 ULTRAX - All-in-One Plugin for Claude Code          ║"
echo "║                                                                   ║"
echo "║  Running alongside existing claude-relay on port 3000           ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Check if Ultrapilot Relay is already running on port 3002
if curl -s http://localhost:3002 > /dev/null; then
  echo "✅ Ultrapilot Relay already running on port 3002"
else
  echo "🚀 Starting Ultrapilot Relay (port 3002)..."
  cd relay
  bash claude-ultrapilot-wrapper.sh &
  RELAY_PID=$!
  echo "   Relay PID: $RELAY_PID"
  cd ..
  sleep 3

  # Verify it started
  if curl -s http://localhost:3002 > /dev/null; then
    echo "   ✅ Ultrapilot Relay started successfully"
  else
    echo "   ❌ Failed to start Ultrapilot Relay"
    exit 1
  fi
fi

# Check if Gateway is already running
if systemctl is-active --quiet ultrax-server; then
  echo "✅ UltraX Gateway already running (port 3001)"
else
  echo "🚀 Starting UltraX Gateway (port 3001)..."
  sudo systemctl start ultrax-server 2>/dev/null || node dist/server.js &
  sleep 2
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                   ✨ ALL SERVICES RUNNING ✨                   ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "📡 Access Points:"
echo "   • Main Relay:     http://localhost:3000 (claude-relay via PM2)"
echo "   • Ultra Relay:    http://localhost:3002 (Ultrapilot Relay)"
echo "   • API Gateway:    http://localhost:3001 (UltraX Gateway)"
echo "   • Tailscale:      http://vps5:3001"
echo ""
echo "🎯 Both relays running simultaneously!"
echo ""
echo "🔧 Management:"
echo "   • Stop all:       ./stop.sh"
echo "   • Status:         ./status.sh"
echo "   • Restart:        ./start.sh"
echo ""

# Save PIDs for cleanup
mkdir -p .ultra
echo $RELAY_PID > .ultra/relay-pid.txt
