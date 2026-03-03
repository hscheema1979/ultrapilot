#!/usr/bin/env node

/**
 * Process Manager + Session Manager Integration Demo
 *
 * Demonstrates how ProcessManager integrates with SessionManager
 * to spawn Ultra-Lead and Autoloop processes with proper lifecycle
 * management.
 */

import {
  ProcessManager,
  ProcessFactory
} from '../dist/process/index.js';

import {
  SessionManager,
  SessionRole
} from '../dist/session/index.js';

async function demonstrateIntegration() {
  console.log('=== Process & Session Manager Integration Demo ===\n');

  // Initialize managers
  const processManager = new ProcessManager();
  const sessionManager = new SessionManager();
  const factory = processManager.getFactory();

  const workspacePath = process.cwd();
  const domainId = 'demo-domain';

  // Subscribe to process lifecycle events
  processManager.on('spawn', (data) => {
    console.log(`[PROCESS] Spawned ${data.handle.role} (PID: ${data.handle.pid})`);
  });

  processManager.on('crash', (data) => {
    console.log(`[PROCESS] Crashed ${data.handle.role} - attempting restart`);
  });

  processManager.on('shutdown', (data) => {
    console.log(`[PROCESS] Shutdown ${data.handle.role} (PID: ${data.handle.pid})`);
  });

  // Scenario 1: Create session and spawn Ultra-Lead
  console.log('--- Scenario 1: Session with Ultra-Lead ---');

  const sessionId = await sessionManager.createSession({
    role: SessionRole.ULTRA_LEAD,
    workspacePath,
    domainId
  });

  console.log(`Created session: ${sessionId}`);

  // Spawn Ultra-Lead process using factory
  const ultraLead = await factory.spawnUltraLead({
    workspacePath,
    sessionId
  });

  console.log(`Spawned Ultra-Lead: PID ${ultraLead.pid}`);

  // Update session with process info
  const session = sessionManager.getSession(sessionId);
  if (session) {
    (session as any).ultraLeadPid = ultraLead.pid;
    console.log(`Attached Ultra-Lead PID ${ultraLead.pid} to session ${sessionId}`);
  }

  // Scenario 2: Spawn Autoloop daemon
  console.log('\n--- Scenario 2: Autoloop Daemon ---');

  const autoloop = await factory.spawnAutoloop({
    workspacePath,
    domainId
  });

  console.log(`Spawned Autoloop daemon: PID ${autoloop.pid}`);

  // Scenario 3: Spawn worker processes for parallel tasks
  console.log('\n--- Scenario 3: Worker Processes ---');

  const tasks = [
    { taskId: 'task-1', agentId: 'ultra:executor' },
    { taskId: 'task-2', agentId: 'ultra:executor' },
    { taskId: 'task-3', agentId: 'ultra:test-engineer' }
  ];

  const workers = await Promise.all(
    tasks.map(task =>
      factory.spawnWorker({
        ...task,
        workspacePath
      })
    )
  );

  console.log(`Spawned ${workers.length} worker processes`);
  workers.forEach(w => console.log(`  - Worker PID ${w.pid} for ${w.metadata?.taskId}`));

  // Scenario 4: Monitor process health
  console.log('\n--- Scenario 4: Health Monitoring ---');

  setTimeout(() => {
    console.log('\nProcess Status:');
    const processes = processManager.list();

    processes.forEach(handle => {
      const metrics = processManager.getMetrics(handle.pid);
      const status = metrics
        ? `${handle.status} (CPU: ${metrics.cpuPercent.toFixed(1)}%, MEM: ${metrics.memoryMB.toFixed(1)}MB)`
        : handle.status;

      console.log(`  ${handle.role.padEnd(15)} PID ${handle.pid.toString().padEnd(8)} ${status}`);
    });
  }, 2000);

  // Scenario 5: Query processes by role
  console.log('\n--- Scenario 5: Process Queries ---');

  setTimeout(() => {
    const ultraLeads = processManager.getByRole('ultra-lead');
    const autoloops = processManager.getByRole('autoloop');
    const workersList = processManager.getByRole('worker');

    console.log(`Ultra-Lead processes: ${ultraLeads.length}`);
    console.log(`Autoloop processes: ${autoloops.length}`);
    console.log(`Worker processes: ${workersList.length}`);
  }, 2500);

  // Scenario 6: Graceful shutdown of specific process
  console.log('\n--- Scenario 6: Selective Shutdown ---');

  setTimeout(async () => {
    if (workers.length > 0) {
      const worker = workers[0];
      console.log(`Shutting down worker ${worker.pid}...`);

      await processManager.shutdown(worker, {
        timeout: 5000,
        onShutdownStart: (h) => console.log(`  Shutdown started for PID ${h.pid}`),
        onShutdownComplete: (h) => console.log(`  Shutdown complete for PID ${h.pid}`)
      });

      console.log(`Worker ${worker.pid} shut down gracefully`);
    }
  }, 3000);

  // Scenario 7: Shutdown all processes by role
  console.log('\n--- Scenario 7: Shutdown All Workers ---');

  setTimeout(async () => {
    const workers = processManager.getByRole('worker');

    console.log(`Shutting down ${workers.length} worker processes...`);

    await Promise.all(
      workers.map(w =>
        processManager.shutdown(w, { timeout: 5000 })
      )
    );

    console.log('All workers shut down');
  }, 4000);

  // Scenario 8: Session cleanup
  console.log('\n--- Scenario 8: Session Cleanup ---');

  setTimeout(async () => {
    console.log('Stopping session...');
    await sessionManager.stopSession(sessionId);
    console.log(`Session ${sessionId} stopped`);

    // Note: Ultra-Lead and Autoloop would be shut down
    // by session cleanup in production
  }, 5000);

  // Final cleanup
  setTimeout(async () => {
    console.log('\n--- Final Cleanup ---');
    console.log('Shutting down all remaining processes...');

    await processManager.shutdownAll({
      timeout: 10000,
      forceKill: true
    });

    console.log('All processes shut down');
    console.log('Session manager cleanup...');
    sessionManager.shutdown();

    console.log('\nDemo complete!');
    process.exit(0);
  }, 6000);

  // Handle interrupts
  process.on('SIGINT', async () => {
    console.log('\n\nInterrupted! Cleaning up...');
    await processManager.shutdownAll({ timeout: 10000, forceKill: true });
    sessionManager.shutdown();
    console.log('Cleanup complete. Goodbye!');
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n\nTerminated! Cleaning up...');
    await processManager.shutdownAll({ timeout: 10000, forceKill: true });
    sessionManager.shutdown();
    console.log('Cleanup complete. Goodbye!');
    process.exit(0);
  });

  // Keep running
  await new Promise(() => {});
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  demonstrateIntegration().catch(console.error);
}

export { demonstrateIntegration };
