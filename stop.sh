#!/bin/bash
# UltraX Stop Script

echo "🛑 Stopping UltraX services..."

# Stop Relay if we started it
if [ -f .ultra/pids.txt ]; then
  RELAY_PID=$(cat .ultra/pids.txt)
  if [ -n "$RELAY_PID" ] && kill -0 $RELAY_PID 2>/dev/null; then
    echo "   Stopping Relay (PID: $RELAY_PID)..."
    kill $RELAY_PID 2>/dev/null
  fi
  rm .ultra/pids.txt
fi

# Keep UltraX Gateway running (systemd managed)
echo "✅ Services stopped"
echo "   • UltraX Gateway: Still running (systemd managed)"
echo "   • To stop gateway: sudo systemctl stop ultrax-server"
