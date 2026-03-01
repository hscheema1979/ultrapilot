# UltraX - Unified AI Agent System Architecture

**UltraX** = Claude Code Relay + Ultrapilot + Google Chat Integration

A unified system for interacting with autonomous AI agents through multiple interfaces (Web UI, Google Chat, CLI).

## Overview

UltraX provides three interaction modes for the same Ultrapilot agent system:

1. **Web UI** (Claude Code Relay on port 3000)
2. **Google Chat** (Enterprise chat interface)
3. **CLI** (Native Claude Code terminal)

All three interfaces connect to the same Ultrapilot plugin with 29 specialist agents.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     UltraX User Interfaces                  │
├──────────────┬──────────────────────┬───────────────────────┤
│  Web UI      │   Google Chat        │   CLI (Terminal)      │
│  (Port 3000) │   (Enterprise)       │   (Claude Code)        │
│              │                      │                       │
│  - Browser   │   - Chat messages    │   - Command line      │
│  - Real-time │   - Webhooks         │   - Interactive       │
│  - Files     │   - Spaces/Rooms     │   - Git integration   │
└──────┬───────┴──────────┬───────────┴───────────┬───────────┘
       │                  │                       │
       │                  │                       │
       ▼                  ▼                       ▼
┌─────────────────────────────────────────────────────────────┐
│              UltraX Message Router & Gateway                │
│  - Protocol translation (HTTP/Webhook/CLI → Ultrapilot)     │
│  - Session management                                        │
│  - Authentication & authorization                            │
│  - Response routing                                          │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Ultrapilot Plugin                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  29 Specialist Agents                                │   │
│  │  - analyst, architect, planner, executor, reviewers  │   │
│  │  - 6-phase autonomous workflow                       │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  State Management (.ultra/state/)                    │   │
│  │  - autopilot-state.json                              │   │
│  │  - ralph-state.json                                  │   │
│  │  - ultraqa-state.json                                │   │
│  │  - validation-state.json                             │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  HUD System                                           │   │
│  │  - Real-time statusline                              │   │
│  │  - Phase, iterations, QA cycles, agents              │   │
│  └─────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Google Workspace Integration                   │
│  - Drive (file operations)                                  │
│  - Docs (documentation)                                     │
│  - Sheets (data)                                            │
│  - Gmail (notifications)                                    │
│  - Chat (bidirectional messaging)                           │
└─────────────────────────────────────────────────────────────┘
```

## Components

### 1. Claude Code Relay (Web UI)

**Location:** `~/claude-web-interfaces/claude-relay/`
**Status:** ✅ Already running on port 3000

**Current Capabilities:**
- Web interface for Claude Code
- Real-time agent interaction
- File management
- Session management

**Integration Required:**
- Add Ultrapilot commands to Relay UI
- Display HUD in web interface
- Stream agent status updates

### 2. Ultrapilot Plugin

**Location:** `~/.claude/plugins/ultrapilot/`
**Status:** ✅ Complete, on GitHub

**Current Capabilities:**
- 29 specialist agents
- 6-phase autonomous workflow
- State management
- HUD system

**Integration Required:**
- Add message router for multi-interface support
- Create webhook endpoints for Google Chat
- Add session context management

### 3. Google Chat Integration

**Location:** `~/agent-template/database/google-workspace.ts`
**Status:** ✅ Google Workspace API exists

**Current Capabilities:**
- Google Workspace API wrapper
- Supports all Google services (Drive, Docs, Sheets, Gmail, Calendar, Chat, etc.)

**Integration Required:**
- Create Google Chat bot
- Implement webhook server for Chat events
- Bidirectional messaging (user ↔ agents)
- Format agent responses for Chat UI

### 4. UltraX Gateway (NEW)

**Location:** `~/.claude/plugins/ultrapilot/src/gateway.ts`
**Status:** ❌ Needs to be built

**Purpose:** Message router between all interfaces and Ultrapilot

**Responsibilities:**
- Accept messages from Web UI, Google Chat, CLI
- Translate to Ultrapilot commands
- Manage concurrent sessions
- Route responses back to source interface
- Maintain session context across interfaces
- Handle authentication & authorization

## Data Flow

### Web UI Flow

```
User (Browser)
  → HTTP request to Relay (port 3000)
  → UltraX Gateway
  → Ultrapilot Plugin (agents.ts)
  → Agent execution
  → State update (.ultra/state/)
  → Gateway response
  → Relay WebSocket
  → Browser UI update
```

### Google Chat Flow

```
User (Google Chat)
  → @ultrax mention or DM
  → Google Chat webhook
  → UltraX Gateway
  → Ultrapilot Plugin
  → Agent execution
  → State update
  → Gateway response (formatted for Chat)
  → Google Chat API
  → User's Chat interface
```

### CLI Flow

```
User (Terminal)
  → /ultrapilot command
  → Claude Code CLI
  → Ultrapilot Plugin (direct)
  → Agent execution
  → State update
  → CLI output + HUD update
```

## Session Management

**Session Context:**
- Each session has unique ID
- Tracks interface type (web/chat/cli)
- Maintains conversation history
- Stores agent state
- Supports interface switching

**Example Session:**
```json
{
  "sessionId": "sess_abc123",
  "userId": "user@example.com",
  "interface": "google-chat",
  "startTime": "2025-01-09T10:00:00Z",
  "lastActivity": "2025-01-09T10:15:00Z",
  "activeAgents": ["ultra:executor", "ultra:verifier"],
  "currentPhase": "execution",
  "messages": [
    {"from": "user", "content": "@ultrax build me a REST API"},
    {"from": "ultra:analyst", "content": "Analyzing requirements..."}
  ],
  "state": {
    "ultrapilot": ".ultra/state/autopilot-state.json",
    "ralph": ".ultra/state/ralph-state.json"
  }
}
```

## Implementation Plan

### Phase 1: UltraX Gateway (Core Router)

**File:** `~/.claude/plugins/ultrapilot/src/gateway.ts`

```typescript
export interface UltraXMessage {
  sessionId: string;
  userId: string;
  interface: 'web' | 'chat' | 'cli';
  command: string;
  timestamp: Date;
}

export interface UltraXResponse {
  sessionId: string;
  interface: 'web' | 'chat' | 'cli';
  message: string;
  agent?: string;
  phase?: string;
  hud?: string;
}

export class UltraXGateway {
  async handleMessage(message: UltraXMessage): Promise<UltraXResponse> {
    // Route to Ultrapilot
    // Format response for source interface
  }

  async createSession(userId: string, interface: string): Promise<string> {
    // Initialize session
  }

  async switchSession(sessionId: string, targetInterface: string): Promise<void> {
    // Switch between web/chat/cli
  }
}
```

### Phase 2: Google Chat Bot

**File:** `~/.claude/plugins/ultrapilot/src/chat-bot.ts`

**Requirements:**
1. Create Google Chat bot in Google Cloud Console
2. Set up webhook endpoint
3. Implement bidirectional messaging
4. Format agent outputs for Chat UI

**Commands:**
- `@ultrax <task>` - Start Ultrapilot task
- `@ultrax status` - Show current status
- `@ultrax cancel` - Cancel active task
- `@ultrax hud` - Show HUD
- `@ultrax switch web` - Switch to web interface

### Phase 3: Relay Integration

**File:** `~/claude-web-interfaces/claude-relay/lib/ultrapilot.js`

**Requirements:**
1. Add Ultrapilot command buttons to Relay UI
2. Stream agent status updates via WebSocket
3. Display HUD in web interface
4. Support file uploads for Ultrapilot tasks

### Phase 4: Unified CLI

**File:** `~/.claude/skills/ultrax/SKILL.md`

**New Command:** `/ultrax <task>`

**Features:**
- Auto-detect best interface
- Seamless switching between interfaces
- Unified session management
- Cross-interface continuity

## Configuration

**File:** `~/.claude/settings.json`

```json
{
  "enabledPlugins": {
    "ultrapilot@local": true
  },
  "ultraX": {
    "gateway": {
      "port": 3001,
      "sessionTimeout": 3600000
    },
    "interfaces": {
      "web": {
        "enabled": true,
        "url": "http://localhost:3000"
      },
      "googleChat": {
        "enabled": true,
        "projectId": "your-gcp-project",
        "botId": "your-bot-id"
      },
      "cli": {
        "enabled": true
      }
    }
  },
  "statusLine": {
    "type": "command",
    "command": "/home/ubuntu/.claude/hud/ultra-hud.mjs"
  }
}
```

## Security

**Authentication:**
- Web UI: Relay authentication
- Google Chat: Google OAuth
- CLI: Local system auth

**Authorization:**
- User roles (admin, user, viewer)
- Workspace permissions
- Agent access control

**Rate Limiting:**
- Per-user request limits
- Agent resource limits
- Workspace quotas

## Monitoring

**Metrics:**
- Active sessions per interface
- Agent execution time
- Message latency
- Error rates

**Logging:**
- Session logs
- Agent activity logs
- Interface usage logs

## Deployment

**VPS Requirements:**
- Node.js >= 18
- Public IP (for Google Chat webhook)
- SSL certificate (for HTTPS)
- Domain name (optional)

**Steps:**
1. Clone Ultrapilot from GitHub
2. Install dependencies
3. Configure Google Cloud project
4. Set up Google Chat bot
5. Configure UltraX gateway
6. Start services

See `DEPLOYMENT.md` for detailed deployment instructions.

## Benefits

**For Users:**
- Choice of interface (web, chat, CLI)
- Seamless switching between interfaces
- Continuous sessions across interfaces
- Enterprise-friendly (Google Chat)

**For Development:**
- Unified agent system
- Centralized state management
- Easy to add new interfaces
- Scalable architecture

**For Operations:**
- Multi-tenant support
- Monitoring & logging
- Rate limiting & security
- Easy deployment

## Next Steps

1. ✅ Ultrapilot plugin complete
2. ✅ GitHub repository ready
3. ✅ Google Workspace API available
4. ⏳ Build UltraX Gateway
5. ⏳ Create Google Chat bot
6. ⏳ Integrate with Relay
7. ⏳ Test all interfaces
8. ⏳ Deploy to production

## Status

- [x] Ultrapilot plugin
- [x] GitHub repository
- [x] Google Workspace API
- [ ] UltraX Gateway
- [ ] Google Chat bot
- [ ] Relay integration
- [ ] Unified CLI command
- [ ] Testing
- [ ] Documentation
- [ ] Deployment

---

**UltraX: One agent system, multiple interfaces.**
