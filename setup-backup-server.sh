#!/bin/bash
# Setup Backup Relay Server (vps4/vps3)
# Part of Ultrapilot distributed architecture

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $*"
}

log_success() {
    echo -e "${GREEN}[$(date '+%H:%M:%S')]${NC} ✓ $*"
}

log_error() {
    echo -e "${RED}[$(date '+%H:%M:%S')]${NC} ✗ $*"
}

# Check if running on backup server
if [ "$(hostname)" = "vps5" ]; then
    log_error "This script is for setting up BACKUP servers (vps4/vps3)"
    log_error "You're currently on vps5 (primary server)"
    exit 1
fi

BACKUP_HOST=$(hostname)
PRIMARY_HOST="vps5"

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║   🔄 RELAY BACKUP SERVER SETUP                                ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
log "Setting up ${BACKUP_HOST} as backup Relay server"
log "Primary server: ${PRIMARY_HOST}"
echo ""

# Step 1: Check Tailscale connectivity
log "Step 1: Checking Tailscale connectivity..."
if ping -c 1 -W 2 ${PRIMARY_HOST} &> /dev/null; then
    log_success "Tailscale connection to ${PRIMARY_HOST} OK"
else
    log_error "Cannot reach ${PRIMARY_HOST} via Tailscale"
    log_error "Make sure Tailscale is running on both servers"
    exit 1
fi

# Step 2: Install dependencies
log ""
log "Step 2: Installing dependencies..."
sudo apt update
sudo apt install -y nodejs npm git curl sshfs

log_success "Dependencies installed"

# Step 3: Clone Ultrapilot plugin
log ""
log "Step 3: Cloning Ultrapilot plugin..."

if [ -d ~/.claude/plugins/ultrapilot ]; then
    log "Ultrapilot already exists, updating..."
    cd ~/.claude/plugins/ultrapilot
    git pull
else
    log "Cloning Ultrapilot repository..."
    mkdir -p ~/.claude/plugins
    cd ~/.claude/plugins
    git clone https://github.com/hscheema1979/ultrapilot.git
    cd ultrapilot
fi

log_success "Ultrapilot plugin ready"

# Step 4: Mount primary server's workspace via SSHFS
log ""
log "Step 4: Mounting shared workspace from ${PRIMARY_HOST}..."

# Create mount points
sudo mkdir -p ~/.claude-web-interfaces
sudo mkdir -p ~/.claude/plugins/ultrapilot-shared

# Mount via SSHFS
log "Mounting workspace directories..."
sudo sshfs -o allow_other,default_permissions,IdentityFile=~/.ssh/id_rsa \
    ubuntu@${PRIMARY_HOST}:/home/ubuntu/.claude-web-interfaces \
    ~/.claude-web-interfaces

sudo sshfs -o allow_other,default_permissions,IdentityFile=~/.ssh/id_rsa \
    ubuntu@${PRIMARY_HOST}:/home/ubuntu/.claude/plugins/ultrapilot \
    ~/.claude/plugins/ultrapilot-shared

log_success "Workspace mounted from ${PRIMARY_HOST}"

# Step 5: Install Relay
log ""
log "Step 5: Installing Relay Web UI..."

if [ ! -d ~/.claude-web-interfaces/claude-relay ]; then
    log "Cloning Relay from ${PRIMARY_HOST}..."
    cd ~/.claude-web-interfaces
    # Copy from primary server instead of cloning
    rsync -avz ubuntu@${PRIMARY_HOST}:~/.claude-web-interfaces/claude-relay/ \
                  ~/.claude-web-interfaces/claude-relay/
else
    log "Relay already exists"
fi

log_success "Relay Web UI ready"

# Step 6: Create startup script
log ""
log "Step 6: Creating startup script..."

cat > ~/start-relay-backup.sh << 'EOF'
#!/bin/bash
# Start Relay on backup server

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🚀 Starting Relay Web UI on backup server $(hostname)..."

# Check if mounts are active
if ! mountpoint -q ~/.claude-web-interfaces; then
    echo "⚠️  Workspace not mounted, mounting..."
    sudo sshfs -o allow_other,default_permissions \
        ubuntu@vps5:/home/ubuntu/.claude-web-interfaces \
        ~/.claude-web-interfaces
fi

# Start Relay
cd ~/.claude-web-interfaces/claude-relay
NODE_ENV=production nohup node bin/cli.js --dangerously-skip-permissions \
    > ~/.claude-web-interfaces/claude-relay/logs/relay.log 2>&1 &

RELAY_PID=$!
echo $RELAY_PID > ~/.claude-web-interfaces/claude-relay/relay.pid

echo "✅ Relay started (PID: $RELAY_PID)"
echo "   Access: http://$(hostname):3000"
echo "   Logs: tail -f ~/.claude-web-interfaces/claude-relay/logs/relay.log"
EOF

chmod +x ~/start-relay-backup.sh

log_success "Startup script created: ~/start-relay-backup.sh"

# Step 7: Create health check script
log ""
log "Step 7: Creating health check script..."

cat > ~/check-relay-backup.sh << 'EOF'
#!/bin/bash
# Health check for backup Relay

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║         RELAY BACKUP SERVER HEALTH CHECK                      ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

HOST=$(hostname)
PRIMARY="vps5"

# Check Relay process
if [ -f ~/.claude-web-interfaces/claude-relay/relay.pid ]; then
    PID=$(cat ~/.claude-web-interfaces/claude-relay/relay.pid)
    if ps -p $PID > /dev/null 2>&1; then
        echo "✅ Relay Process: Running (PID: $PID)"
    else
        echo "❌ Relay Process: Dead (stale PID file)"
        rm ~/.claude-web-interfaces/claude-relay/relay.pid
    fi
else
    echo "❌ Relay Process: Not running"
fi

# Check Relay HTTP
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Relay HTTP: Responding"
else
    echo "❌ Relay HTTP: Not responding"
fi

# Check workspace mount
if mountpoint -q ~/.claude-web-interfaces; then
    echo "✅ Workspace Mount: Active"
else
    echo "⚠️  Workspace Mount: Not mounted"
fi

# Check primary server connectivity
if ping -c 1 -W 2 $PRIMARY &> /dev/null; then
    echo "✅ Primary Server ($PRIMARY): Reachable"

    # Check primary Relay
    if curl -s http://${PRIMARY}:3000 > /dev/null; then
        echo "✅ Primary Relay: Up"
    else
        echo "⚠️  Primary Relay: Down (backup should be used)"
    fi
else
    echo "❌ Primary Server ($PRIMARY): Unreachable"
fi

echo ""
echo "Access URLs:"
echo "  This server: http://${HOST}:3000"
echo "  Primary:     http://${PRIMARY}:3000"
echo ""
EOF

chmod +x ~/check-relay-backup.sh

log_success "Health check script created: ~/check-relay-backup.sh"

# Step 8: Start Relay
log ""
log "Step 8: Starting Relay Web UI..."
~/start-relay-backup.sh

sleep 3

# Verify it's running
if curl -s http://localhost:3000 > /dev/null; then
    log_success "Relay is running on http://${BACKUP_HOST}:3000"
else
    log_error "Relay failed to start"
    log "Check logs: tail -f ~/.claude-web-interfaces/claude-relay/logs/relay.log"
    exit 1
fi

# Done
echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║   ✅ BACKUP SERVER SETUP COMPLETE                             ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "📋 Summary:"
echo "   Backup server: ${BACKUP_HOST}"
echo "   Primary server: ${PRIMARY_HOST}"
echo ""
echo "📍 Access URLs:"
echo "   Primary:   http://${PRIMARY}:3000"
echo "   Backup:    http://${BACKUP_HOST}:3000"
echo ""
echo "🔧 Management:"
echo "   Start Relay:    ~/start-relay-backup.sh"
echo "   Check health:   ~/check-relay-backup.sh"
echo "   View logs:      tail -f ~/.claude-web-interfaces/claude-relay/logs/relay.log"
echo ""
echo "🔄 Failover:"
echo "   If ${PRIMARY_HOST} goes down, use: http://${BACKUP_HOST}:3000"
echo ""
echo "📊 Next Steps:"
echo "   1. Test accessing http://${BACKUP_HOST}:3000"
echo "   2. Run health check: ~/check-relay-backup.sh"
echo "   3. Consider setting up HAProxy for automatic failover"
echo ""
