#!/usr/bin/env node

/**
 * ultra-discover-agents CLI Command
 *
 * Discovers and catalogs all wshobson agents
 */

import { createInMemoryRepository } from '../../src/wshobson/repositories/in-memory.js';

const WSHOBSON_PLUGINS_DEFAULT = process.env.WSHOBSON_AGENTS_PATH ||
  './wshobson-agents/plugins';

async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║         wshobson Agent Discovery                                 ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log();

  const pluginsDir = process.argv[2] || WSHOBSON_PLUGINS_DEFAULT;

  console.log(`Scanning: ${pluginsDir}`);
  console.log();

  try {
    const startTime = Date.now();
    
    const repo = await createInMemoryRepository(pluginsDir);
    const stats = await repo.getStats();

    const scanTime = Date.now() - startTime;

    console.log(`✓ Discovery complete in ${scanTime}ms`);
    console.log();
    console.log(`Statistics:`);
    console.log(`  Plugins:  ${stats.pluginCount}`);
    console.log(`  Agents:   ${stats.agentCount}`);
    console.log(`  Capabilities: ${stats.capabilityCount}`);
    console.log();

    // Show top 10 plugins by agent count
    console.log(`Top Plugins by Agent Count:`);

    // Get all plugins and sort by agent count
    const allAgents = Array.from(await repo.query({}));
    const pluginCounts = new Map<string, number>();

    for (const agent of allAgents) {
      const count = pluginCounts.get(agent.plugin) || 0;
      pluginCounts.set(agent.plugin, count + 1);
    }

    const sorted = Array.from(pluginCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    for (let i = 0; i < sorted.length; i++) {
      const [plugin, count] = sorted[i];
      console.log(`  ${i + 1}. ${plugin}: ${count} agents`);
    }

    console.log();
    console.log('✓ Discovery successful');

  } catch (error) {
    console.error(`✗ Discovery failed: ${error}`);
    process.exit(1);
  }
}

main();
