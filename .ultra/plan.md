# UltraX Frontend Implementation Plan

## Overview

Build complete Web UI (React + Socket.IO) and Google Chat bot to replace Relay, providing enterprise-grade redundant communication channels for Claude Code and Ultrapilot agents.

---

## Phase 1: Foundation Setup (Week 1)

### Task 1.1: Project Initialization
**File Owner:** agent-1
**Estimated:** 4 hours

**Deliverables:**
- Initialize Web UI React project with Vite
- Initialize Socket.IO server project
- Initialize Google Chat bot project
- Set up monorepo structure (if needed)
- Configure TypeScript, ESLint, Prettier

**Commands:**
```bash
# Web UI
npm create vite@latest web-ui -- --template react-ts
cd web-ui
npm install zustand socket.io-client @monaco-editor/react
npm install -D tailwindcss postcss autoprefixer

# Socket Server
mkdir socket-server && cd socket-server
npm init -y
npm install express socket.io cors dotenv passport passport-jwt
npm install -D typescript @types/node @types/express

# Google Chat Bot
mkdir google-chat-bot && cd google-chat-bot
npm init -y
npm install googleapis express
npm install -D typescript @types/node
```

**Success Criteria:**
- All projects build without errors
- TypeScript configured correctly
- Dependencies installed

---

### Task 1.2: Development Environment
**File Owner:** agent-1
**Estimated:** 2 hours

**Deliverables:**
- Docker Compose for local development
- Hot-reload configuration
- Environment variable templates
- Local Redis instance
- Mock UltraX Gateway for testing

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  web-ui:
    build: ./web-ui
    ports: ["5173:5173"]
    volumes: ["./web-ui:/app"]
    environment:
      - VITE_API_URL=http://localhost:3001

  socket-server:
    build: ./socket-server
    ports: ["3000:3000"]
    volumes: ["./socket-server:/app"]
    depends_on: [redis]
    environment:
      - REDIS_URL=redis://redis:6379
      - ULTRAX_API_URL=http://localhost:3001
```

**Success Criteria:**
- `docker-compose up` starts all services
- Hot-reload works in Web UI
- Socket Server connects to Redis

---

## Phase 2: Web UI Development (Week 2-3)

### Task 2.1: Core Layout & Theming
**File Owner:** agent-2
**Estimated:** 8 hours

**Files:**
- `web-ui/src/App.tsx`
- `web-ui/src/components/Layout/Header.tsx`
- `web-ui/src/components/Layout/Sidebar.tsx`
- `web-ui/src/components/Layout/ResizablePanels.tsx`
- `web-ui/src/components/Shared/ThemeToggle.tsx`
- `web-ui/src/store/uiStore.ts`

**Features:**
- Responsive layout (desktop, tablet, mobile)
- Dark/light mode toggle
- Resizable split panes (chat | editor)
- Collapsible sidebar
- Keyboard shortcuts

**Success Criteria:**
- Layout renders correctly on all screen sizes
- Theme toggle works
- Panels resize smoothly
- No console errors

---

### Task 2.2: Chat Interface
**File Owner:** agent-2
**Estimated:** 12 hours

**Files:**
- `web-ui/src/components/Chat/MessageList.tsx`
- `web-ui/src/components/Chat/MessageInput.tsx`
- `web-ui/src/components/Chat/ToolApproval.tsx`
- `web-ui/src/components/Chat/AgentStatus.tsx`
- `web-ui/src/hooks/useWebSocket.ts`
- `web-ui/src/store/messageStore.ts`

**Features:**
- Real-time message streaming
- Markdown rendering with syntax highlighting
- Code blocks with copy button
- Tool approval dialogs
- Agent status indicators
- Typing indicators
- Message timestamps

**Success Criteria:**
- Messages appear in real-time
- Code blocks are syntax-highlighted
- Tool approvals work
- Agent status updates live

---

### Task 2.3: Code Editor Integration
**File Owner:** agent-2
**Estimated:** 10 hours

**Files:**
- `web-ui/src/components/Editor/MonacoEditor.tsx`
- `web-ui/src/components/Editor/FileTree.tsx`
- `web-ui/src/components/Editor/TabManager.tsx`
- `web-ui/src/hooks/useFiles.ts`

**Features:**
- Monaco editor with TypeScript/JavaScript support
- File tree with expand/collapse
- Multiple file tabs
- Save file functionality
- Auto-save
- Line numbers
- Minimap
- Search in file

**Success Criteria:**
- Editor loads files correctly
- Syntax highlighting works
- Multiple files can be open
- Save functionality works

---

## Phase 3: Socket.IO Server Development (Week 3-4)

### Task 3.1: Server Setup & WebSocket Handling
**File Owner:** agent-3
**Estimated:** 8 hours

**Files:**
- `socket-server/src/server.ts`
- `socket-server/src/socket/handlers.ts`
- `socket-server/src/socket/middleware.ts`
- `socket-server/src/socket/events.ts`

**Features:**
- Express server with Socket.IO
- CORS configuration
- Socket authentication (JWT)
- Connection lifecycle management
- Room-based communication (per session)

**Events:**
```typescript
// Client → Server
'message:send'
'session:create'
'session:pause'
'session:resume'
'session:terminate'
'file:read'
'file:write'
'file:list'
'tool:approve'
'tool:deny'

// Server → Client
'message:receive'
'agent:update'
'session:update'
'file:changed'
'tool:request'
'error:occurred'
```

**Success Criteria:**
- Server starts without errors
- WebSocket connections work
- Events route correctly
- Authentication works

---

### Task 3.2: UltraX Gateway Integration
**File Owner:** agent-3
**Estimated:** 6 hours

**Files:**
- `socket-server/src/services/ClaudeCode.ts`
- `socket-server/src/services/Ultrapilot.ts`
- `socket-server/src/services/Session.ts`

**Features:**
- Connect to UltraX Gateway API (port 3001)
- Proxy commands to Claude Code
- Stream responses back to client
- Handle agent status updates
- Manage tool approvals

**Success Criteria:**
- Commands reach Claude Code
- Responses stream back
- Agent status updates work

---

### Task 3.3: Session Management
**File Owner:** agent-3
**Estimated:** 6 hours

**Files:**
- `socket-server/src/api/session.ts`
- `redis/session.ts`

**Features:**
- Create, pause, resume, terminate sessions
- Store session state in Redis
- Session history persistence
- Multi-session support
- Session cleanup on disconnect

**Success Criteria:**
- Sessions persist in Redis
- Session state survives server restart
- Multiple sessions work correctly

---

## Phase 4: Google Chat Bot Development (Week 4-5)

### Task 4.1: Bot Setup & Configuration
**File Owner:** agent-4
**Estimated:** 6 hours

**Files:**
- `google-chat-bot/src/bot.ts`
- `google-chat-bot/src/handlers/command.ts`
- `google-chat-bot/firebase.json`

**Features:**
- Google Cloud project setup
- Google Chat API configuration
- Service account authentication
- Webhook endpoint
- Bot verification

**Google Cloud Setup:**
```bash
# Create project
gcloud projects create ultrax-bot

# Enable APIs
gcloud services enable chat.googleapis.com
gcloud services enable cloudfunctions.googleapis.com

# Create service account
gcloud iam service-accounts create ultrax-bot \
  --display-name="UltraX Bot"

# Create and download key
gcloud iam service-accounts keys create ultrax-key.json \
  --iam-account=ultrax-bot@PROJECT_ID.iam.gserviceaccount.com
```

**Success Criteria:**
- Bot appears in Google Chat
- Webhook receives messages
- Authentication works

---

### Task 4.2: Command Parsing & Routing
**File Owner:** agent-4
**Estimated:** 8 hours

**Files:**
- `google-chat-bot/src/handlers/command.ts`
- `google-chat-bot/src/cards/response.ts`
- `google-chat-bot/src/cards/status.ts`

**Features:**
- Parse @UltraX commands
- Route to appropriate handler
- Format responses as cards
- Handle special commands (status, cancel, help)
- Command autocomplete suggestions

**Supported Commands:**
- `@UltraX <task>` - Send to Claude Code
- `@UltraX /ultrapilot <task>` - Run Ultrapilot
- `@UltraX /ultra-team N=3 <task>` - Team mode
- `@UltraX /status` - Session status
- `@UltraX /cancel` - Cancel active mode
- `@UltraX /help` - Show help

**Success Criteria:**
- All commands parse correctly
- Responses appear in chat
- Cards render properly

---

### Task 4.3: Interactive Cards
**File Owner:** agent-4
**Estimated:** 8 hours

**Files:**
- `google-chat-bot/src/cards/approval.ts`
- `google-chat-bot/src/handlers/approval.ts`
- `google-chat-bot/src/cards/progress.ts`

**Features:**
- Tool approval cards with buttons
- Progress indicator cards
- File attachment cards
- Code block formatting
- Error message cards
- Action buttons (Approve, Deny, View Details)

**Card Examples:**

**Tool Approval Card:**
```json
{
  "sections": [{
    "widgets": [
      { "textParagraph": { "text": "Tool: read_file" } },
      { "textParagraph": { "text": "Path: /home/user/project/app.ts" } },
      { "buttonList": {
        "buttons": [
          { "text": "Approve", "onClick": { "action": { "actionMethodName": "approve" } } },
          { "text": "Deny", "onClick": { "action": { "actionMethodName": "deny" } } }
        ]
      }}
    ]
  }]
}
```

**Success Criteria:**
- Approval buttons work
- Progress updates show
- Code blocks formatted

---

## Phase 5: Integration & Testing (Week 5-6)

### Task 5.1: End-to-End Integration
**File Owner:** agent-5
**Estimated:** 10 hours

**Deliverables:**
- Connect Web UI → Socket Server → UltraX Gateway
- Connect Google Chat → UltraX Gateway
- Test message flow end-to-end
- Test session management
- Test failover scenarios

**Integration Tests:**
```typescript
describe('E2E Integration', () => {
  it('should send message from Web UI to Claude Code', async () => {
    const message = 'Hello Claude';
    const response = await sendMessage(message);
    expect(response).toHaveProperty('content');
  });

  it('should sync session between Web UI and Google Chat', async () => {
    const session = await createSession();
    const webStatus = await getWebStatus(session.id);
    const chatStatus = await getChatStatus(session.id);
    expect(webStatus).toEqual(chatStatus);
  });
});
```

**Success Criteria:**
- Messages flow through entire system
- Sessions sync between interfaces
- Failover works correctly

---

### Task 5.2: Testing Suite
**File Owner:** agent-5
**Estimated:** 12 hours

**Deliverables:**
- Unit tests for all components
- Integration tests for WebSocket
- E2E tests with Playwright
- Load tests (100 concurrent users)
- Security tests

**Test Coverage:**
- Web UI: React Testing Library + Vitest
- Socket Server: Jest + Supertest
- Google Chat Bot: Jest + mock APIs
- E2E: Playwright

**Success Criteria:**
- 80%+ code coverage
- All tests passing
- Load tests pass (100 users, 1000 msg/min)

---

## Phase 6: Deployment (Week 6)

### Task 6.1: Production Build
**File Owner:** agent-6
**Estimated:** 4 hours

**Deliverables:**
- Optimized production builds
- Asset optimization
- Environment-specific configs
- Docker images for all services

**Commands:**
```bash
# Web UI
cd web-ui
npm run build

# Socket Server
cd socket-server
npm run build

# Google Chat Bot
cd google-chat-bot
npm run deploy
```

**Success Criteria:**
- Builds complete without errors
- Assets are optimized
- Docker images build successfully

---

### Task 6.2: Infrastructure Setup
**File Owner:** agent-6
**Estimated:** 8 hours

**Deliverables:**
- Vercel deployment (Web UI)
- Railway deployment (Socket Server)
- Google Cloud Run deployment (Chat Bot)
- Redis Cloud (Redis)
- Domain configuration
- SSL certificates
- CDN setup

**Deployment Checklist:**
- [ ] Web UI deployed to Vercel
- [ ] Socket Server deployed to Railway
- [ ] Google Chat Bot deployed to Cloud Run
- [ ] Redis provisioned
- [ ] Domain names configured
- [ ] SSL certificates installed
- [ ] CDN configured
- [ ] Monitoring setup

**Success Criteria:**
- All services deployed
- Services accessible via HTTPS
- Health checks passing

---

## Phase 7: Documentation & Handoff (Week 7)

### Task 7.1: User Documentation
**File Owner:** agent-7
**Estimated:** 6 hours

**Deliverables:**
- User guide for Web UI
- User guide for Google Chat
- Troubleshooting guide
- FAQ
- Video tutorials (optional)

**Documentation Structure:**
```
docs/
├── user-guide.md
├── google-chat-guide.md
├── troubleshooting.md
├── api-reference.md
├── deployment.md
└── faq.md
```

**Success Criteria:**
- All features documented
- Screenshots included
- Step-by-step instructions

---

### Task 7.2: Developer Documentation
**File Owner:** agent-7
**Estimated:** 4 hours

**Deliverables:**
- Architecture overview
- Component documentation
- API documentation
- Contributing guide
- Development setup guide

**Success Criteria:**
- All components documented
- API endpoints documented
- Setup guide works

---

## Risk Mitigation

### Risk 1: WebSocket Connection Issues
**Mitigation:**
- Implement auto-reconnect with exponential backoff
- Provide fallback to HTTP polling
- Monitor connection health

### Risk 2: Google Chat API Limits
**Mitigation:**
- Implement rate limiting
- Cache responses where possible
- Use batch operations

### Risk 3: Session State Loss
**Mitigation:**
- Persist all state to Redis
- Implement session replay from history
- Regular backups

### Risk 4: Performance Degradation
**Mitigation:**
- Load testing before launch
- Horizontal scaling capability
- CDN for static assets
- Redis caching

---

## Success Metrics

### Technical Metrics
- [ ] Web UI loads in < 3s
- [ ] Message latency < 100ms
- [ ] WebSocket reconnect time < 5s
- [ ] Google Chat response time < 2s
- [ ] 99.9% uptime

### User Metrics
- [ ] Zero data loss incidents
- [ ] < 1% error rate
- [ ] Positive user feedback
- [ ] Adoption rate > 80%

### Business Metrics
- [ ] Relay successfully replaced
- [ ] Google Chat adoption > 50%
- [ ] Support ticket reduction
- [ ] User satisfaction score > 4.5/5

---

## Timeline Summary

| Phase | Duration | Owner | Deliverables |
|-------|----------|-------|--------------|
| 1. Foundation | 1 week | agent-1 | Project setup, dev environment |
| 2. Web UI | 2 weeks | agent-2 | Complete React app with chat & editor |
| 3. Socket Server | 2 weeks | agent-3 | WebSocket server with gateway integration |
| 4. Google Chat | 2 weeks | agent-4 | Bot with cards and command handling |
| 5. Integration | 2 weeks | agent-5 | E2E testing and load testing |
| 6. Deployment | 1 week | agent-6 | Production deployment |
| 7. Documentation | 1 week | agent-7 | User and developer docs |

**Total:** 11 weeks

---

## Next Steps

1. **Review and approve** this plan
2. **Set up monorepo** structure
3. **Initialize all projects** (Task 1.1)
4. **Begin Phase 1** implementation

---

**Plan Status:** ✅ Ready for execution
**Estimated Completion:** 11 weeks from start
