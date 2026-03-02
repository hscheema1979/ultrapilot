#!/bin/bash
# UltraX Status Check Script

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                   🦎 ULTRAX - Service Status                       ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Check Relay (Port 3000)
echo "📡 Relay Web UI (Port 3000):"
if curl -s http://localhost:3000 > /dev/null; then
  echo "   ✅ Running"
  echo "   🌐 URL: http://localhost:3000"
  echo "   🌐 URL: http://vps5:3000"
else
  echo "   ❌ Not running"
fi
echo ""

# Check UltraX Gateway (Port 3001)
echo "📡 UltraX Gateway (Port 3001):"
if systemctl is-active --quiet ultrax-server; then
  echo "   ✅ Running (systemd service)"
  echo "   🌐 URL: http://localhost:3001"
  echo "   🌐 Tailscale: http://vps5:3001"
  
  # Test health endpoint
  HEALTH=$(curl -s http://localhost:3001/health 2>/dev/null)
  if [ -n "$HEALTH" ]; then
    echo "   📊 Health: $(echo $HEALTH | grep -o '"status":"[^"]*"' | cut -d'"' -f4)"
    echo "   📊 Sessions: $(echo $HEALTH | grep -o '"sessions":[0-9]*' | grep -o '[0-9]*')"
  fi
else
  echo "   ❌ Not running"
  echo "   💡 Start with: sudo systemctl start ultrax-server"
fi
echo ""

# Summary
if curl -s http://localhost:3000 > /dev/null && systemctl is-active --quiet ultrax-server; then
  echo "✨ All services running!"
elif curl -s http://localhost:3000 > /dev/null; then
  echo "⚠️  Only Relay running (Gateway stopped)"
elif systemctl is-active --quiet ultrax-server; then
  echo "⚠️  Only Gateway running (Relay stopped)"
else
  echo "❌ No services running"
  echo "   💡 Start all: ./start.sh"
fi
