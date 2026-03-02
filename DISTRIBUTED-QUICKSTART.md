# Distributed Ultrapilot - Quick Start

## What's Working

✅ **Peer-to-peer workspace access** - Work on ANY machine's workspaces from ANY machine

## Setup (One-Time Per Machine)

```bash
# On each machine (vps5, vps4, vps3)
cd ~/.claude/plugins/ultrapilot

# Mount all peer workspaces
./mount-peer-workspaces.sh
```

## How It Works

**From vps5, you can now access EVERYTHING:**
```bash
# Access local home directory
cd ~/projects
cd ~/.claude
cd ~/oauth_tokens

# Access vps4's entire home directory
cd ~/remote/vps4/projects
cd ~/remote/vps4/.claude
cd ~/remote/vps4/oauth_tokens

# Access vps3's entire home directory
cd ~/remote/vps3/whatever-you-need

# Work on remote workspaces
cd ~/remote/vps4/projects/finance-trading
/ultrapilot add new feature

# Edit remote files
nano ~/remote/vps3/.bashrc
```

**File paths - FULL HOME DIRECTORIES:**
- **Local (vps5)**: `~/` (everything)
- **vps4**: `~/remote/vps4/` (entire home directory)
- **vps3**: `~/remote/vps3/` (entire home directory)

Each machine can access and modify ALL other machines' files as if they were local.

## Mount Management

```bash
# Mount all peers
./mount-peer-workspaces.sh

# Check what's mounted
df -h | grep sshfs

# Unmount a specific peer
fusermount -u ~/remote/vps4

# Remount (if network dropped)
./mount-peer-workspaces.sh
```

## Auto-Mount on Boot

Setup systemd service for automatic mounting:

```bash
# Enable service
sudo systemctl enable ultrapilot-mounts.service

# Start now
sudo systemctl start ultrapilot-mounts.service

# Check status
sudo systemctl status ultrapilot-mounts.service
```

## Current Status

**vps5** (this machine):
- ✅ vps4 mounted: `~/remote/vps4/` (24 items accessible)
- ✅ vps3 mounted: `~/remote/vps3/` (1 item accessible)

**vps4**:
- ✅ Can access vps5 workspaces when mounted
- ✅ Can access vps3 workspaces when mounted

**vps3**:
- ✅ Can access vps5 workspaces when mounted
- ✅ Can access vps4 workspaces when mounted

## Next Steps

1. ✅ Workspace mounting WORKS
2. ⏳ Display in Relay UI with hostname badges
3. ⏳ Session federation (see all sessions from all machines)
4. ⏳ Remote session control

## Simple. Powerful. Distributed.

**No master, no slave - just peers helping peers!**
