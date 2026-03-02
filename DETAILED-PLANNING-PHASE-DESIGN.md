# Ultrapilot Detailed Planning Phase Design

## Problem Statement

Current Ultrapilot flow:
```
Phase 0: Expansion (analyst + architect)
Phase 1: Planning (planner + critic)
Phase 2: Execution (JUMPS TOO EARLY!)
```

**Missing:** The detailed planning loop with domain expert reviews that reduces execution failures.

## The Stolen Workflow (From OLD Plugins)

**Superpowers + OMC + wshobson's agents:**

```
1. Superpowers brainstorming + OMC analysis
   ↓
2. OMC architect plan (high-level system design)
   ↓
3. Superpowers writing-plans skill (detailed plan draft)
   ↓
4. Review by domain experts (wshobson's agents + OMC agents)
   ↓
5. Feedback incorporated by Superpowers writing-plans
   ↓
6. Review again by domain experts
   ↓
7. REPEAT until approved (Y/N)
   ↓
8. THEN execution
```

**Why This Works:**
- Domain experts catch I/O issues BEFORE execution
- Cross-domain integration points are explicit
- Error handling across boundaries is planned
- Reduces testing failures and execution hurdles

## Proposed NEW Flow

```
Phase 0: Expansion (analyst + architect)
  ↓
Phase 1: High-Level Planning (planner + critic)
  ↓
Phase 1.5: DETAILED PLANNING WITH DOMAIN EXPERT REVIEW LOOP ← NEW!
  ↓
Phase 2: Execution (now with robust detailed plan)
  ↓
Phase 3: QA
  ↓
Phase 4: Validation
  ↓
Phase 5: Verification
```

## Phase 1.5: Detailed Planning Loop

### Structure

```
[CYCLE 1]
├─ 1.5.1: Planner creates detailed plan draft
├─ 1.5.2: Parallel domain expert reviews
├─ 1.5.3: Feedback aggregation
├─ 1.5.4: Planner incorporates feedback
├─ 1.5.5: Re-review by domain experts
├─ 1.5.6: Approval decision (Y/N)
│  ├─ N → Go to CYCLE 2 (repeat 1.5.1-1.5.6)
│  └─ Y → Proceed to Phase 2
```

### Max Cycles: 3

After 3 cycles without approval, escalate to architect for decision.

---

## 1.5.1: Planner Creates Detailed Plan Draft

**Agent:** `ultra:planner` (Opus)

**Input:**
- High-level plan from Phase 1
- Architecture design from Phase 0

**Output:** `.ultra/detailed-plan-draft.md`

**Plan Structure:**

```markdown
# [Feature Name] Detailed Implementation Plan

> Status: DRAFT - Under Domain Expert Review
> Cycle: 1/3
> Created: 2025-03-02

---

## Part 1: Frontend Domain

### Architecture Overview
[Component structure, tech stack]

### Detailed Tasks

#### Task F.1.1: App Component
**File:** `web-ui/src/App.tsx`
**Owner:** agent-frontend
**Estimated:** 2 hours

**Implementation:**
```typescript
[exact code or detailed spec]
```

**Integration Points:**
- Receives: `messages` from `useMessages()` hook
- Emits: `message:send` events to WebSocket
- Depends on: `ThemeContext`, `RouterContext`

**I/O Contract:**
```typescript
// Input from Socket Context
interface MessageInput {
  sessionId: string
  content: string
  timestamp: number
}

// Output to WebSocket
socket.emit('message:send', MessageInput)
```

#### Task F.1.2: Chat Interface
**File:** `web-ui/src/components/Chat/MessageList.tsx`
**Owner:** agent-frontend
**Estimated:** 4 hours

[... detailed task with integration points]

---

## Part 2: Backend Domain

### Architecture Overview
[Component structure, tech stack]

### Detailed Tasks

#### Task B.1.1: Socket Server Setup
**File:** `socket-server/src/server.ts`
**Owner:** agent-backend
**Estimated:** 2 hours

**Implementation:**
```typescript
[exact code or detailed spec]
```

**Integration Points:**
- Listens on: port 3000
- Accepts: WebSocket connections from Web UI
- Connects to: Redis (session store)
- Proxies to: UltraX Gateway (port 3001)

**I/O Contract:**
```typescript
// Expected from Frontend
interface MessageSendEvent {
  sessionId: string
  content: string
  timestamp: number
}

// Forwarded to Claude Code
POST /api/execute
{
  "sessionId": string,
  "command": string
}
```

#### Task B.1.2: Session Management
**File:** `socket-server/src/services/Session.ts`
**Owner:** agent-backend
**Estimated:** 3 hours

[... detailed task with I/O contracts]

---

## Part 3: Database Domain

### Architecture Overview
[Redis schema, TTL strategy]

### Detailed Tasks

#### Task D.1.1: Session Store Schema
**File:** `socket-server/src/redis/schema.ts`
**Owner:** agent-database
**Estimated:** 1 hour

**Implementation:**
```typescript
[exact schema definition]
```

**I/O Contract:**
```typescript
// Key pattern
const SESSION_KEY = (id: string) => `session:${id}`

// Write operation
await redis.hset(SESSION_KEY(id), {
  messages: JSON.stringify(messages),
  agents: JSON.stringify(agents),
  createdAt: timestamp,
  lastActivity: timestamp
})

// Read operation
const session = await redis.hgetall(SESSION_KEY(id))
return {
  messages: JSON.parse(session.messages),
  agents: JSON.parse(session.agents),
  // ...
}
```

---

## Part 4: Cross-Domain Integration Contracts

### Frontend ↔ Backend

**Contract F-B-001: Message Flow**
```typescript
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
  // Processing
})
```

**Error Handling:**
- Frontend: Show retry dialog on socket disconnect
- Backend: Return error response for invalid payload
- Retry logic: Exponential backoff, max 3 attempts

---

### Backend ↔ Database

**Contract B-D-001: Session Persistence**
```typescript
// Backend writes
await redis.hset(`session:${id}`, {
  messages: JSON.stringify(messages),
  lastActivity: Date.now()
})

// Database returns
const session = await redis.hgetall(`session:${id}`)
// Returns null if not found (404)
```

**Error Handling:**
- Backend: Fall back to in-memory store if Redis down
- Database: Log connection errors, alert monitoring
- Fallback: Write-ahead log to disk

---

### Backend ↔ Claude Code API

**Contract B-C-001: Command Execution**
```typescript
// Backend sends
POST http://localhost:3001/api/execute
{
  "sessionId": "uuid-123",
  "command": "/ultrapilot Build me X",
  "timestamp": 1234567890
}

// Claude Code returns (streaming)
{
  "status": "running",
  "agent": "ultra:analyst",
  "message": "Analyzing requirements..."
}
```

**Error Handling:**
- Backend: Timeout after 30s, return error
- Claude Code: Return partial results if interrupted
- Retry: Queue command for retry on failure

---

## Part 5: Error Handling Across Boundaries

### Scenario 1: WebSocket Disconnect
**Frontend:** Detect disconnect → Show "Reconnecting..."
**Backend:** Detect disconnect → Cleanup session state
**Recovery:** Frontend auto-reconnect → Backend resume session

### Scenario 2: Redis Connection Lost
**Backend:** Detect Redis error → Switch to in-memory store
**Database:** Log error, attempt reconnection every 30s
**Recovery:** Backend flushes in-memory to Redis when reconnected

### Scenario 3: Claude Code API Timeout
**Backend:** 30s timeout → Return error to frontend
**Frontend:** Show "Request timeout, retry?"
**Recovery:** User clicks retry → Backend re-queues command

---

## Part 6: Testing Strategy

### Cross-Domain Integration Tests

**Test F-B-001: Message Flow End-to-End**
```typescript
it('should send message from frontend to backend to Claude Code', async () => {
  // Frontend emits message
  frontendSocket.emit('message:send', {
    sessionId: testSessionId,
    content: 'Hello Claude',
    timestamp: Date.now()
  })

  // Backend receives and validates
  await expectbackendSocket).toReceive('message:send', {
    sessionId: testSessionId,
    content: 'Hello Claude'
  })

  // Backend forwards to Claude Code
  await expect(claudeCodeAPI).toReceiveRequest({
    command: '/ultrapilot Hello Claude'
  })
})
```

**Test B-D-001: Session Persistence**
```typescript
it('should persist session to Redis and retrieve', async () => {
  // Backend stores session
  await backend.createSession(testSessionId, testData)

  // Database persists
  const redisData = await redis.hgetall(`session:${testSessionId}`)
  expect(JSON.parse(redisData.messages)).toEqual(testData.messages)

  // Backend retrieves
  const retrieved = await backend.getSession(testSessionId)
  expect(retrieved).toEqual(testData)
})
```

---

## Success Criteria

- [ ] All domain experts approve their sections
- [ ] All I/O contracts are explicit
- [ ] All error handling across boundaries is defined
- [ ] All integration tests are specified
- [ ] No ambiguous integration points
- [ ] No missing error handling
```

---

## 1.5.2: Parallel Domain Expert Reviews

**Agents (spawned in parallel):**

Based on domains in the plan, spawn appropriate experts:

```javascript
// For Web UI project
Task(subagent_type="ultra:frontend-expert", model="opus", prompt="Review frontend section")
Task(subagent_type="ultra:backend-expert", model="opus", prompt="Review backend section")
Task(subagent_type="ultra:database-expert", model="opus", prompt="Review database section")
Task(subagent_type="ultra:api-integration-expert", model="opus", prompt="Review all I/O contracts")
Task(subagent_type="ultra:security-reviewer", model="sonnet", prompt="Review security implications")
Task(subagent_type="ultra:quality-reviewer", model="sonnet", prompt="Review error handling")
```

**Review Format:**

Each expert produces:

```markdown
# Domain Expert Review: [Domain Name]

## Reviewer: ultra:[domain]-expert
## Cycle: 1/3
## Status: [APPROVED | NEEDS_REVISION | REJECTED]

---

## Section Reviewed
[Which part of the plan]

---

## Findings

### Critical Issues (Blockers)
- [ ] Issue 1: [description] → **MUST FIX**
- [ ] Issue 2: [description] → **MUST FIX**

### Recommendations (Improvements)
- [ ] Suggestion 1: [description]
- [ ] Suggestion 2: [description]

### I/O Contract Validation
- [ ] Contract [X-Y-ZZZ]: [VALID | NEEDS_CLARIFICATION | BROKEN]
  - Issue: [description]
  - Suggested fix: [description]

---

## Detailed Feedback

### Task F.1.1: App Component
**Status:** NEEDS_REVISION

**Issues:**
1. Missing error handling for WebSocket disconnect
   - Add: `socket.on('disconnect', handleReconnect)`
2. Type definition incomplete for MessageInput
   - Add: `agent?: string` field

**Suggestions:**
1. Consider using React Query for message caching
2. Add loading skeleton during initial connection

**I/O Contract Review:**
- Contract with Backend (message:send) is VALID
- Missing contract for `agent:update` events

---

### Task F.1.2: Chat Interface
**Status:** APPROVED

No issues found. Implementation is solid.

---

### Cross-Domain Integration

**Contract F-B-001 (Message Flow):**
- Status: NEEDS_CLARIFICATION
- Issue: What happens if backend rejects message?
- Suggestion: Add error response schema
  ```typescript
  interface MessageErrorResponse {
    error: string
    code: 'INVALID_PAYLOAD' | 'SESSION_NOT_FOUND' | 'SERVER_ERROR'
    retryable: boolean
  }
  ```

**Contract B-D-001 (Session Persistence):**
- Status: VALID
- Good: Fallback to in-memory is smart

---

## Overall Assessment

**Decision:** NEEDS_REVISION

**Must Fix:**
1. Add WebSocket error handling (Task F.1.1)
2. Add MessageErrorResponse to Contract F-B-001
3. Specify retry behavior on backend timeout

**Nice to Have:**
1. Consider React Query for caching
2. Add connection status indicator

**Estimated Revision Time:** 30 minutes

---

## Expert Confidence: HIGH

[I can approve this once critical issues are fixed]
```

---

## 1.5.3: Feedback Aggregation

**Agent:** `ultra:planner` (Sonnet - quick aggregation)

**Collect all reviews and create:**

```markdown
# Feedback Aggregation - Cycle 1

## Summary

- Total Experts: 6
- Statuses:
  - APPROVED: 2
  - NEEDS_REVISION: 3
  - REJECTED: 1

---

## Critical Issues (Must Fix)

1. **Frontend Expert:** Missing WebSocket error handling (Task F.1.1)
2. **Backend Expert:** Undefined timeout behavior for Claude Code API
3. **API Integration Expert:** Missing error response schema in Contract F-B-001
4. **Security Reviewer:** No authentication specified for WebSocket connections
5. **Quality Reviewer:** No retry logic specified for Redis failures

---

## I/O Contract Issues

| Contract | Status | Issue | Fix Required |
|----------|--------|-------|-------------|
| F-B-001 | NEEDS_FIX | Missing error response schema | Add ErrorResponse type |
| B-D-001 | VALID | - | - |
| B-C-001 | NEEDS_FIX | No timeout specified | Add 30s timeout |
| F-R-001 | BROKEN | No WebSocket auth | Add JWT token exchange |

---

## Recommendations (Nice to Have)

1. Frontend Expert: Consider React Query for caching
2. Database Expert: Add session replay capability
3. Quality Reviewer: Add circuit breaker for Redis

---

## Revision Priority

1. **CRITICAL (Blocking):** Fix 4 critical issues above
2. **HIGH:** Fix broken I/O contracts
3. **MEDIUM:** Address needs-clarification items
4. **LOW:** Implement nice-to-haves

**Estimated Revision Time:** 2 hours
```

---

## 1.5.4: Planner Incorporates Feedback

**Agent:** `ultra:planner` (Opus)

**Input:**
- Previous plan draft
- Aggregated feedback
- Critical issues
- I/O contract fixes

**Process:**
1. Address all critical issues
2. Fix all I/O contracts
3. Update error handling
4. Add missing integration points
5. Address high-priority recommendations

**Output:** `.ultra/detailed-plan-draft-v2.md`

**Header Update:**
```markdown
> Status: REVISED - Re-review in progress
> Cycle: 2/3
> Previous: Cycle 1 (NEEDS_REVISION)
> Revisions: 5 critical issues fixed, 2 I/O contracts updated
```

**Example Fixes:**

```markdown
#### Task F.1.1: App Component (REVISED)
**File:** `web-ui/src/App.tsx`
**Owner:** agent-frontend

**Implementation:**
```typescript
export function App() {
  const { socket, isConnected } = useWebSocket()

  useEffect(() => {
    // NEW: Error handling for WebSocket
    socket.on('disconnect', () => {
      console.error('WebSocket disconnected, attempting reconnection...')
    })

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error)
      // Show error to user
      setShowErrorDialog({
        title: 'Connection Lost',
        message: 'Reconnecting...',
        canRetry: true
      })
    })

    return () => {
      socket.off('disconnect')
      socket.off('connect_error')
    }
  }, [socket])

  // NEW: Auth token exchange
  useEffect(() => {
    const token = localStorage.getItem('jwt')
    if (token) {
      socket.emit('authenticate', { token })
    }
  }, [socket])

  return <ThemeProvider>...</ThemeProvider>
}
```

**Integration Points (UPDATED):**
- Authenticates: Sends JWT token on connection
- Handles: `disconnect`, `connect_error` events
- Shows: Error dialog to user on failure

**I/O Contract (UPDATED):**
```typescript
// Authentication handshake
socket.emit('authenticate', { token: string })

// Server response
socket.on('authenticated', { sessionId: string })
socket.on('auth_failed', { error: string })
```
```

---

## 1.5.5: Re-review by Domain Experts

**Same experts** from 1.5.2 review the revised plan.

**Focus:**
- Did we fix the critical issues?
- Are I/O contracts now valid?
- Is error handling complete?

**Faster review** - only check revisions, not entire plan.

**Output:** Updated reviews with status.

---

## 1.5.6: Approval Decision

**Agent:** `ultra:critic` (Opus - final decision maker)

**Input:**
- All re-reviews
- Revision log

**Decision Process:**

```javascript
const approvedCount = reviews.filter(r => r.status === 'APPROVED').length
const totalCount = reviews.length

if (approvedCount === totalCount) {
  return 'APPROVED - Proceed to execution'
} else if (cycle < 3) {
  return 'NEEDS_REVISION - Go to next cycle'
} else {
  return 'ESCALATE_TO_ARCHITECT - Max cycles reached'
}
```

**If APPROVED:**
```markdown
# Detailed Plan - FINAL

> Status: ✅ APPROVED for execution
> Cycle: 2
> Approval Date: 2025-03-02
> Reviewers: 6/6 approved

---

## Plan is Ready for Phase 2: Execution

All critical issues resolved.
All I/O contracts validated.
All error handling defined.

**Next Step:** Hand off to execution team.
```

**If ESCALATED:**
- Architect reviews all feedback
- Makes final decision:
  - Approve with known issues
  - Major rework needed
  - Split into smaller projects

---

## State Management

**State File:** `.ultra/state/detailed-planning-state.json`

```json
{
  "phase": "1.5",
  "cycle": 2,
  "maxCycles": 3,
  "status": "re-review",
  "currentPlan": ".ultra/detailed-plan-draft-v2.md",
  "reviews": [
    {
      "domain": "frontend",
      "reviewer": "ultra:frontend-expert",
      "status": "APPROVED",
      "cycle": 2
    },
    {
      "domain": "backend",
      "reviewer": "ultra:backend-expert",
      "status": "NEEDS_REVISION",
      "cycle": 2,
      "criticalIssues": 1
    }
  ],
  "criticalIssues": [
    {
      "id": "F-B-001",
      "description": "Missing error response schema",
      "status": "FIXED",
      "fixedIn": "v2"
    }
  ],
  "ioContracts": [
    {
      "id": "F-B-001",
      "name": "Message Flow",
      "status": "VALID",
      "validatedIn": "cycle-2"
    }
  ]
}
```

---

## Domain Expert Agents Available

From Ultrapilot's 29+ agents:

### Frontend
- `ultra:frontend-expert` (Opus) - React, Vue, Angular, TypeScript
- `ultra:ui-ux-expert` (Sonnet) - Component design, theming

### Backend
- `ultra:backend-expert` (Opus) - Node.js, Python, Go
- `ultra:api-designer` (Sonnet) - REST, GraphQL, WebSocket

### Database
- `ultra:database-expert` (Opus) - PostgreSQL, MongoDB, Redis
- `ultra:data-engineer` (Sonnet) - ETL, pipelines, migrations

### Infrastructure
- `ultra:kubernetes-architect` (Opus) - K8s, Docker, deployments
- `ultra:cloud-expert` (Sonnet) - AWS, GCP, Azure

### Integration
- `ultra:api-integration-expert` (Opus) - I/O contracts, boundaries
- `ultra:security-reviewer` (Sonnet) - Auth, encryption, OWASP

### Quality
- `ultra:quality-reviewer` (Sonnet) - Performance, error handling
- `ultra:test-strategist` (Sonnet) - Integration tests, coverage

---

## Implementation Steps

### Step 1: Add Phase 1.5 to Ultrapilot Flow

Update `skills/ultrapilot.md` to include Phase 1.5:

```markdown
## Phase 1.5: Detailed Planning with Domain Expert Review

**Goal:** Create robust detailed plan with explicit I/O contracts

**Duration:** 2-8 hours (depends on cycles)

**Process:**
1. Planner creates detailed plan draft
2. Parallel domain expert reviews
3. Feedback aggregation
4. Planner incorporates feedback
5. Re-review
6. Approval (max 3 cycles)

**Deliverable:**
- `.ultra/detailed-plan-final.md` (approved)
- All I/O contracts explicit
- All error handling defined

**Success Criteria:**
- All domain experts approve
- Zero critical issues
- All I/O contracts validated
```

### Step 2: Create Detailed Planning Skill

Create `skills/ultra-detailed-planning.md`:

```markdown
---
name: ultra-detailed-planning
description: Create detailed implementation plans with domain expert review loop
---

# Ultra Detailed Planning

[Full implementation from this design document]
```

### Step 3: Update Agent Catalog

Add domain expert agents to `src/agents.ts`:

```typescript
'ultra:frontend-expert': {
  name: 'Frontend Expert',
  description: 'React, Vue, Angular, TypeScript, component architecture',
  model: 'opus',
  capabilities: ['frontend-architecture', 'react', 'typescript', 'ui-components']
},

'ultra:backend-expert': {
  name: 'Backend Expert',
  description: 'Node.js, Python, Go, API design, microservices',
  model: 'opus',
  capabilities: ['backend-architecture', 'api-design', 'microservices']
},

'ultra:database-expert': {
  name: 'Database Expert',
  description: 'PostgreSQL, MongoDB, Redis, schema design, migrations',
  model: 'opus',
  capabilities: ['database-design', 'sql', 'nosql', 'migrations']
},

// ... more domain experts
```

### Step 4: Add State Management

Update `src/state.ts` to handle detailed planning state:

```typescript
export interface DetailedPlanningState {
  phase: '1.5';
  cycle: number;
  maxCycles: number;
  status: 'draft' | 'review' | 'revised' | 're-review' | 'approved' | 'escalated';
  currentPlan: string;
  reviews: DomainExpertReview[];
  criticalIssues: Issue[];
  ioContracts: IOContract[];
}
```

### Step 5: Update HUD

Add detailed planning progress to HUD:

```
[ULTRA] PLAN-1.5 | cycle:2/3 | reviews:5/6 | issues:1 critical | ctx:78%
```

---

## Benefits

**Reduced Execution Failures:**
- I/O contracts tested before code written
- Error handling planned across boundaries
- Integration points validated

**Faster Execution:**
- Less back-and-forth during implementation
- Fewer "wait, how do I integrate?" moments
- Clear specifications for each domain

**Better Quality:**
- Domain experts validate their domains
- Security reviewed before implementation
- Performance considered upfront

**Predictable Timeline:**
- Detailed task estimates from experts
- Dependencies mapped explicitly
- Risk identified early

---

## Example Timeline

**Small Project (1 week):**
- Phase 0: 2 hours (architecture)
- Phase 1: 1 hour (high-level plan)
- **Phase 1.5: 4 hours (detailed planning + 2 cycles)**
- Phase 2: 3 days (execution)
- Phase 3-5: 2 days (QA, validation, verification)

**Large Project (3 months):**
- Phase 0: 1 day (architecture)
- Phase 1: 4 hours (high-level plan)
- **Phase 1.5: 2-3 days (detailed planning + 3 cycles)**
- Phase 2: 6 weeks (execution)
- Phase 3-5: 3 weeks (QA, validation, verification)

**ROI:**
- Invest 4 hours → Save 3 days of rework
- Invest 3 days → Save 3 weeks of integration hell

---

## Next Steps

1. ✅ Design approved
2. ⏳ Implement detailed planning skill
3. ⏳ Add domain expert agents to catalog
4. ⏳ Update state management
5. ⏳ Update HUD
6. ⏳ Test on small project
7. ⏳ Roll out to all Ultrapilot executions

---

**This design brings the stolen workflow into NEW Ultrapilot!**
