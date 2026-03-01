# Ultrapilot + Claude Code Relay Integration Guide

## Part 1: Relay Integration Strategy

### Current Setup
```bash
# Your relay is running:
PID: 2904805
Location: ~/claude-web-interfaces/claude-relay/
Port: 3000
Process: /usr/bin/node lib/daemon.js
```

### Integration Approach: Ultrapilot-Aware Relay

Create a custom relay wrapper that's Ultrapilot-aware:

```javascript
// ~/claude-web-interfaces/ultrapilot-relay.js
import express from 'express';
import { spawn } from 'child_process';
import { join } from 'path';

const app = express();
const PORT = 3000;

// Ultrapilot state monitoring
app.get('/api/ultrapilot/status', (req, res) => {
  const stateDir = join(process.cwd(), '.ultra/state');
  const fs = require('fs');

  const autopilot = JSON.parse(
    fs.readFileSync(`${stateDir}/autopilot-state.json`, 'utf8')
  );
  const ralph = JSON.parse(
    fs.readFileSync(`${stateDir}/ralph-state.json`, 'utf8')
  );
  const ultraqa = JSON.parse(
    fs.readFileSync(`${stateDir}/ultraqa-state.json`, 'utf8')
  );

  res.json({
    phase: autopilot.phase,
    status: autopilot.status,
    ralphIteration: `${ralph.iteration}/${ralph.maxIterations}`,
    qaCycle: `${ultraqa.cycle}/${ultraqa.maxCycles}`,
    tasks: autopilot.tasks,
    activeAgents: autopilot.activeAgents,
    timestamp: autopilot.timestamp
  });
});

// Ultrapilot command endpoint
app.post('/api/ultrapilot/command', (req, res) => {
  const { command, args } = req.body;

  // Route to appropriate Ultrapilot command
  const ultraCommands = {
    'autopilot': '/ultrapilot',
    'team': '/ultra-team',
    'ralph': '/ultra-ralph',
    'review': '/ultra-review',
    'cancel': '/ultra-cancel'
  };

  res.json({
    message: `Command routed to ${command}`,
    usage: `Use ${ultraCommands[command]} ${args}`
  });
});

// Real-time agent monitoring
app.get('/api/ultrapilot/agents', (req, res) => {
  // Read agent details from autopilot state
  const stateDir = join(process.cwd(), '.ultra/state');
  const autopilot = JSON.parse(
    require('fs').readFileSync(`${stateDir}/autopilot-state.json`, 'utf8')
  );

  res.json(autopilot.agentDetails || []);
});

app.listen(PORT, () => {
  console.log(`Ultrapilot-aware relay running on port ${PORT}`);
});
```

### Web UI Enhancements

Add Ultrapilot-specific UI components:

```html
<!-- Relay web UI enhancements -->
<div id="ultrapilot-status">
  <div class="phase">EXPANSION</div>
  <div class="metrics">
    <span>Ralph: 3/10</span>
    <span>QA: 2/5</span>
    <span>Tasks: 5/12</span>
  </div>
  <div class="agents">
    <div class="agent">executor: implementing auth</div>
    <div class="agent">architect: reviewing design</div>
  </div>
</div>
```

## Part 2: Enterprise Chatbot Alternatives to CCbot

### Top Recommendations (2025-2026)

#### 1. 腾讯云智能体开发平台 (Tencent Cloud Agent Platform)
- **Rating**: 9.7/10
- **Best For**: Large enterprises with complex workflows
- **Key Features**:
  - Multi-agent collaboration
  - Visual workflow orchestration
  - LLM+RAG support
  - Level 3 security certification
  - Proven: Toyota (37%→84% resolution)
- **Pricing**: Enterprise tier
- **URL**: [Tencent Cloud Agent Platform](https://cloud.tencent.com/product/agent)

#### 2. 蚂蚁数科 Agentar (Ant Group Agentar)
- **Rating**: 9.6/10
- **Best For**: Financial services, regulated industries
- **Key Features**:
  - CAICT Level 5 certification (highest)
  - Financial industry knowledge base
  - Risk management agents
  - Regulatory compliance built-in
- **Pricing**: Enterprise licensing
- **URL**: [Ant Group Agentar](https://www.antgroup.com/product/agentar)

#### 3. 阿里云通义千问智能体平台 (Alibaba Cloud Tongyi Qianwen)
- **Rating**: 9.5/10
- **Best For**: Cloud-native enterprises
- **Key Features**:
  - Multi-modal support
  - Industry templates
  - API/SDK customization
  - Elastic scaling
- **Pricing**: Pay-per-use
- **URL**: [Alibaba Cloud Tongyi](https://www.aliyun.com/product/tongyi)

#### 4. Dify (Open Source)
- **Rating**: 9.3/10
- **Best For**: Technical teams wanting full control
- **Key Features**:
  - Open-source (self-hosted)
  - Agent workflow platform
  - RAG support
  - Model-agnostic
- **Pricing**: Free (self-hosted)
- **URL**: [Dify AI](https://dify.ai/)

#### 5. 腾讯元器 (Tencent Yuanqi - FREE)
- **Rating**: 9.2/10
- **Best For**: SMEs, WeChat integration
- **Key Features**:
  - **Completely free**
  - Zero-code deployment
  - One-click WeChat publishing
  - 99.99% availability
- **Pricing**: **FREE**
- **URL**: [Tencent Yuanqi](https://yuanqi.tencent.com/)

## Comparison Table

| Platform | Enterprise Grade | Cost | Multi-Agent | RAG | Private Deploy |
|----------|-----------------|------|-------------|-----|----------------|
| 腾讯云智能体 | ⭐⭐⭐⭐⭐ | Enterprise | ✅ | ✅ | ✅ |
| 蚂蚁Agentar | ⭐⭐⭐⭐⭐ | Enterprise | ✅ | ✅ | ✅ |
| 阿里通义千问 | ⭐⭐⭐⭐ | Pay-per-use | ✅ | ✅ | ✅ |
| Dify | ⭐⭐⭐⭐ | Free (self-hosted) | ✅ | ✅ | ✅ |
| 腾讯元器 | ⭐⭐⭐⭐ | **FREE** | ✅ | ✅ | ❌ |
| CCbot/Claude | ⭐⭐ | Free | ❌ | ❌ | ❌ |

## Integration Strategy for Ultrapilot

### Option 1: Relay + Enterprise Platform
```
User → Web UI (port 3000)
      ↓
  Relay (Ultrapilot-aware)
      ↓
  Ultrapilot Plugin
      ↓
  Enterprise Chatbot (e.g., 腾讯云智能体)
      ↓
  Response back through relay
```

### Option 2: Direct Ultrapilot API
```javascript
// Ultrapilot exposes REST API
app.post('/api/ultrapilot/execute', async (req, res) => {
  const { task, mode } = req.body;

  // Spawn Ultrapilot agents
  const result = await spawn('node', [
    'ultrapilot-cli.js',
    mode || 'autopilot',
    task
  ]);

  res.json({ result });
});
```

### Option 3: Webhook Integration
```javascript
// Enterprise platform webhooks
app.post('/webhook/ultrapilot', async (req, res) => {
  const { event, data } = req.body;

  if (event === 'task.completed') {
    // Notify through enterprise platform
    await notifyEnterprisePlatform({
      platform: 'tencent-agent',
      message: 'Ultrapilot task completed',
      data: data
    });
  }

  res.json({ received: true });
});
```

## Recommended Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface                            │
│  Web UI (port 3000) + Mobile App + Enterprise WeChat         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              Ultrapilot-Aware Relay                          │
│  - Status monitoring                                         │
│  - Command routing                                           │
│  - Agent visibility                                          │
│  - Progress streaming                                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                 Ultrapilot Plugin                             │
│  - 29 specialist agents                                      │
│  - State management (.ultra/)                                 │
│  - Multi-cycle QA                                            │
│  - Parallel execution (file ownership)                        │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         ↓                       ↓
┌────────────────┐      ┌─────────────────┐
│  Enterprise     │      │  Notification  │
│  Chatbot        │      │  System         │
│  (e.g., 腾讯云)  │      │  (Webhooks,     │
│                 │      │   Slack, etc.)  │
└────────────────┘      └─────────────────┘
```

## Next Steps

### Immediate:
1. Create Ultrapilot-aware relay
2. Add status monitoring endpoints
3. Test with existing relay setup

### Short-term:
1. Choose enterprise chatbot platform
2. Integrate webhook notifications
3. Build custom UI components

### Long-term:
1. Multi-platform deployment
2. Enterprise SSO integration
3. Analytics dashboard

---

**Sources**:
- [Tencent Cloud Agent Platform](https://cloud.tencent.com/product/agent)
- [Ant Group Agentar](https://www.antgroup.com/product/agentar)
- [Alibaba Cloud Tongyi Qianwen](https://www.aliyun.com/product/tongyi)
- [Dify AI](https://dify.ai/)
- [Tencent Yuanqi](https://yuanqi.tencent.com/)
