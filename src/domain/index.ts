/**
 * Domain Agency Integration for UltraPilot
 *
 * This module provides integration between UltraPilot agents and the domain-agency framework,
 * enabling:
 * - Task queue management (intake, in-progress, review, completed, failed)
 * - File ownership tracking for conflict prevention
 * - Agent bridging between UltraPilot and domain operations
 * - Integration with RoutineScheduler, ConflictResolver, and TieredAutonomy
 *
 * @module domain
 */

// Export DomainManager as the main entry point
export {
  DomainManager,
  createDomainManager,
  type DomainManagerConfig,
  type DomainManagerStats
} from './DomainManager.js';

// Export TaskQueue and related types
export {
  TaskQueue,
  type Task,
  type TaskStatus,
  type TaskPriority,
  type AgentType,
  type QueueStats,
  type TaskQueueConfig
} from './TaskQueue.js';

// Export FileOwnershipManager and related types
export {
  FileOwnershipManager,
  type FileOwnership,
  type OwnershipStatus,
  type FileConflict,
  type FileOwnershipConfig
} from './FileOwnership.js';

// Export AgentBridge and related types
export {
  AgentBridge,
  getAgentCapabilities,
  getCapability,
  type UltraPilotAgentType,
  type AgentCapability,
  type AgentBridgeConfig
} from './AgentBridge.js';

// Export DomainInitializer and related types
export {
  DomainInitializer,
  createDomainInitializer,
  type DomainConfig,
  type DomainInitOptions,
  type DomainValidation
} from './DomainInitializer.js';

// Export AutoloopDaemon and related types
export {
  AutoloopDaemon,
  createAutoloopDaemon,
  runAutoloopDaemon,
  type AutoloopConfig,
  type AutoloopState,
  type HeartbeatState
} from './AutoloopDaemon.js';

/**
 * Default export - DomainManager class
 */
export { DomainManager as default } from './DomainManager.js';
