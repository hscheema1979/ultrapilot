/**
 * PlanWatcher Usage Example
 *
 * This example demonstrates how to use PlanWatcher to monitor
 * `.ultra/plan-final.md` for changes with atomic reading and
 * race-condition-free debouncing.
 */

import {
  createPlanWatcher,
  OperationalPlan,
  PlanTaskStatus
} from '../src/domain/PlanWatcher.js';
import * as path from 'path';

/**
 * Example 1: Basic usage
 */
async function example1_BasicUsage() {
  console.log('\n=== Example 1: Basic PlanWatcher Usage ===\n');

  const planPath = path.join(process.cwd(), '.ultra', 'plan-final.md');

  const watcher = createPlanWatcher(planPath, {
    debounceDelay: 500,
    maxRetries: 3,
    verbose: true
  });

  // Start watching
  watcher.watch((plan: OperationalPlan) => {
    console.log(`\n📋 Plan changed: ${plan.title}`);
    console.log(`   Version: ${plan.version}`);
    console.log(`   Phases: ${plan.phases.length}`);
    console.log(`   Tasks: ${Object.keys(plan.tasks).length}`);
    console.log(`   Status: ${plan.status}`);
    console.log(`   Completion: ${plan.completionPercentage}%`);
    console.log(`   Estimated Hours: ${plan.estimatedHours}`);

    // Show phase breakdown
    for (const phase of plan.phases) {
      console.log(`\n   Phase ${phase.id}: ${phase.title}`);
      console.log(`     - Tasks: ${phase.tasks.length}`);
      console.log(`     - Status: ${phase.status}`);
      console.log(`     - Completion: ${phase.completionPercentage}%`);
    }
  });

  console.log(`Watching: ${planPath}`);
  console.log('Press Ctrl+C to stop\n');

  // Keep running
  process.on('SIGINT', () => {
    console.log('\n\nStopping watcher...\n');
    watcher.unwatch();
    process.exit(0);
  });
}

/**
 * Example 2: Track task progress
 */
async function example2_TrackTaskProgress() {
  console.log('\n=== Example 2: Track Task Progress ===\n');

  const planPath = path.join(process.cwd(), '.ultra', 'plan-final.md');

  let previousPlan: OperationalPlan | null = null;

  const watcher = createPlanWatcher(planPath, { verbose: true });

  watcher.watch((plan: OperationalPlan) => {
    console.log(`\n📊 Plan Update: ${plan.title}`);

    if (previousPlan) {
      // Show task changes
      console.log('\n🔄 Task Changes:');

      for (const [taskId, task] of Object.entries(plan.tasks)) {
        const previousTask = previousPlan.tasks[taskId];

        if (!previousTask) {
          console.log(`   ➕ NEW: ${taskId} - ${task.title}`);
        } else if (task.status !== previousTask.status) {
          console.log(
            `   🔄 ${taskId}: ${previousTask.status} → ${task.status} - ${task.title}`
          );
        }
      }

      // Show completion progress
      if (plan.completionPercentage !== previousPlan.completionPercentage) {
        console.log(
          `\n📈 Progress: ${previousPlan.completionPercentage}% → ${plan.completionPercentage}%`
        );
      }
    }

    // Show current status by task
    console.log('\n📋 Current Task Status:');

    const byStatus: Record<PlanTaskStatus, string[]> = {
      [PlanTaskStatus.PENDING]: [],
      [PlanTaskStatus.IN_PROGRESS]: [],
      [PlanTaskStatus.COMPLETED]: [],
      [PlanTaskStatus.FAILED]: [],
      [PlanTaskStatus.BLOCKED]: []
    };

    for (const task of Object.values(plan.tasks)) {
      byStatus[task.status].push(task.id);
    }

    for (const [status, taskIds] of Object.entries(byStatus)) {
      if (taskIds.length > 0) {
        console.log(`   ${status}: ${taskIds.length} tasks`);
      }
    }

    previousPlan = plan;
  });

  console.log(`Watching: ${planPath}`);
  console.log('Press Ctrl+C to stop\n');

  process.on('SIGINT', () => {
    console.log('\n\nStopping watcher...\n');
    watcher.unwatch();
    process.exit(0);
  });
}

/**
 * Example 3: Integration with UltraLead
 */
async function example3_UltraLeadIntegration() {
  console.log('\n=== Example 3: UltraLead Integration ===\n');

  const planPath = path.join(process.cwd(), '.ultra', 'plan-final.md');

  const watcher = createPlanWatcher(planPath, { verbose: true });

  watcher.watch((plan: OperationalPlan) => {
    console.log(`\n🎯 UltraLead: Monitoring plan "${plan.title}"`);

    // Check for blocked or failed tasks
    const blockedTasks = Object.values(plan.tasks).filter(
      task => task.status === PlanTaskStatus.BLOCKED
    );

    const failedTasks = Object.values(plan.tasks).filter(
      task => task.status === PlanTaskStatus.FAILED
    );

    if (blockedTasks.length > 0) {
      console.log(`\n⚠️  BLOCKED TASKS (${blockedTasks.length}):`);
      for (const task of blockedTasks) {
        console.log(`   - ${task.id}: ${task.title}`);
        console.log(`     File Owner: ${task.fileOwner || 'unassigned'}`);
      }
    }

    if (failedTasks.length > 0) {
      console.log(`\n❌ FAILED TASKS (${failedTasks.length}):`);
      for (const task of failedTasks) {
        console.log(`   - ${task.id}: ${task.title}`);
        console.log(`     Reason: ${task.failureReason || 'Unknown'}`);
        console.log(`     File Owner: ${task.fileOwner || 'unassigned'}`);
      }
    }

    // Show next priority tasks
    const nextTasks = Object.values(plan.tasks)
      .filter(task => task.status === PlanTaskStatus.PENDING)
      .sort((a, b) => {
        // Sort by priority and then by ID
        const priorityOrder = { critical: 0, high: 1, normal: 2, low: 3 };
        const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 2;
        const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 2;

        if (aPriority !== bPriority) {
          return aPriority - bPriority;
        }

        return a.id.localeCompare(b.id);
      })
      .slice(0, 5);

    if (nextTasks.length > 0) {
      console.log('\n🎯 NEXT PRIORITY TASKS:');
      for (const task of nextTasks) {
        console.log(`   - ${task.id}: ${task.title}`);
        console.log(`     Priority: ${task.priority}`);
        console.log(`     File Owner: ${task.fileOwner || 'unassigned'}`);
        console.log(`     Estimated: ${task.estimatedHours}h`);
      }
    }

    // Overall health check
    const health = {
      overall: 'good',
      issues: [] as string[]
    };

    if (plan.completionPercentage === 0) {
      health.issues.push('No tasks completed yet');
    }

    if (blockedTasks.length > 0) {
      health.issues.push(`${blockedTasks.length} blocked tasks`);
      health.overall = 'needs-attention';
    }

    if (failedTasks.length > 0) {
      health.issues.push(`${failedTasks.length} failed tasks`);
      health.overall = 'critical';
    }

    if (plan.completionPercentage > 50 && plan.completionPercentage < 80) {
      health.overall = 'good';
    }

    if (plan.completionPercentage >= 80) {
      health.overall = 'excellent';
    }

    console.log(`\n🏥 DOMAIN HEALTH: ${health.overall.toUpperCase()}`);

    if (health.issues.length > 0) {
      console.log('   Issues:');
      for (const issue of health.issues) {
        console.log(`   - ${issue}`);
      }
    } else {
      console.log('   No issues detected');
    }
  });

  console.log(`Watching: ${planPath}`);
  console.log('Press Ctrl+C to stop\n');

  process.on('SIGINT', () => {
    console.log('\n\nStopping watcher...\n');
    watcher.unwatch();
    process.exit(0);
  });
}

/**
 * Example 4: Error handling
 */
async function example4_ErrorHandling() {
  console.log('\n=== Example 4: Error Handling ===\n');

  const planPath = path.join(process.cwd(), '.ultra', 'plan-final.md');

  const watcher = createPlanWatcher(planPath, { verbose: true });

  // Handle plan changes
  watcher.on('plan:changed', (plan: OperationalPlan) => {
    console.log(`\n✅ Plan loaded: ${plan.title}`);
    console.log(`   Tasks: ${Object.keys(plan.tasks).length}`);
  });

  // Handle parse errors
  watcher.on('plan:parse-error', (error: Error, content: string) => {
    console.error('\n❌ Plan Parse Error:');
    console.error(`   ${error.message}`);
    console.error(`   Content length: ${content.length} bytes`);
  });

  // Handle read errors
  watcher.on('plan:read-error', (error: Error) => {
    console.error('\n❌ Plan Read Error:');
    console.error(`   ${error.message}`);
  });

  // Handle corrupted reads
  watcher.on('plan:corrupted', (attempts: number) => {
    console.warn(`\n⚠️  Plan corrupted, retrying (attempt ${attempts})`);
  });

  watcher.watch(() => {}); // Empty callback since we're using events

  console.log(`Watching: ${planPath}`);
  console.log('Press Ctrl+C to stop\n');

  process.on('SIGINT', () => {
    console.log('\n\nStopping watcher...\n');
    watcher.unwatch();
    process.exit(0);
  });
}

/**
 * Run example
 */
async function main() {
  const example = process.argv[2] || '1';

  switch (example) {
    case '1':
      await example1_BasicUsage();
      break;
    case '2':
      await example2_TrackTaskProgress();
      break;
    case '3':
      await example3_UltraLeadIntegration();
      break;
    case '4':
      await example4_ErrorHandling();
      break;
    default:
      console.log('Usage: npm run example:plan-watcher [1-4]');
      console.log('  1: Basic usage');
      console.log('  2: Track task progress');
      console.log('  3: UltraLead integration');
      console.log('  4: Error handling');
      process.exit(1);
  }
}

main().catch(console.error);
