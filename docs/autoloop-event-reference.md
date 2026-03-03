# Autoloop Event Publisher - Quick Reference

## Table of Contents
- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Event Reference](#event-reference)
- [Channel Reference](#channel-reference)
- [API Reference](#api-reference)
- [Examples](#examples)

## Installation

The AutoloopEventPublisher is integrated into AutoloopDaemon by default. No additional installation needed.

## Basic Usage

### Create AutoloopDaemon with Event Publishing

```typescript
import { createAutoloopDaemon } from './src/domain/AutoloopDaemon.js';
import { AgentMessageBus } from './src/agent-comms/AgentMessageBus.js';
import { SessionManager } from './src/session/SessionManager.js';

// Create message bus and session manager
const messageBus = new AgentMessageBus({
  dbPath: '/path/to/.ultra/state/messages.db'
});

const sessionManager = new SessionManager();

// Create daemon
const daemon = createAutoloopDaemon(
  {
    workspacePath: '/path/to/workspace',
    cycleTime: 60,
    enableRoutines: true,
    enableTaskProcessing: true,
    enableHealthChecks: true,
    verboseLogging: true
  },
  messageBus,
  sessionManager
);

// Start daemon (automatically initializes event publisher)
await daemon.start();

// Events are now being published!
```

### Subscribe to Events

```typescript
import { AgentMessageBus } from './src/agent-comms/AgentMessageBus.js';

// Subscribe to all autoloop events
const subscription = messageBus.subscribe(
  'my-monitor',
  'autoloop',
  (message) => {
    console.log('Event:', message.type);
    console.log('Payload:', message.payload);
  }
);

// Unsubscribe when done
subscription.unsubscribe();
```

## Event Reference

### 1. daemon.started

**Channel**: `autoloop`
**Priority**: HIGH
**Published**: When daemon starts

```typescript
{
  type: 'autoloop.daemon.started',
  payload: {
    type: 'daemon.started',
    timestamp: '2026-03-03T17:00:00.000Z',
    workspacePath: '/path/to/workspace',
    sessionId: 'autoloop-abc123',
    payload: {
      metadata: {
        startedAt: '2026-03-03T17:00:00.000Z',
        pid: 12345
      }
    }
  }
}
```

### 2. daemon.stopped

**Channel**: `autoloop`
**Priority**: HIGH
**Published**: When daemon stops

```typescript
{
  type: 'autoloop.daemon.stopped',
  payload: {
    type: 'daemon.stopped',
    timestamp: '2026-03-03T17:30:00.000Z',
    workspacePath: '/path/to/workspace',
    sessionId: 'autoloop-abc123',
    payload: {
      metadata: {
        stoppedAt: '2026-03-03T17:30:00.000Z',
        totalEvents: 42
      }
    }
  }
}
```

### 3. daemon.paused

**Channel**: `autoloop`
**Priority**: NORMAL
**Published**: When daemon is paused

```typescript
{
  type: 'autoloop.daemon.paused',
  payload: {
    type: 'daemon.paused',
    timestamp: '2026-03-03T17:15:00.000Z',
    workspacePath: '/path/to/workspace',
    sessionId: 'autoloop-abc123',
    payload: {
      metadata: {
        pausedAt: '2026-03-03T17:15:00.000Z'
      }
    }
  }
}
```

### 4. daemon.resumed

**Channel**: `autoloop`
**Priority**: NORMAL
**Published**: When daemon is resumed

```typescript
{
  type: 'autoloop.daemon.resumed',
  payload: {
    type: 'daemon.resumed',
    timestamp: '2026-03-03T17:16:00.000Z',
    workspacePath: '/path/to/workspace',
    sessionId: 'autoloop-abc123',
    payload: {
      metadata: {
        resumedAt: '2026-03-03T17:16:00.000Z'
      }
    }
  }
}
```

### 5. heartbeat

**Channel**: `autoloop`
**Priority**: NORMAL
**Published**: Every 60 seconds

```typescript
{
  type: 'autoloop.heartbeat',
  payload: {
    type: 'heartbeat',
    cycleNumber: 10,
    timestamp: '2026-03-03T17:10:00.000Z',
    workspacePath: '/path/to/workspace',
    sessionId: 'autoloop-abc123',
    payload: {
      uptime: 600000,
      cyclesCompleted: 10,
      tasksProcessed: 25,
      routinesExecuted: 30,
      errors: 0,
      metadata: {
        uptimeMs: 600000,
        lastHeartbeat: '2026-03-03T17:10:00.000Z'
      }
    }
  }
}
```

### 6. task.queued

**Channel**: `autoloop.tasks`
**Priority**: NORMAL
**Published**: When task is queued for processing

```typescript
{
  type: 'autoloop.task.queued',
  payload: {
    type: 'task.queued',
    timestamp: '2026-03-03T17:05:00.000Z',
    workspacePath: '/path/to/workspace',
    sessionId: 'autoloop-abc123',
    payload: {
      taskId: 'task-123',
      taskTitle: 'Fix authentication bug',
      taskCategory: 'bug',
      metadata: {
        queuedAt: '2026-03-03T17:05:00.000Z'
      }
    }
  }
}
```

### 7. task.started

**Channel**: `autoloop.tasks`
**Priority**: NORMAL
**Published**: When task starts processing

```typescript
{
  type: 'autoloop.task.started',
  payload: {
    type: 'task.started',
    timestamp: '2026-03-03T17:05:01.000Z',
    workspacePath: '/path/to/workspace',
    sessionId: 'autoloop-abc123',
    payload: {
      taskId: 'task-123',
      taskTitle: 'Fix authentication bug',
      agentSkill: 'ultra-debugging',
      metadata: {
        startedAt: '2026-03-03T17:05:01.000Z'
      }
    }
  }
}
```

### 8. task.completed

**Channel**: `autoloop.tasks`
**Priority**: NORMAL
**Published**: When task completes successfully

```typescript
{
  type: 'autoloop.task.completed',
  payload: {
    type: 'task.completed',
    timestamp: '2026-03-03T17:05:15.000Z',
    workspacePath: '/path/to/workspace',
    sessionId: 'autoloop-abc123',
    payload: {
      taskId: 'task-123',
      taskTitle: 'Fix authentication bug',
      result: {
        success: true,
        output: 'Bug fixed successfully'
      },
      duration: 14000,
      metadata: {
        completedAt: '2026-03-03T17:05:15.000Z',
        durationMs: 14000
      }
    }
  }
}
```

### 9. task.failed

**Channel**: `autoloop.tasks`
**Priority**: HIGH
**Published**: When task fails

```typescript
{
  type: 'autoloop.task.failed',
  payload: {
    type: 'task.failed',
    timestamp: '2026-03-03T17:05:20.000Z',
    workspacePath: '/path/to/workspace',
    sessionId: 'autoloop-abc123',
    payload: {
      taskId: 'task-123',
      taskTitle: 'Fix authentication bug',
      error: 'SyntaxError: Unexpected token',
      duration: 19000,
      metadata: {
        failedAt: '2026-03-03T17:05:20.000Z',
        durationMs: 19000
      }
    }
  }
}
```

### 10. agent.spawned

**Channel**: `autoloop.agents`
**Priority**: NORMAL
**Published**: When agent is spawned for task

```typescript
{
  type: 'autoloop.agent.spawned',
  payload: {
    type: 'agent.spawned',
    timestamp: '2026-03-03T17:05:01.000Z',
    workspacePath: '/path/to/workspace',
    sessionId: 'autoloop-abc123',
    payload: {
      agentId: 'agent-ultra-001',
      agentSkill: 'ultra-debugging',
      taskId: 'task-123',
      metadata: {
        spawnedAt: '2026-03-03T17:05:01.000Z'
      }
    }
  }
}
```

### 11. cycle.complete

**Channel**: `autoloop.cycles`
**Priority**: NORMAL
**Published**: When heartbeat cycle completes

```typescript
{
  type: 'autoloop.cycle.complete',
  payload: {
    type: 'cycle.complete',
    cycleNumber: 10,
    timestamp: '2026-03-03T17:10:00.000Z',
    workspacePath: '/path/to/workspace',
    sessionId: 'autoloop-abc123',
    payload: {
      cycleNumber: 10,
      startTime: '2026-03-03T17:09:00.000Z',
      endTime: '2026-03-03T17:10:00.000Z',
      duration: 60000,
      tasksProcessed: 3,
      routinesExecuted: [
        { name: 'test-suite', success: true, duration: 1000 },
        { name: 'lint-check', success: true, duration: 500 }
      ],
      errors: [],
      metadata: {
        durationMs: 60000,
        tasksCount: 3,
        routinesCount: 2,
        errorsCount: 0
      }
    }
  }
}
```

### 12. routine.executed

**Channel**: `autoloop.routines`
**Priority**: NORMAL
**Published**: When routine task executes

```typescript
{
  type: 'autoloop.routine.executed',
  payload: {
    type: 'routine.executed',
    timestamp: '2026-03-03T17:09:01.000Z',
    workspacePath: '/path/to/workspace',
    sessionId: 'autoloop-abc123',
    payload: {
      name: 'test-suite',
      success: true,
      duration: 1000,
      output: 'All 47 tests passed',
      metadata: {
        executedAt: '2026-03-03T17:09:01.000Z',
        durationMs: 1000
      }
    }
  }
}
```

## Channel Reference

| Channel | Purpose | Events |
|---------|---------|--------|
| `autoloop` | Daemon lifecycle | `daemon.started`, `daemon.stopped`, `daemon.paused`, `daemon.resumed`, `heartbeat` |
| `autoloop.tasks` | Task lifecycle | `task.queued`, `task.started`, `task.completed`, `task.failed` |
| `autoloop.agents` | Agent spawning | `agent.spawned` |
| `autoloop.cycles` | Cycle completion | `cycle.complete` |
| `autoloop.routines` | Routine execution | `routine.executed` |

## API Reference

### AutoloopEventPublisher

```typescript
class AutoloopEventPublisher {
  // Initialize publisher (creates AUTOLOOP session)
  async initialize(): Promise<void>

  // Publish events
  async publishHeartbeat(cycleNumber: number, stats: Stats): Promise<void>
  async publishTaskQueued(taskId: string, title: string, category: string): Promise<void>
  async publishTaskStarted(taskId: string, title: string, skill: string): Promise<void>
  async publishTaskCompleted(taskId: string, title: string, result: unknown, duration: number): Promise<void>
  async publishTaskFailed(taskId: string, title: string, error: string, duration: number): Promise<void>
  async publishAgentSpawned(agentId: string, skill: string, taskId: string): Promise<void>
  async publishCycleComplete(result: CycleResult): Promise<void>
  async publishRoutineExecuted(result: RoutineResult): Promise<void>
  async publishDaemonStarted(): Promise<void>
  async publishDaemonStopped(): Promise<void>
  async publishDaemonPaused(): Promise<void>
  async publishDaemonResumed(): Promise<void>

  // Shutdown
  async shutdown(): Promise<void>

  // Getters
  getSessionId(): string | null
  isEnabled(): boolean
  getEventCount(): number
}
```

### Factory Function

```typescript
function createAutoloopEventPublisher(config: {
  workspacePath: string;
  messageBus: AgentMessageBus;
  sessionManager: SessionManager;
  enabled?: boolean;
}): AutoloopEventPublisher
```

## Examples

### Monitor All Autoloop Events

```typescript
const messageBus = new AgentMessageBus();

const subscription = messageBus.subscribe(
  'monitor',
  'autoloop',
  (message) => {
    console.log(`[${message.type}]`, message.payload);
  }
);
```

### Alert on Task Failures

```typescript
const messageBus = new AgentMessageBus();

const subscription = messageBus.subscribe(
  'alert-system',
  'autoloop.tasks',
  async (message) => {
    if (message.type === 'autoloop.task.failed') {
      const payload = message.payload as any;
      await sendAlert({
        title: 'Task Failed',
        task: payload.payload.taskTitle,
        error: payload.payload.error,
        duration: payload.payload.duration
      });
    }
  }
);
```

### Track Cycle Performance

```typescript
const messageBus = new AgentMessageBus();

const subscription = messageBus.subscribe(
  'analytics',
  'autoloop.cycles',
  async (message) => {
    if (message.type === 'autoloop.cycle.complete') {
      const cycle = message.payload as any;
      await db.recordCycle({
        number: cycle.cycleNumber,
        duration: cycle.payload.duration,
        tasks: cycle.payload.tasksProcessed,
        routines: cycle.payload.routinesExecuted.length,
        errors: cycle.payload.errors.length
      });
    }
  }
);
```

### Real-time Dashboard Updates

```typescript
const messageBus = new AgentMessageBus();

// Subscribe to heartbeat for live stats
messageBus.subscribe('dashboard', 'autoloop', (message) => {
  if (message.type === 'autoloop.heartbeat') {
    const payload = message.payload as any;
    updateDashboard({
      uptime: payload.payload.uptime,
      cycles: payload.payload.cyclesCompleted,
      tasks: payload.payload.tasksProcessed,
      errors: payload.payload.errors
    });
  }
});

// Subscribe to tasks for task list
messageBus.subscribe('dashboard', 'autoloop.tasks', (message) => {
  const payload = message.payload as any;
  updateTaskList({
    id: payload.payload.taskId,
    title: payload.payload.taskTitle,
    status: message.type.split('.')[1]
  });
});
```

### WebSocket Integration

```typescript
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
const messageBus = new AgentMessageBus();

// Subscribe to autoloop events
messageBus.subscribe('websocket-bridge', 'autoloop', (message) => {
  // Broadcast to all WebSocket clients
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'autoloop-event',
        data: message
      }));
    }
  });
});
```

## Tips

1. **Use channel-specific subscriptions** for better filtering
2. **Subscribe with priority filters** to focus on important events
3. **Always unsubscribe** when done to prevent memory leaks
4. **Use message history** to replay past events
5. **Handle errors gracefully** in message handlers
6. **Use correlation IDs** to track message chains

## See Also

- [Architecture Overview](./autoloop-messagebus-architecture.md)
- [Implementation Summary](./autoloop-messagebus-integration.md)
- [AgentMessageBus API](../src/agent-comms/AgentMessageBus.ts)
