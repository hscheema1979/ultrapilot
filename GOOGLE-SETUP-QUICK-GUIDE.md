# Ultrapilot + Google Workspace Quick Setup Guide

## Prerequisites Check

```bash
# 1. Verify OAuth tokens exist
ls ~/oauth_tokens/google_token.json

# 2. Verify Google Workspace code exists
ls ~/agent-template/database/google-workspace.ts

# 3. Verify ultra-domain-setup skill exists
ls ~/.claude/skills/ultra-domain-setup/SKILL.md
```

If all three exist, you're ready to proceed!

---

## Setup Steps

### Step 1: Initialize Your Domain

```bash
/ultra-domain-setup
```

**The setup wizard will ask:**

1. **Domain Identity**
   - Domain name: `my-workspace`
   - Description: `What does this domain do?`
   - Type: Web API / Mobile App / Library / etc.

2. **Tech Stack**
   - Primary Language: TypeScript / Python / etc.
   - Framework: Express / React / Django / etc.
   - Package Manager: npm / yarn / pip / etc.

3. **Google Workspace Integration**
   - Which services? (Drive, Docs, Sheets, Gmail, Calendar, Chat, etc.)
   - OAuth scopes needed
   - Service account or user OAuth?

4. **Routine Schedules**
   - Daily tasks: (e.g., "Check Gmail for important messages")
   - Weekly tasks: (e.g., "Generate reports from Sheets")
   - Monthly tasks: (e.g., "Archive old files")

5. **Agent Assignments**
   - Which agents handle what?
   - Task routing rules

**Output:** `.ultra/domain-config.json`

---

### Step 2: Start Autoloop

```bash
/ultra-autoloop
```

**What happens:**

- **Heartbeat starts** (every 60 seconds)
- Checks intake queues
- Processes routine tasks
- Syncs Google Workspace
- Posts updates to Google Chat

**You'll see:**
```
[HEARTBEAT] Checking intake queues...
[HEARTBEAT] Processing routines...
[HEARTBEAT] Syncing Google Workspace...
  → Gmail: 3 new messages
  → Drive: 2 new files
  → Calendar: 1 new event
[HEARTBEAT] Posting updates to Google Chat...
[HEARTBEAT] Closing completed tasks...
```

---

### Step 3: Monitor Progress

**Check state anytime:**
```bash
# Current phase/status
cat ~/.ultra/state/domain-state.json | jq '.phase, .status'

# Autoloop heartbeat
cat ~/.ultra/state/autoloop-state.json | jq '.lastHeartbeat'

# Queue status
cat ~/.ultra/state/queue-state.json | jq '.intakeQueue'
```

**Or in Google Chat:**
- Agents post updates directly
- Check dedicated spaces/threads
- @mention agents for status

---

## Example Workflows

### Gmail Management
```bash
/ultra-autoloop
```
Automatically:
- Monitors Gmail for important messages
- Categorizes by priority
- Creates tasks in Google Sheets
- Posts summaries to Chat

### Drive Organization
```bash
/ultra-team N=2 "Organize project Drive folders by department"
```
- Agent 1: Creates folder structure
- Agent 2: Sets permissions and shares
- Update posted to Chat

### Docs Automation
```bash
/ultrapilot "Generate API documentation and create Google Doc"
```
- Analyzes code
- Generates docs
- Creates in Google Docs
- Shares link in Chat

### Sheets Processing
```bash
/ultrapilot "Analyze sales data in Sheets and generate monthly report"
```
- Reads from Sheets
- Performs analysis
- Creates charts
- Generates report in Docs
- Posts to Chat

---

## Configuration Files

**After setup, you'll have:**

```
.ultra/
├── domain-config.json        # Domain settings
├── queues/                    # Task queues
├── routines/                   # Routine tasks
└── state/
    ├── domain-state.json      # Current domain status
    ├── autoloop-state.json   # Heartbeat status
    └── queue-state.json      # Queue status
```

---

## Quick Commands Reference

| Command | Purpose |
|---------|---------|
| `/ultra-domain-setup` | Initialize domain (one-time) |
| `/ultra-autoloop` | Start continuous heartbeat |
| `/ultra-cancel` | Stop all modes |
| `/ultra-hud` | Configure HUD display |

---

## Troubleshooting

**Autoloop not starting?**
```bash
# Check domain config exists
cat .ultra/domain-config.json

# Check for errors
cat ~/.ultra/state/autoloop-state.json | jq '.lastError'
```

**Google Chat not receiving updates?**
- Check webhook configuration in Google Chat
- Verify OAuth scopes include `chat.bot`
- Check autoloop state for connection errors

**Agents not processing tasks?**
```bash
# Check queue status
cat ~/.ultra/state/queue-state.json | jq '.intakeQueue'

# Check agent assignments
cat .ultra/domain-config.json | jq '.agents'
```

---

## What You Get

**With Ultrapilot + Google Workspace:**

✅ **Autonomous Google Workspace management**
- Gmail monitoring and categorization
- Drive file organization
- Calendar event management
- Sheets data processing
- Docs generation
- Chat updates and notifications

✅ **Continuous operation**
- Runs 24/7 (autoloop heartbeat)
- Self-healing (ralph loop)
- Smart task routing
- Multi-agent parallel work

✅ **Enterprise-grade**
- 29 specialist agents
- File ownership (no conflicts)
- Evidence-backed verification
- Multi-dimensional review

---

**That's it! Two commands to set up:**

```bash
/ultra-domain-setup    # Initialize (one-time)
/ultra-autoloop        # Start autonomous operation
```

**Your Google Workspace will now manage itself!** 🚀
