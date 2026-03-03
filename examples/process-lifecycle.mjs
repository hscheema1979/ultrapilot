#!/usr/bin/env node

/**
 * Process Lifecycle Management - Example Usage
 *
 * Demonstrates:
 * - Spawning child processes
 * - Health monitoring
 * - Graceful shutdown
 * - IPC communication
 * - Auto-restart on failure
 */

import {
  ProcessManager,
  ProcessConfig,
  ProcessRole,
  LifecycleEvent
} from '../dist/process/index.js';

async function main() {
  console.log('=== UltraPilot Process Lifecycle Management Demo ===\n');

  // Create process manager
  const manager = new ProcessManager();

  // Subscribe to lifecycle events
  manager.on('spawn', (data) => {
    console.log(`[SPAWN] Process ${data.handle.role} (PID: ${data.handle.pid})`);
  });

  manager.on('ready', (data) => {
    console.log(`[READY] Process ${data.handle.role} (PID: ${data.handle.pid})`);
  });

  manager.on('crash', (data) => {
    console.log(`[CRASH] Process ${data.handle.role} (PID: ${data.handle.pid}) - ${data.data?.error?.message || 'Unknown error'}`);
  });

  manager.on('restart', (data) => {
    console.log(`[RESTART] Process ${data.handle.role} (PID: ${data.handle.pid}) - Restart #${data.data?.restartCount}`);
  });

  manager.on('shutdown', (data) => {
    console.log(`[SHUTDOWN] Process ${data.handle.role} (PID: ${data.handle.pid})`);
  });

  // Example 1: Simple process spawn
  console.log('\n--- Example 1: Simple Process Spawn ---');
  const simpleConfig: ProcessConfig = {
    role: 'custom',
    command: process.execPath,
    args: ['-e', 'console.log("Hello from child process!"); setTimeout(() => process.exit(0), 2000);'],
    cwd: process.cwd()
  };

  const simpleHandle = await manager.spawn(simpleConfig);
  console.log(`Spawned process with PID: ${simpleHandle.pid}`);

  // Example 2: Process with health monitoring
  console.log('\n--- Example 2: Process with Health Monitoring ---');
  const monitoredConfig: ProcessConfig = {
    role: 'worker',
    command: process.execPath,
    args: ['-e', `
      setInterval(() => {
        console.log('Worker is running...');
      }, 1000);
    `],
    healthCheck: {
      type: 'heartbeat',
      interval: 2000,
      timeout: 1000,
      threshold: 3
    }
  };

  const monitoredHandle = await manager.spawn(monitoredConfig);
  console.log(`Spawned monitored process with PID: ${monitoredHandle.pid}`);

  // Monitor metrics
  setTimeout(() => {
    const metrics = manager.getMetrics(monitoredHandle.pid);
    if (metrics) {
      console.log(`Metrics: CPU=${metrics.cpuPercent.toFixed(2)}%, Memory=${metrics.memoryMB.toFixed(2)}MB, Uptime=${metrics.uptime}ms`);
    }
  }, 3000);

  // Example 3: Process with IPC
  console.log('\n--- Example 3: Process with IPC ---');
  const ipcConfig: ProcessConfig = {
    role: 'communicator',
    command: process.execPath,
    args: ['-e', `
      process.on('message', (msg) => {
        console.log('Received message:', JSON.stringify(msg));
        if (msg.type === 'ping') {
          process.send({ type: 'pong', timestamp: new Date() });
        }
      });
      setInterval(() => {}, 1000);
    `],
    metadata: {
      enableIPC: true
    }
  };

  const ipcHandle = await manager.spawn(ipcConfig, { ipc: true });

  // Send message via IPC
  if (ipcHandle.ipc) {
    await ipcHandle.ipc.send({
      type: 'ping',
      payload: { hello: 'world' },
      timestamp: new Date()
    });
    console.log('Sent IPC message to process');
  }

  // Example 4: Auto-restart on crash
  console.log('\n--- Example 4: Auto-Restart on Crash ---');
  const restartConfig: ProcessConfig = {
    role: 'unstable',
    command: process.execPath,
    args: ['-e', `
      console.log('Unstable process starting...');
      setTimeout(() => {
        console.log('Unstable process crashing!');
        process.exit(1);
      }, 2000);
    `],
    autoRestart: true,
    maxRestarts: 2,
    restartBackoff: 1.5,
    healthCheck: {
      type: 'heartbeat',
      interval: 1000,
      timeout: 500,
      threshold: 2
    }
  };

  await manager.spawn(restartConfig);

  // Example 5: Detached daemon process
  console.log('\n--- Example 5: Detached Daemon Process ---');
  const daemonConfig: ProcessConfig = {
    role: 'autoloop',
    command: process.execPath,
    args: ['-e', `
      console.log('Daemon process running...');
      setInterval(() => {
        console.log('Daemon heartbeat:', new Date().toISOString());
      }, 3000);
    `],
    detached: true,
    autoRestart: true,
    maxRestarts: 5,
    healthCheck: {
      type: 'heartbeat',
      interval: 5000,
      timeout: 2000,
      threshold: 3
    }
  };

  const daemonHandle = await manager.spawn(daemonConfig);
  console.log(`Spawned daemon process with PID: ${daemonHandle.pid}`);

  // Example 6: Process queries
  console.log('\n--- Example 6: Process Queries ---');
  setTimeout(() => {
    const allProcesses = manager.list();
    console.log(`Total processes: ${allProcesses.length}`);

    const workers = manager.getByRole('worker');
    console.log(`Worker processes: ${workers.length}`);

    const running = manager.getCountByStatus('running');
    console.log(`Running processes: ${running}`);
  }, 1000);

  // Example 7: Graceful shutdown
  console.log('\n--- Example 7: Graceful Shutdown ---');
  setTimeout(async () => {
    console.log('Initiating graceful shutdown...');

    await manager.shutdown(monitoredHandle, {
      timeout: 5000,
      onShutdownStart: (handle) => {
        console.log(`Shutdown started for PID: ${handle.pid}`);
      },
      onShutdownComplete: (handle) => {
        console.log(`Shutdown complete for PID: ${handle.pid}`);
      }
    });

    console.log('Process shut down gracefully');
  }, 5000);

  // Keep running for demo
  console.log('\n--- Demo running (press Ctrl+C to exit) ---');

  // Setup cleanup on exit
  process.on('SIGINT', async () => {
    console.log('\n\nShutting down all processes...');
    await manager.shutdownAll({ timeout: 10000, forceKill: true });
    console.log('All processes shut down. Goodbye!');
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n\nShutting down all processes...');
    await manager.shutdownAll({ timeout: 10000, forceKill: true });
    console.log('All processes shut down. Goodbye!');
    process.exit(0);
  });

  // Keep alive
  await new Promise(() => {});
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { main };
