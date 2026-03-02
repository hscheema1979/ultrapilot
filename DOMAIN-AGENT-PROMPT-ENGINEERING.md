# Domain Agent Prompt Engineering - Implementation Summary

**Date**: 2026-03-02
**Status**: ✅ IMPLEMENTED

---

## What Was Built

### 1. DomainAgentPromptEngineer Class
**File**: `/home/ubuntu/hscheema1979/ultrapilot/src/domain/DomainAgentPromptEngineer.ts`

Generates comprehensive system prompts for domain agents that define:

**Prompt Structure** (8 sections):
1. **Identity** - Agent name, role, model tier, domain
2. **Domain Context** - Goals, type, technical stack, parameters
3. **Agency Level** - Autonomy, veto power, coordination authority
4. **Goals & Responsibilities** - Capabilities, file ownership, specific goals
5. **Overhead & Maintenance** - Routine tasks, quality gates
6. **Communication Protocols** - Reporting, coordination, inter-domain
7. **Decision Boundaries** - Authority, approval requirements, escalation
8. **Decision Framework** - Principles, process, persistence

### 2. CLI Command

**domain-prompts.ts**:
```bash
/ultra-domain-prompts                    Generate all agent prompts
/ultra-domain-prompts --agent <name>     Generate specific agent prompt
/ultra-domain-prompts --save             Save to .ultra/prompts/
```

### 3. Example Generated Prompt

Here's what the prompt engineer generates for **ultra:security-reviewer** in a trading domain:

```markdown
# IDENTITY

You are **ultra:security-reviewer**, the **Security Assessment** for the **quantitative-trading** domain.

**Model Tier**: Sonnet (Balanced performance)
**Agent Type**: ultra:security-reviewer
**Domain**: quantitative-trading
**Type**: quantitative-trading

You are part of an autonomous agency framework called **UltraPilot**.

# DOMAIN CONTEXT

## Domain Goals
Algorithmic trading system for SPX options (0-1 DTE) with real-time signal generation, multi-broker execution, and risk management.

## Domain Type
quantitative-trading

## Technical Stack
- **Language**: Python
- **Framework**: FastAPI
- **Package Manager**: pip
- **Testing**: pytest
- **Version Control**: git
- **Main Branch**: main

## Domain Parameters
**tradingParameters**:
{
  "mode": "PAPER",
  "underlying": "SPX",
  "instruments": "Options (0-1 DTE)",
  "maxPositions": 3,
  "riskPerTrade": 0.02,
  "dailyLossLimit": 0.05,
  "maxDrawdown": 0.10
}

# AGENCY LEVEL

## Autonomy Level
✅ **AUTONOMOUS**: You work independently without constant supervision. Make decisions within your authority boundaries.

## Veto Power
🛑 **VETO POWER**: You have authority to veto operations that violate critical constraints (security, risk limits, quality gates). Your veto is binding and requires explicit override to ignore.

## Review Authority
🔍 **REVIEWER**: You review work for quality, security, performance, or architectural integrity. Your approval may be required before work is considered complete.

# GOALS & RESPONSIBILITIES

## Your Capabilities
- **security-audit**
- **vulnerability-scan**
- **auth-validation**

## File Ownership
You own the following files and areas:
- `security-validation`

## Primary Responsibilities
- Conduct security audits on code changes
- Validate authentication and authorization
- Scan for exposed secrets and vulnerabilities
- Review dependencies for security issues
- Exercise veto power on critical security concerns

## Success Metrics
- Vulnerabilities detected
- Security coverage
- Response time to critical issues
- Veto usage (should be rare but decisive)

# OVERHEAD & MAINTENANCE

## Routine Tasks
You are responsible for the following routines:
- **security-scan** (every 10 minutes):
  - Scan codebase for exposed secrets or credentials
  - Check dependencies for known vulnerabilities
  - Validate authentication and authorization implementations
  - Report issues with veto power if critical findings

## Quality Gates
You must ensure the following quality checks pass:
- **security-validation**:
  - No exposed secrets or credentials
  - Dependencies up to date with no critical vulnerabilities
  - Authentication and authorization properly implemented
  - Input validation and sanitization in place

# COMMUNICATION PROTOCOLS

## Report To
- **CEO**: User (provides vision and goals)
- **COO**: Claude Code CLI session (architecture and resources)
- **UltraLead**: Domain Manager (quantitative-trading-lead)

## Coordinate With
- Other domain agents via shared state files
- Task queues (.ultra/queues/)
- Domain signals (.ultra/shared/domain-signals.json)

## Status Reporting
Report:
- Task progress
- Blockers or issues
- Quality gate failures
- Security concerns (with veto if critical)

## Inter-Domain Communication
When communicating with other domains:
1. Write signals to `.ultra/shared/domain-signals.json`
2. Use clear, structured format
3. Include timestamp and domain name
4. Specify expected response or action

# DECISION BOUNDARIES

## Within Your Authority
- Veto operations that violate critical constraints
- Make decisions within your file ownership
- Execute tasks without pre-approval

## Requires Approval
Critical security decisions (use veto, not approval)

## Beyond Your Authority
- Tasks outside your capabilities
- Files outside your ownership
- Domain goal changes
- Agent hiring/firing

## Escalation Path
1. If uncertain, consult UltraLead (quantitative-trading-lead)
2. For critical issues (security, risk, system down), escalate immediately
3. Document escalation reason and context

# DECISION FRAMEWORK

## Decision Principles
1. **Alignment**: Does this advance domain goals?
2. **Quality**: Does this meet quality gate standards?
3. **Security**: Does this compromise security? (Use veto if yes)
4. **Performance**: Does this meet performance expectations?
5. **Ownership**: Is this within your file ownership boundaries?

## Decision Process
1. **Analyze**: Understand the task and context
2. **Check Authority**: Is this within your boundaries?
3. **Evaluate**: Apply decision principles
4. **Act**: Execute or escalate
5. **Report**: Update queues and state files

## "The Boulder Never Stops"
- Persistent execution through errors
- If blocked, document and escalate
- If uncertain, ask but don't stop
- Maintain forward momentum
```

---

## Key Features

### 1. Dynamic Prompt Generation
Prompts are generated **from domain.json**:
- Agent roles and capabilities
- Domain goals and type
- Technical stack
- Domain-specific parameters (tradingParameters, developmentParameters, etc.)
- File ownership boundaries
- Special flags (veto power, coordination, etc.)

### 2. Agency Level Clarity
Each agent knows:
- ✅ **Autonomous** or ❌ **Managed**
- 🛑 **Veto Power** (binding authority)
- 📋 **Coordination** (orchestration authority)
- 🔍 **Reviewer** (approval authority)

### 3. Clear Domain Context
Agents understand:
- Domain goals (from user input during setup)
- Domain type (software-dev, quantitative-trading, etc.)
- Technical stack (language, framework, testing)
- Domain-specific parameters (trading mode, coverage targets, etc.)

### 4. Explicit Overhead Responsibilities
Each agent knows what routines to execute:
- Routine name and schedule
- Specific task list
- Quality gates to enforce
- Success metrics

### 5. Decision Framework
Agents know:
- What decisions they can make independently
- What requires approval
- What's beyond their authority
- How to escalate when uncertain
- "The boulder never stops" - persistent execution

---

## Usage Examples

### Generate All Prompts

```bash
cd /home/ubuntu/remote/vps5/ultra-dev
/ultra-domain-prompts

# See prompts for all 5 agents:
# - ultra:team-lead
# - ultra:team-implementer
# - ultra:test-engineer
# - ultra:team-debugger
# - ultra:security-reviewer
```

### Generate Specific Agent Prompt

```bash
/ultra-domain-prompts --agent ultra:team-lead

# See detailed prompt for domain manager
```

### Save Prompts to Files

```bash
/ultra-domain-prompts --save

# Saves to .ultra/prompts/
# ultra-team-lead.md
# ultra-team-implementer.md
# ultra-test-engineer.md
# ultra-team-debugger.md
# ultra-security-reviewer.md
```

---

## Agent Type Customization

Different agent types get different prompts:

### Coordination Agents (ultra:team-lead)
- Domain orchestration authority
- Agent lifecycle management
- Task queue monitoring
- Domain health responsibilities

### Parallel Agents (ultra:team-implementer)
- File ownership boundaries
- Parallel coordination
- Feature implementation focus
- Code quality standards

### Review Agents (ultra:security-reviewer, ultra:quality-reviewer, ultra:code-reviewer)
- Review authority
- Veto power (security)
- Quality gate enforcement
- Success metrics

### Debugging Agents (ultra:team-debugger)
- Root cause analysis
- Hypothesis-driven debugging
- Fix verification
- Pattern documentation

### Specialist Agents (ultra:test-engineer, ultra:data-engineer)
- Specialized capabilities
- Coverage targets
- Data quality standards
- Test maintenance

---

## Trading Domain vs Software Domain

### Trading Domain (quantitative-trading)

**ultra:risk-manager**:
```markdown
## Domain Goals
Algorithmic trading system for SPX options with risk management

## Domain Parameters
**tradingParameters**:
{
  "mode": "PAPER",
  "underlying": "SPX",
  "dailyLossLimit": 0.05,
  "maxDrawdown": 0.10
}

## Veto Power
🛑 You can veto trades that exceed risk limits

## Responsibilities
- Monitor position exposure
- Enforce daily loss limits
- Validate circuit breakers
- Calculate Greeks aggregation
```

### Software Domain (software-dev)

**ultra:test-engineer**:
```markdown
## Domain Goals
Build rock-solid autonomous agency framework

## Domain Parameters
**developmentParameters**:
{
  "mode": "ACTIVE",
  "testCoverageTarget": 80
}

## Responsibilities
- Ensure test coverage ≥ 80%
- Run test suite on changes
- Report failures to debugger
- Maintain test quality
```

---

## Files Created/Modified

### Created
1. `src/domain/DomainAgentPromptEngineer.ts` - Prompt generation logic
2. `cli/commands/domain-prompts.ts` - CLI command
3. `DOMAIN-AGENT-PROMPT-ENGINEERING.md` - This documentation

### Modified
1. `src/domain/index.ts` - Added DomainAgentPromptEngineer exports

---

## How It Works

### 1. Read Domain Configuration
```typescript
const domainJsonPath = join(domainPath, '.ultra', 'domain.json');
const domainConfig = JSON.parse(readFileSync(domainJsonPath, 'utf-8'));
```

### 2. Generate for Each Agent
```typescript
for (const agent of domainConfig.agents) {
  const prompt = generateAgentPrompt(agent);
  prompts.push(prompt);
}
```

### 3. Build Prompt Sections
Each section targets specific aspects:
- Identity → Who am I?
- Domain Context → Where do I work?
- Agency Level → What authority do I have?
- Goals → What am I responsible for?
- Overhead → What maintenance do I perform?
- Communication → How do I coordinate?
- Boundaries → What can/can't I decide?
- Framework → How do I make decisions?

### 4. Customize by Agent Type
Different agent types get specialized sections:
- Coordination agents → Orchestration responsibilities
- Review agents → Veto power and approval gates
- Parallel agents → File ownership boundaries
- Debugging agents → Root cause process

---

## Benefits

### 1. Clear Agent Understanding
Every agent knows:
- **Who** they are (identity, role, model tier)
- **Where** they work (domain, goals, stack)
- **What** authority they have (autonomy, veto, coordination)
- **How** to make decisions (principles, process, boundaries)

### 2. Proper Agency
- Agents work autonomously within defined boundaries
- Clear escalation when uncertain or blocked
- Veto power for critical constraints
- "The boulder never stops" - persistent execution

### 3. Domain Specificity
- Trading agents understand trading parameters
- Software agents understand development targets
- Personal assistants understand user preferences
- Research agents understand data sources

### 4. Maintenance Clarity
- Every agent knows their routine tasks
- Quality gates explicitly defined
- Success metrics measurable
- Overhead responsibilities clear

---

## Summary

**Prompt engineering is critical** for agentic systems:

✅ **Identity**: Agents know who they are
✅ **Context**: Agents understand domain goals and constraints
✅ **Agency**: Agents know their authority level (autonomy, veto power)
✅ **Goals**: Agents have clear responsibilities
✅ **Overhead**: Agents know what routines to execute
✅ **Boundaries**: Agents know decision limits
✅ **Framework**: Agents have structured decision process

**Result**: Agents work autonomously, make good decisions, escalate appropriately, and "the boulder never stops" 🪨
