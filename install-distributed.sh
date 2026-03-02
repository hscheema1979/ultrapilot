#!/bin/bash
# Install Ultrapilot as distributed peer
# Run on each machine
#
# REQUIREMENTS:
# - Tailscale installed and running
# - All VPS machines tagged with: tag:vps
#   (In Tailscale admin console: Machines -> Edit -> Assign tag "vps")
# - SSH key authentication set up between peers

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Get Tailscale hostname if available
if command -v tailscale &> /dev/null; then
    THIS_HOST=$(tailscale status --self 2>/dev/null | grep -v 'Status:' | head -1 | awk '{print $2}')
else
    THIS_HOST=$(hostname)
fi

# Discover peers via Tailscale tags (auto-discovery)
log "Discovering peers via Tailscale tags..."
if command -v tailscale &> /dev/null; then
    # Get all active peers with tag:vps
    PEERS=$(tailscale status 2>/dev/null | grep -E 'tag:vps|#tag:vps' | awk '{print $2}' | cut -d':' -f2 | cut -d',' -f1)

    if [ -z "$PEERS" ]; then
        # Fallback to common VPS names if no tags found
        PEERS=$(tailscale status 2>/dev/null | grep -E 'vps[0-9]' | awk '{print $2}')
    fi

    # Convert to array
    PEER_ARRAY=($PEERS)
else
    # Fallback without Tailscale
    PEER_ARRAY=("vps5" "vps4" "vps3" "vps2" "vps1")
fi

log "Found ${#PEER_ARRAY[@]} peers: ${PEER_ARRAY[*]}"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $*"
}

log_success() {
    echo -e "${GREEN}[$(date '+%H:%M:%S')]${NC} ✓ $*"
}

log_warning() {
    echo -e "${YELLOW}[$(date '+%H:%M:%S')]${NC} ⚠ $*"
}

log_error() {
    echo -e "${RED}[$(date '+%H:%M:%S')]${NC} ✗ $*"
}

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║   🌐 DISTRIBUTED ULTRAPILOT INSTALLATION                    ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
log "Installing on: $THIS_HOST"
log "Peers: ${PEER_ARRAY[*]}"
echo ""

# No hostname validation needed - auto-discovery handles it

# Step 1: Install dependencies
log ""
log "Step 1: Installing dependencies..."
sudo apt update
sudo apt install -y nodejs npm git sshfs

log_success "Dependencies installed"

# Step 2: Clone or update Ultrapilot
log ""
log "Step 2: Installing Ultrapilot plugin..."
mkdir -p ~/.claude/plugins
cd ~/.claude/plugins

if [ -d "ultrapilot" ]; then
    log "Ultrapilot already exists, updating..."
    cd ultrapilot
    git pull
else
    log "Cloning Ultrapilot repository..."
    git clone https://github.com/hscheema1979/ultrapilot.git
    cd ultrapilot
fi

log_success "Ultrapilot plugin ready"

# Step 3: Setup SSH key authentication
log ""
log "Step 3: Setting up SSH key authentication..."

if [ ! -f ~/.ssh/id_rsa ]; then
    log "Generating SSH key..."
    ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N "" -q
else
    log "SSH key already exists"
fi

# Copy key to all peers
log "Copying SSH key to peers..."
for peer in "${PEER_ARRAY[@]}"; do
    if [ "$peer" != "$THIS_HOST" ]; then
        log "  Copying to $peer..."

        # Test SSH connection first
        if ssh -o ConnectTimeout=5 -o BatchMode=yes $peer exit 2>/dev/null; then
            log "  ✓ Key already copied to $peer"
        else
            if ssh-copy-id -o ConnectTimeout=5 -i ~/.ssh/id_rsa.pub ubuntu@$peer; then
                log_success "  ✓ Key copied to $peer"
            else
                log_warning "  ⚠ Failed to copy key to $peer (may need manual setup)"
            fi
        fi
    fi
done

log_success "SSH authentication configured"

# Step 4: Mount peer workspaces
log ""
log "Step 4: Mounting peer workspaces..."
./mount-peer-workspaces.sh

# Step 5: Create systemd service for workspace mounts
log ""
log "Step 5: Creating systemd service for auto-mount..."
sudo tee /etc/systemd/system/ultrapilot-mounts.service > /dev/null <<EOF
[Unit]
Description=Mount Peer Workspaces for Distributed Ultrapilot
After=network-online.target tailscale.service
Wants=network-online.target

[Service]
Type=oneshot
User=ubuntu
WorkingDirectory=/home/ubuntu/.claude/plugins/ultrapilot
ExecStart=/home/ubuntu/.claude/plugins/ultrapilot/mount-peer-workspaces.sh
RemainAfterExit=yes
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable ultrapilot-mounts.service
sudo systemctl start ultrapilot-mounts.service

log_success "Systemd service created and enabled"

# Step 6: Setup UltraX Gateway (PM2 managed)
log ""
log "Step 6: Setting up UltraX Gateway..."

# Install dependencies if needed
if [ -f "package.json" ]; then
    log "Installing Gateway dependencies..."
    npm install --silent
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    log "Installing PM2..."
    npm install -g pm2
fi

# Create Gateway PM2 config if it doesn't exist
if [ ! -f "gateway.ecosystem.config.cjs" ]; then
    log "Creating Gateway PM2 configuration..."
    cat > gateway.ecosystem.config.cjs <<'EOF'
module.exports = {
  apps: [{
    name: 'ultrapilot-gateway',
    script: 'src/server.ts',
    cwd: '/home/ubuntu/.claude/plugins/ultrapilot',
    interpreter: 'node',
    interpreter_args: '--require /home/ubuntu/.npm/_npx/tsx/dist/preflight.cjs --import tsx/dist/loader.mjs',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    min_uptime: '10s',
    max_restarts: 10,
    restart_delay: 4000,
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: '/home/ubuntu/.claude/plugins/ultrapilot/.ultra/state/gateway-error.log',
    out_file: '/home/ubuntu/.claude/plugins/ultrapilot/.ultra/state/gateway-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    kill_timeout: 5000,
    autostart: true
  }]
};
EOF
fi

# Start or restart Gateway with PM2
if pm2 describe ultrapilot-gateway >/dev/null 2>&1; then
    log "Gateway already in PM2, restarting..."
    pm2 restart gateway.ecosystem.config.cjs
else
    log "Starting Gateway with PM2..."
    pm2 start gateway.ecosystem.config.cjs
fi

pm2 save --force
log_success "Gateway running with PM2 (port 3001)"

# Step 7: Setup UltraX Relay (PM2 managed)
log ""
log "Step 7: Setting up UltraX Relay Web UI..."

# Check if Relay directory exists
if [ -d "relay" ]; then
    # Ensure Relay config exists
    mkdir -p ~/.claude-ultrapilot-relay

    if [ ! -f ~/.claude-ultrapilot-relay/config.json ]; then
        log "Creating Relay configuration..."
        cat > ~/.claude-ultrapilot-relay/config.json <<'EOF'
{
  "port": 3002,
  "tls": false,
  "pinHash": null,
  "dangerouslySkipPermissions": true,
  "debug": false,
  "projects": []
}
EOF
    fi

    # Start or restart Relay with PM2
    if pm2 describe ultrapilot-relay-ui >/dev/null 2>&1; then
        log "Relay already in PM2, restarting..."
        pm2 restart relay.ecosystem.config.cjs
    else
        log "Starting Relay with PM2..."
        pm2 start relay.ecosystem.config.cjs
    fi

    pm2 save --force
    log_success "Relay running with PM2 (port 3002)"
else
    log_warning "Relay not found in plugin directory, skipping..."
fi

# Step 8: Verify services
log ""
log "Step 8: Verifying services..."
sleep 2

# Check PM2 status
pm2 status

# Check Gateway
if curl -s http://localhost:3001/health > /dev/null; then
    log_success "✓ Gateway running: http://localhost:3001"
else
    log_warning "⚠ Gateway health check failed"
fi

# Check Relay
if curl -s http://localhost:3002 > /dev/null; then
    log_success "✓ Relay running: http://localhost:3002"
else
    log_warning "⚠ Relay not responding"
fi

# Show mounted workspaces
log ""
log "Peer workspace mounts:"
df -h | grep sshfs | while read line; do
    log "  ✓ $line"
done

if ! df -h | grep -q sshfs; then
    log_warning "  No peer workspaces mounted (peers may be offline)"
fi

# Done
echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║   ✅ DISTRIBUTED INSTALLATION COMPLETE                        ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
log "Host: $THIS_HOST"
log "Type: Distributed Peer"
log "Peers: ${PEER_ARRAY[*]}"
echo ""
echo "📍 Access URLs:"
echo "  Relay:      http://$THIS_HOST:3002 (UltraX Relay Web UI)"
echo "  Gateway:    http://$THIS_HOST:3001 (API)"
echo ""
echo "💾 Workspace Access:"
echo "  Local:     ~/"
echo "  Remote:    ~/remote/vpsX/ (for each peer)"
for peer in "${PEER_ARRAY[@]}"; do
    if [ "$peer" != "$THIS_HOST" ]; then
        echo "             ~/remote/$peer/"
    fi
done
echo ""
echo "🔧 PM2 Management:"
echo "  Status:     pm2 status"
echo "  Logs:       pm2 logs"
echo "  Restart:    pm2 restart all"
echo "  Stop:       pm2 stop all"
echo ""
echo "🔧 Mount Management:"
echo "  Remount:    sudo systemctl restart ultrapilot-mounts"
echo "  Status:     df -h | grep sshfs"
echo ""
echo "🌐 Federation:"
echo "  All peers can access all workspaces"
echo "  Sessions visible across cluster"
echo "  Remote control via Gateway API"
echo ""
