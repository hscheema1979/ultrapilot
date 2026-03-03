# PlanWatcher Quick Start Guide

## Installation

PlanWatcher is already included in the UltraPilot framework. No additional installation needed.

## Basic Usage

```typescript
import { createPlanWatcher } from './domain/PlanWatcher.js';

// Create watcher
const watcher = createPlanWatcher('.ultra/plan-final.md', {
  debounceDelay: 500,    // Wait 500ms after last change
  verbose: true          // Enable logging
});

// Start watching
watcher.watch((plan) => {
  console.log(`Plan updated: ${plan.title}`);
  console.log(`Tasks: ${Object.keys(plan.tasks).length}`);
  console.log(`Completion: ${plan.completionPercentage}%`);
});

// Stop watching when done
watcher.unwatch();
```

## Plan File Format

```markdown
# Project Implementation Plan

## Overview

Brief description of the project.

## Phase 1: Foundation (Week 1)

### Task 1.1: Initialize Project
**File Owner:** agent-1
**Estimated:** 4 hours
**Status:** pending
**Priority:** high

Initialize the project with all dependencies.

**Deliverables:**
- Package.json
- TypeScript config
- Build setup

**Success Criteria:**
- Project builds successfully
- All tests pass

### Task 1.2: Setup CI/CD
**File Owner:** agent-2
**Estimated:** 2 hours
**Status:** in-progress

Setup continuous integration.

## Phase 2: Development (Week 2)

### Task 2.1: Implement Feature A
**File Owner:** agent-3
**Estimated:** 8 hours
**Status:** completed

Feature A implementation.
```

## Monitoring Task Progress

```typescript
watcher.on('plan:changed', (plan) => {
  // Find blocked tasks
  const blockedTasks = Object.values(plan.tasks).filter(
    task => task.status === 'blocked'
  );

  if (blockedTasks.length > 0) {
    console.log('Blocked tasks detected:');
    blockedTasks.forEach(task => {
      console.log(`  - ${task.id}: ${task.title}`);
      console.log(`    Owner: ${task.fileOwner}`);
    });
  }

  // Show completion by phase
  plan.phases.forEach(phase => {
    console.log(`Phase ${phase.id}: ${phase.completionPercentage}% complete`);
  });
});
```

## Error Handling

```typescript
watcher.on('plan:parse-error', (error, content) => {
  console.error('Failed to parse plan:', error.message);
  console.error('Content length:', content.length);
});

watcher.on('plan:read-error', (error) => {
  console.error('Failed to read plan:', error.message);
});

watcher.on('plan:corrupted', (attempts) => {
  console.warn(`Plan corrupted, retrying (attempt ${attempts})`);
});
```

## Integration with UltraLead

```typescript
class UltraLead {
  private planWatcher?: PlanWatcher;

  async startMonitoring() {
    this.planWatcher = createPlanWatcher('.ultra/plan-final.md');

    this.planWatcher.watch((plan) => {
      // Update domain health
      this.updateHealth(plan);

      // Check for issues
      this.checkForIssues(plan);

      // Report to owner
      this.reportProgress(plan);
    });
  }

  private checkForIssues(plan: OperationalPlan) {
    const issues = [];

    // Check for blocked tasks
    const blockedTasks = Object.values(plan.tasks).filter(
      t => t.status === PlanTaskStatus.BLOCKED
    );

    if (blockedTasks.length > 0) {
      issues.push(`${blockedTasks.length} blocked tasks`);
    }

    // Check for failed tasks
    const failedTasks = Object.values(plan.tasks).filter(
      t => t.status === PlanTaskStatus.FAILED
    );

    if (failedTasks.length > 0) {
      issues.push(`${failedTasks.length} failed tasks`);
    }

    // Take action if issues found
    if (issues.length > 0) {
      this.handleIssues(issues);
    }
  }
}
```

## Configuration Options

```typescript
const watcher = createPlanWatcher('.ultra/plan-final.md', {
  debounceDelay: 500,        // Debounce delay (ms)
  maxRetries: 3,             // Max retry attempts
  retryDelay: 100,           // Retry delay (ms)
  verbose: true,             // Enable logging
  tmpSuffix: '.tmp',         // Temp file suffix
  enableChecksum: true       // Validate checksums
});
```

## API Reference

### Methods

- `watch(onChange)` - Start watching plan file
- `unwatch()` - Stop watching
- `getCurrentPlan()` - Get current plan
- `isActive()` - Check if watching
- `getStats()` - Get statistics

### Events

- `plan:changed` - Plan updated successfully
- `plan:parse-error` - Plan parsing failed
- `plan:read-error` - Plan reading failed
- `plan:corrupted` - Plan corrupted, retrying

## Best Practices

1. **Use debouncing** to avoid excessive parsing during rapid changes
2. **Enable checksums** to avoid re-parsing identical content
3. **Handle errors** to prevent crashes on malformed plans
4. **Check status** before accessing plan data
5. **Clean up** by calling `unwatch()` when done

## Troubleshooting

### Plan not updating

- Check file path is correct
- Verify file permissions
- Enable verbose logging
- Check for temporary file (`.tmp`)

### Parse errors

- Verify plan format matches schema
- Check for special characters
- Validate task IDs are unique
- Ensure phase IDs are consistent

### Performance issues

- Increase debounce delay
- Disable verbose logging
- Reduce file watch frequency
- Use checksum validation

## Example Projects

See `/home/ubuntu/hscheema1979/ultrapilot/examples/PlanWatcher.example.ts` for complete examples:
- Basic usage
- Track task progress
- UltraLead integration
- Error handling

## Support

For issues or questions:
- Check test file: `/tests/domain/PlanWatcher.test.ts`
- Review implementation: `/src/domain/PlanWatcher.ts`
- Read completion summary: `/TASK-2.1b-COMPLETION-SUMMARY.md`
