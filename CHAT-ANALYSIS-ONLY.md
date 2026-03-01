# Claude Code Chat Integration: Analysis & Review Focus

## Quick Setup for Analysis & Review Workflows

### Best Option: Microsoft Teams ✅

**Why Teams for analysis/review:**
- ✅ Native code review integration (Azure Repos, GitHub)
- ✅ SharePoint document storage for analysis reports
- ✅ Great for team collaboration on reviews
- ✅ Enterprise-ready (generally available)

### Setup Steps

**1. Enable Claude Code in Microsoft 365:**
```
Microsoft 365 Admin Center
  → Settings → Integrated Apps
  → Get Apps → Search "Claude Code"
  → Add to tenant
```

**2. Create dedicated Teams:**
```
• "Code Review" team
  - #incoming-prs (automated posts)
  - #security-review
  - #performance-review

• "Analysis" team
  - #bug-analysis
  - #architecture-review
  - #technical-debt
```

**3. Configure Claude Code for analysis:**
```json
// ~/.claude/teams-analysis-config.json
{
  "teams": {
    "code-review": {
      "autoReviewPRs": true,
      "reviewers": ["security", "performance", "architecture"],
      "minApprovalCount": 2
    },
    "analysis": {
      "autoAnalyzeBugs": true,
      "createTickets": true,
      "severityThreshold": "medium"
    }
  }
}
```

### Usage Examples

**Security Review:**
```
@Claude ultra-security-review the PR in #incoming-prs
          Focus on authentication and authorization

→ Claude:
   1. Fetches PR from Azure Repos/GitHub
   2. Runs ultra-security-review (OWASP Top 10)
   3. Posts findings in thread
   4. Creates ticket for critical issues
   5. Tags @security-team for review
```

**Performance Analysis:**
```
@Claude ultra-quality-review the database module
          Check for N+1 queries and optimization opportunities

→ Claude:
   1. Opens code in VS Code
   2. Runs performance analysis
   3. Identifies bottlenecks
   4. Posts optimization suggestions
   5. Creates analysis report in SharePoint
```

**Bug Investigation:**
```
@Claude ultra-debugging investigate the login timeout issue
          from #bug-reports, check the error logs

→ Claude:
   1. Reads error logs from channel
   2. Reproduces issue in codebase
   3. Runs hypothesis-driven debugging
   4. Identifies root cause
   5. Posts fix proposal with code diff
```

---

## Alternative: Slack Integration

**Setup:**
1. Contact Anthropic for "Claude Code for Slack" research preview
2. Install Slack app with scopes:
   - `channels:read`
   - `chat:write`
   - `files:write`

**Usage:**
```
#code-review channel:
@Claude ultra-review https://github.com/org/repo/pull/123

→ Claude posts review findings directly in thread
```

---

## Integration with Ultrapilot Analysis Agents

Your Ultrapilot plugin has specialized analysis/review agents:

**Available Commands:**
```
@Claude /ultra-review           # Multi-dimensional review
@Claude /ultra-security-review  # Security-focused review
@Claude /ultra-quality-review   # Performance & quality review
@Claude /ultra-debugging        # Bug investigation
@Claude /ultra-code-review      # Comprehensive code review
```

**Configure Ultrapilot for Teams:**
```bash
# ~/.claude/ultrapilot-teams-config.json
{
  "notifications": {
    "platform": "teams",
    "webhook": "your-webhook-url",
    "channels": {
      "security": "code-review/security-review",
      "performance": "code-review/performance-review",
      "bugs": "analysis/investigation"
    }
  },
  "commands": {
    "ultra-review": {
      "enabled": true,
      "autoPost": true,
      "format": "detailed"
    }
  }
}
```

---

## Quick Start

**For immediate use:**
```bash
# Run setup script
bash ~/.claude/plugins/ultrapilot/scripts/setup-chat-integration.sh

# Then in Teams:
@Claude /ultra-security-review Analyze authentication module

# Or in Slack (if configured):
@Claude /ultra-performance-review Check database queries
```

**Documentation:**
- [Claude Code for Slack](https://www.anthropic.com/news/claude-code-for-slack)
- [Claude in Microsoft 365](https://www.anthropic.com/news/claude-in-microsoft-365)

---

## Recommendation

**For analysis/review workflows:**
1. **Primary:** Microsoft Teams (GA, enterprise-ready)
2. **Secondary:** Slack (research preview, cutting-edge)

Both work with your Ultrapilot analysis agents seamlessly.
