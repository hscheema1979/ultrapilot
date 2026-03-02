#!/bin/bash
# Update UltraX Server to bind to all network interfaces (0.0.0.0)
# This enables access from talismans alias and external domains

set -e

SERVICE_NAME="ultrax-server"
SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"
HOST="0.0.0.0"
PORT="3001"

echo "🌐 Configuring UltraX Server for network access..."

# Backup existing service
sudo cp "$SERVICE_FILE" "${SERVICE_FILE}.backup"

# Update service to bind to all interfaces
sudo tee "$SERVICE_FILE" > /dev/null <<EOF
[Unit]
Description=UltraX Server - Ultrapilot Gateway for Web UI and Google Chat
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/.claude/plugins/ultrapilot
Environment=NODE_ENV=production
Environment=HOST=$HOST
Environment=PORT=$PORT
Environment=RELAY_URL=http://localhost:3000
ExecStart=/usr/bin/npx tsx /home/ubuntu/.claude/plugins/ultrapilot/src/server.ts
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=ultrax-server

[Install]
WantedBy=multi-user.target
EOF

echo "✅ Updated service to bind to $HOST:$PORT"

# Reload systemd
sudo systemctl daemon-reload

# Restart service
sudo systemctl restart "$SERVICE_NAME"

# Wait for service to start
sleep 3

# Check status
echo ""
echo "📊 Service Status:"
sudo systemctl status "$SERVICE_NAME" --no-pager | head -15

echo ""
echo "🌐 Network Access Enabled:"
echo "  - Local:          http://localhost:$PORT"
echo "  - All interfaces: http://$HOST:$PORT"
echo "  - VPS5 IP:        http://$(hostname -I | awk '{print $1'}):$PORT"
echo ""
echo "🔗 External Access:"
echo "  - Talismans alias: ENABLED"
echo "  - Domain access:  ENABLED"
echo "  - API calls:      ENABLED"
echo ""
echo "🧪 Test Commands:"
echo "  # Local test"
echo "  curl http://localhost:$PORT/health"
echo ""
echo "  # Network interface test"
echo "  curl http://$HOST:$PORT/health"
echo ""
echo "  # External IP test"
echo "  curl http://$(hostname -I | awk '{print $1'}):$PORT/health"
echo ""
