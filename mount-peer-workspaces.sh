#!/bin/bash
# Mount all peer workspaces for distributed Ultrapilot
# Run this on each machine (vps5, vps4, vps3)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

THIS_HOST=$(hostname)
PEERS=("vps5" "vps4" "vps3")

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $*"
}

log_success() {
    echo -e "${GREEN}[$(date '+%H:%M:%S')]${NC} ✓ $*"
}

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║   🌐 MOUNTING PEER WORKSPACES                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
log "This host: $THIS_HOST"
log "Peers: ${PEERS[*]}"
echo ""

# Create remote mount directory
mkdir -p ~/remote

# Mount each peer's workspaces
for peer in "${PEERS[@]}"; do
    if [ "$peer" != "$THIS_HOST" ]; then
        log "Mounting $peer workspaces..."

        # Check if already mounted
        if mountpoint -q ~/remote/$peer 2>/dev/null; then
            log "$peer already mounted, skipping..."
            continue
        fi

        # Create mount point
        mkdir -p ~/remote/$peer

        # Test SSH connection
        if ! ssh -o ConnectTimeout=5 $peer exit 2>/dev/null; then
            log "⚠️  Cannot reach $peer, skipping..."
            continue
        fi

        # Mount via SSHFS
        sshfs -o allow_other,default_permissions,reconnect,ServerAliveInterval=15 \
              ubuntu@$peer:~/projects \
              ~/remote/$peer

        if [ $? -eq 0 ]; then
            log_success "Mounted $peer:/projects → ~/remote/$peer"
        else
            log "⚠️  Failed to mount $peer"
        fi
    fi
done

echo ""
log "Current mounts:"
df -h | grep sshfs || echo "  No peer workspaces mounted"
echo ""

log "Workspace access:"
echo "  Local:    ~/projects/"
echo "  vps5:     ~/remote/vps5/projects/"
echo "  vps4:     ~/remote/vps4/projects/"
echo "  vps3:     ~/remote/vps3/projects/"
echo ""

# Create test to verify mounts
log "Verifying mounts..."
for peer in "${PEERS[@]}"; do
    if [ "$peer" != "$THIS_HOST" ]; then
        if [ -d ~/remote/$peer/projects ]; then
            count=$(ls ~/remote/$peer/projects/ 2>/dev/null | wc -l)
            log_success "$peer: $count workspaces accessible"
        fi
    fi
done

echo ""
log_success "Peer workspace mounting complete"
