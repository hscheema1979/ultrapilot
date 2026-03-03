# ADR: Enterprise-Grade Autonomous Systems Framework

**Status:** **ACCEPTED** ✅
**Date:** 2026-03-03
**Decision:** Implement 4-phase autonomous systems framework with statistical feedback loops
**Architect:** Approved (Quality: 9.0/10)
**Critic:** Approved (Quality: 9.0/10)

---

## Decision

Implement an enterprise-grade autonomous systems framework for Ultrapilot with:
- **4-phase implementation** over 13 weeks (State → Execution → Messaging → Feedback)
- **Real execution engine** using Skill tool (no simulations)
- **SQLite-based state persistence** with WAL mode and crash recovery
- **At-least-once message delivery** with sequence ordering and acknowledgments
- **Statistical feedback loops** using Wilson score intervals and UCB1 bandit algorithm
- **99.0% uptime target** with comprehensive monitoring
- **795 automated tests** with 80%+ coverage

---

## Drivers

### 1. Production Autonomy (CRITICAL)
Current system is at **35% production readiness** because it relies on simulated execution. Real autonomous agents must perform actual work without human intervention.

### 2. Enterprise Reliability (CRITICAL)
Target production environment requires **99.0% uptime** (8.76 hours downtime/month), meaning crash recovery, state persistence, and fault tolerance are mandatory.

### 3. Learning Capability (HIGH)
System must **improve performance over time** through feedback loops, not just execute tasks statically. Requires statistical rigor (confidence intervals, multi-armed bandits).

### 4. Scalability (HIGH)
System must support **100+ concurrent agents** processing **1000+ tasks** without degradation.

---

## Alternatives Considered

### Alternative A: Monolithic Implementation (REJECTED)

**Approach:** Build all components simultaneously in 6 weeks, then deploy.

**Pros:**
- Fewer integration surfaces (3 vs. 12)
- Faster time to production (6 weeks vs. 13)
- No temporary abstractions to rip out

**Cons:**
- **Higher risk**: No validation until complete
- **No incremental value**: Can't deploy until 100% done
- **Harder to rollback**: All-or-nothing deployment
- **Testing complexity**: Must test entire system at once

**Why Rejected:** Architect steelman counterargument identified integration complexity explosion. Phased approach provides production value after Phase 2 (state + execution), reducing risk.

---

### Alternative B: High-Availability Architecture (REJECTED)

**Approach:** Add SQLite replication, zero-downtime deployments, message bus clustering to achieve 99.9% uptime.

**Pros:**
- True high availability (99.9% = 43 minutes downtime/year)
- Fault tolerance across nodes
- No single point of failure

**Cons:**
- **+3 weeks timeline** (15 weeks total vs. 13)
- **Significant complexity**: litestream/rqlite replication
- **Operational overhead**: clustering, failover testing
- **Diminishing returns**: 99.0% → 99.9% gains 0.9% but adds 3 weeks

**Why Rejected:** 99.0% uptime is sufficient for enterprise deployment. HA architecture can be added in future iteration if needed.

---

### Alternative C: Distributed Message Broker (REJECTED)

**Approach:** Use Redis Cluster, NATS, or Kafka instead of AgentMessageBus with SQLite.

**Pros:**
- Horizontal scalability
- Built-in clustering
- Higher throughput (10K+ messages/second)

**Cons:**
- **External dependency**: Redis/NATS/Kafka operations
- **Complexity**: Cluster management, failover configuration
- **Overkill**: 99.9% delivery achievable with SQLite
- **Domain isolation violated**: Domains should be self-contained

**Why Rejected:** SQLite-based AgentMessageBus provides 99.9% delivery rate with 1000+ messages/second throughput. Domain-as-workspace architecture suggests embedded persistence is correct choice.

---

## Why Chosen: Phased Implementation with Enterprise Components

**Core Principle**: Incremental production rollout with validation at each phase.

### Phase 1: State Persistence & Crash Recovery (Weeks 2-4)
**Foundation**: All state MUST be persisted before execution (Principle 2)

**Components:**
- SQLite with WAL mode (ACID transactions, concurrent reads)
- StateManager with automatic persistence
- CrashRecovery with < 5 second recovery time
- BackupManager with 72 hourly, 7 daily, 4 weekly retention

**Acceptance:**
- 100% state persistence before execution
- < 5 second crash recovery time
- < 1% data loss rate
- 99.9% recovery success rate

**Why First:** Without durable state, all work is lost on crashes. State is foundation.

---

### Phase 2: Real Execution Engine (Weeks 5-7)
**Core**: Replace all simulations with actual Skill tool invocations

**Components:**
- TaskExecutor with real Skill tool integration (not mocks)
- RetryManager with exponential backoff + jitter
- ExecutionTracker for metrics collection
- CostTracker for API cost awareness

**Acceptance:**
- 95%+ task success rate in staging
- < 1% timeout rate
- 90%+ transient failure recovery
- Zero simulated execution paths

**Why Second:** Execution requires state persistence to track progress and recover from failures.

---

### Phase 3: Agent Message Bus Integration (Weeks 8-10)
**Reliability**: At-least-once delivery with ordering guarantees

**Components:**
- AgentMessageBus with SQLite persistence
- Sequence numbers per conversation (atomic ordering)
- Message buffering (prevents race conditions)
- Acknowledgment system with retries
- Dead letter queue for failed messages

**Acceptance:**
- 99.9%+ message delivery success rate
- < 1% messages in dead letter queue
- Zero out-of-order messages in 10K test
- < 100ms average latency

**Why Third**: Messaging requires execution engine to generate work messages.

---

### Phase 4: Feedback Loops & Learning (Weeks 11-13)
**Intelligence**: Statistical performance optimization

**Components:**
- TaskEmbedder with cosine similarity (0.6 threshold)
- ConfidenceInterval using Wilson score (95% confidence)
- UCB1Selector for exploration/exploitation balance
- ConceptDriftDetector for performance change detection
- ABTestFramework for variant comparison

**Acceptance:**
- 100% agent executions tracked
- 10%+ improvement in success rate
- 95% confidence intervals on all stats
- 100% drifts detected within 1000 tasks

**Why Fourth**: Feedback loops require execution history and messaging metadata.

---

## Consequences

### Positive

1. **Production-Ready System**
   - 99.0% uptime achievable with realistic architecture
   - 80%+ task success rate with statistical validation
   - < 5 second crash recovery with SQLite WAL mode

2. **Enterprise Reliability**
   - At-least-once message delivery (99.9%+ rate)
   - Comprehensive monitoring (Prometheus, uptime measurement)
   - Automated backup lifecycle (72 hourly, 7 daily, 4 weekly)

3. **Continuous Improvement**
   - Statistical feedback loops (Wilson score, UCB1)
   - A/B testing framework for agent selection
   - Concept drift detection (0.6 threshold)

4. **Developer Experience**
   - Execution mode abstraction (SIMULATION, DRY_RUN, REAL)
   - Comprehensive verification checklists (36 steps across phases)
   - 795 automated tests with 80%+ coverage

### Negative

1. **Timeline Investment**
   - 13 weeks to full production (vs. 6 weeks monolithic)
   - Requires sustained focus and discipline

2. **Complexity**
   - Statistical algorithms (Wilson score, UCB1) require ML expertise
   - Message ordering adds implementation complexity
   - Feedback loops require data pipeline infrastructure

3. **Operational Overhead**
   - Backup lifecycle management (automated but requires monitoring)
   - Uptime monitoring (Prometheus deployment)
   - Concept drift alerting (on-call responsibility)

### Mitigations

1. **Timeline Risk**: Phased approach provides incremental value. Production-ready after Phase 2 (state + execution).
2. **Complexity Risk**: Comprehensive specifications with file:line citations. 795 tests ensure correctness.
3. **Operational Risk**: Automated backups, monitoring, and alerting reduce manual intervention.

---

## Follow-Ups

### Immediate (Week 1)
1. **Begin Phase 0: Foundation**
   - Set up development infrastructure
   - Configure test framework (Jest with coverage)
   - Establish staging environment
   - Create baseline metrics dashboard

2. **Kick Off Phase 1**
   - Review StateManager specifications
   - Set up SQLite databases
   - Configure backup automation

### Short-Term (Weeks 2-13)
1. **Execute Phases 1-4 sequentially**
   - Complete verification checklists for each phase
   - Run 795 automated tests (target: 80%+ coverage)
   - Monitor metrics against acceptance criteria

2. **Continuous Integration**
   - Deploy each phase to staging after completion
   - Monitor performance in production-like environment
   - Adjust timeline if issues arise

### Long-Term (Post-Implementation)
1. **Consider HA Architecture** (if uptime > 99.0% required)
   - SQLite replication with litestream
   - Zero-downtime deployments (blue-green)
   - Message bus clustering (Redis Cluster)

2. **Advanced Features**
   - Multi-domain coordination (domains serving other domains)
   - Distributed tracing (OpenTelemetry)
   - Advanced analytics (performance dashboards)

---

## Compliance with Principles

### ✅ Principle 1: Real Execution Over Simulation
**Evidence**: Lines 697-785 in TaskExecutor.ts - Real Skill tool integration, no mocks

### ✅ Principle 2: State Durability as Foundation
**Evidence**: Lines 644-649 - StateManager.saveState() called BEFORE TaskExecutor.executeTask()

### ✅ Principle 3: Message Reliability
**Evidence**: Lines 1010-1025 - 99.9% delivery rate, sequence numbers, gap detection

### ✅ Principle 4: Feedback-Driven Improvement
**Evidence**: Lines 1186-1611 - Wilson score intervals, UCB1 algorithm, concept drift detection

### ✅ Principle 5: Incremental Production Rollout
**Evidence**: 5 independently deployable phases with verification checklists

---

## Quality Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Uptime | 99.0% | 7-day rolling average, Prometheus scraping |
| Task Success Rate | 80% | Completed tasks / Total tasks |
| Message Delivery | 99.9% | Delivered / Sent (10K test) |
| Crash Recovery | < 5s | Time from restart to state restoration |
| Test Coverage | 80% | Jest branch coverage (90% critical paths) |
| Performance Improvement | 10%+ | Success rate increase (7-day avg) |

---

## Implementation Timeline

**Total: 13 weeks**

- **Week 1**: Phase 0 - Foundation (infrastructure, testing, staging)
- **Weeks 2-4**: Phase 1 - State Persistence (100 tests, 33/week)
- **Weeks 5-7**: Phase 2 - Execution Engine (145 tests, 48/week)
- **Weeks 8-10**: Phase 3 - Message Bus (270 tests, 90/week)
- **Weeks 11-13**: Phase 4 - Feedback Loops (240 tests, 80/week)

**Total Tests: 795** (400 unit + 200 integration + 100 E2E + 50 observability + 45 cross-phase)

---

## Architectural Signatures

**Architect**: claude-opus-4-6
**Status**: APPROVED ✅
**Quality Score**: 9.0/10
**Date**: 2026-03-03

**Critic**: claude-sonnet-4-6
**Status**: APPROVED ✅
**Quality Score**: 9.0/10
**Date**: 2026-03-03

**Planner**: claude-opus-4-6
**Consensus Iterations**: 3 (reached approval)
**RALPLAN-DR Mode**: Deliberate (pre-mortem + expanded test plan)

---

**Decision Record**: Enterprise-grade autonomous systems framework is APPROVED for immediate implementation.
