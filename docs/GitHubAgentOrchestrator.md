# GitHubAgentOrchestrator

Manages parallel agent execution with file ownership tracking using GitHub as the coordination backend.

## Overview

The `GitHubAgentOrchestrator` provides a robust system for coordinating multiple AI agents working in parallel on a codebase, with built-in conflict prevention through file ownership tracking.

## Key Features

### File Ownership Registry
- Track which agent owns which file
- Prevent conflicts by claiming files before work
- Automatic release when work is complete
- Persistent storage via GitHub issues

### Parallel Execution
- Coordinate multiple agents simultaneously
- Configurable concurrency limits
- Automatic retry on failure
- Timeout handling

### Performance Optimizations
- In-memory caching with 30-second TTL
- Batch operations (5-second persistence interval)
- Target: < 100ms for claim/release operations
- Async GitHub synchronization

## Installation

```typescript
import { GitHubAgentOrchestrator } from './services/github-agent-orchestrator.js';
import { GitHubService } from './services/github-service.js';
import { GitHubStateAdapter } from './services/github-state-adapter.js';
import { GitHubTaskQueueAdapter } from './services/github-task-queue-adapter.js';
```

## Quick Start

```typescript
// Initialize services
const github = new GitHubService({
  owner: 'my-org',
  repo: 'my-project',
  token: process.env.GITHUB_TOKEN
});

const state = new GitHubStateAdapter(github);
const queue = new GitHubTaskQueueAdapter(github, state);

// Create orchestrator
const orchestrator = new GitHubAgentOrchestrator(
  github,
  state,
  queue,
  {
    maxParallel: 3,
    agentTimeout: 300000
  }
);

// Claim files before work
await orchestrator.claimFile('agent-001', '/src/service.ts');

// Release when done
await orchestrator.releaseFile('agent-001', '/src/service.ts');

// Cleanup
await orchestrator.cleanup();
```

## API Reference

### Constructor

```typescript
constructor(
  github: GitHubService,
  state: GitHubStateAdapter,
  queue: GitHubTaskQueueAdapter,
  config?: OrchestratorConfig
)
```

**Config Options:**
- `maxParallel`: Maximum parallel agents (default: 3)
- `agentTimeout`: Agent timeout in ms (default: 300000)
- `maxRetries`: Maximum retry attempts (default: 3)
- `cacheTTL`: Cache time-to-live in ms (default: 30000)
- `batchPersistInterval`: Batch persistence interval in ms (default: 5000)
- `ownershipIssueTitle`: Title of ownership tracking issue (default: 'ultrapilot-file-ownership')

### File Ownership Methods

#### `claimFile(agentId: string, filePath: string): Promise<boolean>`

Claim ownership of a file for an agent.

**Returns:** `true` if claim successful, `false` if file already owned

**Example:**
```typescript
const claimed = await orchestrator.claimFile(
  'agent-auth-service',
  '/src/services/auth.ts'
);

if (!claimed) {
  console.log('File already owned by another agent');
}
```

#### `releaseFile(agentId: string, filePath: string): Promise<void>`

Release ownership of a file.

**Example:**
```typescript
await orchestrator.releaseFile('agent-auth-service', '/src/services/auth.ts');
```

#### `getOwner(filePath: string): Promise<string | null>`

Get the current owner of a file.

**Returns:** Agent ID or `null` if unowned

**Example:**
```typescript
const owner = await orchestrator.getOwner('/src/services/auth.ts');
console.log(`File owned by: ${owner}`);
```

#### `claimFiles(agentId: string, filePaths: string[]): Promise<{ [path: string]: boolean }>`

Batch claim multiple files.

**Returns:** Object mapping file paths to claim success

**Example:**
```typescript
const results = await orchestrator.claimFiles('agent-001', [
  '/src/file1.ts',
  '/src/file2.ts',
  '/src/file3.ts'
]);

for (const [path, claimed] of Object.entries(results)) {
  console.log(`${path}: ${claimed ? 'claimed' : 'failed'}`);
}
```

#### `releaseFiles(agentId: string, filePaths: string[]): Promise<void>`

Batch release multiple files.

**Example:**
```typescript
await orchestrator.releaseFiles('agent-001', [
  '/src/file1.ts',
  '/src/file2.ts',
  '/src/file3.ts'
]);
```

#### `getAgentFiles(agentId: string): Promise<string[]>`

Get all files owned by a specific agent.

**Returns:** Array of file paths

**Example:**
```typescript
const files = await orchestrator.getAgentFiles('agent-auth-service');
console.log(`Agent owns ${files.length} files`);
```

#### `transferFile(fromAgentId: string, toAgentId: string, filePath: string): Promise<boolean>`

Transfer file ownership from one agent to another.

**Returns:** `true` if transfer successful

**Example:**
```typescript
const transferred = await orchestrator.transferFile(
  'agent-designer',
  'agent-implementer',
  '/src/components/button.tsx'
);
```

### Agent Execution Methods

#### `spawnAgent(agentType: string, task: Task): Promise<AgentResult>`

Spawn a single agent to execute a task.

**Returns:** Agent execution result

**Example:**
```typescript
const task = {
  id: 'task-auth',
  agent: 'ultra:executor',
  description: 'Implement authentication',
  files: ['/src/services/auth.ts']
};

const result = await orchestrator.spawnAgent('ultra:executor', task);

if (result.success) {
  console.log(`Task completed: ${result.output}`);
} else {
  console.log(`Task failed: ${result.error}`);
}
```

#### `coordinateParallel(tasks: Task[], maxParallel?: number): Promise<AgentResult[]>`

Coordinate parallel execution of multiple tasks.

**Returns:** Array of agent results

**Example:**
```typescript
const tasks = [
  {
    id: 'task-1',
    agent: 'ultra:executor',
    description: 'Implement auth service',
    files: ['/src/services/auth.ts']
  },
  {
    id: 'task-2',
    agent: 'ultra:executor',
    description: 'Implement user service',
    files: ['/src/services/user.ts']
  },
  {
    id: 'task-3',
    agent: 'ultra:test-engineer',
    description: 'Write tests',
    files: ['/tests/auth.test.ts']
  }
];

const results = await orchestrator.coordinateParallel(tasks, 2);

const successful = results.filter(r => r.success).length;
console.log(`${successful}/${results.length} tasks succeeded`);
```

### Monitoring Methods

#### `getActiveAgents(): ActiveAgent[]`

Get all currently active agents.

**Returns:** Array of active agent information

**Example:**
```typescript
const active = orchestrator.getActiveAgents();
console.log(`Active agents: ${active.length}`);

for (const agent of active) {
  const elapsed = Date.now() - agent.startTime;
  console.log(`  ${agent.id}: ${agent.taskId} (${elapsed}ms)`);
}
```

#### `getOwnershipState(): Promise<FileOwnershipMap>`

Get current ownership state.

**Returns:** Object mapping file paths to agent IDs

**Example:**
```typescript
const state = await orchestrator.getOwnershipState();

for (const [path, agentId] of Object.entries(state)) {
  console.log(`${path} -> ${agentId}`);
}
```

#### `getOwnershipStats(): Promise<OwnershipStats>`

Get ownership statistics.

**Returns:** Statistics object with total files, agent counts, and pending changes

**Example:**
```typescript
const stats = await orchestrator.getOwnershipStats();

console.log(`Total files: ${stats.totalFiles}`);
console.log(`Pending changes: ${stats.pendingChanges}`);
console.log(`Agent counts:`);

for (const [agentId, count] of Object.entries(stats.agentCounts)) {
  console.log(`  ${agentId}: ${count} files`);
}
```

### Utility Methods

#### `forcePersistence(): Promise<void>`

Force immediate persistence of ownership data to GitHub.

**Example:**
```typescript
// Ensure all changes are saved
await orchestrator.forcePersistence();
```

#### `resetOwnership(): Promise<void>`

Reset all ownership claims (clear all file ownership).

**Example:**
```typescript
// Start fresh
await orchestrator.resetOwnership();
```

#### `cleanup(): Promise<void>`

Clean up resources (timers, pending operations).

**Example:**
```typescript
try {
  // Use orchestrator
} finally {
  await orchestrator.cleanup();
}
```

## Data Structures

### Task

```typescript
interface Task {
  id: string;
  agent: string;
  description: string;
  files?: string[];
}
```

### AgentResult

```typescript
interface AgentResult {
  agentId: string;
  taskId: string;
  success: boolean;
  output?: string;
  error?: string;
  duration: number;
}
```

### FileOwnershipMap

```typescript
interface FileOwnershipMap {
  [filePath: string]: string; // filePath -> agentId
}
```

### OwnershipStats

```typescript
interface OwnershipStats {
  totalFiles: number;
  agentCounts: { [agentId: string]: number };
  pendingChanges: number;
}
```

## File Ownership Storage

File ownership is stored in a GitHub issue with YAML frontmatter:

```yaml
---
type: file_ownership
version: 1
---
/src/services/auth.ts: agent-001
/src/middleware/auth.ts: agent-001
/src/models/user.ts: agent-002
/src/repositories/user-repo.ts: agent-002
```

## Performance Characteristics

### Claim/Release Operations
- **Target:** < 100ms
- **With cache:** ~5-10ms
- **Without cache:** ~200-500ms (GitHub API latency)

### Caching Strategy
- In-memory cache with 30-second TTL
- Automatic refresh on expiration
- Lazy loading on first access

### Batch Persistence
- Changes queued in memory
- Persisted every 5 seconds
- Immediate persistence available via `forcePersistence()`

### Parallel Execution
- Configurable concurrency limits
- Automatic agent lifecycle management
- Timeout and retry handling

## Error Handling

### Claim Failures
```typescript
const claimed = await orchestrator.claimFile('agent-001', '/src/file.ts');

if (!claimed) {
  const owner = await orchestrator.getOwner('/src/file.ts');
  console.log(`File owned by: ${owner}`);
  // Handle conflict
}
```

### Agent Execution Failures
```typescript
const result = await orchestrator.spawnAgent('ultra:executor', task);

if (!result.success) {
  console.error(`Task failed: ${result.error}`);
  // Retry or handle error
}
```

### Automatic Retry
Agents are automatically retried up to 3 times with exponential backoff:

```typescript
// Retry 1: immediate
// Retry 2: 2 second delay
// Retry 3: 4 second delay
```

## Best Practices

### 1. Always Claim Before Work
```typescript
// Good
await orchestrator.claimFile(agentId, filePath);
// ... work on file ...
await orchestrator.releaseFile(agentId, filePath);

// Bad - no ownership claim
// ... work on file ... // Might conflict!
```

### 2. Use Batch Operations
```typescript
// Good - batch
await orchestrator.claimFiles(agentId, [
  '/src/file1.ts',
  '/src/file2.ts',
  '/src/file3.ts'
]);

// Bad - individual claims
await orchestrator.claimFile(agentId, '/src/file1.ts');
await orchestrator.claimFile(agentId, '/src/file2.ts');
await orchestrator.claimFile(agentId, '/src/file3.ts');
```

### 3. Always Cleanup
```typescript
try {
  await orchestrator.claimFile(agentId, filePath);
  // ... work ...
} finally {
  await orchestrator.releaseFile(agentId, filePath);
}
```

### 4. Monitor Progress
```typescript
// Check active agents
const active = orchestrator.getActiveAgents();

// Get ownership stats
const stats = await orchestrator.getOwnershipStats();

// Force persistence if needed
await orchestrator.forcePersistence();
```

### 5. Handle Transfers Gracefully
```typescript
const transferred = await orchestrator.transferFile(
  fromAgent,
  toAgent,
  filePath
);

if (!transferred) {
  // Handle transfer failure
  console.log('Transfer failed - file not owned by sender');
}
```

## Testing

See `/src/services/__tests__/github-agent-orchestrator.test.ts` for comprehensive tests.

Run tests:
```bash
npm test -- github-agent-orchestrator
```

## Examples

See `/src/services/examples/github-agent-orchestrator.example.ts` for usage examples.

## Integration

The orchestrator integrates with:
- `GitHubService` - GitHub API operations
- `GitHubStateAdapter` - State persistence
- `GitHubTaskQueueAdapter` - Task management
- `Agent` tool (future) - Agent spawning

## License

MIT
