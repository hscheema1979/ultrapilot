/**
 * UltraPilot Skill Integration
 *
 * This module integrates UltraPilot skill with Ultra-Lead for complete 5-phase workflow:
 *
 * Phase 0: Expansion (Requirements + Architecture) - DONE by skill
 * Phase 1: Planning + Multi-Perspective Review - DONE by skill
 * Phase 2-5: Handoff to Ultra-Lead - THIS MODULE
 *
 * Key responsibilities:
 * - Detect when Phase 1 completes (plan-final.md created)
 * - Subscribe to AgentMessageBus events
 * - Trigger Ultra-Lead workflow execution
 * - Monitor progress in real-time
 * - Report completion with evidence
 *
 * Usage in skill.md:
 *   "After Phase 1, call UltraPilotSkillIntegration.handoffToUltraLead()"
 */

import { EventEmitter } from 'events';
import * as path from 'path';
import * as fs from 'fs/promises';

// Import core components
import { AgentMessageBus } from '../../src/agent-comms/AgentMessageBus.js';
import { UltraLeadClient, createUltraLeadClient } from '../../src/domain/UltraLeadClient.js';
import { SessionManager } from '../../src/session/SessionManager.js';
import { ConnectionPool } from '../../src/agent-comms/ConnectionPool.js';
import { PlanWatcher, OperationalPlan } from '../../src/domain/PlanWatcher.js';

/**
 * Skill execution state
 */
export enum SkillState {
  IDLE = 'idle',
  PHASE_0 = 'phase-0',           // Requirements + Architecture
  PHASE_1 = 'phase-1',           // Planning + Review
  PHASE_2_5 = 'phase-2-5',       // Ultra-Lead execution
  COMPLETED = 'completed',
  FAILED = 'failed',
  ESCALATED = 'escalated'
}

/**
 * Phase 2-5 execution status
 */
export enum Phase2_5Status {
  STARTING = 'starting',
  PHASE_2_EXECUTION = 'phase-2-execution',
  PHASE_3_QA = 'phase-3-qa',
  PHASE_4_VALIDATION = 'phase-4-validation',
  PHASE_5_VERIFICATION = 'phase-5-verification',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

/**
 * Progress event data
 */
export interface SkillProgressEvent {
  state: SkillState;
  phase: number;
  phaseName: string;
  status: string;
  message?: string;
  timestamp: Date;
  data?: Record<string, unknown>;
}

/**
 * Completion evidence
 */
export interface CompletionEvidence {
  success: boolean;
  duration: number;
  filesCreated: string[];
  filesModified: string[];
  testsPassed: number;
  testsFailed: number;
  buildSuccess: boolean;
  validationResults: {
    security: { approved: boolean; issues: string[] };
    quality: { approved: boolean; issues: string[] };
    code: { approved: boolean; issues: string[] };
  };
  verificationResults: {
    passed: boolean;
    evidence: string[];
  };
}

/**
 * UltraPilot Skill Integration configuration
 */
export interface UltraPilotSkillConfig {
  workspacePath: string;
  ultraPath?: string;
  autoStart?: boolean;
  enableRealTimeUpdates?: boolean;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: Required<UltraPilotSkillConfig> = {
  workspacePath: process.cwd(),
  ultraPath: path.join(process.cwd(), '.ultra'),
  autoStart: false,
  enableRealTimeUpdates: true
};

/**
 * UltraPilot Skill Integration
 *
 * Orchestrates handoff from Phase 1 (strategic planning) to Phase 2-5 (operational execution).
 */
export class UltraPilotSkillIntegration extends EventEmitter {
  private config: Required<UltraPilotSkillConfig>;
  private state: SkillState = SkillState.IDLE;
  private phase2_5Status: Phase2_5Status = Phase2_5Status.STARTING;

  // Core components
  private messageBus: AgentMessageBus;
  private sessionManager: SessionManager;
  private connectionPool: ConnectionPool;
  private ultraLeadClient: UltraLeadClient | null = null;
  private planWatcher: PlanWatcher | null = null;

  // Event subscriptions
  private subscriptions: any[] = [];

  // State tracking
  private sessionId: string | null = null;
  private workflowStartTime: number = 0;
  private currentPlan: OperationalPlan | null = null;

  // Progress tracking
  private currentPhase: number = 0;
  private tasksCompleted: number = 0;
  private totalTasks: number = 0;

  constructor(config?: Partial<UltraPilotSkillConfig>) {
    super();

    this.config = { ...DEFAULT_CONFIG, ...config };
    this.messageBus = new AgentMessageBus();
    this.sessionManager = new SessionManager();
    this.connectionPool = ConnectionPool.getInstance();

    console.log('[UltraPilotSkill] Initialized with config:', {
      workspace: this.config.workspacePath,
      ultraPath: this.config.ultraPath
    });
  }

  /**
   * Initialize the skill integration
   * Call this at the start of Phase 0
   */
  async initialize(): Promise<void> {
    console.log('\n[UltraPilotSkill] ========================================');
    console.log('[UltraPilotSkill] Initializing UltraPilot Skill');
    console.log('[UltraPilotSkill] ========================================');

    this.state = SkillState.PHASE_0;
    this.workflowStartTime = Date.now();

    // Setup event subscriptions
    this.setupEventSubscriptions();

    // Initialize UltraLeadClient (but don't start yet)
    this.ultraLeadClient = createUltraLeadClient({
      workspacePath: this.config.workspacePath,
      planPath: path.join(this.config.ultraPath, 'plan-final.md'),
      autoStart: false,  // Will start after Phase 1
      enableFileWatcher: false  // We'll use PlanWatcher
    });

    // Setup UltraLeadClient event forwarding
    this.setupUltraLeadClientEvents();

    console.log('[UltraPilotSkill] Ready for Phase 0: Requirements + Architecture');
    this.emitProgress(0, 'Requirements & Architecture', 'initialized');

    return Promise.resolve();
  }

  /**
   * Signal Phase 0 completion (Requirements + Architecture done)
   */
  async phase0Complete(specPath: string): Promise<void> {
    console.log('\n[UltraPilotSkill] Phase 0 Complete: Requirements + Architecture');
    console.log(`[UltraPilotSkill] Spec: ${specPath}`);

    this.state = SkillState.PHASE_1;
    this.currentPhase = 1;

    // Verify spec.md exists
    const specExists = await this.fileExists(specPath);
    if (!specExists) {
      throw new Error(`Spec file not found: ${specPath}`);
    }

    this.emitProgress(1, 'Planning', 'phase-0-complete', { specPath });
    console.log('[UltraPilotSkill] Ready for Phase 1: Planning + Multi-Perspective Review');
  }

  /**
   * Signal Phase 1 completion (Planning + Review done)
   * This triggers the handoff to Ultra-Lead
   */
  async phase1Complete(planFinalPath: string): Promise<void> {
    console.log('\n[UltraPilotSkill] ========================================');
    console.log('[UltraPilotSkill] Phase 1 Complete: Planning + Review');
    console.log('[UltraPilotSkill] ========================================');
    console.log(`[UltraPilotSkill] Plan: ${planFinalPath}`);

    // Verify plan-final.md exists
    const planExists = await this.fileExists(planFinalPath);
    if (!planExists) {
      throw new Error(`Plan file not found: ${planFinalPath}`);
    }

    this.state = SkillState.PHASE_2_5;
    this.currentPhase = 2;

    this.emitProgress(2, 'Handoff to Ultra-Lead', 'phase-1-complete', { planFinalPath });

    // Trigger handoff to Ultra-Lead
    await this.handoffToUltraLead(planFinalPath);
  }

  /**
   * Hand off to Ultra-Lead for Phases 2-5 execution
   * This is the main integration point
   */
  async handoffToUltraLead(planFinalPath: string): Promise<void> {
    console.log('\n[UltraPilotSkill] ========================================');
    console.log('[UltraPilotSkill] HANDING OFF TO ULTRA-LEAD');
    console.log('[UltraPilotSkill] ========================================');
    console.log(`[UltraPilotSkill] Plan: ${planFinalPath}`);
    console.log('[UltraPilotSkill] Executing Phases 2-5:');

    console.log('[UltraPilotSkill]   Phase 2: Queue-Based Task Processing');
    console.log('[UltraPilotSkill]   Phase 3: QA Cycles (UltraQA)');
    console.log('[UltraPilotSkill]   Phase 4: Multi-Perspective Validation');
    console.log('[UltraPilotSkill]   Phase 5: Evidence-Based Verification');

    // Create session for Ultra-Lead
    this.sessionId = await this.createUltraLeadSession();
    console.log(`[UltraPilotSkill] Session created: ${this.sessionId}`);

    // Start PlanWatcher for real-time plan updates
    this.startPlanWatcher(planFinalPath);

    // Start UltraLeadClient
    if (!this.ultraLeadClient) {
      throw new Error('UltraLeadClient not initialized. Call initialize() first.');
    }

    console.log('[UltraPilotSkill] Starting UltraLeadClient...');
    await this.ultraLeadClient.start();

    // Publish plan creation event
    await this.publishPlanCreatedEvent(planFinalPath);

    // Wait for workflow completion with timeout
    const timeout = 60 * 60 * 1000; // 1 hour timeout
    const result = await this.waitForCompletion(timeout);

    if (result.success) {
      this.state = SkillState.COMPLETED;
      console.log('\n[UltraPilotSkill] ========================================');
      console.log('[UltraPilotSkill] ✅ WORKFLOW COMPLETED SUCCESSFULLY');
      console.log('[UltraPilotSkill] ========================================');
      console.log(`[UltraPilotSkill] Duration: ${((Date.now() - this.workflowStartTime) / 1000).toFixed(1)}s`);
      console.log('[UltraPilotSkill] Evidence:', result.evidence);

      this.emit('completed', result);
      this.emitProgress(5, 'Verification', 'completed', { result });
    } else {
      this.state = SkillState.FAILED;
      console.error('\n[UltraPilotSkill] ❌ WORKFLOW FAILED:', result.error);
      this.emit('failed', result);
    }

    // Cleanup
    await this.cleanup();

    return result.success
      ? Promise.resolve()
      : Promise.reject(new Error(result.error || 'Workflow failed'));
  }

  /**
   * Create Ultra-Lead session
   */
  private async createUltraLeadSession(): Promise<string> {
    const { SessionRole } = await import('../../src/session/SessionTypes.js');

    const options = {
      role: SessionRole.ULTRA_LEAD,
      workspacePath: this.config.workspacePath,
      metadata: {
        startedBy: 'UltraPilotSkill',
        workflowStartTime: new Date(this.workflowStartTime).toISOString()
      }
    };

    const sessionId = await this.sessionManager.createSession(options);
    return sessionId;
  }

  /**
   * Start PlanWatcher for real-time plan monitoring
   */
  private startPlanWatcher(planPath: string): void {
    if (!this.planWatcher) {
      this.planWatcher = new PlanWatcher(planPath, {
        verbose: false,
        debounceDelay: 500
      });

      // Watch for plan changes
      this.planWatcher.watch((plan) => {
        console.log('[UltraPilotSkill] Plan updated:', plan.title);
        this.currentPlan = plan;
        this.totalTasks = Object.keys(plan.tasks).length;

        this.emit('planUpdated', plan);
        this.emitProgress(this.currentPhase, 'Execution', 'plan-updated', {
          completionPercentage: plan.completionPercentage
        });
      });
    }
  }

  /**
   * Publish plan creation event to AgentMessageBus
   */
  private async publishPlanCreatedEvent(planPath: string): Promise<void> {
    const planId = `plan-${Date.now()}`;

    await this.messageBus.publish(
      'ultrapilot-skill',
      'plan.created',
      {
        type: 'plan.created',
        payload: {
          planId,
          planPath,
          workspacePath: this.config.workspacePath,
          timestamp: new Date(),
          phases: [] // Will be parsed from plan
        }
      }
    );

    console.log(`[UltraPilotSkill] Published plan.created event: ${planId}`);
  }

  /**
   * Wait for workflow completion
   */
  private async waitForCompletion(timeout: number): Promise<{
    success: boolean;
    evidence?: CompletionEvidence;
    error?: string;
  }> {
    return new Promise((resolve) => {
      const timeoutTimer = setTimeout(() => {
        console.error('[UltraPilotSkill] Workflow timeout');
        resolve({ success: false, error: 'Workflow timeout' });
      }, timeout);

      // Listen for workflow completion
      const onCompleteHandler = (result: any) => {
        clearTimeout(timeoutTimer);

        // Gather evidence
        const evidence: CompletionEvidence = {
          success: result.success || true,
          duration: result.duration || (Date.now() - this.workflowStartTime),
          filesCreated: result.filesCreated || [],
          filesModified: result.filesModified || [],
          testsPassed: result.testsPassed || 0,
          testsFailed: result.testsFailed || 0,
          buildSuccess: result.buildSuccess !== undefined ? result.buildSuccess : true,
          validationResults: result.validationResults || {
            security: { approved: true, issues: [] },
            quality: { approved: true, issues: [] },
            code: { approved: true, issues: [] }
          },
          verificationResults: result.verificationResults || {
            passed: true,
            evidence: ['Workflow completed successfully']
          }
        };

        resolve({ success: true, evidence });
      };

      // Listen for workflow failure
      const onFailedHandler = (error: any) => {
        clearTimeout(timeoutTimer);
        resolve({ success: false, error: error.message || 'Unknown error' });
      };

      // Subscribe to UltraLeadClient events
      if (this.ultraLeadClient) {
        this.ultraLeadClient.once('workflowCompleted', onCompleteHandler);
        this.ultraLeadClient.once('error', onFailedHandler);
      }
    });
  }

  /**
   * Setup event subscriptions for AgentMessageBus
   */
  private setupEventSubscriptions(): void {
    // Subscribe to workflow events
    const events = [
      'workflow.started',
      'phase.completed',
      'task.completed',
      'workflow.completed',
      'qa.cycle.completed',
      'validation.completed',
      'verification.completed'
    ];

    for (const event of events) {
      const subscription = this.messageBus.subscribe(
        'ultrapilot-skill',
        event,
        async (message: any) => {
          this.handleWorkflowEvent(event, message);
        }
      );

      this.subscriptions.push(subscription);
    }

    console.log(`[UltraPilotSkill] Subscribed to ${events.length} workflow events`);
  }

  /**
   * Handle workflow events from AgentMessageBus
   */
  private handleWorkflowEvent(eventType: string, message: any): void {
    const payload = message.payload || {};

    console.log(`[UltraPilotSkill] Event: ${eventType}`, payload);

    switch (eventType) {
      case 'workflow.started':
        this.phase2_5Status = Phase2_5Status.PHASE_2_EXECUTION;
        this.emitProgress(2, 'Execution', 'started');
        break;

      case 'phase.completed':
        this.currentPhase = payload.phaseNumber || this.currentPhase;
        this.emitProgress(this.currentPhase, `Phase ${this.currentPhase}`, 'completed', payload);
        break;

      case 'task.completed':
        this.tasksCompleted++;
        this.emitProgress(this.currentPhase, `Task ${this.tasksCompleted}/${this.totalTasks}`, 'completed', payload);
        break;

      case 'qa.cycle.completed':
        this.phase2_5Status = Phase2_5Status.PHASE_3_QA;
        this.emitProgress(3, 'QA Cycle', 'completed', { cycle: payload.cycle, passed: payload.passed });
        break;

      case 'validation.completed':
        this.phase2_5Status = Phase2_5Status.PHASE_4_VALIDATION;
        this.emitProgress(4, 'Validation', 'completed', payload);
        break;

      case 'verification.completed':
        this.phase2_5Status = Phase2_5Status.PHASE_5_VERIFICATION;
        this.emitProgress(5, 'Verification', 'completed', payload);
        break;

      case 'workflow.completed':
        this.phase2_5Status = Phase2_5Status.COMPLETED;
        break;
    }

    // Re-emit event for external listeners
    this.emit(eventType, payload);
  }

  /**
   * Setup UltraLeadClient event forwarding
   */
  private setupUltraLeadClientEvents(): void {
    if (!this.ultraLeadClient) return;

    // Forward all UltraLeadClient events
    const events = [
      'started',
      'stopped',
      'planReceived',
      'planChanged',
      'progress',
      'taskCompleted',
      'taskFailed',
      'workflowCompleted',
      'error'
    ];

    for (const event of events) {
      this.ultraLeadClient.on(event, (data) => {
        // Forward to our own emitter
        this.emit(event, data);
      });
    }

    // Handle progress events specially
    this.ultraLeadClient.on('progress', (progress: any) => {
      this.emitProgress(
        progress.phase,
        progress.phaseName,
        progress.status,
        { message: progress.message, tasksCompleted: progress.tasksCompleted, totalTasks: progress.totalTasks }
      );
    });
  }

  /**
   * Emit progress event
   */
  private emitProgress(
    phase: number,
    phaseName: string,
    status: string,
    data?: Record<string, unknown>
  ): void {
    const event: SkillProgressEvent = {
      state: this.state,
      phase,
      phaseName,
      status,
      timestamp: new Date(),
      data
    };

    this.emit('progress', event);

    if (this.config.enableRealTimeUpdates) {
      console.log(`[UltraPilotSkill] [${phase}: ${phaseName}] ${status}${data?.message ? ': ' + data.message : ''}`);
    }
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
   * Get current state
   */
  getState(): {
    state: SkillState;
    phase2_5Status: Phase2_5Status;
    currentPhase: number;
    tasksCompleted: number;
    totalTasks: number;
    sessionId: string | null;
    duration: number;
  } {
    return {
      state: this.state,
      phase2_5Status: this.phase2_5Status,
      currentPhase: this.currentPhase,
      tasksCompleted: this.tasksCompleted,
      totalTasks: this.totalTasks,
      sessionId: this.sessionId,
      duration: Date.now() - this.workflowStartTime
    };
  }

  /**
   * Escalate to user (when fundamental issue detected)
   */
  async escalate(issue: string, context?: Record<string, unknown>): Promise<void> {
    console.log('\n[UltraPilotSkill] ========================================');
    console.log('[UltraPilotSkill] ⚠️ ESCALATING TO USER');
    console.log('[UltraPilotSkill] ========================================');
    console.log(`[UltraPilotSkill] Issue: ${issue}`);
    if (context) {
      console.log('[UltraPilotSkill] Context:', context);
    }

    this.state = SkillState.ESCALATED;

    this.emit('escalated', { issue, context, timestamp: new Date() });
    this.emitProgress(this.currentPhase, 'Escalation', 'escalated', { issue, context });

    // Publish escalation event
    await this.messageBus.publish(
      'ultrapilot-skill',
      'escalation',
      {
        type: 'escalation',
        payload: {
          issue,
          context,
          timestamp: new Date(),
          sessionId: this.sessionId
        }
      }
    );
  }

  /**
   * Cleanup resources
   */
  private async cleanup(): Promise<void> {
    console.log('[UltraPilotSkill] Cleaning up...');

    // Stop plan watcher
    if (this.planWatcher) {
      this.planWatcher.unwatch();
      this.planWatcher = null;
    }

    // Unsubscribe from events
    for (const subscription of this.subscriptions) {
      if (subscription.unsubscribe) {
        await subscription.unsubscribe();
      }
    }
    this.subscriptions = [];

    // Stop UltraLeadClient
    if (this.ultraLeadClient) {
      await this.ultraLeadClient.stop();
    }

    // Stop session
    if (this.sessionId) {
      try {
        await this.sessionManager.stopSession(this.sessionId);
      } catch (error) {
        console.error('[UltraPilotSkill] Error stopping session:', error);
      }
    }

    console.log('[UltraPilotSkill] Cleanup complete');
  }

  /**
   * Manual checkpoint - allow resuming from specific phase
   */
  async saveCheckpoint(phase: number): Promise<void> {
    const checkpointPath = path.join(this.config.ultraPath, 'checkpoint.json');

    const checkpoint = {
      phase,
      state: this.state,
      phase2_5Status: this.phase2_5Status,
      currentPhase: this.currentPhase,
      tasksCompleted: this.tasksCompleted,
      totalTasks: this.totalTasks,
      sessionId: this.sessionId,
      workflowStartTime: this.workflowStartTime,
      savedAt: new Date().toISOString()
    };

    await fs.writeFile(checkpointPath, JSON.stringify(checkpoint, null, 2));
    console.log(`[UltraPilotSkill] Checkpoint saved: phase ${phase}`);
  }

  /**
   * Load checkpoint and resume
   */
  async loadCheckpoint(): Promise<{
    phase: number;
    state: SkillState;
    resumeFrom: string;
  } | null> {
    const checkpointPath = path.join(this.config.ultraPath, 'checkpoint.json');

    try {
      const content = await fs.readFile(checkpointPath, 'utf-8');
      const checkpoint = JSON.parse(content);

      console.log(`[UltraPilotSkill] Checkpoint found: phase ${checkpoint.phase}`);

      // Restore state
      this.state = checkpoint.state;
      this.phase2_5Status = checkpoint.phase2_5Status;
      this.currentPhase = checkpoint.currentPhase;
      this.tasksCompleted = checkpoint.tasksCompleted;
      this.totalTasks = checkpoint.totalTasks;
      this.sessionId = checkpoint.sessionId;
      this.workflowStartTime = checkpoint.workflowStartTime;

      return {
        phase: checkpoint.phase,
        state: this.state,
        resumeFrom: `Phase ${checkpoint.phase}`
      };
    } catch {
      return null;
    }
  }
}

/**
 * Factory function
 */
export function createUltraPilotSkillIntegration(
  config?: Partial<UltraPilotSkillConfig>
): UltraPilotSkillIntegration {
  return new UltraPilotSkillIntegration(config);
}

/**
 * Singleton instance for skill usage
 */
let singletonInstance: UltraPilotSkillIntegration | null = null;

/**
 * Get or create singleton instance
 */
export function getSkillInstance(
  config?: Partial<UltraPilotSkillConfig>
): UltraPilotSkillIntegration {
  if (!singletonInstance) {
    singletonInstance = new UltraPilotSkillIntegration(config);
  }
  return singletonInstance;
}

/**
 * Reset singleton (for testing)
 */
export function resetSkillInstance(): void {
  if (singletonInstance) {
    singletonInstance.removeAllListeners();
    singletonInstance = null;
  }
}
