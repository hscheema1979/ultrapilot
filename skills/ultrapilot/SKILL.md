---
name: ultrapilot
description: "Enhanced upstream for OMC autopilot: deep brainstorming-based analysis + architecture planning, then hands off to ultra-planning which invokes OMC autopilot orchestrator for execution."

# Ultrapilot - Enhanced Upstream for Autopilot

Ultrapilot enhances OMC's autopilot with superior requirements exploration and architecture design, then hands off to ultra-planning and autopilot orchestrator for execution.

## Philosophy

Ultrapilot improves the "Phase 0/1" of autopilot by:
- Loading brainstorming principles (not invoking interactive skill)
- Deep analysis with brainstorming methodology
- Comprehensive architecture design
- Then hands off to ultra-planning for detailed implementation plan
- Ultra-planning invokes autopilot orchestrator for execution

## The Complete Chain

```
User: /ultrapilot Build me X

[ULTRAPILOT - Phase 0 Enhanced]
↓ Loads brainstorming principles
↓ Deep analysis (analyst agent)
↓ Architecture design (architect agent)
↓
[ULTRA-PLANNING - Creates Detailed Plan]
↓ Converts architecture → phased implementation
↓
[AUTOPILOT ORCHESTRATOR - Execution]
↓ Ralph + Ultrawork execution
↓ QA cycles (up to 5x)
↓ Multi-perspective validation
↓
[COMPLETE]
```

## Workflow

### Phase 1: Load Brainstorming Framework (INTERNAL)

Load brainstorming principles directly - DO NOT invoke the skill:

```python
# Read brainstorming principles from source
brainstorming_principles = read_file("~/.claude/plugins/cache/claude-plugins-official/superpowers/4.3.1/skills/brainstorming/SKILL.md")

# Extract the thinking framework:
# - Explore project context first
# - Understand purpose, constraints, success criteria
# - Consider trade-offs and edge cases
# - YAGNI ruthlessly
```

**Critical:** Do not make this interactive. Extract principles and use them internally.

### Phase 2: Deep Analysis (Analyst Agent)

Delegate to analyst with brainstorming framework:

```
Task(
    subagent_type="general-purpose",
    model="opus",
    prompt=f"""
You are a requirements analyst using brainstorming principles.

USER REQUEST: {user_request}

BRAINSTORMING PRINCIPLES:
{brainstorming_principles}

Perform deep requirements analysis:
- Core requirements and success criteria
- Constraints and limitations
- Trade-offs and decisions
- Edge cases to consider
- Recommended approach
"""
)
```

### Phase 3: Architecture Design (Architect Agent)

Delegate to architect with analysis:

```
Task(
    subagent_type="general-purpose",
    model="opus",
    prompt=f"""
Design the system architecture.

USER REQUEST: {user_request}
REQUIREMENTS ANALYSIS:
{analyst_output}

Create comprehensive architecture:
- System boundaries and components
- Data models and relationships
- API contracts and interfaces
- Technology stack with rationale
- Integration points
"""
)
```

### Phase 4: Hand Off to Ultra-Planning

**This is where Ultrapilot's job ENDS.**

Invoke ultra-planning skill with the architectural design:

```
Using the architect's design, create detailed implementation plan:

ARCHITECTURAL FOUNDATION:
{architect_output}

Create implementation plan that:
- Respects architect's system boundaries
- Implements components in logical order
- Maintains architect's integration points
- Follows architect's technology choices
- Provides time estimates for each phase
```

Ultra-planning will then:
1. Create detailed phased implementation plan
2. Invoke autopilot orchestrator for execution
3. Autopilot handles Ralph + Ultrawork + QA + Validation

## What Ultrapilot Does NOT Do

❌ Does NOT execute code directly
❌ Does NOT spawn executors
❌ Does NOT run QA cycles
❌ Does NOT handle state management

**Those are handled by:**
- **ultra-planning** → Creates the plan
- **autopilot (OMC orchestrator)** → Executes the plan

## Why This Architecture

**Separation of Concerns:**

| Layer | Responsibility |
|-------|---------------|
| **ultrapilot** | Requirements exploration, architecture design |
| **ultra-planning** | Implementation planning |
| **autopilot** | Execution orchestration (Ralph, Ultrawork, QA) |

**This matches superpilot's design:**
- Enhance upstream (better analysis/architecture)
- Keep downstream (proven OMC execution engine)

## Usage

```
User: /ultrapilot Build me a REST API for task management

[ULTRAPILOT - Enhanced Phase 0]
→ Loading brainstorming principles...
→ Deep analysis with Opus analyst...
→ Architecture design with Opus architect...
→ Output: Comprehensive system blueprint

[ULTRA-PLANNING - Detailed Planning]
→ Converting architecture to phased plan...
→ Phase 1: Foundation (setup, structure)
→ Phase 2: Core API (endpoints, routing)
→ Phase 3: Database (schema, migrations)
→ Phase 4: Authentication (JWT, middleware)
→ Phase 5: Testing (unit, integration)
→ Output: Detailed implementation plan

[AUTOPILOT ORCHESTRATOR - Execution]
→ Activating Ralph mode...
→ Spawning parallel executors (Phase 1-3 simultaneously)
→ Test engineer writing tests in parallel
→ Build fixer handling compilation errors
→ QA Cycle 1: 3 tests fail, fixing...
→ QA Cycle 2: All tests passing
→ Multi-perspective validation: ✓ architect, ✓ security, ✓ code
→ Cleanup complete

[COMPLETE]
✓ Task management REST API ready
  - 12 endpoints created
  - 47 tests passing
  - All reviewers approved
```

## Specialist Agents Available

Ultra-planning and autopilot can delegate to these:

**Architecture:** ultra-c4-context, ultra-c4-container, ultra-c4-component, ultra-c4-code
**Languages:** ultra-python-expert, ultra-typescript-expert, ultra-java-expert
**Infrastructure:** ultra-kubernetes-architect, ultra-cloud-architect, ultra-cicd-expert
**Data:** ultra-database-architect, ultra-sql-expert, ultra-data-engineer
**Debugging:** ultra-error-detective, ultra-distributed-debugger, ultra-performance-analyst
**Documentation:** ultra-api-documenter, ultra-tutorial-engineer
**Security:** ultra-backend-security, ultra-security-reviewer
**Operations:** ultra-incident-responder

## Integration

Ultrapilot sits **before** ultra-planning and autopilot:

```
ultrapilot (enhanced Phase 0/1)
    ↓
ultra-planning (detailed planning)
    ↓
autopilot orchestrator (execution)
```

This provides:
- **Better upstream** than standard autopilot (deep brainstorming-based analysis)
- **Proven downstream** from OMC autopilot (Ralph, Ultrawork, QA cycles)

## State Management

State is managed by autopilot orchestrator:
- `.omc/state/autopilot-state.json` - Main autopilot state
- `.omc/state/ralph-state.json` - Ralph persistence
- `.omc/state/ultrawork-state.json` - Ultrawork coordination

Ultrapilot does not manage execution state directly.

## Key Principles

1. **Deep Before Broad** - Thorough analysis before any planning
2. **Use Proven Tools** - Don't reimplement OMC's execution engine
3. **Clear Handoffs** - Ultrapilot → ultra-planning → autopilot
4. **Evidence Only** - Autopilot verifies before claiming complete
