# Domain Bridge Quick Start

**UltraPilot Domain Agency Bridge - Quick Reference**

## Installation

```bash
cd /home/ubuntu/hscheema1979/ultrapilot
npm run build
```

## Basic Usage

### 1. Create a Domain Manager

```typescript
import { createDomainManager, TaskPriority } from './dist/domain/index.js';

const domain = createDomainManager({
  domainAgency: { enabled: true } // Optional: integrate with domain-agency package
});

await domain.start();
```

### 2. Create and Assign Tasks

```typescript
// Create a task
const taskId = await domain.createTask(
  'Implement JWT authentication',
  'Add JWT-based authentication to API endpoints',
  {
    priority: TaskPriority.HIGH,
    tags: ['security', 'feature'],
    ownedFiles: ['src/auth/*.ts', 'src/middleware/auth.ts'],
    assignedAgent: 'team-implementer'
  }
);

// Register an agent
domain.registerAgent('agent-001', 'team-implementer');

// Assign task to agent
await domain.assignTask(taskId, 'agent-001');
```

### 3. Work with File Ownership

```typescript
// Acquire file ownership (prevents conflicts)
const result = await domain.acquireFileOwnership(
  'src/auth/login.ts',
  'agent-001',
  'team-implementer',
  'task-001',
  { priority: 8 }
);

if (result.success) {
  // Work on the file...
  console.log('File locked for editing');

  // Release when done
  await domain.releaseFileOwnership('src/auth/login.ts', 'agent-001');
} else if (result.conflict) {
  console.log('File conflict detected:', result.conflict);
  // Handle conflict (wait, negotiate, or find alternative)
}
```

### 4. Complete and Review Tasks

```typescript
// Agent completes task
await domain.completeTask('agent-001', taskId, {
  success: true,
  output: 'JWT authentication implemented with refresh tokens',
  metadata: {
    filesModified: ['src/auth/login.ts', 'src/middleware/auth.ts'],
    testsAdded: 15
  }
});

// Task moves to review queue
// Reviewer approves
await domain.approveTask(taskId);

// Or rejects with feedback
await domain.rejectTask(taskId, 'Missing error handling for token expiry');
```

### 5. Monitor Events

```typescript
// Listen to domain events
domain.on('task:created', (taskId) => {
  console.log(`✨ New task: ${taskId}`);
});

domain.on('task:assigned', (taskId, agentId) => {
  console.log(`👤 Task ${taskId} → agent ${agentId}`);
});

domain.on('fileOwnership:acquired', (filePath, agentId) => {
  console.log(`🔒 ${agentId} locked ${filePath}`);
});

domain.on('fileOwnership:released', (filePath) => {
  console.log(`🔓 ${filePath} released`);
});

domain.on('conflict:detected', (conflict) => {
  console.log(`⚠️  Conflict: ${conflict.description}`);
});

domain.on('conflict:resolved', (conflict, result) => {
  console.log(`✅ Conflict resolved: ${result.resolution}`);
});

domain.on('task:completed', (taskId) => {
  console.log(`✅ Task ${taskId} completed`);
});
```

### 6. Get Statistics

```typescript
const stats = domain.getStats();

console.log('=== Domain Statistics ===');
console.log('Tasks:', stats.tasks);
// { total: 47, intake: 5, inProgress: 3, review: 2, completed: 35, failed: 2 }

console.log('Files:', stats.files);
// { totalFiles: 120, lockedFiles: 8, availableFiles: 110, disputedFiles: 2 }

console.log('Agents:', stats.agents);
// { totalAgents: 6, activeAgents: 4, byType: { 'team-implementer': 3, ... } }

console.log('Conflicts:', stats.conflicts);
// { totalDetected: 12, totalResolved: 10, activeConflicts: 2 }

console.log('Health:', stats.health);
// { isRunning: true, uptime: 3600000 }
```

## Agent-Specific Workflows

### ultra:team-lead (Orchestrator)

```typescript
// 1. Create multiple related tasks
const authTaskId = await domain.createTask('Add authentication', '...');
const userTaskId = await domain.createTask('Create user management', '...');
const apiTaskId = await domain.createTask('Build REST API', '...');

// 2. Register implementer agents
domain.registerAgent('impl-1', 'team-implementer');
domain.registerAgent('impl-2', 'team-implementer');
domain.registerAgent('impl-3', 'team-implementer');

// 3. Assign tasks (automatically distributes)
await domain.assignTask(authTaskId, 'impl-1');
await domain.assignTask(userTaskId, 'impl-2');
await domain.assignTask(apiTaskId, 'impl-3');

// 4. Monitor progress
domain.on('task:completed', (taskId) => {
  console.log(`Milestone: ${taskId} complete`);
});
```

### ultra:team-implementer (Parallel Worker)

```typescript
// 1. Get assigned task
const task = domain.getNextTask('team-implementer');
if (!task) return;

// 2. Acquire file ownership
const filesToEdit = task.ownedFiles || [];
for (const file of filesToEdit) {
  const result = await domain.acquireFileOwnership(
    file,
    'agent-001',
    'team-implementer',
    task.id,
    { priority: task.priority }
  );

  if (!result.success) {
    // Handle conflict
    console.log('Conflict on file:', file);
    continue;
  }
}

// 3. Implement feature
// ... write code ...

// 4. Release file ownership
for (const file of filesToEdit) {
  await domain.releaseFileOwnership(file, 'agent-001');
}

// 5. Complete task
await domain.completeTask('agent-001', task.id, {
  success: true,
  output: 'Feature implemented successfully'
});
```

### ultra:team-reviewer (Quality Gate)

```typescript
// 1. Get tasks in review queue
const reviewTasks = domain.getTaskQueue().getTasksByStatus(TaskStatus.REVIEW);

for (const task of reviewTasks) {
  // 2. Review the implementation
  const hasIssues = await reviewImplementation(task);

  if (hasIssues) {
    // 3. Reject with feedback
    await domain.rejectTask(task.id, 'Found 3 security issues');
  } else {
    // 4. Approve
    await domain.approveTask(task.id);
  }
}
```

### ultra:team-debugger (Hypothesis Tester)

```typescript
// 1. Register competing hypotheses
domain.registerAgent('hyp-1', 'team-debugger'); // Theory: Database issue
domain.registerAgent('hyp-2', 'team-debugger'); // Theory: Network issue
domain.registerAgent('hyp-3', 'team-debugger'); // Theory: Memory leak

// 2. Assign same bug task to all
const bugTaskId = await domain.createTask('Fix login timeout', '...');
await domain.assignTask(bugTaskId, 'hyp-1');
await domain.assignTask(bugTaskId, 'hyp-2');
await domain.assignTask(bugTaskId, 'hyp-3');

// 3. All investigate in parallel
// ... each hypothesis tests different theory ...

// 4. First to succeed completes the task
await domain.completeTask('hyp-2', bugTaskId, {
  success: true,
  output: 'Root cause: Network timeout. Fixed by increasing timeout to 5s.'
});

// 5. Other hypotheses automatically cancelled
```

## Task Priorities

```typescript
import { TaskPriority } from './dist/domain/index.js';

await domain.createTask('Critical security fix', '...', {
  priority: TaskPriority.CRITICAL  // 10 - Immediate attention
});

await domain.createTask('High priority feature', '...', {
  priority: TaskPriority.HIGH      // 8 - Next sprint
});

await domain.createTask('Normal task', '...', {
  priority: TaskPriority.NORMAL    // 5 - Backlog
});

await domain.createTask('Low priority refactor', '...', {
  priority: TaskPriority.LOW       // 1 - Whenever
});
```

## Task Tags

```typescript
await domain.createTask('Task with tags', '...', {
  tags: ['security', 'feature', 'frontend', 'urgent']
});

// Tags affect routing and autonomy levels
// 'read' → read operation (low risk)
// 'delete' → delete operation (high risk)
// 'deploy' → deployment (high risk)
// 'config' → configuration change (medium risk)
// 'security' → security-related (critical risk)
```

## Direct Component Access

```typescript
// Access TaskQueue directly
const taskQueue = domain.getTaskQueue();
const nextTask = taskQueue.getNextTask('team-implementer');
const stats = taskQueue.getStats();

// Access FileOwnership directly
const fileOwnership = domain.getFileOwnership();
const lockedFiles = fileOwnership.getLockedFiles();
const stats = fileOwnership.getStats();

// Access AgentBridge directly
const agentBridge = domain.getAgentBridge();
const agents = agentBridge.getActiveAgents();
const capabilities = agentBridge.getAgentCapabilities();

// Access domain-agency (if enabled)
const domainAgency = domain.getDomainAgency();
if (domainAgency) {
  const scheduler = domainAgency.getScheduler();
  const resolver = domainAgency.getConflictResolver();
  const autonomy = domainAgency.getTieredAutonomy();
}
```

## Cleanup

```typescript
// Stop the domain manager
await domain.stop();

// Clear all state (for testing)
domain.clear();

// Remove from memory
domain = null;
```

## Error Handling

```typescript
try {
  await domain.assignTask(taskId, agentId);
} catch (error) {
  if (error.message.includes('too many concurrent tasks')) {
    console.log('Agent at capacity, queueing task...');
  } else if (error.message.includes('not in intake queue')) {
    console.log('Task already assigned');
  }
}

try {
  await domain.acquireFileOwnership(filePath, agentId, ...);
} catch (error) {
  if (error.message.includes('conflict')) {
    console.log('File already owned by another agent');
    // Handle conflict (wait, negotiate, or use alternative)
  }
}
```

## Configuration

```typescript
const domain = createDomainManager({
  taskQueue: {
    maxQueueSize: 1000,
    maxConcurrentPerAgent: 5,
    taskTimeout: 3600000,        // 1 hour
    autoFailStuckTasks: true,
    stuckTaskThreshold: 7200000  // 2 hours
  },
  fileOwnership: {
    autoExpireOwnership: true,
    defaultOwnershipTimeout: 1800000,  // 30 minutes
    maxWaitingAgents: 10,
    enableConflictDetection: true,
    enableAutoResolution: true
  },
  agentBridge: {
    enableConflictDetection: true,
    enableAutoResolution: true,
    enableTieredAutonomy: true,
    maxConcurrentPerAgent: 5
  },
  domainAgency: {
    enabled: true,  // Integrate with domain-agency package
    packagePath: '/path/to/domain-agency'
  }
});
```

---

**Full Documentation**: See `DOMAIN-BRIDGE-COMPLETE.md`

**API Reference**: See JSDoc comments in source files under `src/domain/`

**Examples**: See `skills/` directory for agent-specific workflows
