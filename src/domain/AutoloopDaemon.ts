/**
 * Autoloop Daemon - Persistent 60-second heartbeat for autonomous domain management
 *
 * Each workspace has its own autoloop daemon that:
 * - Runs forever (never stops)
 * - Checks task queues every 60 seconds
 * - Executes routine maintenance tasks
 * - Coordinates agents
 * - Updates heartbeat state
 *
 * "The boulder never stops."
 */

import { EventEmitter } from 'events';
import { promises as fs } from 'fs';
import * as path from 'path';
import { DomainManager, createDomainManager } from './DomainManager.js';
import { DomainConfig } from './DomainInitializer.js';
import { WorkingManager, createWorkingManager } from './WorkingManager.js';

/**
 * Autoloop state
 */
export interface AutoloopState {
  enabled: boolean;
  pid: number | null;
  startedAt: string | null;
  cycleCount: number;
  lastCycle: string | null;
  lastCycleDuration: number | null;
}

/**
 * Heartbeat state
 */
export interface HeartbeatState {
  status: 'idle' | 'running' | 'paused' | 'error';
  uptime: number; // milliseconds
  cyclesCompleted: number;
  tasksProcessed: number;
  lastError: string | null;
  lastUpdate: string;
}

/**
 * Routine execution result
 */
interface RoutineResult {
  name: string;
  success: boolean;
  duration: number;
  output?: string;
  error?: string;
}

/**
 * Autoloop cycle result
 */
interface CycleResult {
  cycleNumber: number;
  startTime: Date;
  endTime: Date;
  duration: number;
  tasksProcessed: number;
  routinesExecuted: RoutineResult[];
  errors: string[];
}

/**
 * Autoloop daemon configuration
 */
export interface AutoloopConfig {
  workspacePath: string;
  cycleTime: number; // seconds
  enableRoutines: boolean;
  enableTaskProcessing: boolean;
  enableHealthChecks: boolean;
  verboseLogging: boolean;
}

/**
 * Autoloop Daemon class
 */
export class AutoloopDaemon extends EventEmitter {
  private config: AutoloopConfig;
  private domainManager: DomainManager;
  private domainConfig: DomainConfig;
  private ultraPath: string;
  private workingManager: WorkingManager;

  // State
  private running: boolean = false;
  private paused: boolean = false;
  private cycleTimer?: NodeJS.Timeout;
  private startTime?: Date;
  private cycleCount: number = 0;

  // Statistics
  private totalTasksProcessed: number = 0;
  private totalRoutinesExecuted: number = 0;
  private totalErrors: number = 0;

  constructor(config: AutoloopConfig) {
    super();

    this.config = config;
    this.ultraPath = path.join(config.workspacePath, '.ultra');
    this.domainManager = createDomainManager({
      domainAgency: { enabled: false } // Start without domain-agency
    });

    // Initialize working manager (the "working manager" capability)
    this.workingManager = createWorkingManager({
      maxConcurrentTeams: 5,
      maxWorkersPerTeam: 5,
      preferIndividualExecutionUnderHours: 4,
      preferTeamExecutionOverHours: 8
    });

    // Load domain config
    this.domainConfig = {} as DomainConfig; // Will load on start
  }

  /**
   * Start the autoloop daemon
   */
  async start(): Promise<void> {
    if (this.running) {
      console.log('⚠️  Autoloop already running');
      return;
    }

    console.log('🚀 Starting autoloop daemon...');
    console.log(`   Workspace: ${this.config.workspacePath}`);
    console.log(`   Cycle time: ${this.config.cycleTime}s`);

    // Load domain configuration
    await this.loadDomainConfig();

    // Start domain manager
    await this.domainManager.start();

    // Initialize state
    this.running = true;
    this.paused = false;
    this.startTime = new Date();

    // Update autoloop state file
    await this.updateAutoloopState({
      enabled: true,
      pid: process.pid,
      startedAt: this.startTime.toISOString(),
      cycleCount: 0,
      lastCycle: null,
      lastCycleDuration: null
    });

    // Start heartbeat cycle
    this.startHeartbeat();

    // Emit started event
    this.emit('started');
    console.log('✅ Autoloop daemon started');
    console.log(`   PID: ${process.pid}`);
    console.log('   "The boulder never stops." 🪨\n');
  }

  /**
   * Stop the autoloop daemon
   */
  async stop(): Promise<void> {
    if (!this.running) {
      return;
    }

    console.log('🛑 Stopping autoloop daemon...');

    this.running = false;

    if (this.cycleTimer) {
      clearTimeout(this.cycleTimer);
      this.cycleTimer = undefined;
    }

    // Stop domain manager
    await this.domainManager.stop();

    // Update autoloop state file
    await this.updateAutoloopState({
      enabled: false,
      pid: null,
      startedAt: null,
      cycleCount: this.cycleCount,
      lastCycle: new Date().toISOString(),
      lastCycleDuration: null
    });

    this.emit('stopped');
    console.log('✅ Autoloop daemon stopped');
  }

  /**
   * Pause the autoloop (keeps running but skips cycles)
   */
  pause(): void {
    if (!this.running) {
      return;
    }

    this.paused = true;
    console.log('⏸️  Autoloop paused');
    this.emit('paused');
  }

  /**
   * Resume the autoloop
   */
  resume(): void {
    if (!this.running || !this.paused) {
      return;
    }

    this.paused = false;
    console.log('▶️  Autoloop resumed');
    this.emit('resumed');
  }

  /**
   * Start the heartbeat cycle
   */
  private startHeartbeat(): void {
    const cycle = async () => {
      if (!this.running) {
        return;
      }

      if (!this.paused) {
        await this.runCycle();
      }

      // Schedule next cycle
      this.cycleTimer = setTimeout(cycle, this.config.cycleTime * 1000);
    };

    // Start first cycle immediately
    cycle();
  }

  /**
   * Run a single heartbeat cycle
   */
  private async runCycle(): Promise<void> {
    const cycleNumber = ++this.cycleCount;
    const startTime = new Date();

    if (this.config.verboseLogging) {
      console.log(`\n[${new Date().toISOString()}] Cycle #${cycleNumber} starting...`);
    }

    const errors: string[] = [];
    let tasksProcessed = 0;
    const routineResults: RoutineResult[] = [];

    try {
      // 1. Process tasks (if enabled)
      if (this.config.enableTaskProcessing) {
        const processed = await this.processTasks();
        tasksProcessed = processed;
      }

      // 2. Execute routine maintenance tasks (if enabled)
      if (this.config.enableRoutines) {
        const routines = await this.executeRoutines();
        routineResults.push(...routines);
      }

      // 3. Health checks (if enabled)
      if (this.config.enableHealthChecks) {
        await this.runHealthChecks();
      }

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      errors.push(errorMsg);
      this.totalErrors++;
      console.error(`   ❌ Error: ${errorMsg}`);
    }

    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();

    // Update statistics
    this.totalTasksProcessed += tasksProcessed;
    this.totalRoutinesExecuted += routineResults.length;

    // Update heartbeat state
    await this.updateHeartbeatState({
      status: this.paused ? 'paused' : 'running',
      uptime: this.startTime ? Date.now() - this.startTime.getTime() : 0,
      cyclesCompleted: this.cycleCount,
      tasksProcessed: this.totalTasksProcessed,
      lastError: errors.length > 0 ? errors[0] : null,
      lastUpdate: new Date().toISOString()
    });

    // Update autoloop state
    await this.updateAutoloopState({
      enabled: true,
      pid: process.pid,
      startedAt: this.startTime?.toISOString() || null,
      cycleCount: this.cycleCount,
      lastCycle: endTime.toISOString(),
      lastCycleDuration: duration
    });

    // Log cycle summary
    if (this.config.verboseLogging || errors.length > 0) {
      console.log(`   ✅ Cycle #${cycleNumber} complete (${duration}ms)`);
      console.log(`      Tasks: ${tasksProcessed}`);
      console.log(`      Routines: ${routineResults.length}`);
      if (errors.length > 0) {
        console.log(`      Errors: ${errors.length}`);
      }
    }

    // Emit cycle complete event
    this.emit('cycle', {
      cycleNumber,
      startTime,
      endTime,
      duration,
      tasksProcessed,
      routinesExecuted: routineResults,
      errors
    } as CycleResult);
  }

  /**
   * Process tasks from queues
   * Implements the working manager pattern:
   * - Analyze task size/complexity
   * - Execute small tasks myself
   * - Spawn teams for medium/large tasks
   * - Coordinate multiple teams for huge tasks
   */
  private async processTasks(): Promise<number> {
    const taskQueue = this.domainManager.getTaskQueue();
    let processed = 0;

    // Get next task from intake
    const nextTask = taskQueue.getNextTask();
    if (!nextTask) {
      return 0;
    }

    try {
      console.log(`\n   [Autoloop] Processing task: ${nextTask.title}`);
      console.log(`   [Autoloop] Task ID: ${nextTask.id}`);

      // Step 1: Analyze task and determine execution strategy
      const strategy = this.workingManager.analyzeTask(nextTask);
      console.log(`   [Autoloop] Strategy: ${strategy.approach}`);

      // Step 2: Assign task to ultra-loop (this moves it to in-progress)
      await taskQueue.assignTask(nextTask.id, 'executor', 'ultra-loop');

      // Step 3: Execute based on strategy
      let result;

      if (strategy.executeMyself && !strategy.spawnTeam) {
        // SMALL task: Execute myself
        console.log(`   [Autoloop] → Executing task myself (individual execution)`);
        result = await this.workingManager.executeTaskMyself(nextTask);

      } else if (strategy.executeMyself && strategy.spawnTeam && !strategy.spawnMultipleTeams) {
        // MEDIUM task: Do parts myself + spawn team
        console.log(`   [Autoloop] → Hybrid approach: overseeing team execution`);
        const teamId = await this.workingManager.spawnUltraTeam(nextTask, strategy.workerCount);
        console.log(`   [Autoloop] → Team ${teamId} spawned with ${strategy.workerCount} workers`);

        // TODO: Monitor team progress and coordinate
        result = {
          success: true,
          output: `Task assigned to team ${teamId}`,
          metadata: {
            teamId,
            executedBy: 'ultra-loop',
            executionMethod: 'hybrid',
            workersSpawned: strategy.workerCount
          }
        };

      } else if (strategy.spawnMultipleTeams) {
        // LARGE/HUGE task: Spawn multiple teams, coordinate them
        console.log(`   [Autoloop] → Multi-team coordination: ${strategy.teamCount} teams`);
        const teamIds = await this.workingManager.spawnMultipleTeams(
          nextTask,
          strategy.teamCount,
          strategy.workerCount
        );
        console.log(`   [Autoloop] → Teams spawned: ${teamIds.join(', ')}`);

        // Coordinate teams
        await this.workingManager.coordinateTeams(nextTask, teamIds);

        result = {
          success: true,
          output: `Task coordinated across ${teamIds.length} teams`,
          metadata: {
            teamIds,
            executedBy: 'ultra-loop',
            executionMethod: 'coordination',
            workersSpawned: strategy.workerCount,
            teamsSpawned: strategy.teamCount
          }
        };

      } else {
        // Fallback: Execute myself
        console.log(`   [Autoloop] → Fallback: executing task myself`);
        result = await this.workingManager.executeTaskMyself(nextTask);
      }

      // Step 4: Update task with result
      if (result?.success) {
        taskQueue.completeTask(nextTask.id, result);
        console.log(`   [Autoloop] ✅ Task completed successfully`);
        processed++;
      } else {
        taskQueue.failTask(nextTask.id, result?.error || 'Unknown error');
        console.log(`   [Autoloop] ❌ Task failed: ${result?.error}`);
        this.totalErrors++;
      }

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`   [Autoloop] ❌ Error processing task: ${errorMsg}`);
      this.totalErrors++;

      // Mark task as failed
      try {
        taskQueue.failTask(nextTask.id, errorMsg);
      } catch (failError) {
        console.error(`   [Autoloop] ❌ Failed to mark task as failed: ${failError}`);
      }
    }

    return processed;
  }

  /**
   * Execute routine maintenance tasks
   */
  private async executeRoutines(): Promise<RoutineResult[]> {
    const results: RoutineResult[] = [];

    // Load routine configurations
    const routinesDir = path.join(this.ultraPath, 'routines');
    const routineFiles = await fs.readdir(routinesDir);

    for (const file of routineFiles) {
      if (!file.endsWith('.json')) continue;

      const routinePath = path.join(routinesDir, file);
      const routineConfig = JSON.parse(await fs.readFile(routinePath, 'utf-8'));

      if (!routineConfig.enabled) {
        continue;
      }

      const result = await this.executeRoutine(routineConfig);
      results.push(result);

      // Update routine file with last run
      routineConfig.lastRun = new Date().toISOString();
      if (!result.success) {
        routineConfig.failures++;
      }
      await fs.writeFile(routinePath, JSON.stringify(routineConfig, null, 2));
    }

    return results;
  }

  /**
   * Execute a single routine
   */
  private async executeRoutine(routine: any): Promise<RoutineResult> {
    const startTime = Date.now();

    try {
      // Execute the command
      const { exec } = await import('child_process');
      const output = await new Promise<string>((resolve, reject) => {
        exec(routine.command, { cwd: this.config.workspacePath }, (error, stdout, stderr) => {
          if (error) {
            reject(error);
          } else {
            resolve(stdout + stderr);
          }
        });
      });

      const duration = Date.now() - startTime;

      return {
        name: routine.name,
        success: true,
        duration,
        output
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMsg = error instanceof Error ? error.message : String(error);

      return {
        name: routine.name,
        success: false,
        duration,
        error: errorMsg
      };
    }
  }

  /**
   * Run health checks
   */
  private async runHealthChecks(): Promise<void> {
    const stats = this.domainManager.getStats();

    // Check for stuck tasks
    const taskQueue = this.domainManager.getTaskQueue();
    const inProgressTasks = taskQueue.getTasksByStatus('in-progress' as any);

    const now = Date.now();
    for (const task of inProgressTasks) {
      if (task.startedAt) {
        const elapsed = now - new Date(task.startedAt).getTime();
        const threshold = 2 * 60 * 60 * 1000; // 2 hours

        if (elapsed > threshold) {
          console.warn(`   ⚠️  Stuck task detected: ${task.id} (${Math.floor(elapsed / 1000 / 60)}min)`);
          this.emit('stuckTask', task);
        }
      }
    }

    // Check queue health
    if (stats.tasks.failed > 10) {
      console.warn(`   ⚠️  High failure count: ${stats.tasks.failed} failed tasks`);
      this.emit('highFailureCount', stats.tasks.failed);
    }
  }

  /**
   * Load domain configuration
   */
  private async loadDomainConfig(): Promise<void> {
    const configPath = path.join(this.ultraPath, 'domain.json');
    const content = await fs.readFile(configPath, 'utf-8');
    this.domainConfig = JSON.parse(content);
  }

  /**
   * Update autoloop state file
   */
  private async updateAutoloopState(state: Partial<AutoloopState>): Promise<void> {
    const statePath = path.join(this.ultraPath, 'state', 'autoloop.json');

    let current: AutoloopState = {
      enabled: false,
      pid: null,
      startedAt: null,
      cycleCount: 0,
      lastCycle: null,
      lastCycleDuration: null
    };

    if (await this.fileExists(statePath)) {
      const content = await fs.readFile(statePath, 'utf-8');
      current = JSON.parse(content);
    }

    const updated = { ...current, ...state };
    await fs.writeFile(statePath, JSON.stringify(updated, null, 2));
  }

  /**
   * Update heartbeat state file
   */
  private async updateHeartbeatState(state: Partial<HeartbeatState>): Promise<void> {
    const statePath = path.join(this.ultraPath, 'state', 'heartbeat.json');

    let current: HeartbeatState = {
      status: 'idle',
      uptime: 0,
      cyclesCompleted: 0,
      tasksProcessed: 0,
      lastError: null,
      lastUpdate: new Date().toISOString()
    };

    if (await this.fileExists(statePath)) {
      const content = await fs.readFile(statePath, 'utf-8');
      current = JSON.parse(content);
    }

    const updated = { ...current, ...state };
    await fs.writeFile(statePath, JSON.stringify(updated, null, 2));
  }

  /**
   * Check if file exists
   */
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get daemon statistics
   */
  getStats(): {
    running: boolean;
    paused: boolean;
    uptime: number;
    cyclesCompleted: number;
    tasksProcessed: number;
    routinesExecuted: number;
    errors: number;
  } {
    return {
      running: this.running,
      paused: this.paused,
      uptime: this.startTime ? Date.now() - this.startTime.getTime() : 0,
      cyclesCompleted: this.cycleCount,
      tasksProcessed: this.totalTasksProcessed,
      routinesExecuted: this.totalRoutinesExecuted,
      errors: this.totalErrors
    };
  }

  /**
   * Force run a single cycle immediately
   */
  async forceCycle(): Promise<void> {
    if (!this.running) {
      throw new Error('Autoloop not running');
    }

    await this.runCycle();
  }
}

/**
 * Factory function to create autoloop daemon
 */
export function createAutoloopDaemon(config: AutoloopConfig): AutoloopDaemon {
  return new AutoloopDaemon(config);
}

/**
 * Run autoloop daemon as standalone process
 */
export async function runAutoloopDaemon(workspacePath: string = process.cwd()): Promise<void> {
  const daemon = createAutoloopDaemon({
    workspacePath,
    cycleTime: 60,
    enableRoutines: true,
    enableTaskProcessing: true,
    enableHealthChecks: true,
    verboseLogging: true
  });

  // Handle shutdown signals
  process.on('SIGINT', async () => {
    console.log('\n\n⚠️  Received SIGINT, shutting down gracefully...');
    await daemon.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n\n⚠️  Received SIGTERM, shutting down gracefully...');
    await daemon.stop();
    process.exit(0);
  });

  // Start the daemon
  await daemon.start();

  // Keep process alive
  process.stdin.resume();
}
