#!/bin/bash
# Setup UltraX Server as systemd service on VPS5

set -e

SERVICE_NAME="ultrax-server"
SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"
ULTRAX_DIR="/home/ubuntu/.claude/plugins/ultrapilot"
USER="ubuntu"

echo "🚀 Setting up UltraX Server service..."

# Create systemd service file
sudo tee "$SERVICE_FILE" > /dev/null <<EOF
[Unit]
Description=UltraX Server - Ultrapilot Gateway for Web UI and Google Chat
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$ULTRAX_DIR
Environment=NODE_ENV=production
Environment=PORT=3001
Environment=RELAY_URL=http://localhost:3000
ExecStart=/usr/bin/npx tsx $ULTRAX_DIR/src/server.ts
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=ultrax-server

[Install]
WantedBy=multi-user.target
EOF

echo "✅ Service file created: $SERVICE_FILE"

# Reload systemd
sudo systemctl daemon-reload

# Enable service to start on boot
sudo systemctl enable "$SERVICE_NAME"

echo "✅ Service enabled to start on boot"

# Start the service
sudo systemctl start "$SERVICE_NAME"

echo "✅ Service started"

# Wait a moment for service to start
sleep 3

# Check status
sudo systemctl status "$SERVICE_NAME" --no-pager

echo ""
echo "✨ UltraX Server is now running!"
echo ""
echo "📡 Services:"
echo "  - Relay (Web UI):     http://localhost:3000"
echo "  - UltraX Gateway:     http://localhost:3001"
echo "  - Health check:       http://localhost:3001/health"
echo "  - API endpoints:      http://localhost:3001/api/*"
echo "  - Google Chat webhook: http://localhost:3001/webhook/google-chat"
echo ""
echo "🔧 Management commands:"
echo "  - Check status:   sudo systemctl status $SERVICE_NAME"
echo "  - Restart:        sudo systemctl restart $SERVICE_NAME"
echo "  - Stop:           sudo systemctl stop $SERVICE_NAME"
echo "  - View logs:      sudo journalctl -u $SERVICE_NAME -f"
echo ""
echo "📊 Monitor:"
echo "  - Real-time logs: sudo journalctl -u $SERVICE_NAME -f"
echo "  - API health:     curl http://localhost:3001/health"
echo ""
