# Label Schema Quick Reference

Quick reference for the Ultrapilot GitHub Label Schema (44 labels).

## Label Counts by Category

| Category | Count | Color |
|----------|-------|-------|
| Queue Labels | 6 | Varied |
| Phase Labels | 7 | Purple gradient |
| Agent Labels | 22 | Cyan (#00BCD4) |
| Type Labels | 10 | Indigo (#3F51B5) |
| Priority Labels | 4 | Varied |
| Special Labels | 3 | Varied |
| **TOTAL** | **44** | - |

## Quick Reference Table

### Queue Labels
| Label | Color | Description |
|-------|-------|-------------|
| `queue:intake` | Blue (#0052CC) | New tasks awaiting triage |
| `queue:active` | Yellow (#FFC107) | Currently being worked on |
| `queue:review` | Orange (#FF9800) | Awaiting review |
| `queue:done` | Green (#4CAF50) | Successfully completed |
| `queue:failed` | Red (#F44336) | Failed execution |
| `queue:blocked` | Gray (#9E9E9E) | Blocked by dependencies |

### Phase Labels
| Label | Color | Phase |
|-------|-------|-------|
| `phase:0` | #6200EA | Requirements & Architecture |
| `phase:1` | #7C4DFF | Planning & Validation |
| `phase:2` | #9575CD | Parallel Execution |
| `phase:3` | #B388FF | QA Cycles |
| `phase:4` | #D1C4E9 | Multi-perspective Validation |
| `phase:5` | #EDE7F6 | Evidence Verification |
| `phase:cleanup` | #F3E5F5 | Finalization |

### Agent Labels (All Cyan #00BCD4)

**Core (Opus):**
- `agent:analyst` - Requirements extraction
- `agent:architect` - System architecture
- `agent:planner` - Implementation planning
- `agent:critic` - Plan validation

**Executors:**
- `agent:executor-low` (Haiku) - Simple tasks
- `agent:executor` (Sonnet) - Standard tasks
- `agent:executor-high` (Opus) - Complex tasks

**Quality (Sonnet):**
- `agent:test-engineer` - Test strategy
- `agent:verifier` - Evidence verification

**Review:**
- `agent:security-reviewer` (Sonnet) - Security audit
- `agent:quality-reviewer` (Sonnet) - Performance review
- `agent:code-reviewer` (Opus) - Comprehensive review

**Debug (Sonnet):**
- `agent:debugger` - Root cause analysis
- `agent:scientist` - Data analysis

**Support:**
- `agent:build-fixer` (Sonnet) - Build issues
- `agent:designer` (Sonnet) - UX/UI design
- `agent:writer` (Haiku) - Documentation

**Team (Parallel):**
- `agent:team-lead` (Opus) - Orchestration
- `agent:team-implementer` (Sonnet) - Implementation
- `agent:team-reviewer` (Sonnet) - Review
- `agent:team-debugger` (Sonnet) - Debugging

### Type Labels (All Indigo #3F51B5)

- `type:feature` - New feature
- `type:bug` - Bug fix
- `type:design` - Design work
- `type:test` - Test implementation
- `type:review` - Code review
- `type:chore` - Maintenance
- `type:doc` - Documentation
- `type:refactor` - Refactoring
- `type:performance` - Performance
- `type:security` - Security

### Priority Labels

| Label | Color | Level |
|-------|-------|-------|
| `priority:critical` | Red (#D32F2F) | Immediate |
| `priority:high` | Orange (#F57C00) | Urgent |
| `priority:medium` | Yellow (#FFA000) | Normal |
| `priority:low` | Blue (#1976D2) | Backlog |

### Special Labels

| Label | Color | Purpose |
|-------|-------|---------|
| `handoff` | Purple (#9C27B0) | Work handoff |
| `epic` | Magenta (#E040FB) | Large work item |
| `dependency` | Teal (#009688) | Dependency |

## Common Label Combinations

### New Feature Development
```
type:feature
queue:intake
priority:medium
phase:0
```

### Bug Fix
```
type:bug
queue:active
priority:high
phase:2
agent:debugger
```

### Code Review
```
type:review
queue:review
priority:medium
agent:code-reviewer
```

### Epic Task
```
epic
type:feature
priority:high
phase:1
```

### Security Issue
```
type:security
priority:critical
queue:active
agent:security-reviewer
```

## Label Workflow

```
intake → active → review → done
         ↓         ↓
      failed   blocked
```

### Phase Progression
```
phase:0 → phase:1 → phase:2 → phase:3 → phase:4 → phase:5 → phase:cleanup
```

### Agent Assignment
```
Initial assignment: queue:intake + agent:<agent>
When started: queue:active + agent:<agent> + phase:<N>
When done: queue:done + agent:<agent>
If failed: queue:failed + agent:debugger
```

## Usage Examples

### Creating a new issue with labels
```bash
gh issue create \
  --title "Add user authentication" \
  --body "Implement JWT-based authentication" \
  --label "type:feature,priority:high,phase:0,queue:intake"
```

### Adding labels to existing issue
```bash
gh issue edit 123 \
  --add-label "agent:executor,phase:2,queue:active"
```

### Filtering by labels
```bash
# All active features
gh issue list --label "type:feature,queue:active"

# All critical priority items
gh issue list --label "priority:critical"

# All items in phase 3
gh issue list --label "phase:3"

# All items worked on by debugger
gh issue list --label "agent:debugger"
```

## Label Naming Convention

All labels follow the pattern: `category:value`

- `queue:` - Workflow status
- `phase:` - Development phase
- `agent:` - Specialist agent
- `type:` - Work type
- `priority:` - Priority level
- (no prefix) - Special labels

## Color Coding Summary

| Color | Hex | Usage |
|-------|-----|-------|
| Blue | #0052CC | Queue: Intake |
| Yellow | #FFC107 | Queue: Active / Priority: Medium |
| Orange | #FF9800 | Queue: Review / Priority: High |
| Green | #4CAF50 | Queue: Done |
| Red | #F44336 / #D32F2F | Queue: Failed / Priority: Critical |
| Gray | #9E9E9E | Queue: Blocked |
| Purple | #6200EA - #F3E5F5 | Phases (gradient) |
| Cyan | #00BCD4 | All agents |
| Indigo | #3F51B5 | All types |
| Magenta | #E040FB | Epic |
| Purple | #9C27B0 | Handoff |
| Teal | #009688 | Dependency |

---

**Quick Command:**
```bash
# Setup all labels
GITHUB_TOKEN=your_token ./setup-labels.sh

# Dry run
./setup-labels.sh -d

# Verify labels
gh label list --repo hscheema1979/ultra-workspace
```
