# GitHubAgentOrchestrator Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     GitHubAgentOrchestrator                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │              File Ownership Registry                         ││
│  │                                                              ││
│  │  ┌─────────────────────────────────────────────────────┐   ││
│  │  │           In-Memory Cache (30s TTL)                 │   ││
│  │  │                                                      │   ││
│  │  │  {                                                   │   ││
│  │  │    "/src/file1.ts": "agent-001",                     │   ││
│  │  │    "/src/file2.ts": "agent-002",                     │   ││
│  │  │    "/src/file3.ts": "agent-001"                      │   ││
│  │  │  }                                                   │   ││
│  │  └─────────────────────────────────────────────────────┘   ││
│  │                          ↕                                  ││
│  │  ┌─────────────────────────────────────────────────────┐   ││
│  │  │    GitHub Issue (YAML Frontmatter)                  │   ││
│  │  │                                                      │   ││
│  │  │    ---                                               │   ││
│  │  │    type: file_ownership                             │   ││
│  │  │    version: 1                                       │   ││
│  │  │    ---                                               │   ││
│  │  │    /src/file1.ts: agent-001                         │   ││
│  │  │    /src/file2.ts: agent-002                         │   ││
│  │  └─────────────────────────────────────────────────────┘   ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │              Parallel Execution Manager                      ││
│  │                                                              ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      ││
│  │  │   Agent 1    │  │   Agent 2    │  │   Agent 3    │      ││
│  │  │              │  │              │  │              │      ││
│  │  │  Task: auth  │  │  Task: db    │  │  Task: api   │      ││
│  │  │  Files:      │  │  Files:      │  │  Files:      │      ││
│  │  │  - auth.ts   │  │  - user.ts   │  │  - api.ts    │      ││
│  │  │  - mw.ts     │  │  - post.ts   │  │  - ctrl.ts   │      ││
│  │  └──────────────┘  └──────────────┘  └──────────────┘      ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │              Active Agent Tracking                           ││
│  │                                                              ││
│  │  Map<agentId, ActiveAgent>                                   ││
│  │                                                              ││
│  │  {                                                           ││
│  │    "agent-timestamp-id": {                                   ││
│  │      id: "agent-timestamp-id",                               ││
│  │      taskId: "task-1",                                       ││
│  │      startTime: 1234567890,                                  ││
│  │      timeout: 300000                                         ││
│  │    }                                                         ││
│  │  }                                                           ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                      GitHub Service Layer                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  GitHubService│  │State Adapter │  │Queue Adapter │          │
│  │              │  │              │  │              │          │
│  │  - Issues    │  │  - State     │  │  - Tasks     │          │
│  │  - API       │  │  - Persist   │  │  - Queue     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                         GitHub API                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  • Issues (ownership tracking)                                   │
│  • State (workflow state)                                        │
│  • Tasks (task queue)                                            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### File Claim Flow

```
Agent A                          Orchestrator                    GitHub
   │                                 │                            │
   ├── claimFile("file.ts") ────────>│                            │
   │                                 │                            │
   │                                 ├── Check cache ────────────>│
   │                                 │                            │
   │                                 │<── Ownership data ─────────┤
   │                                 │                            │
   │                                 ├── Is file owned?           │
   │                                 │                            │
   │                                 ├── No → Update cache        │
   │                                 │        Schedule persist    │
   │                                 │                            │
   │<────── true ────────────────────┤                            │
   │                                 │                            │
   │                            [5 seconds later]                 │
   │                                 │                            │
   │                                 ├── Persist changes ────────>│
   │                                 │                            │
```

### Parallel Execution Flow

```
Tasks: [A, B, C, D, E]
Max Parallel: 2

Time →
│
├─ A ────────────────────┐
│                        │
├─ B ─────────────┐      │
│                  │      │
│                  ├─ C ──┘
│                  │
└──────────────────┴─ D ────┐
                           │
                           ├─ E
                           │
                           └─ Done

Legend:
A, B, C, D, E = Agents executing tasks
| = Time waiting for slot
─ = Active execution
```

## Performance Characteristics

### Cache Hit (Warm)
```
claimFile: ~5-10ms
  └─ Cache lookup: ~1ms
  └─ Validation: ~1ms
  └─ Update: ~1ms
  └─ Schedule persist: ~1ms
```

### Cache Miss (Cold)
```
claimFile: ~200-500ms
  └─ Cache lookup: ~1ms
  └─ GitHub fetch: ~200-400ms
  └─ Parse YAML: ~1ms
  └─ Update cache: ~1ms
  └─ Schedule persist: ~1ms
```

### Batch Persistence
```
Every 5 seconds:
  └─ Check pending changes: ~1ms
  └─ Format YAML: ~1ms
  └─ GitHub update: ~200-400ms
  └─ Clear pending: ~1ms
```

## Error Recovery

### Agent Failure
```
Agent spawns
  ↓
Fails
  ↓
Retry 1 (immediate)
  ↓
Fails
  ↓
Retry 2 (2s delay)
  ↓
Fails
  ↓
Retry 3 (4s delay)
  ↓
Return failure
```

### GitHub API Failure
```
API call fails
  ↓
Catch error
  ↓
Log error
  ↓
Use cached data
  ↓
Continue operation
  ↓
Retry on next cycle
```

## Key Optimizations

1. **In-Memory Cache**
   - 30-second TTL
   - Automatic refresh
   - Sub-10ms lookups

2. **Batch Persistence**
   - 5-second intervals
   - Reduced API calls
   - Async operation

3. **Parallel Execution**
   - Concurrency limits
   - Resource pooling
   - Load balancing

4. **Smart Retry**
   - Exponential backoff
   - Max 3 attempts
   - Timeout handling

## Integration Points

```
┌─────────────────────────────────────────────────────────────┐
│                        Ultrapilot                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  /ultrapilot command                                          │
│      ↓                                                        │
│  ┌─────────────────┐                                         │
│  │   Analyst       │── Requirements ─────────────────┐       │
│  │   Architect     │── Architecture ─────────────────┤       │
│  │   Planner       │── Plan ─────────────────────────┤       │
│  └─────────────────┘                                 │       │
│                                                      │       │
│                                                      ↓       │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │         GitHubAgentOrchestrator                         │ │
│  │                                                          │ │
│  │  coordinateParallel(tasks, maxParallel)                 │ │
│  │      ↓                                                   │ │
│  │  spawnAgent(task)                                        │ │
│  │      ↓                                                   │ │
│  │  claimFiles(files)                                       │ │
│  │      ↓                                                   │ │
│  │  [Work on files]                                         │ │
│  │      ↓                                                   │ │
│  │  releaseFiles(files)                                     │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                      ↑       │
│  ┌─────────────────┐                          │       │
│  │   Verifier      │── Results ────────────────┘       │
│  │   Reviewers     │── Validation ────────────────┐   │
│  └─────────────────┘                              │   │
│                                                    │   │
└────────────────────────────────────────────────────┴───┘
```

## Summary

The GitHubAgentOrchestrator provides:

1. **Conflict Prevention** - File ownership tracking
2. **Parallel Execution** - Multiple agents working simultaneously
3. **Performance** - Sub-100ms operations via caching
4. **Reliability** - Automatic retry and error recovery
5. **Scalability** - Configurable concurrency limits
6. **Persistence** - GitHub-based state management
7. **Monitoring** - Active agent tracking and statistics
