# Distributed Relay Web UI Architecture
**Multi-Server Redundancy for Ultrapilot**

## Overview

Run Relay Web UI across multiple VPS instances (vps5, vps4, vps3) with:
- **Load balancing** for high availability
- **Shared workspace storage** for session persistence
- **Automatic failover** if one server goes down
- **No single point of failure**

## Architecture Components

### 1. Load Balancer (HAProxy/Nginx)

**Location**: vps5 (primary server)
**Purpose**: Distribute incoming connections across all Relay instances

```bash
# HAProxy configuration example
frontend relay_frontend
    bind *:80
    default_backend relay_servers

backend relay_servers
    balance roundrobin
    server vps5 vps5:3000 check
    server vps4 vps4:3000 check
    server vps3 vps3:3000 check
    option httpchk GET /
```

**Access points:**
- http://vps5 (load balanced)
- Direct access: http://vps5:3000, http://vps4:3000, http://vps3:3000

### 2. Shared Workspace Storage

**Option A: Tailscale SSHFS** (Recommended)
- Mount workspace directories via SSHFS over Tailscale VPN
- Simple, secure, no central storage needed

**Option B: NFS Server**
- Central NFS server on vps5
- All servers mount same workspace directory

**Option C: Git Sync**
- Workspaces stored in git
- Each server pulls/pushes changes

### 3. Session Affinity (Sticky Sessions)

**Problem**: Relay uses websockets, need session persistence

**Solution**: HAProxy with cookie-based stickiness

```bash
backend relay_servers
    balance roundrobin
    cookie SRV_ID insert
    server vps5 vps5:3000 cookie vps5 check
    server vps4 vps4:3000 cookie vps4 check
    server vps3 vps3:3000 cookie vps3 check
```

### 4. Health Monitoring

**HAProxy health checks:**
- Check /health endpoint every 2s
- Mark server down if 3 failures
- Auto-mark server up when recovered

**UltraX Gateway monitoring:**
- Autoloop checks all services every 60s
- Alerts if any Relay instance down

## Implementation Plans

### Phase 1: Basic Setup (vps5 + vps4)

**Setup:**
1. Install Relay on vps4
2. Setup HAProxy on vps5
3. Configure workspace sharing via SSHFS
4. Test load balancing

**Benefits:**
- 2x redundancy
- Load distribution
- Basic failover

### Phase 2: Full Cluster (vps5 + vps4 + vps3)

**Setup:**
1. Add vps3 to cluster
2. Setup NFS or advanced workspace sync
3. Configure automatic failover
4. Add health monitoring dashboard

**Benefits:**
- 3x redundancy
- Zero downtime (can lose 2 servers)
- True high availability

### Phase 3: Geographic Distribution

**Setup:**
1. Deploy servers in different regions
2. Use GeoDNS for routing
3. Multi-master replication
4. Global load balancing

**Benefits:**
- Low latency worldwide
- Disaster recovery
- 99.99% uptime

## Server Roles

### vps5 (Primary)
- **Load Balancer**: HAProxy on port 80/443
- **Relay Instance**: Port 3000
- **UltraX Gateway**: Port 3001 (primary)
- **Workspace Storage**: Master copy (if using NFS)
- **Monitoring**: Autoloop + health checks

### vps4 (Secondary)
- **Relay Instance**: Port 3000
- **UltraX Gateway**: Port 3001 (standby)
- **Workspace Storage**: Mounted via SSHFS/NFS
- **Backup**: Takes over if vps5 fails

### vps3 (Tertiary)
- **Relay Instance**: Port 3000
- **UltraX Gateway**: Port 3001 (standby)
- **Workspace Storage**: Mounted via SSHFS/NFS
- **Backup**: Takes over if vps5 and vps4 fail

## Workspace Sharing Strategies

### Strategy 1: SSHFS over Tailscale (Simple)

**On vps4 and vps3:**
```bash
# Mount vps5's workspace directory
sshfs ubuntu@vps5:/home/ubuntu/.claude-web-interfaces \
       /home/ubuntu/.claude-web-interfaces \
       -o allow_other,default_permissions

# Mount Ultrapilot plugin
sshfs ubuntu@vps5:/home/ubuntu/.claude/plugins/ultrapilot \
       /home/ubuntu/.claude/plugins/ultrapilot \
       -o allow_other,default_permissions
```

**Pros:**
- ✅ Simple setup
- ✅ Uses existing Tailscale VPN
- ✅ Secure (SSH encryption)
- ✅ No central storage needed

**Cons:**
- ⚠️ Depends on vps5 being up
- ⚠️ Slower than local storage

### Strategy 2: NFS Server (Robust)

**On vps5 (NFS server):**
```bash
# Install NFS server
sudo apt install nfs-kernel-server

# Export workspace directory
echo "/home/ubuntu/.claude-web-interfaces *(rw,sync,no_subtree_check)" | sudo tee -a /etc/exports

sudo exportfs -ra
```

**On vps4 and vps3 (NFS clients):**
```bash
# Mount NFS share
sudo mount vps5:/home/ubuntu/.claude-web-interfaces \
              /home/ubuntu/.claude-web-interfaces
```

**Pros:**
- ✅ Fast performance
- ✅ Standard Unix file system
- ✅ Good for multiple servers

**Cons:**
- ⚠️ More complex setup
- ⚠️ NFS server is single point of failure (use DRBD for HA)

### Strategy 3: Git Sync (Distributed)

**On all servers:**
```bash
# Initialize workspace repo
cd ~/.claude-web-interfaces
git init
git add .
git commit -m "Initial workspace"

# Set up remotes for each server
git remote add vps5 ubuntu@vps5:.claude-web-interfaces
git remote add vps4 ubuntu@vps4:.claude-web-interfaces
git remote add vps3 ubuntu@vps3:.claude-web-interfaces
```

**Sync hook** (run on workspace changes):
```bash
#!/bin/bash
git pull origin main
git add .
git commit -m "Workspace update $(date)"
git push origin main
```

**Pros:**
- ✅ Fully distributed (no central server)
- ✅ Version history
- ✅ Works offline
- ✅ True multi-master

**Cons:**
- ⚠️ Merge conflicts possible
- ⚠️ Requires sync discipline
- ⚠️ Not real-time

## Failover Scenarios

### Scenario 1: vps5 Fails

**What happens:**
1. HAProxy on vps5 goes down
2. **Workaround**: Use direct URLs (http://vps4:3000, http://vps3:3000)
3. Or: Run HAProxy on vps4 as backup

**Better solution**: HAProxy on all servers with VRRP (Virtual Router Redundancy Protocol)

### Scenario 2: vps4 Fails

**What happens:**
1. HAProxy detects vps4:3000 is down
2. Removes vps4 from rotation
3. Traffic goes to vps5 and vps3 only
4. **Zero downtime** for users

### Scenario 3: Network Partition

**What happens:**
1. Some servers can't reach each other
2. **Solution**: Use quorum-based decision making
3. Or: Designate vps5 as primary always

## Implementation Steps

### Step 1: Prepare vps4 and vps3

```bash
# On vps4 and vps3
sudo apt update
sudo apt install -y nodejs npm git

# Clone Ultrapilot plugin
cd ~/.claude/plugins/
git clone https://github.com/hscheema1979/ultrapilot.git
cd ultrapilot
node scripts/install.mjs

# Install Relay (if not using shared storage)
git clone https://github.com/cline/cline-relay ~/.claude-web-interfaces/claude-relay
cd ~/.claude-web-interfaces/claude-relay
npm install
```

### Step 2: Setup HAProxy on vps5

```bash
sudo apt install haproxy

# Configure HAProxy
sudo nano /etc/haproxy/haproxy.cfg
# Add configuration from above

sudo systemctl restart haproxy
```

### Step 3: Setup Workspace Sharing

**Choose SSHFS (simple):**
```bash
# On vps4 and vps3
sudo apt install sshfs

sudo sshfs ubuntu@vps5:/home/ubuntu/.claude-web-interfaces \
              /home/ubuntu/.claude-web-interfaces \
              -o allow_other,default_permissions
```

### Step 4: Start Relay Instances

```bash
# On vps5, vps4, vps3
cd ~/.claude/plugins/ultrapilot
./start.sh
```

### Step 5: Test Load Balancing

```bash
# Test from your local machine
curl http://vps5  # Should get response from one of the servers
curl http://vps5  # Might get different server (round robin)
```

## Monitoring

### Health Check Script

```bash
#!/bin/bash
# check-relay-cluster.sh

servers=("vps5" "vps4" "vps3")
down_servers=()

for server in "${servers[@]}"; do
    if ! curl -s http://${server}:3000 > /dev/null; then
        down_servers+=("$server")
    fi
done

if [ ${#down_servers[@]} -gt 0 ]; then
    echo "⚠️  Down servers: ${down_servers[*]}"
    # Send alert to Relay, email, etc.
else
    echo "✅ All servers up"
fi
```

### HAProxy Stats

```bash
# Enable HAProxy stats page
# In haproxy.cfg:
listen stats
    bind *:8404
    stats enable
    stats uri /
    stats refresh 10s

# Access: http://vps5:8404
```

## Recommendations

### Start Simple (Phase 1)

1. **Add vps4 only** (2-server cluster)
2. **Use SSHFS** for workspace sharing
3. **Direct access** (no HAProxy yet):
   - http://vps5:3000 (primary)
   - http://vps4:3000 (backup)
4. **Manual failover** (switch URL if one goes down)

### Upgrade When Needed (Phase 2)

1. **Add HAProxy** for automatic failover
2. **Add vps3** for 3-server cluster
3. **Setup NFS** for better performance
4. **Add monitoring** and alerts

## Next Steps

**What I can help you set up:**

1. ✅ **vps4 setup** - Clone and configure
2. ✅ **SSHFS mounting** - Share workspaces
3. ✅ **HAProxy config** - Load balancing
4. ✅ **Health monitoring** - Autoloop integration
5. ✅ **Testing** - Verify failover works

**Where should we start?**
- A) Setup vps4 as backup (simplest)
- B) Full 3-server cluster with HAProxy
- C) Just plan it out for now, implement later
