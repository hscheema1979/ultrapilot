#!/bin/bash
#
# Claude Code Chat Integration Setup
# Configures Claude Code with enterprise chat platforms (Slack, Teams, MCP Apps)
#

set -e

echo "=== Claude Code Enterprise Chat Integration ==="
echo ""

# Detect current setup
echo "1. Checking Claude Code installation..."
if command -v claude &> /dev/null; then
    echo "   ✓ Claude Code CLI installed"
    CLAUDE_VERSION=$(claude --version 2>/dev/null || echo "unknown")
    echo "   Version: $CLAUDE_VERSION"
else
    echo "   ⚠ Claude Code CLI not found"
    echo "   Install from: https://www.anthropic.com/claude-code"
fi

echo ""
echo "2. Checking for existing chat integrations..."

# Check for Slack
if [ -f ~/.claude/slack-config.json ]; then
    echo "   ✓ Slack integration configured"
else
    echo "   ○ Slack not configured"
    echo "     Setup: https://www.anthropic.com/news/claude-code-for-slack"
fi

# Check for Teams/M365
if [ -f ~/.claude/microsoft-365-config.json ]; then
    echo "   ✓ Microsoft Teams integration configured"
else
    echo "   ○ Microsoft Teams not configured"
    echo "     Setup: https://www.anthropic.com/news/claude-in-microsoft-365"
fi

# Check for MCP Apps
if [ -f ~/.claude/mcp-apps-config.json ]; then
    echo "   ✓ MCP Apps configured"
else
    echo "   ○ MCP Apps not configured"
    echo "     Enable in: Claude Code → Settings → MCP Apps"
fi

echo ""
echo "3. Creating Ultrapilot chat integration config..."
cat > ~/.claude/ultrapilot-chat-integration.json << 'EOF'
{
  "platform": "auto-detect",
  "progressUpdates": true,
  "notifications": {
    "phaseComplete": true,
    "qaCycle": true,
    "validationRound": true,
    "completion": true
  },
  "artifacts": {
    "shareSpec": true,
    "sharePlan": true,
    "sharePR": true
  },
  "commands": {
    "ultrapilot": {
      "enabled": true,
      "mention": "@Claude /ultrapilot",
      "context": "full-conversation"
    },
    "ultra-team": {
      "enabled": true,
      "mention": "@Claude /ultra-team",
      "context": "task-description"
    },
    "ultra-ralph": {
      "enabled": true,
      "mention": "@Claude /ultra-ralph",
      "context": "task-description"
    },
    "ultra-review": {
      "enabled": true,
      "mention": "@Claude /ultra-review",
      "context": "code-or-pr"
    }
  }
}
EOF
echo "   ✓ Chat integration config created"

echo ""
echo "4. Creating example integration scripts..."
mkdir -p ~/.claude/integration-scripts

# Slack integration script
cat > ~/.claude/integration-scripts/slack-notify.sh << 'EOF'
#!/bin/bash
# Send Ultrapilot progress updates to Slack

WEBHOOK_URL="$1"
MESSAGE="$2"

curl -X POST "$WEBHOOK_URL" \
  -H 'Content-Type: application/json' \
  -d "{\"text\": \"$MESSAGE\"}"
EOF
chmod +x ~/.claude/integration-scripts/slack-notify.sh

# Teams integration script
cat > ~/.claude/integration-scripts/teams-notify.sh << 'EOF'
#!/bin/bash
# Send Ultrapilot progress updates to Microsoft Teams

WEBHOOK_URL="$1"
MESSAGE="$2"

curl -X POST "$WEBHOOK_URL" \
  -H 'Content-Type: application/json' \
  -d "{\"body\": {\"content\": \"$MESSAGE\"}}"
EOF
chmod +x ~/.claude/integration-scripts/teams-notify.sh

echo "   ✓ Notification scripts created"

echo ""
echo "=== Integration Guide ==="
echo ""
echo "For Slack Integration:"
echo "  1. Contact: Anthropic Enterprise Sales"
echo "  2. Request: 'Claude Code for Slack' research preview"
echo "  3. Docs: https://www.anthropic.com/news/claude-code-for-slack"
echo ""
echo "For Microsoft Teams:"
echo "  1. Requires: Claude Team/Enterprise plan"
echo "  2. Setup: Microsoft 365 Admin Center → Integrated Apps"
echo "  3. Docs: https://www.anthropic.com/news/claude-in-microsoft-365"
echo ""
echo "For MCP Apps:"
echo "  1. Requires: Claude Pro/Team/Enterprise plan"
echo "  2. Enable: Claude Code → Settings → MCP Apps"
echo "  3. Configure: Individual app settings"
echo ""
echo "=== Usage Examples ==="
echo ""
echo "In Slack:"
echo "  @Claude /ultrapilot Build me a user authentication system"
echo ""
echo "In Microsoft Teams:"
echo "  @Claude /ultrapilot Create a REST API for task management"
echo ""
echo "=== Next Steps ==="
echo ""
echo "1. Choose your platform (Slack, Teams, or MCP Apps)"
echo "2. Follow setup instructions above"
echo "3. Test with: @Claude /ultrapilot <simple task>"
echo "4. Configure Ultrapilot notifications in chat platform"
echo ""
