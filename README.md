# Ultrapilot - Universal Development Workflow

**The ONE plugin you need.**

Ultrapilot is a unified development workflow plugin that combines the best of:
- **OMC** (oh-my-claudecode) - Agent orchestration and state management
- **Superpowers** - Phased development workflows
- **Wshobson's Agents** - Parallel execution with file ownership

## The One Command

```bash
/ultrapilot <what you want to build>
```

That's it. One command handles everything:
- ✅ Requirements expansion
- ✅ Architecture design
- ✅ Implementation planning
- ✅ Parallel development with file ownership
- ✅ QA cycles (build, test, fix, repeat)
- ✅ Multi-perspective validation (security, quality, performance)
- ✅ Evidence-backed verification

## Installation

```bash
# Via npm (when published)
npm install -g ultrapilot

# Or use as a local plugin
cp -r ~/.claude/plugins/ultrapilot ~/.claude/plugins/cache/ultrapilot
```

## Configuration

Add to `~/.claude/settings.json`:

```json
{
  "enabledPlugins": {
    "ultrapilot@local": true
  },
  "statusLine": {
    "type": "command",
    "command": "node ~/.claude/plugins/ultrapilot/cli/hud.mjs"
  }
}
```

## Plugin Structure

```
ultrapilot/
├── src/
│   ├── agents.ts      # Agent catalog (20+ specialist agents)
│   ├── state.ts       # State management system
│   ├── hud.ts         # HUD renderer
│   └── index.ts       # Main exports
├── cli/
│   └── hud.mjs        # Statusline CLI entry point
├── skills/            # Skill definitions (copied to ~/.claude/skills/)
└── package.json
```

## Agent Catalog

### Core Orchestration
- `ultra:analyst` - Requirements extraction
- `ultra:architect` - System architecture
- `ultra:planner` - Implementation planning
- `ultra:critic` - Plan validation

### Implementation (Tiered)
- `ultra:executor-low` (Haiku) - Simple tasks
- `ultra:executor` (Sonnet) - Standard tasks
- `ultra:executor-high` (Opus) - Complex tasks

### Quality & Testing
- `ultra:test-engineer` - Test strategy
- `ultra:verifier` - Evidence verification
- `ultra:security-reviewer` - Security audit
- `ultra:quality-reviewer` - Performance & maintainability
- `ultra:code-reviewer` - Comprehensive review

### Debugging & Analysis
- `ultra:debugger` - Root-cause analysis
- `ultra:scientist` - Data analysis

### Support
- `ultra:build-fixer` - Build/toolchain issues
- `ultra:designer` - UX/UI architecture
- `ultra:writer` - Documentation
- `ultra:document-specialist` - External docs lookup

### Wshobson-Inspired Parallel Agents
- `ultra:team-lead` - Team orchestration
- `ultra:team-implementer` - Parallel implementation with file ownership
- `ultra:team-reviewer` - Multi-dimensional review
- `ultra:team-debugger` - Hypothesis-driven debugging

## Available Commands

| Command | Description |
|---------|-------------|
| `/ultrapilot <task>` | Main command - autonomous development |
| `/ultra-team N=3 <task>` | Spawn 3 parallel agents |
| `/ultra-ralph <task>` | Persistent execution loop |
| `/ultra-review <code>` | Multi-dimensional review |
| `/ultra-hud` | Configure HUD |
| `/ultra-cancel` | Cancel active mode |

## State Management

All state lives under `.ultra/`:
- `.ultra/state/autopilot-state.json` - Current phase, status
- `.ultra/state/ralph-state.json` - Loop iteration, errors
- `.ultra/state/ultraqa-state.json` - QA cycle state
- `.ultra/state/validation-state.json` - Reviewer status
- `.ultra/spec.md` - Requirements & architecture
- `.ultra/plan.md` - Implementation plan

## HUD Display

Real-time statusline showing:

**Focused** (default):
```
[ULTRA] EXEC | ralph:3/10 | qa:2/5 | running | ctx:67% | tasks:5/12 | agents:3 | bg:2/5
```

**Full** (with agent details):
```
[ULTRA] EXEC | ralph:3/10 | qa:2/5 | running | ctx:[████░░]67% | tasks:5/12
├─ s executor    2m   implementing authentication module
├─ h designer    45s   creating UI mockups
└─ O verifier    1m   running test suite
```

## Phases

### Phase 0 - Expansion
1. ultra:analyst extracts requirements
2. ultra:architect creates technical specification
Output: `.ultra/spec.md`

### Phase 1 - Planning
1. ultra:planner creates implementation plan
2. ultra:critic validates plan
Output: `.ultra/plan.md`

### Phase 2 - Execution
Spawn parallel executors with file ownership:
- agent-1: auth/, middleware/, utils/auth.js
- agent-2: tasks/, models/, controllers/tasks.js
- agent-3: routes/, api/, controllers/api.js

### Phase 3 - QA
Cycle up to 5 times:
1. Build → Lint → Test
2. Fix failures
3. Repeat

### Phase 4 - Validation
Parallel reviewers:
- ultra:security-reviewer
- ultra:quality-reviewer
- ultra:code-reviewer

### Phase 5 - Verification
- ultra:verifier confirms completion with evidence
- Tests passing? ✓
- Build successful? ✓
- All reviewers approved? ✓

## Configuration

`~/.claude/settings.json`:
```json
{
  "ultra": {
    "autopilot": {
      "maxIterations": 10,
      "maxQaCycles": 5,
      "maxValidationRounds": 3,
      "pauseAfterExpansion": false,
      "pauseAfterPlanning": false,
      "skipQa": false,
      "skipValidation": false,
      "fileOwnership": true,
      "parallelExecution": true
    }
  }
}
```

## License

MIT

## Credits

Combines the best of:
- [oh-my-claudecode](https://github.com/oh-my-claudecode) - Agent orchestration
- Superpowers patterns - Phased development workflows
- Wshobson's agents - Parallel execution with file ownership
