# Agent State Management & Inter-Agent Communication

**Critical components needed beyond the Agent Bridge for true multi-agent coordination.**

## What Agent Bridge Does (✅ Complete)

```
┌─────────────────────────────────────────────────────────────┐
│                     Agent Bridge                            │
├─────────────────────────────────────────────────────────────┤
│  ✓ Load agent definitions (behavioral instructions)        │
│  ✓ Build system prompts (full context)                      │
│  ✓ Invoke agents (with expertise)                           │
└─────────────────────────────────────────────────────────────┘
```

**The Agent Bridge is about BEHAVIOR - giving agents their specialized knowledge.**

## What's Missing (❌ Not Implemented)

### 1. Agent State Management

**Problem:** Agents have no memory across invocations.

```
Invocation 1: Agent does work
    ↓
    (State is LOST)
    ↓
Invocation 2: Agent has NO memory of previous work
```

**Solution Needed:** Agent State Store

```
┌─────────────────────────────────────────────────────────────┐
│              Agent State Store (NEEDED)                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Persistent State per Agent                          │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │ ultra:backend-architect                      │    │   │
│  │  │  - lastTaskId: task-123                      │    │   │
│  │  │  - filesModified: ["src/api/*.ts"]           │    │   │
│  │  │  - decisions: ["Use REST", "JWT auth"]       │    │   │
│  │  │  - context: {...}                            │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  │                                                      │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │ ultra:test-engineer                          │    │   │
│  │  │  - testsCreated: 15                          │    │   │
│  │  │  - coverage: 87%                             │    │   │
│  │  │  - failingTests: []                          │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  Features:                                                    │
│  • Persistent across invocations                             │
│  • Transactional updates                                     │
│  • State versioning                                          │
│  • Rollback support                                          │
│  • TTL for stale state                                       │
└─────────────────────────────────────────────────────────────┘
```

### 2. Inter-Agent Communication

**Problem:** Agents can't directly communicate or coordinate.

```
backend-architect: "I designed the API"
    ↓
    (NO WAY to tell test-engineer)
    ↓
test-engineer: "I don't know what API was designed"
```

**Solution Needed:** Agent Message Bus

```
┌─────────────────────────────────────────────────────────────┐
│           Agent Message Bus (NEEDED)                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Message Channels                                     │   │
│  │                                                      │   │
│  │  backend-architect ──┐                              │   │
│  │                      ├─→ shared-channel            │   │
│  │  test-engineer ──────┘                              │   │
│  │                                                      │   │
│  │  Messages:                                           │   │
│  │  {                                                   │   │
│  │    from: "ultra:backend-architect",                 │   │
│  │    to: "ultra:test-engineer",                       │   │
│  │    type: "api-designed",                            │   │
│  │    payload: {                                       │   │
│  │      endpoints: [...],                              │   │
│  │      schema: "..."                                  │   │
│  │    },                                               │   │
│  │    timestamp: "2026-03-02T...",                     │   │
│  │    correlationId: "msg-001"                         │   │
│  │  }                                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  Features:                                                    │
│  • Pub/sub messaging                                         │
│  • Direct messages                                            │
│  • Broadcast to all agents                                    │
│  • Message persistence                                        │
│  • Delivery guarantees (at-least-once, exactly-once)          │
│  • Dead letter queues                                         │
└─────────────────────────────────────────────────────────────┘
```

## Proposed Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    Complete Multi-Agent System                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                  Agent Bridge (✅ DONE)                    │ │
│  │  • Load agent definitions                                 │ │
│  │  • Build system prompts                                   │ │
│  │  • Invoke agents                                          │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                  │                              │
│                                  ▼                              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │            Agent State Store (❌ NEEDED)                   │ │
│  │  • Persistent agent state                                 │ │
│  │  • Transactional updates                                  │ │
│  │  • State queries                                          │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                  │                              │
│                                  ▼                              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │           Agent Message Bus (❌ NEEDED)                    │ │
│  │  • Pub/sub messaging                                      │ │
│  │  • Direct messages                                        │ │
│  │  • Broadcasts                                              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                  │                              │
│                                  ▼                              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │           Agent Orchestrator (❌ NEEDED)                   │ │
│  │  • Coordinate agent workflows                             │ │
│  │  • Handle dependencies                                    │ │
│  │  • Manage lifecycle                                        │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                    │
└──────────────────────────────────────────────────────────────────┘
```

## Implementation Plan

### Phase 1: Agent State Store (2-3 days)

**File:** `src/agent-state/AgentStateStore.ts`

```typescript
export class AgentStateStore {
  /**
   * Get agent state
   */
  async getState(agentId: string): Promise<AgentState | null>;

  /**
   * Update agent state (transactional)
   */
  async updateState(
    agentId: string,
    updates: Partial<AgentState>,
    options?: {
      merge?: boolean;
      version?: number;
    }
  ): Promise<AgentState>;

  /**
   * Reset agent state
   */
  async resetState(agentId: string): Promise<void>;

  /**
   * Query agent states
   */
  async queryAgents(filter: StateFilter): Promise<AgentState[]>;

  /**
   * Subscribe to state changes
   */
  subscribe(agentId: string, callback: (state: AgentState) => void): void;
}

interface AgentState {
  agentId: string;
  version: number;
  lastUpdated: Date;

  // Task state
  currentTask?: string;
  completedTasks: string[];
  failedTasks: string[];

  // Work state
  filesModified: string[];
  decisions: Array<{
    timestamp: Date;
    decision: string;
    reasoning: string;
  }>;
  context: Record<string, any>;

  // Metrics
  totalInvocations: number;
  successRate: number;
  averageDuration: number;
}
```

**Storage Options:**
1. **JSON files** (`.ultra/state/agents/{agentId}.json`) - Simple, portable
2. **SQLite** - Single file, transactional, queryable
3. **Redis** - Fast, distributed, optional persistence
4. **PostgreSQL** - Production-grade, scalable

**Recommendation:** Start with JSON files, upgrade to SQLite for transactions.

### Phase 2: Agent Message Bus (2-3 days)

**File:** `src/agent-comms/AgentMessageBus.ts`

```typescript
export class AgentMessageBus {
  /**
   * Send message to specific agent
   */
  async sendDirect(
    from: string,
    to: string,
    message: AgentMessage
  ): Promise<string>; // messageId

  /**
   * Publish to channel (pub/sub)
   */
  async publish(
    from: string,
    channel: string,
    message: AgentMessage
  ): Promise<string>;

  /**
   * Subscribe to channel
   */
  subscribe(
    agentId: string,
    channel: string,
    handler: (message: AgentMessage) => void | Promise<void>
  ): void;

  /**
   * Broadcast to all agents
   */
  async broadcast(
    from: string,
    message: AgentMessage
  ): Promise<string>;

  /**
   * Get message history
   */
  async getHistory(
    agentId: string,
    options?: {
      since?: Date;
      limit?: number;
    }
  ): Promise<AgentMessage[]>;
}

interface AgentMessage {
  id: string;
  from: string;
  to?: string;        // undefined for broadcasts
  channel?: string;   // for pub/sub
  type: string;
  payload: any;
  timestamp: Date;
  correlationId?: string;
  replyTo?: string;
}
```

**Message Patterns:**

1. **Direct Message:**
```typescript
await messageBus.sendDirect(
  'ultra:backend-architect',
  'ultra:test-engineer',
  {
    type: 'api-designed',
    payload: {
      endpoints: [
        { path: '/users', method: 'GET' },
        { path: '/users', method: 'POST' }
      ],
      schema: openApiSpec
    }
  }
);
```

2. **Pub/Sub:**
```typescript
// Subscribe
messageBus.subscribe('ultra:test-engineer', 'api-changes', async (msg) => {
  console.log('API changed:', msg.payload);
});

// Publish
await messageBus.publish('ultra:backend-architect', 'api-changes', {
  type: 'endpoint-added',
  payload: { path: '/users', method: 'GET' }
});
```

3. **Broadcast:**
```typescript
await messageBus.broadcast('ultra:team-lead', {
  type: 'deployment-starting',
  payload: { timestamp: Date.now() }
});
```

### Phase 3: Agent Orchestrator (3-4 days)

**File:** `src/agent-orchestration/AgentOrchestrator.ts`

```typescript
export class AgentOrchestrator {
  constructor(
    private bridge: AgentBridge,
    private stateStore: AgentStateStore,
    private messageBus: AgentMessageBus
  ) {}

  /**
   * Execute multi-agent workflow
   */
  async executeWorkflow(
    workflow: AgentWorkflow
  ): Promise<WorkflowResult>;

  /**
   * Spawn agent with state & messaging
   */
  async spawnAgent(
    agentId: string,
    task: string,
    context: InvocationContext
  ): Promise<InvocationResult>;

  /**
   * Coordinate parallel agents with communication
   */
  async coordinateParallel(
    agents: Array<{
      agentId: string;
      task: string;
      context: InvocationContext;
      communicationChannels: string[];
    }>
  ): Promise<InvocationResult[]>;
}
```

## Use Cases

### Use Case 1: Agent Remembers Previous Work

```typescript
// Invocation 1
await bridge.invoke('ultra:backend-architect', designApiTask, context);

// State is saved
await stateStore.updateState('ultra:backend-architect', {
  filesModified: ['src/api/users.ts'],
  decisions: [{
    decision: 'Use REST with JSON',
    reasoning: 'Simpler than GraphQL for this use case'
  }]
});

// Invocation 2 - Agent remembers!
const state = await stateStore.getState('ultra:backend-architect');
console.log(state.filesModified);  // ['src/api/users.ts']
console.log(state.decisions);      // [{'decision': 'Use REST...'}]

await bridge.invoke('ultra:backend-architect', newTask, {
  ...context,
  previousWork: state  // Agent can see what it did before!
});
```

### Use Case 2: Agent-to-Agent Communication

```typescript
// Backend architect completes API design
await bridge.invoke('ultra:backend-architect', designApiTask, context);

// Notify test engineer
await messageBus.sendDirect(
  'ultra:backend-architect',
  'ultra:test-engineer',
  {
    type: 'api-designed',
    payload: {
      endpoints: apiEndpoints,
      files: ['src/api/users.ts']
    }
  }
);

// Test engineer receives notification
messageBus.subscribe('ultra:test-engineer', 'direct', async (msg) => {
  if (msg.type === 'api-designed') {
    // Test engineer now knows what to test!
    await bridge.invoke('ultra:test-engineer', 'Write tests for new API', {
      ...context,
      apiDefinition: msg.payload
    });
  }
});
```

### Use Case 3: Coordinated Multi-Agent Workflow

```typescript
// Orchestrator coordinates workflow
await orchestrator.executeWorkflow({
  name: 'implement-user-api',
  steps: [
    {
      agent: 'ultra:backend-architect',
      task: 'Design API',
      outputs: { endpointSpec: 'api-spec' }
    },
    {
      agent: 'ultra:team-implementer',
      task: 'Implement endpoints',
      inputs: { apiSpec: '$.steps[0].endpointSpec' },
      outputs: { implementation: 'code' }
    },
    {
      agent: 'ultra:test-engineer',
      task: 'Write tests',
      inputs: { code: '$.steps[1].implementation' },
      outputs: { tests: 'test-files' }
    },
    {
      agent: 'ultra:security-reviewer',
      task: 'Review for security issues',
      inputs: {
        code: '$.steps[1].implementation',
        tests: '$.steps[2].tests'
      }
    }
  ]
});
```

## Recommendation

**YES - We need Agent State Management and Inter-Agent Communication.**

These are **separate from but complementary to** the Agent Bridge:

| Component | Purpose | Status |
|-----------|---------|--------|
| Agent Bridge | Load behavioral definitions | ✅ Complete |
| Agent State Store | Persistent agent memory | ❌ Needed |
| Agent Message Bus | Inter-agent communication | ❌ Needed |
| Agent Orchestrator | Workflow coordination | ❌ Needed |

**Implementation Priority:**
1. **Agent State Store** - Highest priority (agents need memory)
2. **Agent Message Bus** - High priority (agents need to coordinate)
3. **Agent Orchestrator** - Medium priority (workflow automation)

**Estimated Effort:**
- Agent State Store: 2-3 days
- Agent Message Bus: 2-3 days
- Agent Orchestrator: 3-4 days

**Total: 7-10 days** for a complete multi-agent system with state and communication.

---

**Should I proceed with implementing Agent State Store and Agent Message Bus?**
