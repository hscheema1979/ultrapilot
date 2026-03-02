# Domain Process Management

**Each domain is a living, breathing organization** with its own autoloop heartbeat and ultra-lead manager. This document explains how to manage domain processes using tmux, pm2, or standalone mode.

---

## Architecture

```
Domain Workspace (e.g., /home/ubuntu/remote/vps5/ultra-dev)
├── .ultra/
│   ├── domain.json                 # Domain configuration
│   ├── state/
│   │   ├── autoloop.json          # Autoloop state
│   │   ├── ultra-lead.json        # Ultra-lead state
│   │   └── process-info.json      # Process manager info
│   ├── queues/                    # Task queues
│   └── routines/                  # Routine configs
└── [domain workspace files]
```

### Two Primary Processes

**1. Autoloop Daemon** (Heartbeat)
- Runs continuously: "The boulder never stops"
- Executes routines on schedule (domain-health-check every 30s, etc.)
- Monitors queues, spawns agents, coordinates workflow
- Managed as: tmux session OR pm2 process OR standalone background

**2. Ultra-Lead Agent** (Domain Manager)
- Senior VP level agent with full autonomy
- Spawns ultra-workers as needed (ultra:team-implementer, ultra:test-engineer, etc.)
- Coordinates parallel work with file ownership
- Managed as: tmux session OR pm2 process OR standalone background

---

## Process Managers

### Tmux (Recommended for Development)

**Pros**:
- Easy to attach/detach
- See output in real-time
- Debug interactively
- Multiple panes per session

**Usage**:
```bash
# Start domain with tmux
cd /home/ubuntu/remote/vps5/ultra-dev
ultra-domain-start --manager tmux

# Attach to autoloop
tmux attach -t ultra-dev-autoloop

# Attach to ultra-lead
tmux attach -t ultra-dev-lead

# List all sessions
tmux ls

# Kill session
tmux kill-session -t ultra-dev-autoloop
```

**Session Layout**:
```
tmux session: ultra-dev-autoloop
├─ Window: ultra (running node dist/agents/autoloop.js)

tmux session: ultra-dev-lead
├─ Window: lead (running claude-code agent ultra:team-lead)
```

### PM2 (Recommended for Production)

**Pros**:
- Auto-restart on crash
- Log management
- CPU/memory monitoring
- Cluster mode support

**Usage**:
```bash
# Start domain with pm2
cd /home/ubuntu/remote/vps5/ultra-dev
ultra-domain-start --manager pm2

# Check status
pm2 status

# View logs
pm2 logs ultra-dev-autoloop
pm2 logs ultra-dev-lead

# Monitor
pm2 mon

# Stop
pm2 stop ultra-dev-autoloop ultra-dev-lead

# Restart
pm2 restart ultra-dev-autoloop
```

### Standalone (Fallback)

**Pros**:
- No dependencies
- Simple for testing

**Cons**:
- No auto-restart
- Harder to monitor

**Usage**:
```bash
# Start domain standalone
ultra-domain-start --manager none

# Check status via state files
cat .ultra/state/autoloop.json
cat .ultra/state/ultra-lead.json

# Stop domain
ultra-domain-stop
```

---

## Workflow

### 1. Initial Domain Setup

```bash
cd /home/ubuntu/remote/vps5/ultra-dev

# Initialize domain (one-time)
/ultra-domain-setup
```

This creates:
- `.ultra/domain.json` with explicit agentic structure
- `.ultra/queues/` for task management
- `.ultra/routines/` for scheduled tasks
- `.ultra/state/` for process state

### 2. Start Domain

```bash
# Auto-detect best process manager (tmux > pm2 > none)
/ultra-domain-start

# OR specify manager
/ultra-domain-start --manager tmux
```

This starts:
- Autoloop daemon (heartbeat)
- Ultra-lead agent (domain manager via Claude Code CLI)

### 3. Monitor Domain

```bash
# Check domain status
/ultra-domain-status

# Attach to autoloop (tmux)
tmux attach -t ultra-dev-autoloop

# View logs (pm2)
pm2 logs ultra-dev-autoloop
pm2 logs ultra-dev-lead
```

### 4. Add Tasks

```bash
# Add task to intake queue
echo '{
  "title": "Fix authentication bug",
  "description": "Users cannot login with valid credentials",
  "priority": "HIGH"
}' > .ultra/queues/intake.json
```

Autoloop will:
1. Detect new task in intake queue
2. Route to appropriate agent (ultra:team-debugger for "bug")
3. Ultra-lead spawns worker with file ownership
4. Worker completes task
5. Task moves to completed queue

### 5. Stop Domain

```bash
# Stop all domain processes
/ultra-domain-stop

# Processes gracefully shutdown
```

---

## Multi-Domain Setup

### Example: Two Domains on VPS5

```bash
# Trading domain on vps5
cd /home/ubuntu/remote/vps5/projects/trading-at
/ultra-domain-start --manager tmux

# Ultra-dev domain on vps5
cd /home/ubuntu/remote/vps5/ultra-dev
/ultra-domain-start --manager tmux

# List all running domains
/ultra-domain-status --all
```

**Output**:
```
╔═══════════════════════════════════════════════════════════════╗
║  ULTRA-DOMAIN-STATUS (ALL DOMAINS)                         ║
╚═══════════════════════════════════════════════════════════════╝

  🟢 quantitative-trading
     Path: /home/ubuntu/remote/vps4/projects/finance-trading/trading-at
     Type: quantitative-trading
     Cycles: 1247

  🟢 ultra-dev
     Path: /home/ubuntu/remote/vps5/ultra-dev
     Type: software-dev
     Cycles: 36

  Found 2 domain(s)
```

### Inter-Domain Communication

Domains communicate via shared state:

```bash
# Trading domain writes signal
echo '{
  "from": "quantitative-trading",
  "signal": "SPX dropped below 3800 - reduce exposure",
  "timestamp": "2026-03-02T21:30:00Z"
}' > /home/ubuntu/remote/vps4/projects/finance-trading/trading-at/.ultra/shared/domain-signals.json

# Ultra-dev domain reads signal and responds
# Spawns ultra:security-reviewer to audit risk management
```

---

## Process Isolation

### Why Domain-Level Processes?

**Problem**: If autoloop runs globally, how does it know which domain to manage?

**Solution**: Each domain runs its own autoloop + ultra-lead process

**Benefits**:
1. **Isolation**: Crash in one domain doesn't affect others
2. **Configuration**: Each domain has its own agents, routines, queues
3. **Resource Management**: CPU/memory per domain
4. **Debugging**: Attach to specific domain's autoloop
5. **Scalability**: Run multiple domains on same VPS

### Directory Structure per Domain

```
vps5/
├── ultra-dev/                    # Domain 1
│   ├── .ultra/
│   │   ├── domain.json           # ultra-dev agents, routines
│   │   ├── state/
│   │   │   ├── autoloop.json     # ultra-dev autoloop state
│   │   │   ├── ultra-lead.json   # ultra-dev lead state
│   │   │   └── process-info.json # tmux/pm2 process info
│   │   ├── queues/               # ultra-dev task queues
│   │   └── shared/               # Inter-domain communication
│
└── projects/trading-at/          # Domain 2
    ├── .ultra/
    │   ├── domain.json           # trading-at agents, routines
    │   ├── state/
    │   │   ├── autoloop.json     # trading-at autoloop state
    │   │   ├── ultra-lead.json   # trading-at lead state
    │   │   └── process-info.json # tmux/pm2 process info
    │   ├── queues/               # trading-at task queues
    │   └── shared/
```

---

## Ultra-Lead Agent Spawning

The ultra-lead is **not** the autoloop. They are separate:

**Autoloop**:
- Heartbeat daemon
- Runs continuously
- Executes routines
- Monitors queues
- Does NOT implement features

**Ultra-Lead** (ultra:team-lead):
- Senior VP agent
- Spawns ultra-workers via Claude Code CLI
- Coordinates parallel work
- Implements features when tasks assigned
- Reports progress to autoloop

### How Ultra-Lead Spawns Workers

```typescript
// Ultra-lead receives task from autoloop
const task = {
  title: "Implement user authentication",
  priority: "HIGH"
};

// Ultra-lead spawns ultra:team-implementer via Claude Code CLI
spawn('claude-code', [
  'agent', 'ultra:team-implementer',
  '--task', JSON.stringify(task),
  '--file-ownership', 'src/auth/*',
  '--workspace', '/home/ubuntu/remote/vps5/ultra-dev'
]);

// Worker runs autonomously
// Ultra-lead monitors progress
// On completion, file ownership transfers back
```

---

## Troubleshooting

### Domain Won't Start

```bash
# Check if domain is initialized
ls -la .ultra/domain.json

# Check domain configuration
cat .ultra/domain.json | jq '.agents'

# Check if tmux/pm2 available
which tmux
which pm2
```

### Autoloop Not Running

```bash
# Check autoloop state
cat .ultra/state/autoloop.json

# Check if process exists
tmux ls | grep ultra-dev
pm2 status | grep ultra-dev

# View autoloop logs
tail -f .ultra/logs/autoloop.log
```

### Ultra-Lead Not Responding

```bash
# Check ultra-lead state
cat .ultra/state/ultra-lead.json

# Attach to ultra-lead session
tmux attach -t ultra-dev-lead

# Check if claude-code available
which claude-code
```

### Zombie Processes

```bash
# Kill all processes for domain
/ultra-domain-stop

# Force kill if needed
tmux kill-session -t ultra-dev-autoloop
tmux kill-session -t ultra-dev-lead
pm2 delete ultra-dev-autoloop
pm2 delete ultra-dev-lead

# Clean up state files
rm .ultra/state/process-info.json
```

---

## Best Practices

### Development
- Use **tmux** for easy debugging
- Attach to autoloop to see real-time activity
- Use `/ultra-domain-status` frequently
- Stop domains when not in use

### Production
- Use **pm2** for auto-restart
- Set up log rotation
- Monitor with `pm2 mon`
- Use process monitoring (Datadog, New Relic)
- Set up alerts for autoloop stopped

### Multi-Domain
- Give domains descriptive names (e.g., `trading-spx`, `ultra-dev`)
- Use different base paths to avoid conflicts
- Monitor resource usage per domain
- Set up inter-domain communication via `.ultra/shared/`
- Document domain dependencies

---

## Summary

**Each domain = Independent organization**
- Own autoloop (heartbeat)
- Own ultra-lead (manager)
- Own agents, routines, queues
- Own tmux/pm2 processes

**"The boulder never stops."** 🪨
