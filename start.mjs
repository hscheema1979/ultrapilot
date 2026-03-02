#!/usr/bin/env node

/**
 * UltraX Unified Launcher
 *
 * Starts all UltraX services:
 * - UltraX Gateway API (port 3001)
 * - Relay Web UI (port 3000)
 * - Google Chat webhook handler (part of Gateway)
 *
 * One plugin to deploy - everything you need!
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SERVICES = [
  {
    name: 'UltraX Gateway',
    command: 'node',
    args: ['dist/server.js'],
    port: 3001,
    color: 'blue'
  },
  {
    name: 'Relay Web UI',
    command: 'node',
    args: ['relay/bin/cli.js'],
    port: 3000,
    color: 'green'
  }
];

async function startService(service) {
  console.log(`\n🚀 Starting ${service.name} on port ${service.port}...`);

  const child = spawn(service.command, service.args, {
    cwd: __dirname,
    stdio: 'inherit'
  });

  child.on('error', (err) => {
    console.error(`❌ Failed to start ${service.name}:`, err.message);
  });

  child.on('exit', (code, signal) => {
    console.log(`\n⚠️  ${service.name} exited with code ${code}${signal ? ` (signal: ${signal})` : ''}`);
    console.log('🛑 Stopping all UltraX services...');
    process.exit(code || 1);
  });

  // Wait a bit for the service to start
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Check if port is listening
  try {
    const response = await fetch(`http://localhost:${service.port}/health`);
    if (response.ok) {
      console.log(`✅ ${service.name} is running on http://localhost:${service.port}`);
    }
  } catch (err) {
    console.log(`⚠️  ${service.name} may still be starting (no /health endpoint yet)`);
  }

  return child;
}

async function main() {
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║           🦎 ULTRAX - All-in-One Plugin for Claude Code          ║');
  console.log('║                                                                   ║');
  console.log('║  One plugin. Zero setup. Everything you need.                 ║');
  console.log('║                                                                   ║');
  console.log('║  • 29 Specialist Agents (Ultrapilot)                              ║');
  console.log('║  • Relay Web UI (Port 3000)                                     ║');
  console.log('║  • UltraX Gateway (Port 3001)                                   ║');
  console.log('║  • Google Chat Integration                                     ║');
  console.log('║                                                                   ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  const children = [];

  // Start Gateway first
  const gateway = await startService(SERVICES[0]);
  children.push(gateway);

  // Start Relay
  const relay = await startService(SERVICES[1]);
  children.push(relay);

  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║                   ✨ ALL SERVICES RUNNING ✨                   ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝');
  console.log('\n📡 Access Points:');
  console.log(`   • Web UI:         http://localhost:3000`);
  console.log(`   • API Gateway:     http://localhost:3001`);
  console.log(`   • Health Check:    http://localhost:3001/health`);
  console.log(`   • API Docs:        http://localhost:3001/`);
  console.log('\n🔧 Management:');
  console.log(`   • Stop:           Ctrl+C`);
  console.log(`   • Restart:        Run again`);
  console.log(`   • Logs:           Check console output`);
  console.log('\n🎯 Ready for development!\n');

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Shutting down UltraX services...');
    children.forEach(child => {
      child.kill('SIGTERM');
    });
    process.exit(0);
  });
}

main().catch((err) => {
  console.error('Failed to start UltraX:', err);
  process.exit(1);
});
