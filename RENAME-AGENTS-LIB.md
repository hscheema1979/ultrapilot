# Rename: wshobson → agents-lib

## Summary

Renamed the "wshobson" library to **"agents-lib"** (Agent Library) for clarity.
This makes the purpose obvious to both the UltraPilot team and agentic systems.

---

## Changes Made

### Directory Renames
- `src/wshobson/` → `src/agents-lib/`
- `wshobson-agents/` → `agents-lib/`

### Code Updates

#### `src/agents.ts`
```typescript
// OLD
import('./wshobson/repositories/index.js');
pluginsDir: string = './wshobson-agents/plugins'

// NEW
import('./agents-lib/repositories/index.js');
pluginsDir: string = './agents-lib/plugins'
```

#### `cli/commands/discover-agents.ts`
```typescript
// OLD
import from '../../src/wshobson/repositories/in-memory.js'
'./wshobson-agents/plugins'

// NEW
import from '../../src/agents-lib/repositories/in-memory.js'
'./agents-lib/plugins'
```

---

## New Structure

```
/home/ubuntu/hscheema1979/ultrapilot/
├── src/
│   ├── agents.ts              # Core UltraPilot agents
│   ├── index.ts
│   └── agents-lib/            # ✅ NEW NAME (was wshobson)
│       ├── delegator.ts        # Delegation interface
│       ├── collector.ts        # Agent collector
│       ├── selector.ts         # Agent selector
│       ├── parallel.ts         # Parallel execution
│       ├── repositories/
│       │   └── in-memory.ts    # In-memory registry
│       └── scanner.ts          # Plugin scanner
├── agents-lib/                 # ✅ NEW NAME (was wshobson-agents)
│   └── plugins/                # 113 specialist agents
│       ├── backend-development/
│       ├── frontend-development/
│       ├── machine-learning-ops/
│       └── ... (69 more domains)
└── cli/commands/
    └── discover-agents.ts      # ✅ Updated paths
```

---

## New Terminology

### "agents-lib" = Agent Library
The centralized library of 113 specialist agents that UltraPilot can delegate to.

### Core Agents = UltraPilot Agents
The 29 core orchestrators, domain experts, and team agents in `AGENT_CATALOG`.

### Specialist Agents = agents-lib Agents
The 113 domain specialists loaded from `agents-lib/plugins/`.

---

## Updated Commands

### Discover Agents
```bash
npm run discover-agents
# Scans: ./agents-lib/plugins
# Loads: 113 specialist agents
```

### Initialize UltraPilot
```typescript
import { initializeUltraPilot } from './src/index.js';

const total = await initializeUltraPilot({
  loadWshobson: true,
  wshobsonPluginsDir: './agents-lib/plugins'  // ✅ NEW PATH
});

console.log(`Initialized ${total} agents`);
```

---

## Agent IDs Remain Unchanged

The agent IDs haven't changed, only the internal naming:

**Core UltraPilot Agents:**
- `ultra:team-lead`
- `ultra:context-engineer`
- `ultra:ml-engineer`
- etc.

**Specialist Agents (from agents-lib):**
- `agents-lib:python-pro` (was `wshobson:python-pro`)
- `agents-lib:typescript-pro` (was `wshobson:typescript-pro`)
- `agents-lib:ml-engineer` (was `wshobson:ml-engineer`)
- etc.

---

## Migration Guide

### If You Reference "wshobson" Anywhere

**Old:**
```typescript
import { loadWshobsonAgents } from './agents.js';
await loadWshobsonAgents('./wshobson-agents/plugins');
```

**New:**
```typescript
import { loadWshobsonAgents } from './agents.js';
await loadWshobsonAgents('./agents-lib/plugins');  // ✅ NEW PATH
```

---

## Benefits

✅ **Clear naming** - "agents-lib" immediately conveys purpose
✅ **Team-friendly** - No obscure references to author names
✅ **System-transparent** - Agentic systems understand what it is
✅ **Future-proof** - Generic name allows expansion beyond wshobson

---

## Git Impact

This change requires:
1. Committing the renamed directories
2. Updating documentation to reflect "agents-lib" terminology

All functionality remains identical - only names changed.

