# Ultrapilot + Google Chat: Interactive Setup Guide

## The Missing Piece

You have Google Workspace integration code, but **not the Google Chat bot integration** for bidirectional chat. Let me show you how to add it.

---

## What You Need

### Current State (What You Have)
✅ Google Workspace API wrapper (`google-workspace.ts`)
✅ OAuth tokens configured
✅ Ultra-domain-setup skill
✅ Ultra-autoloop skill

### Missing Piece
❌ **Google Chat bot** to receive messages and route to Ultrapilot agents

---

## Solution: Build Google Chat Bot Integration

### Architecture

```
Google Chat Space
    ↓ (user message)
Google Chat Bot
    ↓ (webhook)
Your Webhook Server
    ↓ (route to agent)
Ultrapilot Agent (via Task tool)
    ↓ (response)
Webhook Server
    ↓ (post back)
Google Chat Space
```

---

## Step 1: Create Google Chat Bot

### 1A. Google Cloud Console Setup

```bash
# 1. Go to Google Cloud Console
https://console.cloud.google.com

# 2. Create new project
# Project name: "ultrapilot-chat-integration"

# 3. Enable APIs:
# - Google Chat API
# - Cloud Functions
```

### 1B. Configure Chat Bot

```bash
# In Google Cloud Console:
APIs & Services → Google Chat API → Enable

# Create configuration:
Configuration name: "ultrapilot-bot"
Space: "YOUR_SPACE_NAME" (or "All spaces")
```

---

## Step 2: Create Webhook Server

### Create the server file:

```bash
# ~/ultrapilot-webhook/server.js
mkdir -p ~/ultrapilot-webhook
cd ~/ultrapilot-webhook
npm init -y
npm install express body-parser
```

### Server code (`server.js`):

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();
app.use(bodyParser.json());

// Verify Google Chat webhook
app.post('/webhook/chat', async (req, res) => {
  const { message, sender, space } = req.body;

  console.log(`Message from ${sender.name} in ${space.name}: ${message.text}`);

  // Route to appropriate Ultrapilot command
  let response;

  if (message.text.startsWith('/ultra-')) {
    // Direct Ultrapilot command
    response = await executeUltrapilotCommand(message.text, sender);
  } else {
    // General conversation - route to analyst
    response = await routeToAgent(message.text, sender);
  }

  // Send response back to Google Chat
  res.json({
    text: response
  });
});

// Execute Ultrapilot command
async function executeUltrapilotCommand(command, sender) {
  return new Promise((resolve) => {
    // Route to appropriate Ultrapilot skill
    const skillMap = {
      '/ultrapilot': 'ultrapilot',
      '/ultra-team': 'ultra-team',
      '/ultra-ralph': 'ultra-ralph',
      '/ultra-review': 'ultra-review',
      '/ultra-domain-setup': 'ultra-domain-setup',
      '/ultra-autoloop': 'ultra-autoloop'
    };

    // Extract command and arguments
    const parts = command.split(' ');
    const cmd = parts[0];
    const args = parts.slice(1).join(' ');

    // Execute via Claude Code
    const claude = exec(
      `claude ${skillMap[cmd] || cmd} ${args}`,
      {
        env: { ...process.env, CLAUDE_CONFIG_DIR: process.env.HOME + '/.claude' }
      },
      (error, stdout, stderr) => {
        if (error) {
          resolve(`Error: ${error.message}`);
        } else {
          resolve(stdout || stderr);
        }
      }
    );
  });
}

// Route general conversation to appropriate agent
async function routeToAgent(message, sender) {
  // Analyze intent and route
  if (message.toLowerCase().includes('bug') || message.toLowerCase().includes('error')) {
    return executeUltrapilotCommand('/ultra-debugging ' + message, sender);
  }

  if (message.toLowerCase().includes('review') || message.toLowerCase().includes('check')) {
    return executeUltrapilotCommand('/ultra-review ' + message, sender);
  }

  // Default to analyst
  return executeUltrapilotCommand('/ultra-analyst ' + message, sender);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Ultrapilot webhook server listening on port ${PORT}`);
});
```

---

## Step 3: Deploy Webhook Server

### Option A: Cloud Functions (Recommended)

```bash
# Create Cloud Function
gcloud functions deploy ultra-chat-bot \
  --runtime nodejs18 \
  --trigger-http \
  --allow-unauthenticated
```

### Option B: Simple Node.js Server

```bash
# Run locally (for testing)
node ~/ultrapilot-webhook/server.js

# Or use pm2 for production
pm2 start ~/ultrapilot-webhook/server.js
```

---

## Step 4: Configure Google Chat Webhook

### In Google Cloud Console:

```bash
# Chat API Configuration
https://console.cloud.google.com/apis/chat

# Webhook settings:
Webhook URL: https://YOUR-WEBHOOK-URL/webhook/chat
HTTP Method: POST
Authentication: (optional, recommend token-based)
```

---

## Step 5: Test Integration

### In Google Chat:

```
@ultrapilot-bot /ultra-domain-setup
```

Expected response:
```
Agent: Starting domain setup wizard...
Agent: Let's set up your domain!
[Setup questions appear...]
```

---

## Step 6: Create Google Chat Space Structure

### Recommended Spaces:

**1. #ultrapilot-general**
- General conversation with agents
- Ask questions, get analysis
- Route to appropriate specialist

**2. #ultrapilot-tasks**
- Task assignment and tracking
- Progress updates
- Completion notifications

**3. #ultrapilot-reviews**
- Code review requests
- Multi-dimensional reviews
- Approval/rejection notifications

**4. #ultrapilot-debugging**
- Bug reports
- Investigation results
- Fix proposals

---

## How to Use

### In Google Chat Spaces:

**Direct Commands:**
```
@ultrapilot-bot /ultrapilot Build me a REST API for task management

@ultrapilot-bot /ultra-team N=3 Implement the authentication module

@ultrapilot-bot /ultra-debugging Investigate the login timeout bug

@ultrapilot-bot /ultra-review Review PR #123 for security issues
```

**Natural Conversation:**
```
You: We have a bug in the authentication module when users with special characters try to log in

Bot: [Routes to ultra-debugging]
     Agent: I'll investigate this authentication issue...

You: Can you review the changes in the last PR?

Bot: [Routes to ultra-review]
     Agent: I'll perform a comprehensive review...
```

---

## Step 7: Configure Ultrapilot for Chat Responses

### Create response handler:

```javascript
// ~/ultrapilot-webhook/chat-responses.js

async function formatAgentResponse(agentOutput, chatContext) {
  const lines = agentOutput.split('\n');
  const firstLine = lines[0];

  // Format for Google Chat
  return {
    text: firstLine,
    cards: agentOutput.length > 100 ? [{
      header: "Full Output",
      sections: [{
        widgets: [{
          textParagraph: {
            text: agentOutput
          }
        }]
      }]
    }] : undefined
  };
}
```

---

## Quick Start Commands

```bash
# 1. Create webhook server
mkdir -p ~/ultrapilot-webhook && cd ~/ultrapilot-webhook
npm init -y
npm install express body-parser

# 2. Create server.js (code above)

# 3. Deploy
gcloud functions deploy ultra-chat-bot --trigger-http

# 4. Configure webhook in Google Chat API

# 5. Test in Google Chat:
@ultrapilot-bot /ultra-domain-setup
```

---

## Summary

**What you get:**

✅ **Chat in Google Chat** with Ultrapilot agents
✅ **@mention agents** in spaces
✅ **Direct commands** (`/ultrapilot`, `/ultra-team`, etc.)
✅ **Natural conversation** routing
✅ **Progress updates** in threads
✅ **Multi-agent coordination** visible in chat

**Architecture:**
```
Google Chat → Webhook → Claude Code → Ultrapilot Agents
                                    ↓
                              Google Chat (response)
```

**Two commands to start:**
```bash
# 1. Deploy webhook server
cd ~/ultrapilot-webhook && npm install && node server.js

# 2. Chat in Google Chat
@ultrapilot-bot /ultra-domain-setup
```

**Now you can chat with your agents in Google Chat!** 🚀
