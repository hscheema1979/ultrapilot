# Tailscale Integration Guide

## Overview

UltraX Server is now configured by default to listen on **all network interfaces (0.0.0.0)**, enabling seamless access via:

- ✅ **Tailscale VPN** (private network)
- ✅ **Local network** interfaces
- ✅ **Public IP** (if firewall allows)
- ✅ **Talismans alias** (Tailscale hostname)
- ✅ **Domain names** (any configured domains)

## Tailscale Configuration

### Current Tailscale Setup

**VPS5 Tailscale Info:**
- **Tailscale IP:** `100.99.47.10`
- **Hostname:** `vps5`
- **Status:** ✅ Active
- **Network:** Tailnet `hscheema@`

### Access via Tailscale

**1. Direct IP Access:**
```bash
curl http://100.99.47.10:3001/health
```

**2. Tailscale Hostname (Talismans Alias):**
```bash
curl http://vps5:3001/health
```

**3. Tailscale MagicDNS:**
```bash
curl http://vps5.hscheema.ts.net:3001/health
```

**4. From other Tailscale devices:**

Any device in your Tailnet can access UltraX:
- **dev-2** (Windows): `curl http://vps5:3001/health`
- **srvr** (Windows): `curl http://vps5:3001/health`
- **vps1-vps4** (Linux): `curl http://vps5:3001/health`

## Server Configuration

### Default Network Bindings

**File:** `src/server.ts`

```typescript
async start(): Promise<void> {
  const port = this.config.port || 3001;
  // Default to 0.0.0.0 for Tailscale alias and external access
  const host = process.env.HOST || '0.0.0.0';

  // Server startup logs show:
  // - Local IPs
  // - Tailscale IP
  // - Hostname
  // - All access points
}
```

### Startup Output

When UltraX Server starts, it displays all access points:

```
🚀 UltraX Server started
📡 HTTP API: http://0.0.0.0:3001
🔌 Gateway: /api/gateway
💬 Google Chat Webhook: /webhook/google-chat
🌐 Relay Integration: http://localhost:3000
🌍 Network Access: ENABLED (all interfaces)
🔗 Local IPs: http://51.81.34.78:3001, http://172.21.0.1:3001
🦎 Tailscale: http://100.99.47.10:3001
🖥️  Hostname: http://vps5:3001

✨ Ready to accept connections
```

## API Usage Examples

### From Local Machine

```bash
# Via Tailscale hostname
curl -X POST http://vps5:3001/api/gateway \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "tailscale-session",
    "userId": "user@example.com",
    "interface": "web",
    "command": "/ultrapilot build me a REST API"
  }'
```

### From Other Tailscale Device (e.g., dev-2 Windows)

```bash
# Access vps5 from dev-2 via Tailscale
curl http://vps5:3001/health

# Send Ultrapilot command
curl -X POST http://vps5:3001/api/gateway \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "remote-session",
    "userId": "user@example.com",
    "interface": "web",
    "command": "/ultra-team N=3 refactor code"
  }'
```

### From Public Internet (with firewall open)

```bash
curl -X POST http://51.81.34.78:3001/api/gateway \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "public-session",
    "userId": "user@example.com",
    "interface": "web",
    "command": "/ultra-review src/"
  }'
```

## Talismans Alias Configuration

### What is Talismans?

Talismans is a feature that allows you to reference Tailscale devices by hostname instead of IP.

### Configuration

**1. Enable MagicDNS (if not already):**
```bash
tailscale set --hostname=vps5
tailscale up
```

**2. Access via hostname:**
```bash
# From any device in Tailnet
curl http://vps5:3001/health

# With MagicDNS
curl http://vps5.hscheema.ts.net:3001/health
```

**3. Test alias:**
```bash
# Should resolve to Tailscale IP
ping vps5
# PING vps5 (100.99.47.10): 56 data bytes

# Test UltraX access
curl http://vps5:3001/api/relay/commands
```

## Multi-Server Deployment

### Access Multiple VPS Instances

With Tailscale, you can easily access UltraX across all your VPS instances:

```bash
# VPS1
curl http://vps1:3001/health

# VPS2
curl http://vps2:3001/health

# VPS3
curl http://vps3:3001/health

# VPS4
curl http://vps4:3001/health

# VPS5 (this server)
curl http://vps5:3001/health
```

### Centralized Management

Create a management script to access all instances:

```bash
#!/bin/bash
# check-all-ultrax.sh

for vps in vps1 vps2 vps3 vps4 vps5; do
  echo "Checking $vps..."
  curl -s http://${vps}:3001/health | jq -c "{host: \"$vps\", status}"
done
```

## Security Considerations

### Tailscale Security

✅ **Benefits:**
- End-to-end encryption
- Private network (not exposed to public internet)
- Access control via Tailscale ACLs
- No need for VPN configuration

### Access Control

**1. Tailscale ACLs:**

Control which devices can access UltraX:

```json
{
  "acls": [
    {
      "action": "accept",
      "src": ["group:admin"],
      "dst": ["tag:ultrax-server:3001"]
    }
  ],
  "tags": [
    {
      "name": "tag:ultrax-server",
      "value": ["vps5"]
    }
  ]
}
```

**2. Device Approval:**

Only approved devices can join your Tailnet:
```bash
tailscale status
# Shows all connected devices
```

**3. Key Expiry:**

Tailscale keys automatically expire for security

### Firewall Configuration

**For Tailscale (recommended):**
- No firewall changes needed (encrypted tunnel)
- Works even if port 3001 is blocked publicly

**For Public Access (optional):**
```bash
# Open port 3001 for public access
sudo ufw allow 3001/tcp
```

## Monitoring

### Check Tailscale Status

```bash
# Show all devices in Tailnet
tailscale status

# Show current device
tailscale status --self

# Show peers
tailscale status --peers

# Check connectivity
tailscale ping vps5
```

### Monitor UltraX via Tailscale

```bash
# Health check from another Tailscale device
watch -n 5 'curl -s http://vps5:3001/health | jq .'

# Session count
watch -n 5 'curl -s http://vps5:3001/health | jq .sessions'
```

### Log Tailscale Access

```bash
# View connection logs
sudo journalctl -u ultrax-server -f | grep "Tailscale"

# Monitor access patterns
sudo journalctl -u ultrax-server --since "1 hour ago" | grep -E "POST|GET"
```

## Troubleshooting

### Cannot Access via Tailscale

**1. Check Tailscale status:**
```bash
tailscale status
# Verify vps5 is listed and active
```

**2. Check UltraX is running:**
```bash
sudo systemctl status ultrax-server
curl http://localhost:3001/health
```

**3. Test connectivity:**
```bash
# Ping via Tailscale
tailscale ping vps5

# Direct IP test
curl http://100.99.47.10:3001/health

# Hostname test
curl http://vps5:3001/health
```

**4. Check network bindings:**
```bash
ss -tlnp | grep :3001
# Should show: *:3001 (all interfaces)
```

### hostname Not Resolving

**1. Enable MagicDNS:**
```bash
tailscale set --hostname=vps5
tailscale up
```

**2. Check DNS:**
```bash
# Test DNS resolution
nslookup vps5.hscheema.ts.net

# Or with dig
dig vps5.hscheema.ts.net
```

**3. Use IP directly:**
```bash
curl http://100.99.47.10:3001/health
```

### Connection Refused

**1. Verify service is running:**
```bash
sudo systemctl is-active ultrax-server
```

**2. Check port is listening:**
```bash
ss -tlnp | grep :3001
```

**3. Restart service:**
```bash
sudo systemctl restart ultrax-server
```

## Best Practices

### 1. Always Use Tailscale for Admin Access

- ✅ Secure, encrypted tunnel
- ✅ No public exposure needed
- ✅ Built-in access control

### 2. Keep Firewall Closed for Public Access

- Only open port 3001 if absolutely necessary
- Use Tailscale for all administrative access
- Reduces attack surface

### 3. Monitor Access Logs

```bash
# Monitor all access attempts
sudo journalctl -u ultrax-server -f
```

### 4. Use Tailscale ACLs

Control who can access UltraX:
- Limit to specific devices
- Require admin group membership
- Set time-based access rules

### 5. Regular Updates

```bash
# Update Tailscale
sudo apt update && sudo apt install tailscale

# Update UltraX
cd ~/.claude/plugins/ultrapilot
git pull
sudo systemctl restart ultrax-server
```

## Summary

✅ **Tailscale Integration Complete:**
- UltraX Server listens on **all interfaces (0.0.0.0)** by default
- **Tailscale IP:** `100.99.47.10:3001`
- **Hostname:** `vps5:3001`
- **MagicDNS:** `vps5.hscheema.ts.net:3001`

🔗 **Access Methods:**
1. Direct Tailscale IP: `http://100.99.47.10:3001`
2. Hostname alias: `http://vps5:3001`
3. MagicDNS: `http://vps5.hscheema.ts.net:3001`
4. From any Tailnet device

🦎 **Benefits:**
- Encrypted tunnel access
- No firewall changes needed
- Private network only
- Works from anywhere
- Multi-server support

📚 **Documentation:**
- NETWORK-ACCESS.md - General network access guide
- VPS5-SETUP.md - VPS5 specific configuration
- TAILSCALE docs: https://tailscale.com/kb

---

**Status:** ✅ Tailscale integration fully enabled and configured!
