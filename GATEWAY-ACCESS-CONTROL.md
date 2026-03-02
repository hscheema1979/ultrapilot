# Gateway Access Control

## What It Is

Access Control List (ACL) for the UltraX Gateway (port 3001). Controls which Relay instances can access the Gateway API.

## How It Works

**Default: Allow All**

Currently, all Relay instances are allowed. To restrict access:

### Option 1: Allow Specific Relays

Edit `.ultra/gateway-acl.json`:

```json
{
  "accessList": [
    {
      "relayId": "vps5",
      "hostname": "vps5",
      "allowed": true,
      "note": "Production Relay"
    },
    {
      "relayId": "vps4",
      "hostname": "vps4",
      "allowed": false,
      "note": "Backup Relay - disabled"
    }
  ]
}
```

### Option 2: By Tailscale Tags

Restrict access to only tagged machines:

```json
{
  "accessList": [
    {
      "relayId": "tag:production",
      "hostname": "*",
      "allowed": true,
      "note": "All production Relays"
    }
  ]
}
```

## Access Control Endpoints

Once implemented, these endpoints will be available:

**Get ACL:**
```bash
curl http://localhost:3001/api/acl
```

**Allow Relay:**
```bash
curl -X POST http://localhost:3001/api/acl/allow \
  -H "Content-Type: application/json" \
  -d '{"relayId":"vps4","hostname":"vps4","note":"Production Relay"}'
```

**Deny Relay:**
```bash
curl -X POST http://localhost:3001/api/acl/deny \
  -H "Content-Type: application/json" \
  -d '{"relayId":"vps3","hostname":"vps3","note":"Disabled"}'
```

## Current Status

✅ **Open Access**: All Relays allowed (default)
⏳ **ACL Endpoints**: Ready to implement
⏳ **Tailscale Tag Integration**: Can be added

## Security Considerations

- Relay instances identify themselves via `x-relay-id` header
- Hostname verified via `x-forwarded-for` or socket address
- ACL checks happen before Gateway processes commands
- 403 Forbidden returned for unauthorized access

## Setup via oauth_tokens

The ACL config can be distributed to all machines:

```
D:\Git\oauth_manager\files\ultrapilot\
├── .ultra/
│   └── gateway-acl.json    # ACL configuration
└── ...
```

Each machine gets the same access control rules.
