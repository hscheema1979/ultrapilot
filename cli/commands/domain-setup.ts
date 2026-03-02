#!/usr/bin/env node
/**
 * UltraPilot Domain Setup CLI Command
 *
 * Initialize a new autonomous domain in the current workspace.
 * Creates .ultra/ directory structure, domain.json configuration,
 * and prepares for autoloop.
 *
 * Usage:
 *   /ultra-domain-setup
 *   /ultra-domain-setup --config domain.json
 *   /ultra-domain-setup --reconfigure
 *   /ultra-domain-setup --reset
 */

import { createDomainInitializer } from '../../dist/domain/DomainInitializer.js';
import { existsSync } from 'fs';
import * as path from 'path';
import { readFileSync } from 'fs';

interface CliOptions {
  config?: string;
  reconfigure?: boolean;
  reset?: boolean;
  help?: boolean;
}

async function main() {
  const args = process.argv.slice(2);
  const options: CliOptions = {};

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--config') {
      options.config = args[++i];
    } else if (arg === '--reconfigure') {
      options.reconfigure = true;
    } else if (arg === '--reset') {
      options.reset = true;
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    }
  }

  // Show help
  if (options.help) {
    console.log(`
UltraPilot Domain Setup - Initialize autonomous domain in workspace

Usage:
  /ultra-domain-setup                    Interactive setup wizard
  /ultra-domain-setup --config <file>     Non-interactive setup from config file
  /ultra-domain-setup --reconfigure       Reconfigure existing domain
  /ultra-domain-setup --reset             Reset domain (deletes .ultra/)

Examples:
  /ultra-domain-setup
  /ultra-domain-setup --config domain.json
  /ultra-domain-setup --reconfigure

For more information, see: https://github.com/ultrapilot/ultrapilot-plugin
`);
    process.exit(0);
  }

  const initializer = createDomainInitializer(process.cwd());

  try {
    // Reset mode
    if (options.reset) {
      console.log('⚠️  WARNING: This will delete all domain state and configuration');
      console.log('   Press Ctrl+C to cancel, or Enter to continue...');
      await new Promise(resolve => {
        process.stdin.once('data', resolve);
      });

      await initializer.reset();
      console.log('✅ Domain reset complete');
      process.exit(0);
    }

    // Reconfigure mode
    if (options.reconfigure) {
      const config = await initializer.loadDomainConfig();
      console.log(`Current domain: ${config.name}`);
      console.log(`Type: ${config.type}`);
      console.log(`Agents: ${config.agents.length}`);
      console.log('');
      console.log('Reconfiguration not yet implemented. Edit .ultra/domain.json manually.');
      process.exit(0);
    }

    // Config file mode
    if (options.config) {
      const configPath = path.resolve(process.cwd(), options.config);
      if (!existsSync(configPath)) {
        console.error(`❌ Config file not found: ${configPath}`);
        process.exit(1);
      }

      const configContent = readFileSync(configPath, 'utf-8');
      const config = JSON.parse(configContent);

      await initializer.initialize({
        name: config.name,
        description: config.description || '',
        type: config.type || 'web-api',
        language: config.stack?.language || 'TypeScript',
        framework: config.stack?.framework || 'Express',
        packageManager: config.stack?.packageManager || 'npm',
        testing: config.stack?.testing || 'Jest',
        agents: config.agents || ['ultra-executor'],
        routines: config.routines || [
          { name: 'test-suite-health', schedule: 'hourly' },
          { name: 'dependency-check', schedule: 'daily' }
        ],
        qualityGates: config.qualityGates,
        autoloopCycleTime: config.autoloop?.cycleTime
      });

      process.exit(0);
    }

    // Interactive mode (default)
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  ULTRA-DOMAIN-SETUP                                          ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Let's set up your autonomous domain!                        ║
║                                                               ║
║  Each workspace = one autonomous domain                      ║
║  Each domain = one persistent autoloop                       ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`);

    // Check if already initialized
    if (initializer.isInitialized()) {
      console.log('⚠️  Domain already initialized in this workspace');
      console.log('   Use --reconfigure to change settings');
      console.log('   Use --reset to start over');
      process.exit(1);
    }

    // Interactive prompts
    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const question = (prompt: string): Promise<string> => {
      return new Promise(resolve => {
        rl.question(prompt, resolve);
      });
    };

    // Collect domain information
    console.log('\n📋 Domain Identity');
    console.log('─────────────────────────────────');

    const name = await question('Domain name (e.g., ecommerce-api): ');
    if (!name.trim()) {
      console.error('❌ Domain name is required');
      process.exit(1);
    }

    const description = await question('Description: ');

    console.log('\n💻 Tech Stack');
    console.log('─────────────────────────────────');

    const language = await question('Primary language [TypeScript]: ') || 'TypeScript';
    const framework = await question('Framework [Express]: ') || 'Express';
    const packageManager = await question('Package manager [npm/yarn/pnpm]: ') || 'npm';
    const testing = await question('Testing framework [Jest]: ') || 'Jest';

    console.log('\n🤖 Agents');
    console.log('─────────────────────────────────');
    console.log('Available agents:');
    console.log('  - ultra-executor (implementation)');
    console.log('  - ultra-test-engine (testing)');
    console.log('  - ultra-debugging (bug fixing)');
    console.log('  - ultra-code-review (review)');
    console.log('  - ultra-security-reviewer (security)');
    console.log('  - ultra-quality-reviewer (performance)');

    const agentsInput = await question('Enable agents [all]: ') || 'all';
    const agents = agentsInput === 'all'
      ? ['ultra-executor', 'ultra-test-engine', 'ultra-debugging', 'ultra-code-review', 'ultra-security-reviewer', 'ultra-quality-reviewer']
      : agentsInput.split(',').map(a => a.trim());

    console.log('\n⏰ Routines');
    console.log('─────────────────────────────────');

    const routinesInput = await question('Enable routines [test-suite-health,lint-check]: ') || 'test-suite-health,lint-check';
    const routines = routinesInput.split(',').map(r => {
      const [name, schedule] = r.trim().split(':');
      return { name, schedule: schedule || 'hourly' };
    });

    rl.close();

    // Initialize domain
    await initializer.initialize({
      name,
      description,
      type: 'web-api',
      language,
      framework,
      packageManager,
      testing,
      agents,
      routines
    });

    console.log(`
═══════════════════════════════════════════════════════════════

✅ Domain initialized successfully!

Next steps:
  1. Start the persistent autoloop:
     /ultra-autoloop

  2. Add tasks to the intake queue:
     echo '{"title": "My first task"}' > .ultra/queues/intake.json

  3. Monitor domain heartbeat:
     cat .ultra/state/heartbeat.json

"The boulder never stops." 🪨

═══════════════════════════════════════════════════════════════
`);

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
