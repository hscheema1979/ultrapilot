# Claude Code Enterprise Chat Integration Guide

## Overview: Claude Code + Enterprise Chat UI (2025-2026)

### What's Available

**Official Integrations:**
1. **Slack** (Research Preview - Dec 2025)
2. **Microsoft Teams** (Enterprise - Feb 2026)
3. **MCP Apps** (Interactive UI framework - Jan 2026)

## Option 1: Slack Integration (RECOMMENDED)

### Status
✅ **Research Preview** - Available through Anthropic enterprise channels

### Features
- **@Claude mentions** in Slack threads
- **Automatic context analysis** of conversation
- **Bug report identification** and code repository detection
- **Progress updates** posted in Slack
- **Pull request creation** and review links
- **End-to-end workflow** without leaving Slack

### Requirements
- Claude Code Enterprise plan
- Slack workspace admin access
- Model Context Protocol (MCP) configured

### Setup

**1. Configure Slack App:**
```bash
# Create Slack app
https://api.slack.com/apps

# Enable OAuth scopes:
- chat:write
- channels:read
- files:write
- reactions:write

# Install to workspace
```

**2. Configure Claude Code:**
```bash
# ~/.claude/slack-config.json
{
  "workspace": "your-company.slack.com",
  "channels": {
    "development": "#dev-workflow",
    "code-review": "#code-review",
    "deployments": "#deployments"
  },
  "autoContextAnalysis": true,
  "progressUpdates": true,
  "prLinks": true
}
```

**3. Enable MCP Server:**
```bash
# Install Model Context Protocol server
npm install -g @anthropic-ai/mcp-server-slack

# Configure connection
claude mcp connect slack
```

### Usage in Slack
```
[@Claude] We have a bug in the authentication module
          when users with special characters in passwords
          try to log in.

→ Claude Code automatically:
   1. Analyzes conversation context
   2. Identifies relevant code repository
   3. Opens files in VS Code
   4. Investigates the bug
   5. Proposes fix
   6. Creates PR
   7. Posts progress in thread
```

### Enterprise Customers Already Using
- Netflix
- Spotify
- KPMG
- L'Oréal
- Salesforce

---

## Option 2: Microsoft Teams Integration

### Status
✅ **Generally Available** (Feb 2026) - Claude Team/Enterprise customers

### Features
- **SharePoint integration**
- **OneDrive file access**
- **Outlook calendar integration**
- **Microsoft Teams chat interface**
- **Azure-based deployment**

### Requirements
- Claude Team or Enterprise plan
- Microsoft 365 tenant
- Azure subscription (for enterprise deployment)

### Setup

**1. Microsoft 365 Admin Center:**
```bash
# Navigate to:
https://admin.microsoft.com/

# Settings → Integrated apps → Add Claude Code
```

**2. Configure Connectors:**
```powershell
# Install Claude Code connector
Install-Module -Name MSCloudLogin
Connect-MSCloudIds -TenantId "your-tenant-id"

# Add Claude Code integration
New-App -AppId "anthropic-claude-code" -TenantId "your-tenant-id"
```

**3. Team Configuration:**
```json
{
  "teams": ["development", "code-review", "architecture"],
  "channels": {
    "general": "Claude Code assistance",
    "code": "Code review and debugging",
    "planning": "Architecture and planning"
  },
  "sharePoint": {
    "site": "https://yourcompany.sharepoint.com",
    "documentLibrary": "Technical Docs"
  }
}
```

### Usage in Teams
```
Chat: @Claude Code
Message: Review the PR #123 and identify any security issues

→ Claude Code:
   1. Accesses PR from Azure Repos
   2. Reviews code in VS Code
   3. Identifies security vulnerabilities
   4. Posts findings in Teams
   5. Creates annotated review
```

---

## Option 3: MCP Apps (Interactive UI Framework)

### Status
✅ **Generally Available** (Jan 2026) - Pro, Team, Enterprise users

### Supported Apps
- **Slack** - Conversations, message drafts
- **Figma** - Flowcharts, Gantt charts
- **Asana** - Projects, tasks, timelines
- **Amplitude** - Analytics, trends
- **Box** - File search, preview
- **Canva** - Presentations
- **monday.com** - Project management
- **Salesforce Agentforce 360** (Coming soon)

### Features
- **Interactive UI components** in Claude chat
- **Real-time collaboration** without app switching
- **Approval prompts** for security
- **Admin controls** for permissions
- **No additional cost** (included in Pro/Team/Enterprise)

### Setup

**1. Enable MCP Apps:**
```bash
# Claude Code settings
Settings → MCP Apps → Enable

# Or via config
~/.claude/mcp-apps-config.json
{
  "enabledApps": ["slack", "figma", "asana"],
  "approvalRequired": true,
  "adminControls": true
}
```

**2. Configure Individual Apps:**

**Slack:**
```javascript
{
  "slack": {
    "workspaces": ["acme-corp.slack.com"],
    "channels": ["#dev", "#general"],
    "permissions": ["read", "post", "search"]
  }
}
```

**Figma:**
```javascript
{
  "figma": {
    "teamId": "your-team-id",
    "projects": ["design-system", "ui-flows"],
    "permissions": ["edit", "comment"]
  }
}
```

**Asana:**
```javascript
{
  "asana": {
    "workspace": "Your Company",
    "projects": ["Sprint 24", "Q1 Goals"],
    "tasks": ["create", "update", "complete"]
  }
}
```

### Example Workflows

**1. Slack + Code:**
```
User: @Claude Review the error logs from #dev-ops and
             create a ticket in Asana with the fix plan

→ Claude:
   1. Reads Slack #dev-ops logs
   2. Analyzes error patterns
   3. Identifies root cause
   4. Creates Asana task with:
      - Error description
      - Proposed fix
      - Assignee (determined from code)
      - Due date (calculated from priority)
```

**2. Figma + Architecture:**
```
User: @Claude Update the architecture diagram in Figma
             based on the new authentication flow we discussed

→ Claude:
   1. Opens Figma architecture diagram
   2. Reads conversation context
   3. Updates diagram with new auth flow
   4. Posts updated diagram in chat
   5. Asks for approval before saving
```

---

## Comparison: Enterprise Chat Platforms

| Platform | Availability | Enterprise Grade | Integration Depth | Setup Complexity |
|----------|-------------|-----------------|-------------------|------------------|
| **Slack** | Research Preview | ⭐⭐⭐⭐⭐ | Deep (MCP-based) | Medium |
| **Microsoft Teams** | GA (Feb 2026) | ⭐⭐⭐⭐⭐ | Deep (M365 ecosystem) | High |
| **MCP Apps** | GA (Jan 2026) | ⭐⭐⭐⭐⭐ | Very Deep | Low-Medium |

---

## Recommendation for Your Use Case

### For Maximum Enterprise Features:

**Microsoft Teams** (if you use M365)
- ✅ Deepest Microsoft ecosystem integration
- ✅ SharePoint + OneDrive + Outlook
- ✅ Enterprise-grade security
- ✅ Azure-based deployment
- ✅ Generally available

### For Development Workflow:

**Slack** (if you use Slack)
- ✅ Best for developer workflows
- ✅ Seamless GitHub/Azure Repos integration
- ✅ Great for code review and debugging
- ✅ Research preview (cutting edge)

### For Flexibility:

**MCP Apps** (framework)
- ✅ Multi-platform support
- ✅ Interactive UI components
- ✅ Custom workflows
- ✅ No additional cost

---

## Integration with Ultrapilot

Your Ultrapilot plugin can work with any of these:

```bash
# In Teams/Slack:
@Claude /ultrapilot Build me a user authentication system

→ Claude Code:
  1. Receives command in chat
  2. Invokes Ultrapilot plugin
  3. Runs 6-phase workflow
  4. Posts progress updates in chat
  5. Shares PR link when complete
```

### Configure Ultrapilot for Chat

```bash
# ~/.claude/ultrapilot-chat-integration.json
{
  "platform": "slack", // or "teams"
  "progressUpdates": true,
  "notifications": {
    "phaseComplete": true,
    "qaCycle": true,
    "validationRound": true,
    "completion": true
  },
  "artifacts": {
    "shareSpec": true,
    "sharePlan": true,
    "sharePR": true
  }
}
```

---

## Getting Access

### Slack Integration:
1. Contact Anthropic enterprise sales
2. Request "Claude Code for Slack" research preview
3. Enterprise agreement required

### Microsoft Teams:
1. Claude Team or Enterprise plan
2. Microsoft 365 tenant admin
3. Azure subscription (optional, for hosting)

### MCP Apps:
1. Pro, Team, or Enterprise plan
2. Enable in Claude Code settings
3. Configure individual apps

---

**Sources:**
- [Anthropic Claude Code for Slack](https://www.anthropic.com/news/claude-code-for-slack)
- [Microsoft Azure Anthropic Partnership](https://www.anthropic.com/news/claude-in-microsoft-365)
- [Claude Code Enterprise Features](https://www.anthropic.com/claude-code)
- [Model Context Protocol](https://www.anthropic.com/model-context-protocol)
