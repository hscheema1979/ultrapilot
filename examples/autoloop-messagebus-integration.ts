/**
 * Autoloop AgentMessageBus Integration Example
 *
 * Demonstrates how to:
 * 1. Create an AutoloopDaemon with message bus integration
 * 2. Subscribe to autoloop events
 * 3. Receive real-time updates
 */

import { createAutoloopDaemon } from '../src/domain/AutoloopDaemon.js';
import { AgentMessageBus } from '../src/agent-comms/AgentMessageBus.js';
import { SessionManager } from '../src/session/SessionManager.js';
import * as path from 'path';

async function main() {
  const workspacePath = process.cwd();

  console.log('='.repeat(70));
  console.log('Autoloop AgentMessageBus Integration Example');
  console.log('='.repeat(70));
  console.log();

  // Create shared message bus and session manager
  const messageBus = new AgentMessageBus({
    dbPath: path.join(workspacePath, '.ultra', 'state', 'messages.db')
  });

  const sessionManager = new SessionManager();

  // Subscribe to autoloop heartbeat events
  console.log('📡 Subscribing to autoloop events...');

  const heartbeatSubscription = messageBus.subscribe(
    'example-monitor',
    'autoloop',
    async (message) => {
      if (message.type === 'autoloop.heartbeat') {
        const payload = message.payload as any;
        console.log();
        console.log('💓 Heartbeat received:');
        console.log(`   Cycle: ${payload.cycleNumber}`);
        console.log(`   Uptime: ${Math.floor(payload.payload.uptime / 1000)}s`);
        console.log(`   Tasks: ${payload.payload.tasksProcessed}`);
        console.log(`   Routines: ${payload.payload.routinesExecuted}`);
        console.log(`   Errors: ${payload.payload.errors}`);
      }
    }
  );

  // Subscribe to task events
  const taskSubscription = messageBus.subscribe(
    'example-monitor',
    'autoloop.tasks',
    async (message) => {
      const payload = message.payload as any;
      console.log();
      if (message.type === 'autoloop.task.queued') {
        console.log('📋 Task queued:', payload.payload.taskTitle);
      } else if (message.type === 'autoloop.task.started') {
        console.log('▶️  Task started:', payload.payload.taskTitle);
        console.log(`    Agent: ${payload.payload.agentSkill}`);
      } else if (message.type === 'autoloop.task.completed') {
        console.log('✅ Task completed:', payload.payload.taskTitle);
        console.log(`    Duration: ${payload.payload.duration}ms`);
      } else if (message.type === 'autoloop.task.failed') {
        console.log('❌ Task failed:', payload.payload.taskTitle);
        console.log(`    Error: ${payload.payload.error}`);
      }
    }
  );

  // Subscribe to cycle events
  const cycleSubscription = messageBus.subscribe(
    'example-monitor',
    'autoloop.cycles',
    async (message) => {
      if (message.type === 'autoloop.cycle.complete') {
        const payload = message.payload as any;
        console.log();
        console.log('🔄 Cycle complete:', payload.cycleNumber);
        console.log(`   Tasks: ${payload.payload.tasksProcessed}`);
        console.log(`   Routines: ${payload.payload.routinesExecuted.length}`);
        console.log(`   Errors: ${payload.payload.errors.length}`);
        console.log(`   Duration: ${payload.payload.duration}ms`);
      }
    }
  );

  // Subscribe to daemon lifecycle events
  const daemonSubscription = messageBus.subscribe(
    'example-monitor',
    'autoloop',
    async (message) => {
      const payload = message.payload as any;
      if (message.type === 'autoloop.daemon.started') {
        console.log();
        console.log('🚀 Daemon started');
        console.log(`   Session: ${payload.sessionId}`);
      } else if (message.type === 'autoloop.daemon.stopped') {
        console.log();
        console.log('🛑 Daemon stopped');
      }
    }
  );

  console.log('✅ Subscriptions active');
  console.log();
  console.log('Starting Autoloop daemon...');
  console.log('(Press Ctrl+C to stop)');
  console.log();

  // Create and start autoloop daemon
  const daemon = createAutoloopDaemon(
    {
      workspacePath,
      cycleTime: 60, // 60 seconds
      enableRoutines: true,
      enableTaskProcessing: true,
      enableHealthChecks: true,
      verboseLogging: true
    },
    messageBus,
    sessionManager
  );

  await daemon.start();

  // Handle shutdown
  process.on('SIGINT', async () => {
    console.log();
    console.log('Shutting down...');

    // Unsubscribe
    heartbeatSubscription.unsubscribe();
    taskSubscription.unsubscribe();
    cycleSubscription.unsubscribe();
    daemonSubscription.unsubscribe();

    // Stop daemon
    await daemon.stop();

    // Close message bus
    await messageBus.close();

    console.log('Goodbye!');
    process.exit(0);
  });

  // Keep process alive
  process.stdin.resume();
}

// Run example
main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
