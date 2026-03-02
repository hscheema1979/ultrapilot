# Agent Bridge Architecture Proposal

## Problem Statement

The current agent catalog integration only captures **metadata** (name, description, model) but **loses the actual agent behavior** and **specialized knowledge** contained in agents-lib's 177 agent definition files.

## What We Have vs. What We Need

### Current State (Incomplete)
```typescript
// src/agents.ts - Just metadata
'ultra:backend-architect': {
  name: 'backend-architect',
  description: 'Expert backend architect...',  // 1 sentence summary
  model: 'sonnet',
  capabilities: ['backend_development']  // Lost 100+ capabilities!
}
```

### What agents-lib Actually Has
```markdown
---
name: backend-architect
model: inherit
tools: Read, Glob, Grep, Bash
---

You are a backend system architect specializing in...

## Core Philosophy
[Detailed design principles and approach]

## Capabilities
### API Design & Patterns
- RESTful APIs: Resource modeling, HTTP methods, status codes...
- GraphQL APIs: Schema design, resolvers, mutations...
- gRPC Services: Protocol Buffers, streaming...
- [50+ more detailed capabilities]

### Microservices Architecture
- Service boundaries: Domain-Driven Design...
- Service mesh: Istio, Linkerd...
- Circuit breaker: Resilience patterns...
- [40+ more patterns]

## Best Practices
[Specific protocols and guidelines]

## Behavioral Rules
[How to approach problems, what to prioritize]
```

## Solution: Agent Bridge

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     UltraPilot Framework                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐      ┌──────────────────┐                 │
│  │   Domain    │─────▶│  AGENT_CATALOG   │                 │
│  │ Initializer │      │  (109 agents)    │                 │
│  └─────────────┘      └──────────────────┘                 │
│                               │                              │
│                               ▼                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              AGENT BRIDGE (NEW)                       │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │  loadAgentDefinition(agentId: string)        │   │   │
│  │  │  → Parses .md file (YAML + markdown)        │   │   │
│  │  │  → Extracts metadata & system prompt        │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │  buildSystemPrompt(agentDef: AgentDefinition)│   │   │
│  │  │  → Constructs full behavioral prompt        │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │  invokeAgent(agentId: string, task: string)  │   │   │
│  │  │  → Loads agent definition                    │   │   │
│  │  │  → Builds system prompt                      │   │   │
│  │  │  → Invokes Task tool with full context       │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
│                               │                              │
│                               ▼                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              agents-lib/                             │    │
│  │  plugins/*/agents/*.md (177 full agent definitions) │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Components

#### 1. Agent Definition Loader

```typescript
// src/agent-bridge/AgentDefinitionLoader.ts

export interface AgentDefinition {
  // Metadata from YAML frontmatter
  name: string;
  description: string;
  model: 'opus' | 'sonnet' | 'haiku' | 'inherit';
  tools: string[];
  color: string;

  // Full behavioral content
  systemPrompt: string;

  // Source information
  plugin: string;
  filePath: string;

  // Cached for performance
  loadedAt: Date;
}

export class AgentDefinitionLoader {
  private cache: Map<string, AgentDefinition> = new Map();
  private agentsLibPath: string;

  /**
   * Load full agent definition from .md file
   */
  async loadAgentDefinition(agentId: string): Promise<AgentDefinition> {
    // Check cache first
    if (this.cache.has(agentId)) {
      return this.cache.get(agentId)!;
    }

    // Map ultra:agent-name to agent-name
    const baseName = agentId.replace('ultra:', '');

    // Find the agent file in agents-lib
    const agentPath = await this.findAgentFile(baseName);

    // Parse the file (YAML frontmatter + markdown)
    const definition = await this.parseAgentFile(agentPath);

    // Cache it
    this.cache.set(agentId, definition);

    return definition;
  }

  /**
   * Find agent file in agents-lib plugins
   */
  private async findAgentFile(agentName: string): Promise<string> {
    // Search in agents-lib/plugins/*/agents/*.md
    const globPattern = `**/agents/${agentName}.md`;
    const files = await glob(globPattern, {
      cwd: this.agentsLibPath
    });

    if (files.length === 0) {
      throw new Error(`Agent not found: ${agentName}`);
    }

    // Return first match (should handle duplicates better)
    return path.join(this.agentsLibPath, files[0]);
  }

  /**
   * Parse agent .md file
   */
  private async parseAgentFile(filePath: string): Promise<AgentDefinition> {
    const content = await fs.readFile(filePath, 'utf-8');

    // Extract YAML frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      throw new Error(`Invalid agent file: ${filePath}`);
    }

    const frontmatter = yaml.parse(frontmatterMatch[1]);

    // Extract markdown content (after frontmatter)
    const systemPrompt = content.slice(frontmatterMatch[0].length).trim();

    return {
      name: frontmatter.name,
      description: frontmatter.description,
      model: this.resolveModel(frontmatter.model),
      tools: frontmatter.tools || [],
      color: frontmatter.color,
      systemPrompt,  // THE ACTUAL AGENT BEHAVIOR!
      plugin: this.extractPlugin(filePath),
      filePath,
      loadedAt: new Date()
    };
  }
}
```

#### 2. System Prompt Builder

```typescript
// src/agent-bridge/SystemPromptBuilder.ts

export class SystemPromptBuilder {
  /**
   * Build complete system prompt for agent invocation
   */
  buildSystemPrompt(
    definition: AgentDefinition,
    context: {
      task: string;
      domain: DomainConfig;
      workspace: string;
    }
  ): string {
    const sections = [
      // Agent's core behavioral prompt
      definition.systemPrompt,

      // Domain-specific context
      this.buildDomainContext(context.domain),

      // Workspace context
      this.buildWorkspaceContext(context.workspace),

      // Task-specific context
      this.buildTaskContext(context.task)
    ];

    return sections.filter(s => s).join('\n\n---\n\n');
  }

  private buildDomainContext(domain: DomainConfig): string {
    return `## Domain Context

You are working in the "${domain.name}" domain.

${domain.description}

### Tech Stack
- Language: ${domain.stack.language}
- Framework: ${domain.stack.framework}
- Testing: ${domain.stack.testing}

### Domain Goals
${this.formatGoals(domain.goals || [])}`;
  }

  private buildWorkspaceContext(workspace: string): string {
    return `## Workspace

Workspace path: ${workspace}

### Available Agents
${this.listAvailableAgents(domain.agents)}

### File Ownership Rules
${this.formatOwnershipRules(domain.routing.ownership)}`;
  }

  private buildTaskContext(task: string): string {
    return `## Current Task

${task}

Please execute this task according to your specialized capabilities and the domain context provided above.`;
  }
}
```

#### 3. Agent Invoker

```typescript
// src/agent-bridge/AgentInvoker.ts

export class AgentInvoker {
  private loader: AgentDefinitionLoader;
  private promptBuilder: SystemPromptBuilder;

  /**
   * Invoke an agent with full behavioral context
   */
  async invokeAgent(
    agentId: string,
    task: string,
    context: {
      domain: DomainConfig;
      workspace: string;
    }
  ): Promise<string> {
    // 1. Load full agent definition
    const definition = await this.loader.loadAgentDefinition(agentId);

    // 2. Build complete system prompt
    const systemPrompt = this.promptBuilder.buildSystemPrompt(definition, {
      task,
      domain: context.domain,
      workspace: context.workspace
    });

    // 3. Determine model tier
    const model = this.resolveModel(definition.model, context.domain);

    // 4. Invoke Task tool with full context
    const result = await this.invokeTaskTool({
      subagent_type: this.mapModelToSubagent(model),
      prompt: systemPrompt,
      description: `${definition.name}: ${task}`
    });

    return result.message;
  }

  private async invokeTaskTool(options: {
    subagent_type: string;
    prompt: string;
    description: string;
  }): Promise<any> {
    // Use the Task tool to spawn the agent
    return await Task({
      description: options.description,
      prompt: options.prompt,
      subagent_type: options.subagent_type
    });
  }

  private resolveModel(
    agentModel: string,
    domain: DomainConfig
  ): 'opus' | 'sonnet' | 'haiku' {
    if (agentModel !== 'inherit') {
      return agentModel;
    }

    // Domain-specific defaults
    const domainDefaults: Record<string, any> = {
      'architecture': 'opus',
      'quality': 'sonnet',
      'software-dev': 'sonnet'
    };

    return domainDefaults[domain.type] || 'sonnet';
  }
}
```

### Usage Examples

#### Before (Current - Missing Behavior)

```typescript
// Just a catalog entry
const agent = AGENT_CATALOG['ultra:backend-architect'];
console.log(agent.description);  // "Expert backend architect..."

// No actual behavioral instructions!
// When invoked, agent has NO specialized knowledge
```

#### After (With Agent Bridge - Full Behavior)

```typescript
// Load full agent definition
const definition = await loader.loadAgentDefinition('ultra:backend-architect');

console.log(definition.systemPrompt);
// Returns:
// "You are a backend system architect specializing in...
//
// ## Core Philosophy
// Design backend systems with clear boundaries...
//
// ## Capabilities
// ### API Design & Patterns
// - RESTful APIs: Resource modeling, HTTP methods...
// - GraphQL APIs: Schema design, resolvers...
// [100+ lines of specialized knowledge]
//
// ## Best Practices
// [Specific protocols and guidelines]
// "

// Invoke with full behavioral context
const result = await invoker.invokeAgent('ultra:backend-architect', task, {
  domain: currentDomain,
  workspace: process.cwd()
});

// Agent now has ALL its specialized knowledge and behavior!
```

### Integration Points

#### 1. Domain Initializer

```typescript
// src/domain/DomainInitializer.ts

import { AgentInvoker } from './agent-bridge/AgentInvoker.js';

export class DomainInitializer {
  private agentInvoker: AgentInvoker;

  async initializeAgent(agentName: string): Promise<void> {
    // Load full agent definition
    const definition = await this.loader.loadAgentDefinition(agentName);

    // Agent now has complete behavioral context
    // Not just name/description!
  }
}
```

#### 2. Autoloop Daemon

```typescript
// src/domain/AutoloopDaemon.ts

export class AutoloopDaemon {
  async processTask(task: Task): Promise<void> {
    // Determine which agent should handle this task
    const agentId = this.routeTaskToAgent(task);

    // Invoke agent with FULL behavioral context
    const result = await this.agentInvoker.invokeAgent(agentId, task.description, {
      domain: this.domain,
      workspace: this.workspacePath
    });
  }
}
```

#### 3. Ultra-Domain-Setup

```bash
# When user selects agents during domain setup
/ultra-domain-setup

# System loads full agent definitions, not just metadata
# User sees:
# ✓ ultra:backend-architect - Expert backend architect with 50+ API patterns,
#   40+ microservices patterns, full behavioral protocols loaded
```

## Benefits

### 1. Preserves Specialized Knowledge
- ✅ 100+ lines of specialized behavior per agent
- ✅ Domain-specific patterns and best practices
- ✅ Detailed protocols and workflows

### 2. Maintains Modularity
- ✅ Agents remain as separate, editable `.md` files
- ✅ Easy to update individual agents
- ✅ Clear separation of concerns

### 3. Enables True Expertise
- ✅ backend-architect has actual backend architecture knowledge
- ✅ team-lead has actual team orchestration protocols
- ✅ security-reviewer has actual security review checklist

### 4. Backward Compatible
- ✅ AGENT_CATALOG still works for discovery
- ✅ Domain initializer unchanged
- ✅ Just adds behavioral depth

## Implementation Plan

### Phase 1: Core Bridge (1-2 days)
1. Create `src/agent-bridge/AgentDefinitionLoader.ts`
2. Create `src/agent-bridge/SystemPromptBuilder.ts`
3. Create `src/agent-bridge/AgentInvoker.ts`
4. Add unit tests

### Phase 2: Integration (1 day)
1. Update AutoloopDaemon to use AgentInvoker
2. Update DomainInitializer to load full definitions
3. Update CLI to show agent "depth" indicator

### Phase 3: Enhancement (1 day)
1. Add agent definition caching
2. Add hot-reload for agent updates
3. Add agent definition validation
4. Performance optimization

### Phase 4: Documentation (0.5 day)
1. Document bridge architecture
2. Add agent creation guide
3. Update domain setup guide

## Risk Assessment

### Low Risk
- ✅ Backward compatible
- ✅ Can roll back easily
- ✅ No breaking changes

### Medium Risk
- ⚠️ Performance impact of loading 109 agent definitions
- ⚠️ Cache invalidation if agents change
- ⚠️ Memory usage

### Mitigation
- Cache agent definitions in memory
- Lazy load on first use
- Validate agent definitions on load
- Monitor memory usage

## Recommendation

**YES - Implement the Agent Bridge**

Without it, we have:
- ❌ Agent names without behavior
- ❌ Metadata without expertise
- ❌ Catalog without capability

With it, we have:
- ✅ Full agent behavioral context
- ✅ True specialized knowledge
- ✅ Real expert agents

**The bridge is essential for UltraPilot to be a true autonomous agency framework.**

---

**Status**: Proposal
**Priority**: HIGH
**Estimated Effort**: 3-4 days
**Impact**: Enables true agent expertise and specialization
