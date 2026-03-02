# Ultrapilot Agent Registry

## Overview

The Agent Registry is the bridge layer that connects Ultrapilot's 22+ agent definitions to invokable skills. It maps each `ultra:*` agent type to its underlying skill implementation with appropriate model tiers and system prompts.

## Architecture

```
AGENT_CATALOG (agents.ts)
    ↓
AgentRegistry (registry.ts)
    ↓
Skill Invocations (general-purpose, ultra-security-review, etc.)
```

## Files

- **`src/registry.ts`** - Main registry implementation with AgentRegistry class
- **`src/agents.ts`** - Updated with registry exports (legacy functions marked deprecated)
- **`src/index.ts`** - Exports registry functionality
- **`tests/registry.test.ts`** - Comprehensive test suite (46 tests, all passing)

## Agent Coverage

### All 22 Agents Registered

| Agent Type | Maps To | Model | Purpose |
|------------|---------|-------|---------|
| `ultra:analyst` | general-purpose | opus | Requirements analysis |
| `ultra:architect` | general-purpose | opus | System architecture |
| `ultra:planner` | general-purpose | opus | Implementation planning |
| `ultra:critic` | general-purpose | opus | Plan validation |
| `ultra:executor` | general-purpose | sonnet | Standard implementation |
| `ultra:executor-low` | general-purpose | haiku | Simple implementation |
| `ultra:executor-high` | general-purpose | opus | Complex implementation |
| `ultra:test-engineer` | general-purpose | sonnet | Test strategy |
| `ultra:verifier` | general-purpose | sonnet | Completion verification |
| `ultra:security-reviewer` | ultra-security-review | sonnet | Security audit |
| `ultra:quality-reviewer` | general-purpose | sonnet | Quality & performance |
| `ultra:code-reviewer` | ultra-code-review | opus | Comprehensive review |
| `ultra:debugger` | ultra-debugging | sonnet | Root cause analysis |
| `ultra:scientist` | general-purpose | sonnet | Data analysis |
| `ultra:build-fixer` | general-purpose | sonnet | Build troubleshooting |
| `ultra:designer` | general-purpose | sonnet | UX/UI design |
| `ultra:writer` | general-purpose | haiku | Technical writing |
| `ultra:team-lead` | general-purpose | opus | Team orchestration |
| `ultra:team-implementer` | general-purpose | sonnet | Parallel implementation |
| `ultra:team-reviewer` | general-purpose | sonnet | Multi-dimensional review |
| `ultra:team-debugger` | general-purpose | sonnet | Hypothesis debugging |
| `ultra:document-specialist` | general-purpose | sonnet | Documentation research |

## Usage

### Basic Invocation

```typescript
import { AgentRegistry } from 'ultrapilot';

// Invoke an agent
const invocation = AgentRegistry.invoke('ultra:analyst', 'Analyze user requirements');

// Returns:
// {
//   skill: 'general-purpose',
//   model: 'opus',
//   input: '# Role and Context\n\nSystem Instructions:...'
// }
```

### With Context

```typescript
const invocation = AgentRegistry.invoke(
  'ultra:planner',
  'Create implementation plan',
  {
    context: 'Building a REST API for task management',
    verbose: true
  }
);
```

### Check Registration

```typescript
// Check if agent is registered
if (AgentRegistry.isRegistered('ultra:executor')) {
  // Agent is available
}

// Get mapping details
const mapping = AgentRegistry.getMapping('ultra:executor');
// { mapsTo: 'general-purpose', model: 'sonnet', systemPrompt: '...' }
```

### Query Agents

```typescript
// Get all agents
const allAgents = AgentRegistry.getRegisteredAgents();

// Get by model tier
const opusAgents = AgentRegistry.getAgentsByModel('opus');
const sonnetAgents = AgentRegistry.getAgentsByModel('sonnet');

// Get by category
const byCategory = AgentRegistry.getAgentsByCategory();
// {
//   orchestration: ['ultra:analyst', 'ultra:architect', ...],
//   implementation: ['ultra:executor', ...],
//   ...
// }
```

### Validation

```typescript
// Validate coverage
const coverage = AgentRegistry.validateCoverage();
// {
//   valid: true,
//   unmapped: [],
//   total: 22,
//   mapped: 22
// }

// Get statistics
const stats = AgentRegistry.getStats();
// {
//   totalAgents: 22,
//   byModel: { opus: 7, sonnet: 13, haiku: 2 },
//   bySkill: { 'general-purpose': 19, 'ultra-security-review': 1, ... }
// }
```

## System Prompts

Each agent that maps to `general-purpose` receives a specialized system prompt that:

1. **Defines the agent's role** - Clear description of responsibilities
2. **Lists specific tasks** - What the agent should do
3. **Sets expectations** - Output format, quality standards
4. **Provides focus areas** - What to prioritize

Example (ultra:analyst):
```
You are a Requirements Analyst specialist. Your role is to:

1. Extract clear, unambiguous requirements from user requests
2. Identify and clarify edge cases and constraints
3. Define acceptance criteria for each requirement
4. Ask probing questions to uncover implicit requirements
5. Document assumptions and validate them with the user

Focus on understanding WHAT the user wants, not HOW to build it.
```

## Model Tier Strategy

- **Opus (7 agents)**: Complex reasoning, architecture, comprehensive review
  - analyst, architect, planner, critic, executor-high, code-reviewer, team-lead

- **Sonnet (13 agents)**: Standard implementation, quality checks, analysis
  - executor, test-engineer, verifier, security-reviewer, quality-reviewer, debugger, scientist, build-fixer, designer, document-specialist, team-implementer, team-reviewer, team-debugger

- **Haiku (2 agents)**: Simple, focused tasks
  - executor-low, writer

## Integration with Workflow

The registry integrates with Ultrapilot's workflow phases:

### Phase 0: Expansion
```typescript
AgentRegistry.invoke('ultra:analyst', task);  // Extract requirements
AgentRegistry.invoke('ultra:architect', task); // Design architecture
```

### Phase 1: Planning
```typescript
AgentRegistry.invoke('ultra:planner', task);  // Create plan
AgentRegistry.invoke('ultra:critic', plan);   // Validate plan
```

### Phase 2: Execution
```typescript
AgentRegistry.invoke('ultra:team-lead', task);         // Orchestrate
AgentRegistry.invoke('ultra:team-implementer', work);  // Implement
```

### Phase 3: QA
```typescript
AgentRegistry.invoke('ultra:test-engineer', code);  // Test strategy
AgentRegistry.invoke('ultra:build-fixer', errors);  // Fix builds
```

### Phase 4: Validation
```typescript
AgentRegistry.invoke('ultra:security-reviewer', code);  // Security audit
AgentRegistry.invoke('ultra:quality-reviewer', code);   // Quality check
AgentRegistry.invoke('ultra:code-reviewer', code);      // Comprehensive review
```

### Phase 5: Verification
```typescript
AgentRegistry.invoke('ultra:verifier', claims);  // Verify completion
```

## Testing

Run the comprehensive test suite:

```bash
npm test tests/registry.test.ts
```

**Coverage**: 46 tests covering:
- Initialization and lifecycle
- Agent mapping coverage (all 22 agents)
- Mapping structure validation
- Agent invocation with various options
- Agent queries and filtering
- Statistics and validation
- Integration with AGENT_CATALOG
- Edge cases and error handling
- Specific agent behaviors

**Result**: All tests passing ✓

## Design Decisions

### Why "general-purpose" for most agents?

1. **Simplicity**: One skill to maintain instead of 22 separate skills
2. **Consistency**: All agents use same invocation interface
3. **Flexibility**: System prompts customize behavior per agent type
4. **Model tiering**: Different model tiers (opus/sonnet/haiku) provide specialization

### Why keep existing ultra-* skills?

Three specialized skills exist and are used:
- **ultra-security-review**: Deep security expertise (OWASP, auth, injection)
- **ultra-code-review**: Comprehensive review patterns
- **ultra-debugging**: Advanced debugging methodologies

These have specialized logic beyond what a system prompt can provide.

### Bridge Pattern

The registry acts as a bridge between:
- **High-level workflow** (ultra:analyst, ultra:architect, etc.)
- **Low-level skills** (general-purpose, ultra-security-review, etc.)

This separation allows:
- Workflow code to use semantic agent names
- Skills to be swapped or upgraded independently
- Clear mapping of responsibilities

## Future Enhancements

Potential improvements:

1. **Custom skills per agent**: Create specialized skills as needed
2. **Agent composition**: Combine multiple agents for complex tasks
3. **Agent chaining**: Pipeline agents for multi-step workflows
4. **Agent pooling**: Parallel execution with agent selection
5. **Agent learning**: Track agent performance and optimize assignments

## API Reference

### AgentRegistry class

#### Static Methods

- `initialize()` - Initialize registry (auto-called on first use)
- `reset()` - Reset registry (mainly for testing)
- `getMapping(agentType: string)` - Get agent mapping
- `isRegistered(agentType: string)` - Check if agent exists
- `getRegisteredAgents()` - Get all agent types
- `getAgentsByModel(model)` - Get agents filtered by model tier
- `getAgentInfo(agentType)` - Get agent catalog info
- `invoke(agentType, task, options?)` - Create task invocation
- `getAgentsByCategory()` - Get agents grouped by category
- `validateCoverage()` - Validate all catalog agents have mappings
- `getStats()` - Get registry statistics

#### Types

- `AgentMapping` - Mapping configuration
- `InvocationOptions` - Invocation parameters
- `InvocationResult` - Result from agent invocation

## License

MIT

---

**Worker 1 - Task Complete: Agent Registry & Bridge**

All 22 agents are now registered, mapped, and invokable through the AgentRegistry class.
