# Enterprise Architecture Implementation Plan
**Ultrapilot Distributed System - Primary Node Perspective**

## Executive Summary

**EA Role**: Primary Node (vps5) as Central Coordination Hub
**Architecture Pattern**: Hub-and-Spoke with Active Backup Nodes
**Scope**: Multi-server Relay Web UI cluster with shared workspaces
**Timeline**: 3-Phase rollout over 2 weeks

## Architecture Overview

### Current State (Phase 0)
```
┌─────────────────────────────────────────────────────────┐
│                    vps5 (PRIMARY)                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Relay Web UI (port 3000)                      │   │
│  │  UltraX Gateway (port 3001)                    │   │
│  │  Ultrapilot Plugin                             │   │
│  │  Ultra-Autoloop (Heartbeat Driver)             │   │
│  │  Domain: ultrax-dev                            │   │
│  │  Workspaces: Local (~/.claude-web-interfaces/) │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Access: http://vps5:3000 (Relay)                       │
│          http://vps5:3001 (Gateway)                     │
└─────────────────────────────────────────────────────────┘

Issues:
- Single point of failure
- No redundancy
- Manual failover required
```

### Target State (Phase 3)
```
                    ┌──────────────────────────────────┐
                    │   Load Balancer (HAProxy)        │
                    │   vps5:80 (Primary Entry Point)  │
                    └────────────┬─────────────────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
                ▼                ▼                ▼
        ┌───────────┐    ┌───────────┐    ┌───────────┐
        │  vps5     │    │  vps4     │    │  vps3     │
        │ (PRIMARY) │    │ (BACKUP)  │    │ (BACKUP)  │
        └───────────┘    └───────────┘    └───────────┘
        │                │                │
        ├─ Relay :3000  ├─ Relay :3000  ├─ Relay :3000
        ├─ Gateway:3001 ├─ Gateway:3001 ├─ Gateway:3001
        ├─ Autoloop     ├─ Mount SSHFS  ├─ Mount SSHFS
        └─ Master NFS   └─ From vps5    └─ From vps5
                │                │                │
                └────────────────┴────────────────┘
                                 │
                    Shared Workspace Storage
                    (NFS on vps5 + SSHFS mounts)

Features:
- Zero single points of failure
- Automatic failover (HAProxy)
- Shared workspaces
- Active health monitoring
- 99.9% uptime target
```

## Implementation Phases

### Phase 1: Foundation (Week 1, Days 1-3)

**Objective**: Add vps4 as active backup with manual failover

**Architecture**:
```
vps5 (Primary) ←─────→ vps4 (Backup)
     │                     │
     ├─ Relay :3000       ├─ Relay :3000
     ├─ Gateway:3001      ├─ Mount SSHFS
     └─ Workspaces (NFS)  └─ From vps5
```

**Tasks**:

#### Day 1: Prepare vps4 Infrastructure
- [ ] **1.1 System Setup** (vps4)
  - Install Node.js, npm, git
  - Setup Tailscale (verify connectivity to vps5)
  - Install SSHFS
  - Create system user for Relay

- [ ] **1.2 Deploy Ultrapilot Plugin** (vps4)
  - Clone repository: `git clone https://github.com/hscheema1979/ultrapilot.git`
  - Run installer: `node scripts/install.mjs`
  - Verify plugin loads correctly

- [ ] **1.3 Setup Workspace Sharing** (vps4)
  - Test SSHFS mount to vps5
  - Mount vps5 workspaces: `~/.claude-web-interfaces/`
  - Test read/write access
  - Add mount to `/etc/fstab` for persistence

#### Day 2: Deploy Relay on vps4
- [ ] **2.1 Copy Relay Installation** (vps4)
  - Copy from vps5: `rsync -avz vps5:~/.claude-web-interfaces/claude-relay/`
  - Install dependencies: `npm install`
  - Verify Relay starts: `node bin/cli.js --dangerously-skip-permissions`

- [ ] **2.2 Configuration** (vps4)
  - Copy config from vps5
  - Update host-specific settings
  - Test Relay HTTP on :3000
  - Create startup script: `~/start-relay-vps4.sh`

- [ ] **2.3 Integration Testing** (vps4 + vps5)
  - Test Relay access on vps4:3000
  - Verify workspace files sync
  - Test Ultrapilot commands on both servers
  - Verify session persistence

#### Day 3: Health Monitoring & Documentation
- [ ] **3.1 Health Checks** (vps4)
  - Create health check script: `~/check-relay-vps4.sh`
  - Test Relay process monitoring
  - Test workspace mount monitoring
  - Test connectivity to vps5

- [ ] **3.2 Documentation** (All)
  - Document vps4 setup procedure
  - Create runbook for failover scenarios
  - Update README with backup server info
  - Create troubleshooting guide

- [ ] **3.3 Testing** (All)
  - Manual failover test (stop vps5, use vps4)
  - Workspace sync verification
  - Performance testing
  - Sign-off on Phase 1

**Deliverables**:
- ✅ vps4 operational as backup
- ✅ Shared workspaces via SSHFS
- ✅ Manual failover capability
- ✅ Health monitoring scripts
- ✅ Complete documentation

**Success Criteria**:
- vps4 can run Relay independently
- Workspaces sync correctly
- Manual failover works in < 5 minutes
- Health checks functional

---

### Phase 2: High Availability (Week 1, Days 4-5)

**Objective**: Add automatic failover with HAProxy load balancer

**Architecture**:
```
        ┌────────────────────────┐
        │  HAProxy (vps5:80)     │
        └───────┬────────────────┘
                │
        ┌───────┴───────┐
        ▼               ▼
    vps5:3000       vps4:3000
   (Primary)       (Backup)
```

**Tasks**:

#### Day 4: HAProxy Setup
- [ ] **4.1 Install HAProxy** (vps5)
  - Install HAProxy: `sudo apt install haproxy`
  - Backup default config
  - Create custom configuration

- [ ] **4.2 Configure Load Balancer** (vps5)
  - Configure frontend (port 80)
  - Configure backend (vps5:3000, vps4:3000)
  - Enable health checks
  - Enable session affinity (sticky sessions)
  - Enable stats page (port 8404)

- [ ] **4.3 HAProxy Configuration**
```bash
frontend relay_frontend
    bind *:80
    default_backend relay_servers

backend relay_servers
    balance roundrobin
    cookie SRV_ID insert
    server vps5 vps5:3000 cookie vps5 check inter 2s rise 3 fall 3
    server vps4 vps4:3000 cookie vps4 check inter 2s rise 3 fall 3

listen stats
    bind *:8404
    stats enable
    stats uri /
    stats refresh 10s
```

#### Day 5: Testing & Integration
- [ ] **5.1 HAProxy Testing**
  - Test load balancing: `curl http://vps5`
  - Verify session stickiness
  - Test health checks
  - Monitor stats page: `http://vps5:8404`

- [ ] **5.2 Failover Testing**
  - Stop Relay on vps5
  - Verify HAProxy redirects to vps4
  - Restart Relay on vps5
  - Verify HAProxy detects recovery
  - Test multiple failover cycles

- [ ] **5.3 Integration**
  - Update Autoloop to monitor HAProxy
  - Configure alerts for HAProxy failures
  - Update documentation
  - Final testing

**Deliverables**:
- ✅ HAProxy load balancer operational
- ✅ Automatic failover working
- ✅ Session persistence configured
- ✅ Health monitoring integrated
- ✅ Performance metrics available

**Success Criteria**:
- HAProxy distributes traffic correctly
- Automatic failover < 10 seconds
- Zero session loss during failover
- Stats page functional

---

### Phase 3: Full Cluster (Week 2)

**Objective**: Add vps3 as tertiary backup with NFS storage

**Architecture**:
```
        ┌────────────────────────┐
        │  HAProxy (vps5:80)     │
        └───────┬────────────────┘
                │
        ┌───────┼───────┐
        ▼       ▼       ▼
    vps5:3000 vps4:3000 vps3:3000
   (Primary) (Backup) (Backup)
        │         │         │
        └─────────┴─────────┘
                │
         NFS Storage (vps5)
```

**Tasks**:

#### Day 6-7: vps3 Setup
- [ ] **6.1 Deploy vps3** (Similar to Phase 1)
  - System setup (Node.js, Tailscale, SSHFS)
  - Deploy Ultrapilot plugin
  - Mount workspaces from vps5 (NFS)
  - Deploy Relay Web UI
  - Health checks

- [ ] **6.2 NFS Server Setup** (vps5)
  - Install NFS server: `sudo apt install nfs-kernel-server`
  - Export workspace directories
  - Configure exports: `/etc/exports`
  - Test NFS from vps4 and vps3

- [ ] **6.3 Migration to NFS** (All)
  - Migrate from SSHFS to NFS mounts
  - Test read/write performance
  - Verify all servers can access workspaces
  - Update mount configurations

#### Day 8-9: HAProxy Expansion
- [ ] **7.1 Update HAProxy Config** (vps5)
  - Add vps3:3000 to backend
  - Test 3-server load balancing
  - Verify health checks for all 3 servers

- [ ] **7.2 Advanced Testing**
  - Test simultaneous multi-server failures
  - Test worst-case scenarios (2 servers down)
  - Performance testing under load
  - Recovery testing

#### Day 10: Finalization
- [ ] **8.1 Documentation**
  - Update all documentation for 3-server cluster
  - Create operational runbooks
  - Create disaster recovery procedures
  - Create monitoring dashboards

- [ ] **8.2 Monitoring & Alerts**
  - Setup comprehensive monitoring
  - Configure alerts (email, Relay notifications)
  - Create uptime dashboards
  - Performance metrics collection

- [ ] **8.3 Final Testing**
  - End-to-end testing
  - Disaster recovery drill
  - Performance validation
  - Sign-off on production readiness

**Deliverables**:
- ✅ 3-server cluster operational
- ✅ NFS shared storage
- ✅ Can survive 2 server failures
- ✅ Comprehensive monitoring
- ✅ Complete documentation

**Success Criteria**:
- 3 servers all operational
- NFS storage performing well
- HAProxy load balancing to all 3
- Can lose any 2 servers, still operational
- 99.9% uptime achieved

---

## Server Roles & Responsibilities

### vps5 (Primary / Hub)
**Role**: Central Coordination Hub

**Responsibilities**:
- Load balancer (HAProxy on port 80)
- Primary Relay instance (port 3000)
- Primary UltraX Gateway (port 3001)
- NFS server (workspace storage)
- Ultra-Autoloop heartbeat driver
- Primary monitoring & alerting
- Master copy of workspaces

**Resources**:
- CPU: 2 cores
- RAM: 4GB
- Storage: 50GB (workspaces)
- Network: 100 Mbps

### vps4 (Backup / Spoke)
**Role**: Active Backup Server

**Responsibilities**:
- Backup Relay instance (port 3000)
- Backup UltraX Gateway (port 3001)
- NFS client (mount workspaces from vps5)
- Passive standby for failover
- Health check reporting

**Resources**:
- CPU: 2 cores
- RAM: 4GB
- Storage: 20GB (cache)
- Network: 100 Mbps

### vps3 (Backup / Spoke)
**Role**: Tertiary Backup Server

**Responsibilities**:
- Tertiary Relay instance (port 3000)
- Tertiary UltraX Gateway (port 3001)
- NFS client (mount workspaces from vps5)
- Passive standby for failover
- Health check reporting

**Resources**:
- CPU: 2 cores
- RAM: 4GB
- Storage: 20GB (cache)
- Network: 100 Mbps

---

## Technology Stack

### Load Balancing
- **HAProxy 2.x**: High-performance load balancer
- **Session Affinity**: Cookie-based stickiness
- **Health Checks**: HTTP /health endpoint every 2s
- **Stats**: Real-time metrics on port 8404

### Storage
- **NFS v4**: Shared workspace storage
- **SSHFS**: Fallback for Phase 1
- **Local Cache**: Each server has local cache

### Monitoring
- **Ultra-Autoloop**: Built-in health monitoring (60s cycles)
- **HAProxy Stats**: Load balancer metrics
- **Custom Scripts**: Health checks, alerts

### Communication
- **Tailscale VPN**: Secure inter-server communication
- **SSH**: Management access
- **HTTP**: Relay and Gateway communication

---

## Failure Scenarios & Recovery

### Scenario 1: vps5 Relay Fails
**Detection**: HAProxy health check fails (within 6 seconds)
**Impact**: Traffic redirects to vps4
**Recovery**:
1. HAProxy marks vps5 as down
2. All traffic goes to vps4
3. Admin alerted via Autoloop
4. Fix vps5 Relay
5. HAProxy detects recovery (within 6 seconds)
6. Traffic resumes to both servers

**Downtime**: < 10 seconds

### Scenario 2: vps5 Complete Failure
**Detection**: HAProxy + Autoloop detect failure
**Impact**: Load balancer unavailable, Relay unavailable
**Recovery**:
1. Failover to direct access: http://vps4:3000
2. Restart HAProxy on vps4 (backup)
3. Update DNS to point to vps4
4. Investigate vps5 failure
5. Restore vps5
6. Failback to vps5

**Downtime**: 5-10 minutes (manual failover)

### Scenario 3: vps5 and vps4 Both Fail
**Detection**: HAProxy health checks fail for both
**Impact**: Only vps3 operational
**Recovery**:
1. HAProxy shows no healthy backends
2. Direct access: http://vps3:3000
3. Investigate both vps5 and vps4
4. Restore servers
5. Verify recovery

**Downtime**: 10-15 minutes (manual intervention)

### Scenario 4: Network Partition
**Detection**: Servers can't reach each other
**Impact**: Split-brain scenario
**Recovery**:
1. Designate vps5 as primary (quorum)
2. Backup servers go read-only
3. Resolve network issue
4. Resync workspaces if needed
5. Resume normal operation

**Downtime**: Variable (depends on network issue)

---

## Monitoring & Alerting

### Health Metrics

**Relay Instances**:
- HTTP response time
- Process running
- Port 3000 listening
- Error rate

**HAProxy**:
- Backend health
- Response time
- Connection count
- Queue length

**Storage**:
- NFS mount status
- Disk usage
- I/O performance
- Sync status

**System**:
- CPU usage
- Memory usage
- Network throughput
- Disk I/O

### Alerting

**Critical Alerts** (Immediate):
- Any Relay instance down
- HAProxy down
- NFS storage unavailable
- Server unreachable

**Warning Alerts** (Within 1 hour):
- High CPU (> 80%)
- High memory (> 80%)
- Disk space low (< 20%)
- High response time (> 1s)

**Info Alerts** (Daily digest):
- Health check summary
- Performance metrics
- Uptime statistics

---

## Implementation Timeline

| Week | Phase | Tasks | Deliverable |
|------|-------|-------|-------------|
| 1, Day 1-3 | Phase 1 | vps4 setup, SSHFS, Relay deployment | 2-server cluster (manual failover) |
| 1, Day 4-5 | Phase 2 | HAProxy setup, automatic failover | Load-balanced 2-server cluster |
| 2, Day 6-9 | Phase 3 | vps3 setup, NFS, HAProxy expansion | 3-server cluster with NFS |
| 2, Day 10 | Finalize | Documentation, monitoring, testing | Production-ready system |

---

## Risk Assessment

### Technical Risks

**Risk**: SSHFS performance issues
**Impact**: Slow workspace access
**Mitigation**: Migrate to NFS in Phase 3
**Probability**: Medium

**Risk**: Session persistence issues
**Impact**: Users disconnected during failover
**Mitigation**: HAProxy cookie stickiness
**Probability**: Low

**Risk**: NFS single point of failure
**Impact**: All servers lose workspace access
**Mitigation**: DRBD replication (future)
**Probability**: Low

### Operational Risks

**Risk**: Complexity increases
**Impact**: Harder to troubleshoot
**Mitigation**: Comprehensive documentation
**Probability**: High

**Risk**: Configuration drift
**Impact**: Inconsistent behavior across servers
**Mitigation**: Git-based config management
**Probability**: Medium

---

## Success Metrics

### Availability
- **Target**: 99.9% uptime
- **Measurement**: HTTP uptime monitoring
- **Current**: ~99% (single server)

### Performance
- **Target**: < 500ms response time
- **Measurement**: HAProxy stats
- **Current**: ~200ms (single server)

### Reliability
- **Target**: Zero data loss
- **Measurement**: Workspace sync checks
- **Current**: 100% (single server)

### Recovery Time
- **Target**: < 10 seconds automatic failover
- **Measurement**: HAProxy health check interval
- **Current**: N/A (manual failover)

---

## Next Steps

### Immediate Actions (This Week)
1. ✅ **Review and approve this EA plan**
2. ⏳ **Schedule Phase 1 implementation** (vps4 setup)
3. ⏳ **Assign responsibilities**
4. ⏳ **Set up communication channels**

### This Week
1. Deploy vps4 as backup server
2. Setup SSHFS workspace sharing
3. Test manual failover
4. Complete Phase 1

### Next Week
1. Deploy HAProxy on vps5
2. Configure automatic failover
3. Complete Phase 2
4. Plan Phase 3 (vps3 + NFS)

---

## Appendix: Commands Reference

### vps4 Setup
```bash
# SSH to vps4
ssh vps4

# Clone Ultrapilot
cd ~/.claude/plugins/
git clone https://github.com/hscheema1979/ultrapilot.git
cd ultrapilot

# Run automated setup
./setup-backup-server.sh
```

### Health Check
```bash
# On vps4
~/check-relay-vps4.sh

# On vps5 (via Autoloop)
tail -f ~/.claude/plugins/ultrapilot/.ultra/state/autoloop.log
```

### Manual Failover
```bash
# If vps5 goes down, access vps4 directly:
http://vps4:3000

# Or restart HAProxy on v4:
sudo systemctl restart haproxy
```

---

**Plan Status**: Ready for Execution
**Approval Required**: Server resources, timeline
**Contact**: Claude Code (UltraX Domain Agent)
**Last Updated**: 2025-03-02
**Version**: 1.0
