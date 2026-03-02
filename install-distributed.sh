#!/bin/bash
# Install Ultrapilot as distributed peer
# Run on each machine (vps5, vps4, vps3)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

THIS_HOST=$(hostname)
PEERS=("vps5" "vps4" "vps3")

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
log "Peers: ${PEERS[*]}"
echo ""

# Check if this is a known peer
if [[ ! " ${PEERS[@]} " =~ " ${THIS_HOST} " ]]; then
    log_error "Unknown hostname: $THIS_HOST"
    log_error "Expected one of: ${PEERS[*]}"
    exit 1
fi

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
for peer in "${PEERS[@]}"; do
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

# Step 6: Start UltraX Gateway
log ""
log "Step 6: Starting UltraX Gateway..."

# Check if already running
if pgrep -f "node.*server.ts" > /dev/null; then
    log "Gateway already running"
else
    # Build and start
    if [ -f "package.json" ]; then
        npm install
        npm run build || true
    fi

    # Start Gateway
    nohup node dist/server.js > .ultra/state/gateway.log 2>&1 &
    GATEWAY_PID=$!
    echo $GATEWAY_PID > .ultra/state/gateway.pid

    log_success "Gateway started (PID: $GATEWAY_PID)"
fi

# Step 7: Start Relay (if available)
log ""
log "Step 7: Starting Relay Web UI..."

if [ -d ~/.claude-web-interfaces/claude-relay ]; then
    cd ~/.claude-web-interfaces/claude-relay

    if pgrep -f "node.*cli.js" > /dev/null; then
        log "Relay already running"
    else
        nohup node bin/cli.js --dangerously-skip-permissions > logs/relay.log 2>&1 &
        RELAY_PID=$!
        echo $RELAY_PID > relay.pid

        log_success "Relay started (PID: $RELAY_PID)"
    fi

    cd $SCRIPT_DIR
else
    log_warning "Relay not found, skipping..."
fi

# Step 8: Verify services
log ""
log "Step 8: Verifying services..."
sleep 2

# Check Gateway
if curl -s http://localhost:3001/health > /dev/null; then
    log_success "✓ Gateway running: http://localhost:3001"
else
    log_warning "⚠ Gateway health check failed"
fi

# Check Relay
if curl -s http://localhost:3000 > /dev/null; then
    log_success "✓ Relay running: http://localhost:3000"
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
log "Peers: ${PEERS[*]}"
echo ""
echo "📍 Access URLs:"
echo "  Relay:    http://$THIS_HOST:3000"
echo "  Gateway:   http://$THIS_HOST:3001"
echo ""
echo "💾 Workspace Access:"
echo "  Local:     ~/projects/"
for peer in "${PEERS[@]}"; do
    if [ "$peer" != "$THIS_HOST" ]; then
        echo "  $peer:      ~/remote/$peer/projects/"
    fi
done
echo ""
echo "🔧 Management:"
echo "  Remount:     sudo systemctl restart ultrapilot-mounts"
echo "  Status:      ./status.sh"
echo "  Stop:        ./stop.sh"
echo ""
echo "🌐 Federation:"
echo "  All peers can access all workspaces"
echo "  Sessions visible across cluster"
echo "  Remote control via Gateway API"
echo ""
