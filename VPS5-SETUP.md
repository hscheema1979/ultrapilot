# VPS5 UltraX Integration Guide

## Current Setup

VPS5 is now running **both services in parallel**:

```
┌─────────────────────────────────────────────────────┐
│  Port 3000: Claude Code Relay                       │
│  - Existing web UI                                  │
│  - Current sessions                                 │
│  - Status: ✅ Running                               │
└─────────────────────────────────────────────────────┘
                      ↕ API calls (CORS enabled)
┌─────────────────────────────────────────────────────┐
│  Port 3001: UltraX Server                           │
│  - Gateway API                                      │
│  - Ultrapilot agents (29 specialist agents)         │
│  - Session management                               │
│  - Google Chat webhook                              │
│  - Status: ✅ Running (systemd service)             │
└─────────────────────────────────────────────────────┘
```

## Service Status

### Relay (Port 3000)
- **Status:** ✅ Running
- **Type:** Daemon process
- **Management:** Manual/startup script

### UltraX Server (Port 3001)
- **Status:** ✅ Running
- **Type:** systemd service
- **Service Name:** ultrax-server
- **Auto-start:** ✅ Enabled (starts on boot)
- **Management:** systemd commands

## Management Commands

### UltraX Server (systemd)

```bash
# Check status
sudo systemctl status ultrax-server

# View logs (real-time)
sudo journalctl -u ultrax-server -f

# View last 50 log lines
sudo journalctl -u ultrax-server -n 50

# Restart service
sudo systemctl restart ultrax-server

# Stop service
sudo systemctl stop ultrax-server

# Start service
sudo systemctl start ultrax-server

# Disable auto-start
sudo systemctl disable ultrax-server

# Enable auto-start
sudo systemctl enable ultrax-server
```

### Relay (Port 3000)

```bash
# Check if running
ps aux | grep relay

# Restart (if needed)
cd ~/claude-web-interfaces/claude-relay
node lib/daemon.js
```

## API Endpoints

### UltraX Gateway (Port 3001)

**Health Check:**
```bash
curl http://localhost:3001/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-03-02T00:11:55.740Z",
  "uptime": 1465.37,
  "sessions": 1
}
```

**Send Ultrapilot Command:**
```bash
curl -X POST http://localhost:3001/api/gateway \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "my-session",
    "userId": "user@example.com",
    "interface": "web",
    "command": "/ultrapilot build me a REST API"
  }'
```

**Response:**
```json
{
  "sessionId": "my-session",
  "interface": "web",
  "message": "Starting Ultrapilot: build me a REST API",
  "timestamp": "2026-03-02T00:12:01.103Z",
  "agent": "ultra:analyst",
  "phase": "expansion",
  "status": "running"
}
```

**Get Session Status:**
```bash
curl http://localhost:3001/api/session/my-session
```

**Response:**
```json
{
  "exists": true,
  "interface": "web",
  "activeAgents": ["ultra:analyst"],
  "currentPhase": "expansion",
  "messageCount": 3,
  "uptime": 6331
}
```

**Get Available Commands (for Relay UI):**
```bash
curl http://localhost:3001/api/relay/commands
```

**Get User Sessions (for Relay UI):**
```bash
curl http://localhost:3001/api/relay/sessions/user@example.com
```

**Google Chat Webhook:**
```bash
curl -X POST http://localhost:3001/webhook/google-chat \
  -H "Content-Type: application/json" \
  -d '{
    "type": "MESSAGE",
    "event": {
      "user": { "name": "users/test", "displayName": "Test User" },
      "message": {
        "text": "@UltraX build me a REST API"
      }
    }
  }'
```

## Integration with Relay UI

### Adding Ultrapilot Buttons to Relay

Relay can now call UltraX API to add Ultrapilot commands to the UI:

```javascript
// Fetch available commands
fetch('http://localhost:3001/api/relay/commands')
  .then(res => res.json())
  .then(data => {
    // data.commands contains all Ultrapilot commands
    // Add these as buttons to Relay UI
  });

// Send command to UltraX
fetch('http://localhost:3001/api/gateway', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: currentSessionId,
    userId: currentUserId,
    interface: 'web',
    command: '/ultrapilot build me an API'
  })
})
  .then(res => res.json())
  .then(data => {
    // Display response in Relay UI
    // data.agent, data.phase, data.status available
  });
```

## Architecture

```
User (Browser)
    ↓
Relay Web UI (Port 3000)
    ↓ POST /api/gateway
UltraX Gateway (Port 3001)
    ↓ Route to agents
Ultrapilot Plugin (29 agents)
    ↓ Execute
State Management (.ultra/state/)
    ↓ Update
UltraX Gateway
    ↓ Response
Relay Web UI (Display)
```

## Benefits

1. **Separation of Concerns**
   - Relay: Web UI, session management
   - UltraX: Agent orchestration, state management

2. **Scalability**
   - Can run multiple UltraX instances
   - Load balance across servers

3. **Reliability**
   - If UltraX crashes, Relay continues
   - systemd auto-restart on failure

4. **Flexibility**
   - Easy to add new interfaces (Google Chat, CLI)
   - Can upgrade UltraX without touching Relay

## Troubleshooting

### UltraX Server Not Responding

```bash
# Check status
sudo systemctl status ultrax-server

# Check logs
sudo journalctl -u ultrax-server -n 50

# Restart
sudo systemctl restart ultrax-server
```

### Relay Can't Connect to UltraX

```bash
# Check UltraX is listening
curl http://localhost:3001/health

# Check CORS headers
curl -I http://localhost:3001/health

# Should see:
# Access-Control-Allow-Origin: http://localhost:3000
```

### Port Already in Use

```bash
# Check what's using port 3001
sudo lsof -i :3001

# If needed, stop the process
sudo kill <PID>
```

## Monitoring

### Real-time Logs

```bash
# UltraX logs
sudo journalctl -u ultrax-server -f

# Both services (separate terminals)
sudo journalctl -u ultrax-server -f
ps aux | grep relay
```

### Health Checks

```bash
# UltraX health
watch -n 5 'curl -s http://localhost:3001/health | jq .'

# Session count
watch -n 5 'curl -s http://localhost:3001/health | jq .sessions'
```

## Next Steps

1. ✅ Both services running in parallel
2. ✅ UltraX Gateway functional
3. ✅ Session management working
4. ⏳ Add Ultrapilot buttons to Relay UI
5. ⏳ Configure Google Chat bot (optional)
6. ⏳ Set up monitoring dashboards
7. ⏳ Deploy to other VPS instances

## Summary

**VPS5 is now running:**
- ✅ Relay Web UI on port 3000
- ✅ UltraX Server on port 3001
- ✅ Both services auto-start on boot
- ✅ CORS enabled for Relay → UltraX communication
- ✅ Session persistence across restarts
- ✅ 29 specialist agents available

**Ready for production use!**
