# Ultrapilot Deployment Guide

Deploy Ultrapilot to any VPS or development environment.

## Quick Install

```bash
# Clone repository
git clone https://github.com/hscheema1979/ultrapilot.git ~/.claude/plugins/ultrapilot

# Run installer
cd ~/.claude/plugins/ultrapilot
node scripts/install.mjs
```

The installer will:
- ✅ Copy skills to `~/.claude/skills/`
- ✅ Set up HUD CLI
- ✅ Configure `settings.json`
- ✅ Create `.ultra/` directory structure
- ✅ Verify TypeScript dependencies

## Requirements

- **Node.js** >= 18.0.0
- **Claude Code** CLI installed
- **TypeScript** >= 5.0.0 (for development)

## Verify Installation

```bash
# Check if plugin is enabled
cat ~/.claude/settings.json | grep ultrapilot

# Test HUD
~/.claude/hud/ultra-hud.mjs

# List available commands
claude-code skill list | grep ultra
```

## Available Commands

| Command | Description |
|---------|-------------|
| `/ultrapilot <task>` | Full autonomous execution |
| `/ultra-team N=3 <task>` | Coordinate N parallel agents |
| `/ultra-ralph <task>` | Persistent execution loop |
| `/ultra-review <path>` | Multi-dimensional code review |
| `/ultra-autoloop` | Continuous domain maintenance |
| `/ultra-hud` | Configure HUD display |
| `/ultra-cancel` | Cancel active mode |

## Update to Latest Version

```bash
cd ~/.claude/plugins/ultrapilot
git pull origin main
node scripts/install.mjs
```

## Uninstall

```bash
# Remove skills
rm -rf ~/.claude/skills/ultrapilot
rm -rf ~/.claude/skills/ultra-*

# Remove plugin
rm -rf ~/.claude/plugins/ultrapilot

# Remove HUD
rm -f ~/.claude/hud/ultra-hud.mjs

# Update settings.json (remove ultrapilot entries)
```

## Configuration

### HUD Display

Configure HUD in `~/.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "/home/ubuntu/.claude/hud/ultra-hud.mjs"
  }
}
```

### Google Workspace Integration

Optional: Set up Google Chat/Drive integration:

```bash
cd ~/.claude/plugins/ultrapilot
node scripts/setup-chat-integration.sh
```

### Claude Code Relay Integration

Optional: Integrate with Relay web UI (port 3000):

```bash
cd ~/.claude/plugins/ultrapilot
node scripts/integrate-relay.sh
```

## Troubleshooting

### HUD not showing?

```bash
# Test HUD manually
~/.claude/hud/ultra-hud.mjs

# Check settings.json
cat ~/.claude/settings.json | grep -A 5 statusLine
```

### Plugin not loading?

```bash
# Verify plugin directory exists
ls -la ~/.claude/plugins/ultrapilot

# Check skills are installed
ls -la ~/.claude/skills/ | grep ultra
```

### State not persisting?

```bash
# Verify .ultra/ directory exists
ls -la .ultra/state/

# Check file permissions
chmod -R 755 .ultra/
```

## Development

For development or contribution:

```bash
cd ~/.claude/plugins/ultrapilot

# Install dev dependencies
npm install

# Run tests
npm test

# Build TypeScript
npm run build
```

## Architecture

Ultrapilot is **completely standalone** - no OMC dependency:

- **29 specialist agents** built-in
- **State management** system
- **HUD** real-time statusline
- **6-phase workflow** with multiple review loops

See `README.md` for complete architecture documentation.

## Support

- GitHub Issues: https://github.com/hscheema1979/ultrapilot/issues
- Documentation: `README.md`, `AGENTS.md`, `SETUP.md`

## License

MIT
