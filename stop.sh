#!/bin/bash
# UltraX Stop Script - Stops only Ultrapilot services, leaves claude-relay running

PLUGIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PLUGIN_DIR"

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║              🛑 STOPPING ULTRAPILOT SERVICES ONLY              ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Stop Ultrapilot Relay on port 3002
if [ -f .ultra/relay-pid.txt ]; then
  RELAY_PID=$(cat .ultra/relay-pid.txt)
  if ps -p $RELAY_PID > /dev/null 2>&1; then
    echo "🛑 Stopping Ultrapilot Relay (PID: $RELAY_PID)..."
    kill $RELAY_PID
    rm .ultra/relay-pid.txt
    echo "   ✅ Ultrapilot Relay stopped"
  else
    echo "ℹ️  Ultrapilot Relay not running"
  fi
else
  echo "ℹ️  No relay PID file found"
fi

# Stop UltraX Gateway (optional - keeps it running for API access)
echo ""
echo "ℹ️  UltraX Gateway left running (port 3001) for API access"
echo "   To stop it: sudo systemctl stop ultrax-server"

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                    ✅ ULTRAPILOT STOPPED                       ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "📡 Still Running:"
echo "   • Main Relay:     http://localhost:3000 (claude-relay via PM2)"
echo "   • API Gateway:    http://localhost:3001 (if needed)"
echo ""
