---
name: ultrapilot
description: "Strategic orchestration system - Requirements, Architecture, Planning with Multi-Perspective Review, then autonomous execution through Operations Playbook with QA cycles and evidence-backed verification."

# ⚠️ DO NOT CHANGE WITHOUT AUTHORIZATION ⚠️

**This skill defines the complete UltraPilot 8-phase orchestration workflow.**
**Any changes must be approved by the domain owner.**
**Unauthorized modifications will break the autonomous execution flow.**

---

# UltraPilot - Strategic Orchestration System

## Behavioral Contract: AUTONOMOUS EXECUTION

**This skill MUST execute autonomously without pausing for confirmation:**

✓ **DO**: Output status updates ("Now entering Phase 2", "Executing Phase 3")
✓ **DO**: Continue through all phases automatically
✓ **DO**: Only stop on ESCALATE conditions (fundamental blockers)
✓ **DO**: Respect explicit user intervention ("stop", "cancel", "abort")

✗ **DO NOT**: Pause between phases
✗ **DO NOT**: Ask "Should I continue?"
✗ **DO NOT**: Ask "What would you like me to do?"
✗ **DO NOT**: Wait for user confirmation
✗ **DO NOT**: Stop unless ESCALATE condition met

**Flow Pattern:**
```
Phase N complete → Status update → Move to Phase N+1 → Continue...
(No pauses, no questions, no waiting)
```

**This is NON-NEGOTIABLE for UltraPilot to function as designed.**

---

## Overview

**UltraPilot** is the complete strategic orchestration system that takes complex development tasks from initial request through verified completion.

**TWO-TIER ARCHITECTURE:**

```
UltraPilot (Strategic Orchestrator):
  ├─ Phase 0: Requirements + Architecture → spec.md
  ├─ Phase 1: Planning + Multi-Perspective Review → plan-final.md
  ├─ Phase 2-7: Autonomous execution
  └─ Output: Production-ready code with verification

Ultra-Lead (Alternative - Firm Leader):
  ├─ Phase 0-1: Strategic input → plan-final.md
  ├─ Phase 2-7: Hands off to Ultra-Autoloop
  └─ Output: Autoloop-driven continuous execution
```

**Philosophy**: "Strategic planning (UltraPilot) + Autonomous execution = Production-ready code"

---

## Complete 8-Phase Workflow

UltraPilot executes ALL phases autonomously without user intervention:

### Phase 0: Requirements & Architecture Expansion

**Spawn two agents in parallel:**

```
Task("Requirements extraction", ultra:analyst, model="opus",
  prompt="Extract functional requirements, constraints, acceptance criteria")

Task("Architecture design", ultra:architect, model="opus",
  prompt="Design system architecture with components, data flow, interfaces")
```

Wait for BOTH to complete, then merge outputs into `.ultra/spec.md`

**Output**: `.ultra/spec.md` - Requirements and architecture document

---

### Phase 1: Planning with Multi-Perspective Review

#### Step 1.1: Spawn ultra:planner (Opus)

```
Task("Implementation planning", ultra:planner, model="opus",
  prompt="Read .ultra/spec.md and create detailed implementation plan with I/O contracts")
```

**Output**: `.ultra/plan.md` (draft v1)

#### Step 1.2: Multi-Perspective Review Cycle

**Spawn reviewers in PARALLEL:**

**General Reviewers (always):**
```
Task("Architectural review", ultra:architect, model="opus")
Task("Completeness review", ultra:critic, model="opus")
```

**Domain Experts (select based on project type):**
```
IF project involves frontend:
  Task("Frontend review", ultra:frontend-expert, model="opus")

IF project involves backend:
  Task("Backend review", ultra:backend-expert, model="opus")

IF project involves APIs/integration:
  Task("API integration review", ultra:api-integration-expert, model="opus")

IF project involves database:
  Task("Database review", ultra:database-expert, model="opus")

IF project involves security:
  Task("Security review", ultra:security-reviewer, model="sonnet")
```

**Aggregate Feedback:**

For each reviewer extract:
- Status: APPROVED / NEEDS_REVISION / REJECTED
- Critical issues (blocking)
- High priority issues (should fix)
- Medium/Low issues (optional)

**Decision Logic:**
```
if approved == total_reviewers:
    APPROVED → Proceed to Phase 2
elif cycle < 3:
    NEEDS_REVISION → Fix and re-review
else:
    ESCALATE → User decision
```

**⚠️ NO MAX CYCLES FOR REVIEW** - Continue until ALL reviewers approve OR user escalates.

If NEEDS_REVISION:
- Spawn ultra:planner to fix all critical + high priority issues
- Update to plan-draft-v{next}.md
- Re-run Step 1.2 (same experts re-review)

**Output**: `.ultra/plan-final.md` - Validated implementation plan

---

### Phase 2: Queue-Based Execution

**Decompose plan into tasks:**
- Extract all implementation tasks from plan-final.md
- Determine agent types per Operations Playbook routing:
  ```
  feature|implement     → ultra:executor
  bug|fix              → ultra:debugger
  security            → ultra:security-reviewer
  performance|quality → ultra:quality-reviewer
  test                → ultra:test-engineer
  ```

**Queue processing:**
- Add tasks to `.ultra/queues/intake.json`
- Signal Ultra-Autoloop for processing

**Parallel execution:**
```
/ultra-team N={task_count} "Execute tasks from .ultra/plan-final.md"
```

Each agent gets:
- File ownership boundaries (no conflicts)
- I/O contracts to implement
- Clear acceptance criteria

---

### Phase 3: QA Cycles (ultraqa)

**Invoke ultraqa skill:**

```
/ultraqa "Verify .ultra/plan-final.md implementation"
```

**QA Workflow (max 5 cycles):**

Each cycle:
1. **Build**: `npm run build` (or equivalent)
2. **Lint**: `npm run lint` (if configured)
3. **Test**: `npm test`

**Decision Logic:**
```
if (build && lint && test) all pass:
    → Proceed to Phase 4
elif cycle < 5:
    → Fix failures → Repeat cycle
elif same_error_persists_3_cycles:
    → ESCALATE to user (fundamental issue)
else:
    → Report status → User decides
```

**⚠️ MAX 5 CYCLES FOR QA** - If tests still failing after 5 cycles, escalate.

---

### Phase 4: Multi-Perspective Validation

**Spawn 3 reviewers in parallel:**

```
Task("Security review", ultra:security-reviewer, model="sonnet",
  prompt="Review code changes from .ultra/plan-final.md for security vulnerabilities")

Task("Quality review", ultra:quality-reviewer, model="sonnet",
  prompt="Review code changes from .ultra/plan-final.md for performance and quality")

Task("Code review", ultra:code-reviewer, model="opus",
  prompt="Review code changes from .ultra/plan-final.md for logic, maintainability, patterns")
```

Wait for ALL 3 reviewers to complete.

**Aggregate Feedback:**

For each reviewer:
- Status: APPROVED / NEEDS_REVISION / REJECTED
- Critical issues (blocking)
- High priority issues (should fix)

**Decision Logic:**
```
if all 3 reviewers == APPROVED:
    → Proceed to Phase 5
elif any == REJECTED:
    → Fix issues → Re-run Phase 4 (max 3 rounds)
else if any == NEEDS_REVISION:
    → Fix issues → Re-run Phase 4
```

If validation fails after 3 rounds → ESCALATE to user.

---

### Phase 5: Evidence Verification

**Invoke ultra:verifier:**

```
Task("Verify completion", ultra:verifier, model="sonnet",
  prompt="Verify .ultra/plan-final.md implementation with evidence")
```

**Verification Actions:**

1. **Run build command**:
   ```bash
   npm run build
   ```
   - Collect exit code
   - Collect output

2. **Run test command**:
   ```bash
   npm test
   ```
   - Collect exit code
   - Collect test output
   - Verify test count

3. **Check acceptance criteria:**
   - From spec.md requirements
   - From plan-final.md success criteria
   - Verify each is met

4. **Generate verification report:**
   ```
   ✓ Build: SUCCESS (exit code 0)
   ✓ Tests: 47 tests passing
   ✓ All acceptance criteria met
   ✓ All reviewers approved
   ```

**Decision Logic:**
```
if verification == SUCCESS:
    → Move to completed queue
    → Generate completion summary
    → Clean up state files
else:
    → ESCALATE to user (verification failed)
```

---

### Phase 6: Completion

**When verification passes:**

1. **Move task to completed queue:**
   - From `.ultra/queues/in-progress.json`
   - To `.ultra/queues/completed.json`

2. **Generate completion summary:**
   ```
   ✓ Task completed: {task_id}
   ├─ Files created: {count}
   ├─ Files modified: {count}
   ├─ Tests passing: {count}
   ├─ Build: SUCCESS
   ├─ Validation: All 3 reviewers approved
   └─ Verification: Evidence-backed confirmation
   ```

3. **Clean up state files:**
   - Remove temporary state
   - Archive plan documents

4. **Report to user:**
   - Task completed successfully
   - All acceptance criteria met
   - Evidence-backed verification

---

### Phase 7: Documentation & Handoff

**Generate final documentation:**
- README updates
- API documentation
- Architecture diagrams
- Deployment guides

**Verify handoff completeness:**
- All deliverables present
- Documentation complete
- Knowledge transfer ready

---

## Execution Flow: Continuous Autonomous Operation

**Status Updates Only - NO PAUSES**

UltraPilot should output brief status updates between phases, but NEVER stop and wait for user input:

```
✓ Phase 0 complete: Requirements and architecture defined
→ Now moving into Phase 1: Planning with Multi-Perspective Review

✓ Phase 1 complete: Implementation plan validated by 5 reviewers after 2 cycles
→ Now executing Phase 2: Queue-Based Execution

✓ Phase 2 complete: 8 tasks executed by parallel agents
→ Now executing Phase 3: QA Cycles (ultraqa)

✓ Phase 3 complete: All tests passing after 2 QA cycles
→ Now executing Phase 4: Multi-Perspective Validation

✓ Phase 4 complete: All 3 reviewers unanimously approved
→ Now executing Phase 5: Evidence Verification

✓ Phase 5 complete: Build and tests passing with evidence
→ Now moving to Phase 6: Completion
```

**What to OUTPUT:**
- ✓ Status updates showing progress
- ✓ Phase completion confirmations
- ✓ Issue findings (P0-P3)
- ✓ Evidence summaries

**What NOT to OUTPUT:**
- ✗ "Should I continue?"
- ✗ "Ready for next phase?"
- ✗ "What would you like me to do?"
- ✗ Any prompts that require user response
- ✗ Any pausing or waiting

**When to STOP (ESCALATE):**
- Fundamental architectural flaw detected
- Same error persists 3 QA cycles
- Validation fails after 3 rounds
- Verification fails
- User explicitly says "stop", "cancel", "abort"

**When to CLARIFY (Self-Healing Feedback Loop):**
- Requirements unclear during execution → Re-invoke ultra:architect for clarification
- Plan ambiguous or missing detail → Re-invoke ultra:planner for plan update
- Technical decision unclear → Consult ultra:architect, then ultra:planner
- Integration point unclear → Consult both architect and planner

**Clarification Flow (NOT an escalation):**
```
Phase 2-7 Execution: "Requirement X is ambiguous"
→ Re-invoke ultra:architect: "Clarify requirement X from spec.md"
→ Get clarification
→ Re-invoke ultra:planner: "Update plan with clarified requirement"
→ Get updated plan task
→ Continue execution
```

**This maintains autonomy while getting clarification from the right sources.**

---

## Decision-Making Philosophy: AUTONOMOUS CHOICE

**When things aren't working and you don't know how to proceed:**

✗ **DO NOT**: Ask the user "What should I do?"
✗ **DO NOT**: Stop and wait for direction
✗ **DO NOT**: Present options for the user to choose

✓ **DO**: Make an informed decision based on:
  - Best practices for the situation
  - Recommendations from architectural principles
  - Preferences for parallel execution and ultrawork
  - Choose the path that's most likely to succeed
  - Continue execution autonomously

**Orchestration Preferences:**
- **Parallel over serial**: Always prefer parallel execution when possible
- **Ultrawork for complexity**: Use ultra-ultrawork for complex coordination tasks
- **Agent teams**: Use ultra-team for multi-file parallel work with file ownership
- **Make the call**: If you have a preference, just choose it and continue

**Example:**
```
[Phase 2: Execution - Decision Point]
→ "Should I use ultra-team (5 agents) or ultra-ultrawork?"
→ BAD: "User, which should I use?"
→ GOOD: "Choosing ultra-ultrawork for better parallel coordination" → Continue
```

**Key Principle**: The user invoked UltraPilot for autonomous execution. Constantly asking for decisions breaks the autonomy. Make reasonable choices and keep going.

**Otherwise: KEEP GOING - DO NOT STOP**

---

## Stop Conditions (ESCALATE to user)

**ESCALATE immediately when:**
- Phase 0: Requirements unclear OR architecture infeasible
- Phase 1: Plan rejected 3 times by reviewers
- Phase 3: Same test fails 3 QA cycles (fundamental issue)
- Phase 4: Validation fails after 3 rounds
- Phase 5: Verification fails (tests won't pass)
- Any agent reports fundamental blocker
- User says "stop", "cancel", "abort"

**CLARIFY (do NOT escalate) when:**
- Requirements unclear during Phase 2-7 execution → Re-invoke ultra:architect
- Plan needs updating during execution → Re-invoke ultra:planner
- Technical decisions ambiguous → Consult architect → Update planner → Continue
- Integration points unclear → Get clarification from both → Update plan → Continue

**Clarification maintains autonomy - Escalation breaks it.**

---

## What UltraPilot Does

✅ **Phase 0**: Requirements extraction and architecture design
✅ **Phase 1**: Planning with multi-perspective review (unlimited cycles until approval)
✅ **Phase 2**: Queue-based execution with parallel agents
✅ **Phase 3**: QA cycles (max 5, then escalate)
✅ **Phase 4**: Multi-perspective validation (3 reviewers, unanimous approval)
✅ **Phase 5**: Evidence-backed verification (tests MUST pass)
✅ **Phase 6**: Completion with evidence
✅ **Phase 7**: Documentation and handoff

---

## State Management

UltraPilot maintains state in `.ultra/state/`:

```
.ultra/state/
├── autopilot-state.json      # Current phase, status
├── ralph-state.json           # Loop iteration, errors
├── ultraqa-state.json         # QA cycle state
├── validation-state.json      # Reviewer status
└── verification-state.json    # Verification results
```

---

## Key Differences from Ultra-Lead

| Aspect | UltraPilot | Ultra-Lead |
|--------|-----------|-----------|
| **Phases** | 0-7 (complete) | 0-1 input, then autoloop 2-7 |
| **Execution** | Direct via ultra-team | Via Ultra-Autoloop daemon |
| **Autonomy** | Full autonomous workflow | Plan-driven, autoloop executes |
| **Use case** | Complete development from scratch | Operational execution of validated plan |

---

## Example Session

```
User: /ultrapilot Build me a REST API for task management

[Phase 0: Expansion]
→ ultra:analyst: "Requirements: CRUD for tasks, REST endpoints, TypeScript"
→ ultra:architect: "Architecture: Controller/Service/Repository layers"
→ spec.md created

✓ Phase 0 complete: Requirements and architecture defined
→ Now moving into Phase 1: Planning with Multi-Perspective Review

[Phase 1: Planning with Multi-Perspective Review]
→ ultra:planner: "Created detailed plan with I/O contracts..."
→ plan-draft-v1.md

→ Phase 1.5: Spawning 6 reviewers in parallel...
→ ├─ General: ultra:architect ✓, ultra:critic ✓
→ ├─ Domain: ultra:backend-expert ✓, ultra:api-expert ✓, ultra:database-expert ✓
→ └─ Security: ultra:security-reviewer ✓

→ Feedback: 2 CRITICAL, 3 HIGH issues
→ Revised plan: plan-draft-v2.md (fixed critical + high)

→ Re-review (Cycle 2): All 6 approved ✓
→ plan-final.md

✓ Phase 1 complete: Implementation plan validated by 6 reviewers after 2 cycles
→ Now executing Phase 2: Queue-Based Execution

[Phase 2: Execution]
→ Decomposed into 8 tasks
→ Spawned ultra-team with 5 parallel agents
→ File ownership boundaries established

✓ Phase 2 complete: 8 tasks executed by parallel agents
→ Now executing Phase 3: QA Cycles (ultraqa)

[Phase 3: QA Cycles (ultraqa)]
→ Cycle 1: 3 tests failing → Fix
→ Cycle 2: 1 test failing → Fix
→ Cycle 3: All tests passing ✓

✓ Phase 3 complete: All tests passing after 2 QA cycles
→ Now executing Phase 4: Multi-Perspective Validation

[Phase 4: Multi-Perspective Validation]
→ Spawned 3 reviewers in parallel
→ ultra:security-reviewer: APPROVED ✓
→ ultra:quality-reviewer: APPROVED ✓
→ ultra:code-reviewer: APPROVED ✓
→ Unanimous approval

✓ Phase 4 complete: All 3 reviewers unanimously approved
→ Now executing Phase 5: Evidence Verification

[Phase 5: Evidence Verification]
→ Build: SUCCESS (exit code 0)
→ Tests: 47 tests passing
→ All acceptance criteria met ✓

✓ Phase 5 complete: Build and tests passing with evidence
→ Now moving to Phase 6: Completion

[Phase 6: Completion]
→ ✓ 8 tasks implemented
→ ✓ All tests passing
→ ✓ All reviewers approved
→ ✓ Evidence-backed verification
→ Task moved to completed queue

[COMPLETE]
✓ Task management REST API ready
  - 12 endpoints created
  - 47 tests passing
  - Production ready
```

**Note the flow**: Status updates only, NO pauses, NO "should I continue?", just continuous autonomous execution.

---

## Clarification Flow Example

**When execution encounters unclear requirements:**

```
[Phase 2: Execution]
→ Task: "Implement user authentication with JWT"
→ Implementation starts...

[ISSUE DETECTED]
→ "Unclear: Should JWT secret be environment variable or config file?"
→ NOT an escalation - clarification needed

[CLARIFICATION FLOW]
→ Re-invoke ultra:architect: "Clarify JWT secret storage requirement"
→ ultra:architect: "Use environment variable for security, .env pattern"
→ Re-invoke ultra:planner: "Update plan to include .env setup for JWT_SECRET"
→ ultra:planner: "Updated plan Task 2.1: Add .env.example with JWT_SECRET"

✓ Clarification complete
→ Now resuming Phase 2: Execution with updated plan

[Phase 2 continues]
→ JWT implementation using environment variable ✓
→ Task complete
```

**Key Points:**
- Clarification does NOT break autonomous flow
- Re-uses existing Phase 0/1 agents (architect, planner)
- Updates plan, then continues execution
- User NOT involved unless clarification fails
- **When stuck: Make informed decision, choose path, continue**
- **Prefer parallel execution and ultrawork at every decision point**
- **NEVER ask user to choose between options**

---

## ⚠️ CRITICAL: DO NOT MODIFY WORKFLOW

**The autonomous flow MUST be preserved:**

1. **NO asking for confirmation** between phases
2. **NO "what should I do?" prompts**
3. **NO "should I continue?" pauses**
4. **NO "which approach should I use?" questions**
5. **ONLY output status updates** - e.g., "Now moving into Phase 2", "Executing Phase 3"
6. **DO NOT stop the flow** - Continue through all phases autonomously
7. **ONLY stop on ESCALATE conditions** (fundamental blockers, max cycles reached)
8. **User must explicitly intervene** (say "stop", "cancel", "abort") to pause execution
9. **Review cycles**: Unlimited until approval (NOT capped at 3)
10. **QA cycles**: Max 5, then escalate
11. **When stuck: MAKE THE CALL** - Choose based on best practices, continue
12. **Prefer parallel execution and ultrawork** at every decision point
13. **If you have a preference, JUST CHOOSE IT** - Don't ask the user

**Breaking these rules will defeat the purpose of UltraPilot.**

**Decision-Making Philosophy:**
```
BAD:  "I could use ultra-team or ultra-ultrawork - User, which do you prefer?"
GOOD: "Choosing ultra-ultrawork for better parallel coordination" → Continue

BAD:  "I'm not sure how to proceed - User, what should I do?"
GOOD: "Based on the error, I'll retry with exponential backoff" → Continue

BAD:  "Should I try approach A or approach B?"
GOOD: "Approach A aligns better with YAGNI principle - choosing A" → Continue
```

**Status Update Format:**
- ✓ "Now moving into Phase 1: Planning with Multi-Perspective Review"
- ✓ "Executing Phase 2: Queue-Based Execution"
- ✓ "Phase 3 complete: All tests passing, moving to Phase 4"
- ✓ "Choosing ultra-ultrawork for parallel execution" → Continue
- ✗ "PAUSING: Should I continue to Phase 4?" ← **NEVER DO THIS**
- ✗ "User, which approach should I take?" ← **NEVER DO THIS**

---

## Agent Catalog

UltraPilot coordinates these agents:

**Core Orchestration:**
- ultra:analyst (Opus) - Requirements extraction
- ultra:architect (Opus) - System architecture
- ultra:planner (Opus) - Implementation planning
- ultra:critic (Opus) - Plan validation
- ultra:verifier (Sonnet) - Evidence verification

**Implementation:**
- ultra:executor (Sonnet) - Standard implementation
- ultra:executor-high (Opus) - Complex implementation
- ultra:team-lead (Opus) - Team orchestration

**Quality:**
- ultra:test-engineer (Sonnet) - Test strategy
- ultraqa - QA cycling workflow

**Review:**
- ultra:security-reviewer (Sonnet) - Security audit
- ultra:quality-reviewer (Sonnet) - Performance review
- ultra:code-reviewer (Opus) - Comprehensive review

**Domain Experts:**
- ultra:frontend-expert (Opus) - Frontend architecture
- ultra:backend-expert (Opus) - Backend systems
- ultra:database-expert (Opus) - Database design
- ultra:api-integration-expert (Opus) - API design

---

**UltraPilot: Production-ready code through strategic planning and autonomous execution.**

---

## ⚠️ FINAL REMINDER: AUTONOMOUS FLOW REQUIRED

**When this skill is invoked, it MUST:**

1. **Execute ALL phases continuously** (0-7) without stopping
2. **Output ONLY status updates** between phases
3. **NEVER ask "should I continue?"**
4. **NEVER ask "which approach should I use?"**
5. **NEVER ask "what would you like me to do?"**
6. **NEVER wait for user input**
7. **ONLY stop on ESCALATE conditions** (explicit user intervention or fundamental blockers)
8. **When stuck, MAKE THE CALL** - Choose best practice path, continue
9. **Prefer parallel execution and ultrawork** - Default to these
10. **If you have a preference, JUST CHOOSE IT** - Don't ask the user to decide

**Status update examples:**
- ✓ "Now moving into Phase 2: Queue-Based Execution"
- ✓ "Phase 3 complete: All tests passing, moving to Phase 4"
- ✓ "Executing Phase 5: Evidence Verification"
- ✓ "Choosing ultra-ultrawork for parallel execution" → Continue
- ✓ "Retrying with exponential backoff based on error type" → Continue

**Decision examples:**
- ✓ "Using ultra-ultrawork instead of ultra-team (better coordination)" → Continue
- ✓ "Choosing approach A (simpler, aligns with YAGNI)" → Continue
- ✓ "Recovering with strategy: backoff 2s, retry" → Continue
- ✗ "User, should I use ultra-team or ultra-ultrawork?" ← **NEVER DO THIS**
- ✗ "I'm not sure what to do - waiting for user input" ← **NEVER DO THIS**

**IF THE SKILL STOPS AND ASKS WHAT TO DO**, IT IS BROKEN AND NEEDS IMMEDIATE FIXING.

**The entire value of UltraPilot is autonomous execution with intelligent decision-making - any pauses or user prompts defeat the purpose.**
