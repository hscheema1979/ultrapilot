# UltraX Frontend Architecture Design

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER LAYER                              │
├───────────────────────────┬───────────────────────────────────┤
│      Web UI (Port 3000)    │     Google Chat Interface        │
│  React + TypeScript App    │     Google Chat Bot              │
│  - Monaco Editor           │     - Interactive Cards           │
│  - Socket.IO Client        │     - Button Actions              │
│  - Real-time Updates       │     - File Attachments            │
└───────────┬───────────────┴───────────────┬───────────────────┘
            │                               │
            │ WebSocket                    │ HTTP Webhook
            │                               │
┌───────────▼───────────────────┬───────────▼───────────────────┐
│              Socket.IO Server  │      UltraX Gateway API       │
│              (Port 3000)       │          (Port 3001)           │
│  - Session Management         │  - Message Routing             │
│  - WebSocket Handling         │  - Agent Orchestration         │
│  - File Upload                │  - State Management            │
│  - Authentication            │  - Google Chat Integration     │
└───────────┬───────────────────┴───────────────┬───────────────┘
            │                                   │
            │        Shared State Layer         │
            └───────────┬───────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────▼──────┐ ┌─────▼─────┐ ┌─────▼──────┐
│  Redis Cache │ │ PostgreSQL│ │ File Store │
│ (Sessions)   │ │ (History) │ │ (Workspace)│
└──────────────┘ └───────────┘ └────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────▼──────┐ ┌─────▼─────┐ ┌─────▼──────┐
│ Claude Code  │ │Ultrapilot  │ │ Google     │
│ Agent SDK    │ │ Plugin     │ │ Workspace  │
│              │ │ (29 agents)│ │ API        │
└──────────────┘ └───────────┘ └────────────┘
```

---

## Component 1: Web UI (Port 3000)

### 1.1 Frontend Application

**Tech Stack:**
- **Framework:** React 18.2 + TypeScript 5.0
- **Build Tool:** Vite 4.3
- **State Management:** Zustand 4.3
- **UI Library:** shadcn/ui (Radix UI + Tailwind)
- **Real-time:** Socket.IO Client 4.6
- **Code Editor:** Monaco Editor 0.38
- **Routing:** React Router 6.10

**Project Structure:**
```
web-ui/
├── src/
│   ├── components/
│   │   ├── Chat/
│   │   │   ├── MessageList.tsx
│   │   │   ├── MessageInput.tsx
│   │   │   ├── ToolApproval.tsx
│   │   │   └── AgentStatus.tsx
│   │   ├── Editor/
│   │   │   ├── MonacoEditor.tsx
│   │   │   ├── FileTree.tsx
│   │   │   └── TabManager.tsx
│   │   ├── Layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── ResizablePanels.tsx
│   │   └── Shared/
│   │       ├── ThemeToggle.tsx
│   │       ├── Notifications.tsx
│   │       └── ErrorBoundary.tsx
│   ├── hooks/
│   │   ├── useWebSocket.ts
│   │   ├── useSession.ts
│   │   ├── useAgents.ts
│   │   └── useFiles.ts
│   ├── store/
│   │   ├── sessionStore.ts
│   │   ├── messageStore.ts
│   │   ├── agentStore.ts
│   │   └── uiStore.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── socket.ts
│   │   └── auth.ts
│   ├── types/
│   │   ├── session.ts
│   │   ├── message.ts
│   │   └── agent.ts
│   ├── App.tsx
│   └── main.tsx
├── public/
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

### 1.2 Socket.IO Server (Node.js)

**Tech Stack:**
- **Runtime:** Node.js 18+
- **Framework:** Express 4.18
- **WebSocket:** Socket.IO 4.6
- **Authentication:** Passport.js + JWT
- **File Upload:** Multer
- **Session Storage:** Redis 7.0

**Server Structure:**
```
socket-server/
├── src/
│   ├── server.ts              # Express + Socket.IO server
│   ├── socket/
│   │   ├── handlers.ts        # Socket event handlers
│   │   ├── middleware.ts      # Auth middleware
│   │   └── events.ts          # Event definitions
│   ├── api/
│   │   ├── session.ts         # Session REST API
│   │   ├── files.ts           # File operations
│   │   └── auth.ts            # Authentication
│   ├── services/
│   │   ├── ClaudeCode.ts      # Claude Code SDK wrapper
│   │   ├── Ultrapilot.ts      # Ultrapilot plugin wrapper
│   │   ├── Session.ts         # Session management
│   │   └── FileService.ts     # File operations
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── cors.ts
│   │   └── validation.ts
│   └── types/
│       └── index.ts
├── redis/
│   └── session.ts             # Redis session store
└── package.json
```

### 1.3 Key Features Implementation

**Real-time Communication:**
```typescript
// WebSocket Events
socket.on('message', (data) => {
  store.dispatch(addMessage(data));
});

socket.on('agent:update', (data) => {
  store.dispatch(updateAgentStatus(data));
});

socket.on('tool:approval', (data) => {
  showApprovalDialog(data);
});
```

**Code Editor Integration:**
```typescript
// Monaco Editor with Claude Code context
const MonacoEditor = () => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();

  const executeCode = async (code: string) => {
    socket.emit('claude:execute', { code, filePath: currentFile });
  };

  return <Monaco editorRef={editorRef} />;
};
```

**Session Management:**
```typescript
// Zustand store
const useSessionStore = create<SessionState>((set) => ({
  sessions: [],
  activeSession: null,
  createSession: async () => {
    const session = await api.createSession();
    set({ activeSession: session });
  },
  pauseSession: async (id) => {
    await api.pauseSession(id);
    set((state) => ({
      sessions: state.sessions.map(s =>
        s.id === id ? { ...s, status: 'paused' } : s
      )
    }));
  }
}));
```

---

## Component 2: Google Chat Integration

### 2.1 Google Chat Bot

**Tech Stack:**
- **Platform:** Google Chat API
- **Authentication:** Google Workspace Service Account
- **Deployment:** Cloud Run or App Engine
- **Database:** Firestore (for conversation history)

**Bot Structure:**
```
google-chat-bot/
├── src/
│   ├── bot.ts                 # Main bot entry point
│   ├── handlers/
│   │   ├── command.ts         # Command parsing & routing
│   │   ├── approval.ts        # Tool approval handling
│   │   └── file.ts            # File attachment handling
│   ├── cards/
│   │   ├── response.ts        # Response card builder
│   │   ├── approval.ts        # Approval card builder
│   │   └── status.ts          # Status card builder
│   ├── services/
│   │   ├── ClaudeCode.ts      # Claude Code SDK wrapper
│   │   ├── Ultrapilot.ts      # Ultrapilot plugin wrapper
│   │   └── Storage.ts         # Firestore storage
│   └── types/
│       └── index.ts
├── firebase.json             # Firebase config
├── cloudbuild.yaml           # Cloud Build config
└── package.json
```

### 2.2 Card-Based UI Design

**Response Card:**
```typescript
{
  "cards": [
    {
      "header": {
        "title": "UltraX Response",
        "subtitle": "ultra:analyst",
        "imageUrl": "https://example.com/icon.png"
      },
      "sections": [
        {
          "widgets": [
            {
              "textParagraph": {
                "text": "I've analyzed the requirements..."
              }
            },
            {
              "buttonList": {
                "buttons": [
                  {
                    "text": "View Details",
                    "onClick": {
                      "openLink": {
                        "url": "https://web-ui.ultrax.io/session/123"
                      }
                    }
                  },
                  {
                    "text": "Approve Tool",
                    "onClick": {
                      "action": {
                        "actionMethodName": "approve_tool",
                        "parameters": [
                          { "key": "toolId", "value": "read_file" }
                        ]
                      }
                    }
                  }
                ]
              }
            }
          ]
        }
      ]
    }
  ]
}
```

### 2.3 Webhook Handlers

**Command Processing:**
```typescript
async function handleCommand(event: GoogleChatEvent) {
  const text = event.message.text;
  const command = parseCommand(text);

  switch (command.type) {
    case 'ultrapilot':
      return await executeUltrapilot(command.args);
    case 'ultra-team':
      return await executeTeam(command.args);
    case 'status':
      return await getStatus(event.user);
    default:
      return await sendToClaudeCode(text);
  }
}
```

---

## Component 3: UltraX Gateway API (Port 3001)

**Already exists** - needs enhancements:

1. **WebSocket Support** - Add Socket.IO server
2. **File Upload Endpoints** - Add multipart/form-data handling
3. **Session Persistence** - Add Redis integration
4. **Authentication** - Add JWT validation

---

## Data Flow

### User Message Flow

```
User (Web UI)
  ↓ Type message
React App
  ↓ Capture input
Socket.IO Client
  ↓ Emit 'message' event
Socket.IO Server (3000)
  ↓ Validate & Forward
UltraX Gateway API (3001)
  ↓ Route to appropriate handler
Claude Code SDK / Ultrapilot
  ↓ Process
Agent Response
  ↓ Format response
UltraX Gateway API
  ↓ Broadcast update
Socket.IO Server
  ↓ Emit 'message' event
Socket.IO Client
  ↓ Update UI
React App
  ↓ Display message
User (Web UI)
```

### Google Chat Message Flow

```
User (Google Chat)
  ↓ @UltraX command
Google Chat API
  ↓ HTTP POST webhook
UltraX Gateway (3001)
  ↓ Parse command
Claude Code SDK / Ultrapilot
  ↓ Process
Agent Response
  ↓ Format card
UltraX Gateway
  ↓ HTTP POST response
Google Chat API
  ↓ Display card
User (Google Chat)
```

---

## Security Architecture

### Authentication Flow

**Web UI:**
```
1. User visits web UI
2. Redirect to Google OAuth 2.0
3. User grants permission
4. Google redirects back with code
5. Server exchanges code for JWT
6. Client stores JWT
7. Client sends JWT with each request
8. Server validates JWT
```

**Google Chat:**
```
1. User sends message in Google Chat
2. Google Chat validates user identity
3. Google Chat sends webhook with user info
4. Server validates user is authorized
5. Server processes request
```

### Authorization Model

**Roles:**
- **Admin:** Full access, can manage users
- **User:** Can use all features
- **Viewer:** Read-only access

**Permissions:**
- Execute Ultrapilot commands
- Approve tool usage
- Access workspace files
- View session history

---

## Deployment Architecture

### Development Environment
```yaml
services:
  web-ui:
    build: ./web-ui
    ports: ["3000:3000"]
    environment:
      - VITE_API_URL=http://localhost:3001
      - VITE_WS_URL=ws://localhost:3000

  socket-server:
    build: ./socket-server
    ports: ["3000:3000"]
    depends_on:
      - redis
      - ultrax-gateway
    environment:
      - REDIS_URL=redis://redis:6379
      - ULTRAX_API_URL=http://ultrax-gateway:3001

  ultrax-gateway:
    build: ./ultrapilot
    ports: ["3001:3001"]
    environment:
      - HOST=0.0.0.0
      - PORT=3001

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
```

### Production Deployment

**Web UI + Socket Server:**
- **Platform:** Vercel (Web UI) + Railway/Render (Socket Server)
- **CDN:** Vercel Edge Network
- **SSL:** Automatic TLS certificates

**UltraX Gateway:**
- **Platform:** Railway/Render/DigitalOcean
- **CDN:** CloudFlare (optional)
- **SSL:** Let's Encrypt

**Google Chat Bot:**
- **Platform:** Google Cloud Run
- **Domain:** bots.google.com
- **SSL:** Built-in

---

## Monitoring & Observability

### Metrics to Track
- Request latency (p50, p95, p99)
- WebSocket connection count
- Message throughput
- Error rates
- Agent execution time
- Session duration

### Logging Strategy
- Structured logging (JSON)
- Log levels: ERROR, WARN, INFO, DEBUG
- Centralized logging: Cloud Logging / Datadog

### Health Checks
- `/health` endpoint (ping)
- `/health/deep` (dependencies check)
- `/health/metrics` (expose metrics)

---

## Success Metrics

1. **Web UI replaces Relay** - All Relay features available
2. **Google Chat responsive** - < 2s response time
3. **Zero data loss** - No messages lost during failover
4. **99.9% uptime** - < 43min downtime/month
5. **User satisfaction** - Positive feedback on UX

---

**Next Phase:** Implementation Planning by ultra:planner
