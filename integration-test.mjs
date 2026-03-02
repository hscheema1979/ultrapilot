#!/usr/bin/env node
/**
 * Integration test for AgentRegistry
 */

import { AgentRegistry } from './dist/registry.js';

console.log('🧪 Integration Test: Agent Registry\n');

let passed = 0;
let failed = 0;

// Test 1: All agents registered
const coverage = AgentRegistry.validateCoverage();
if (coverage.valid && coverage.mapped === 22) {
  console.log('✅ Test 1: All 22 agents registered');
  passed++;
} else {
  console.log('❌ Test 1: Agent coverage incomplete');
  failed++;
}

// Test 2: Invocation returns correct structure
const invocation = AgentRegistry.invoke('ultra:analyst', 'Test');
if (invocation && invocation.skill && invocation.model && invocation.input) {
  console.log('✅ Test 2: Invocation structure valid');
  passed++;
} else {
  console.log('❌ Test 2: Invocation structure invalid');
  failed++;
}

// Test 3: Model tiers correct
const opusCount = AgentRegistry.getAgentsByModel('opus').length;
const sonnetCount = AgentRegistry.getAgentsByModel('sonnet').length;
const haikuCount = AgentRegistry.getAgentsByModel('haiku').length;

if (opusCount === 7 && sonnetCount === 13 && haikuCount === 2) {
  console.log('✅ Test 3: Model tier distribution correct');
  passed++;
} else {
  console.log('❌ Test 3: Model tier distribution incorrect');
  failed++;
}

// Test 4: Specialized skills mapped correctly
const securityMapping = AgentRegistry.getMapping('ultra:security-reviewer');
const debugMapping = AgentRegistry.getMapping('ultra:debugger');
const codeReviewMapping = AgentRegistry.getMapping('ultra:code-reviewer');

if (
  securityMapping?.mapsTo === 'ultra-security-review' &&
  debugMapping?.mapsTo === 'ultra-debugging' &&
  codeReviewMapping?.mapsTo === 'ultra-code-review'
) {
  console.log('✅ Test 4: Specialized skills mapped correctly');
  passed++;
} else {
  console.log('❌ Test 4: Specialized skills mapping incorrect');
  failed++;
}

// Test 5: System prompts included
const analystInvocation = AgentRegistry.invoke('ultra:analyst', 'Test');
if (analystInvocation?.input.includes('Requirements Analyst')) {
  console.log('✅ Test 5: System prompts included in invocations');
  passed++;
} else {
  console.log('❌ Test 5: System prompts missing');
  failed++;
}

// Test 6: Context support
const contextInvocation = AgentRegistry.invoke(
  'ultra:planner',
  'Plan this',
  { context: 'Test context' }
);
if (contextInvocation?.input.includes('Test context')) {
  console.log('✅ Test 6: Context support working');
  passed++;
} else {
  console.log('❌ Test 6: Context support broken');
  failed++;
}

console.log(`\n📊 Results: ${passed}/6 tests passed`);

if (failed === 0) {
  console.log('🎉 All integration tests passed!');
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed');
  process.exit(1);
}
