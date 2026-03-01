# UltraX Quick Start Guide

**UltraX** = Claude Code Relay + Ultrapilot + Google Chat

Three ways to interact with autonomous AI agents:
- 🌐 **Web UI** (port 3000)
- 💬 **Google Chat** (enterprise chat)
- 💻 **CLI** (terminal)

## Prerequisites

- ✅ Ultrapilot plugin installed
- ✅ Claude Code Relay running on port 3000
- ⏳ Google Cloud project (optional, for Google Chat)
- ⏳ Google Chat bot configured (optional)

## Setup

### 1. Install Ultrapilot

```bash
git clone https://github.com/hscheema1979/ultrapilot.git ~/.claude/plugins/ultrapilot
cd ~/.claude/plugins/ultrapilot
node scripts/install.mjs
```

### 2. Start Claude Code Relay (if not running)

```bash
cd ~/claude-web-interfaces/claude-relay
node server.js
```

Relay will be available at: http://localhost:3000

### 3. Configure Google Chat (optional)

See `GOOGLE-CHAT-SETUP.md` for detailed instructions.

## Usage

### Web Interface

1. Open http://localhost:3000
2. Start a new conversation
3. Type Ultrapilot commands:
   - `/ultrapilot Build me a REST API`
   - `/ultra-team 3 Refactor the database layer`
   - `/ultra-ralph Fix the failing tests`

### Google Chat

1. Open Google Chat
2. Find @UltraX bot
3. Send commands:
   - `@UltraX Build me a REST API`
   - `@UltraX status`
   - `@UltraX cancel`

### CLI (Terminal)

```bash
# Start Ultrapilot
/ultrapilot Build me a REST API

# Start team mode
/ultra-team N=3 Refactor the database layer

# Start Ralph loop
/ultra-ralph Fix the failing tests

# Check status
/ultra-hud status

# Cancel active mode
/ultra-cancel
```

## Available Commands

| Command | Description |
|---------|-------------|
| `/ultrapilot <task>` | Full autonomous execution |
| `/ultra-team N=3 <task>` | Coordinate N parallel agents |
| `/ultra-ralph <task>` | Persistent execution loop |
| `/ultra-review <path>` | Multi-dimensional review |
| `/ultra-hud` | Configure HUD |
| `/ultra-cancel` | Cancel active mode |

## Session Management

UltraX maintains session context across interfaces:

```bash
# Start task in CLI
/ultrapilot Build REST API

# Switch to Web UI (same session)
# Open http://localhost:3000
# Session continues automatically

# Switch to Google Chat (same session)
# @UltraX status
# Shows current progress
```

## HUD Display

Real-time statusline shows:

```
[ULTRA] EXEC | ralph:3/10 | qa:2/5 | running | ctx:[████░░]67%
├─ s executor    2m   implementing authentication
├─ h designer    45s   creating UI mockups
└─ O verifier    1m   running test suite
```

**Elements:**
- **Phase**: Current workflow phase
- **ralph**: Ralph loop iteration
- **qa**: QA cycle
- **ctx**: Context usage
- **Agents**: Active agents with tasks

## Architecture

```
User Interface (Web/Chat/CLI)
         ↓
   UltraX Gateway
         ↓
   Ultrapilot Plugin
   (29 specialist agents)
         ↓
   State Management
```

## Google Chat Setup (Optional)

### 1. Create Google Cloud Project

```bash
# Go to Google Cloud Console
# https://console.cloud.google.com

# Create new project: "UltraX-Bot"
# Enable Google Chat API
```

### 2. Create Google Chat Bot

```bash
# In Google Cloud Console:
# 1. Go to Google Chat API
# 2. Create bot configuration
# 3. Set webhook URL: https://your-domain.com/webhook
# 4. Grant permissions
```

### 3. Configure UltraX

Add to `~/.claude/settings.json`:

```json
{
  "ultraX": {
    "googleChat": {
      "enabled": true,
      "projectId": "your-gcp-project",
      "botId": "projects/your-project/bots/bot-id",
      "credentialsPath": "/path/to/service-account.json"
    }
  }
}
```

### 4. Start Webhook Server

```bash
cd ~/.claude/plugins/ultrapilot
node src/chat-bot.js
```

## Troubleshooting

### Relay not responding?

```bash
# Check if Relay is running
ps aux | grep relay

# Restart Relay
cd ~/claude-web-interfaces/claude-relay
node server.js
```

### Google Chat bot not responding?

```bash
# Check webhook server
ps aux | grep chat-bot

# Check bot permissions in Google Cloud Console
# Verify webhook URL is accessible from internet
```

### Ultrapilot not loading?

```bash
# Check plugin is installed
ls -la ~/.claude/plugins/ultrapilot

# Check skills are installed
ls -la ~/.claude/skills/ultrapilot

# Reinstall
cd ~/.claude/plugins/ultrapilot
node scripts/install.mjs
```

### HUD not showing?

```bash
# Test HUD manually
~/.claude/hud/ultra-hud.mjs

# Check settings.json
cat ~/.claude/settings.json | grep -A 5 statusLine
```

## Advanced Configuration

### Session Timeout

Default: 1 hour

Configure in `~/.claude/settings.json`:

```json
{
  "ultraX": {
    "gateway": {
      "sessionTimeout": 3600000
    }
  }
}
```

### Agent Limits

Default: No limit

Configure maximum concurrent agents:

```json
{
  "ultraX": {
    "gateway": {
      "maxConcurrentAgents": 10
    }
  }
}
```

### Interface Priority

Configure which interface to use by default:

```json
{
  "ultraX": {
    "defaultInterface": "web"
  }
}
```

## Next Steps

1. ✅ Install Ultrapilot
2. ✅ Start Relay
3. ⏳ Try `/ultrapilot` command
4. ⏳ Set up Google Chat (optional)
5. ⏳ Explore all interfaces

## Documentation

- `ULTRAX-ARCHITECTURE.md` - Full architecture details
- `DEPLOYMENT.md` - VPS deployment guide
- `AGENTS.md` - 29 specialist agents
- `README.md` - Ultrapilot overview

## Support

- GitHub: https://github.com/hscheema1979/ultrapilot
- Issues: https://github.com/hscheema1979/ultrapilot/issues

## License

MIT

---

**UltraX: One agent system, multiple interfaces.**
