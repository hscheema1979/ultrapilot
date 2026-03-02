# UltraPilot Agent Integration Guide

## Overview

UltraPilot now provides **29 core agents** + **113 wshobson specialist agents** = **142 total agents** available for autonomous development workflows.

---

## Quick Start

### Initialize UltraPilot with All Agents

```typescript
import { initializeUltraPilot, AGENT_CATALOG } from './src/index.js';

// Initialize with wshobson agents
const totalAgents = await initializeUltraPilot({
  loadWshobson: true,
  wshobsonPluginsDir: './wshobson-agents/plugins'
});

console.log(`Initialized ${totalAgents} agents`);
// Output: Initialized 142 agents (29 ultra + 113 wshobson)
```

---

## Core UltraPilot Agents (29)

### Orchestration (4 agents)
- `ultra:analyst` - Requirements extraction
- `ultra:architect` - System architecture
- `ultra:planner` - Implementation planning
- `ultra:critic` - Plan validation

### Implementation (3 agents)
- `ultra:executor-low` (Haiku) - Simple tasks
- `ultra:executor` (Sonnet) - Standard tasks
- `ultra:executor-high` (Opus) - Complex tasks

### Quality & Testing (2 agents)
- `ultra:test-engineer` - Test strategy
- `ultra:verifier` - Evidence verification

### Review (3 agents)
- `ultra:security-reviewer` - Security audit
- `ultra:quality-reviewer` - Performance review
- `ultra:code-reviewer` - Comprehensive review

### Domain Experts (8 agents)
- `ultra:frontend-expert` - React, Vue, Angular
- `ultra:backend-expert` - Node.js, Python, Go
- `ultra:database-expert` - PostgreSQL, MongoDB, Redis
- `ultra:api-integration-expert` - API contracts, boundaries
- `ultra:kubernetes-architect` - K8s deployments
- `ultra:security-architect` - AuthN/AuthZ, encryption
- `ultra:performance-expert` - Caching, load balancing
- `ultra:testing-expert` - Test strategy, automation

### **Agentic System Experts (6 NEW)** ✨
- `ultra:context-engineer` - Context management, state synchronization
- `ultra:ml-engineer` - ML model development, TensorFlow/PyTorch
- `ultra:mlops-engineer` - ML operations, deployment, monitoring
- `ultra:conductor` - Multi-agent orchestration, workflow coordination
- `ultra:agentic-architect` - Agentic systems design, agent frameworks
- `ultra:prompt-engineer` - Prompt optimization, LLM interaction

### Team Agents (4 agents)
- `ultra:team-lead` - Team orchestration
- `ultra:team-implementer` - Parallel implementation
- `ultra:team-reviewer` - Multi-dimensional review
- `ultra:team-debugger` - Hypothesis-driven debugging

---

## Wshobson Specialist Agents (113)

### Backend Development (5 agents)
- `wshobson:python-pro`
- `wshobson:golang-pro`
- `wshobson:javascript-pro`
- `wshobson:typescript-pro`
- `wshobson:rust-pro`

### Testing & QA (2 agents)
- `wshobson:test-automator`
- `wshobson:tdd-orchestrator`

### DevOps & Infrastructure (5 agents)
- `wshobson:kubernetes-architect`
- `wshobson:cloud-architect`
- `wshobson:terraform-specialist`
- `wshobson:deployment-engineer`
- `wshobson:devops-troubleshooter`

### Database & Data (5 agents)
- `wshobson:database-admin`
- `wshobson:database-architect`
- `wshobson:database-optimizer`
- `wshobson:data-engineer`
- `wshobson:data-scientist`

### Machine Learning & MLOps (2 agents)
- `wshobson:ml-engineer`
- `wshobson:mlops-engineer`

### Context & Orchestration (2 agents)
- `wshobson:context-manager`
- `wshobson:conductor-validator`

### Security (5 agents)
- `wshobson:backend-security-coder`
- `wshobson:frontend-security-coder`
- `wshobson:mobile-security-coder`
- `wshobson:security-auditor`
- `wshobson:malware-analyst`

### Architecture (5 agents)
- `wshobson:backend-architect`
- `wshobson:dotnet-architect`
- `wshobson:design-system-architect`
- `wshobson:monorepo-architect`
- `wshobson:hybrid-cloud-architect`

### SEO Specialists (12 agents)
- `wshobson:seo-authority-builder`
- `wshobson:seo-cannibalization-detector`
- `wshobson:seo-content-auditor`
- `wshobson:seo-content-planner`
- `wshobson:seo-content-refresher`
- `wshobson:seo-content-writer`
- `wshobson:seo-keyword-strategist`
- `wshobson:seo-meta-optimizer`
- `wshobson:seo-snippet-hunter`
- `wshobson:seo-structure-architect`
- And 2 more...

### And 60+ more domain specialists...

---

## How Team Lead Uses These Agents

### 1. Autonomous Agent Selection

The `ultra:team-lead` can now intelligently select from **142 agents** based on task requirements:

```typescript
// Team lead analyzes task and selects appropriate agent
const task = "Implement async Python function with error handling";

// Team lead selects wshobson:python-pro for this task
const selectedAgent = 'wshobson:python-pro';
```

### 2. Parallel Delegation to Specialists

```typescript
// Team lead delegates to multiple specialists in parallel
const delegations = [
  { agent: 'wshobson:python-pro', task: 'Write backend API' },
  { agent: 'wshobson:typescript-pro', task: 'Write frontend types' },
  { agent: 'wshobson:database-architect', task: 'Design schema' },
  { agent: 'wshobson:test-automator', task: 'Write tests' }
];

// Execute in parallel with file ownership boundaries
const results = await delegateParallel(delegations);
```

### 3. Context-Aware Orchestration

```typescript
// Context engineer manages context across all agents
const contextEngineer = AGENT_CATALOG['ultra:context-engineer'];

// Context is optimized and routed between agents
const context = await contextEngineer.optimizeContext({
  agents: ['wshobson:python-pro', 'wshobson:typescript-pro'],
  sharedKnowledge: ['API contracts', 'data models'],
  contextWindow: '200k'
});
```

### 4. ML Pipeline Orchestration

```typescript
// For ML tasks, team lead delegates to ML specialists
const mlPipeline = [
  { agent: 'wshobson:ml-engineer', task: 'Train model' },
  { agent: 'wshobson:mlops-engineer', task: 'Deploy to production' },
  { agent: 'ultra:conductor', task: 'Orchestrate pipeline' }
];

const pipelineResult = await executePipeline(mlPipeline);
```

---

## Agent Categories

### By Domain Expertise

```typescript
import { listAgentsByCategory } from './src/agents.js';

// Get all agentic system specialists
const agenticSystemsAgents = listAgentsByCategory('agentic-systems');
// Returns: [
//   'ultra:context-engineer',
//   'ultra:ml-engineer',
//   'ultra:mlops-engineer',
//   'ultra:conductor',
//   'ultra:agentic-architect',
//   'ultra:prompt-engineer'
// ]
```

### By Model Tier

```typescript
// Opus agents (complex reasoning)
const opusAgents = Object.values(AGENT_CATALOG)
  .filter(agent => agent.model === 'opus')
  .map(agent => agent.name);

// Sonnet agents (balanced)
const sonnetAgents = Object.values(AGENT_CATALOG)
  .filter(agent => agent.model === 'sonnet')
  .map(agent => agent.name);

// Haiku agents (fast, simple tasks)
const haikuAgents = Object.values(AGENT_CATALOG)
  .filter(agent => agent.model === 'haiku')
  .map(agent => agent.name);
```

---

## Usage Examples

### Example 1: Full Stack Feature Development

```typescript
// Team lead orchestrates full-stack development
const task = "Add user authentication feature";

// Team lead breaks down and delegates:
const plan = {
  backend: {
    agent: 'wshobson:python-pro',
    task: 'Implement JWT auth endpoints',
    files: ['backend/auth.py']
  },
  frontend: {
    agent: 'wshobson:typescript-pro',
    task: 'Create login form component',
    files: ['frontend/auth/LoginForm.tsx']
  },
  database: {
    agent: 'wshobson:database-architect',
    task: 'Design user schema',
    files: ['database/schema.sql']
  },
  testing: {
    agent: 'wshobson:test-automator',
    task: 'Write integration tests',
    files: ['tests/auth.test.ts']
  }
};

// Execute in parallel
const results = await executeInParallel(plan);
```

### Example 2: ML Model Development

```typescript
// ML project with agentic orchestration
const mlProject = {
  data: {
    agent: 'wshobson:data-engineer',
    task: 'Build data pipeline',
    files: ['data/pipeline.py']
  },
  model: {
    agent: 'wshobson:ml-engineer',
    task: 'Train TensorFlow model',
    files: ['models/training.py']
  },
  deployment: {
    agent: 'wshobson:mlops-engineer',
    task: 'Deploy to Kubernetes',
    files: ['k8s/deployment.yaml']
  },
  orchestration: {
    agent: 'ultra:conductor',
    task: 'Coordinate ML pipeline',
    coordination: true
  }
};
```

### Example 3: Context Management Across Agents

```typescript
// Context engineer optimizes information flow
const contextPlan = await contextEngineer.designContextFlow({
  agents: [
    'wshobson:python-pro',
    'wshobson:typescript-pro',
    'wshobson:database-architect'
  ],
  shared: ['API schema', 'data models', 'error handling'],
  compression: 'lossless',
  routing: 'hierarchical'
});
```

---

## Discover Available Agents

```bash
# List all agents
npm run discover-agents

# Output shows:
# - 72 plugins
# - 113 wshobson agents
# - Plus 29 core UltraPilot agents
# = 142 total agents
```

---

## Agent Selection Best Practices

### 1. Match Agent to Task Complexity
- **Simple tasks** (type exports, minor fixes): Use Haiku agents
- **Standard tasks** (feature development, refactoring): Use Sonnet agents
- **Complex tasks** (architecture, multi-system integration): Use Opus agents

### 2. Use Domain Specialists
- **Python work**: `wshobson:python-pro`
- **TypeScript work**: `wshobson:typescript-pro`
- **Database design**: `wshobson:database-architect`
- **ML training**: `wshobson:ml-engineer`
- **ML deployment**: `wshobson:mlops-engineer`

### 3. Leverage Agentic System Experts
- **Context optimization**: `ultra:context-engineer`
- **Multi-agent orchestration**: `ultra:conductor`
- **Agentic architecture**: `ultra:agentic-architect`
- **Prompt optimization**: `ultra:prompt-engineer`

### 4. Parallelize When Possible
- Use `ultra:team-lead` to coordinate parallel work
- Use `ultra:team-implementer` for parallel implementation
- Use `ultra:team-reviewer` for multi-dimensional review

---

## Summary

✅ **29 Core UltraPilot agents** (including 6 new agentic system experts)
✅ **113 Wshobson specialist agents** (loaded dynamically)
✅ **142 Total agents available** for autonomous development
✅ **Full team orchestration** with context management and ML support
✅ **Parallel execution** with file ownership boundaries

The team lead now has access to a complete agentic system with domain experts across backend, frontend, ML, MLOps, context management, and orchestration.

