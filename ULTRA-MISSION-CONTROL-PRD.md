# UltraPilot Mission Control Dashboard - PRD

**Status**: Requirements Definition
**Priority**: HIGH
**Version**: 1.0
**Date**: 2026-03-03

---

## Executive Summary

Build a **Mission Control Dashboard** for UltraPilot that provides real-time monitoring, analytics, and control of autonomous agent workflows - similar to GitHub Agent HQ's Mission Control, but optimized for local development environments.

**Vision**: Complete visibility into autonomous development - see what agents are doing, track outcomes, measure effectiveness, and control the chaos.

---

## Problem Statement

### Current Gaps

1. **No Visibility**: When UltraPilot runs workflows, we can't see what's happening
   - Multiple agents spawn in parallel - which ones are running?
   - How long has each agent been working?
   - What tasks are stuck/failed?

2. **No Metrics**: We don't know if UltraPilot actually helps
   - How often do we use UltraPilot vs manual work?
   - Do UltraPilot-assisted tasks succeed more often?
   - What's the ROI on autonomous agent workflows?

3. **No Control**: Can't manage active workflows
   - Need to pause/resume long-running workflows
   - Want to cancel stuck agents
   - Need to reassign tasks mid-execution

4. **No Learning**: We don't capture outcomes
   - Did we build something usable?
   - What patterns lead to success?
   - What agents work best for what tasks?

### User Quote

> "I want to see a live Kanban board of ongoing agent activities. Track how many times Claude does tasks with UltraPilot vs without it. What were the outcomes? Did we build something we couldn't even use?"

---

## Goals

### Primary Goals

1. **Real-time Visibility**: Live monitoring of all agent activities
2. **Actionable Metrics**: Track usage, outcomes, and effectiveness
3. **Workflow Control**: Manage, pause, resume, and cancel active workflows
4. **Outcome Tracking**: Capture what was built and whether it was useful

### Success Criteria

- Dashboard loads in < 2 seconds
- Updates agents status in real-time (< 1 second latency)
- Captures 100% of workflow outcomes
- Tracks both UltraPilot and non-UltraPilot tasks
- Provides actionable insights within 1 week of usage

---

## User Personas

### 1. **Development Team Lead**
- Wants to see team productivity
- Needs to identify bottlenecks
- Cares about ROI of autonomous workflows

### 2. **Solo Developer**
- Wants to track personal productivity
- Needs to see what agents are working on
- Wants to measure UltraPilot effectiveness

### 3. **UltraPilot Power User**
- Runs complex multi-agent workflows
- Needs fine-grained control
- Wants to optimize agent performance

---

## Functional Requirements

### 1. Live Agent Monitoring

#### 1.1 Real-Time Agent Status Board

**Requirement**: Display all currently running agents with live status updates.

**Features**:
- **Agent Card** per active agent showing:
  - Agent name and icon
  - Current task description
  - Elapsed time (seconds/minutes)
  - Status indicator (working, waiting, completed, failed)
  - Progress bar (if available)
  - Model tier being used (opus/sonnet/haiku)
  - Resource usage (token count estimation)

- **Auto-refresh** every 1 second
- **Filter/Sort** by:
  - Agent type (analyst, architect, developer, reviewer)
  - Status (active, completed, failed)
  - Workflow ID
  - Duration

- **Agent Details Panel** (click on agent card):
  - Full task description
  - System prompt being used
  - Messages sent/received count
  - Spawn time
  - Last activity timestamp
  - Log output (last 50 lines)

#### 1.2 Workflow Execution View

**Requirement**: Visualize multi-step workflow execution.

**Features**:
- **Workflow Graph** showing:
  - All workflow steps (nodes)
  - Dependencies (edges)
  - Execution status per step
  - Parallel execution visualization

- **Step Details**:
  - Agent assigned
  - Task description
  - Start time, duration
  - Status (pending, running, completed, failed)
  - Output summary

- **Workflow Timeline**: Gantt-chart style view of execution

#### 1.3 Kanban Board for Active Projects

**Requirement**: Kanban-style board showing tasks across workflow stages.

**Columns**:
1. **Intake** - New tasks/ideas
2. **Planning** - Being analyzed by ultra:analyst
3. **Design** - Architecture by ultra:architect
4. **Implementation** - Being built by ultra:team-implementer
5. **Review** - Quality checks by ultra:security-reviewer, ultra:code-reviewer
6. **Completed** - Done, ready to deploy
7. **Failed** - Blocked or failed tasks

**Card Information**:
- Task title
- Assigned agent(s)
- Time in stage
- Priority indicator
- Workflow ID
- Quick actions (view details, move, cancel)

---

### 2. Metrics and Analytics

#### 2.1 Usage Tracking

**Requirement**: Track all Claude Code interactions, both UltraPilot and manual.

**Metrics to Capture**:

| Metric | Description | Type |
|--------|-------------|------|
| `total_sessions` | Total Claude Code sessions | Count |
| `ultrapilot_sessions` | Sessions using UltraPilot | Count |
| `manual_sessions` | Sessions without UltraPilot | Count |
| `ultrapilot_adoption_rate` | `ultrapilot_sessions / total_sessions` | Percentage |
| `agents_spawned` | Total agents spawned across all sessions | Count |
| `parallel_agent_usage` | Sessions with 2+ parallel agents | Count |
| `avg_agents_per_session` | Average agents per UltraPilot session | Float |

#### 2.2 Outcome Tracking

**Requirement**: Track what was built and whether it was usable.

**Metrics**:

| Metric | Description | Type |
|--------|-------------|------|
| `tasks_completed` | Tasks marked as complete | Count |
| `tasks_usable` | Tasks that resulted in usable code | Count |
| `usability_rate` | `tasks_usable / tasks_completed` | Percentage |
| `tasks_abandoned` | Tasks started but never finished | Count |
| `avg_completion_time` | Mean time to complete tasks | Duration |
| `agent_success_rate` | Tasks completed successfully / total tasks | Percentage |

**Usability Assessment**:
- Manual tagging after task completion:
  - "Working as intended"
  - "Needs minor fixes"
  - "Major issues"
  - "Not usable, abandoned"
- Automatic detection:
  - Code was committed to git
  - Code was reverted within 24 hours
  - Tests pass/fail

#### 2.3 UltraPilot vs Manual Comparison

**Requirement**: Compare outcomes between UltraPilot-assisted and manual tasks.

**Comparison Metrics**:

| Dimension | UltraPilot | Manual | Delta |
|-----------|------------|--------|-------|
| Success Rate | 85% | 72% | +13% |
| Avg Completion Time | 12 min | 25 min | -52% |
| Code Quality Score | 8.2/10 | 7.1/10 | +15% |
| Usability Rate | 78% | 65% | +20% |

**Visualization**:
- Side-by-side bar charts
- Line graphs showing trends over time
- Statistical significance tests

#### 2.4 Agent Performance

**Requirement**: Track individual agent effectiveness.

**Per-Agent Metrics**:

| Agent ID | Tasks Completed | Success Rate | Avg Duration | Satisfaction Score |
|----------|----------------|--------------|-------------|-------------------|
| `ultra:analyst` | 45 | 92% | 3.2 min | 8.5/10 |
| `ultra:architect` | 38 | 88% | 8.7 min | 9.0/10 |
| `backend-architect` | 67 | 85% | 15.3 min | 8.2/10 |

**Agent Ranking**: Leaderboard by effectiveness score

#### 2.5 Workflow Analytics

**Requirement**: Analyze workflow patterns and effectiveness.

**Metrics**:
- Most common workflow types
- Average steps per workflow
- Workflow success rate
- Bottleneck identification (slowest steps)
- Agent collaboration patterns

---

### 3. Session Management

#### 3.1 Session History

**Requirement**: Complete audit trail of all Claude Code sessions.

**Session Record**:
```typescript
{
  sessionId: string,
  startTime: timestamp,
  endTime: timestamp,
  duration: seconds,
  usedUltraPilot: boolean,
  workflowIds: string[],
  agentsSpawned: number,
  tasksCompleted: number,
  tasksUsable: number,
  outcome: 'success' | 'partial' | 'failed',
  notes: string
}
```

**Features**:
- Filter by date range, outcome, UltraPilot usage
- Search by session ID, task description
- Export session data (CSV, JSON)
- Session comparison (side-by-side)

#### 3.2 Live Session Control

**Requirement**: Control active Claude Code sessions.

**Actions**:
- **Pause**: Suspend current workflow (graceful shutdown of current agent)
- **Resume**: Continue paused workflow
- **Cancel**: Stop workflow and mark as cancelled
- **Redirect**: Change agent for current task
- **Priority**: Adjust workflow priority

**Safety**:
- Confirmation dialog for destructive actions
- Auto-save state before pause/cancel
- Recovery checkpoints every 5 minutes

---

### 4. Reporting and Insights

#### 4.1 Daily Summary Report

**Requirement**: Automated daily summary of UltraPilot activity.

**Report Contents**:
```
📊 UltraPilot Daily Summary - March 3, 2026

🔥 Activity
  Sessions: 12 total (8 UltraPilot, 4 manual)
  Agents spawned: 47
  Tasks completed: 23

📈 Outcomes
  Success rate: 87% (UltraPilot) vs 73% (manual)
  Usable code: 18/23 (78%)
  Avg time: 14 min (UltraPilot) vs 28 min (manual)

🏆 Top Agents
  1. ultra:analyst - 12 tasks, 100% success
  2. backend-architect - 8 tasks, 88% success
  3. ultra:architect - 6 tasks, 83% success

⚠️ Issues
  2 tasks abandoned
  3 workflows had failed steps
  1 agent timeout (ultra:security-reviewer)

💡 Insights
  UltraPilot saved ~3 hours today
  Most productive time: 9-11 AM
  Recommendation: Use ultra:test-engineer more frequently
```

#### 4.2 Weekly Insights Report

**Requirement**: Deeper analysis with trends and recommendations.

**Report Sections**:
1. **Executive Summary**: Key metrics, wins, issues
2. **Trend Analysis**: Week-over-week changes
3. **Agent Performance**: Top/bottom performers
4. **Workflow Analysis**: Most/least effective workflows
5. **Recommendations**: Actionable improvements

#### 4.3 Custom Reports

**Requirement**: User-defined report builder.

**Report Builder Features**:
- Drag-and-drop metrics
- Custom date ranges
- Filter by agent, workflow, outcome
- Visualizations (charts, graphs, tables)
- Schedule automated reports
- Export (PDF, CSV, JSON)

---

### 5. Dashboard UI

#### 5.1 Layout

**Three-Column Layout**:

```
┌─────────────────────────────────────────────────────────────────┐
│  U L T R A P I L O T   M I S S I O N   C O N T R O L           │
├──────────────┬─────────────────────────────┬─────────────────────┤
│              │                             │                     │
│   Sidebar    │      Main Content           │   Details Panel     │
│              │                             │                     │
│ • Dashboard  │  ┌───────────────────────┐  │  [Selected Item]   │
│ • Agents     │  │   Live Agents          │  │                     │
│ • Workflows  │  │   (12 active)          │  │  - Task details    │
│ • Kanban     │  └───────────────────────┘  │  - Agent info      │
│ • Metrics    │                             │  - Logs             │
│ • Sessions   │  ┌───────────────────────┐  │  - Actions         │
│ • Reports    │  │   Kanban Board         │  │                     │
│ • Settings   │  │   [3 columns]          │  │                     │
│              │  └───────────────────────┘  │                     │
│              │                             │                     │
│              │  ┌───────────────────────┐  │                     │
│              │  │   Metrics Summary      │  │                     │
│              │  │   [Key numbers]        │  │                     │
│              │  └───────────────────────┘  │                     │
└──────────────┴─────────────────────────────┴─────────────────────┘
```

#### 5.2 Views

**1. Dashboard View** (Default)
- Live agents panel
- Quick metrics
- Recent activity
- Upcoming tasks

**2. Kanban View**
- Full Kanban board
- Drag-and-drop task management
- Filter by workflow/priority

**3. Analytics View**
- Charts and graphs
- Trend analysis
- Agent performance
- Usage statistics

**4. Sessions View**
- Session history table
- Session comparison
- Export functionality

**5. Reports View**
- Generated reports
- Report builder
- Scheduled reports

#### 5.3 UI/UX Requirements

- **Dark/Light mode** support
- **Responsive design** (desktop, tablet, mobile)
- **Real-time updates** (WebSocket/SSE)
- **Keyboard shortcuts**
  - `D` - Dashboard
  - `K` - Kanban
  - `A` - Analytics
  - `S` - Sessions
  - `R` - Reports
  - `Ctrl+P` - Pause/Resume
  - `Esc` - Close details panel
- **Notifications**: Toast alerts for important events
- **Loading states**: Skeleton screens, progress bars

---

## Technical Architecture

### Stack Recommendations

**Frontend**:
- **Framework**: Next.js 14 (React Server Components)
- **UI Library**: shadcn/ui (Radix UI + Tailwind)
- **Real-time**: WebSocket or Server-Sent Events
- **Charts**: Recharts or Chart.js
- **State**: Zustand (lightweight) or Redux Toolkit

**Backend**:
- **API**: Node.js + Express or Fastify
- **Real-time**: Socket.IO or native WebSocket
- **Database**: SQLite (local) or PostgreSQL (multi-user)
- **ORM**: Drizzle ORM or Prisma
- **Caching**: Redis (optional, for metrics aggregation)

**Integration**:
- **Claude Code**: Parse `.ultra/state/` files
- **Agent Bridge**: Subscribe to events
- **Git**: Analyze commit history for outcomes

### Data Model

#### Sessions Table
```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  duration_seconds INTEGER,
  used_ultrapilot BOOLEAN NOT NULL,
  workflow_ids TEXT[], -- JSON array
  agents_spawned INTEGER DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  tasks_usable INTEGER DEFAULT 0,
  outcome TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Agent Executions Table
```sql
CREATE TABLE agent_executions (
  id TEXT PRIMARY KEY,
  session_id TEXT REFERENCES sessions(id),
  agent_id TEXT NOT NULL,
  task_description TEXT,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  duration_seconds INTEGER,
  status TEXT NOT NULL,
  output_summary TEXT,
  token_count INTEGER,
  outcome TEXT, -- usable, needs_fixes, not_usable
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Workflow Executions Table
```sql
CREATE TABLE workflow_executions (
  id TEXT PRIMARY KEY,
  session_id TEXT REFERENCES sessions(id),
  workflow_id TEXT NOT NULL,
  workflow_name TEXT,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  total_steps INTEGER,
  completed_steps INTEGER,
  failed_steps INTEGER,
  status TEXT NOT NULL,
  outcome TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Outcomes Table
```sql
CREATE TABLE task_outcomes (
  id TEXT PRIMARY KEY,
  agent_execution_id TEXT REFERENCES agent_executions(id),
  task_description TEXT,
  usable BOOLEAN,
  outcome_rating TEXT, -- excellent, good, needs_work, poor
  issues TEXT[],
  was_committed BOOLEAN,
  was_reverted BOOLEAN,
  revert_reason TEXT,
  user_feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### API Endpoints

```
GET  /api/sessions          - List sessions (filterable)
GET  /api/sessions/:id      - Get session details
POST /api/sessions/:id/pause  - Pause active session
POST /api/sessions/:id/resume - Resume paused session

GET  /api/agents/active     - List active agents
GET  /api/agents/:id        - Get agent details
POST /api/agents/:id/cancel - Cancel running agent

GET  /api/workflows         - List workflows
GET  /api/workflows/:id     - Get workflow execution
GET  /api/workflows/:id/steps - Get workflow steps

GET  /api/metrics           - Get metrics summary
GET  /api/metrics/usage     - Usage statistics
GET  /api/metrics/outcomes  - Outcome analysis
GET  /api/metrics/agents    - Agent performance
GET  /api/metrics/compare   - UltraPilot vs manual

GET  /api/kanban            - Get Kanban board data
PUT  /api/kanban/:taskId    - Update task status

GET  /api/reports           - List reports
POST /api/reports/generate - Generate custom report
GET  /api/reports/daily     - Daily summary
GET  /api/reports/weekly    - Weekly insights

WS   /api/live              - WebSocket for real-time updates
```

---

## Implementation Phases

### Phase 1: MVP (4 weeks)

**Week 1-2: Data Collection**
- Parse `.ultra/state/` files
- Create database schema
- Build session tracking
- Implement basic metrics collection

**Week 3: Core Dashboard**
- Live agents panel
- Session history table
- Basic metrics display
- Real-time updates (polling or SSE)

**Week 4: Kanban Board**
- Kanban UI implementation
- Task state management
- Drag-and-drop (if time permits)

**Deliverables**:
- Working dashboard with live agent monitoring
- Session history and basic metrics
- Kanban board for task tracking

### Phase 2: Analytics (3 weeks)

**Week 5: Metrics Engine**
- Outcome tracking system
- Usability assessment UI
- Agent performance calculation
- Comparison analytics

**Week 6: Reports**
- Daily summary report generator
- Weekly insights report
- Custom report builder

**Week 7: Visualizations**
- Charts and graphs
- Trend analysis
- Agent leaderboard
- Export functionality

**Deliverables**:
- Complete metrics and analytics
- Automated reports
- Data visualizations

### Phase 3: Advanced Features (3 weeks)

**Week 8: Workflow Control**
- Pause/resume functionality
- Agent cancellation
- Workflow redirection
- Priority adjustment

**Week 9: Enhanced UX**
- Keyboard shortcuts
- Notifications system
- Dark/light mode
- Responsive design improvements

**Week 10: Integrations**
- Git analysis (commit/revert detection)
- Test result integration
- CI/CD pipeline integration
- Export to external tools

**Deliverables**:
- Full workflow control
- Polished UX
- Third-party integrations

---

## Non-Functional Requirements

### Performance

- Dashboard load time: < 2 seconds
- Real-time update latency: < 1 second
- Support 100+ concurrent agents without degradation
- Query response time: < 500ms for metrics

### Reliability

- 99.9% uptime for monitoring
- Data loss protection (auto-save every 30 seconds)
- Graceful degradation if real-time fails (fallback to polling)

### Security

- Local-only by default (no external data transmission)
- Optional opt-in for anonymous usage analytics
- Session data encrypted at rest
- API authentication (if multi-user)

### Scalability

- Support single-user (MVP)
- Architecture for team usage (future)
- Database can handle 100K+ sessions
- Efficient data retention policies (cleanup old data)

---

## Success Metrics

### Week 1-4 (MVP)
- [ ] Dashboard displays live agents
- [ ] Session history captures all Claude Code usage
- [ ] Kanban board tracks active tasks
- [ ] Basic metrics calculated correctly

### Week 5-7 (Analytics)
- [ ] Outcome tracking implemented
- [ ] Daily/weekly reports generated
- [ ] UltraPilot vs manual comparisons available
- [ ] Agent performance tracked

### Week 8-10 (Advanced)
- [ ] Workflow control (pause/resume/cancel) works
- [ ] UX polished (shortcuts, notifications)
- [ ] Git integration detects outcomes
- [ ] Export functionality available

### Overall Success
- **Adoption**: 80% of UltraPilot users use dashboard weekly
- **Actionable Insights**: 5+ process improvements identified from data
- **ROI Measured**: Clear evidence of UltraPilot effectiveness

---

## Open Questions

1. **Data Collection**: Opt-in or opt-in by default for usage analytics?
2. **Persistence**: SQLite for single-user or PostgreSQL for multi-user from start?
3. **Real-time**: WebSocket or Server-Sent Events for live updates?
4. **Outcome Assessment**: Manual tagging or automatic detection (or both)?
5. **Deployment**: Local dev server only or packaged with UltraPilot plugin?

---

## Dependencies

### UltraPilot Components
- Agent Orchestrator (event emission)
- Agent State Store (session data)
- Agent Message Bus (real-time events)
- Agent Bridge (agent lifecycle)

### External Tools
- Claude Code (session detection)
- Git (outcome analysis)
- Test frameworks (result integration)

---

## Risks and Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Performance overhead | Medium | Efficient polling, batch updates, data aggregation |
| User doesn't tag outcomes | High | Automatic detection (git commits, test results) |
| Real-time updates unreliable | Medium | Fallback to polling, graceful degradation |
| Data privacy concerns | Low | Local-only storage, clear privacy policy |
| Too complex to maintain | Medium | Incremental rollout, modular design |

---

## Next Steps

### Immediate Actions
1. **Review and approve PRD** - Get stakeholder sign-off
2. **Assign ultra:team-lead** - Lead the implementation
3. **Spawn ultra:analyst** - Requirements deep-dive
4. **Spawn ultra:architect** - Design architecture
5. **Spawn ultra:team-implementer** - Start Phase 1 MVP

### First Sprint (Week 1)
```typescript
// Workflow to kick off
const kickoffWorkflow = {
  id: 'mission-control-kickoff',
  name: 'Build Mission Control Dashboard',
  mode: 'sequential',
  steps: [
    { agentId: 'ultra:analyst', task: 'Refine PRD requirements, identify gaps' },
    { agentId: 'ultra:architect', task: 'Design system architecture and data model' },
    { agentId: 'frontend-developer', task: 'Create dashboard UI mockups' },
    { agentId: 'backend-architect', task: 'Design API endpoints and database schema' },
    { agentId: 'ultra:test-engineer', task: 'Design test strategy for metrics tracking' }
  ]
};

await orchestrator.executeWorkflow(kickoffWorkflow);
```

---

**Ready to build! 🚀**

This dashboard will be **game-changing** for UltraPilot - complete visibility into autonomous development, proving it works, and showing us how to make it even better.

Let's build it!
