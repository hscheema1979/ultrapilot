# Ultra-Dev Domain - Example Configuration

**This `.ultra/` folder serves as a reference example** of a properly configured UltraPilot domain.

Use this as a template when setting up new domains.

---

## Directory Structure

```
.ultra/
├── domain.json                 # Domain configuration
├── workspace.json              # Workspace metadata
├── queues/                     # Task queue system
│   ├── intake.json            # New tasks waiting to be processed
│   ├── in-progress.json      # Tasks currently being worked on
│   ├── review.json            # Tasks awaiting validation
│   ├── completed.json         # Recently completed tasks
│   └── failed.json            # Failed tasks
├── routines/                   # Routine maintenance tasks
│   ├── test-suite-health.json
│   ├── dependency-check.json
│   ├── git-sync.json
│   ├── lint-check.json
│   └── build-check.json
├── state/                      # Runtime state files
│   ├── autoloop-state.json   # Autoloop daemon state
│   ├── ultra-lead-state.json # Ultra-Lead session state
│   ├── sessions.json          # Session registry
│   ├── heartbeat.json         # Health metrics
│   └── initialized           # Setup completion flag
└── [documentation files]     # Domain-specific docs (optional)
```

---

## Key Configuration Files

### 1. domain.json

**Purpose**: Core domain configuration

**Key Fields**:
```json
{
  "domainId": "domain-ultra-dev-001",
  "name": "ultra-dev",
  "type": "development-environment",
  "description": "Software development domain...",
  
  "stack": {
    "language": "TypeScript",
    "framework": "Node.js",
    "packageManager": "npm",
    "testing": "Vitest"
  },
  
  "agents": [
    "ultra:analyst",
    "ultra:architect",
    "ultra:planner",
    "ultra:critic",
    "ultra:executor",
    "ultra:team-lead",
    "ultra:debugger",
    "ultra:test-engineer",
    "ultra:verifier",
    "ultra:security-reviewer",
    "ultra:quality-reviewer",
    "ultra:code-reviewer"
  ],
  
  "routing": {
    "rules": [
      {
        "pattern": "feature|implement",
        "agent": "ultra:executor"
      },
      {
        "pattern": "bug|fix",
        "agent": "ultra:debugger"
      }
    ]
  },
  
  "autoloop": {
    "cycleTime": 60,
    "enabled": true,
    "autoStart": false
  }
}
```

**What to Configure**:
- `name`: Your domain name
- `type`: "development-environment" or "web-api", "mobile-app", etc.
- `agents`: List of agents available in your domain
- `routing.pattern`: Regex patterns matching task types
- `autoloop.cycleTime`: How often autoloop checks queues (seconds)

---

### 2. queues/intake.json

**Purpose**: New tasks submitted to the domain

**Structure**:
```json
{
  "queue": "intake",
  "tasks": [
    {
      "id": "task-001",
      "title": "Task title",
      "description": "What needs to be done",
      "priority": "P2",
      "type": "feature",
      "createdAt": "2026-03-03T00:00:00Z",
      "metadata": {}
    }
  ],
  "metadata": {
    "created": "2026-03-03T00:00:00Z",
    "lastModified": "2026-03-03T00:00:00Z"
  }
}
```

**Task Priority Levels**:
- `P0` - Critical (security, production down)
- `P1` - High (important features, bugs)
- `P2` - Medium (normal tasks)
- `P3` - Low (nice to have)

**Task Types**: feature, bug, refactor, review, test, docs, security, performance

---

### 3. state/autoloop-state.json

**Purpose**: Autoloop daemon runtime state

**Example**:
```json
{
  "active": true,
  "domain": "ultra-dev",
  "heartbeat": {
    "status": "running",
    "lastBeat": "2026-03-03T16:51:15.185Z",
    "interval": 60,
    "missedBeats": 0
  },
  "cycles": {
    "current": 19,
    "total": 19,
    "lastCycleTime": "2026-03-03T16:51:15.185Z",
    "averageCycleTime": 60
  },
  "queues": {
    "intake": 0,
    "inProgress": 1,
    "review": 0,
    "completed": 0,
    "failed": 0
  }
}
```

**What It Tracks**:
- Autoloop heartbeat status
- Current cycle number
- Queue depths
- Last cycle timestamp

---

### 4. state/sessions.json

**Purpose**: Session registry for tracking active sessions

**Example**:
```json
{
  "sessions": [
    {
      "sessionId": "autoloop-001",
      "type": "autoloop",
      "pid": 3805095,
      "tmuxSession": "ultra-dev-autoloop",
      "startedAt": "2026-03-03T16:33:14.356Z",
      "status": "running"
    }
  ],
  "created": "2026-03-03T00:00:00Z",
  "version": "1.0.0"
}
```

**Session Types**:
- `autoloop` - Domain heartbeat driver
- `ultra-lead` - Operations executor (Phases 2-5)
- `ultrapilot` - Strategic orchestrator (Phases 0-1)
- `custom` - User-defined sessions

---

## Setting Up a New Domain

### Option 1: Automatic Setup (Recommended)

```bash
cd /path/to/your/project
/ultra-domain-setup --type development-environment --name my-domain
```

This creates all necessary files with sensible defaults.

### Option 2: Manual Setup

1. **Create directory structure**:
```bash
mkdir -p .ultra/{queues,routines,state}
touch .ultra/{domain.json,workspace.json}
touch .ultra/queues/{intake,in-progress,review,completed,failed}.json
touch .ultra/state/{autoloop-state.json,sessions.json,heartbeat.json}
touch .ultra/routines/{test-suite-health,dependency-check,git-sync,lint-check,build-check}.json
```

2. **Copy this domain.json as template**:
```bash
cp /path/to/ultra-dev/.ultra/domain.json .ultra/domain.json
```

3. **Edit domain.json**:
   - Change `name` to your domain name
   - Update `stack` to match your project
   - Adjust `agents` list if needed
   - Customize `routing` rules

4. **Initialize queue files**:
```bash
for queue in intake in-progress review completed failed; do
  echo '{"queue":"'$queue'","tasks":[],"metadata":{"created":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","lastModified":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}}' > .ultra/queues/$queue.json
done
```

---

## Domain Types

### Development Environment (ultra-dev)

**Use When**: Primary software development workspace

**Characteristics**:
- Full agent catalog (525 agents)
- All 18 domains covered
- Complete routing rules
- Comprehensive routine tasks

**Example**: This domain!

---

### Project Domain (web-api, mobile-app, library)

**Use When**: Specific project workspace

**Characteristics**:
- Focused agent set (6-12 agents)
- Project-specific tech stack
- Tailored routing rules
- Minimal routine tasks

**domain.json**:
```json
{
  "name": "ecommerce-api",
  "type": "web-api",
  "agents": [
    "ultra:executor",
    "ultra:test-engineer",
    "ultra:debugger",
    "ultra:code-reviewer"
  ]
}
```

---

### Multi-Project Domain (monorepo, workspace)

**Use When**: Managing related projects

**Characteristics**:
- Broader agent set across project types
- Coordinated multi-project work
- Shared routing rules

**domain.json**:
```json
{
  "name": "my-monorepo",
  "type": "monorepo",
  "agents": [
    "ultra:executor",
    "ultra:test-engineer",
    "ultra:frontend-expert",
    "ultra:backend-expert"
  ]
}
```

---

## Routine Tasks Configuration

Each routine task has a configuration file:

**test-suite-health.json**:
```json
{
  "name": "test-suite-health",
  "schedule": "hourly",
  "enabled": true,
  "command": "npm test",
  "lastRun": "2026-03-03T16:00:00Z",
  "failures": 0
}
```

**Available Schedules**:
- `hourly` - Run every hour
- `daily` - Run once per day
- `on-change` - Run when files change
- `weekly` - Run once per week

---

## Quality Gates Configuration

In `domain.json`:

```json
{
  "qualityGates": {
    "testsMustPass": true,
    "lintMustPass": true,
    "buildMustSucceed": true,
    "securityScanMustPass": false
  }
}
```

**Gates**:
- `testsMustPass` - All tests must pass before closing tasks
- `lintMustPass` - Linting must pass before committing
- `buildMustSucceed` - Build must succeed before merging
- `securityScanMustPass` - Security scan must pass before deploy

---

## Verification Checklist

After setting up your domain, verify:

- [ ] `domain.json` exists with correct configuration
- [ ] All queue files created (intake, in-progress, review, completed, failed)
- [ ] All state files created (autoloop-state, sessions, heartbeat)
- [ ] Routine tasks configured
- [ ] File permissions set correctly (700 for dirs, 600 for files)
- [ ] `.ultra/` in `.gitignore` (runtime data should not be committed)
- [ ] Autoloop can be started: `/ultra-autoloop`
- [ ] Ultra-Lead can be started: `/ultra-lead`

---

## File Permissions

**Security**:
```bash
# Directories: 700 (owner read/write/execute only)
chmod 700 .ultra .ultra/queues .ultra/routines .ultra/state

# Config files: 600 (owner read/write only)
chmod 600 .ultra/domain.json .ultra/workspace.json
```

---

## .gitignore

Ensure your project's `.gitignore` includes:

```gitignore
# UltraPilot runtime data (per-workspace)
.ultra/

# Keep domain config template if needed
!.ultra/domain.json.example
```

**Important**: `.ultra/` contains runtime state and should NOT be committed to git.

---

## Monitoring Your Domain

### Check Autoloop Status

```bash
# Check heartbeat
cat .ultra/state/heartbeat.json

# Check autoloop state
cat .ultra/state/autoloop-state.json

# Monitor autoloop output (if running in tmux)
tmux attach -t ultra-dev-autoloop
# Press Ctrl+B then D to detach
```

### Check Queue Status

```bash
# Count tasks in each queue
for f in .ultra/queues/*.json; do
  echo "$f: $(jq '.tasks | length' $f) tasks"
done
```

### Check Session Registry

```bash
cat .ultra/state/sessions.json | jq '.sessions'
```

---

## Troubleshooting

### Autoloop Not Processing Tasks

**Check**:
1. Is autoloop running? `cat .ultra/state/autoloop-state.json`
2. Are there tasks in intake? `cat .ultra/queues/intake.json`
3. Check autoloop logs: `tmux attach -t ultra-dev-autoloop`

**Fix**:
- Restart autoloop: `/ultra-autoloop`
- Check routing rules in domain.json
- Verify task format matches expected structure

### Permission Errors

**Symptom**: "Permission denied" accessing `.ultra/` files

**Fix**:
```bash
chmod 700 .ultra .ultra/*
chmod 600 .ultra/*.json
```

### Domain Not Recognized

**Symptom**: "Domain not initialized"

**Fix**:
```bash
touch .ultra/state/initialized
```

---

## Best Practices

1. **One Domain Per Workspace**
   - Each project gets its own `.ultra/`
   - Don't share domains between projects

2. **Runtime Data Not Committed**
   - Always exclude `.ultra/` from git
   - Commit only code, not runtime state

3. **Regular Backups**
   - Back up `domain.json` and routing rules
   - Document custom configurations

4. **Monitor Health**
   - Check heartbeat.json regularly
   - Review queue depths
   - Track autoloop cycles

5. **Update Routing Rules**
   - Add patterns as you discover new task types
   - Keep agent assignments logical
   - Test routing with sample tasks

---

## Advanced Configuration

### Custom Routing Rules

```json
{
  "routing": {
    "rules": [
      {
        "pattern": "^frontend:",
        "agent": "ultra:frontend-developer"
      },
      {
        "pattern": "^backend:",
        "agent": "ultra:backend-developer"
      },
      {
        "pattern": "urgent|critical",
        "agent": "ultra:executor-high",
        "priority": "P0"
      }
    ]
  }
}
```

### Custom Routine Tasks

```json
{
  "name": "custom-health-check",
  "schedule": "hourly",
  "enabled": true,
  "command": "npm run custom-check",
  "onFailure": "notify"
}
```

### Session Role Management

```json
{
  "sessions": [
    {
      "sessionId": "custom-session",
      "type": "custom",
      "role": "specialist",
      "capabilities": ["database-migration", "api-testing"]
    }
  ]
}
```

---

## Summary

This `.ultra/` folder demonstrates a **properly configured domain**:

✅ Complete directory structure
✅ Properly formatted configuration files
✅ Working routing rules
✅ Active autoloop daemon
✅ Session management initialized
✅ Routine tasks configured
✅ Quality gates enforced

**Use this as your reference** when setting up new domains or troubleshooting existing ones.

For automatic domain setup, run:
```bash
/ultra-domain-setup --type development-environment --name my-domain
```

---

**"The boulder never stops."** - Your domain should run continuously.

*Last Updated: 2026-03-03*
*Domain: ultra-dev*
*Status: OPERATIONAL*
