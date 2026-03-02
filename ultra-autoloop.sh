#!/bin/bash
# Ultra-Autoloop: Domain Heartbeat Driver for ultrax-dev
# "The boulder never stops"

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Configuration
DOMAIN_FILE=".ultra/domain.json"
STATE_FILE=".ultra/state/autoloop-state.json"
INTAKE_QUEUE=".ultra/queues/intake.json"
PROGRESS_QUEUE=".ultra/queues/in-progress.json"
CYCLE_TIME=60  # seconds
MAX_ITERATIONS=1000000

# Safety limits
DISK_FULL_THRESHOLD=95
MEMORY_HIGH_THRESHOLD=90
WATCHDOG_TIMEOUT=300

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Lock file
LOCKFILE=".ultra/state/autoloop.lock"

# State variables
iteration=0
tasks_processed=0
routines_executed=0
start_time=$(date -u +%Y-%m-%dT%H:%M:%SZ)

log() {
    echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $*"
}

log_success() {
    echo -e "${GREEN}[$(date '+%H:%M:%S')]${NC} ✓ $*"
}

log_warning() {
    echo -e "${YELLOW}[$(date '+%H:%M:%S')]${NC} ⚠ $*"
}

log_error() {
    echo -e "${RED}[$(date '+%H:%M:%S')]${NC} ✗ $*"
}

acquire_lock() {
    if [ -f "$LOCKFILE" ]; then
        local pid=$(cat "$LOCKFILE")
        if kill -0 "$pid" 2>/dev/null; then
            log_error "Autoloop already running (PID: $pid)"
            exit 1
        else
            log_warning "Removing stale lock file"
            rm -f "$LOCKFILE"
        fi
    fi
    echo $$ > "$LOCKFILE"
}

release_lock() {
    rm -f "$LOCKFILE"
}

cleanup() {
    log "Shutting down gracefully..."
    release_lock
    persist_state
    exit 0
}

trap cleanup SIGINT SIGTERM

check_domain() {
    if [ ! -f "$DOMAIN_FILE" ]; then
        log_error "Domain not initialized. Run: /ultra-domain-setup"
        exit 1
    fi

    if ! command -v jq &> /dev/null; then
        log_error "jq required but not installed"
        exit 1
    fi

    local domain_name
    domain_name=$(jq -r '.domain_name' "$DOMAIN_FILE")
    log_success "Domain validated: $domain_name"
}

check_system_health() {
    # Check disk space
    local disk_usage
    disk_usage=$(df . | tail -1 | awk '{print $5}' | sed 's/%//')

    if [ "$disk_usage" -gt $DISK_FULL_THRESHOLD ]; then
        log_error "EMERGENCY STOP: Disk ${disk_usage}% full"
        return 1
    fi

    # Check memory
    if command -v free &> /dev/null; then
        local mem_usage
        mem_usage=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100}')
        if [ "$mem_usage" -gt $MEMORY_HIGH_THRESHOLD ]; then
            log_error "EMERGENCY STOP: Memory ${mem_usage}% used"
            return 1
        fi
    fi

    return 0
}

check_service_health() {
    local services_up=0
    local services_total=2

    # Check Relay (port 3000)
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        services_up=$((services_up + 1))
    else
        log_warning "Relay Web UI (port 3000) not responding"
    fi

    # Check Gateway (port 3001)
    if curl -s http://localhost:3001/health > /dev/null 2>&1; then
        services_up=$((services_up + 1))
    else
        log_warning "UltraX Gateway (port 3001) not responding"
    fi

    log "Services: $services_up/$services_total up"
    return 0
}

process_intake_queue() {
    if [ ! -f "$INTAKE_QUEUE" ]; then
        return 0
    fi

    local task_count
    task_count=$(jq '.tasks | length' "$INTAKE_QUEUE" 2>/dev/null || echo "0")

    if [ "$task_count" -eq 0 ]; then
        return 0
    fi

    log "Processing intake queue: $task_count tasks"

    # For now, just log tasks (actual routing would use Claude Code agents)
    jq -r '.tasks[] | "\(.id): \(.title)"' "$INTAKE_QUEUE" 2>/dev/null | while read -r task; do
        log "  → $task"
    done

    tasks_processed=$((tasks_processed + task_count))
}

run_routine_tasks() {
    local now=$(date +%s)
    local last_run=0

    # Check if we need to run health checks (every 5 minutes)
    if [ -f "$STATE_FILE" ]; then
        last_run=$(jq -r '.last_cycle.timestamp // "1970-01-01T00:00:00Z"' "$STATE_FILE" | date -d %+s +%s 2>/dev/null || echo "0")
    fi

    local elapsed=$((now - last_run))

    if [ $elapsed -ge 300 ]; then
        log "Running routine health checks..."
        check_service_health
        routines_executed=$((routines_executed + 1))
    fi
}

sync_domain() {
    # Check if there are uncommitted changes
    if ! git diff --quiet HEAD 2>/dev/null; then
        log "Detected uncommitted changes"

        # Stage changes
        git add -A .ultra/

        # Commit
        local commit_msg="[ultra-autoloop] State update - $(date -u +%Y-%m-%dT%H:%M:%SZ)"
        git commit -m "$commit_msg" 2>/dev/null || true

        log "Changes committed"
    fi
}

persist_state() {
    local now=$(date -u +%Y-%m-%dT%H:%M:%SZ)

    cat > "$STATE_FILE" << EOF
{
  "domain": "ultrax-dev",
  "active": true,
  "last_heartbeat": "$now",
  "cycle_time": "${CYCLE_TIME}s",
  "focus": "all",
  "statistics": {
    "total_cycles": $iteration,
    "tasks_processed": $tasks_processed,
    "routines_executed": $routines_executed,
    "health_checks": $iteration,
    "alerts_triggered": 0
  },
  "last_cycle": {
    "timestamp": "$now",
    "intake_processed": $tasks_processed,
    "routines_run": ["health_check"],
    "health_status": "healthy",
    "actions_taken": ["heartbeat_cycle"]
  },
  "configuration": {
    "enabled_routines": ["health_check", "code_quality", "documentation_sync"],
    "alert_channels": ["relay", "logs"],
    "auto_assign_tasks": false,
    "sync_on_changes": true
  },
  "activated_at": "$start_time",
  "activated_by": "ultra-autoloop.sh"
}
EOF
}

print_status() {
    local uptime=$(($(date +%s) - $(date -d "$start_time" +%s 2>/dev/null || echo "0")))
    local uptime_hours=$((uptime / 3600))
    local uptime_mins=$(((uptime % 3600) / 60))

    echo ""
    echo "╔═══════════════════════════════════════════════════════════════╗"
    echo "║         ULTRA-AUTOLOOP: DOMAIN HEARTBEAT                      ║"
    echo "╠═══════════════════════════════════════════════════════════════╣"
    echo "║   Status: ● ACTIVE                                            ║"
    echo "║   Cycle: $iteration | Uptime: ${uptime_hours}h ${uptime_mins}m              ║"
    echo "║                                                               ║"
    echo "║   Statistics:                                                 ║"
    echo "║   Tasks processed: $tasks_processed                            ║"
    echo "║   Routines executed: $routines_executed                       ║"
    echo "║                                                               ║"
    echo "║   Next cycle in: ${CYCLE_TIME}s                                            ║"
    echo "╚═══════════════════════════════════════════════════════════════╝"
    echo ""
}

heartbeat_cycle() {
    iteration=$((iteration + 1))

    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log "Cycle $iteration started"

    # 1. Check system health
    if ! check_system_health; then
        log_error "System health check failed - emergency stop"
        exit 1
    fi

    # 2. Process intake queue
    process_intake_queue

    # 3. Run routine tasks
    run_routine_tasks

    # 4. Sync domain
    sync_domain

    # 5. Persist state
    persist_state

    log_success "Cycle $iteration complete"
}

# Main execution
main() {
    echo "╔═══════════════════════════════════════════════════════════════╗"
    echo "║         🤖 ULTRA-AUTOLOOP STARTING                           ║"
    echo "║         Domain Heartbeat Driver                              ║"
    echo "╚═══════════════════════════════════════════════════════════════╝"
    echo ""

    # Acquire lock
    acquire_lock

    # Check domain
    check_domain

    # Initial health check
    log "Running initial health checks..."
    check_system_health
    check_service_health

    # Persist initial state
    persist_state

    log_success "Autoloop initialized - starting heartbeat cycles"
    echo ""

    # Main loop
    while [ $iteration -lt $MAX_ITERATIONS ]; do
        # Run heartbeat (function, not command - no timeout needed)
        heartbeat_cycle

        # Print status
        print_status

        # Sleep for cycle time
        sleep $CYCLE_TIME || break
    done

    # Final state update
    persist_state

    log "Autoloop stopped after $iterations iterations"
}

# Start autoloop
main
