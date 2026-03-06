# GitHub Project Boards: Mission Control Dashboard

## Quick Answer: How to Visualize & Use It

**GitHub Project Boards are built into GitHub!** You don't need to build anything - just create a project board and use GitHub's existing UI.

## Step-by-Step Setup

### Step 1: Create Project Board (2 minutes)

**Option A: Via GitHub UI (No Code)**

1. Go to your repository: `https://github.com/hscheema1979/ultra-workspace`
2. Click **Projects** tab in the top navigation
3. Click **New Project**
4. Name it: **"UltraPilot Mission Control"**
5. Select **Board** template
6. Click **Create**

**Option B: Via Script (Automated)**

```typescript
// setup-project-board.ts
import { GitHubService } from './src/services/github-service.js';
import { GitHubAppAuthManager } from './src/services/github-app-auth.js';

async function setupProjectBoard() {
  const authManager = GitHubAppAuthManager.fromEnv('hscheema1979/ultra-workspace');
  const github = new GitHubService({
    owner: 'hscheema1979',
    repo: 'ultra-workspace',
    installationId: parseInt(process.env.GITHUB_INSTALLATION_ID || '0')
  }, authManager);

  // Create project board
  const project = await github.createProjectBoard('UltraPilot Mission Control');
  console.log(`✅ Created project: ${project.id}`);

  // Create columns for workflow stages
  const columns = [
    '📥 Backlog',
    '📏 Sizing',
    '📋 Planning',
    '🔍 Review',
    '✅ Ready',
    '⚙️ In Progress',
    '🧪 QA',
    '✔️ Validation',
    '🔎 Verification',
    '🎉 Complete'
  ];

  for (const column of columns) {
    const col = await github.createProjectColumn(project.id, column);
    console.log(`✓ Created column: ${column}`);
  }

  console.log('\n🎉 Project board ready!');
  console.log(`🔗 View at: https://github.com/hscheema1979/ultra-workspace/projects`);
}

setupProjectBoard();
```

**Run it:**
```bash
npx tsx setup-project-board.ts
```

### Step 2: View Your Project Board

**URL:** `https://github.com/hscheema1979/ultra-workspace/projects`

**What you'll see:**
```
┌─────────────────────────────────────────────────────────────────┐
│  UltraPilot Mission Control                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │📥 Backlog│ │📏 Sizing│ │📋Planning│ │🔍 Review│              │
│  │   (0)   │ │   (0)   │ │   (0)   │ │   (0)   │              │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘              │
│                                                                 │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │✅ Ready │ │⚙️Progress│ │🧪 QA    │ │✔️Valid..│              │
│  │   (0)   │ │   (0)   │ │   (0)   │ │   (0)   │              │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘              │
│                                                                 │
│  ┌─────────┐                                                   │
│  │🎉Complete│                                                   │
│  │   (0)   │                                                   │
│  └─────────┘                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Step 3: Add Issues to Project Board

**Option A: Manual (Via UI)**

1. Open any issue in your repository
2. Click **Projects** menu in the sidebar
3. Select **UltraPilot Mission Control**
4. Select column (e.g., "Backlog")

**Option B: Automated (Via Script)**

```typescript
// add-issues-to-project.ts
import { GitHubService } from './src/services/github-service.js';

async function addIssuesToProject() {
  const github = new GitHubService({...}, authManager);

  // Get project board
  const projects = await github.getProjectBoards();
  const missionControl = projects.find(p => p.name === 'UltraPilot Mission Control');

  // Get columns
  const columns = await github.getProjectColumns(missionControl.id);
  const backlogColumn = columns.find(c => c.name === '📥 Backlog');

  // Get issues with 'feature-request' label
  const issues = await github.getTasksByLabel('feature-request');

  // Add each issue to backlog
  for (const issue of issues) {
    await github.addProjectCard(backlogColumn.id, issue.id);
    console.log(`✓ Added #${issue.number}: ${issue.title} to backlog`);
  }
}

addIssuesToProject();
```

## How to Use It

### Workflow: Feature Request → Complete

#### 1. **Create Feature Request**
```
User creates GitHub issue:
Title: [Feature] Add user authentication
Labels: feature-request, mega-project
Body: Description of what to build...
```

#### 2. **Add to Backlog**
```
Issue → Added to "📥 Backlog" column
```

#### 3. **Trigger STEP 0.5: Sizing**
```bash
# Via GitHub CLI
gh issue edit 123 --add-label "sizing"
```

Or add comment: `/ultrapilot size`

This moves issue to: **"📏 Sizing"** column

#### 4. **Sizing Results Posted**
```
Agent posts comments:
- ultra:planner: "Size: M (25 tasks, 3 hours)"
- ultra:architect: "Size: M (3 systems, 5 integration points)"
- ultra:team-lead: "Size: L (requires 3 parallel workflows)"

Consensus: L → Decompose into workflows
```

Move issue to: **"📋 Planning"** column

#### 5. **Planning Phase**
```
Phase 0: Requirements + Architecture
Phase 1: Planning
Phase 1.5: Multi-Perspective Review
```

Agent comments posted as they complete each phase.

Move issue to: **"🔍 Review"** column

#### 6. **Multi-Perspective Review**
```
Reviewers post comments:
- ultra:architect: "APPROVED ✓"
- ultra:critic: "APPROVED ✓"
- ultra:security-reviewer: "APPROVED ✓"

All approve → Plan approved
```

Move issue to: **"✅ Ready"** column

#### 7. **Execution Phase**
```bash
# Add label to trigger execution
gh issue edit 123 --add-label "ready"
```

Moves issue to: **"⚙️ In Progress"** column

#### 8. **Subtasks Created**
```
Decomposition creates sub-issues:
- #124: [Task] Implement login endpoint
- #125: [Task] Create user model
- #126: [Task] Add JWT authentication
```

Each subtask added to **"⚙️ In Progress"** column

#### 9. **QA Cycles**
```
All subtasks complete → Move to **"🧪 QA"** column
Run tests → Results posted as comments
```

#### 10. **Validation**
```
Move to **"✔️ Validation"** column
Reviewers post validation results
```

#### 11. **Verification**
```
Move to **"🔎 Verification"** column
Evidence collection and final checks
```

#### 12. **Complete!**
```
Move to **"🎉 Complete"** column
Issue closed
```

## Visualizing Progress

### At a Glance View

Your project board shows **workflow status at a glance**:

```
┌─────────────────────────────────────────────────────────────────┐
│  UltraPilot Mission Control                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │📥 Backlog│ │📏 Sizing│ │📋Planning│ │🔍 Review│              │
│  │  (12)   │ │  (3)    │ │  (5)    │ │  (2)    │              │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘              │
│                                                                 │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │✅ Ready │ │⚙️Progress│ │🧪 QA    │ │✔️Valid..│              │
│  │  (8)    │ │  (15)   │ │  (4)    │ │  (1)    │              │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘              │
│                                                                 │
│  ┌─────────┐ ┌─────────┐                                                   │
│  │🔎Verif..│ │🎉Complete│                                                   │
│  │  (2)    │ │  (47)   │                                                   │
│  └─────────┘ └─────────┘                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**What this tells you:**
- 📥 **12 features** waiting to start
- 📏 **3 features** being sized
- 📋 **5 features** in planning
- ⚙️ **15 features** actively being built
- 🎉 **47 features** complete

### Drill Down: Click Any Card

Clicking a card shows the full issue:

```
#123: [Feature] Add user authentication

## Status
⚙️ In Progress

## Phase
Phase 2: Execution (8/25 tasks complete)

## Labels
mega-project, size:l, domain:auth, phase:2

## Comments (47)
├─ STEP 0.5: Sizing Results
│  ├─ ultra:planner: "Size: M (25 tasks, 3 hours)"
│  ├─ ultra:architect: "Size: M (3 systems, 5 integration points)"
│  └─ ultra:team-lead: "Size: L (requires 3 parallel workflows)"
│
├─ Phase 0: Requirements + Architecture
│  └─ Requirements extracted: 15 functional, 5 non-functional
│
├─ Phase 1: Planning
│  └─ Implementation plan: 25 tasks, I/O contracts defined
│
├─ Phase 1.5: Multi-Perspective Review
│  ├─ ultra:architect: "APPROVED ✓"
│  ├─ ultra:critic: "APPROVED ✓"
│  └─ ultra:backend-expert: "APPROVED ✓"
│
└─ Phase 2: Execution
   ├─ Task #124: "Implement login endpoint" ✓ Complete
   ├─ Task #125: "Create user model" ✓ Complete
   ├─ Task #126: "Add JWT authentication" ⚙️ In Progress
   └─ Task #127: "Add logout endpoint" 📥 Pending

## Subtasks (25)
├─ #124: [Task] Implement login endpoint ✓
├─ #125: [Task] Create user model ✓
├─ #126: [Task] Add JWT authentication ⚙️
├─ #127: [Task] Add logout endpoint 📥
└─ ... (21 more tasks)

## Files Modified
- src/services/auth-service.ts
- src/models/user.ts
- src/routes/auth-routes.ts
```

## Integrating with UltraPilot Skill

### Option A: Manual Integration

Use GitHub comments to trigger UltraPilot:

```bash
# In issue comment, type:
/ultrapilot start

# This triggers:
# 1. UltraPilot skill reads issue
# 2. Runs STEP 0.5: Multi-Agent Task Sizing
# 3. Posts results as comments
# 4. Updates project board column
```

### Option B: Automated Integration

```typescript
// ultra-github-integration.ts
import { GitHubService } from './src/services/github-service.js';
import { Agent } from '@anthropic-ai/sdk'; // or your skill system

class UltraPilotGitHubIntegration {
  private github: GitHubService;
  private skill: any;

  async watchIssue(issueNumber: number) {
    // Poll for label changes
    setInterval(async () => {
      const issue = await this.github.getTask(issueNumber);

      // Check if issue labeled "ready"
      if (issue.labels.some(l => l.name === 'ready')) {
        // Trigger UltraPilot workflow
        await this.runUltraPilotWorkflow(issue);

        // Remove "ready" label to prevent re-trigger
        await this.github.removeLabel(issueNumber, 'ready');
      }

      // Update project board based on phase
      const phase = this.extractPhase(issue.labels);
      await this.updateProjectBoard(issueNumber, phase);
    }, 30000); // Check every 30 seconds
  }

  async runUltraPilotWorkflow(issue: any) {
    // Post comment: Starting workflow
    await this.github.createComment(issue.number, {
      body: '## 🚀 Starting UltraPilot Workflow...\n\nPhase 0: Requirements + Architecture'
    });

    // Move to "In Progress" column
    await this.moveCardToColumn(issue.number, '⚙️ In Progress');

    // Run UltraPilot skill
    const result = await this.skill.execute({
      prompt: issue.body,
      issueNumber: issue.number
    });

    // Post results as comments
    for (const phase of result.phases) {
      await this.github.createComment(issue.number, {
        body: `## Phase ${phase.number}: ${phase.name}\n\n${phase.output}`
      });
    }

    // Move to "Complete" column
    await this.moveCardToColumn(issue.number, '🎉 Complete');

    // Close issue
    await this.github.updateTask(issue.number, { state: 'closed' });
  }

  async moveCardToColumn(issueNumber: number, columnName: string) {
    // Get project board
    const projects = await this.github.getProjectBoards();
    const board = projects.find(p => p.name === 'UltraPilot Mission Control');

    // Get columns
    const columns = await this.github.getProjectColumns(board.id);
    const targetColumn = columns.find(c => c.name === columnName);

    // Get issue's current card
    const cards = await this.github.getProjectCards(targetColumn.id);
    const card = cards.find(c => c.content_url.includes(`issues/${issueNumber}`));

    // Move card
    await this.github.moveProjectCard(card.id, targetColumn.id);
  }

  extractPhase(labels: any[]) {
    const phaseLabel = labels.find(l => l.name.startsWith('phase:'));
    return phaseLabel ? phaseLabel.name.replace('phase:', '') : 'unknown';
  }
}
```

## Advanced: Automations

### Automation 1: Auto-Move Cards Based on Labels

```typescript
// auto-move-cards.ts
async function autoMoveCards() {
  const github = new GitHubService({...}, authManager);
  const issues = await github.getTasksByLabel('ultrapilot-workflow');

  for (const issue of issues) {
    const phase = extractPhase(issue.labels);
    const column = mapPhaseToColumn(phase);
    await moveCardToColumn(issue.number, column);
  }
}

function mapPhaseToColumn(phase: string): string {
  const columnMap = {
    '0': '📋 Planning',
    '1': '📋 Planning',
    '1.5': '🔍 Review',
    '2': '⚙️ In Progress',
    '3': '🧪 QA',
    '4': '✔️ Validation',
    '5': '🔎 Verification',
    'done': '🎉 Complete'
  };
  return columnMap[phase] || '📥 Backlog';
}
```

### Automation 2: Auto-Post Progress Updates

```typescript
// auto-post-progress.ts
async function postProgressUpdates(issueNumber: number) {
  const github = new GitHubService({...}, authManager);
  const issue = await github.getTask(issueNumber);

  // Extract progress from comments
  const comments = await github.getComments(issueNumber);
  const progress = analyzeProgress(comments);

  // Post summary
  await github.createComment(issueNumber, {
    body: `## 📊 Progress Update\n\n` +
      `- **Phase:** ${progress.phase}\n` +
      `- **Tasks:** ${progress.completed}/${progress.total}\n` +
      `- **Status:** ${progress.status}\n` +
      `- **Duration:** ${progress.duration}`
  });
}
```

## Best Practices

### 1. **Label Strategy**
```bash
# Workflow labels
feature-request    # New feature requests
ultrapilot-workflow # Issues managed by UltraPilot

# Phase labels (auto-applied)
phase:0           # Requirements + Architecture
phase:1           # Planning
phase:1.5         # Multi-Perspective Review
phase:2           # Execution
phase:3           # QA
phase:4           # Validation
phase:5           # Verification

# Status labels (auto-applied)
status:todo       # Not started
status:in-progress # Currently working
status:review      # Under review
status:complete    # Done

# Size labels (from STEP 0.5)
size:xs           # 1-10 tasks, 1 hour
size:s            # 10-20 tasks, 1-2 hours
size:m            # 20-30 tasks, 2-4 hours
size:l            # 30-50 tasks, 4-6 hours
size:xl           # 50-100 tasks, 6-10 hours
size:xxl          # 100+ tasks, 10+ hours

# Domain labels (auto-detected)
domain:backend
domain:frontend
domain:auth
domain:analytics
```

### 2. **Comment Templates**
```markdown
## STEP 0.5: Multi-Agent Task Sizing

### Consensus
**Size:** L (30-50 tasks, 4-6 hours)
**Decision:** Decompose into 3 workflows

### Sizing Results
- **ultra:planner**: M (25 tasks, 3 hours)
- **ultra:architect**: M (3 systems, 5 integration points)
- **ultra:team-lead**: L (requires 3 parallel workflows)

### Next Steps
Creating sub-issues for each workflow...
```

### 3. **Card Organization**
- **Keep cards in phase-appropriate columns**
- **Use card color coding** (if available)
- **Add checklists** for subtasks
- **Link related cards** with dependencies

## Summary: How to Use It

### Daily Workflow
1. **Morning** - Check project board for stuck workflows
2. **During day** - Watch for agent comment updates
3. **Evening** - Review completed workflows, move to appropriate columns

### Monitoring
- **Backlog**: Should be processing down
- **In Progress**: Should have active work
- **Complete**: Should be growing

### Alerts
Set up GitHub notifications for:
- New comments on watched issues
- Label changes
- Issue closures

## Next Steps

**Start using it NOW:**
1. Create project board (2 minutes)
2. Add existing issues (5 minutes)
3. Create your first feature request issue
4. Move it through the columns
5. See progress at a glance!

**URL:** `https://github.com/hscheema1979/ultra-workspace/projects`

This is your **Mission Control dashboard** - built into GitHub, zero code required!
