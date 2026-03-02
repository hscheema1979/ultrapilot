#!/usr/bin/env node
/**
 * Ultrapilot Agent Registry Demo
 *
 * Demonstrates the agent registry functionality.
 */

import { AgentRegistry } from './dist/registry.js';

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║        Ultrapilot Agent Registry - Demo                    ║');
console.log('╚════════════════════════════════════════════════════════════╝');
console.log();

// 1. Coverage validation
console.log('📊 Registry Coverage');
console.log('─'.repeat(60));
const coverage = AgentRegistry.validateCoverage();
console.log(`  Total Agents in Catalog: ${coverage.total}`);
console.log(`  Agents with Mappings:   ${coverage.mapped}`);
console.log(`  Unmapped Agents:        ${coverage.unmapped.length || 'None'}`);
console.log(`  Coverage Valid:         ${coverage.valid ? '✅ YES' : '❌ NO'}`);
console.log();

// 2. Statistics
console.log('📈 Registry Statistics');
console.log('─'.repeat(60));
const stats = AgentRegistry.getStats();
console.log(`  Total Agents: ${stats.totalAgents}`);
console.log();
console.log('  Distribution by Model:');
console.log(`    • Opus (complex reasoning):   ${stats.byModel.opus} agents`);
console.log(`    • Sonnet (standard tasks):    ${stats.byModel.sonnet} agents`);
console.log(`    • Haiku (simple/focused):     ${stats.byModel.haiku} agents`);
console.log();
console.log('  Distribution by Skill:');
Object.entries(stats.bySkill)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5)
  .forEach(([skill, count]) => {
    const pct = ((count / stats.totalAgents) * 100).toFixed(0);
    console.log(`    • ${skill.padEnd(25)} ${count} agents (${pct}%)`);
  });
console.log();

// 3. Agent categories
console.log('🗂️  Agents by Category');
console.log('─'.repeat(60));
const byCategory = AgentRegistry.getAgentsByCategory();
Object.entries(byCategory).forEach(([category, agents]) => {
  console.log(`  ${category.charAt(0).toUpperCase() + category.slice(1)} (${agents.length}):`);
  agents.forEach(agent => {
    const info = AgentRegistry.getAgentInfo(agent);
    const mapping = AgentRegistry.getMapping(agent);
    const modelIcon = mapping.model === 'opus' ? '🔴' : mapping.model === 'sonnet' ? '🟡' : '🟢';
    console.log(`    ${modelIcon} ${agent}`);
  });
  console.log();
});

// 4. Sample invocations
console.log('🚀 Sample Agent Invocations');
console.log('─'.repeat(60));

const examples = [
  {
    agent: 'ultra:analyst',
    task: 'Analyze requirements for a task management API',
    context: 'User wants to build a REST API'
  },
  {
    agent: 'ultra:executor',
    task: 'Implement user authentication',
    context: 'Using JWT tokens'
  },
  {
    agent: 'ultra:security-reviewer',
    task: 'Review authentication implementation',
    context: 'Focus on OWASP Top 10'
  },
  {
    agent: 'ultra:team-lead',
    task: 'Orchestrate parallel feature development',
    context: '3 developers working on different modules'
  }
];

examples.forEach(({ agent, task, context }) => {
  const info = AgentRegistry.getAgentInfo(agent);
  const mapping = AgentRegistry.getMapping(agent);
  const invocation = AgentRegistry.invoke(agent, task, { context });

  console.log(`  Agent: ${agent}`);
  console.log(`  Name:  ${info.name}`);
  console.log(`  Maps:  ${invocation.skill} (${invocation.model})`);
  console.log(`  Task:  ${task.substring(0, 50)}...`);
  console.log();
});

// 5. Specialized agents
console.log('🎯 Specialized Skills');
console.log('─'.repeat(60));
const specializedAgents = [
  'ultra:security-reviewer',
  'ultra:code-reviewer',
  'ultra:debugger'
];

specializedAgents.forEach(agent => {
  const mapping = AgentRegistry.getMapping(agent);
  const info = AgentRegistry.getAgentInfo(agent);
  console.log(`  ${agent}`);
  console.log(`    → Maps to: ${mapping.mapsTo}`);
  console.log(`    → Model: ${mapping.model}`);
  console.log(`    → Purpose: ${info.description.substring(0, 60)}...`);
  console.log();
});

// 6. Model tier examples
console.log('⚙️  Model Tier Examples');
console.log('─'.repeat(60));

console.log('  Opus (Complex):');
AgentRegistry.getAgentsByModel('opus').slice(0, 3).forEach(agent => {
  console.log(`    • ${agent}`);
});
console.log();

console.log('  Sonnet (Standard):');
AgentRegistry.getAgentsByModel('sonnet').slice(0, 3).forEach(agent => {
  console.log(`    • ${agent}`);
});
console.log();

console.log('  Haiku (Simple):');
AgentRegistry.getAgentsByModel('haiku').forEach(agent => {
  console.log(`    • ${agent}`);
});
console.log();

// 7. Workflow example
console.log('🔄 Example Workflow: Building a Feature');
console.log('─'.repeat(60));

const workflow = [
  { phase: 'Expansion', agent: 'ultra:analyst', task: 'Extract requirements' },
  { phase: 'Expansion', agent: 'ultra:architect', task: 'Design system' },
  { phase: 'Planning', agent: 'ultra:planner', task: 'Create implementation plan' },
  { phase: 'Planning', agent: 'ultra:critic', task: 'Validate the plan' },
  { phase: 'Execution', agent: 'ultra:team-lead', task: 'Orchestrate development' },
  { phase: 'Execution', agent: 'ultra:team-implementer', task: 'Implement features' },
  { phase: 'QA', agent: 'ultra:test-engineer', task: 'Ensure test coverage' },
  { phase: 'QA', agent: 'ultra:build-fixer', task: 'Fix any build issues' },
  { phase: 'Validation', agent: 'ultra:security-reviewer', task: 'Security review' },
  { phase: 'Validation', agent: 'ultra:quality-reviewer', task: 'Quality review' },
  { phase: 'Validation', agent: 'ultra:code-reviewer', task: 'Code review' },
  { phase: 'Verification', agent: 'ultra:verifier', task: 'Verify completion' }
];

workflow.forEach(({ phase, agent, task }) => {
  const mapping = AgentRegistry.getMapping(agent);
  console.log(`  [${phase.padEnd(12)}] ${agent.padEnd(25)} → ${mapping.mapsTo}`);
});
console.log();

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║  ✅ All 22 agents registered, mapped, and ready to use!     ║');
console.log('╚════════════════════════════════════════════════════════════╝');
