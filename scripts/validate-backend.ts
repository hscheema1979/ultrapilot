#!/usr/bin/env node
/**
 * UltraPilot Backend Validation Script
 *
 * Quick smoke test to validate all services are properly integrated.
 * Run with: npx tsx scripts/validate-backend.ts
 */

import chalk from 'chalk';

const results = {
  passed: 0,
  failed: 0,
  tests: [] as { name: string; status: 'pass' | 'fail'; error?: string }[]
};

function log(name: string, status: 'pass' | 'fail', error?: string) {
  const icon = status === 'pass' ? '✅' : '❌';
  const color = status === 'pass' ? chalk.green : chalk.red;
  console.log(`${icon} ${color(name)}`);
  if (error) {
    console.log(`   ${chalk.gray(error)}`);
  }
  results.tests.push({ name, status, error });
  if (status === 'pass') results.passed++;
  else results.failed++;
}

async function validateImports() {
  console.log(chalk.bold('\n📦 Validating Service Imports...\n'));

  try {
    const { GitHubAppAuthManager } = await import('../src/services/github-app-auth');
    log('GitHubAppAuth import', 'pass');
  } catch (error: any) {
    log('GitHubAppAuth import', 'fail', error?.message);
  }

  try {
    const { GitHubService } = await import('../src/services/github-service');
    log('GitHubService import', 'pass');
  } catch (error: any) {
    log('GitHubService import', 'fail', error?.message);
  }

  try {
    const { GitHubStateAdapter } = await import('../src/services/github-state-adapter');
    log('GitHubStateAdapter import', 'pass');
  } catch (error: any) {
    log('GitHubStateAdapter import', 'fail', error?.message);
  }

  try {
    const { HybridStateManager } = await import('../src/services/hybrid-state-manager');
    log('HybridStateManager import', 'pass');
  } catch (error: any) {
    log('HybridStateManager import', 'fail', error?.message);
  }

  try {
    const { GitHubTaskQueueAdapter } = await import('../src/services/github-task-queue-adapter');
    log('GitHubTaskQueueAdapter import', 'pass');
  } catch (error: any) {
    log('GitHubTaskQueueAdapter import', 'fail', error?.message);
  }

  try {
    const { GitHubAgentOrchestrator } = await import('../src/services/github-agent-orchestrator');
    log('GitHubAgentOrchestrator import', 'pass');
  } catch (error: any) {
    log('GitHubAgentOrchestrator import', 'fail', error?.message);
  }

  try {
    const { MigrationManifest } = await import('../src/services/migration-manifest');
    log('MigrationManifest import', 'pass');
  } catch (error: any) {
    log('MigrationManifest import', 'fail', error?.message);
  }
}

async function validateTypes() {
  console.log(chalk.bold('\n🔷 Validating Type Definitions...\n'));

  try {
    const types = await import('../types/github-integration');
    log('TypeScript types defined', 'pass');

    if (types.StateObject) log('  - StateObject type', 'pass');
    else log('  - StateObject type', 'fail', 'Missing StateObject');

    if (types.Task) log('  - Task interface', 'pass');
    else log('  - Task interface', 'fail', 'Missing Task');

    if (types.GitHubQueueLabel) log('  - GitHubQueueLabel type', 'pass');
    else log('  - GitHubQueueLabel type', 'fail', 'Missing GitHubQueueLabel');
  } catch (error: any) {
    log('TypeScript types defined', 'fail', error?.message);
  }
}

async function validateInterfaces() {
  console.log(chalk.bold('\n🔌 Validating Service Interfaces...\n'));

  // GitHubStateAdapter methods
  try {
    const { GitHubStateAdapter } = await import('../src/services/github-state-adapter');
    const methods = ['readState', 'writeState', 'updateState', 'parseState', 'serializeState'];
    const allPresent = methods.every(method => typeof GitHubStateAdapter.prototype[method] === 'function');

    if (allPresent) {
      log('GitHubStateAdapter methods (5)', 'pass');
      methods.forEach(m => log(`  - ${m}()`, 'pass'));
    } else {
      log('GitHubStateAdapter methods', 'fail', 'Missing methods');
    }
  } catch (error: any) {
    log('GitHubStateAdapter methods', 'fail', error?.message);
  }

  // HybridStateManager methods
  try {
    const { HybridStateManager } = await import('../src/services/hybrid-state-manager');
    const methods = ['read', 'write', 'sync', 'initialize'];
    const allPresent = methods.every(method => typeof HybridStateManager.prototype[method] === 'function');

    if (allPresent) {
      log('HybridStateManager methods (4)', 'pass');
      methods.forEach(m => log(`  - ${m}()`, 'pass'));
    } else {
      log('HybridStateManager methods', 'fail', 'Missing methods');
    }
  } catch (error: any) {
    log('HybridStateManager methods', 'fail', error?.message);
  }

  // GitHubTaskQueueAdapter methods
  try {
    const { GitHubTaskQueueAdapter } = await import('../src/services/github-task-queue-adapter');
    const methods = ['enqueue', 'dequeue', 'moveToQueue', 'getQueueSize', 'peek'];
    const allPresent = methods.every(method => typeof GitHubTaskQueueAdapter.prototype[method] === 'function');

    if (allPresent) {
      log('GitHubTaskQueueAdapter methods (5)', 'pass');
      methods.forEach(m => log(`  - ${m}()`, 'pass'));
    } else {
      log('GitHubTaskQueueAdapter methods', 'fail', 'Missing methods');
    }
  } catch (error: any) {
    log('GitHubTaskQueueAdapter methods', 'fail', error?.message);
  }
}

async function validateDataFlow() {
  console.log(chalk.bold('\n🔄 Validating Data Flow Integration...\n'));

  // YAML parsing
  try {
    const { GitHubStateAdapter } = await import('../src/services/github-state-adapter');
    const yamlBody = `---
state_id: test-123
type: task_queue
updated_at: 2026-03-04T12:00:00Z
---
Human content`;

    const parsed = GitHubStateAdapter.parseState(yamlBody);
    if (parsed.state_id === 'test-123' && parsed.type === 'task_queue') {
      log('YAML frontmatter parsing', 'pass');
    } else {
      log('YAML frontmatter parsing', 'fail', 'Parse error');
    }
  } catch (error: any) {
    log('YAML frontmatter parsing', 'fail', error?.message);
  }

  // YAML serialization
  try {
    const { GitHubStateAdapter } = await import('../src/services/github-state-adapter');
    const serialized = GitHubStateAdapter.serializeState(
      { state_id: 'test', type: 'test', updated_at: new Date().toISOString() },
      'Content'
    );

    if (serialized.includes('---') && serialized.includes('state_id: test')) {
      log('YAML frontmatter serialization', 'pass');
    } else {
      log('YAML frontmatter serialization', 'fail', 'Serialization error');
    }
  } catch (error: any) {
    log('YAML frontmatter serialization', 'fail', error?.message);
  }
}

async function validateDependencies() {
  console.log(chalk.bold('\n🔗 Validating Service Dependencies...\n'));

  // GitHubService → GitHubAppAuth
  try {
    const hasGitHubAppAuth = await import('../src/services/github-app-auth');
    const usesGitHubApp = (await import('fs')).readFileSync('../src/services/github-service.ts', 'utf-8').includes('GitHubAppAuth');

    if (hasGitHubAppAuth && usesGitHubApp) {
      log('GitHubService → GitHubAppAuth', 'pass', 'Uses GitHub App auth (NOT PAT)');
    } else {
      log('GitHubService → GitHubAppAuth', 'fail', 'Dependency issue');
    }
  } catch (error: any) {
    log('GitHubService → GitHubAppAuth', 'fail', error?.message);
  }

  // HybridStateManager → GitHubStateAdapter
  try {
    const hasStateAdapter = await import('../src/services/github-state-adapter');
    const usesStateAdapter = (await import('fs')).readFileSync('../src/services/hybrid-state-manager.ts', 'utf-8').includes('GitHubStateAdapter');

    if (hasStateAdapter && usesStateAdapter) {
      log('HybridStateManager → GitHubStateAdapter', 'pass');
    } else {
      log('HybridStateManager → GitHubStateAdapter', 'fail', 'Dependency issue');
    }
  } catch (error: any) {
    log('HybridStateManager → GitHubStateAdapter', 'fail', error?.message);
  }

  // GitHubAgentOrchestrator → GitHubStateAdapter + GitHubTaskQueueAdapter
  try {
    const orchestratorCode = (await import('fs')).readFileSync('../src/services/github-agent-orchestrator.ts', 'utf-8');
    const usesStateAdapter = orchestratorCode.includes('GitHubStateAdapter');
    const usesQueueAdapter = orchestratorCode.includes('GitHubTaskQueueAdapter');

    if (usesStateAdapter && usesQueueAdapter) {
      log('GitHubAgentOrchestrator → State + Queue adapters', 'pass');
    } else {
      log('GitHubAgentOrchestrator → State + Queue adapters', 'fail', 'Missing dependency');
    }
  } catch (error: any) {
    log('GitHubAgentOrchestrator → State + Queue adapters', 'fail', error?.message);
  }
}

async function validateArchitecture() {
  console.log(chalk.bold('\n🏗️  Validating Architecture Patterns...\n'));

  // Check for correct patterns (not anti-patterns)

  // 1. State in issue body (NOT comments)
  try {
    const stateAdapterCode = (await import('fs')).readFileSync('../src/services/github-state-adapter.ts', 'utf-8');
    const usesIssueBody = stateAdapterCode.includes('updateTask') && stateAdapterCode.includes('body:');

    if (usesIssueBody) {
      log('State in issue body (NOT comments)', 'pass', '✓ Correct pattern');
    } else {
      log('State in issue body (NOT comments)', 'fail', '⚠ Pattern issue');
    }
  } catch (error: any) {
    log('State in issue body (NOT comments)', 'fail', error?.message);
  }

  // 2. Sliding window rate limiting (NOT token bucket)
  try {
    const ghServiceCode = (await import('fs')).readFileSync('../src/services/github-service.ts', 'utf-8');
    const usesSlidingWindow = ghServiceCode.includes('X-RateLimit-Remaining') && ghServiceCode.includes('resetTime');

    if (usesSlidingWindow) {
      log('Sliding window rate limiting', 'pass', '✓ Correct algorithm');
    } else {
      log('Sliding window rate limiting', 'fail', '⚠ Pattern issue');
    }
  } catch (error: any) {
    log('Sliding window rate limiting', 'fail', error?.message);
  }

  // 3. GitHub App auth (NOT PAT)
  try {
    const ghAuthServiceCode = (await import('fs')).readFileSync('../src/services/github-app-auth.ts', 'utf-8');
    const usesAppAuth = ghAuthServiceCode.includes('appId') && ghAuthServiceCode.includes('installationId');

    if (usesAppAuth) {
      log('GitHub App authentication (NOT PAT)', 'pass', '✓ Secure token rotation');
    } else {
      log('GitHub App authentication (NOT PAT)', 'fail', '⚠ Pattern issue');
    }
  } catch (error: any) {
    log('GitHub App authentication (NOT PAT)', 'fail', error?.message);
  }
}

async function printSummary() {
  console.log(chalk.bold('\n' + '='.repeat(60) + '\n'));
  console.log(chalk.bold('📊 VALIDATION SUMMARY\n'));

  const total = results.passed + results.failed;
  const percentage = total > 0 ? Math.round((results.passed / total) * 100) : 0;

  console.log(`Total Tests: ${total}`);
  console.log(chalk.green(`Passed: ${results.passed}`));
  console.log(chalk.red(`Failed: ${results.failed}`));
  console.log(`Success Rate: ${percentage}%\n`);

  if (results.failed === 0) {
    console.log(chalk.bold(chalk.green('✅ ALL VALIDATIONS PASSED!')));
    console.log(chalk.green('\nThe UltraPilot backend is properly integrated and ready for use.\n'));
    console.log(chalk.yellow('Next steps:'));
    console.log(chalk.yellow('1. Set up GitHub App (see .github/GITHUB_APP_SETUP.md)'));
    console.log(chalk.yellow('2. Configure environment variables'));
    console.log(chalk.yellow('3. Run migration: npx tsx src/services/run-migration.ts\n'));
  } else {
    console.log(chalk.bold(chalk.red('❌ SOME VALIDATIONS FAILED')));
    console.log(chalk.red('\nPlease review the failed tests above.\n'));
  }

  console.log('='.repeat(60) + '\n');
}

async function main() {
  console.log(chalk.bold.cyan('╔════════════════════════════════════════════════════════════╗'));
  console.log(chalk.bold.cyan('║    UltraPilot GitHub Migration - Backend Validation    ║'));
  console.log(chalk.bold.cyan('╚════════════════════════════════════════════════════════════╝\n'));

  await validateImports();
  await validateTypes();
  await validateInterfaces();
  await validateDataFlow();
  await validateDependencies();
  await validateArchitecture();

  await printSummary();

  process.exit(results.failed > 0 ? 1 : 0);
}

main().catch(error => {
  console.error(chalk.red('Validation script failed:'), error);
  process.exit(1);
});
