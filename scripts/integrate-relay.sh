#!/bin/bash
#
# Ultrapilot-Aware Relay Setup Script
# Integrates Claude Code Relay with Ultrapilot state monitoring
#

set -e

RELAY_DIR="$HOME/claude-web-interfaces/claude-relay"
ULTRA_DIR="$HOME/.claude/plugins/ultrapilot"

echo "=== Ultrapilot Relay Integration ==="
echo ""

echo "1. Creating Ultrapilot monitoring endpoints..."
cat > "$RELAY_DIR/ultrapilot-routes.js" << 'EOF'
import express from 'express';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const router = express.Router();

// Get Ultrapilot status
router.get('/status', (req, res) => {
  const cwd = process.cwd();
  const stateDir = join(cwd, '.ultra/state');

  try {
    const autopilot = JSON.parse(readFileSync(`${stateDir}/autopilot-state.json`, 'utf8'));
    const ralph = JSON.parse(readFileSync(`${stateDir}/ralph-state.json`, 'utf8'));
    const ultraqa = JSON.parse(readFileSync(`${stateDir}/ultraqa-state.json`, 'utf8'));

    res.json({
      active: true,
      phase: autopilot.phase || 'idle',
      status: autopilot.status || 'inactive',
      ralph: `${ralph.iteration}/${ralph.maxIterations}`,
      qa: `${ultraqa.cycle}/${ultraqa.maxCycles}`,
      tasks: autopilot.tasks || { total: 0, completed: 0, pending: 0 },
      agents: autopilot.activeAgents || 0,
      timestamp: autopilot.timestamp
    });
  } catch (e) {
    res.json({
      active: false,
      phase: 'idle',
      status: 'inactive',
      error: 'No active Ultrapilot session'
    });
  }
});

// Get active agents
router.get('/agents', (req, res) => {
  const cwd = process.cwd();
  const stateDir = join(cwd, '.ultra/state');

  try {
    const autopilot = JSON.parse(readFileSync(`${stateDir}/autopilot-state.json`, 'utf8'));
    res.json(autopilot.agentDetails || []);
  } catch (e) {
    res.json([]);
  }
});

// Get HUD output
router.get('/hud', (req, res) => {
  const { spawn } = require('child_process');
  const hudCli = join(process.env.HOME, '.claude', 'hud', 'ultra-hud.mjs');

  const hud = spawn('node', [hudCli], {
    env: {
      ...process.env,
      TERM: 'dumb'
    }
  });

  let output = '';
  hud.stdout.on('data', (data) => {
    output += data.toString();
  });

  hud.on('close', () => {
    res.json({ hud: output.trim() });
  });
});

export default router;
EOF

echo "   ✓ Created Ultrapilot routes"
echo ""

echo "2. Updating relay server to include Ultrapilot..."
cat >> "$RELAY_DIR/lib/server.js" << 'EOF'

// Ultrapilot monitoring
import ultraRoutes from './ultrapilot-routes.js';
app.use('/api/ultrapilot', ultraRoutes);

EOF

echo "   ✓ Updated server.js"
echo ""

echo "3. Creating web UI components..."
mkdir -p "$RELAY_DIR/public/ultrapilot"

cat > "$RELAY_DIR/public/ultrapilot/status.html" << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <title>Ultrapilot Status</title>
  <style>
    .phase { font-size: 24px; font-weight: bold; color: #00bcd4; }
    .metrics { display: flex; gap: 20px; margin: 20px 0; }
    .metric { padding: 10px; background: #f5f5f5; border-radius: 5px; }
    .agents { margin-top: 20px; }
    .agent { padding: 8px; margin: 5px 0; background: #e3f2fd; border-radius: 3px; }
    .status { padding: 20px; }
    .active { color: #4caf50; }
    .inactive { color: #9e9e9e; }
  </style>
</head>
<body>
  <h1>🚀 Ultrapilot Status</h1>
  <div id="status" class="status">Loading...</div>
  <div id="phase" class="phase"></div>
  <div id="metrics" class="metrics"></div>
  <div id="agents" class="agents"></div>

  <script>
    async function updateStatus() {
      const response = await fetch('/api/ultrapilot/status');
      const data = await response.json();

      const statusEl = document.getElementById('status');
      statusEl.textContent = data.active ? 'ACTIVE' : 'INACTIVE';
      statusEl.className = `status ${data.active ? 'active' : 'inactive'}`;

      document.getElementById('phase').textContent = data.phase || 'IDLE';

      document.getElementById('metrics').innerHTML = `
        <div class="metric">Ralph: ${data.ralph}</div>
        <div class="metric">QA: ${data.qa}</div>
        <div class="metric">Tasks: ${data.tasks.completed}/${data.tasks.total}</div>
        <div class="metric">Agents: ${data.agents}</div>
      `;
    }

    async function updateAgents() {
      const response = await fetch('/api/ultrapilot/agents');
      const agents = await response.json();

      const agentsEl = document.getElementById('agents');
      agentsEl.innerHTML = agents.map(agent => `
        <div class="agent">
          <strong>${agent.type}</strong> (${agent.model}) - ${agent.description}
        </div>
      `).join('');
    }

    // Update every 2 seconds
    setInterval(() => {
      updateStatus();
      updateAgents();
    }, 2000);

    // Initial load
    updateStatus();
    updateAgents();
  </script>
</body>
</html>
EOF

echo "   ✓ Created status page"
echo ""

echo "4. Restarting relay with Ultrapilot integration..."
cd "$RELAY_DIR"

# Stop existing relay
pkill -f "claude-relay" || true
sleep 2

# Start with Ultrapilot support
nohup node lib/daemon.js > logs/ultrapilot-relay.log 2>&1 &

echo "   ✓ Relay restarted"
echo ""

echo "=== Integration Complete! ==="
echo ""
echo "Access points:"
echo "  - Relay Web UI: http://localhost:3000"
echo "  - Ultrapilot Status: http://localhost:3000/ultrapilot/status.html"
echo "  - API: http://localhost:3000/api/ultrapilot/status"
echo ""
echo "Test with:"
echo "  curl http://localhost:3000/api/ultrapilot/status"
echo ""
