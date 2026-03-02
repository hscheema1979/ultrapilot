# Detailed Planning Phase - Implementation Plan

## Overview

Implement Phase 1.5: Detailed Planning with Domain Expert Review Loop in Ultrapilot.

**Goal:** Bring the stolen Superpowers + OMC + wshobson workflow into NEW Ultrapilot.

---

## Implementation Plan

### Phase 1: Agent Catalog Updates

#### Task 1.1: Add Domain Expert Agents
**File:** `src/agents.ts`
**Time:** 30 minutes

**Add to AGENT_CATALOG:**

```typescript
// === Domain Experts ===

'ultra:frontend-expert': {
  name: 'Frontend Expert',
  description: 'React, Vue, Angular, TypeScript, component architecture, state management',
  model: 'opus',
  capabilities: ['frontend-architecture', 'react', 'typescript', 'ui-components', 'state-management']
},

'ultra:backend-expert': {
  name: 'Backend Expert',
  description: 'Node.js, Python, Go, API design, microservices, WebSocket servers',
  model: 'opus',
  capabilities: ['backend-architecture', 'api-design', 'microservices', 'websocket', 'rest']
},

'ultra:database-expert': {
  name: 'Database Expert',
  description: 'PostgreSQL, MongoDB, Redis, schema design, migrations, indexing',
  model: 'opus',
  capabilities: ['database-design', 'sql', 'nosql', 'migrations', 'indexing']
},

'ultra:api-integration-expert': {
  name: 'API Integration Expert',
  description: 'I/O contracts, API boundaries, integration patterns, error handling',
  model: 'opus',
  capabilities: ['api-contracts', 'integration-design', 'io-boundaries', 'error-handling']
},

'ultra:kubernetes-architect': {
  name: 'Kubernetes Architect',
  description: 'K8s deployments, services, ingress, Helm, Docker orchestration',
  model: 'opus',
  capabilities: ['kubernetes', 'docker', 'helm', 'deployment-strategies']
},

'ultra:security-architect': {
  name: 'Security Architect',
  description: 'AuthN/AuthZ, encryption, OWASP, security patterns, threat modeling',
  model: 'opus',
  capabilities: ['security-design', 'authentication', 'authorization', 'threat-modeling']
},

'ultra:performance-expert': {
  name: 'Performance Expert',
  description: 'Caching strategies, load balancing, optimization, monitoring',
  model: 'sonnet',
  capabilities: ['performance-optimization', 'caching', 'load-balancing', 'monitoring']
},

'ultra:testing-expert': {
  name: 'Testing Expert',
  description: 'Test strategy, integration tests, E2E tests, coverage',
  model: 'sonnet',
  capabilities: ['test-strategy', 'integration-tests', 'e2e-tests', 'coverage']
}
```

**Success Criteria:**
- All 8 domain experts added to catalog
- Each has proper model tier assignment
- Capabilities accurately described

---

### Phase 2: State Management

#### Task 2.1: Add Detailed Planning State Interface
**File:** `src/state.ts`
**Time:** 45 minutes

**Add to interfaces:**

```typescript
export interface DomainExpertReview {
  domain: string;
  reviewer: string;  // Agent ID
  status: 'APPROVED' | 'NEEDS_REVISION' | 'REJECTED';
  cycle: number;
  criticalIssues: number;
  recommendations: number;
  findings: string;
  ioContractValidations?: IOContractValidation[];
}

export interface IOContract {
  id: string;
  name: string;
  domains: string[];  // ['frontend', 'backend']
  contract: string;  // TypeScript interface or schema
  status: 'VALID' | 'NEEDS_CLARIFICATION' | 'BROKEN';
  validatedIn?: string;  // Cycle where validated
  issue?: string;
  suggestedFix?: string;
}

export interface IOContractValidation {
  contractId: string;
  status: 'VALID' | 'NEEDS_CLARIFICATION' | 'BROKEN';
  issue?: string;
  suggestedFix?: string;
}

export interface Issue {
  id: string;
  domain: string;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'FIXED' | 'WONTFIX';
  fixedIn?: string;  // Plan version where fixed
}

export interface DetailedPlanningState {
  phase: '1.5';
  cycle: number;
  maxCycles: number;
  status: 'draft' | 'review' | 'revised' | 're-review' | 'approved' | 'escalated';
  currentPlan: string;  // Path to current plan draft
  planVersion: number;  // 1, 2, 3...
  reviews: DomainExpertReview[];
  ioContracts: IOContract[];
  criticalIssues: Issue[];
  highIssues: Issue[];
  mediumIssues: Issue[];
  lowIssues: Issue[];
  feedback?: string;  // Aggregated feedback
  startedAt: string;
  completedAt?: string;
}

export interface UltrapilotState {
  phase: '0' | '1' | '1.5' | '2' | '3' | '4' | '5';
  // ... existing fields
  detailedPlanning?: DetailedPlanningState;
}
```

**Success Criteria:**
- All interfaces defined
- Type safety maintained
- Compatible with existing state structure

---

#### Task 2.2: Add State Management Functions
**File:** `src/state.ts`
**Time:** 1 hour

**Add functions:**

```typescript
export class StateManager {
  // ... existing functions

  /**
   * Initialize detailed planning phase
   */
  async initDetailedPlanning(highLevelPlan: string): Promise<void> {
    const state: DetailedPlanningState = {
      phase: '1.5',
      cycle: 1,
      maxCycles: 3,
      status: 'draft',
      currentPlan: `.ultra/detailed-plan-draft-v1.md`,
      planVersion: 1,
      reviews: [],
      ioContracts: [],
      criticalIssues: [],
      highIssues: [],
      mediumIssues: [],
      lowIssues: [],
      startedAt: new Date().toISOString()
    };

    await this.writeState('detailedPlanning', state);
  }

  /**
   * Add domain expert review
   */
  async addReview(review: DomainExpertReview): Promise<void> {
    const state = await this.getState('detailedPlanning');
    state.reviews.push(review);
    await this.writeState('detailedPlanning', state);
  }

  /**
   * Add I/O contract
   */
  async addIOContract(contract: IOContract): Promise<void> {
    const state = await this.getState('detailedPlanning');
    state.ioContracts.push(contract);
    await this.writeState('detailedPlanning', state);
  }

  /**
   * Add issue
   */
  async addIssue(issue: Issue): Promise<void> {
    const state = await this.getState('detailedPlanning');

    if (issue.severity === 'CRITICAL') {
      state.criticalIssues.push(issue);
    } else if (issue.severity === 'HIGH') {
      state.highIssues.push(issue);
    } else if (issue.severity === 'MEDIUM') {
      state.mediumIssues.push(issue);
    } else {
      state.lowIssues.push(issue);
    }

    await this.writeState('detailedPlanning', state);
  }

  /**
   * Move to next cycle
   */
  async nextCycle(): Promise<void> {
    const state = await this.getState('detailedPlanning');
    state.cycle += 1;
    state.planVersion += 1;
    state.currentPlan = `.ultra/detailed-plan-draft-v${state.planVersion}.md`;
    state.status = 'revised';
    await this.writeState('detailedPlanning', state);
  }

  /**
   * Check if all reviewers approved
   */
  async allApproved(): Promise<boolean> {
    const state = await this.getState('detailedPlanning');
    return state.reviews.every(r => r.status === 'APPROVED');
  }

  /**
   * Check if max cycles reached
   */
  async maxCyclesReached(): Promise<boolean> {
    const state = await this.getState('detailedPlanning');
    return state.cycle >= state.maxCycles;
  }

  /**
   * Mark detailed planning as approved
   */
  async approveDetailedPlanning(): Promise<void> {
    const state = await this.getState('detailedPlanning');
    state.status = 'approved';
    state.completedAt = new Date().toISOString();
    await this.writeState('detailedPlanning', state);
  }
}
```

**Success Criteria:**
- All state functions implemented
- Thread-safe operations
- Error handling for edge cases

---

### Phase 3: Detailed Planning Skill

#### Task 3.1: Create Ultra Detailed Planning Skill
**File:** `skills/ultra-detailed-planning.md`
**Time:** 2 hours

**Skill structure:**

```markdown
---
name: ultra-detailed-planning
description: Create detailed implementation plans with domain expert review loop. Ensures I/O contracts are explicit, error handling is defined, and integration points are validated before execution.
---

# Ultra Detailed Planning

## Purpose

Create robust detailed implementation plans with explicit I/O contracts, cross-domain error handling, and validation from domain experts BEFORE execution begins.

## When to Use

Invoked automatically during Phase 1.5 of Ultrapilot workflow:
- After high-level plan is created (Phase 1)
- Before execution begins (Phase 2)

## Workflow

### Step 1: Identify Domains

Analyze high-level plan and identify domains:

**Common domains:**
- Frontend (React, Vue, Angular)
- Backend (Node.js, Python, Go)
- Database (PostgreSQL, MongoDB, Redis)
- Infrastructure (Docker, K8s)
- API Integration (WebSocket, REST)
- Security (Auth, encryption)
- Performance (Caching, optimization)
- Testing (Unit, integration, E2E)

**Map domains to expert agents:**
```
frontend → ultra:frontend-expert
backend → ultra:backend-expert
database → ultra:database-expert
websocket → ultra:api-integration-expert
security → ultra:security-architect
performance → ultra:performance-expert
testing → ultra:testing-expert
```

### Step 2: Create Detailed Plan Draft

Use `ultra:planner` (Opus) to create detailed plan.

**Plan structure:**
1. Part 1: [Domain 1] - Detailed tasks
2. Part 2: [Domain 2] - Detailed tasks
3. Part 3: Cross-Domain I/O Contracts
4. Part 4: Error Handling Across Boundaries
5. Part 5: Integration Tests
6. Part 6: Success Criteria

**Each task must include:**
- File path
- Owner (agent ID)
- Estimated time
- Implementation (code or detailed spec)
- Integration points (what it depends on, what it produces)
- I/O contract (input/output schemas)

**Save to:** `.ultra/detailed-plan-draft-v{cycle}.md`

### Step 3: Parallel Domain Expert Reviews

Spawn domain expert agents in parallel:

```javascript
// For each domain in plan
Task(
  subagent_type=corresponding_expert,
  model="opus",
  prompt=`
Review the ${domain} section of the detailed plan:

Plan location: .ultra/detailed-plan-draft-v${cycle}.md

Focus on:
1. Technical correctness
2. Missing implementations
3. Integration point issues
4. Error handling gaps
5. I/O contract validation

Output format:
- Status: APPROVED | NEEDS_REVISION | REJECTED
- Critical issues (must fix)
- Recommendations (nice to have)
- I/O contract validations
- Overall assessment
`
)
```

**Wait for all reviews to complete.**

### Step 4: Aggregate Feedback

Collect all reviews and create aggregation:

**Count:**
- Total reviewers
- Approved count
- Needs revision count
- Rejected count

**Categorize issues:**
- Critical (blocking) - must fix
- High - should fix
- Medium - consider fixing
- Low - optional

**Validate I/O contracts:**
- Check each contract status
- List broken/unclear contracts

**Create feedback document:**
`.ultra/detailed-plan-feedback-cycle-{n}.md`

### Step 5: Check Approval

```python
approved_count = reviews.filter(status == 'APPROVED').length
total_count = reviews.length

if approved_count == total_count:
    return "APPROVED - Proceed to execution"
elif cycle < max_cycles:
    return "NEEDS_REVISION - Next cycle"
else:
    return "ESCALATE - Max cycles reached"
```

**If APPROVED:**
1. Mark plan as final: `.ultra/detailed-plan-final.md`
2. Update state to approved
3. Proceed to Phase 2 (execution)

**If NEEDS_REVISION:**
1. Go to Step 6
2. Start next cycle

**If ESCALATE:**
1. Notify architect
2. Architect makes final decision

### Step 6: Incorporate Feedback (Revision Cycle)

Use `ultra:planner` (Opus) to revise plan:

**Address all critical issues:**
1. Read feedback document
2. Fix each critical issue
3. Update I/O contracts
4. Add missing error handling
5. Clarify integration points

**Update plan header:**
```markdown
> Status: REVISED - Re-review in progress
> Cycle: {next_cycle}/3
> Previous: Cycle {prev_cycle} ({status})
> Revisions: {n} critical issues fixed, {m} I/O contracts updated
```

**Save to:** `.ultra/detailed-plan-draft-v{next_version}.md`

### Step 7: Re-review

Same experts review the revised plan.

**Focus on:**
- Did we fix critical issues?
- Are I/O contracts now valid?
- Is error handling complete?

**Faster review** - only check revisions.

### Step 8: Repeat Loop

Go back to Step 4 (aggregate feedback) and continue until:
- All experts approve, OR
- Max cycles reached (3)

## State Management

**Read state:**
```bash
state_read('detailedPlanning')
```

**Write state:**
```bash
state_write('detailedPlanning', data)
```

**State fields:**
- `cycle`: Current cycle number
- `status`: draft | review | revised | re-review | approved | escalated
- `reviews`: Array of expert reviews
- `ioContracts`: Array of I/O contracts with status
- `criticalIssues`: Array of blocking issues

## I/O Contract Template

Every integration point must have explicit I/O contract:

```typescript
// Contract: {CONTRACT_ID}

// Description
{Description of what flows between domains}

// Domains
- From: {domain_1}
- To: {domain_2}

// Schema (TypeScript/JSON)
interface ContractName {
  field1: type;
  field2: type;
  // ...
}

// Example
{
  "sessionId": "uuid-123",
  "content": "message text",
  "timestamp": 1234567890
}

// Error Handling
// On error: {what happens}
// Retry logic: {retry strategy}
// Fallback: {alternative approach}
```

## Example: Frontend → Backend I/O Contract

```typescript
// Contract: F-B-001
// Message Flow from Frontend to Backend

// Frontend emits
socket.emit('message:send', {
  sessionId: string,
  content: string,
  timestamp: number
})

// Backend expects
socket.on('message:send', async (payload) => {
  // Validation
  if (!payload.sessionId || !payload.content) {
    throw new Error('INVALID_PAYLOAD')
  }
  // Process...
})

// Error response
socket.on('message:error', {
  error: string,
  code: 'INVALID_PAYLOAD' | 'SESSION_NOT_FOUND' | 'SERVER_ERROR',
  retryable: boolean
})
```

## Integration Test Template

For each I/O contract, specify integration test:

```typescript
describe('Contract {CONTRACT_ID}: {Contract Name}', () => {
  it('should validate correct payload', async () => {
    // Arrange
    const payload = { /* valid data */ }

    // Act
    const response = await sendPayload(payload)

    // Assert
    expect(response.status).toBe('success')
  })

  it('should reject invalid payload', async () => {
    // Arrange
    const payload = { /* invalid data */ }

    // Act
    const response = await sendPayload(payload)

    // Assert
    expect(response.error).toBe('INVALID_PAYLOAD')
  })

  it('should handle timeout gracefully', async () => {
    // Act
    const response = await sendPayload_withTimeout()

    // Assert
    expect(response.retryable).toBe(true)
  })
})
```

## Success Criteria

- [ ] All domain experts approve their sections
- [ ] All I/O contracts are explicit and validated
- [ ] All error handling across boundaries is defined
- [ ] All integration tests are specified
- [ ] Zero critical issues
- [ ] Zero broken I/O contracts
- [ ] Plan is ready for execution

## Exit Conditions

**Proceed to execution when:**
- All experts approve (status: APPROVED)
- No critical issues remaining
- All I/O contracts valid

**Escalate to architect when:**
- Max cycles reached (3)
- Cannot resolve critical issues
- Fundamental architectural disagreement

## Tips

1. **Be explicit about I/O contracts**
   - Define schemas
   - Specify error responses
   - Document retry logic

2. **Plan error handling**
   - What happens if service X is down?
   - How do we retry?
   - What's the fallback?

3. **Consider performance**
   - Caching strategies
   - Load balancing
   - Rate limiting

4. **Security implications**
   - AuthN/AuthZ at boundaries
   - Data encryption
   - Input validation

5. **Testing strategy**
   - Unit tests per domain
   - Integration tests for contracts
   - E2E tests for flows

## Example Output

See `/home/ubuntu/hscheema1979/ultrapilot/DETAILED-PLANNING-PHASE-DESIGN.md` for complete example.

## Related Skills

- `ultra-planning` - High-level planning
- `ultra-architect` - System architecture
- `ultra-domain-setup` - Domain initialization
- `ultra-executor` - Plan execution
```

**Success Criteria:**
- Skill file created
- All workflow steps documented
- Templates provided for I/O contracts
- Clear exit conditions

---

### Phase 4: HUD Updates

#### Task 4.1: Add Detailed Planning Progress Display
**File:** `cli/hud.mjs`
**Time:** 45 minutes

**Add to HUD renderer:**

```javascript
function renderDetailedPlanning(state) {
  const { cycle, maxCycles, status, reviews, criticalIssues } = state.detailedPlanning;

  const approved = reviews.filter(r => r.status === 'APPROVED').length;
  const total = reviews.length;
  const approvalRate = Math.round((approved / total) * 100);

  let statusEmoji = getStatusEmoji(status);

  return `[ULTRA] PLAN-1.5 | cycle:${cycle}/${maxCycles} | reviews:${approved}/${total} (${approvalRate}%) | issues:${criticalIssues.length} critical | ${statusEmoji}`;
}

function getStatusEmoji(status) {
  switch(status) {
    case 'draft': return '📝';
    case 'review': return '👀';
    case 'revised': return '✏️';
    case 're-review': return '🔄';
    case 'approved': return '✅';
    case 'escalated': return '⚠️';
    default: return '❓';
  }
}
```

**Update HUD mode switch:**

```javascript
function renderHUD(state) {
  switch(state.phase) {
    case '0': return renderExpansion(state);
    case '1': return renderPlanning(state);
    case '1.5': return renderDetailedPlanning(state);  // NEW
    case '2': return renderExecution(state);
    case '3': return renderQA(state);
    case '4': return renderValidation(state);
    case '5': return renderVerification(state);
  }
}
```

**Success Criteria:**
- HUD shows detailed planning progress
- Cycle number visible
- Review approval rate visible
- Critical issue count visible

---

### Phase 5: Main Flow Integration

#### Task 5.1: Update Ultrapilot Main Skill
**File:** `skills/ultrapilot.md`
**Time:** 1 hour

**Add Phase 1.5 to workflow:**

```markdown
## Phase 1.5: Detailed Planning with Domain Expert Review

**Goal:** Create robust detailed plan with explicit I/O contracts

**Duration:** 2-8 hours (depends on cycles)

**Trigger:** After Phase 1 completes

**Process:**

1. **Identify domains** from high-level plan
   - Map domains to expert agents
   - Determine which experts to involve

2. **Create detailed plan draft**
   - Use `ultra:planner` (Opus)
   - Include domain-specific tasks
   - Define I/O contracts
   - Specify error handling

3. **Parallel domain expert reviews**
   - Spawn expert agents simultaneously
   - Each reviews their domain
   - Validate I/O contracts
   - Identify issues

4. **Aggregate feedback**
   - Categorize issues by severity
   - Count approvals
   - Check I/O contract status

5. **Approval check**
   - If all approve → Proceed to Phase 2
   - If issues remain → Next cycle
   - If max cycles → Escalate to architect

6. **Revision cycles** (repeat if needed)
   - Incorporate feedback
   - Re-review
   - Max 3 cycles

**Deliverables:**
- `.ultra/detailed-plan-final.md` (approved)
- All I/O contracts explicit
- All error handling defined
- All integration tests specified

**Success Criteria:**
- All domain experts approve
- Zero critical issues
- All I/O contracts validated

**Next:** Phase 2 (Execution) - NOW with robust detailed plan!
```

**Success Criteria:**
- Phase 1.5 added to workflow
- Clear trigger/exit conditions
- Links to detailed planning skill

---

### Phase 6: Testing

#### Task 6.1: Test Detailed Planning Flow
**Time:** 2 hours

**Test case:** Build a simple todo app

**Steps:**
1. Run `/ultrapilot Build a todo app with React`
2. Verify Phase 0 completes (architecture)
3. Verify Phase 1 completes (high-level plan)
4. Verify Phase 1.5 initiates:
   - Domains identified (frontend, backend)
   - Detailed plan draft created
   - Expert reviews spawned
   - Feedback aggregated
   - Plan approved after 1-2 cycles
5. Verify Phase 2 executes with detailed plan
6. Verify integration follows I/O contracts
7. Verify fewer integration errors

**Success Criteria:**
- All phases execute sequentially
- Detailed plan created
- Experts review and approve
- I/O contracts validated
- Execution follows plan
- No integration errors

---

### Phase 7: Documentation

#### Task 7.1: Update README
**File:** `README.md`
**Time:** 30 minutes

**Add section:**

```markdown
## Detailed Planning Phase

Ultrapilot includes a comprehensive detailed planning phase (Phase 1.5) that ensures:

- ✅ Explicit I/O contracts between domains
- ✅ Error handling across boundaries
- ✅ Domain expert validation
- ✅ Integration test specifications
- ✅ Reduced execution failures

**The Stolen Workflow:**
Combines the best of Superpowers brainstorming, OMC analysis, and wshobson's parallel execution patterns.

**Benefits:**
- Reduced rework (plan issues caught early)
- Faster execution (clear specifications)
- Better quality (expert validation)
- Predictable timeline (detailed estimates)

See `DETAILED-PLANNING-PHASE-DESIGN.md` for complete details.
```

**Success Criteria:**
- README updated
- Links to design doc
- Benefits clearly stated

---

## Timeline

| Phase | Tasks | Time |
|-------|-------|------|
| 1 | Agent catalog updates | 30 min |
| 2 | State management | 1.75 hr |
| 3 | Detailed planning skill | 2 hr |
| 4 | HUD updates | 45 min |
| 5 | Main flow integration | 1 hr |
| 6 | Testing | 2 hr |
| 7 | Documentation | 30 min |
| **Total** | **7 phases** | **8 hours** |

---

## Order of Execution

1. ✅ Design document created
2. ⏳ Agent catalog updates
3. ⏳ State management
4. ⏳ Detailed planning skill
5. ⏳ HUD updates
6. ⏳ Main flow integration
7. ⏳ Testing
8. ⏳ Documentation
9. ⏳ Commit and push

---

## Ready to Implement!

All planning complete. Ready to execute implementation.
