# How UltraPilot Works with Claude Code

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CLAUDE CODE CLI                          │
│  (The foundation - provides execution environment)           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         ULTRAPILOT PLUGIN                              │  │
│  │  (Installed in ~/.claude/plugins/ultrapilot/)          │  │
│  │                                                         │  │
│  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │  Skills Layer (what you invoke)                 │   │  │
│  │  │  • /ultra-review (multi-dimensional review)     │   │  │
│  │  │  • /ultra-ralph (persistent execution)          │   │  │
│  │  │  • /ultra-team (parallel agents)                │   │  │
│  │  │  • /ultrapilot (full autonomous execution)     │   │  │
│  │  └─────────────────────────────────────────────────┘   │  │
│  │                                                         │  │
│  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │  Agent Orchestrator (NEW!)                     │   │  │
│  │  │  • Coordinates State + Bus + Bridge             │   │  │
│  │  │  • Executes multi-agent workflows              │   │  │
│  │  └─────────────────────────────────────────────────┘   │  │
│  │                                                         │  │
│  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │  Agent Bridge + State + Bus                    │   │  │
│  │  │  • Bridge: Full behavioral definitions          │   │  │
│  │  │  • State: Persistent agent memory                │   │  │
│  │  │  • Bus: Inter-agent communication               │   │  │
│  │  └─────────────────────────────────────────────────┘   │  │
│  │                                                         │  │
│  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │  AGENT_CATALOG (109 agents)                     │   │  │
│  │  │  • ultra:analyst, ultra:architect, etc.          │   │  │
│  │  └─────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  Task Tool (built-in to Claude Code)                        │
│  • Spawns subagents (general-purpose or ultra:*)           │
└──────────────────────────────────────────────────────────────┘
```

## How It Works: Step by Step

### 1. User Invokes a Skill

**User types**: `/ultra-review src/auth/`

**What happens**:
```
1. Claude Code CLI loads the skill
   → ~/.claude/skills/ultra-review/SKILL.md

2. Skill reads the <Execution_Policy> section
   → "Spawn 4 general-purpose reviewers + 1-2 domain experts"

3. Skill analyzes the code (src/auth/)
   → Detects: Backend code, authentication, security-sensitive
   → Selects: backend-architect + auth-specialist
```

### 2. Skill Spawns Reviewers (Using Task Tool)

**Inside the skill**, it does this:

```typescript
// From ultra-review skill Execution_Policy:

// 4 general reviewers (always)
const securityReviewer = Task("Security review", "general-purpose",
  "Review from SECURITY perspective: OWASP Top 10, auth, injection...");

const performanceReviewer = Task("Performance review", "general-purpose",
  "Review from PERFORMANCE perspective: bottlenecks, complexity...");

// Domain experts (selective)
const backendExpert = Task("Backend expert", "ultra:backend-architect",
  "Review this authentication code from BACKEND perspective...");

const authExpert = Task("Auth specialist", "ultra:auth-specialist",
  "Review authentication implementation...");

// All run in parallel
const results = await Promise.all([
  securityReviewer,
  performanceReviewer,
  architectureReviewer,
  testReviewer,
  backendExpert,
  authExpert
]);
```

### 3. Task Tool Invokes Agents

**The Task tool** (built into Claude Code):
```typescript
Task(description, subagent_type, prompt)
```

**What happens internally**:

**Option A: Using general-purpose subagent_type**
```
Task("Backend expert", "general-purpose", prompt)
  ↓
Claude Code spawns a new Claude instance
  ↓
New Claude runs with: "You are a security specialist. Review this code..."
  ↓
Returns results to skill
```

**Option B: Using ultra:* subagent_type**
```
Task("Backend expert", "ultra:backend-architect", prompt)
  ↓
Claude Code needs to find what "ultra:backend-architect" means
  ↓
Looks in ~/.claude/plugins/ultrapilot/src/agents.ts
  ↓
Finds: 'ultra:backend-architect': { name, model, description }
  ↓
[NEW] Uses AgentBridge to load full .md file with behavioral instructions
  ↓
Builds system prompt: 100+ lines of backend architecture expertise
  ↓
Spawns new Claude with that full system prompt
  ↓
Returns results
```

### 4. AgentBridge Integration (NEW!)

**Before** (old way - only metadata):
```typescript
// Only had this:
AGENT_CATALOG['ultra:backend-architect'] = {
  name: 'backend-architect',
  description: 'Expert backend architect...',
  model: 'sonnet'
  // ❌ Lost 100+ lines of behavioral instructions!
}

// Task tool would do:
Task("...", "ultra:backend-architect", prompt)
  ↓
Spawns general-purpose with just the description
  ↓
❌ No actual backend architecture expertise!
```

**After** (NEW with AgentBridge):
```typescript
// AgentBridge loads FULL definition:
// ~/.claude/plugins/ultrapilot/agents/*/ultra-backend-architect.md

/*
You are a backend system architect specializing in:

## Core Philosophy
...

## Capabilities
### API Design & Patterns
- RESTful APIs: Resource modeling, HTTP methods, status codes...
- GraphQL APIs: Schema design, resolvers, mutations...
- [50+ more capabilities]
...

## Best Practices
...

## Behavioral Rules
[100+ lines of specific instructions]
*/

AgentBridge.loadAgentDefinition('ultra:backend-architect')
  ↓
Parses .md file (YAML + markdown)
  ↓
Extracts: name, model, tools, systemPrompt (100+ lines!)
  ↓
buildSystemPrompt(definition, context)
  ↓
Returns FULL behavioral prompt

// Then Task tool uses it:
Task("...", "general-purpose", FULL_PROMPT)
  ↓
✅ Agent now has REAL backend architecture expertise!
```

### 5. Agent Orchestrator Integration (NEW!)

When using `/ultrapilot` or `/ultra-team`:

```typescript
// Skill creates workflow:
const workflow = {
  id: 'build-api',
  mode: 'sequential',
  steps: [
    { id: '1', agentId: 'ultra:backend-architect', task: 'Design API' },
    { id: '2', agentId: 'ultra:executor', task: 'Implement', deps: ['1'] },
    { id: '3', agentId: 'ultra:test-engineer', task: 'Test', deps: ['2'] }
  ]
};

// Orchestrator coordinates:
orchestrator.executeWorkflow(workflow)
  ↓
┌─────────────────────────────────────────┐
│ Step 1: ultra:backend-architect         │
│ • AgentBridge loads full definition     │
│ • StateStore creates agent state        │
│ • Task tool spawns agent with expertise │
│ • State updated: currentTask='design'   │
│ • MessageBus: notifies completion       │
└─────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────┐
│ Step 2: ultra:executor                  │
│ • AgentBridge loads full definition     │
│ • StateStore: remembers step 1 output   │
│ • MessageBus: receives step 1 message   │
│ • Task tool spawns agent with context   │
│ • State updated: completedTasks=['1']  │
└─────────────────────────────────────────┘
  ↓
[... continues for all steps ...]
```

## Current Integration Status

### ✅ What Works NOW

1. **Skills can invoke agents**:
   ```bash
   /ultra-review src/auth/  # Works!
   /ultra-ralph "Fix this bug"  # Works!
   /ultra-team 3  # Works!
   ```

2. **AgentBridge loads full definitions**:
   - 177 agent .md files with 100+ lines each
   - Full behavioral context
   - ✅ IMPLEMENTED

3. **Task tool integration**:
   - Works with general-purpose
   - Works with ultra:* agents (via AgentBridge)
   - ✅ IMPLEMENTED

4. **Agent Orchestrator**:
   - Coordinates State + Bus + Bridge
   - Sequential & parallel workflows
   - ✅ IMPLEMENTED

### ⏳ What Needs Work

1. **Skill → Orchestrator Integration**:
   Skills like `/ultra-review` currently use Task tool directly.
   They should use Agent Orchestrator instead.

   **Current** (in ultra-review skill):
   ```typescript
   // Skill does this:
   Task("Security review", "general-purpose", "Review from SECURITY...")

   // Should do:
   orchestrator.executeWorkflow({
     id: 'review-workflow',
     steps: [
       { agentId: 'general-purpose', task: 'Security review...' },
       { agentId: 'ultra:backend-architect', task: 'Backend review...' }
     ]
   });
   ```

2. **Task Function Injection**:
   - AgentBridge.setTaskFunction(Task) needs to be called
   - Currently skills don't do this
   - Need to add to skill initialization

## How to Make It Work Together

### Option 1: Update Skills to Use Orchestrator

**Update ultra-review skill**:

```markdown
<Execution_Policy>
- Create orchestrator with State + Bus + Bridge
- Inject Task function: bridge.setTaskFunction(Task)
- Execute review workflow via orchestrator.executeWorkflow()
- Collect results and present report
</Execution_Policy>
```

### Option 2: Create Wrapper Skill

Create `/ultra-workflow` skill:

```typescript
// User runs: /ultra-workflow "Design API" "Implement it"

const orchestrator = new AgentOrchestrator(bridge, stateStore, messageBus);
orchestrator.setTaskFunction(Task);

await orchestrator.executeWorkflow({
  id: 'user-workflow',
  steps: [
    { agentId: 'ultra:architect', task: args[0] },
    { agentId: 'ultra:executor', task: args[1] }
  ]
});
```

### Option 3: Auto-Inject in Plugin

**In ~/.claude/plugins/ultrapilot/src/index.ts**:

```typescript
// Auto-initialize when plugin loads
export async function initialize() {
  const bridge = new AgentBridge();
  const orchestrator = new AgentOrchestrator(bridge, stateStore, messageBus);

  // Make available globally to skills
  global.ultrapilot = { bridge, orchestrator, stateStore, messageBus };
}
```

Then skills can use:
```typescript
const { orchestrator } = global.ultrapilot;
orchestrator.executeWorkflow(...);
```

## Example: Full Flow with Current Implementation

**User**: `/ultra-review the authentication module`

**What happens**:

1. **Skill loads**: `~/.claude/skills/ultra-review/SKILL.md`

2. **Skill analyzes**: Scans `src/auth/`, detects:
   - Backend code (TypeScript/Node)
   - Authentication logic
   - Security-sensitive

3. **Skill selects reviewers**:
   - 4 general: Security, Performance, Architecture, Test
   - 2 domain: `ultra:backend-architect`, `ultra:auth-specialist`

4. **Skill spawns Task calls** (CURRENT IMPLEMENTATION):
   ```typescript
   Task("Security review", "general-purpose",
     "Review src/auth/ from SECURITY perspective...")

   Task("Backend expert", "ultra:backend-architect",
     "Review src/auth/ backend architecture...")
   ```

5. **AgentBridge loads ultra:backend-architect**:
   - Reads `~/.claude/plugins/ultrapilot/agents/*/backend-architect.md`
   - Extracts 100+ lines of behavioral instructions
   - Builds full system prompt

6. **Task tool executes**:
   - Spawns 6 parallel Claude instances
   - Each gets full context (role + task + code)
   - Agents work independently

7. **Skill collects results**:
   - Waits for all 6 reviewers
   - Deduplicates findings
   - Presents consolidated report

## What's Missing for Full Integration

### Critical Gap: Skills Don't Use Orchestrator Yet

**Current**: Skills → Task tool → Agents
**Desired**: Skills → Orchestrator → State + Bus + Bridge → Task tool → Agents

**Why it matters**:
- ❌ No persistent agent memory across skill invocations
- ❌ No agent-to-agent communication within skills
- ❌ Can't do multi-step workflows (design → implement → test)

**Fix needed**: Update skills to use Agent Orchestrator

### Example: Updated ultra-review with Orchestrator

```markdown
<Execution_Policy>
1. Initialize orchestrator:
   - Create AgentBridge, StateStore, MessageBus
   - Inject Task function: bridge.setTaskFunction(Task)

2. Execute review workflow:
   - Step 1: Security reviewer (general-purpose)
   - Step 2: Performance reviewer (general-purpose)
   - Step 3: Architecture reviewer (general-purpose)
   - Step 4: Test reviewer (general-purpose)
   - Step 5: Domain expert (ultra:* based on code analysis)

3. Each step:
   - Orchestrator tracks agent state
   - Messages passed between steps via MessageBus
   - Outputs collected from each step

4. Present consolidated report
</Execution_Policy>
```

## Summary

**Current State**:
- ✅ UltraPilot plugin installed
- ✅ Skills invoke agents via Task tool
- ✅ AgentBridge loads full behavioral definitions
- ✅ Agent Orchestrator implemented (but not used by skills yet)

**What Works**:
- ✅ `/ultra-review` - Multi-dimensional review
- ✅ `/ultra-ralph` - Persistent execution
- ✅ `/ultra-team` - Parallel agents
- ✅ Agent invocation with full behavioral context

**What's Needed**:
- ⏳ Skills updated to use Agent Orchestrator
- ⏳ Task function injection in skills
- ⏳ Multi-step workflows in skills

**Would you like me to**:
1. Update ultra-review skill to use Orchestrator?
2. Create a new /ultra-workflow skill?
3. Add auto-initialization to the plugin?
