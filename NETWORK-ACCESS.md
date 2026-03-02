# UltraX Network Access Configuration

## Overview

UltraX Server is now configured to accept connections from **all network interfaces** (0.0.0.0), enabling access via:

- ✅ **Localhost** (http://localhost:3001)
- ✅ **Local network** (http://0.0.0.0:3001)
- ✅ **External IP** (http://51.81.34.78:3001)
- ✅ **Talismans alias** (configured domain)
- ✅ **Domain names** (any configured domains pointing to this server)

## Configuration

### Systemd Service

**File:** `/etc/systemd/system/ultrax-server.service`

**Key Configuration:**
```ini
[Service]
Environment=HOST=0.0.0.0
Environment=PORT=3001
Environment=RELAY_URL=http://localhost:3000
```

### Server Configuration

**File:** `src/server.ts`

The server now reads the `HOST` environment variable:
```typescript
const host = process.env.HOST || 'localhost';
this.app.listen(port, host, () => {
  // Server startup
});
```

## Access Methods

### 1. Local Access

```bash
curl http://localhost:3001/health
```

### 2. Network Interface Access

```bash
curl http://0.0.0.0:3001/health
```

### 3. External IP Access

```bash
curl http://51.81.34.78:3001/health
```

### 4. Talismans Alias Access

If you have a talismans alias configured (e.g., `ultrax.vps5.example.com`):

```bash
curl http://ultrax.vps5.example.com:3001/health
```

### 5. Domain Access

If you have a domain pointing to this server:

```bash
curl http://your-domain.com:3001/health
```

## API Endpoints (All Interfaces)

All endpoints are accessible via any interface:

### Health Check
```bash
# Local
curl http://localhost:3001/health

# External
curl http://51.81.34.78:3001/health

# Domain
curl http://your-domain.com:3001/health
```

### Gateway API
```bash
# Send Ultrapilot command
curl -X POST http://51.81.34.78:3001/api/gateway \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "remote-session",
    "userId": "user@example.com",
    "interface": "web",
    "command": "/ultrapilot build me a REST API"
  }'
```

### Session Management
```bash
# Get session status
curl http://51.81.34.78:3001/api/session/remote-session

# Switch interface
curl -X POST http://51.81.34.78:3001/api/session/remote-session/switch \
  -H "Content-Type: application/json" \
  -d '{"targetInterface": "chat"}'

# Terminate session
curl -X DELETE http://51.81.34.78:3001/api/session/remote-session
```

### Relay Integration
```bash
# Get available commands
curl http://51.81.34.78:3001/api/relay/commands

# Get user sessions
curl http://51.81.34.78:3001/api/relay/sessions/user@example.com
```

### Google Chat Webhook
```bash
# Webhook endpoint (for Google Cloud configuration)
curl -X POST http://51.81.34.78:3001/webhook/google-chat \
  -H "Content-Type: application/json" \
  -d '{
    "type": "MESSAGE",
    "event": {
      "user": {"name": "users/test", "displayName": "Test User"},
      "message": {
        "text": "@UltraX test command",
        "space": {"name": "spaces/test"},
        "thread": {"name": "spaces/test/threads/thread"}
      }
    }
  }'
```

## Firewall Configuration

Ensure port 3001 is open in your firewall:

### UFW (Uncomplicated Firewall)
```bash
# Allow port 3001
sudo ufw allow 3001/tcp

# Check status
sudo ufw status
```

### iptables
```bash
# Allow port 3001
sudo iptables -A INPUT -p tcp --dport 3001 -j ACCEPT

# Save rules
sudo iptables-save | sudo tee /etc/iptables/rules.v4
```

### firewalld
```bash
# Allow port 3001
sudo firewall-cmd --permanent --add-port=3001/tcp
sudo firewall-cmd --reload
```

## Security Considerations

### 1. CORS Configuration

Currently, CORS is set to allow Relay:
```typescript
res.header('Access-Control-Allow-Origin', this.config.relayUrl || '*');
```

**For production**, consider restricting to specific origins:
```typescript
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-domain.com',
  'https://ultrax.your-domain.com'
];
const origin = req.headers.origin;
if (allowedOrigins.includes(origin)) {
  res.header('Access-Control-Allow-Origin', origin);
}
```

### 2. Rate Limiting

Consider adding rate limiting to prevent abuse:
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

### 3. Authentication

For production, add authentication:
```typescript
// Basic auth
app.use((req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !validateAuth(auth)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});
```

### 4. HTTPS

For production use, consider:
- **Reverse proxy** (nginx/Apache) with SSL
- **Let's Encrypt** certificate
- **Terminating SSL at proxy**, forwarding HTTP to UltraX

### Nginx Reverse Proxy Example

```nginx
server {
    listen 443 ssl http2;
    server_name ultrax.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/ultrax.your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ultrax.your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Testing Network Access

### Test from Local Machine
```bash
# Test all interfaces
for host in localhost 0.0.0.0 51.81.34.78; do
  echo "Testing $host:3001..."
  curl -s http://$host:3001/health | jq -c '{status, uptime}'
done
```

### Test from Remote Machine
```bash
# Test external access
curl http://51.81.34.78:3001/health

# Test with domain (if configured)
curl http://your-domain.com:3001/health
```

### Test with talismans alias
```bash
# If talismans alias is configured
curl http://ultrax.vps5.example.com:3001/health
```

## Monitoring

### Check Listening Ports
```bash
# Check if port 3001 is listening
ss -tlnp | grep :3001

# Expected output:
# LISTEN 0  511  *:3001  *:*  users:(("node",pid=1234,fd=28))
```

### Monitor Connections
```bash
# Monitor active connections
watch -n 1 'ss -tnp | grep :3001'

# Count connections
ss -tn | grep :3001 | wc -l
```

### Service Status
```bash
# Check service status
sudo systemctl status ultrax-server

# View logs
sudo journalctl -u ultrax-server -f

# Check for errors
sudo journalctl -u ultrax-server -p err
```

## Troubleshooting

### Cannot Access Externally

1. **Check firewall:**
   ```bash
   sudo ufw status
   sudo iptables -L -n | grep 3001
   ```

2. **Check service is listening:**
   ```bash
   ss -tlnp | grep :3001
   ```

3. **Check service status:**
   ```bash
   sudo systemctl status ultrax-server
   ```

4. **Test locally:**
   ```bash
   curl http://localhost:3001/health
   ```

5. **Check HOST environment:**
   ```bash
   sudo systemctl show ultrax-server | grep HOST
   ```

### Connection Refused

1. **Verify service is running:**
   ```bash
   sudo systemctl is-active ultrax-server
   ```

2. **Check port is correct:**
   ```bash
   sudo grep PORT /etc/systemd/system/ultrax-server.service
   ```

3. **Restart service:**
   ```bash
   sudo systemctl restart ultrax-server
   ```

### CORS Errors

1. **Check Relay URL:**
   ```bash
   sudo grep RELAY_URL /etc/systemd/system/ultrax-server.service
   ```

2. **Verify CORS headers:**
   ```bash
   curl -I http://localhost:3001/health
   ```

3. **Update allowed origins** in server configuration if needed

## Summary

✅ **Network Access Status:**
- UltraX Server listening on **all interfaces** (0.0.0.0:3001)
- Accessible via **localhost, IP, and domain names**
- **Talismans alias** support enabled
- **External API calls** supported
- **Google Chat webhook** accessible from internet

🔧 **Management:**
```bash
# Restart service
sudo systemctl restart ultrax-server

# View logs
sudo journalctl -u ultrax-server -f

# Update configuration
sudo nano /etc/systemd/system/ultrax-server.service
sudo systemctl daemon-reload
sudo systemctl restart ultrax-server
```

🌐 **External Access:**
- **IP:** http://51.81.34.78:3001
- **Domain:** http://your-domain.com:3001
- **Talismans:** http://ultrax.vps5.example.com:3001

---

**Status:** ✅ Network bindings enabled for talismans alias and external access!
