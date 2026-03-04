# GitHub Label Schema Setup

This directory contains scripts to set up the complete GitHub label schema for Ultrapilot repositories.

## Overview

The Ultrapilot label schema consists of **44 labels** organized into 6 categories:

1. **Queue Labels (6)**: Track task status through the workflow
2. **Phase Labels (7)**: Identify which development phase a task is in
3. **Agent Labels (22)**: Tag which specialist agent is working on a task
4. **Type Labels (10)**: Categorize the type of work (feature, bug, test, etc.)
5. **Priority Labels (4)**: Indicate task priority level
6. **Special Labels (3)**: Mark handoffs, epics, and dependencies

## Quick Start

### Option 1: Using the shell script (recommended)

```bash
cd ~/.claude/plugins/ultrapilot/scripts

# Using GITHUB_TOKEN from environment
GITHUB_TOKEN=your_token ./setup-labels.sh

# Pass token directly
./setup-labels.sh your_github_token

# Dry run (see what would happen)
./setup-labels.sh -d
```

### Option 2: Using TypeScript directly

```bash
cd ~/.claude/plugins/ultrapilot

# Install dependencies if needed
npm install

# Run the script
GITHUB_TOKEN=your_token npx tsx scripts/create-labels.ts
```

## Label Categories

### Queue Labels (6)
Status tracking for tasks in the Ultrapilot workflow:

- `queue:intake` (Blue) - New tasks awaiting triage
- `queue:active` (Yellow) - Currently being worked on
- `queue:review` (Orange) - Awaiting review
- `queue:done` (Green) - Successfully completed
- `queue:failed` (Red) - Failed execution
- `queue:blocked` (Gray) - Blocked by dependencies

### Phase Labels (7)
Identify the current development phase:

- `phase:0` through `phase:5` (Purple gradient)
- `phase:cleanup` (Light purple)

Phases correspond to:
- Phase 0: Requirements & Architecture
- Phase 1: Planning & Validation
- Phase 2: Parallel Execution
- Phase 3: QA Cycles
- Phase 4: Multi-perspective Validation
- Phase 5: Evidence Verification
- Cleanup: Finalization

### Agent Labels (22)
Tag which specialist agent is handling the task:

**Core Orchestration:**
- `agent:analyst` - Requirements extraction (Opus)
- `agent:architect` - System architecture (Opus)
- `agent:planner` - Implementation planning (Opus)
- `agent:critic` - Plan validation (Opus)

**Executor Tiers:**
- `agent:executor-low` - Simple tasks (Haiku)
- `agent:executor` - Standard tasks (Sonnet)
- `agent:executor-high` - Complex tasks (Opus)

**Quality & Testing:**
- `agent:test-engineer` - Test strategy (Sonnet)
- `agent:verifier` - Evidence verification (Sonnet)

**Review Agents:**
- `agent:security-reviewer` - Security audit (Sonnet)
- `agent:quality-reviewer` - Performance review (Sonnet)
- `agent:code-reviewer` - Code review (Opus)

**Debugging & Analysis:**
- `agent:debugger` - Root cause analysis (Sonnet)
- `agent:scientist` - Data analysis (Sonnet)

**Support Agents:**
- `agent:build-fixer` - Build issues (Sonnet)
- `agent:designer` - UX/UI design (Sonnet)
- `agent:writer` - Documentation (Haiku)

**Team Agents (Parallel):**
- `agent:team-lead` - Team orchestration (Opus)
- `agent:team-implementer` - Parallel implementation (Sonnet)
- `agent:team-reviewer` - Multi-dimensional review (Sonnet)
- `agent:team-debugger` - Parallel debugging (Sonnet)

All agent labels use Cyan color (#00BCD4)

### Type Labels (10)
Categorize the type of work:

- `type:feature` - New feature
- `type:bug` - Bug fix
- `type:design` - Design work
- `type:test` - Test implementation
- `type:review` - Code review
- `type:chore` - Maintenance task
- `type:doc` - Documentation
- `type:refactor` - Code refactoring
- `type:performance` - Performance optimization
- `type:security` - Security improvement

All type labels use Indigo color (#3F51B5)

### Priority Labels (4)
Indicate task priority:

- `priority:critical` (Red) - Immediate attention
- `priority:high` (Orange) - Urgent
- `priority:medium` (Yellow) - Normal workflow
- `priority:low` (Blue) - Backlog

### Special Labels (3)
Special workflow markers:

- `handoff` (Purple) - Work being handed off
- `epic` (Magenta) - Large work item
- `dependency` (Teal) - Blocked/blocking relationship

## Script Features

The `create-labels.ts` script is:

- **Idempotent**: Safe to run multiple times
- **Smart**: Only creates/updates labels that need changes
- **Resilient**: Handles rate limiting with exponential backoff
- **Verbose**: Logs all operations for transparency
- **Error-handling**: Provides clear error messages

### What the script does:

1. Fetches all existing labels from the repository
2. Compares existing labels with the desired schema
3. Creates missing labels
4. Updates labels if color/description differs
5. Skips labels that are already correct
6. Provides a detailed summary of operations

## Requirements

- Node.js 18+ (for TypeScript execution)
- GitHub Personal Access Token with `repo` scope
- Write access to the target repository

## Creating a GitHub Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate a new token
3. Select the `repo` scope (required for creating labels)
4. Copy the token and use it with the script

## Troubleshooting

### "403 Forbidden" Error
- Verify your token has the `repo` scope
- Ensure you have write access to the repository
- Check that the token hasn't expired

### "Rate Limited" Error
- The script handles rate limiting automatically
- It will retry with exponential backoff
- Just wait for it to complete

### "Repository not found" Error
- Verify the repository name is correct
- Check that you have access to the repository
- Ensure the repository exists

## Verification

After running the script, verify the labels:

1. Visit `https://github.com/hscheema1979/ultra-workspace/labels`
2. Confirm all 44 labels are present
3. Check that colors match the specification
4. Verify descriptions are present

## Integration with Ultrapilot

Once the label schema is set up:

1. Ultrapilot agents will automatically apply labels as they work
2. Labels track progress through development phases
3. Agent labels show who's working on what
4. Queue labels indicate overall workflow status
5. Priority labels help organize work

## Label Assignment Strategy

### Automatic Labeling

Ultrapilot automatically applies labels:

- **Agent labels**: Applied when an agent starts working
- **Phase labels**: Updated as work progresses
- **Queue labels**: Track task status
- **Type labels**: Set based on the task category
- **Priority labels**: Inherited from issue or task

### Manual Labeling

You can manually apply labels to:

- Set priority levels
- Mark dependencies
- Create epics
- Override automatic assignments

## Maintenance

To update label colors or descriptions:

1. Edit the `LABELS` array in `create-labels.ts`
2. Re-run the script (it will update existing labels)
3. The script is idempotent, so it's safe to run multiple times

## Contributing

To add new labels to the schema:

1. Add the label definition to the `LABELS` array
2. Follow the naming convention (category:label-name)
3. Choose an appropriate color
4. Provide a clear description
5. Update this README with the new label count

## License

MIT

---

**Total Labels: 44**
**Last Updated: 2025-03-04**
**Repository: hscheema1979/ultra-workspace**
