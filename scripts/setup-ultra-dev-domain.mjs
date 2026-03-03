#!/usr/bin/env node

/**
 * Setup Ultra-Dev Domain
 *
 * Initializes the ultrapilot repository as the "ultra-dev" domain -
 * the core plugin development domain that manages itself.
 */

import { createDomainInitializer } from '../dist/domain/DomainInitializer.js';

async function setupUltraDevDomain() {
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║  ULTRA-DEV DOMAIN SETUP                                       ║');
  console.log('║  Core Ultrapilot Plugin Development Domain                   ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝');
  console.log('');

  const initializer = createDomainInitializer('/home/ubuntu/hscheema1979/ultrapilot');

  // Check if already initialized
  if (initializer.isInitialized()) {
    console.log('⚠️  Domain already initialized!');
    console.log('   To reconfigure, use reset() first');
    process.exit(1);
  }

  // Validate environment
  console.log('🔍 Validating environment...');
  const validation = await initializer.validateEnvironment();

  if (validation.warnings.length > 0) {
    console.log('⚠️  Warnings:');
    validation.warnings.forEach(w => console.log(`   - ${w}`));
    console.log('');
  }

  if (!validation.valid) {
    console.log('❌ Validation failed:');
    validation.errors.forEach(e => console.log(`   - ${e}`));
    process.exit(1);
  }

  console.log('✅ Environment validated');
  console.log('');

  // Domain configuration
  const domainOptions = {
    name: 'ultra-dev',
    description: 'Core Ultrapilot plugin development - autonomous domain agency system with MOE collaboration',
    type: 'library-plugin',

    // Tech stack
    language: 'TypeScript',
    framework: 'Node.js',
    packageManager: 'npm',
    testing: 'Jest + Vitest',

    // Core agents for plugin development
    agents: [
      // Team coordination
      'ultra:team-lead',
      'ultra:team-implementer',

      // Core development
      'ultra:analyst',
      'ultra:architect',
      'ultra:planner',
      'ultra:executor',
      'ultra:executor-high',

      // Quality & testing
      'ultra:test-engineer',
      'ultra:verifier',
      'ultra:quality-reviewer',
      'ultra:code-reviewer',

      // Debugging & review
      'ultra:debugger',
      'ultra:security-reviewer',

      // Documentation
      'ultra:writer',

      // Build & toolchain
      'ultra:build-fixer',

      // Domain-specific (for trading domains managed by plugin)
      'ultra:quant-analyst',
      'ultra:risk-manager',
      'ultra:trading-architect',
      'ultra:execution-developer'
    ],

    // Routine maintenance tasks
    routines: [
      {
        name: 'test-suite-health',
        schedule: 'every 5 minutes',
        agent: 'ultra:test-engineer',
        tasks: [
          'Run all tests with npm test',
          'Check test coverage is above 80%',
          'Report any failing tests to intake queue',
          'Create bug fix task if tests failing'
        ]
      },
      {
        name: 'build-validation',
        schedule: 'every 15 minutes',
        agent: 'ultra:build-fixer',
        tasks: [
          'Run TypeScript build (npm run build)',
          'Check for build errors or warnings',
          'Fix any build issues if possible',
          'Report unfixable build errors'
        ]
      },
      {
        name: 'documentation-sync',
        schedule: 'every hour',
        agent: 'ultra:writer',
        tasks: [
          'Update AGENTS.md with any new agents',
          'Update skill documentation',
          'Sync README with latest features',
          'Check for outdated documentation'
        ]
      },
      {
        name: 'dependency-check',
        schedule: 'daily at 2am',
        agent: 'ultra:security-reviewer',
        tasks: [
          'Run npm outdated',
          'Check for security vulnerabilities',
          'Update dependencies if safe',
          'Report breaking changes'
        ]
      },
      {
        name: 'domain-health-check',
        schedule: 'every 30 seconds',
        agent: 'ultra:team-lead',
        tasks: [
          'Check intake queue for new tasks',
          'Verify autoloop is running',
          'Check agent responsiveness',
          'Report domain health metrics'
        ]
      }
    ],

    // Custom priority matrix for plugin development
    domainParameters: {
      priorityMatrix: {
        levels: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
        rules: {
          CRITICAL: [
            'autoloop-stopped',
            'build-broken',
            'security-vulnerability',
            'data-loss',
            'system-down'
          ],
          HIGH: [
            'test-failure',
            'bug-fix',
            'performance-regression',
            'agent-failure',
            'critical-feature'
          ],
          MEDIUM: [
            'feature-development',
            'documentation',
            'test-coverage',
            'refactor',
            'dependency-update'
          ],
          LOW: [
            'code-cleanup',
            'optimization',
            'minor-refactor',
            'typo-fix',
            'formatting'
          ]
        }
      },
      developmentParameters: {
        testDrivenDevelopment: true,
        multiAgentTesting: true,
        documentationRequired: true,
        codeReviewRequired: true
      }
    },

    // Autoloop cycle time
    autoloopCycleTime: 30
  };

  console.log('📋 Domain Configuration:');
  console.log('   Name: ultra-dev');
  console.log('   Type: Library/Plugin');
  console.log('   Stack: TypeScript, Node.js, npm, Jest');
  console.log('   Agents: 19 configured');
  console.log('   Routines: 5 scheduled');
  console.log('');

  console.log('👥 Configured Agents:');
  domainOptions.agents.forEach((agent, i) => {
    console.log(`   ${i + 1}. ${agent}`);
  });
  console.log('');

  console.log('🔄 Scheduled Routines:');
  domainOptions.routines.forEach((routine, i) => {
    console.log(`   ${i + 1}. ${routine.name} (${routine.schedule})`);
  });
  console.log('');

  console.log('⚡ Initializing domain...');

  try {
    await initializer.initialize(domainOptions);

    console.log('');
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║  ✅ ULTRA-DEV DOMAIN INITIALIZED                              ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('📁 Domain Structure Created:');
    console.log('   .ultra/');
    console.log('   ├── domain.json           (domain configuration)');
    console.log('   ├── workspace.json        (workspace metadata)');
    console.log('   ├── queues/               (task queues)');
    console.log('   │   ├── intake.json');
    console.log('   │   ├── in-progress.json');
    console.log('   │   ├── review.json');
    console.log('   │   ├── completed.json');
    console.log('   │   └── failed.json');
    console.log('   ├── routines/             (routine tasks)');
    console.log('   │   ├── test-suite-health.json');
    console.log('   │   ├── build-validation.json');
    console.log('   │   ├── documentation-sync.json');
    console.log('   │   ├── dependency-check.json');
    console.log('   │   └── domain-health-check.json');
    console.log('   └── state/                (runtime state)');
    console.log('       ├── initialized');
    console.log('       └── autoloop.json');
    console.log('');
    console.log('🎯 Organizational Hierarchy:');
    console.log('   CEO: You (Vision & Goals)');
    console.log('   COO: Claude Code CLI (Architecture & Resources)');
    console.log('   UltraLead: ultra:team-lead (Domain Manager)');
    console.log('   Autoloop: VP of Operations (Heartbeat - 30s cycle)');
    console.log('   UltraWorkers: 19 Autonomous Agents');
    console.log('');
    console.log('🚀 Next Steps:');
    console.log('   1. Start autoloop:   /ultra-autoloop start');
    console.log('   2. Add tasks:        /ultra-task add "Fix bug in TaskExecutor"');
    console.log('   3. Check status:     /ultra-status');
    console.log('   4. View queues:      cat .ultra/queues/intake.json');
    console.log('');
    console.log('🪨 The boulder never stops.');
    console.log('');

  } catch (error) {
    console.error('❌ Domain initialization failed:', error.message);
    process.exit(1);
  }
}

// Run setup
setupUltraDevDomain().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
