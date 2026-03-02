# UltraPilot Architecture - Documentation Complete

**Date**: 2026-03-02
**Status**: ✅ COMPREHENSIVE ARCHITECTURE DOCUMENTED
**Commit**: 4124f1d

---

## What Was Documented

### ULTRAPILOT-ARCHITECTURE.md (1,430 lines)

**Complete architecture reference covering:**

1. **Executive Summary** - UltraPilot as autonomous agency framework
2. **Organizational Hierarchy** - CEO → COO → UltraLead → UltraTeams → UltraWorkers
3. **Domain Structure** - Workspace-as-domain model with .ultra/ directory
4. **Skills Composition** - How ultrapilot → ultra-ralph → ultra-team → ultra-ultrawork compose
5. **Agent Types** - 29 core agents + 113 agents-lib specialists
6. **Autoloop System** - Persistent heartbeat daemon
7. **Communication Flow** - How messages flow through the organization
8. **Scaling Behavior** - Self-scaling from startup to enterprise
9. **Component Relationships** - How all pieces fit together
10. **State Management** - ADDED: State files, schemas, persistence patterns
11. **Agent-to-Agent Communication** - ADDED: 5 communication mechanisms

---

## State Management Section

### State Files

```
.ultra/state/
├── autopilot-state.json       ← ultrapilot execution
├── ralph-state.json            ← ultra-ralph persistence
├── ultraqa-state.json          ← QA cycling
├── validation-state.json      ← Multi-reviewer
├── detailedPlanning-state.json ← Phase 1.5 planning
└── autoloop.json             ← Domain daemon
```

### Key State Schemas

**Autopilot (ultrapilot)**:
- Tracks phases (expansion → planning → execution → qa → validation)
- Agent details (type, model, duration)
- Background tasks

**Ralph (ultra-ralph)**:
- Iteration tracking with max iterations
- Error history for retry logic
- Links to other modes (autopilot, ultrawork, team)

**Domain Autoloop**:
- Process ID tracking
- Cycle count and timing
- Started timestamp

### Session State

Per-session persistence enables **ultra-ralph recovery**:
```
.ultra/state/sessions/{sessionId}/
├── task-state.json
├── iteration-history.json
├── checkpoint-data.json
└── recovery-context.json
```

If a session crashes, ultra-ralph can recover and continue from last checkpoint.

---

## Agent-to-Agent Communication Section

### 5 Communication Mechanisms

#### 1. Shared State Files (Primary)

**Signal generation example:**
```javascript
// Quant analyst writes signals
.ultra/shared/quant-signals.json
{
  "signals": [...],
  "generatedBy": "ultra:quant-analyst-001"
}

// Execution dev reads signals
// Executes trades based on them
```

#### 2. Task Queues (Work Distribution)

```javascript
// Intake → In-Progress → Review → Completed/Failed
queues/intake.json
[
  {
    "id": "task-001",
    "assignedTo": "ultra:team-implementer-001",
    "ownedFiles": ["src/auth/*.ts"]
  }
]
```

#### 3. Event Emission (Real-time)

```typescript
domainManager.on('task:assigned', (taskId, agentId) => {...});
domainManager.on('conflict:detected', (conflict) => {...});
domainManager.on('cycle:complete', (cycleResult) => {...});
```

#### 4. Direct Delegation (Task Tool)

```typescript
Task(
  subagent_type="ultra:team-implementer",
  prompt="Implement auth module",
  run_in_background=true
)
```

#### 5. File Ownership Contracts

```typescript
{
  fileOwnership: {
    ownedPaths: ['src/auth/*'],
    readOnlyPaths: ['src/database/*'],
    transferOnCompletion: true
  }
}
```

### 4 Communication Flows

#### Bottom-up Reporting
```
UltraWorker → State files → Task queues → Events
  → UltraLead reads → Autoloop detects → COO queries
```

#### Top-down Direction
```
YOU → COO (this conversation) → UltraLead
  → UltraTeam (ultra-team skill) → UltraWorkers (ultra-ultrawork)
```

#### Peer-to-Peer
```
UltraWorker-1 writes to .ultra/shared/signals.json
  → UltraWorker-2 reads and acts on signals
```

#### Conflict Resolution
```
Worker-1 tries to acquire file
  → Conflict detected (Worker-2 owns it)
  → Event emitted
  → UltraLead decides priority
  → Ownership transferred
```

### Distributed Tracing

**Trace IDs correlate work across agents:**
```typescript
{
  traceId: "trace-abc-123",
  parentSpanId: "span-xyz-789",
  workflow: "ultra-ralph-cycle-5"
}
```

**Hierarchy:**
```
trace-abc-123 (ultra-ralph cycle)
├── span-001 (quant-analyst delegation)
├── span-002 (risk-manager delegation)
└── span-003 (execution-developer delegation)
```

---

## Key Clarifications

### What UltraPilot IS

✅ **Autonomous agency framework**
✅ **Organizational structure** (CEO → COO → VPs)
✅ **Domain orchestration** on top of Claude Code CLI
✅ **Self-scaling organization** model
✅ **Persistent execution** (ultra-ralph "never-give-up")

### What UltraPilot is NOT

❌ Just a toolset
❌ A task runner
❌ A build system
❌ A workflow automation tool
❌ Cron replacement

### Domain = Functional Area

**NOT just a folder** - a domain is a:
- Functional area (trading, software-dev, personal-assistant)
- Sphere of influence
- Autonomous organizational unit
- Anchored in workspace folder

### UltraLead vs Autoloop

**UltraLead** = Domain Manager (Department Manager)
- Spawns and coordinates UltraTeams
- Reports to COO (current conversation)
- Makes strategic decisions
- ONE per domain

**Autoloop** = Heartbeat Daemon (VP of Operations)
- Continuous 30-60s cycle
- Scans for work
- Executes routine maintenance
- Monitors domain health
- Reports to UltraLead

---

## UltraPilot Organization Chart

```
╔═══════════════════════════════════════════════════════════════╗
║                    ULTRAPILOT AGENCY                          ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  ┌─────────────────────────────────────────────────────────┐     ║
║  │  CEO (YOU - The User)                                   │     ║
║  │  Vision, goals, strategic direction                     │     ║
║  └────────────────────┬────────────────────────────────────┘     ║
║                       │ Direct interface                         ║
║  ┌────────────────────▼────────────────────────────────────┐     ║
║  │  COO (Claude - This Conversation)                        │     ║
║  │  Architecture, resource allocation, spawns UltraLeads     │     ║
║  └────────────────────┬────────────────────────────────────┘     ║
║                       │ Spawns & coordinates                     ║
║  ┌────────────────────▼────────────────────────────────────┐     ║
║  │  UltraLeads (Domain Managers)                          │     ║
║  │  One per domain, each spawns UltraTeams                │     ║
║  │                                                           │     ║
║  │  ┌────────────────────┐  ┌─────────────────────┐       │     ║
║  │  │ Trading Domain    │  │ Software Dev       │       │     ║
║  │  │ UltraLead         │  │ UltraLead          │       │     ║
║  │  └────────────────────┘  └─────────────────────┘       │     ║
║  └────────────────────┬────────────────────────────────────┘     ║
║                       │ Spawns UltraTeams                       ║
║  ┌────────────────────▼────────────────────────────────────┐     ║
║  │  UltraTeams (Sub-teams)                                 │     ║
║  │  Spawned based on workload/complexity                   │     ║
║  │                                                           │     ║
║  │  ┌─────────────────┐  ┌─────────────────┐               │     ║
║  │  │ Quant Team      │  │ Frontend Team   │               │     ║
║  │  │ (UltraTeam)     │  │ (UltraTeam)     │               │     ║
║  └────────────────────┼─────────────────────────────────┘     ║
║                       │ Coordinates UltraWorkers                ║
║  ┌────────────────────▼────────────────────────────────────┐     ║
║  │  UltraWorkers (Senior VP Agents)                        │     ║
║  │  Full autonomy, ultra-ralph persistence, never stop      │     ║
║  │                                                           │     ║
║  │  ┌─────────────────┐  ┌─────────────────┐               │     ║
║  │  │ Quant Analyst   │  │ Risk Manager    │               │     ║
║  │  │ Execution Dev   │  │ Data Engineer   │               │     ║
║  │  │ (ultra:*)        │  │ (ultra:*)        │               │     ║
║  └───────────────────────────────────────────────────────────┘     ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
```

---

## Skills Composition (Complete Stack)

```
ultrapilot (Full pipeline)
  └─ ultra-ralph (Persistence wrapper)
      └─ ultra-team (Coordination)
          └─ ultra-ultrawork (Parallel engine)
              └─ ultra:team-implementer (workers)
```

**Usage examples:**
- Quick parallel task → `ultra-ultrawork`
- Guaranteed completion → `ultra-ralph`
- Full autonomous pipeline → `ultrapilot`
- Domain heartbeat → `ultra-autoloop`

---

## Live Domain Status

### ultra-dev on vps5

**Status**: ✅ RUNNING

```json
{
  "enabled": true,
  "pid": 3485757,
  "startedAt": "2026-03-02T20:27:21.710Z",
  "cycleCount": 36,
  "lastCycle": "2026-03-02T21:03:04.560Z",
  "uptime": ~35 minutes
}
```

**Configuration:**
- Domain: software-dev
- Cycle time: 30 seconds
- Agents: 10 configured (ultra:team-lead, team-implementer, etc.)
- Routines: 5 active (test, lint, dependencies, git-sync, build)

---

## Next Steps

### Completed ✅

1. ✅ Domain agency framework bridge
2. ✅ DomainInitializer & AutoloopDaemon
3. ✅ CLI commands (domain-setup, autoloop)
4. ✅ Workspace-as-domain architecture
5. ✅ Comprehensive architecture documentation
6. ✅ State management documentation
7. ✅ Agent communication documentation
8. ✅ ultra-dev domain deployed and running

### Pending 📋

1. **Test multi-domain operation**
   - Deploy second domain (e.g., trading-at on vps5)
   - Verify both autoloops run independently
   - Test inter-domain communication

2. **Implement COO → UltraLead communication**
   - Current conversation spawns UltraLeads
   - UltraLeads spawn autoloops
   - Continuous reporting back to COO

3. **File ownership testing**
   - Deploy UltraWorkers with file ownership
   - Test conflict detection
   - Verify ownership transfers

4. **Domain splitting**
   - Test domain growth beyond single UltraLead
   - Spawn sub-domains with own autoloops

---

## Summary

**UltraPilot is now fully documented with:**

- **Clear organizational metaphor** (CEO → COO → VPs → Workers)
- **Complete component breakdown** (skills, agents, domains)
- **State management system** (files, schemas, persistence)
- **Agent communication patterns** (5 mechanisms, 4 flows)
- **Live running domain** (ultra-dev on vps5)

**The architecture is clear, complete, and ready for implementation.**

**"The boulder never stops."** 🪨
