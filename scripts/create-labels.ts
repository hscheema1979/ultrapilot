#!/usr/bin/env tsx
/**
 * GitHub Label Schema Creator for Ultrapilot
 *
 * Creates 44 labels for the ultra-workspace repository with proper colors,
 * descriptions, and categories. Script is idempotent - safe to run multiple times.
 *
 * Usage:
 *   GITHUB_TOKEN=your_token npx tsx scripts/create-labels.ts
 */

import { Octokit } from 'octokit';

// ============================================================================
// TYPES
// ============================================================================

interface Label {
  name: string;
  color: string;
  description: string;
}

interface LabelOperation {
  name: string;
  action: 'created' | 'updated' | 'skipped';
  color: string;
  description: string;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const REPO_OWNER = 'hscheema1979';
const REPO_NAME = 'ultra-workspace';

// ============================================================================
// LABEL SCHEMA (44 labels total)
// ============================================================================

const LABELS: Label[] = [
  // ===== Queue Labels (6) =====
  {
    name: 'queue:intake',
    color: '0052CC',
    description: 'New tasks awaiting initial review and triage'
  },
  {
    name: 'queue:active',
    color: 'FFC107',
    description: 'Currently being worked on by an agent'
  },
  {
    name: 'queue:review',
    color: 'FF9800',
    description: 'Awaiting review or validation'
  },
  {
    name: 'queue:done',
    color: '4CAF50',
    description: 'Successfully completed'
  },
  {
    name: 'queue:failed',
    color: 'F44336',
    description: 'Failed execution, needs debugging'
  },
  {
    name: 'queue:blocked',
    color: '9E9E9E',
    description: 'Blocked by dependencies or external factors'
  },

  // ===== Phase Labels (7) =====
  {
    name: 'phase:0',
    color: '6200EA',
    description: 'Phase 0: Requirements expansion & architecture design'
  },
  {
    name: 'phase:1',
    color: '7C4DFF',
    description: 'Phase 1: Planning & validation'
  },
  {
    name: 'phase:2',
    color: '9575CD',
    description: 'Phase 2: Parallel execution with file ownership'
  },
  {
    name: 'phase:3',
    color: 'B388FF',
    description: 'Phase 3: QA cycles (build, test, fix, repeat)'
  },
  {
    name: 'phase:4',
    color: 'D1C4E9',
    description: 'Phase 4: Multi-perspective validation'
  },
  {
    name: 'phase:5',
    color: 'EDE7F6',
    description: 'Phase 5: Evidence-backed verification'
  },
  {
    name: 'phase:cleanup',
    color: 'F3E5F5',
    description: 'Phase cleanup: Finalize and archive'
  },

  // ===== Agent Labels (18) =====
  // Core orchestration
  {
    name: 'agent:analyst',
    color: '00BCD4',
    description: 'Requirements extraction and analysis (Opus)'
  },
  {
    name: 'agent:architect',
    color: '00BCD4',
    description: 'System architecture design (Opus)'
  },
  {
    name: 'agent:planner',
    color: '00BCD4',
    description: 'Implementation planning (Opus)'
  },
  {
    name: 'agent:critic',
    color: '00BCD4',
    description: 'Plan validation and critique (Opus)'
  },

  // Executor tiers
  {
    name: 'agent:executor-low',
    color: '00BCD4',
    description: 'Simple task execution (Haiku)'
  },
  {
    name: 'agent:executor',
    color: '00BCD4',
    description: 'Standard task execution (Sonnet)'
  },
  {
    name: 'agent:executor-high',
    color: '00BCD4',
    description: 'Complex task execution (Opus)'
  },

  // Quality & testing
  {
    name: 'agent:test-engineer',
    color: '00BCD4',
    description: 'Test strategy and implementation (Sonnet)'
  },
  {
    name: 'agent:verifier',
    color: '00BCD4',
    description: 'Evidence verification and validation (Sonnet)'
  },

  // Review agents
  {
    name: 'agent:security-reviewer',
    color: '00BCD4',
    description: 'Security audit and vulnerability assessment (Sonnet)'
  },
  {
    name: 'agent:quality-reviewer',
    color: '00BCD4',
    description: 'Performance and quality review (Sonnet)'
  },
  {
    name: 'agent:code-reviewer',
    color: '00BCD4',
    description: 'Comprehensive code review (Opus)'
  },

  // Debugging & analysis
  {
    name: 'agent:debugger',
    color: '00BCD4',
    description: 'Root cause analysis and debugging (Sonnet)'
  },
  {
    name: 'agent:scientist',
    color: '00BCD4',
    description: 'Data analysis and hypothesis testing (Sonnet)'
  },

  // Support agents
  {
    name: 'agent:build-fixer',
    color: '00BCD4',
    description: 'Build and toolchain issue resolution (Sonnet)'
  },
  {
    name: 'agent:designer',
    color: '00BCD4',
    description: 'UX/UI architecture and design (Sonnet)'
  },
  {
    name: 'agent:writer',
    color: '00BCD4',
    description: 'Documentation and content creation (Haiku)'
  },

  // Team agents (parallel execution)
  {
    name: 'agent:team-lead',
    color: '00BCD4',
    description: 'Team orchestration and coordination (Opus)'
  },
  {
    name: 'agent:team-implementer',
    color: '00BCD4',
    description: 'Parallel implementation with file ownership (Sonnet)'
  },
  {
    name: 'agent:team-reviewer',
    color: '00BCD4',
    description: 'Multi-dimensional review (Sonnet)'
  },
  {
    name: 'agent:team-debugger',
    color: '00BCD4',
    description: 'Hypothesis-driven parallel debugging (Sonnet)'
  },

  // ===== Type Labels (10) =====
  {
    name: 'type:feature',
    color: '3F51B5',
    description: 'New feature or enhancement'
  },
  {
    name: 'type:bug',
    color: '3F51B5',
    description: 'Bug fix or error correction'
  },
  {
    name: 'type:design',
    color: '3F51B5',
    description: 'Design or UX/UI work'
  },
  {
    name: 'type:test',
    color: '3F51B5',
    description: 'Test implementation or enhancement'
  },
  {
    name: 'type:review',
    color: '3F51B5',
    description: 'Code review or audit'
  },
  {
    name: 'type:chore',
    color: '3F51B5',
    description: 'Maintenance or routine task'
  },
  {
    name: 'type:doc',
    color: '3F51B5',
    description: 'Documentation update'
  },
  {
    name: 'type:refactor',
    color: '3F51B5',
    description: 'Code refactoring or restructuring'
  },
  {
    name: 'type:performance',
    color: '3F51B5',
    description: 'Performance optimization'
  },
  {
    name: 'type:security',
    color: '3F51B5',
    description: 'Security improvement or fix'
  },

  // ===== Priority Labels (4) =====
  {
    name: 'priority:critical',
    color: 'D32F2F',
    description: 'Critical priority - immediate attention required'
  },
  {
    name: 'priority:high',
    color: 'F57C00',
    description: 'High priority - urgent'
  },
  {
    name: 'priority:medium',
    color: 'FFA000',
    description: 'Medium priority - normal workflow'
  },
  {
    name: 'priority:low',
    color: '1976D2',
    description: 'Low priority - backlog item'
  },

  // ===== Special Labels (3) =====
  {
    name: 'handoff',
    color: '9C27B0',
    description: 'Work being handed off between agents or phases'
  },
  {
    name: 'epic',
    color: 'E040FB',
    description: 'Large work item spanning multiple issues/tasks'
  },
  {
    name: 'dependency',
    color: '009688',
    description: 'Blocked by or blocking another issue/PR'
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Exponential backoff with jitter for rate limiting
 */
async function backoff(attempt: number): Promise<void> {
  const baseDelay = 1000; // 1 second
  const maxDelay = 10000; // 10 seconds
  const jitter = Math.random() * 1000; // 0-1 second random jitter
  const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay) + jitter;

  console.log(`  ⏳ Rate limited, waiting ${Math.round(delay / 1000)}s...`);
  await sleep(delay);
}

/**
 * Execute an operation with retry logic
 */
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 5,
  context = 'operation'
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      if (error.status === 403 && error.headers?.['x-ratelimit-remaining'] === '0') {
        // Rate limited
        if (attempt < maxRetries - 1) {
          await backoff(attempt);
          continue;
        }
      }
      throw error;
    }
  }
  throw new Error(`${context} failed after ${maxRetries} retries`);
}

/**
 * Convert hex color to uppercase if needed
 */
function normalizeColor(color: string): string {
  return color.toUpperCase();
}

/**
 * Check if label configuration matches
 */
function labelMatches(existing: any, desired: Label): boolean {
  const existingColor = normalizeColor(existing.color);
  const desiredColor = normalizeColor(desired.color);

  return existingColor === desiredColor &&
         existing.description === desired.description;
}

// ============================================================================
// LABEL OPERATIONS
// ============================================================================

/**
 * Get all existing labels from repository
 */
async function getExistingLabels(octokit: Octokit): Promise<Map<string, any>> {
  console.log('\n📋 Fetching existing labels...');

  const labels = await withRetry(
    () => octokit.rest.issues.listLabels({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      per_page: 100
    }),
    3,
    'fetch labels'
  );

  const labelMap = new Map();
  for (const label of labels.data) {
    labelMap.set(label.name, label);
  }

  console.log(`  ✓ Found ${labelMap.size} existing labels`);
  return labelMap;
}

/**
 * Create or update a single label
 */
async function createOrUpdateLabel(
  octokit: Octokit,
  label: Label,
  existingLabels: Map<string, any>
): Promise<LabelOperation> {
  const existing = existingLabels.get(label.name);

  if (!existing) {
    // Create new label
    await withRetry(
      () => octokit.rest.issues.createLabel({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        name: label.name,
        color: label.color,
        description: label.description
      }),
      3,
      `create label ${label.name}`
    );

    return {
      name: label.name,
      action: 'created',
      color: label.color,
      description: label.description
    };
  }

  // Check if update needed
  if (!labelMatches(existing, label)) {
    await withRetry(
      () => octokit.rest.issues.updateLabel({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        name: label.name,
        color: label.color,
        description: label.description
      }),
      3,
      `update label ${label.name}`
    );

    return {
      name: label.name,
      action: 'updated',
      color: label.color,
      description: label.description
    };
  }

  // No change needed
  return {
    name: label.name,
    action: 'skipped',
    color: label.color,
    description: label.description
  };
}

/**
 * Process all labels
 */
async function processLabels(octokit: Octokit): Promise<LabelOperation[]> {
  console.log('\n🏷️  Processing labels...');

  const existingLabels = await getExistingLabels(octokit);
  const operations: LabelOperation[] = [];

  for (const label of LABELS) {
    try {
      const operation = await createOrUpdateLabel(octokit, label, existingLabels);
      operations.push(operation);

      const emoji = operation.action === 'created' ? '✨' :
                   operation.action === 'updated' ? '🔄' : '✓';
      console.log(`  ${emoji} ${operation.action}: ${label.name}`);
    } catch (error: any) {
      console.error(`  ❌ Error processing ${label.name}:`, error.message);
      throw error;
    }
  }

  return operations;
}

/**
 * Print summary of operations
 */
function printSummary(operations: LabelOperation[]): void {
  const created = operations.filter(op => op.action === 'created').length;
  const updated = operations.filter(op => op.action === 'updated').length;
  const skipped = operations.filter(op => op.action === 'skipped').length;

  console.log('\n' + '='.repeat(60));
  console.log('📊 LABEL CREATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Repository: ${REPO_OWNER}/${REPO_NAME}`);
  console.log(`Total labels in schema: ${LABELS.length}`);
  console.log('');
  console.log(`✨ Created:  ${created}`);
  console.log(`🔄 Updated:  ${updated}`);
  console.log(`✓ Skipped:  ${skipped} (already correct)`);
  console.log('');
  console.log(`Total processed: ${operations.length}`);
  console.log('='.repeat(60));

  // Print breakdown by category
  console.log('\n📁 Label Categories:');
  console.log('  Queue Labels:    6');
  console.log('  Phase Labels:    7');
  console.log('  Agent Labels:    22');
  console.log('  Type Labels:     10');
  console.log('  Priority Labels: 4');
  console.log('  Special Labels:  3');
  console.log('  ─────────────   ──');
  console.log('  Total:           44');
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main(): Promise<void> {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    console.error('❌ Error: GITHUB_TOKEN environment variable not set');
    console.error('\nUsage: GITHUB_TOKEN=your_token npx tsx scripts/create-labels.ts');
    process.exit(1);
  }

  console.log('='.repeat(60));
  console.log('🏷️  GitHub Label Schema Creator');
  console.log('   Ultrapilot Repository Label Setup');
  console.log('='.repeat(60));

  const octokit = new Octokit({
    auth: token
  });

  try {
    // Verify repository access
    console.log(`\n🔍 Verifying access to ${REPO_OWNER}/${REPO_NAME}...`);
    await withRetry(
      () => octokit.rest.repos.get({
        owner: REPO_OWNER,
        repo: REPO_NAME
      }),
      3,
      'verify repository access'
    );
    console.log('  ✓ Repository access confirmed');

    // Process all labels
    const operations = await processLabels(octokit);

    // Print summary
    printSummary(operations);

    console.log('\n✅ Label schema setup complete!\n');

  } catch (error: any) {
    console.error('\n❌ Fatal error:', error.message);
    if (error.status) {
      console.error(`   Status: ${error.status}`);
    }
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

export { main, LABELS };
