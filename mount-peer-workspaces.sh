#!/bin/bash
# Mount all peer home directories for distributed Ultrapilot
# Run this on each machine (vps5, vps4, vps3)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Get Tailscale hostname if available
if command -v tailscale &> /dev/null; then
    THIS_HOST=$(tailscale status --self 2>/dev/null | grep -v 'Status:' | head -1 | awk '{print $2}' | cut -d'.' -f1)
else
    THIS_HOST=$(hostname)
fi

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
echo "║   🌐 MOUNTING PEER DIRECTORIES                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
log "This host: $THIS_HOST"
log "Peers: ${PEERS[*]}"
echo ""

# Create remote mount directory
mkdir -p ~/remote

# Mount each peer's home directory
for peer in "${PEERS[@]}"; do
    # Skip if peer is this machine
    if [ "$peer" = "$THIS_HOST" ]; then
        log "$peer is this machine, skipping..."
        continue
    fi

    log "Mounting $peer home directory..."

    # Check if already mounted
    if mountpoint -q ~/remote/$peer 2>/dev/null; then
        log "$peer already mounted, skipping..."
        continue
    fi

    # Create mount point
    mkdir -p ~/remote/$peer

    # Test SSH connection
    if ! ssh -o ConnectTimeout=5 -o BatchMode=yes $peer exit 2>/dev/null; then
        log "⚠️  Cannot reach $peer (SSH auth failed), skipping..."
        continue
    fi

    # Mount via SSHFS - mount entire home directory
    sshfs -o allow_other,default_permissions,reconnect,ServerAliveInterval=15 \
          ubuntu@$peer:/home/ubuntu \
          ~/remote/$peer

    if [ $? -eq 0 ]; then
        log_success "Mounted $peer:~/ → ~/remote/$peer"
    else
        log "⚠️  Failed to mount $peer"
    fi
done

echo ""
log "Current mounts:"
df -h | grep sshfs | grep "$USER/remote/" || echo "  No peer directories mounted"
echo ""

log "Directory access:"
echo "  Local:    ~/"
for peer in "${PEERS[@]}"; do
    if [ "$peer" != "$THIS_HOST" ]; then
        echo "  $peer:     ~/remote/$peer/"
    fi
done
echo ""

# Verify mounts
log "Verifying mounts..."
for peer in "${PEERS[@]}"; do
    if [ "$peer" != "$THIS_HOST" ] && [ -d ~/remote/$peer ]; then
        if mountpoint -q ~/remote/$peer 2>/dev/null; then
            # Count accessible subdirectories
            count=$(ls ~/remote/$peer/ 2>/dev/null | wc -l)
            log_success "$peer: mounted and accessible ($count items)"
        else
            log "⚠️  $peer: directory exists but not mounted"
        fi
    fi
done

echo ""
log_success "Peer directory mounting complete"
