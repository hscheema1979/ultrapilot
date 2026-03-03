#!/usr/bin/env node

/**
 * Intent Detection Demo
 *
 * Demonstrates the hybrid execution architecture in action.
 */

import { IntentDetector } from './dist/intent-detection/IntentDetector.js';

const testInputs = [
  // Direct examples
  'what is the best way to structure this code?',
  'how do I implement authentication?',
  'explain the architecture',
  'think about solutions',

  // Autonomous examples
  'build me a REST API for user management',
  'create a complete dashboard with charts',
  'implement authentication with OAuth',
  'develop a real-time notification system',

  // Gray zone examples
  'add a button to the form',
  'create a simple API endpoint',
  'update the database schema'
];

async function demo() {
  console.log('\n=== Intent Detection Demo ===\n');

  const detector = new IntentDetector();

  for (const input of testInputs) {
    const analysis = await detector.analyze(input);

    console.log(`Input: "${input}"`);
    console.log(`  Task Type: ${analysis.pattern.taskType}`);
    console.log(`  Complexity: ${analysis.complexity.score}/100`);
    console.log(`  Steps: ${analysis.complexity.estimatedSteps}`);
    console.log(`  Mode: ${analysis.decision.mode.toUpperCase()}`);
    console.log(`  Confidence: ${(analysis.decision.confidence * 100).toFixed(0)}%`);
    console.log(`  Reasoning: ${analysis.decision.reasoning}`);
    console.log('');
  }

  // Show statistics
  const stats = await detector.getStats();
  console.log('=== Statistics ===');
  console.log(`Total Analyses: ${stats.totalAnalyses}`);
  console.log(`Direct Decisions: ${stats.directDecisions}`);
  console.log(`Autonomous Decisions: ${stats.autonomousDecisions}`);
  console.log(`Average Response Time: ${stats.averageResponseTime.toFixed(2)}ms`);
  console.log('');
}

demo().catch(console.error);
