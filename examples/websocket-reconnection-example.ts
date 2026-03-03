/**
 * WebSocket Reconnection Protocol - Usage Example
 *
 * This example demonstrates how to use the reconnection protocol
 * to enable WebSocket clients to reconnect and receive missed messages.
 */

import {
  getReconnectionProtocol,
  getGlobalSequenceManager,
  getClientStateManager,
  type ReconnectionRequest
} from '../src/server/index.js';
import { AgentMessageBus } from '../src/agent-comms/AgentMessageBus.js';

/**
 * Example 1: Basic Reconnection Flow
 */
async function basicReconnectionExample() {
  console.log('=== Basic Reconnection Example ===\n');

  const protocol = getReconnectionProtocol();
  const messageBus = new AgentMessageBus();

  // Simulate client connection
  const clientId = 'client-example-1';
  const clientManager = getClientStateManager();
  clientManager.registerClient(clientId, { userAgent: 'example-client' });

  // Subscribe to topics
  clientManager.addSubscription(clientId, 'notifications');
  clientManager.addSubscription(clientId, 'events');

  // Simulate receiving messages (sequences 1-10)
  for (let i = 1; i <= 10; i++) {
    await messageBus.publish('system', 'notifications', {
      type: 'test-notification',
      payload: { message: `Notification ${i}` }
    });

    // Update client's last sequence
    if (i === 10) {
      clientManager.updateLastSequence(clientId, i);
    }
  }

  console.log(`Client received up to sequence 10`);

  // Client disconnects...

  // More messages are published (sequences 11-20)
  for (let i = 11; i <= 20; i++) {
    await messageBus.publish('system', 'notifications', {
      type: 'test-notification',
      payload: { message: `Notification ${i}` }
    });
  }

  console.log(`Server published messages 11-20 while client was disconnected`);

  // Client reconnects
  const reconnectRequest: ReconnectionRequest = {
    clientId,
    lastSequenceNumber: 10,
    subscriptions: ['notifications', 'events']
  };

  const response = await protocol.reconnect(reconnectRequest);

  console.log('\nReconnection Response:');
  console.log(`- Success: ${response.success}`);
  console.log(`- Messages caught up: ${response.messagesCaughtUp}`);
  console.log(`- Duplicates skipped: ${response.duplicatesSkipped}`);
  console.log(`- Current sequence: ${response.currentSequenceNumber}`);
  console.log(`- Gaps detected: ${response.gaps.length}`);

  console.log('\nCaught-up messages:');
  response.messages.forEach((msg, idx) => {
    console.log(`  ${idx + 1}. [Seq ${msg.sequenceNumber}] ${JSON.stringify(msg.payload)}`);
  });
}

/**
 * Example 2: Large Gap Recovery
 */
async function largeGapRecoveryExample() {
  console.log('\n\n=== Large Gap Recovery Example ===\n');

  const protocol = getReconnectionProtocol();
  const messageBus = new AgentMessageBus();

  const clientId = 'client-example-2';
  const clientManager = getClientStateManager();
  clientManager.registerClient(clientId);

  // Client has sequence 100
  clientManager.updateLastSequence(clientId, 100);

  // Simulate 1000 messages published during disconnect
  console.log('Publishing 1000 messages...');
  for (let i = 101; i <= 1100; i++) {
    await messageBus.publish('system', 'events', {
      type: 'bulk-event',
      payload: { index: i, data: `Event ${i}` }
    });
  }

  // Client reconnects with large gap
  const reconnectRequest: ReconnectionRequest = {
    clientId,
    lastSequenceNumber: 100,
    subscriptions: ['events']
  };

  const startTime = Date.now();
  const response = await protocol.reconnect(reconnectRequest, {
    maxMessages: 10000,
    batchSize: 100
  });
  const duration = Date.now() - startTime;

  console.log('\nLarge Gap Recovery Results:');
  console.log(`- Messages caught up: ${response.messagesCaughtUp}`);
  console.log(`- Recovery time: ${duration}ms`);
  console.log(`- Time per message: ${(duration / response.messagesCaughtUp).toFixed(2)}ms`);
  console.log(`- Messages per second: ${Math.round(response.messagesCaughtUp / (duration / 1000))}`);
}

/**
 * Example 3: Batch Delivery
 */
async function batchDeliveryExample() {
  console.log('\n\n=== Batch Delivery Example ===\n');

  const protocol = getReconnectionProtocol();
  const messageBus = new AgentMessageBus();

  const clientId = 'client-example-3';
  const clientManager = getClientStateManager();
  clientManager.registerClient(clientId);

  // Client has sequence 0
  clientManager.updateLastSequence(clientId, 0);

  // Publish 500 messages
  console.log('Publishing 500 messages...');
  for (let i = 1; i <= 500; i++) {
    await messageBus.publish('system', 'notifications', {
      type: 'batch-event',
      payload: { index: i }
    });
  }

  // Retrieve in batches
  let totalReceived = 0;
  let batchNumber = 0;

  while (true) {
    const batch = await protocol.getMessagesByBatch(
      0,
      ['notifications'],
      batchNumber,
      { batchSize: 50 }
    );

    if (batch.length === 0) break;

    totalReceived += batch.length;
    batchNumber++;

    console.log(`Batch ${batchNumber}: Received ${batch.length} messages (Seq ${batch[0].message.sequenceNumber}-${batch[batch.length - 1].message.sequenceNumber})`);

    if (totalReceived >= 500) break;
  }

  console.log(`\nTotal messages received: ${totalReceived}`);
}

/**
 * Example 4: Gap Detection
 */
async function gapDetectionExample() {
  console.log('\n\n=== Gap Detection Example ===\n');

  const protocol = getReconnectionProtocol();
  const sequenceManager = getGlobalSequenceManager();

  // Create some sequences with gaps
  const seq1 = sequenceManager.getNext(); // 1
  const seq2 = sequenceManager.getNext(); // 2
  const seq3 = sequenceManager.getNext(); // 3

  // Simulate gap (sequences 4-10 missing)
  for (let i = 0; i < 7; i++) {
    sequenceManager.getNext(); // Skip sequences 4-10
  }

  const seq11 = sequenceManager.getNext(); // 11

  console.log(`Created sequences: ${seq1}, ${seq2}, ${seq3}, ${seq11}`);
  console.log(`Gap: sequences 4-10 missing`);

  // Detect gaps
  const gaps = protocol.detectGaps(0);

  console.log('\nDetected gaps:');
  gaps.forEach((gap, idx) => {
    console.log(`  ${idx + 1}. Sequences ${gap.start}-${gap.end} (${gap.end - gap.start + 1} messages)`);
  });
}

/**
 * Example 5: Client Statistics
 */
async function clientStatisticsExample() {
  console.log('\n\n=== Client Statistics Example ===\n');

  const protocol = getReconnectionProtocol();
  const clientManager = getClientStateManager();

  // Register multiple clients
  for (let i = 1; i <= 5; i++) {
    const clientId = `stats-client-${i}`;
    clientManager.registerClient(clientId);
    clientManager.addSubscription(clientId, 'notifications');

    // Simulate different sequence positions
    const lastSeq = i * 100;
    clientManager.updateLastSequence(clientId, lastSeq);

    console.log(`Client ${clientId}: Last sequence ${lastSeq}`);
  }

  // Get statistics for each client
  console.log('\nReconnection Statistics:');
  for (let i = 1; i <= 5; i++) {
    const clientId = `stats-client-${i}`;
    const stats = protocol.getReconnectionStats(clientId);

    console.log(`\n${clientId}:`);
    console.log(`  Messages behind: ${stats.messagesBehind}`);
    console.log(`  Est. recovery time: ${stats.estimatedRecoveryTime}ms`);
  }

  // Get protocol statistics
  const protoStats = protocol.getStats();
  console.log('\nProtocol Statistics:');
  console.log(`  Total messages: ${protoStats.totalMessages}`);
  console.log(`  Messages with sequence: ${protoStats.messagesWithSequence}`);
  console.log(`  Current sequence: ${protoStats.currentSequence}`);
  console.log(`  Connected clients: ${protoStats.connectedClients}`);
}

/**
 * Run all examples
 */
async function runExamples() {
  try {
    await basicReconnectionExample();
    await largeGapRecoveryExample();
    await batchDeliveryExample();
    await gapDetectionExample();
    await clientStatisticsExample();

    console.log('\n\n=== All Examples Complete ===\n');
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runExamples();
}

export {
  basicReconnectionExample,
  largeGapRecoveryExample,
  batchDeliveryExample,
  gapDetectionExample,
  clientStatisticsExample
};
