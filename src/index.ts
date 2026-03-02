/**
 * Ultrapilot - Universal Development Workflow
 *
 * The ONE plugin you need.
 * Combines OMC orchestration, Superpowers workflows, and wshobson's parallel agent patterns.
 */

export * from './agents.js';
export * from './state.js';
export * from './hud.js';

/**
 * Ultrapilot version
 */
export const VERSION = '1.0.0';

/**
 * Ultrapilot agent types
 */
export const ULTRA_AGENTS = {
  // Core
  ANALYST: 'ultra:analyst',
  ARCHITECT: 'ultra:architect',
  PLANNER: 'ultra:planner',
  CRITIC: 'ultra:critic',

  // Implementation
  EXECUTOR: 'ultra:executor',
  EXECUTOR_LOW: 'ultra:executor-low',
  EXECUTOR_HIGH: 'ultra:executor-high',

  // Quality
  TEST_ENGINEER: 'ultra:test-engineer',
  VERIFIER: 'ultra:verifier',

  // Review
  SECURITY_REVIEWER: 'ultra:security-reviewer',
  QUALITY_REVIEWER: 'ultra:quality-reviewer',
  CODE_REVIEWER: 'ultra:code-reviewer',

  // Debugging
  DEBUGGER: 'ultra:debugger',
  SCIENTIST: 'ultra:scientist',

  // Support
  BUILD_FIXER: 'ultra:build-fixer',
  DESIGNER: 'ultra:designer',
  WRITER: 'ultra:writer',
  DOCUMENT_SPECIALIST: 'ultra:document-specialist',

  // Team
  TEAM_LEAD: 'ultra:team-lead',
  TEAM_IMPLEMENTER: 'ultra:team-implementer',
  TEAM_REVIEWER: 'ultra:team-reviewer',
  TEAM_DEBUGGER: 'ultra:team-debugger',

  // Agentic Systems
  CONTEXT_ENGINEER: 'ultra:context-engineer',
  ML_ENGINEER: 'ultra:ml-engineer',
  MLOPS_ENGINEER: 'ultra:mlops-engineer',
  CONDUCTOR: 'ultra:conductor',
  AGENTIC_ARCHITECT: 'ultra:agentic-architect',
  PROMPT_ENGINEER: 'ultra:prompt-engineer',
} as const;

/**
 * Ultrapilot phases
 */
export const ULTRA_PHASES = {
  EXPANSION: 'expansion',
  PLANNING: 'planning',
  EXECUTION: 'execution',
  QA: 'qa',
  VALIDATION: 'validation',
  CLEANUP: 'cleanup',
} as const;

/**
 * Ultrapilot modes
 */
export const ULTRA_MODES = {
  AUTOPILOT: 'autopilot',
  RALPH: 'ralph',
  ULTRAQA: 'ultraqa',
  VALIDATION: 'validation',
  TEAM: 'team',
} as const;
