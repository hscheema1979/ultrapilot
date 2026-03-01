# Ultrapilot + Claude Code Relay - Compatibility Guide

## Summary
**Ultrapilot is fully compatible** with Claude Code Relay web UI on port 3000, with some minor considerations.

## ✅ What Works Perfectly

### Core Functionality
- ✅ **All `/ultra-*` commands** work via the web interface
- ✅ **Agent delegation** via Task tool functions normally
- ✅ **State management** (`.ultra/` directory) works identically
- ✅ **All 20+ specialist agents** can be invoked
- ✅ **Autopilot workflow** executes fully in web UI

### Commands You Can Use in Relay Web UI
```bash
/ultrapilot Build me a REST API
/ultra-team N=3 Implement feature X
/ultra-ralph Debug this issue
/ultra-review Review this PR
/ultra-cancel Cancel current work
```

## ⚠️ Known Limitations

### 1. HUD Statusline (Minor)
**Issue**: HUD is designed for CLI statusLine configuration
**Impact**: You won't see the statusline in the web UI
**Workaround**: Check state files directly:
```bash
# Check current phase/status
cat ~/.ultra/state/autopilot-state.json | jq '.phase, .status'

# Check Ralph iteration
cat ~/.ultra/state/ralph-state.json | jq '.iteration'

# Check QA cycle
cat ~/.ultra/state/ultraqa-state.json | jq '.cycle'
```

### 2. Multi-line Agent Display
**Issue**: Web UI may not render multi-line HUD output
**Impact**: "Full" preset multi-line agent display won't show
**Workaround**: Use `/ultra-hud focused` for single-line output

### 3. Background Task Visibility
**Issue**: Web UI doesn't show background task indicators
**Impact**: You won't see `bg:2/5` in statusline
**Workaround**: Check manually:
```bash
# Check active agents in state
cat ~/.ultra/state/autopilot-state.json | jq '.activeAgents'
```

## 🔧 Web UI Optimizations

### Recommended HUD Config for Relay
Set in `~/.claude/ultra-hud-config.json`:
```json
{
  "preset": "focused",
  "elements": {
    "ultraLabel": true,
    "phase": true,
    "ralph": true,
    "qa": true,
    "status": true,
    "context": false,
    "tasks": true,
    "agents": true,
    "background": false,
    "maxOutputLines": 1
  }
}
```

### Alternative: Web-Friendly Status Script
Create a status command for web UI:
```bash
# Add to ~/.claude/scripts/ultra-status.sh
cat ~/.ultra/state/autopilot-state.json | jq -r '"Phase: \(.phase)\nStatus: \(.status)\nTasks: \(.tasks.completed)/\(.tasks.total)"'
```

## 📊 Monitoring in Web UI

Since you don't have the HUD, use these commands to monitor progress:

### Check Autopilot Status
```bash
cat ~/.ultra/state/autopilot-state.json | jq '.'
```

### Check Current Phase
```bash
cat ~/.ultra/state/autopilot-state.json | jq '.phase'
```

### Check Ralph Iteration
```bash
cat ~/.ultra/state/ralph-state.json | jq '{iteration, maxIterations, errorHistory}'
```

### Check QA Cycles
```bash
cat ~/.ultra/state/ultraqa-state.json | jq '{cycle, maxCycles, lastError}'
```

## 🚀 Best Practices for Relay Web UI

1. **Use `/ultra-hud focused`** - Single-line output works better
2. **Monitor state files** - Check `.ultra/state/*.json` for status
3. **Trust the process** - Ultrapilot will complete even without HUD
4. **Check logs** - Web UI shows all agent outputs
5. **Use `/ultra-cancel`** - Works perfectly to stop work

## 🎯 Example Web UI Session

```bash
# In the web UI chat:

You: /ultrapilot Build me a todo app

[Ultrapilot working...]
→ Phase 0: Expansion
  - ultra:analyst: Extracting requirements...
  - ultra:architect: Designing system...

→ Phase 1: Planning
  - ultra:planner: Creating plan...
  - ultra:critic: Validating...

[Check status anytime]
You: cat ~/.ultra/state/autopilot-state.json | jq '.phase'
Output: "execution"

[When done]
You: /ultra-cancel
```

## ✅ Conclusion

**Ultrapilot works great with Relay!** The only difference is you don't get the visual HUD statusline - but all functionality, agents, and workflows work identically. You just monitor progress via state files instead of the statusline.

**No code changes needed** - Ultrapilot is fully compatible!
