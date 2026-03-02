# UltraX Web UI

**Modern React-based Web UI for UltraX (Ultrapilot + Claude Code)**

## Running on Port 3020

This Web UI runs **in parallel** with the existing Relay (port 3000).

## Development

```bash
cd web-ui
npm install
npm run dev
```

Access at: http://localhost:3020

## Features

- ✅ React 18 + TypeScript
- ✅ Vite for fast builds
- ✅ Tailwind CSS styling
- ✅ Socket.IO for real-time updates
- ✅ Zustand for state management
- ✅ Monaco Editor integration (coming)
- ✅ Dark/light theme support
- ✅ Responsive design

## Architecture

```
Web UI (Port 3020)
    ↓ Socket.IO
Socket.IO Server (Port 3020)
    ↓ REST API
UltraX Gateway (Port 3001)
    ↓
Claude Code + Ultrapilot
```

## Components

- **Header**: Top navigation bar
- **Sidebar**: Session history and settings
- **ChatPanel**: Main chat interface
- **AgentStatus**: Active agent monitoring
- **Editor**: Monaco code editor (coming soon)

## State Management

Uses Zustand for:
- Messages
- Session state
- Connection status
- UI state (sidebar, theme)

## Socket.IO Events

**Client → Server:**
- `message:send` - Send message
- `session:create` - Create new session
- `session:pause` - Pause session
- `session:resume` - Resume session
- `session:terminate` - Terminate session

**Server → Client:**
- `message:receive` - Receive message
- `agent:update` - Agent status update
- `session:update` - Session status update
- `error:occurred` - Error notification

## Deployment

Production build:
```bash
npm run build
```

Serve static files with nginx or similar.

## Status

🚧 **Under Development** - Foundation complete, building components
