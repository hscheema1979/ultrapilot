# UltraX Frontend Requirements Specification

## Executive Summary

Build **complete frontend interfaces** for UltraX that provide enterprise-grade, redundant communication channels for interacting with Claude Code and the 29 Ultrapilot specialist agents.

**Goal:** Replace existing Relay (port 3000) with a new Web UI and add Google Chat integration, both providing full access to Claude Code via the UltraX Gateway (port 3001).

---

## Functional Requirements

### 1. Web UI (REPLACE Relay on Port 3000)

#### 1.1 Core Functionality
- **Chat Interface:** Real-time conversation with Claude Code
- **Code Display:** Syntax-highlighted code blocks with copy functionality
- **File Operations:** View, edit, create files in the workspace
- **Command History:** Persistent history of commands and responses
- **Session Management:** Start, pause, resume, terminate Claude Code sessions
- **Agent Status:** Show active Ultrapilot agents and their phases
- **Progress Tracking:** Real-time updates on long-running agent tasks

#### 1.2 Claude Code Interactions
- **Natural Language:** Send natural language prompts to Claude Code
- **Ultrapilot Commands:**
  - `/ultrapilot <task>` - Full autonomous execution
  - `/ultra-team N=3 <task>` - Coordinate parallel agents
  - `/ultra-ralph <task>` - Persistent execution loop
  - `/ultra-review <path>` - Multi-dimensional review
  - `/ultra-hud` - Configure HUD
  - `/ultra-cancel` - Cancel active mode
- **Tool Approvals:** Approve/deny Claude Code tool usage requests
- **File Context:** View and select files for Claude Code to analyze
- **Multi-file Support:** Work with multiple files simultaneously

#### 1.3 UI/UX Requirements
- **Responsive Design:** Desktop, tablet, mobile
- **Dark/Light Mode:** User preference
- **Real-time Updates:** WebSocket for live streaming
- **Keyboard Shortcuts:** Power user efficiency
- **Split View:** Code + conversation side-by-side
- **Notifications:** Visual alerts for approvals/errors
- **Accessibility:** WCAG 2.1 AA compliant

### 2. Google Chat Integration

#### 2.1 Core Functionality
- **Bot Identity:** @UltraX bot in Google Chat
- **Bidirectional Messaging:**
  - User → Bot: Send commands, ask questions
  - Bot → User: Agent responses, progress updates, errors
- **Thread Organization:** Automatic thread creation per session
- **File Sharing:** Upload files for Claude Code to analyze
- **Code Formatting:** Preserve code formatting in chat
- **Long-running Tasks:** Progress updates during execution

#### 2.2 Claude Code Interactions
- **All Ultrapilot Commands:** Same as Web UI
- **Command Shortcuts:** Quick aliases for common tasks
- **Approval Requests:** Interactive buttons for tool approvals
- **Status Updates:** Real-time progress on agent tasks
- **Error Handling:** Clear error messages with resolution suggestions

#### 2.3 Integration Features
- **Workspace Access:** Access files from Google Drive
- **Doc Collaboration:** Create/edit Google Docs from conversations
- **Notifications:** Google Chat notifications for important events
- **Multi-user Support:** Multiple users can interact simultaneously
- **Audit Log:** Track all interactions for compliance

---

## Non-Functional Requirements

### 3. Enterprise-Grade Requirements

#### 3.1 Reliability
- **Uptime:** 99.9% availability target
- **Error Recovery:** Automatic recovery from failures
- **Graceful Degradation:** Core functions work during partial outages
- **State Persistence:** No data loss on refresh/disconnect

#### 3.2 Security
- **Authentication:**
  - Web UI: OAuth 2.0 (Google, GitHub)
  - Google Chat: Built-in Google Workspace auth
- **Authorization:**
  - Role-based access control (Admin, User, Viewer)
  - Workspace-level permissions
  - Agent-specific access controls
- **Data Protection:**
  - Encryption in transit (TLS 1.3)
  - Encryption at rest (if storing data)
  - No data leakage to third parties
- **Audit Trail:** Log all actions for compliance

#### 3.3 Scalability
- **Concurrent Users:** Support 100+ simultaneous users
- **Message Throughput:** 1000+ messages/minute
- **File Handling:** Support files up to 100MB
- **Session Management:** Handle 1000+ active sessions

#### 3.4 Performance
- **Latency:** < 100ms for message delivery
- **Response Time:** < 2s for agent responses
- **Page Load:** < 3s initial load
- **WebSocket:** < 50ms message delivery via WebSocket

### 4. Redundant Communications

#### 4.1 Multi-Channel Support
- **Primary Channel:** Web UI (port 3000)
- **Secondary Channel:** Google Chat
- **Channel Agnostic:** Same session accessible from both channels
- **Failover:** Automatic failover if one channel unavailable

#### 4.2 Synchronization
- **Session State:** Consistent across channels
- **Message History:** Complete history available everywhere
- **Agent Status:** Real-time updates across all channels
- **File Context:** Shared file access across channels

---

## Technical Architecture

### 5. Web UI Architecture

#### 5.1 Frontend Stack
- **Framework:** React 18 + TypeScript
- **State Management:** Zustand or Redux Toolkit
- **Real-time:** Socket.IO client
- **UI Components:** shadcn/ui or Material-UI
- **Code Editor:** Monaco Editor (VS Code editor)
- **Syntax Highlighting:** Prism.js or Highlight.js
- **Build Tool:** Vite
- **Testing:** Vitest + React Testing Library

#### 5.2 Backend Integration
- **API:** REST + WebSocket (Socket.IO)
- **Authentication:** JWT tokens
- **File Upload:** Multer (Node.js)
- **Session Storage:** Redis (for state persistence)
- **WebSocket Server:** Socket.IO server on port 3000

#### 5.3 Key Features
```
Web UI (React) → Socket.IO Client → Socket.IO Server (Port 3000)
                                                      ↓
                                               UltraX Gateway API
                                               (Port 3001)
                                                      ↓
                                               Claude Code + Ultrapilot
```

### 6. Google Chat Architecture

#### 6.1 Bot Configuration
- **Platform:** Google Chat API
- **Authentication:** Google Workspace service account
- **Webhook:** HTTP endpoint on UltraX Server
- **Message Format:** Google Chat cards with interactive buttons

#### 6.2 Integration Flow
```
User (Google Chat)
       ↓
  Google Chat API
       ↓
  Webhook (Port 3001)
       ↓
  UltraX Gateway
       ↓
  Claude Code + Ultrapilot
       ↓
  Response formatting
       ↓
  Google Chat API
       ↓
  User (Google Chat)
```

---

## Data Models

### 7. Session Model
```typescript
interface Session {
  sessionId: string;
  userId: string;
  workspace: string;
  startTime: Date;
  lastActivity: Date;
  status: 'active' | 'paused' | 'terminated';
  activeAgents: string[];
  currentPhase: string;
  messages: Message[];
  files: FileReference[];
}
```

### 8. Message Model
```typescript
interface Message {
  messageId: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  agent?: string;
  phase?: string;
  attachments?: Attachment[];
  status?: 'pending' | 'approved' | 'denied';
}
```

---

## Success Criteria

1. ✅ Web UI fully replaces Relay functionality
2. ✅ Google Chat bot responds to all Ultrapilot commands
3. ✅ Sessions accessible from both Web UI and Google Chat
4. ✅ Real-time updates in both interfaces
5. ✅ Enterprise authentication and authorization
6. ✅ 99.9% uptime target met
7. ✅ Sub-100ms latency for message delivery
8. ✅ Support 100+ concurrent users
9. ✅ Complete audit trail for compliance
10. ✅ Seamless failover between channels

---

## Open Questions

1. Should Web UI support multiple Claude Code sessions simultaneously?
2. Should Google Chat support workspace-wide broadcasts?
3. What's the retention policy for chat history?
4. Should we support file uploads from Google Chat to Claude Code?
5. What's the disaster recovery plan?

---

**Next Phase:** Architecture Design by ultra:architect
