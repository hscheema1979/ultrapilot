# Autoloop AgentMessageBus Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         UltraPilot Workspace                                    │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                          AutoloopDaemon                                 │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐    │   │
│  │  │  60-Second Heartbeat Cycle                                      │    │   │
│  │  │  - Process tasks from queue                                     │    │   │
│  │  │  - Execute routine maintenance                                  │    │   │
│  │  │  - Run health checks                                            │    │   │
│  │  │  - Spawn agents for tasks                                       │    │   │
│  │  └──────────────────────┬──────────────────────────────────────────┘    │   │
│  │                         │                                                │   │
│  │                         │ Events                                         │   │
│  │                         ▼                                                │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐    │   │
│  │  │              AutoloopEventPublisher                              │    │   │
│  │  │  - Create AUTOLOOP session                                       │    │   │
│  │  │  - Format events with metadata                                   │    │   │
│  │  │  - Publish to channels                                           │    │   │
│  │  │  - Track event sequence                                          │    │   │
│  │  └──────────────────────┬──────────────────────────────────────────┘    │   │
│  └─────────────────────────┼──────────────────────────────────────────────┘   │
│                            │                                                    │
│                            │ publish()                                         │
│                            ▼                                                    │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        AgentMessageBus                                 │   │
│  │                                                                         │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │  │  CRITICAL   │ │    HIGH     │ │   NORMAL    │ │     LOW     │       │   │
│  │  │   Queue     │ │   Queue     │ │   Queue     │ │   Queue     │       │   │
│  │  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘       │   │
│  │         │                │                │                │             │   │
│  │         └────────────────┴────────────────┴────────────────┘             │   │
│  │                            │                                             │   │
│  │                    ┌───────┴───────┐                                    │   │
│  │                    │  Delivery     │                                    │   │
│  │                    │  Worker       │                                    │   │
│  │                    │  (50ms batch) │                                    │   │
│  │                    └───────┬───────┘                                    │   │
│  │                            │                                             │   │
│  │  ┌─────────────────────────┼─────────────────────────────────────┐     │   │
│  │  │                         │                                     │     │   │
│  │  │  Channels:                                                     │     │   │
│  │  │  • autoloop          (daemon lifecycle)                       │     │   │
│  │  │  • autoloop.tasks    (task events)                            │     │   │
│  │  │  • autoloop.agents   (agent spawning)                         │     │   │
│  │  │  • autoloop.cycles   (cycle completion)                       │     │   │
│  │  │  • autoloop.routines (routine execution)                      │     │   │
│  │  │                                                               │     │   │
│  │  └─────────────────────────┼─────────────────────────────────────┘     │   │
│  └────────────────────────────┼───────────────────────────────────────────┘   │
│                               │                                                  │
│                               │ deliver()                                        │
│                               ▼                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                          Subscribers                                    │   │
│  │                                                                         │   │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐      │   │
│  │  │ Mission Control  │  │  UltraXServer    │  │   Alert System   │      │   │
│  │  │    Dashboard     │  │  (WebSocket)     │  │  (High Priority) │      │   │
│  │  │                  │  │                  │  │                  │      │   │
│  │  │ • Live monitoring │  │ • Browser UI     │  │ • Failure alerts │      │   │
│  │  │ • Cycle stats     │  │ • Real-time      │  │ • Error notify   │      │   │
│  │  │ • Task history    │  │ • Interactive    │  │                  │      │   │
│  │  └──────────────────┘  └──────────────────┘  └──────────────────┘      │   │
│  │                                                                         │   │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐      │   │
│  │  │  Analytics DB    │  │  Audit Log       │  │   Other Agents   │      │   │
│  │  │                  │  │                  │  │                  │      │   │
│  │  │ • Query history  │  │ • Compliance     │  │ • Coordination   │      │   │
│  │  │ • Metrics        │  │ • Debug trail    │  │ • Collaboration  │      │   │
│  │  └──────────────────┘  └──────────────────┘  └──────────────────┘      │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                       SessionManager                                     │   │
│  │                                                                         │   │
│  │  AUTOLOOP Session:                                                      │   │
│  │  • Session ID: autoloop-{uuid}                                          │   │
│  │  • Role: AUTOLOOP                                                       │   │
│  │  • Status: RUNNING                                                      │   │
│  │  • Activity: Updated every 30s                                          │   │
│  │  • Locks: Coordinates with other sessions                               │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                    SQLite Message Store                                  │   │
│  │                                                                         │   │
│  │  • messages table (all published events)                                │   │
│  │  • dead_letter_queue (failed deliveries)                                │   │
│  │  • sessions table (active sessions)                                     │   │
│  │  • locks table (coordination)                                           │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Event Flow Diagram

```
┌──────────────┐
│ Autoloop     │
│ Daemon       │
└──────┬───────┘
       │
       │ 1. Heartbeat cycle starts
       │
       ▼
┌──────────────┐
│ Process      │
│ Tasks        │
└──────┬───────┘
       │
       │ 2. Task queued
       ▼
┌──────────────┐     ┌─────────────────┐
│ EventPublisher├────►│ AgentMessageBus │
└──────────────┘     └────────┬────────┘
                              │
                              │ 3. Publish to channel
                              │    autoloop.tasks
                              ▼
                     ┌─────────────────┐
                     │   Subscribers   │
                     └─────────────────┘
                              │
                              ├─► Dashboard (show task)
                              ├─► Analytics (record)
                              └─► Alert System (watch)

┌──────────────┐
│ Autoloop     │
│ Daemon       │
└──────┬───────┘
       │
       │ 4. Spawn agent
       ▼
┌──────────────┐     ┌─────────────────┐
│ EventPublisher├────►│ AgentMessageBus │
└──────────────┘     └────────┬────────┘
                              │
                              │ 5. Publish to channel
                              │    autoloop.agents
                              ▼
                     ┌─────────────────┐
                     │   Subscribers   │
                     └─────────────────┘
                              │
                              └─► Dashboard (show agent)

┌──────────────┐
│ Autoloop     │
│ Daemon       │
└──────┬───────┘
       │
       │ 6. Task complete
       ▼
┌──────────────┐     ┌─────────────────┐
│ EventPublisher├────►│ AgentMessageBus │
└──────────────┘     └────────┬────────┘
                              │
                              │ 7. Publish to channel
                              │    autoloop.tasks
                              ▼
                     ┌─────────────────┐
                     │   Subscribers   │
                     └─────────────────┘
                              │
                              ├─► Dashboard (update)
                              ├─► Analytics (record)
                              └─► Alert System (clear)

┌──────────────┐
│ Autoloop     │
│ Daemon       │
└──────┬───────┘
       │
       │ 8. Cycle complete
       ▼
┌──────────────┐     ┌─────────────────┐
│ EventPublisher├────►│ AgentMessageBus │
└──────────────┘     └────────┬────────┘
                              │
                              │ 9. Publish to channel
                              │    autoloop.cycles
                              ▼
                     ┌─────────────────┐
                     │   Subscribers   │
                     └─────────────────┘
                              │
                              ├─► Dashboard (show stats)
                              ├─► Analytics (aggregate)
                              └─► Alert System (monitor)

┌──────────────┐
│ Autoloop     │
│ Daemon       │
└──────┬───────┘
       │
       │ 10. Heartbeat (every 60s)
       ▼
┌──────────────┐     ┌─────────────────┐
│ EventPublisher├────►│ AgentMessageBus │
└──────────────┘     └────────┬────────┘
                              │
                              │ 11. Publish to channel
                              │     autoloop
                              ▼
                     ┌─────────────────┐
                     │   Subscribers   │
                     └─────────────────┘
                              │
                              ├─► Dashboard (show heartbeat)
                              ├─► SessionManager (update activity)
                              └─► Other processes (coordination)
```

## Channel Subscription Examples

### Subscribe to All Autoloop Events
```typescript
messageBus.subscribe('monitor', 'autoloop', (message) => {
  console.log('Autoloop event:', message.type, message.payload);
});
```

### Subscribe to Task Events Only
```typescript
messageBus.subscribe('task-monitor', 'autoloop.tasks', (message) => {
  if (message.type === 'autoloop.task.failed') {
    // Handle task failure
  }
});
```

### Subscribe with Priority Filter
```typescript
messageBus.subscribe('alert-system', 'autoloop.tasks', (message) => {
  // Handle high-priority failures
}, {
  filters: {
    priority: [MessagePriority.HIGH, MessagePriority.CRITICAL]
  }
});
```

### Subscribe to Cycle Events
```typescript
messageBus.subscribe('analytics', 'autoloop.cycles', (message) => {
  if (message.type === 'autoloop.cycle.complete') {
    // Aggregate cycle statistics
    const cycleData = message.payload;
    db.recordCycleStats(cycleData);
  }
});
```

## Benefits of This Architecture

1. **Decoupling**: Daemon doesn't need to know about subscribers
2. **Scalability**: Multiple subscribers can receive events independently
3. **Reliability**: Messages persisted to SQLite for replay/audit
4. **Prioritization**: Failed tasks get immediate attention
5. **Flexibility**: Easy to add new subscribers without changing daemon
6. **Monitoring**: Real-time visibility into daemon operations
7. **Coordination**: Session management enables multi-process coordination
8. **Audit Trail**: All events logged with timestamps and sequence numbers

## Session Management

The AUTOLOOP session enables:

```
┌─────────────────────────────────────────────────────────────┐
│ Session: AUTOLOOP                                           │
├─────────────────────────────────────────────────────────────┤
│ Session ID: autoloop-abc123-def456-ghi789                   │
│ Role: AUTOLOOP                                              │
│ Status: RUNNING                                             │
│ Created: 2026-03-03T17:00:00.000Z                          │
│ Last Activity: 2026-03-03T17:05:30.000Z                    │
│ Metadata:                                                   │
│   - startTime: 2026-03-03T17:00:00.000Z                    │
│   - eventSequence: 42                                       │
├─────────────────────────────────────────────────────────────┤
│ Locks Held:                                                 │
│   - autoloop:task-queue                                     │
│   - autoloop:cycle-execution                                │
├─────────────────────────────────────────────────────────────┤
│ Active Agents:                                              │
│   - agent-ultra-001 (executor)                              │
│   - agent-ultra-002 (test-engineer)                         │
└─────────────────────────────────────────────────────────────┘
```

This session enables:
- **Multi-process coordination**: Other processes can check session status
- **Lock management**: Prevent concurrent task processing
- **Activity tracking**: Detect stuck/failed daemons
- **Leader election**: Coordinate multiple autoloop instances
