/**
 * Domain Initializer - Setup autonomous domain in a workspace
 *
 * Creates .ultra/ directory structure, domain.json configuration,
 * initializes queues, routines, and prepares for autoloop.
 *
 * Each workspace = one autonomous domain
 * One-time setup per workspace
 */

import { promises as fs } from 'fs';
import * as path from 'path';
import { existsSync } from 'fs';

/**
 * Domain configuration
 */
export interface DomainConfig {
  domainId: string;
  name: string;
  type: string;
  description: string;

  stack: {
    language: string;
    framework: string;
    packageManager: string;
    testing: string;
    versionControl: string;
    mainBranch: string;
  };

  agents: string[];

  routing: {
    rules: Array<{
      pattern: string;
      agent: string;
    }>;
    priority: 'fifo' | 'priority-based' | 'weighted';
    ownership: 'auto-assign' | 'manual' | 'round-robin';
  };

  routines: Array<{
    name: string;
    schedule: 'hourly' | 'daily' | 'weekly' | 'on-change';
    enabled: boolean;
  }>;

  qualityGates: {
    testsMustPass: boolean;
    lintMustPass: boolean;
    buildMustSucceed: boolean;
    securityScanMustPass: boolean;
  };

  autoloop: {
    cycleTime: number; // seconds
    enabled: boolean;
    startedAt: Date | null;
  };

  createdAt: string;
  version: string;
}

/**
 * Domain initialization options
 */
export interface DomainInitOptions {
  name: string;
  description: string;
  type: string;

  language: string;
  framework: string;
  packageManager: string;
  testing: string;

  agents: string[];
  routines: Array<{ name: string; schedule: string }>;

  qualityGates?: Partial<DomainConfig['qualityGates']>;
  autoloopCycleTime?: number;
}

/**
 * Domain validation result
 */
export interface DomainValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Domain Initializer class
 */
export class DomainInitializer {
  private workspacePath: string;
  private ultraPath: string;

  constructor(workspacePath: string = process.cwd()) {
    this.workspacePath = workspacePath;
    this.ultraPath = path.join(workspacePath, '.ultra');
  }

  /**
   * Check if domain is already initialized
   */
  isInitialized(): boolean {
    return existsSync(path.join(this.ultraPath, 'state', 'initialized'));
  }

  /**
   * Validate environment before setup
   */
  async validateEnvironment(): Promise<DomainValidation> {
    const result: DomainValidation = {
      valid: true,
      errors: [],
      warnings: []
    };

    // Check write permissions
    try {
      await fs.access(this.workspacePath, fs.constants.W_OK);
    } catch {
      result.valid = false;
      result.errors.push('No write permission for current directory');
    }

    // Check git repository
    const gitPath = path.join(this.workspacePath, '.git');
    if (!existsSync(gitPath)) {
      result.warnings.push('Not a git repository. Run: git init');
    }

    // Check package manager
    const hasNpm = await this.commandExists('npm');
    const hasYarn = await this.commandExists('yarn');
    const hasPnpm = await this.commandExists('pnpm');

    if (!hasNpm && !hasYarn && !hasPnpm) {
      result.warnings.push('No package manager found (npm/yarn/pnpm)');
    }

    return result;
  }

  /**
   * Initialize domain with configuration
   */
  async initialize(options: DomainInitOptions): Promise<void> {
    // Validate environment first
    const validation = await this.validateEnvironment();
    if (!validation.valid) {
      throw new Error(`Domain validation failed:\n${validation.errors.join('\n')}`);
    }

    // Check if already initialized
    if (this.isInitialized()) {
      throw new Error('Domain already initialized. Use --reconfigure to change settings.');
    }

    // Create directory structure
    await this.createDirectoryStructure();

    // Generate domain configuration
    const config = this.generateDomainConfig(options);

    // Write configuration files
    await this.writeConfiguration(config);

    // Create initialized flag
    await fs.writeFile(
      path.join(this.ultraPath, 'state', 'initialized'),
      new Date().toISOString()
    );

    // Set file permissions
    await this.setFilePermissions();

    console.log('✅ Domain initialized successfully');
    console.log(`   Domain: ${config.name}`);
    console.log(`   ID: ${config.domainId}`);
    console.log('');
    console.log('Next steps:');
    console.log('  1. Start autoloop: /ultra-autoloop');
    console.log('  2. Add tasks to intake queue');
    console.log('  3. Use /ultrapilot for feature development');
  }

  /**
   * Create .ultra/ directory structure
   */
  private async createDirectoryStructure(): Promise<void> {
    const dirs = [
      this.ultraPath,
      path.join(this.ultraPath, 'queues'),
      path.join(this.ultraPath, 'routines'),
      path.join(this.ultraPath, 'state')
    ];

    for (const dir of dirs) {
      await fs.mkdir(dir, { recursive: true });
    }
  }

  /**
   * Generate domain configuration from options
   */
  private generateDomainConfig(options: DomainInitOptions): DomainConfig {
    const domainId = `domain-${options.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

    const config: DomainConfig = {
      domainId,
      name: options.name,
      type: options.type,
      description: options.description,

      stack: {
        language: options.language,
        framework: options.framework,
        packageManager: options.packageManager,
        testing: options.testing,
        versionControl: 'git',
        mainBranch: 'main'
      },

      agents: options.agents,

      routing: {
        rules: this.getDefaultRoutingRules(options.agents),
        priority: 'priority-based',
        ownership: 'auto-assign'
      },

      routines: options.routines.map(r => ({
        name: r.name,
        schedule: r.schedule as any,
        enabled: true
      })),

      qualityGates: {
        testsMustPass: true,
        lintMustPass: true,
        buildMustSucceed: false,
        securityScanMustPass: false,
        ...options.qualityGates
      },

      autoloop: {
        cycleTime: options.autoloopCycleTime || 60,
        enabled: false,
        startedAt: null
      },

      createdAt: new Date().toISOString(),
      version: '1.0.0'
    };

    return config;
  }

  /**
   * Get default routing rules based on enabled agents
   */
  private getDefaultRoutingRules(agents: string[]): Array<{ pattern: string; agent: string }> {
    const rules: Array<{ pattern: string; agent: string }> = [];

    const agentPatterns: Record<string, string[]> = {
      'ultra-executor': ['feature', 'implement', 'add', 'create'],
      'ultra-debugging': ['bug', 'fix', 'error', 'issue'],
      'ultra-code-review': ['refactor', 'clean', 'optimize'],
      'ultra-security-reviewer': ['security', 'auth', 'vulnerability'],
      'ultra-test-engine': ['test', 'spec', 'coverage'],
      'ultra-quality-reviewer': ['performance', 'slow', 'memory']
    };

    for (const agent of agents) {
      const patterns = agentPatterns[agent];
      if (patterns) {
        rules.push({
          pattern: patterns.join('|'),
          agent
        });
      }
    }

    return rules;
  }

  /**
   * Write configuration files
   */
  private async writeConfiguration(config: DomainConfig): Promise<void> {
    // Write domain.json
    await fs.writeFile(
      path.join(this.ultraPath, 'domain.json'),
      JSON.stringify(config, null, 2),
      { mode: 0o600 }
    );

    // Write workspace.json
    await fs.writeFile(
      path.join(this.ultraPath, 'workspace.json'),
      JSON.stringify({
        workspacePath: this.workspacePath,
        domainId: config.domainId,
        createdAt: config.createdAt
      }, null, 2),
      { mode: 0o600 }
    );

    // Initialize empty queues
    const queues = {
      intake: [],
      'in-progress': [],
      review: [],
      completed: [],
      failed: []
    };

    for (const [queueName, tasks] of Object.entries(queues)) {
      await fs.writeFile(
        path.join(this.ultraPath, 'queues', `${queueName}.json`),
        JSON.stringify(tasks, null, 2)
      );
    }

    // Create routine configurations
    for (const routine of config.routines) {
      const routineConfig = {
        name: routine.name,
        schedule: routine.schedule,
        command: this.getRoutineCommand(routine.name, config.stack.packageManager),
        enabled: routine.enabled,
        lastRun: null,
        failures: 0
      };

      await fs.writeFile(
        path.join(this.ultraPath, 'routines', `${routine.name}.json`),
        JSON.stringify(routineConfig, null, 2)
      );
    }

    // Create autoloop state
    await fs.writeFile(
      path.join(this.ultraPath, 'state', 'autoloop.json'),
      JSON.stringify({
        enabled: false,
        pid: null,
        startedAt: null,
        cycleCount: 0,
        lastCycle: null
      }, null, 2)
    );

    // Create heartbeat state
    await fs.writeFile(
      path.join(this.ultraPath, 'state', 'heartbeat.json'),
      JSON.stringify({
        status: 'idle',
        uptime: 0,
        cyclesCompleted: 0,
        tasksProcessed: 0,
        lastError: null
      }, null, 2)
    );

    // Create .gitignore
    await fs.writeFile(
      path.join(this.ultraPath, '.gitignore'),
      `# Ignore state files (may contain sensitive data)
state/

# Ignore runtime queue files
queues/*.json

# Keep domain config and schemas
!.gitignore
*.json
`
    );
  }

  /**
   * Get command for a routine
   */
  private getRoutineCommand(routineName: string, packageManager: string): string {
    const commands: Record<string, string> = {
      'test-suite-health': `${packageManager} test`,
      'dependency-check': `${packageManager} outdated`,
      'git-sync': 'git add -A && git commit -m "Auto-commit" && git push',
      'lint-check': `${packageManager} run lint`
    };

    return commands[routineName] || 'echo "No command configured"';
  }

  /**
   * Set secure file permissions
   */
  private async setFilePermissions(): Promise<void> {
    // Directories: 700 (owner read/write/execute only)
    await fs.chmod(this.ultraPath, 0o700);
    await fs.chmod(path.join(this.ultraPath, 'queues'), 0o700);
    await fs.chmod(path.join(this.ultraPath, 'routines'), 0o700);
    await fs.chmod(path.join(this.ultraPath, 'state'), 0o700);
  }

  /**
   * Load existing domain configuration
   */
  async loadDomainConfig(): Promise<DomainConfig> {
    const configPath = path.join(this.ultraPath, 'domain.json');

    if (!existsSync(configPath)) {
      throw new Error('Domain not initialized. Run /ultra-domain-setup first.');
    }

    const content = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(content);
  }

  /**
   * Reconfigure existing domain
   */
  async reconfigure(updates: Partial<DomainConfig>): Promise<void> {
    const config = await this.loadDomainConfig();

    const updated = {
      ...config,
      ...updates,
      version: '1.0.1' // Increment version
    };

    await fs.writeFile(
      path.join(this.ultraPath, 'domain.json'),
      JSON.stringify(updated, null, 2),
      { mode: 0o600 }
    );

    console.log('✅ Domain reconfigured successfully');
  }

  /**
   * Reset domain (delete everything)
   */
  async reset(): Promise<void> {
    if (!existsSync(this.ultraPath)) {
      throw new Error('Domain not initialized');
    }

    await fs.rm(this.ultraPath, { recursive: true, force: true });
    console.log('✅ Domain reset successfully');
  }

  /**
   * Check if a command exists
   */
  private async commandExists(cmd: string): Promise<boolean> {
    try {
      await fs.access(`/usr/bin/${cmd}`, fs.constants.X_OK);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Factory function to create domain initializer
 */
export function createDomainInitializer(workspacePath?: string): DomainInitializer {
  return new DomainInitializer(workspacePath);
}
