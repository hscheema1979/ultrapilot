# GitHub Label Schema - Usage Examples

Practical examples for using the Ultrapilot label schema.

## Table of Contents
1. [Setup](#setup)
2. [Basic Usage](#basic-usage)
3. [Common Scenarios](#common-scenarios)
4. [GitHub CLI Examples](#github-cli-examples)
5. [Label Combinations](#label-combinations)

## Setup

### 1. Create GitHub Token
```bash
# Go to: https://github.com/settings/tokens
# Generate new token with 'repo' scope
# Copy token and export:
export GITHUB_TOKEN=your_token_here
```

### 2. Run Setup Script
```bash
cd ~/.claude/plugins/ultrapilot/scripts

# Dry run first
./setup-labels.sh -d

# Execute setup
./setup-labels.sh
```

### 3. Verify Labels
```bash
# List all labels
gh label list --repo hscheema1979/ultra-workspace

# Count labels
gh label list --repo hscheema1979/ultra-workspace | wc -l

# Should show: 44 labels
```

## Basic Usage

### Creating Issues with Labels

```bash
# New feature
gh issue create \
  --repo hscheema1979/ultra-workspace \
  --title "Add user authentication" \
  --body "Implement JWT-based authentication system" \
  --label "type:feature,priority:high,phase:0,queue:intake"

# Bug report
gh issue create \
  --repo hscheema1979/ultra-workspace \
  --title "Memory leak in agent executor" \
  --body "Agents not releasing memory after completion" \
  --label "type:bug,priority:critical,queue:intake"

# Epic task
gh issue create \
  --repo hscheema1979/ultra-workspace \
  --title "Build complete CI/CD pipeline" \
  --label "epic,type:feature,priority:high,phase:1"
```

### Updating Labels

```bash
# Add agent label when work starts
gh issue edit 123 \
  --repo hscheema1979/ultra-workspace \
  --add-label "agent:executor,queue:active,phase:2"

# Move to review
gh issue edit 123 \
  --repo hscheema1979/ultra-workspace \
  --add-label "queue:review,agent:code-reviewer"

# Mark as done
gh issue edit 123 \
  --repo hscheema1979/ultra-workspace \
  --add-label "queue:done"

# Handle failure
gh issue edit 123 \
  --repo hscheema1979/ultra-workspace \
  --add-label "queue:failed,agent:debugger"
```

## Common Scenarios

### Scenario 1: New Feature Development

```bash
# Step 1: Create issue
gh issue create \
  --repo hscheema1979/ultra-workspace \
  --title "Add WebSocket support" \
  --label "type:feature,priority:medium,phase:0,queue:intake"

# Step 2: Analyst reviews
gh issue edit 456 \
  --add-label "agent:analyst"

# Step 3: Architect designs
gh issue edit 456 \
  --add-label "agent:architect,phase:1"

# Step 4: Implementation
gh issue edit 456 \
  --add-label "agent:executor,phase:2,queue:active"

# Step 5: Testing
gh issue edit 456 \
  --add-label "agent:test-engineer,phase:3"

# Step 6: Review
gh issue edit 456 \
  --add-label "agent:code-reviewer,queue:review"

# Step 7: Complete
gh issue edit 456 \
  --add-label "queue:done"
```

### Scenario 2: Bug Fix Workflow

```bash
# Create bug report
gh issue create \
  --repo hscheema1979/ultra-workspace \
  --title "Fix race condition in state management" \
  --label "type:bug,priority:high,queue:intake"

# Debugger investigates
gh issue edit 789 \
  --add-label "agent:debugger,queue:active,phase:2"

# If fix found, implement
gh issue edit 789 \
  --add-label "agent:executor,type:bug"

# Verify fix
gh issue edit 789 \
  --add-label "agent:verifier,phase:3"

# Code review
gh issue edit 789 \
  --add-label "agent:code-reviewer,queue:review"

# Close when done
gh issue edit 789 \
  --add-label "queue:done" \
  --comment "Fix verified and deployed"
```

### Scenario 3: Security Issue

```bash
# Security report
gh issue create \
  --repo hscheema1979/ultra-workspace \
  --title "SQL injection vulnerability in API" \
  --label "type:security,priority:critical,queue:intake"

# Immediate security review
gh issue edit 999 \
  --add-label "agent:security-reviewer,queue:active"

# Fix implementation
gh issue edit 999 \
  --add-label "agent:executor-high,phase:2"

# Security verification
gh issue edit 999 \
  --add-label "agent:security-reviewer,phase:4"

# Complete
gh issue edit 999 \
  --add-label "queue:done"
```

### Scenario 4: Epic Breakdown

```bash
# Create epic
gh issue create \
  --repo hscheema1979/ultra-workspace \
  --title "Implement multi-agent orchestration system" \
  --label "epic,type:feature,priority:high"

# Create subtasks
gh issue create \
  --repo hscheema1979/ultra-workspace \
  --title "Design agent communication protocol" \
  --label "type:design,dependency,epic"

gh issue create \
  --repo hscheema1979/ultra-workspace \
  --title "Implement message queue" \
  --label "type:feature,dependency,epic"

gh issue create \
  --repo hscheema1979/ultra-workspace \
  --title "Build agent registry" \
  --label "type:feature,dependency,epic"
```

## GitHub CLI Examples

### Filtering by Labels

```bash
# All active features
gh issue list \
  --repo hscheema1979/ultra-workspace \
  --label "type:feature,queue:active"

# All critical priority items
gh issue list \
  --repo hscheema1979/ultra-workspace \
  --label "priority:critical" \
  --state all

# All items in specific phase
gh issue list \
  --repo hscheema1979/ultra-workspace \
  --label "phase:3"

# All failed items needing attention
gh issue list \
  --repo hscheema1979/ultra-workspace \
  --label "queue:failed"

# All items assigned to specific agent
gh issue list \
  --repo hscheema1979/ultra-workspace \
  --label "agent:debugger"

# Blocked items
gh issue list \
  --repo hscheema1979/ultra-workspace \
  --label "queue:blocked"
```

### Bulk Operations

```bash
# Move multiple items to review
gh issue list \
  --repo hscheema1979/ultra-workspace \
  --label "phase:2,queue:active" \
  --json number \
  --jq '.[].number' | \
  xargs -I {} gh issue edit {} \
    --add-label "queue:review,agent:code-reviewer"

# Mark all phase 5 items as done
gh issue list \
  --repo hscheema1979/ultra-workspace \
  --label "phase:5" \
  --json number \
  --jq '.[].number' | \
  xargs -I {} gh issue edit {} \
    --add-label "queue:done"
```

### Statistics

```bash
# Count issues by queue status
echo "Queue Status:"
for label in intake active review done failed blocked; do
  count=$(gh issue list \
    --repo hscheema1979/ultra-workspace \
    --label "queue:$label" \
    --json number \
    --jq 'length')
  echo "  queue:$label: $count"
done

# Count by type
echo -e "\nIssue Types:"
for type in feature bug design test review chore doc refactor performance security; do
  count=$(gh issue list \
    --repo hscheema1979/ultra-workspace \
    --label "type:$type" \
    --json number \
    --jq 'length')
  echo "  type:$type: $count"
done

# Count by priority
echo -e "\nPriorities:"
for priority in critical high medium low; do
  count=$(gh issue list \
    --repo hscheema1979/ultra-workspace \
    --label "priority:$priority" \
    --json number \
    --jq 'length')
  echo "  priority:$priority: $count"
done
```

## Label Combinations

### Development Workflow

```
Initial: queue:intake + phase:0 + type:feature
→ Analysis: agent:analyst
→ Design: agent:architect + phase:1
→ Planning: agent:planner
→ Execution: agent:executor + phase:2 + queue:active
→ Testing: agent:test-engineer + phase:3
→ Review: agent:code-reviewer + queue:review
→ Complete: queue:done
```

### Bug Fix Workflow

```
Initial: queue:intake + type:bug + priority:high
→ Investigation: agent:debugger + queue:active
→ Fix: agent:executor + phase:2
→ Verification: agent:verifier + phase:3
→ Complete: queue:done
```

### Security Issue Workflow

```
Initial: type:security + priority:critical + queue:intake
→ Assessment: agent:security-reviewer + queue:active
→ Fix: agent:executor-high + phase:2
→ Verification: agent:security-reviewer + phase:4
→ Complete: queue:done
```

### Epic Workflow

```
Epic: epic + type:feature
  ├─ Subtask 1: type:feature + dependency + epic
  ├─ Subtask 2: type:feature + dependency + epic
  └─ Subtask 3: type:feature + dependency + epic

When all complete: epic + queue:done
```

### Handoff Scenarios

```
Agent A completes → handoff + agent:B
Example: agent:analyst → handoff → agent:architect
Example: agent:executor → handoff → agent:test-engineer
```

## Label Cleanup

### Remove Old Labels

```bash
# Remove specific label from issue
gh issue edit 123 \
  --repo hscheema1979/ultra-workspace \
  --remove-label "queue:intake"

# Remove multiple labels
gh issue edit 123 \
  --repo hscheema1979/ultra-workspace \
  --remove-label "phase:0,agent:analyst"
```

### Reset Issue Labels

```bash
# Clear all labels (use carefully)
gh issue edit 123 \
  --repo hscheema1979/ultra-workspace \
  --remove-label "queue:intake,queue:active,queue:review,queue:done,queue:failed,queue:blocked,phase:0,phase:1,phase:2,phase:3,phase:4,phase:5,phase:cleanup"

# Then apply fresh labels
gh issue edit 123 \
  --repo hscheema1979/ultra-workspace \
  --add-label "type:feature,queue:intake"
```

## Automation Scripts

### Label Issue by Type

```bash
#!/bin/bash
# label-issue.sh <issue-number> <type>

ISSUE=$1
TYPE=$2

case $TYPE in
  feature)
    gh issue edit $ISSUE --add-label "type:feature"
    ;;
  bug)
    gh issue edit $ISSUE --add-label "type:bug,priority:high"
    ;;
  security)
    gh issue edit $ISSUE --add-label "type:security,priority:critical"
    ;;
  *)
    echo "Unknown type: $TYPE"
    exit 1
esac
```

### Update Phase

```bash
#!/bin/bash
# update-phase.sh <issue-number> <phase>

ISSUE=$1
PHASE=$2

gh issue edit $ISSUE \
  --remove-label "phase:0,phase:1,phase:2,phase:3,phase:4,phase:5,phase:cleanup" \
  --add-label "phase:$PHASE"
```

### Assign Agent

```bash
#!/bin/bash
# assign-agent.sh <issue-number> <agent-name>

ISSUE=$1
AGENT=$2

gh issue edit $ISSUE \
  --add-label "agent:$AGENT,queue:active"
```

## Best Practices

1. **Always use queue labels** to track status
2. **Set priority labels** for all issues
3. **Use type labels** to categorize work
4. **Update phase labels** as work progresses
5. **Add agent labels** when work starts
6. **Use handoff label** when transferring between agents
7. **Mark dependencies** explicitly
8. **Use epic label** for large work items
9. **Remove completed phase labels** to avoid clutter
10. **Document label transitions** in issue comments

## Troubleshooting

### Labels Not Applying
```bash
# Check label exists
gh label list --repo hscheema1979/ultra-workspace | grep "your-label"

# If missing, re-run setup
cd ~/.claude/plugins/ultrapilot/scripts
./setup-labels.sh
```

### Too Many Labels
```bash
# List all labels on issue
gh issue view 123 \
  --repo hscheema1979/ultra-workspace \
  --json labels \
  --jq '.labels[].name'

# Remove outdated labels
gh issue edit 123 --remove-label "phase:0,phase:1"
```

### Incorrect Colors
```bash
# Re-run setup to fix colors
cd ~/.claude/plugins/ultrapilot/scripts
./setup-labels.sh
```

---

## Quick Reference Card

```
Workflow Labels:
  intake → active → review → done
           ↓         ↓
        failed  blocked

Phase Progression:
  0 → 1 → 2 → 3 → 4 → 5 → cleanup

Agent Assignment:
  agent:<name> + queue:active

Priority Levels:
  critical > high > medium > low

Type Categories:
  feature, bug, design, test, review,
  chore, doc, refactor, performance, security

Special Markers:
  handoff, epic, dependency
```

---

**For more details, see:**
- `README-LABELS.md` - Full documentation
- `LABEL-QUICK-REF.md` - Quick reference guide
