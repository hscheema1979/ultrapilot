/**
 * Ultrapilot State Management
 *
 * Handles all state persistence for Ultrapilot modes.
 * State is stored in .ultra/state/{mode}-state.json
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface UltrapilotState {
  active: boolean;
  timestamp: string;
  sessionId?: string;
}

export interface AutopilotState extends UltrapilotState {
  phase: 'expansion' | 'planning' | 'execution' | 'qa' | 'validation' | 'cleanup' | 'cancelled' | 'completed';
  status: 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';
  specPath?: string;
  planPath?: string;
  tasks: {
    total: number;
    completed: number;
    pending: number;
  };
  activeAgents?: number;
  backgroundTasks?: {
    running: number;
    total: number;
  };
  agentDetails?: Array<{
    type: string;
    model: 'opus' | 'sonnet' | 'haiku';
    duration: number;
    description: string;
  }>;
}

export interface RalphState extends UltrapilotState {
  iteration: number;
  maxIterations: number;
  linkedTo?: 'autopilot' | 'ultrawork' | 'team';
  errorHistory?: Array<{
    iteration: number;
    error: string;
    timestamp: string;
  }>;
}

export interface UltraqaState extends UltrapilotState {
  cycle: number;
  maxCycles: number;
  lastError?: string;
  testResults?: {
    passed: number;
    failed: number;
    skipped: number;
  };
}

export interface ValidationState extends UltrapilotState {
  round: number;
  maxRounds: number;
  reviewers: {
    security?: 'pending' | 'approved' | 'rejected';
    quality?: 'pending' | 'approved' | 'rejected';
    architecture?: 'pending' | 'approved' | 'rejected';
    code?: 'pending' | 'approved' | 'rejected';
  };
  findings?: Array<{
    reviewer: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    location?: string;
  }>;
}

/**
 * Get the state directory for a project
 */
export function getStateDir(projectRoot: string): string {
  const stateDir = join(projectRoot, '.ultra', 'state');
  if (!existsSync(stateDir)) {
    mkdirSync(stateDir, { recursive: true });
  }
  return stateDir;
}

/**
 * Read state for a specific mode
 */
export function readState<T extends UltrapilotState>(
  projectRoot: string,
  mode: 'autopilot' | 'ralph' | 'ultraqa' | 'validation'
): T | null {
  const stateFile = join(getStateDir(projectRoot), `${mode}-state.json`);
  if (!existsSync(stateFile)) {
    return null;
  }

  try {
    const data = readFileSync(stateFile, 'utf8');
    return JSON.parse(data) as T;
  } catch (e) {
    console.error(`Failed to read ${mode} state:`, e);
    return null;
  }
}

/**
 * Write state for a specific mode
 */
export function writeState<T extends UltrapilotState>(
  projectRoot: string,
  mode: 'autopilot' | 'ralph' | 'ultraqa' | 'validation',
  state: T
): void {
  const stateDir = getStateDir(projectRoot);
  const stateFile = join(stateDir, `${mode}-state.json`);

  state.timestamp = new Date().toISOString();
  writeFileSync(stateFile, JSON.stringify(state, null, 2));
}

/**
 * Clear state for a specific mode
 */
export function clearState(
  projectRoot: string,
  mode: 'autopilot' | 'ralph' | 'ultraqa' | 'validation'
): void {
  const stateFile = join(getStateDir(projectRoot), `${mode}-state.json`);
  if (existsSync(stateFile)) {
    // unlinkSync(stateFile);
  }
}

/**
 * Initialize autopilot state
 */
export function initAutopilotState(projectRoot: string): AutopilotState {
  return {
    active: true,
    timestamp: new Date().toISOString(),
    phase: 'expansion',
    status: 'running',
    tasks: {
      total: 0,
      completed: 0,
      pending: 0
    },
    activeAgents: 0,
    backgroundTasks: {
      running: 0,
      total: 0
    }
  };
}

/**
 * Initialize ralph state
 */
export function initRalphState(projectRoot: string, maxIterations: number = 10): RalphState {
  return {
    active: true,
    timestamp: new Date().toISOString(),
    iteration: 1,
    maxIterations,
    errorHistory: []
  };
}

/**
 * Initialize ultraqa state
 */
export function initUltraqaState(projectRoot: string, maxCycles: number = 5): UltraqaState {
  return {
    active: true,
    timestamp: new Date().toISOString(),
    cycle: 1,
    maxCycles,
    testResults: {
      passed: 0,
      failed: 0,
      skipped: 0
    }
  };
}

/**
 * Initialize validation state
 */
export function initValidationState(projectRoot: string, maxRounds: number = 3): ValidationState {
  return {
    active: true,
    timestamp: new Date().toISOString(),
    round: 1,
    maxRounds,
    reviewers: {
      security: 'pending',
      quality: 'pending',
      architecture: 'pending',
      code: 'pending'
    },
    findings: []
  };
}

/**
 * Check if any mode is active
 */
export function isAnyModeActive(projectRoot: string): boolean {
  const modes = ['autopilot', 'ralph', 'ultraqa', 'validation'] as const;
  for (const mode of modes) {
    const state = readState(projectRoot, mode);
    if (state?.active) {
      return true;
    }
  }
  return false;
}

/**
 * Get active modes
 */
export function getActiveModes(projectRoot: string): string[] {
  const modes = ['autopilot', 'ralph', 'ultraqa', 'validation'] as const;
  return modes.filter(mode => {
    const state = readState(projectRoot, mode);
    return state?.active === true;
  });
}
