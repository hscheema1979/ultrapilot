# True Distributed Ultrapilot Architecture
**Peer-to-Peer Multi-Master Design**

## Vision

**Each machine is a fully independent Ultrapilot instance** that can:
- ✅ Access ALL workspaces across ALL machines (as if local)
- ✅ Monitor and control sessions on ANY machine
- � Operate independently (no single point of failure)
- ✅ Provide automatic backup through redundancy

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    DISTRIBUTED ULTRAPILOT                       │
└─────────────────────────────────────────────────────────────────┘

    vps5                        vps4                        vps3
    (Peer)                      (Peer)                      (Peer)
       │                           │                           │
       ├─ Ultrapilot Plugin        ├─ Ultrapilot Plugin        ├─ Ultrapilot Plugin
       ├─ UltraX Gateway :3001     ├─ UltraX Gateway :3001     ├─ UltraX Gateway :3001
       ├─ Relay Web UI :3000       ├─ Relay Web UI :3000       ├─ Relay Web UI :3000
       │                           │                           │
       ├─ Local Workspaces         ├─ Local Workspaces         ├─ Local Workspaces
       │  └─ ~/projects/*          │  └─ ~/projects/*          │  └─ ~/projects/*
       │                           │                           │
       ├─ Remote Mounts            ├─ Remote Mounts            ├─ Remote Mounts
       │  ├─ vps4:/projects →     │  ├─ vps5:/projects →     │  ├─ vps5:/projects →
       │  │   ~/remote/vps4/       │  │   ~/remote/vps5/       │  │   ~/remote/vps5/
       │  └─ vps3:/projects →     │  └─ vps3:/projects →     │  └─ vps4:/projects →
       │      ~/remote/vps3/       │      ~/remote/vps3/       │      ~/remote/vps4/
       │                           │                           │
       ├─ Session Federation       ├─ Session Federation       ├─ Session Federation
       │  └─ Read all .jsonl       │  └─ Read all .jsonl       │  └─ Read all .jsonl
       │                           │                           │
       └─ Remote Control           └─ Remote Control           └─ Remote Control
          ├─ SSH to vps4/vps3         ├─ SSH to vps5/vps3         ├─ SSH to vps5/vps4
          └─ Control sessions         └─ Control sessions         └─ Control sessions

Access Pattern:
- http://vps5:3001 → Can work on vps5, vps4, or vps3 workspaces
- http://vps4:3001 → Can work on vps5, vps4, or vps3 workspaces
- http://vps3:3001 → Can work on vps5, vps4, or vps3 workspaces

Redundancy:
- Each machine backs up the others
- Lose any 2 machines, still operational
- True peer-to-peer (no master)
```

## Key Concepts

### 1. Workspace Federation

**Each machine mounts all other machines' workspaces:**

```bash
# On vps5
~/projects/                    # Local workspaces
~/remote/vps4/projects/        # vps4 workspaces (mounted via SSHFS)
~/remote/vps3/projects/        # vps3 workspaces (mounted via SSHFS)

# On vps4
~/projects/                    # Local workspaces
~/remote/vps5/projects/        # vps5 workspaces (mounted via SSHFS)
~/remote/vps3/projects/        # vps3 workspaces (mounted via SSHFS)

# On vps3
~/projects/                    # Local workspaces
~/remote/vps5/projects/        # vps5 workspaces (mounted via SSHFS)
~/remote/vps4/projects/        # vps4 workspaces (mounted via SSHFS)
```

**Result**: Each Gateway sees ALL workspaces as local paths

### 2. Session Federation

**Each machine can read and monitor ALL sessions:**

```javascript
// Session discovery across cluster
async function discoverAllSessions() {
  const sessions = [];

  // Local sessions
  sessions.push(...await readLocalSessions('~/.claude/sessions/*.jsonl'));

  // Remote sessions (via SSH)
  sessions.push(...await readRemoteSessions('vps4', '~/.claude/sessions/*.jsonl'));
  sessions.push(...await readRemoteSessions('vps3', '~/.claude/sessions/*.jsonl'));

  return sessions;
}

// Session from any machine appears in UI
{
  sessionId: "session-abc",
  hostname: "vps5",
  status: "active",
  workspace: "~/projects/myapp",
  canControl: true  // Can SSH to control
}
```

### 3. Remote Session Control

**Control sessions on any machine via SSH + tmux:**

```bash
# From vps5, control session running on vps4
ssh vps4 "tmux send-keys -t session-abc C-c"
ssh vps4 "tmux send-keys -t session-abc '/status' Enter"

# Or attach to remote session
ssh vps4 "tmux attach-session -t session-abc"
```

### 4. Redundancy Through Distribution

**Each machine is independent but provides backup:**

- Lose vps5? vps4 and vps3 still have all workspaces mounted
- Lose vps4? vps5 and vps3 still operational
- Lose vps3? vps5 and vps4 still operational

**No master, no single point of failure**

## Implementation

### Component 1: Workspace Mounting

**Script**: `mount-peer-workspaces.sh`

```bash
#!/bin/bash
# Mount all peer workspaces

THIS_HOST=$(hostname)
PEERS=("vps5" "vps4" "vps3")

# Create mount points
mkdir -p ~/remote

for peer in "${PEERS[@]}"; do
    if [ "$peer" != "$THIS_HOST" ]; then
        echo "Mounting $peer workspaces..."

        # Create mount point
        mkdir -p ~/remote/$peer

        # Mount via SSHFS
        sshfs -o allow_other,default_permissions,reconnect \
              ubuntu@$peer:~/projects \
              ~/remote/$peer

        echo "✅ Mounted $peer:/projects → ~/remote/$peer"
    fi
done

echo "All peer workspaces mounted"
df -h | grep sshfs
```

**Usage**: Run on boot via systemd

### Component 2: Session Federation Service

**File**: `src/session-federation.ts`

```typescript
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { glob } from 'glob';

interface RemoteSession {
  sessionId: string;
  hostname: string;
  status: 'active' | 'idle' | 'terminated';
  workspace: string;
  canControl: boolean;
  pid?: number;
}

export class SessionFederation {
  private peers: string[] = ['vps5', 'vps4', 'vps3'];
  private thisHost: string;

  constructor() {
    this.thisHost = process.env.HOSTNAME || 'unknown';
  }

  async getAllSessions(): Promise<RemoteSession[]> {
    const sessions: RemoteSession[] = [];

    // Local sessions
    sessions.push(...await this.getLocalSessions());

    // Remote sessions
    for (const peer of this.peers) {
      if (peer !== this.thisHost) {
        try {
          sessions.push(...await this.getRemoteSessions(peer));
        } catch (error) {
          console.warn(`Failed to get sessions from ${peer}:`, error);
        }
      }
    }

    return sessions;
  }

  private async getLocalSessions(): Promise<RemoteSession[]> {
    const sessionFiles = glob.sync('~/.claude/sessions/*.jsonl');
    const sessions: RemoteSession[] = [];

    for (const file of sessionFiles) {
      const content = readFileSync(file, 'utf-8');
      const lines = content.split('\n').filter(l => l.trim());

      for (const line of lines) {
        const session = JSON.parse(line);
        sessions.push({
          sessionId: session.sessionId,
          hostname: this.thisHost,
          status: session.status,
          workspace: session.workspace,
          canControl: true, // Local = full control
          pid: session.pid
        });
      }
    }

    return sessions;
  }

  private async getRemoteSessions(peer: string): Promise<RemoteSession[]> {
    try {
      // Execute command on remote host
      const result = execSync(
        `ssh ${peer} 'cat ~/.claude/sessions/*.jsonl 2>/dev/null | grep -v "^$" || true'`,
        { encoding: 'utf-8', timeout: 5000 }
      );

      const sessions: RemoteSession[] = [];
      const lines = result.split('\n').filter(l => l.trim());

      for (const line of lines) {
        try {
          const session = JSON.parse(line);
          sessions.push({
            sessionId: session.sessionId,
            hostname: peer,
            status: session.status,
            workspace: session.workspace,
            canControl: true, // Can SSH to control
            pid: session.pid
          });
        } catch (e) {
          // Skip malformed lines
        }
      }

      return sessions;
    } catch (error) {
      return []; // Peer unreachable
    }
  }

  async controlRemoteSession(peer: string, sessionId: string, command: string): Promise<boolean> {
    try {
      // Send command to remote session via tmux
      execSync(
        `ssh ${peer} "tmux send-keys -t ${sessionId} '${command}' Enter"`,
        { timeout: 5000 }
      );
      return true;
    } catch (error) {
      console.error(`Failed to control session ${sessionId} on ${peer}:`, error);
      return false;
    }
  }

  async attachToRemoteSession(peer: string, sessionId: string): Promise<boolean> {
    try {
      // Attach to remote tmux session
      execSync(
        `ssh ${peer} "tmux attach-session -t ${sessionId}"`,
        { stdio: 'inherit' }
      );
      return true;
    } catch (error) {
      console.error(`Failed to attach to session ${sessionId} on ${peer}:`, error);
      return false;
    }
  }
}
```

### Component 3: Gateway Enhancement

**Add to UltraX Gateway** (`src/server.ts`):

```typescript
import { SessionFederation } from './session-federation';

const federation = new SessionFederation();

// GET /api/sessions - All sessions from all machines
app.get('/api/sessions', async (req, res) => {
  const sessions = await federation.getAllSessions();
  res.json(sessions);
});

// POST /api/sessions/:peer/:sessionId/control
app.post('/api/sessions/:peer/:sessionId/control', async (req, res) => {
  const { peer, sessionId } = req.params;
  const { command } = req.body;

  const success = await federation.controlRemoteSession(peer, sessionId, command);
  res.json({ success });
});

// GET /api/workspaces - All workspaces (local + remote)
app.get('/api/workspaces', async (req, res) => {
  const workspaces = {
    local: await glob('~/projects/*'),
    vps5: await glob('~/remote/vps5/projects/*'),
    vps4: await glob('~/remote/vps4/projects/*'),
    vps3: await glob('~/remote/vps3/projects/*')
  };
  res.json(workspaces);
});
```

### Component 4: Unified Plugin Installer

**Script**: `install-distributed.sh`

```bash
#!/bin/bash
# Install Ultrapilot on all machines as peer

set -e

THIS_HOST=$(hostname)
PEERS=("vps5" "vps4" "vps3")

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║   🌐 DISTRIBUTED ULTRAPILOT INSTALLATION                    ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "Installing on: $THIS_HOST"
echo "Peers: ${PEERS[*]}"
echo ""

# 1. Install Ultrapilot Plugin
echo "Step 1: Installing Ultrapilot plugin..."
mkdir -p ~/.claude/plugins
cd ~/.claude/plugins

if [ ! -d "ultrapilot" ]; then
    git clone https://github.com/hscheema1979/ultrapilot.git
    cd ultrapilot
    node scripts/install.mjs
else
    echo "Ultrapilot already installed"
fi

# 2. Setup SSH key auth (for peer communication)
echo ""
echo "Step 2: Setting up SSH key authentication..."
if [ ! -f ~/.ssh/id_rsa ]; then
    ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N ""
fi

# Copy key to all peers
for peer in "${PEERS[@]}"; do
    if [ "$peer" != "$THIS_HOST" ]; then
        echo "Copying SSH key to $peer..."
        ssh-copy-id -i ~/.ssh/id_rsa.pub ubuntu@$peer
    fi
done

# 3. Mount peer workspaces
echo ""
echo "Step 3: Mounting peer workspaces..."
cd ~/.claude/plugins/ultrapilot
./mount-peer-workspaces.sh

# 4. Create systemd service for workspace mounts
echo ""
echo "Step 4: Creating systemd services..."
sudo tee /etc/systemd/system/ultrapilot-mounts.service > /dev/null <<EOF
[Unit]
Description=Mount Peer Workspaces for Ultrapilot
After=network.target

[Service]
Type=oneshot
User=ubuntu
WorkingDirectory=/home/ubuntu/.claude/plugins/ultrapilot
ExecStart=/home/ubuntu/.claude/plugins/ultrapilot/mount-peer-workspaces.sh
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl enable ultrapilot-mounts.service
sudo systemctl start ultrapilot-mounts.service

# 5. Start UltraX Gateway
echo ""
echo "Step 5: Starting UltraX Gateway..."
./start.sh

# 6. Verify
echo ""
echo "Step 6: Verifying installation..."
sleep 3

if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ UltraX Gateway running"
else
    echo "❌ UltraX Gateway failed to start"
    exit 1
fi

# Show status
echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║   ✅ INSTALLATION COMPLETE                                  ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "This host: $THIS_HOST"
echo "Gateway: http://$THIS_HOST:3001"
echo "Relay: http://$THIS_HOST:3000"
echo ""
echo "Peer workspaces:"
df -h | grep sshfs || echo "  No peer workspaces mounted yet"
echo ""
echo "Access ALL workspaces from this machine:"
echo "  Local:    ~/projects/"
echo "  vps5:     ~/remote/vps5/projects/"
echo "  vps4:     ~/remote/vps4/projects/"
echo "  vps3:     ~/remote/vps3/projects/"
echo ""
```

### Component 5: Relay UI Enhancement

**Modify Relay to show federated sessions:**

```typescript
// In Relay UI, show session hostname
interface SessionDisplay {
  sessionId: string;
  hostname: string;  // NEW: Which machine is running this
  status: string;
  workspace: string;
}

// Show hostname badge in UI
function renderSession(session: SessionDisplay) {
  return `
    <div class="session">
      <span class="session-id">${session.sessionId}</span>
      <span class="badge badge-${session.hostname}">
        ${session.hostname}
      </span>
      <span class="status">${session.status}</span>
    </div>
  `;
}
```

## Usage Examples

### Example 1: Work on Any Workspace from Any Machine

```bash
# On vps5, work on vps4's workspace
cd ~/remote/vps4/projects/myapp
/ultrapilot add new feature

# On vps3, work on vps5's workspace
cd ~/remote/vps5/projects/another-app
/ultrapilot fix bug
```

### Example 2: Monitor All Sessions from Any Machine

```bash
# From vps5 Gateway
curl http://vps5:3001/api/sessions

# Response shows sessions from ALL machines:
[
  { sessionId: "abc", hostname: "vps5", status: "active", ... },
  { sessionId: "def", hostname: "vps4", status: "idle", ... },
  { sessionId: "ghi", hostname: "vps3", status: "active", ... }
]
```

### Example 3: Control Remote Session

```bash
# From vps5, control session running on vps4
curl -X POST http://vps5:3001/api/sessions/vps4/def/control \
  -H "Content-Type: application/json" \
  -d '{"command": "/status"}'
```

## Benefits

### 1. True Independence
- Each machine is fully functional
- No master, no slave
- Can operate completely independently

### 2. Universal Access
- Any workspace from any machine
- Transparent access via SSHFS mounts
- Feels like local files

### 3. Redundancy by Design
- Each machine backs up the others
- Lose any 2 machines, still operational
- No single point of failure

### 4. Flexibility
- Work from any machine
- Move between machines seamlessly
- No affinity to specific hardware

## Comparison with Previous Design

| Feature | Old Design (Hub-Spoke) | New Design (Peer-to-Peer) |
|---------|------------------------|---------------------------|
| Architecture | Master (vps5) + Slaves | All peers equal |
| Single Point of Failure | Yes (vps5) | No |
| Workspace Access | Via NFS from vps5 | Direct mounts to all |
| Session Control | Centralized | Distributed |
| Independence | Slaves depend on master | Fully independent |
| Complexity | Lower | Higher |
| Scalability | Limited to 1 master | Unlimited peers |

## Implementation Steps

### Step 1: Setup SSH Authentication (All Machines)
```bash
# On each machine (vps5, vps4, vps3)
ssh-keygen -t rsa -b 4096

# Copy keys to all peers
ssh-copy-id ubuntu@vps5
ssh-copy-id ubuntu@vps4
ssh-copy-id ubuntu@vps3
```

### Step 2: Install Plugin on All Machines
```bash
# On each machine
cd ~/.claude/plugins/
git clone https://github.com/hscheema1979/ultrapilot.git
cd ultrapilot
./install-distributed.sh
```

### Step 3: Verify Federation
```bash
# From any machine
curl http://localhost:3001/api/sessions

# Should show sessions from ALL machines
```

## Next Steps

Would you like me to:
1. ✅ Create the mount-peer-workspaces.sh script
2. ✅ Implement session-federation.ts
3. ✅ Update Gateway with federation endpoints
4. ✅ Create install-distributed.sh
5. ✅ Test on your machines

**This design gives you exactly what you want**: Each machine is independent but can access and control everything across the cluster! 🚀
