# Agent Message Bus Integration Plan

**Why Use AgentMessageBus Instead of EventEmitter?**

## EventEmitter (Current Implementation)
```typescript
// UltraLead
this.emit('workReceived', { request, breakdown });

// WorkingManager
this.emit('teamSpawned', { teamId, task, workerCount });
```

**Problems**:
- ❌ No delivery guarantees (fire and forget)
- ❌ No persistence (lost if crash)
- ❌ No security (anyone can emit)
- ❌ No priority handling (all events equal)
- ❌ No acknowledgment (don't know if received)
- ❌ No audit trail (can't track messages)

---

## AgentMessageBus (Better Implementation)
```typescript
// UltraLead
await messageBus.publish('work.received', {
  request,
  breakdown,
  priority: MessagePriority.HIGH
});

// WorkingManager
await messageBus.publish('team.spawned', {
  teamId,
  task,
  workerCount,
  priority: MessagePriority.NORMAL
});

// UltraLoop subscribes
await messageBus.subscribe('work.received', async (message) => {
  const { request, breakdown } = message.payload;
  // Process work...
  await messageBus.ack(message.id);
});
```

**Benefits**:
- ✅ Delivery guarantees (at-least-once)
- ✅ Persistence (SQLite survives crashes)
- ✅ Security (signed messages, access control)
- ✅ Priority queues (critical messages first)
- ✅ Acknowledgment (know when received)
- ✅ Audit trail (full message history)

---

## Integration Strategy

### **Phase 1: Define Message Channels**

```typescript
// Ultra Lead → Ultra Loop channels
const ULTRA_LEAD_CHANNELS = {
  WORK_RECEIVED: 'ultra.lead.work.received',        // Ultra Lead sends work
  ROUTINE_SET: 'ultra.lead.routine.set',            // Ultra Lead sets task list
  STATUS_REQUEST: 'ultra.lead.status.request',      // Ultra Lead checks status
  HIRING_APPROVED: 'ultra.lead.hiring.approved',    // Ultra Lead approves hiring
  HIRING_DENIED: 'ultra.lead.hiring.denied'         // Ultra Lead denies hiring
};

// Ultra Loop → Ultra Lead channels
const ULTRA_LOOP_CHANNELS = {
  STATUS_UPDATE: 'ultra.loop.status.update',         // Ultra Loop reports status
  HIRING_REQUEST: 'ultra.loop.hiring.request',       // Ultra Loop requests workers
  ALL_TASKS_COMPLETE: 'ultra.loop.tasks.complete',   // Ultra Loop reports completion
  TEAM_SPAWNED: 'ultra.loop.team.spawned',           // Ultra Loop spawned team
  TEAM_COMPLETED: 'ultra.loop.team.completed'        // Ultra Loop team finished
};
```

---

### **Phase 2: Refactor UltraLead**

```typescript
import { AgentMessageBus } from '../agent-comms/AgentMessageBus.js';

export class UltraLead extends EventEmitter {
  private messageBus: AgentMessageBus;

  constructor(config?: Partial<UltraLeadConfig>) {
    super();
    this.messageBus = new AgentMessageBus({
      dbPath: '.ultra/messagebus.db'
    });
  }

  async receiveWorkRequest(request: WorkRequest): Promise<TaskBreakdown> {
    const breakdown = await this.breakDownWork(request);

    // OLD: this.emit('workReceived', { request, breakdown });
    // NEW:
    await this.messageBus.publish('ultra.lead.work.received', {
      requestId: request.id,
      breakdown,
      timestamp: new Date().toISOString()
    }, {
      priority: request.priority === 'critical'
        ? MessagePriority.CRITICAL
        : MessagePriority.HIGH,
      persistent: true
    });

    return breakdown;
  }

  async checkInOnUltraLoop(): Promise<void> {
    // OLD: this.emit('requestStatus', { timestamp: new Date() });
    // NEW:
    await this.messageBus.publish('ultra.lead.status.request', {
      timestamp: new Date().toISOString(),
      checkInNumber: this.getStats().totalCheckIns
    }, {
      priority: MessagePriority.NORMAL,
      persistent: false // Check-ins don't need persistence
    });
  }

  async evaluateHiringRequest(request: HiringRequest): Promise<HiringDecision> {
    const decision = await this.evaluateHiringAgainstGoals(request);

    // OLD: this.emit('hiringApproved', { ...request, approved: true });
    // NEW:
    if (decision.approved) {
      await this.messageBus.publish('ultra.lead.hiring.approved', {
        ...request,
        approved: true,
        timestamp: new Date().toISOString()
      }, {
        priority: MessagePriority.HIGH,
        persistent: true
      });
    } else {
      await this.messageBus.publish('ultra.lead.hiring.denied', {
        ...request,
        approved: false,
        reason: decision.reason,
        timestamp: new Date().toISOString()
      }, {
        priority: MessagePriority.NORMAL,
        persistent: true
      });
    }

    return decision;
  }
}
```

---

### **Phase 3: Refactor AutoloopDaemon**

```typescript
import { AgentMessageBus } from '../agent-comms/AgentMessageBus.js';

export class AutoloopDaemon extends EventEmitter {
  private messageBus: AgentMessageBus;

  constructor(config: AutoloopConfig) {
    super();
    this.messageBus = new AgentMessageBus({
      dbPath: path.join(config.workspacePath, '.ultra', 'messagebus.db')
    });

    // Subscribe to Ultra Lead messages
    this.subscribeToUltraLead();
  }

  private async subscribeToUltraLead(): Promise<void> {
    // Subscribe to routine updates
    await this.messageBus.subscribe('ultra.lead.routine.set', async (message) => {
      const { tasks } = message.payload;
      console.log(`[Autoloop] Received routine from Ultra Lead: ${tasks.length} tasks`);

      // Add tasks to queue
      const taskQueue = this.domainManager.getTaskQueue();
      for (const task of tasks) {
        await taskQueue.addTask(task);
      }

      // Acknowledge message
      await this.messageBus.ack(message.id);
    });

    // Subscribe to status requests
    await this.messageBus.subscribe('ultra.lead.status.request', async (message) => {
      const stats = this.getStats();

      // Send status update back
      await this.messageBus.publish('ultra.loop.status.update', {
        stats,
        timestamp: new Date().toISOString()
      }, {
        priority: MessagePriority.NORMAL,
        persistent: false
      });

      await this.messageBus.ack(message.id);
    });
  }

  private async processTasks(): Promise<number> {
    // ... task processing logic ...

    // OLD: this.emit('teamSpawned', { teamId, task, workerCount });
    // NEW:
    await this.messageBus.publish('ultra.loop.team.spawned', {
      teamId,
      taskId: task.id,
      workerCount,
      timestamp: new Date().toISOString()
    }, {
      priority: MessagePriority.HIGH,
      persistent: true
    });

    // ... rest of logic ...
  }

  async requestHiring(reason: string, workerCount: number, justification: string): Promise<boolean> {
    // Send hiring request via message bus
    await this.messageBus.publish('ultra.loop.hiring.request', {
      reason,
      workerCount,
      justification,
      timestamp: new Date().toISOString()
    }, {
      priority: MessagePriority.HIGH,
      persistent: true
    });

    // Wait for response (with timeout)
    const response = await this.waitForHiringResponse();

    return response.approved;
  }
}
```

---

### **Phase 4: Refactor WorkingManager**

```typescript
import { AgentMessageBus } from '../agent-comms/AgentMessageBus.js';

export class WorkingManager extends EventEmitter {
  private messageBus: AgentMessageBus;

  constructor(config?: Partial<WorkingManagerConfig>) {
    super();
    this.messageBus = new AgentMessageBus({
      dbPath: '.ultra/workingmanager.db'
    });

    // Forward team orchestrator events to message bus
    this.teamOrchestrator.on('teamSpawned', async (data) => {
      await this.messageBus.publish('ultra.loop.team.spawned', {
        ...data,
        timestamp: new Date().toISOString()
      }, {
        priority: MessagePriority.NORMAL,
        persistent: true
      });
    });

    this.teamOrchestrator.on('teamCompleted', async (data) => {
      await this.messageBus.publish('ultra.loop.team.completed', {
        ...data,
        timestamp: new Date().toISOString()
      }, {
        priority: MessagePriority.HIGH,
        persistent: true
      });
    });
  }

  async spawnUltraTeam(task: Task, workerCount: number): Promise<string> {
    const teamId = await this.teamOrchestrator.spawnTeam({
      teamId: `team-${task.id}-${Date.now()}`,
      task,
      workerCount
    });

    // Team orchestrator already emitted 'teamSpawned'
    // which WorkingManager forwards to message bus

    return teamId;
  }
}
```

---

## Benefits of AgentMessageBus Integration

### **1. Reliability**
```
EventEmitter:
Ultra Lead emits → Ultra Loop misses → Lost forever

AgentMessageBus:
Ultra Lead publishes → Stored in SQLite → Ultra Loop receives → Ack
→ Message guaranteed delivery
```

### **2. Security**
```
EventEmitter:
Anyone can emit('workReceived') → Security risk

AgentMessageBus:
Message signed → Validated → Only authorized subscribers
→ Secure communication
```

### **3. Observability**
```
EventEmitter:
No tracking → Who received what? When?

AgentMessageBus:
Full audit log → Every message tracked:
- Who published?
- Who received?
- When was it delivered?
- Was it acknowledged?
→ Complete observability
```

### **4. Performance**
```
EventEmitter:
All events processed immediately → Overload risk

AgentMessageBus:
Priority queues → Critical messages first
Batching → Process in batches of 50
Backpressure → Slow down if overloaded
→ Controlled load
```

### **5. Persistence**
```
EventEmitter:
Crash → All in-flight events lost

AgentMessageBus:
Crash → Messages stored in SQLite
→ Recover on restart
```

---

## Implementation Priority

**Phase 1: Core Integration** (4-6 hours)
1. UltraLead: Replace emit() with messageBus.publish()
2. AutoloopDaemon: Subscribe to Ultra Lead channels
3. WorkingManager: Forward events to message bus
4. Test basic message flow

**Phase 2: Error Handling** (2-3 hours)
1. Add message acknowledgment
2. Add retry logic for failed deliveries
3. Add dead letter queue handling
4. Test failure scenarios

**Phase 3: Security** (2-3 hours)
1. Enable message signing
2. Add channel permissions
3. Add payload validation
4. Test security features

**Phase 4: Optimization** (2-3 hours)
1. Tune batch sizes
2. Configure priority queues
3. Add message coalescing
4. Performance testing

**Total Effort**: 10-15 hours

---

## Should I Implement This Now?

**Options**:
1. **Yes** - Integrate AgentMessageBus now (10-15 hours)
2. **Later** - Keep EventEmitter for now, integrate later
3. **Hybrid** - Use both (AgentMessageBus for critical, EventEmitter for debug)

**My Recommendation**: **Option 3 (Hybrid)**
- Use AgentMessageBus for:
  - Work requests (owner → Ultra Lead)
  - Routine updates (Ultra Lead → Ultra Loop)
  - Hiring decisions (critical)
- Use EventEmitter for:
  - Debug events
  - Progress updates (high frequency)
  - Development logging

This gives us reliability for critical messages while keeping simple debugging.

---

**Your Decision**: Should I integrate AgentMessageBus now?
