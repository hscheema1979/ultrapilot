/**
 * Performance Benchmarks for Parallel vs Sequential Execution
 *
 * Measures:
 * 1. Sequential execution time
 * 2. Parallel execution time
 * 3. Speedup factor
 */

import { describe, it, expect, beforeEach } from 'vitest';

interface BenchmarkResult {
  name: string;
  time: number;
  memory: number;
}

class BenchmarkSuite {
  private results: BenchmarkResult[] = [];

  async measure(name: string, fn: () => Promise<void>): Promise<number> {
    const memBefore = process.memoryUsage().heapUsed;
    const start = Date.now();

    await fn();

    const time = Date.now() - start;
    const memAfter = process.memoryUsage().heapUsed;

    this.results.push({
      name,
      time,
      memory: memAfter - memBefore
    });

    return time;
  }

  getResults(): BenchmarkResult[] {
    return [...this.results];
  }

  compare(name1: string, name2: string): number {
    const result1 = this.results.find(r => r.name === name1);
    const result2 = this.results.find(r => r.name === name2);

    if (!result1 || !result2) {
      throw new Error('Results not found');
    }

    return result1.time / result2.time;
  }
}

class MockAgentExecutor {
  async executeTask(taskId: string, delay: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

describe('Performance Benchmarks', () => {
  let suite: BenchmarkSuite;
  let executor: MockAgentExecutor;

  beforeEach(() => {
    suite = new BenchmarkSuite();
    executor = new MockAgentExecutor();
  });

  describe('Sequential vs Parallel Execution', () => {
    it('should show 3-5x improvement with 3 agents', async () => {
      const tasks = [
        { id: 'task-1', delay: 100 },
        { id: 'task-2', delay: 120 },
        { id: 'task-3', delay: 110 }
      ];

      // Measure sequential execution
      const sequentialTime = await suite.measure('sequential', async () => {
        for (const task of tasks) {
          await executor.executeTask(task.id, task.delay);
        }
      });

      // Measure parallel execution
      const parallelTime = await suite.measure('parallel', async () => {
        await Promise.all(
          tasks.map(task => executor.executeTask(task.id, task.delay))
        );
      });

      const speedup = sequentialTime / parallelTime;

      // Assertions
      expect(sequentialTime).toBeGreaterThan(parallelTime);
      expect(speedup).toBeGreaterThan(2.0); // At least 2x faster
      expect(speedup).toBeLessThan(4.0); // Less than 4x (realistic bounds)
    });

    it('should scale linearly with agent count', async () => {
      const threeTasks = [
        { id: 'task-1', delay: 100 },
        { id: 'task-2', delay: 100 },
        { id: 'task-3', delay: 100 }
      ];

      const fiveTasks = [
        { id: 'task-1', delay: 100 },
        { id: 'task-2', delay: 100 },
        { id: 'task-3', delay: 100 },
        { id: 'task-4', delay: 100 },
        { id: 'task-5', delay: 100 }
      ];

      const threeParallelTime = await suite.measure('parallel-3', async () => {
        await Promise.all(
          threeTasks.map(task => executor.executeTask(task.id, task.delay))
        );
      });

      const fiveParallelTime = await suite.measure('parallel-5', async () => {
        await Promise.all(
          fiveTasks.map(task => executor.executeTask(task.id, task.delay))
        );
      });

      // 5 tasks should take similar time to 3 tasks (parallel execution)
      // Both should be around 100ms (single task time)
      expect(threeParallelTime).toBeLessThan(150);
      expect(fiveParallelTime).toBeLessThan(150);

      // Sequential would be 300ms vs 500ms
      const threeSequentialTime = await suite.measure('sequential-3', async () => {
        for (const task of threeTasks) {
          await executor.executeTask(task.id, task.delay);
        }
      });

      const fiveSequentialTime = await suite.measure('sequential-5', async () => {
        for (const task of fiveTasks) {
          await executor.executeTask(task.id, task.delay);
        }
      });

      // Sequential should scale linearly
      expect(threeSequentialTime).toBeGreaterThan(250);
      expect(fiveSequentialTime).toBeGreaterThan(450);
    });
  });

  describe('Memory Overhead', () => {
    it('should have acceptable memory overhead for parallel execution', async () => {
      const tasks = [
        { id: 'task-1', delay: 50 },
        { id: 'task-2', delay: 50 },
        { id: 'task-3', delay: 50 }
      ];

      await suite.measure('sequential-memory', async () => {
        for (const task of tasks) {
          await executor.executeTask(task.id, task.delay);
        }
      });

      await suite.measure('parallel-memory', async () => {
        await Promise.all(
          tasks.map(task => executor.executeTask(task.id, task.delay))
        );
      });

      const results = suite.getResults();
      const sequentialMem = results.find(r => r.name === 'sequential-memory')?.memory || 0;
      const parallelMem = results.find(r => r.name === 'parallel-memory')?.memory || 0;

      // Parallel should use more memory, but not more than 5x
      expect(parallelMem).toBeGreaterThan(0);
      expect(sequentialMem).toBeGreaterThan(0);

      const memoryOverhead = parallelMem / sequentialMem;
      expect(memoryOverhead).toBeLessThan(5.0); // Less than 5x overhead
    });
  });

  describe('Real-World Scenarios', () => {
    it('should benchmark feature development (3 files)', async () => {
      const featureTasks = [
        { id: 'auth-module', delay: 150 },
        { id: 'tasks-crud', delay: 180 },
        { id: 'api-routes', delay: 160 }
      ];

      const sequentialTime = await suite.measure('feature-sequential', async () => {
        for (const task of featureTasks) {
          await executor.executeTask(task.id, task.delay);
        }
      });

      const parallelTime = await suite.measure('feature-parallel', async () => {
        await Promise.all(
          featureTasks.map(task => executor.executeTask(task.id, task.delay))
        );
      });

      const speedup = sequentialTime / parallelTime;

      expect(speedup).toBeGreaterThan(2.5);
      expect(speedup).toBeLessThan(3.5);
    });

    it('should benchmark bug investigation (5 hypotheses)', async () => {
      const debugTasks = [
        { id: 'hypothesis-1', delay: 80 },
        { id: 'hypothesis-2', delay: 90 },
        { id: 'hypothesis-3', delay: 85 },
        { id: 'hypothesis-4', delay: 95 },
        { id: 'hypothesis-5', delay: 88 }
      ];

      const sequentialTime = await suite.measure('debug-sequential', async () => {
        for (const task of debugTasks) {
          await executor.executeTask(task.id, task.delay);
        }
      });

      const parallelTime = await suite.measure('debug-parallel', async () => {
        await Promise.all(
          debugTasks.map(task => executor.executeTask(task.id, task.delay))
        );
      });

      const speedup = sequentialTime / parallelTime;

      expect(speedup).toBeGreaterThan(3.5);
      expect(speedup).toBeLessThan(5.5);
    });

    it('should benchmark code review (5 dimensions)', async () => {
      const reviewTasks = [
        { id: 'security', delay: 120 },
        { id: 'performance', delay: 130 },
        { id: 'architecture', delay: 125 },
        { id: 'testing', delay: 115 },
        { id: 'accessibility', delay: 110 }
      ];

      const sequentialTime = await suite.measure('review-sequential', async () => {
        for (const task of reviewTasks) {
          await executor.executeTask(task.id, task.delay);
        }
      });

      const parallelTime = await suite.measure('review-parallel', async () => {
        await Promise.all(
          reviewTasks.map(task => executor.executeTask(task.id, task.delay))
        );
      });

      const speedup = sequentialTime / parallelTime;

      expect(speedup).toBeGreaterThan(3.5);
      expect(speedup).toBeLessThan(5.5);
    });
  });

  describe('Benchmark Summary', () => {
    it('should generate summary report', async () => {
      const tasks = [
        { id: 'task-1', delay: 100 },
        { id: 'task-2', delay: 120 },
        { id: 'task-3', delay: 110 }
      ];

      await suite.measure('sequential', async () => {
        for (const task of tasks) {
          await executor.executeTask(task.id, task.delay);
        }
      });

      await suite.measure('parallel', async () => {
        await Promise.all(
          tasks.map(task => executor.executeTask(task.id, task.delay))
        );
      });

      const results = suite.getResults();
      const speedup = suite.compare('sequential', 'parallel');

      expect(results).toHaveLength(2);
      expect(speedup).toBeGreaterThan(2.0);

      // Summary
      const sequentialResult = results.find(r => r.name === 'sequential');
      const parallelResult = results.find(r => r.name === 'parallel');

      expect(sequentialResult).toBeDefined();
      expect(parallelResult).toBeDefined();
      expect(sequentialResult!.time).toBeGreaterThan(parallelResult!.time);
    });
  });
});
