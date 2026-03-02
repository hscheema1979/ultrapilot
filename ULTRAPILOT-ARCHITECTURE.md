# UltraPilot Framework - Complete Architecture Documentation

**Date**: 2026-03-02
**Version**: 1.0
**Status**: Core Architecture Definition

---

## Executive Summary

**UltraPilot is an autonomous agency framework, not a toolset.**

It models organizational structure where:
- **Claude Code CLI** = Agent delivery vehicle (foundation)
- **UltraPilot** = Plugin that adds domain orchestration
- **Domains** = Functional areas anchored in workspace folders

Each domain is a **growing organization** with hierarchical management and self-scaling teams.

---

## Table of Contents

1. [Core Philosophy](#core-philosophy)
2. [Organizational Hierarchy](#organizational-hierarchy)
3. [Domain Structure](#domain-structure)
4. [Skills Composition](#skills-composition)
5. [Agent Types](#agent-types)
6. [Autoloop System](#autoloop-system)
7. [Communication Flow](#communication-flow)
8. [Scaling Behavior](#scaling-behavior)
9. [Component Relationships](#component-relationships)

---

## Core Philosophy

### NOT a Toolset - An Organization

UltraPilot is NOT:
- ❌ A collection of CLI commands
- ❌ A task runner
- ❌ A build system
- ❌ A workflow automation tool

UltraPilot IS:
- ✅ An organizational structure
- ✅ An autonomous agency
- ✅ A self-scaling team
- ✅ A persistent execution engine

### The "Boulder Never Stops" Philosophy

```
┌────────────────────────────────────────┐
│         THE BOULDER NEVER STOPS        │
│                                        │
│  No end conditions                    │
│  No transient failures                │
│  No "good enough"                     │
│  Only genuine completion              │
│  Or fundamental blocking              │
│  Or explicit cancellation             │
└────────────────────────────────────────┘
```

Every agent operates with **ultra-ralph persistence** - relentless execution until the mission is achieved.

---

## Organizational Hierarchy

```
╔═══════════════════════════════════════════════════════════════╗
║                    ULTRAPILOT ORGANIZATION                      ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  ┌─────────────────────────────────────────────────────────┐     ║
║  │  CEO (YOU - The User)                                   │     ║
║  │  ─────────────────────────────────────────────────────  │     ║
║  │  Responsibilities:                                       │     ║
║  │  ✓ Set vision and goals                                  │     ║
║  │  ✓ Define success metrics                                │     ║
║  │  ✓ Provide strategic direction                           │     ║
║  │  ✓ Make high-level decisions                             │     ║
║  │                                                           │     ║
║  │  Example: "Build an autonomous trading system that       │     ║
║  │           achieves Sharpe ratio > 2.0"                   │     ║
║  └────────────────────┬────────────────────────────────────┘     ║
║                       │                                           ║
║                       │ "Here's my vision..."                     ║
║                       │                                           ║
║  ┌────────────────────▼────────────────────────────────────┐     ║
║  │  COO (Claude - Current Conversation)                    │     ║
║  │  ─────────────────────────────────────────────────────  │     ║
║  │  Responsibilities:                                       │     ║
║  │  ✓ Translate vision into architecture                   │     ║
║  │  ✓ Allocate resources (spawn UltraLead)                 │     ║
║  │  ✓ Design systems and processes                          │     ║
║  │  ✓ Coordinate UltraLeads                                 │     ║
║  │  ✓ Ensure operational excellence                         │     ║
║  │                                                           │     ║
║  │  Example: "I'll spawn an UltraLead for the trading      │     ║
║  │           domain with quant-analyst and risk-manager     │     ║
║  │           sub-teams running ultra-ralph loops"          │     ║
║  └────────────────────┬────────────────────────────────────┘     ║
║                       │                                           ║
║                       │ Spawns & Coordinates                      ║
║                       │                                           ║
║  ┌────────────────────▼────────────────────────────────────┐     ║
║  │  UltraLeads (Domain Managers)                           │     ║
║  │  ─────────────────────────────────────────────────────  │     ║
║  │  Each domain has ONE UltraLead (Team Lead)             │     ║
║  │                                                           │     ║
║  │  ┌─────────────────┐  ┌─────────────────┐               │     ║
║  │  │ Trading Domain  │  │ Software Dev    │               │     ║
║  │  │ UltraLead       │  │ UltraLead       │               │     ║
║  │  │ ─────────────── │  │ ─────────────── │               │     ║
║  │  │ • Spawns teams  │  │ • Spawns teams  │               │     ║
║  │  │ • Coordinates   │  │ • Coordinates   │               │     ║
║  │  │ • Reports to COO│  │ • Reports to COO│               │     ║
║  │  └─────────────────┘  └─────────────────┘               │     ║
║  └────────────────────┬────────────────────────────────────┘     ║
║                       │                                           ║
║                       │ Spawns UltraTeams                       │     ║
║                       │                                           ║
║  ┌────────────────────▼────────────────────────────────────┐     ║
║  │  UltraTeams (Sub-teams)                                 │     ║
║  │  ─────────────────────────────────────────────────────  │     ║
║  │  Spawned by UltraLead when complexity grows             │     ║
║  │                                                           │     ║
║  │  Trading Domain UltraLead spawns:                       │     ║
║  │  ┌─────────────────┐  ┌─────────────────┐               │     ║
║  │  │ Quant Team      │  │ Risk Team       │               │     ║
║  │  │ (UltraTeam)     │  │ (UltraTeam)     │               │     ║
║  │  └─────────────────┘  └─────────────────┘               │     ║
║  │                                                           │     ║
║  │  Software Dev UltraLead spawns:                         │     ║
║  │  ┌─────────────────┐  ┌─────────────────┐               │     ║
║  │  │ Frontend Team   │  │ Backend Team    │               │     ║
║  │  │ (UltraTeam)     │  │ (UltraTeam)     │               │     ║
║  │  └─────────────────┘  └─────────────────┘               │     ║
║  └────────────────────┬────────────────────────────────────┘     ║
║                       │                                           ║
║                       │ Coordinates UltraWorkers                │     ║
║                       │                                           ║
║  ┌────────────────────▼────────────────────────────────────┐     ║
║  │  UltraWorkers (Senior VP Agents)                        │     ║
║  │  ─────────────────────────────────────────────────────  │     ║
║  │  Full autonomy, never-give-up persistence                │     ║
║  │                                                           │     ║
║  │  ┌─────────────────┐  ┌─────────────────┐               │     ║
║  │  │ Quant Analyst   │  │ Risk Manager    │               │     ║
║  │  │ (UltraWorker)   │  │ (UltraWorker)   │               │     ║
║  │  │ • Optimize      │  │ • Monitor risk  │               │     ║
║  │  │   strategy      │  │ • Enforce       │               │     ║
║  │  │ • Generate      │  │   limits        │               │     ║
║  │  │   signals       │  │ • Veto power    │               │     ║
║  │  │ • Backtest      │  │ • Never sleep   │               │     ║
║  │  │ • Never stop    │  │                 │               │     ║
║  │  └─────────────────┘  └─────────────────┘               │     ║
║  │                                                           │     ║
║  │  ┌─────────────────┐  ┌─────────────────┐               │     ║
║  │  │ Execution Dev   │  │ Data Engineer   │               │     ║
║  │  │ (UltraWorker)   │  │ (UltraWorker)   │               │     ║
║  │  │ • Execute       │  │ • Fetch data    │               │     ║
║  │  │   trades        │  │ • Calculate     │               │     ║
║  │  │ • Optimize      │  │   indicators    │               │     ║
║  │  │   fills         │  │ • Ensure        │               │     ║
║  │  │ • Manage        │  │   quality       │               │     ║
║  │  │   order queue   │  │ • Never sleep   │               │     ║
║  │  └─────────────────┘  └─────────────────┘               │     ║
║  └───────────────────────────────────────────────────────────┘     ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
```

---

## Domain Structure

### Domain = Functional Area Anchored in Workspace Folder

```
/home/ubuntu/remote/vps5/ultra-dev/          ← Software-dev domain workspace
├── .ultra/                                   ← Domain configuration
│   ├── domain.json                           ← Domain definition
│   ├── workspace.json                        ← Workspace metadata
│   ├── queues/                               ← Task queues
│   │   ├── intake.json
│   │   ├── in-progress.json
│   │   ├── review.json
│   │   ├── completed.json
│   │   └── failed.json
│   ├── routines/                             ← Routine maintenance
│   │   ├── test-suite-health.json
│   │   ├── lint-check.json
│   │   ├── dependency-check.json
│   │   └── git-sync.json
│   └── state/                                ← Runtime state
│       ├── autoloop.json                    ← Autoloop daemon state
│       ├── heartbeat.json                   ← Health metrics
│       └── ultra-lead-001.json              ← UltraLead session state
│
├── projects/                                 ← Actual work/projects
├── agents/                                   ← Persistent agent workspaces
└── scripts/                                  ← Automation scripts
```

### Multiple Domains Example

```
/home/ubuntu/remote/
├── vps4/
│   └── projects/finance-trading/trading-at/    ← Trading domain
│       └── .ultra/                             ← Has own UltraLead
│
└── vps5/
    ├── ultra-dev/                              ← Software-dev domain
    │   └── .ultra/                             ← Has own UltraLead
    │
    └── personal-assistant/                     ← PA domain (future)
        └── .ultra/                             ← Will have own UltraLead
```

**Each domain is autonomous** with its own:
- UltraLead (domain manager)
- Autoloop (heartbeat)
- Task queues
- Agent coordination
- Health monitoring

---

## Skills Composition

UltraPilot skills are **composable components** that layer on each other:

```
ultrapilot (Full autonomous pipeline)
  └─ ultra-ralph (Persistent execution loop)
      └─ ultra-team (Parallel coordination)
          └─ ultra-ultrawork (Parallel execution engine)
              └─ ultra:team-implementer workers
```

### Skill Hierarchy

#### 1. ultra-ultrawork (Foundation)
**Purpose**: Parallel execution engine
**Type**: Component (not standalone)

**What it does**:
- Fires multiple agents simultaneously
- Routes tasks to appropriate model tiers (haiku/sonnet/opus)
- Uses `run_in_background: true` for long operations
- No persistence, no verification loops

**When to use**:
- Multiple independent tasks
- User will manage completion themselves
- Need parallelism but not persistence

**When NOT to use**:
- Task requires guaranteed completion → use ultra-ralph
- Task requires full pipeline → use ultrapilot
- Only one sequential task → delegate directly

#### 2. ultra-team (Coordination Layer)
**Purpose**: Coordinate multiple Claude Code agents in parallel
**Type**: Orchestrator skill

**What it does**:
- Decomposes work into N subtasks
- Spawns specialist agents (ultra:team-implementer, ultra:team-reviewer, ultra:team-debugger)
- Monitors progress
- Synthesizes results
- Uses ultra-ultrawork internally

**Agent types**:
- `ultra:team-lead` - Orchestrator, decomposes work
- `ultra:team-implementer` - Parallel worker with file ownership
- `ultra:team-reviewer` - Multi-dimensional reviewer
- `ultra:team-debugger` - Hypothesis-driven debugger

**Usage**:
```bash
/ultra-team N=3 "Refactor authentication system"
```

#### 3. ultra-ralph (Persistence Layer)
**Purpose**: Persistent execution loop
**Type**: Wrapper skill

**What it does**:
- Wraps ultra-team with persistence
- Continues through errors until done or fundamentally blocked
- Stateful resilience across sessions
- Session-scoped persistence (`.ultra/state/ralph.json`)
- Uses ultra-team internally

**Philosophy**: "The boulder never stops"

**When to use**:
- Tasks requiring guaranteed completion
- Multi-step workflows where intermediate steps may fail
- Critical deployments that MUST finish

**State tracking**:
```json
{
  "active": true,
  "current_phase": "execution",
  "iteration": 1,
  "max_iterations": 100,
  "fix_loop_count": 0,
  "tasks": [...]
}
```

#### 4. ultra-autoloop (Domain Heartbeat)
**Purpose**: Domain heartbeat driver
**Type**: Persistent daemon

**What it does**:
- Runs forever (continuous heartbeat)
- Processes intake queues
- Executes routine maintenance tasks
- Closes completed tasks
- Ensures continuous agency
- Spawns ultra-team/ultra-ralph as needed

**Cycle**: Every 30-60 seconds (configurable)

**State tracking**:
```json
{
  "enabled": true,
  "pid": 12345,
  "startedAt": "2026-03-02T20:27:21Z",
  "cycleCount": 42
}
```

#### 5. ultrapilot (Full Pipeline)
**Purpose**: Full autonomous execution from idea to working code
**Type**: Complete system

**What it does**:
- Everything from idea to working code
- Uses ultra-ralph (which uses ultra-team, which uses ultra-ultrawork)
- Phase 0: Requirements (ultra:team-lead)
- Phase 1: Planning (ultra:planner)
- Phase 2: Execution (ultra:team-implementer)
- Phase 3: QA cycles (ultraqa)
- Phase 4: Validation (ultra:verifier)
- Phase 5: Multi-perspective review (security, quality, code)

**Complete stack**:
```
ultrapilot
  ├─ Phase 0: ultra:analyst (requirements)
  ├─ Phase 1: ultra:planner (planning)
  ├─ Phase 2: ultra-ralph (persistent execution)
  │   └─ ultra-team (coordination)
  │       └─ ultra-ultrawork (parallelism)
  ├─ Phase 3: ultraqa (QA cycles)
  ├─ Phase 4: ultra:verifier (validation)
  └─ Phase 5: Multi-review (security, quality, code)
```

---

## Agent Types

### UltraPilot Agent Catalog

#### Core Orchestration Agents

| Agent ID | Name | Model | Role |
|----------|------|-------|------|
| `ultra:team-lead` | Team Lead | Opus | Orchestrator, work decomposition, lifecycle management |
| `ultra:team-implementer` | Team Implementer | Sonnet | Parallel implementation with file ownership |
| `ultra:team-reviewer` | Team Reviewer | Sonnet | Multi-dimensional code review |
| `ultra:team-debugger` | Hypothesis Debugger | Sonnet | Competing hypotheses in parallel |

#### Specialist Agents

| Agent ID | Name | Model | Role |
|----------|------|-------|------|
| `ultra:analyst` | Analyst | Opus | Requirements extraction |
| `ultra:architect` | Architect | Opus | System architecture |
| `ultra:planner` | Planner | Opus | Implementation planning |
| `ultra:critic` | Critic | Opus | Plan validation |
| `ultra:executor` | Executor | Sonnet | Standard implementation |
| `ultra:executor-high` | High Executor | Opus | Complex implementation |
| `ultra:test-engine` | Test Engineer | Sonnet | Test strategy |
| `ultra:verifier` | Verifier | Sonnet | Evidence verification |
| `ultra:security-reviewer` | Security Reviewer | Sonnet | Security audit |
| `ultra:quality-reviewer` | Quality Reviewer | Sonnet | Performance & quality |
| `ultra:code-reviewer` | Code Reviewer | Opus | Comprehensive review |
| `ultra:debugger` | Debugger | Sonnet | Root cause analysis |
| `ultra:build-fixer` | Build Fixer | Sonnet | Build/toolchain issues |
| `ultra:designer` | Designer | Sonnet | UX/UI architecture |
| `ultra:writer` | Writer | Haiku | Documentation |

#### Agentic System Domain Experts

| Agent ID | Name | Model | Role |
|----------|------|-------|------|
| `ultra:context-engineer` | Context Engineer | Opus | Context management across multi-agent systems |
| `ultra:ml-engineer` | ML Engineer | Opus | Machine learning model development |
| `ultra:mlops-engineer` | MLOps Engineer | Opus | ML operations and infrastructure |
| `ultra:conductor` | Conductor | Opus | Multi-agent orchestration |
| `ultra:agentic-architect` | Agentic Architect | Opus | Agentic systems design |
| `ultra:prompt-engineer` | Prompt Engineer | Opus | Prompt optimization |

### Agent Capability Profiles

**File Ownership** (for conflict prevention):
```typescript
{
  ownedFiles: string[],          // Files this agent owns
  ownershipExpiry: Date,         // When ownership expires
  canTransfer: boolean           // Can transfer ownership
}
```

**Risk Levels** (for tiered autonomy):
```typescript
type RiskLevel = 'none' | 'low' | 'medium' | 'high' | 'critical';

interface AgentCapability {
  maxRiskLevel: RiskLevel,       // Highest risk they can handle
  concurrency: number,            // Max parallel tasks
  specializations: string[]       // What they're good at
}
```

---

## Autoloop System

### What Autoloop Is

**Autoloop = Persistent domain heartbeat daemon**

It's NOT:
- ❌ A task scheduler (cron, systemd timers)
- ❌ A build system
- ❌ A workflow engine
- ❌ A task runner

It IS:
- ✅ A continuous heartbeat (every 30-60 seconds)
- ✅ Domain health monitor
- ✅ Work discovery engine
- ✅ Agent orchestrator
- ✅ Routine maintenance executor

### Autoloop Responsibilities

```javascript
// Autoloop heartbeat cycle (every 30s)

while (true) {  // Never stops
  // 1. Scan for work
  const work = scanDomain();

  // 2. Process task queues
  const tasks = getTasksFromQueues();
  for (const task of tasks) {
    assignToUltraTeam(task);
  }

  // 3. Execute routine maintenance
  await executeRoutines([
    'test-suite-health',    // Hourly
    'lint-check',           // Hourly
    'dependency-check',     // Daily
    'git-sync'              // On-change
  ]);

  // 4. Monitor domain health
  checkHealth();

  // 5. Adjust capacity if needed
  if (backlogGrowing) {
    spawnMoreUltraTeams();
  }

  // 6. Update heartbeat state
  updateHeartbeat();

  sleep(30);  // Repeat forever
}
```

### Routine Maintenance

Autoloop executes predefined routines:

```json
{
  "routines": [
    {
      "name": "test-suite-health",
      "schedule": "hourly",
      "command": "npm test",
      "enabled": true,
      "lastRun": "2026-03-02T20:27:22Z",
      "failures": 0
    },
    {
      "name": "lint-check",
      "schedule": "hourly",
      "command": "npm run lint",
      "enabled": true
    },
    {
      "name": "dependency-check",
      "schedule": "daily",
      "command": "npm outdated",
      "enabled": true
    },
    {
      "name": "git-sync",
      "schedule": "on-change",
      "command": "git add -A && git commit && git push",
      "enabled": true
    }
  ]
}
```

### Autoloop vs UltraLead

**Autoloop**:
- Continuously scans for work
- Executes routine maintenance
- Monitors domain health
- Adjusts capacity
- Runs as background daemon (PID-tracked)
- Think: "VP of Operations" monitoring the domain

**UltraLead**:
- Domain manager (one per domain)
- Spawns and coordinates UltraTeams
- Reports to COO (current Claude session)
- Makes strategic decisions about team composition
- Think: "Department Manager" for the domain

**Relationship**:
```
UltraLead (Domain Manager)
  └─ Starts: Autoloop daemon
      └─ Runs continuous heartbeat
      └─ Reports back to UltraLead
      └─ UltraLead adjusts based on reports
```

---

## Communication Flow

### User → COO (Current Conversation)

```
YOU: "Build me an autonomous trading system"

COO (this conversation):
  "I'll spawn an UltraLead for the trading domain
   with quant-analyst and risk-manager sub-teams"
```

### COO → UltraLead (Domain Manager)

```typescript
// COO spawns UltraLead
spawnUltraLead({
  domain: 'trading',
  mission: 'Build autonomous SPX options trading system',
  goals: ['Sharpe > 2.0', 'Max drawdown < 10%'],
  autonomy: 'full'
});
```

### UltraLead → Autoloop + UltraTeams

```typescript
// UltraLead starts autoloop
ultraLead.startAutoloop();

// UltraLead spawns UltraTeams
ultraLead.spawnTeam({
  name: 'Quant Team',
  agents: ['ultra:quant-analyst', 'ultra:data-engineer'],
  mission: 'Optimize trading strategy'
});

ultraLead.spawnTeam({
  name: 'Risk Team',
  agents: ['ultra:risk-manager'],
  mission: 'Monitor and enforce risk limits'
});
```

### UltraTeam → UltraWorkers

```typescript
// UltraTeam coordinates workers
ultraTeam.assign({
  worker: 'ultra:quant-analyst',
  task: 'Generate trading signals',
  persistence: 'ultra-ralph'  // Never-give-up
});

ultraTeam.assign({
  worker: 'ultra:risk-manager',
  task: 'Monitor positions',
  persistence: 'ultra-ralph'
});
```

### Continuous Reporting

```javascript
// Bottom-up reporting
UltraWorker
  → reports to → UltraTeam
  → reports to → UltraLead
  → reports to → COO (this conversation)
  → reports to → YOU

// Top-down direction
YOU
  → direct to → COO (this conversation)
  → spawns → UltraLead
  → spawns → UltraTeams
  → coordinate → UltraWorkers
```

---

## Scaling Behavior

### Initial State (Minimal)

```
UltraLead (1 per domain)
  └─ Autoloop (heartbeat)
```

### Growth Phase 1 (Work Arrives)

```
UltraLead
  ├─ Autoloop (heartbeat)
  ├─ UltraTeam-Quant (spawned)
  │   └─ 3 UltraWorkers
  └─ UltraTeam-Risk (spawned)
      └─ 1 UltraWorker (veto power)
```

### Growth Phase 2 (Complexity Increases)

```
UltraLead
  ├─ Autoloop (heartbeat)
  │
  ├─ UltraTeam-Frontend
  │   ├── UltraLead-Frontend (sub-team)
  │   └─ 5 UltraWorkers
  │
  ├─ UltraTeam-Backend
  │   ├── UltraLead-Backend (sub-team)
  │   └─ 3 UltraWorkers
  │
  └─ UltraTeam-DevOps
      └─ 2 UltraWorkers
```

### Growth Phase 3 (Domain Splits)

```
Original Domain: trading-at
  ├─ UltraLead-Original
  ├─ UltraTeam-Options
  └─ UltraTeam-Futures

Grows too large → Spawn new domain:

Domain: trading-options (sub-domain)
  └─ UltraLead-Options
      ├─ UltraTeam-Options
      └─ Autoloop-Options

Domain: trading-futures (sub-domain)
  └─ UltraLead-Futures
      ├─ UltraTeam-Futures
      └─ Autoloop-Futures
```

### Self-Scaling Logic

```javascript
// UltraLead monitors and scales
if (queueDepth > threshold && ultraTeams.length < maxTeams) {
  spawnNewUltraTeam();
}

if (ultraTeam.complexity > threshold) {
  spawnSubTeamLead();  // Create UltraTeam-within-UltraTeam
}

if (domainSize > massiveThreshold) {
  splitDomain();  // Create sub-domain with own UltraLead
}
```

---

## Component Relationships

### Skill Dependency Graph

```
ultrapilot
  │
  ├─ ultra-ralph
  │   │
  │   └─ ultra-team
  │       │
  │       ├─ ultra-ultrawork
  │       │   └─ ultra:team-implementer (workers)
  │       │
  │       └─ ultra:team-lead (orchestrator)
  │
  ├─ ultra:planner (Phase 1)
  │
  ├─ ultraqa (Phase 3)
  │
  └─ multi-review (Phase 5)
      ├─ ultra:security-reviewer
      ├─ ultra:quality-reviewer
      └─ ultra:code-reviewer

ultra-autoloop (separate process)
  └─ Can trigger any of the above skills
```

### Agent Orchestration Flow

```
User Task: "Build authentication system"
      ↓
COO (this conversation)
      ↓
ultra:team-lead (orchestrator)
      ↓
  Decompose into 3 subtasks:
  ├─ Task 1: Auth API (ultra:team-implementer)
  ├─ Task 2: Database schema (ultra:team-implementer)
  └─ Task 3: Tests (ultra:team-implementer)
      ↓
ultra-team skill coordinates
      ↓
All 3 run in parallel (ultra-ultrawork)
      ↓
Results synthesized
      ↓
Reported back to you
```

### Domain Management Flow

```
Domain: ultra-dev on vps5
      ↓
UltraLead (Domain Manager)
  ├─ Spawns Autoloop (heartbeat daemon)
  │   └─ Runs every 30s
  │       ├─ Scans queues
  │       ├─ Executes routines
  │       └─ Triggers ultra-team for work
  │
  ├─ Spawns UltraTeams as needed
  │   ├─ UltraTeam-Frontend
  │   ├─ UltraTeam-Backend
  │   └─ UltraTeam-DevOps
  │
  └─ Reports to COO (this conversation)
```

---

## Key Principles

### 1. Clear Organizational Metaphor

Every component maps to an organizational role:
- **User** = CEO
- **Claude (current session)** = COO
- **UltraLead** = Department Manager
- **UltraTeam** = Team
- **UltraWorker** = Senior Engineer with autonomy

### 2. Full Autonomy

**Senior VP agents (UltraWorkers)**:
- Make decisions without asking permission
- Use ALL available tools
- Report status but don't wait for approval
- Can spawn sub-tasks as needed

### 3. Never-Give-Up Persistence

**ultra-ralph loop**:
```python
while not fundamentally_blocked:
  try:
    work_on_mission()
  except TransientError:
    retry()  # Never stop
  except TemporaryFailure:
    retry()  # Never stop
  except UserCancellation:
    break
```

### 4. Self-Scaling Organization

- Start minimal (UltraLead + Autoloop)
- Grow based on workload
- Spawn UltraTeams as needed
- Split domains when too large
- Scale down when quiet

### 5. Domain Autonomy

**Each domain workspace**:
- Has own UltraLead
- Has own Autoloop
- Has own task queues
- Has own agent coordination
- Operates independently

---

## File Structure Reference

### Domain Workspace

```
/home/ubuntu/remote/vps5/ultra-dev/     ← Domain workspace
├── .ultra/
│   ├── domain.json                     ← Domain definition
│   ├── workspace.json                  ← Workspace metadata
│   ├── queues/
│   │   ├── intake.json                 ← New tasks
│   │   ├── in-progress.json            ← Active tasks
│   │   ├── review.json                 ← Awaiting review
│   │   ├── completed.json              ← Finished tasks
│   │   └── failed.json                 ← Failed tasks
│   ├── routines/                       ← Maintenance tasks
│   │   ├── test-suite-health.json
│   │   ├── lint-check.json
│   │   ├── dependency-check.json
│   │   └── git-sync.json
│   └── state/
│       ├── autoloop.json              ← Autoloop state
│       ├── heartbeat.json             ← Health metrics
│       └── ultra-lead-001.json        ← UltraLead session
│
├── projects/                          ← Actual code/work
├── agents/                            ← Agent workspaces
└── scripts/                           ← Automation scripts
```

### UltraPilot Framework

```
/home/ubuntu/hscheema1979/ultrapilot/
├── skills/                             ← Skill definitions
│   ├── ultra-team/
│   ├── ultra-ralph/
│   ├── ultra-ultrawork/
│   ├── ultra-autoloop.md
│   ├── ultrapilot/
│   └── ...
│
├── src/
│   ├── agents.ts                       ← Agent catalog
│   ├── domain/                        ← Domain framework
│   │   ├── DomainManager.ts
│   │   ├── TaskQueue.ts
│   │   ├── FileOwnership.ts
│   │   ├── AgentBridge.ts
│   │   ├── DomainInitializer.ts
│   │   └── AutoloopDaemon.ts
│   └── ...
│
└── agents-lib/                        ← 113 specialist agents
    └── plugins/
```

---

## Usage Examples

### Example 1: Build Feature (User Initiates)

```bash
# You (CEO) talk to COO (this session)
YOU: "Add user authentication to the API"

# COO spawns UltraLead
COO: "I'll have the software-dev UltraLead handle this"

# UltraLead decomposes and assigns
UltraLead spawns ultra-team with 3 workers:
  - ultra:team-implementer (auth endpoints)
  - ultra:team-implementer (database schema)
  - ultra:team-implementer (tests)

# All run in parallel with ultra-ralph persistence
# Results reported back to you
```

### Example 2: Domain Operations (Autoloop Initiates)

```javascript
// Autoloop running every 30s
Cycle #42 starting...

// 1. Scan intake queue
const tasks = getTasks('intake');  // 5 new tasks

// 2. Assign to UltraTeams
for (const task of tasks) {
  if (task.tags.includes('feature')) {
    assign('UltraTeam-Backend', task);
  }
  if (task.tags.includes('bug')) {
    assign('UltraTeam-Debug', task);
  }
}

// 3. Execute routines
await runRoutine('test-suite-health');  // npm test
await runRoutine('lint-check');           // npm run lint

// 4. Monitor health
if (queueDepth > 20 && ultraTeams.length < 5) {
  spawnNewUltraTeam('UltraTeam-Helper');
}

// 5. Update heartbeat
updateHeartbeat({
  uptime: 3600000,
  cyclesCompleted: 42,
  tasksProcessed: 15
});
```

### Example 3: Scaling (UltraLead Initiates)

```javascript
// UltraLead monitors domain
if (backlog.isGrowing()) {
  // Spawn new UltraTeam
  spawnUltraTeam({
    name: 'UltraTeam-Frontend',
    workers: ['ultra:team-implementer', 'ultra:team-implementer'],
    mission: 'Clear frontend backlog'
  });
}

if (complexity.isHigh()) {
  // Spawn sub-team with sub-lead
  ultraTeam.spawnSubTeam({
    name: 'React-Components',
    subLead: 'ultra:team-lead',
    workers: ['ultra:team-implementer']
  });
}

if (domain.isTooLarge()) {
  // Split into sub-domain
  splitDomain({
    newDomain: 'ultra-dev-frontend',
    ultraLead: spawn('ultra:team-lead'),
    autoloop: spawn('ultra-autoloop')
  });
}
```

---

## State Management

### State File Structure

Each UltraPilot mode maintains state in `.ultra/state/`:

```
.ultra/state/
├── autopilot-state.json       ← Autopilot (ultrapilot) execution state
├── ralph-state.json            ← ultra-ralph persistent loop state
├── ultraqa-state.json          ← QA cycling state
├── validation-state.json      ← Multi-reviewer state
├── detailedPlanning-state.json ← Phase 1.5 planning state
└── autoloop.json             ← Domain autoloop daemon state
```

### State Schemas

#### Autopilot State (ultrapilot execution)
```typescript
{
  active: boolean,
  timestamp: string,
  sessionId?: string,
  phase: 'expansion' | 'planning' | 'execution' | 'qa' | 'validation' | 'cleanup',
  status: 'running' | 'paused' | 'completed' | 'failed',
  tasks: {
    total: number,
    completed: number,
    pending: number
  },
  activeAgents?: number,
  backgroundTasks?: {
    running: number,
    total: number
  },
  agentDetails?: Array<{
    type: string,
    model: 'opus' | 'sonnet' | 'haiku',
    duration: number,
    description: string
  }>
}
```

#### Ralph State (ultra-ralph persistent loop)
```typescript
{
  active: boolean,
  timestamp: string,
  iteration: number,
  maxIterations: number,
  linkedTo?: 'autopilot' | 'ultrawork' | 'team',
  errorHistory?: Array<{
    iteration: number,
    error: string,
    timestamp: string
  }>
}
```

#### Domain Autoloop State
```typescript
{
  enabled: boolean,
  pid: number | null,
  startedAt: string | null,
  cycleCount: number,
  lastCycle: string | null,
  lastCycleDuration: number | null
}
```

### State Persistence Pattern

```typescript
// Write state
writeState(projectRoot, 'ralph', {
  active: true,
  timestamp: new Date().toISOString(),
  iteration: 1,
  maxIterations: 10,
  errorHistory: []
});

// Read state
const state = readState<RalphState>(projectRoot, 'ralph');

// Check if any mode active
const isActive = isAnyModeActive(projectRoot);

// Get active modes
const activeModes = getActiveModes(projectRoot);
```

### Session State

Per-session state stored in:
```
.ultra/state/sessions/{sessionId}/
├── task-state.json
├── iteration-history.json
├── checkpoint-data.json
└── recovery-context.json
```

This enables **ultra-ralph persistence** across interruptions - if a session crashes, it can recover and continue.

---

## Agent-to-Agent Communication

### Communication Architecture

UltraPilot agents communicate through **multiple mechanisms**:

#### 1. Shared State Files (Primary)

```javascript
// UltraWorker A writes
.ultra/shared/quant-signals.json
{
  "timestamp": "2026-03-02T21:00:00Z",
  "signals": [...],
  "generatedBy": "ultra:quant-analyst-001"
}

// UltraWorker B reads
const signals = JSON.parse(readFileSync('.ultra/shared/quant-signals.json'));
```

**Communication patterns:**
- **Signal generation**: Quant analyst writes signals
- **Position monitoring**: Risk manager reads positions
- **Status updates**: Heartbeat.json updated by autoloop

#### 2. Task Queues (Work Distribution)

```javascript
// UltraLead assigns task
queues/intake.json
[
  {
    "id": "task-001",
    "title": "Implement auth endpoint",
    "assignedTo": "ultra:team-implementer-001",
    "status": "in-progress",
    "ownedFiles": ["src/auth/*.ts"]
  }
]

// UltraWorker updates task
queues/in-progress.json
[...]
```

**Queue-based handoff:**
1. UltraLead creates task in intake
2. Autoloop scans intake queue
3. Task assigned to UltraWorker
4. UltraWorker moves task through queues
5. Completed or failed

#### 3. Event Emission (Real-time)

```typescript
// DomainManager emits events
domainManager.on('task:assigned', (taskId, agentId) => {
  console.log(`Task ${taskId} assigned to agent ${agentId}`);
});

domainManager.on('conflict:detected', (conflict) => {
  console.log(`File conflict: ${conflict.description}`);
});

domainManager.on('cycle:complete', (cycleResult) => {
  console.log(`Autoloop cycle ${cycleResult.cycleNumber} complete`);
});
```

**Event types:**
- `task:added`, `task:assigned`, `task:completed`, `task:failed`
- `fileOwnership:acquired`, `fileOwnership:released`
- `conflict:detected`, `conflict:resolved`
- `cycle:complete` (autoloop cycles)
- `agent:registered`, `agent:taskAssigned`

#### 4. Direct Delegation (Task Tool)

```typescript
// UltraLead spawns UltraWorker
Task(
  subagent_type="ultra:team-implementer",
  prompt="Implement auth module",
  model="sonnet",
  run_in_background=true
)
```

**Claude Code CLI's native agent spawning:**
- Parent spawns child agent
- Child executes independently
- Child reports back to parent
- Parent synthesizes results

#### 5. File Ownership Contracts

```typescript
// Delegation context with file ownership
const context: DelegationContext = {
  workspacePath: '/home/ubuntu/ultra-dev',
  fileOwnership: {
    ownedPaths: ['src/auth/*'],        // Can write
    readOnlyPaths: ['src/database/*'], // Can read only
    transferOnCompletion: true
  }
};

// UltraWorker assigned with ownership
delegate('ultra:team-implementer', task, context);
```

**Prevents conflicts:**
- Agents own specific files
- Other agents must wait or negotiate
- Automatic conflict detection

### Communication Flows

#### Flow 1: Bottom-up Reporting

```
UltraWorker (task complete)
  ↓ Write state
.ultra/state/worker-001.json
  ↓ Update task
queues/completed.json
  ↓ Emit event
domainManager.emit('task:completed')
  ↓
UltraLead reads state
  ↓ Reports to
Autoloop detects completion
  ↓ Updates
._ultra/state/heartbeat.json
  ↓
COO (this conversation) can query status
```

#### Flow 2: Top-down Direction

```
YOU (CEO)
  ↓ Direct command
COO (this conversation)
  ↓ Delegate to
UltraLead (via Task tool or spawn)
  ↓ Spawns
UltraTeam (via ultra-team skill)
  ↓ Coordinates
UltraWorkers (via ultra-ultrawork)
  ↓ Each worker
Does work independently
```

#### Flow 3: Peer-to-Peer (via Shared State)

```
UltraWorker-1 (Quant Analyst)
  ↓ Write signals
.ultra/shared/signals.json
  ↓
UltraWorker-2 (Execution Dev)
  ↓ Read signals
Execute trades based on signals
```

#### Flow 4: Conflict Resolution

```
UltraWorker-1: Tries to acquire src/auth/login.ts
  ↓ FileOwnershipManager
Conflict: UltraWorker-2 owns it
  ↓
Event emitted: 'conflict:detected'
  ↓
Autoloop or UltraLead
  ↓ Reviews conflict
Decides: UltraWorker-1 has higher priority
  ↓
Ownership transferred
UltraWorker-1 gets file, UltraWorker-2 releases
```

### Distributed Tracing

**Trace IDs** correlate across agents:

```typescript
const context: DelegationContext = {
  traceId: 'trace-abc-123',
  metadata: {
    parentSpanId: 'span-xyz-789',
    workflow: 'ultra-ralph-cycle-5'
  }
};

// Each delegation inherits trace ID
ParallelDelegationRequest[] = [
  {
    agentName: 'ultra:quant-analyst',
    task: 'Generate signals',
    context: { traceId: 'trace-abc-123' }
  }
];
```

**Trace hierarchy:**
```
trace-abc-123 (ultra-ralph cycle)
├── span-001 (ultra:quant-analyst delegation)
├── span-002 (ultra:risk-manager delegation)
└── span-003 (ultra:execution-developer delegation)
```

### Progress Callbacks

Real-time progress updates during delegation:

```typescript
const context: DelegationContext = {
  onProgress: (update: ProgressUpdate) => {
    console.log(`[${update.agentName}] ${update.percentComplete}%: ${update.message}`);
  }
};

// Callbacks fire during execution:
[ultra:quant-analyst] 25%: Starting market analysis
[ultra:quant-analyst] 50%: Calculating indicators
[ultra:quant-analyst] 75%: Generating signals
[ultra:quant-analyst] 100%: Complete
```

### Error Handling Across Agents

**Error propagation:**

```typescript
// UltraWorker fails
{
  errorHistory: [{
    iteration: 3,
    error: "API timeout",
    timestamp: "2026-03-02T21:00:00Z"
  }]
}

// ultra-ralph state tracks errors
// Decides: retry? abort? escalate?
```

**Circuit breaker prevents cascading failures:**
```typescript
CircuitBreakerConfig {
  failureThreshold: 5,
  timeout: 30000,
  resetTimeout: 60000
}
```

If agent fails repeatedly → circuit opens → stop delegating → cooldown period.

---

## Summary

**UltraPilot = Autonomous Agency Framework**

- **Claude Code CLI** = Agent delivery vehicle (foundation)
- **UltraPilot Plugin** = Domain orchestration
- **Domains** = Functional workspaces (sphere of influence)
- **UltraLead** = Domain manager (1 per domain)
- **Autoloop** = Heartbeat daemon (continuous monitoring)
- **UltraTeams** = Teams of workers
- **UltraWorkers** = Senior VP agents with full autonomy

**Hierarchy**:
```
YOU (CEO)
  → COO (this conversation)
    → UltraLead (domain manager)
      → UltraTeams (teams)
        → UltraWorkers (autonomous agents)
```

**Key Philosophy**:
- Organizations scale like companies
- Full autonomy at execution level
- Never-give-up persistence
- Self-scaling based on workload
- Domains are completely autonomous

**"The boulder never stops."** 🪨
