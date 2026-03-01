# Google Workspace Domain Management with Ultrapilot

## Current Infrastructure

You already have **complete Google Workspace domain management** built into your Ultrapilot system!

### What's Installed

✅ **ultra-domain-setup** skill
- One-time domain initialization wizard
- Sets up queues, routines, and task routing
- Configures heartbeat monitoring

✅ **ultra-autoloop** skill
- Continuous domain heartbeat driver
- Processes intake queues automatically
- Maintains domain health 24/7
- "The boulder never stops"

✅ **Google Workspace API Integration**
- Located: `~/agent-template/database/google-workspace.ts`
- Supports: Drive, Docs, Sheets, Slides, Gmail, Calendar, Tasks, Keep
- OAuth tokens: `~/oauth_tokens/google_token.json`

### Available Services

```typescript
GoogleWorkspace {
  drive      // Google Drive file management
  docs       // Google Docs manipulation
  sheets     // Google Sheets operations
  slides     // Google Slides presentations
  gmail      // Email management
  calendar   // Calendar events and scheduling
  tasks      // Google Tasks
  keep       // Google Keep notes
}
```

## Domain Management Workflow

### Step 1: Initialize Domain (One-Time)
```bash
/ultra-domain-setup
```

**What it does:**
- Defines domain identity and requirements
- Sets up intake queues for tasks
- Configures routine maintenance schedules
- Prepares domain for autonomous operation

**Setup Wizard asks:**
1. Domain identity (name, description, type)
2. Tech stack (language, framework, testing)
3. Google Workspace integration points
4. Routine schedules (daily, weekly tasks)
5. Agent assignments and ownership

### Step 2: Start Autoloop (Continuous)
```bash
/ultra-autoloop
```

**What it does (every 60 seconds):**
1. ✅ Checks intake queues for new tasks
2. ✅ Processes routine maintenance tasks
3. ✅ Closes out completed work
4. ✅ Syncs domain components
5. ✅ Ensures agency and ownership
6. ✅ Monitors system health
7. ✅ Reports status and metrics

### Step 3: Monitor and Manage

**Check domain status:**
```bash
cat ~/.ultra/state/domain-state.json | jq '.'
```

**Check queue status:**
```bash
cat ~/.ultra/state/queue-state.json | jq '.intakeQueue'
```

**Check autoloop heartbeat:**
```bash
cat ~/.ultra/state/autoloop-state.json | jq '.lastHeartbeat'
```

## Google Workspace Integration Examples

### Drive Management
```bash
# With ultrapilot agents
/ultra-team N=2 "Organize Drive folders and update permissions"

# Autoloop routine
# Sync Drive changes, organize files, backup important docs
```

### Docs Automation
```bash
# Generate documentation
/ultrapilot "Generate API docs from code and create Google Doc"

# Autoloop routine
# Update docs when code changes, sync with README
```

### Sheets Operations
```bash
# Data processing
/ultrapilot "Process Sheet data and generate reports"

# Autoloop routine
# Daily data sync, report generation, dashboard updates
```

### Gmail Management
```bash
# Email automation
/ultrapilot "Categorize emails and generate response drafts"

# Autoloop routine
# Check for important emails, route to queues, update trackers
```

### Calendar Management
```bash
# Scheduling
/ultrapilot "Schedule weekly sync and send invites"

# Autoloop routine
# Check for conflicts, send reminders, update team calendars
```

## Compared to SDO Approach

| Feature | SDO | Ultrapilot |
|---------|-----|------------|
| Domain setup | Manual | `/ultra-domain-setup` wizard |
| Continuous monitoring | Cron jobs | `/ultra-autoloop` heartbeat |
| Task routing | Manual | Automatic queue processing |
| Google API | Direct calls | Integrated via GoogleWorkspace class |
| Agent coordination | Manual | Multi-agent parallel execution |
| Error handling | Manual | Self-healing with ralph loop |
| State management | Custom | Built-in `.ultra/state/` system |

## Practical Example: Domain Management

### Scenario: Manage Google Workspace for a Team

**Step 1: Initialize Domain**
```bash
/ultra-domain-setup
```
```
Domain: team-workspace
Type: Full Stack
Tech Stack: TypeScript, React, Node.js
Google Services: Drive, Sheets, Gmail, Calendar
Routines:
  - Daily: Sync Drive folders, check for important emails
  - Weekly: Generate reports from Sheets, send summary
  - Monthly: Archive old files, update documentation
```

**Step 2: Start Autoloop**
```bash
/ultra-autoloop
```

**Step 3: Watch It Work**
```
[HEARTBEAT] Checking intake queues...
  → New task: "Organize project Drive folder"
  → Assigned to: ultra-team-implementer

[HEARTBEAT] Processing routines...
  → Daily sync: Drive folders organized ✓
  → Daily sync: Important emails flagged ✓

[HEARTBEAT] Closing completed work...
  → Task "Organize project Drive folder": verified & closed ✓

[HEARTBEAT] Syncing domain components...
  → Git status: 3 files changed, committing...

[HEARTBEAT] Health check: All systems operational ✓
```

## Available Ultra Commands for Domain Management

| Command | Purpose |
|---------|---------|
| `/ultra-domain-setup` | Initialize domain (one-time) |
| `/ultra-autoloop` | Start continuous heartbeat |
| `/ultra-team N=X` | Spawn agents for domain tasks |
| `/ultra-ralph` | Persistent execution for tasks |
| `/ultra-pipeline` | Chain domain operations |
| `/ultra-cancel` | Stop domain operations |

## Next Steps

1. **Initialize your domain:**
   ```bash
   /ultra-domain-setup
   ```

2. **Configure Google Workspace integration:**
   - OAuth tokens already in place
   - Service account ready for domain-wide delegation

3. **Start autoloop:**
   ```bash
   /ultra-autoloop
   ```

4. **Monitor heartbeat:**
   ```bash
   cat ~/.ultra/state/autoloop-state.json | jq '.lastHeartbeat, .tasksProcessed'
   ```

---

**Bottom Line:** You already have MORE powerful domain management than SDO provided, fully integrated with Ultrapilot's multi-agent orchestration! 🚀
