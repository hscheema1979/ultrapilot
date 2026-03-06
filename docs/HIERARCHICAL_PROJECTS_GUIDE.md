# Hierarchical Project Boards: MyHealthTeam → UltraPilot → Mission Control

## Project Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│              MEGA-PROJECT: MyHealthTeam Platform                │
│  Repository: hscheema1979/myhealthteam                           │
│  Purpose: Complete health team management platform               │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ Uses for development
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                PROJECT: UltraPilot Development                   │
│  Repository: hscheema1979/ultrapilot                             │
│  Purpose: Autonomous development tool itself                    │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ Contains as feature
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│              SUB-PROJECT: Mission Control                       │
│  Repository: hscheema1979/ultrapilot (same repo)                 │
│  Purpose: Dashboard and automation for tracking all projects   │
└─────────────────────────────────────────────────────────────────┘
```

## Visual Project Boards

### 1. MyHealthTeam Platform (Mega-Project)

```
┌─────────────────────────────────────────────────────────────────┐
│ MyHealthTeam Platform                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│ │🎯Strategic│ │📋Require.│ │🏗️Architec.│ │👥 Teams  │               │
│ │  (5)    │ │  (8)    │ │  (3)    │ │  (2)    │               │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘               │
│                                                                 │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│ │⚙️Devel..│ │🧪Testing│ │🚀Deploy.│ │📊Analyt.│               │
│ │  (12)   │ │  (4)    │ │  (2)    │ │  (1)    │               │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘               │
│                                                                 │
│ ┌─────────┐                                                       │
│ │🎉Complete│                                                       │
│ │  (25)   │                                                       │
│ └─────────┘                                                       │
└─────────────────────────────────────────────────────────────────┘
```

**Columns:**
- 🎯 Strategic - Strategic planning and roadmap
- 📋 Requirements - Requirements gathering
- 🏗️ Architecture - System architecture design
- 👥 Teams - Team assignments
- ⚙️ Development - Active sprints
- 🧪 Testing - QA phases
- 🚀 Deployment - Releases
- 📊 Analytics - Monitoring
- 🎉 Complete - Done

**Example Issues:**
- #45: "Patient scheduling system"
- #46: "Electronic health records integration"
- #47: "Team communication portal"

### 2. UltraPilot Development (Project)

```
┌─────────────────────────────────────────────────────────────────┐
│ UltraPilot Development                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│ │💡 Ideas │ │📏 Sizing│ │📋Plan..│ │🔍 Review│               │
│ │  (15)   │ │  (3)    │ │  (5)    │ │  (2)    │               │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘               │
│                                                                 │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│ │✅ Ready │ │⚙️Progress│ │🧪 QA    │ │✔️Valid..│               │
│ │  (8)    │ │  (4)    │ │  (1)    │ │  (0)    │               │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘               │
│                                                                 │
│ ┌─────────┐ ┌─────────┐                                           │
│ │🔎Verif..│ │🎉Complete│                                           │
│ │  (1)    │ │  (12)   │                                           │
│ └─────────┘ └─────────┘                                           │
└─────────────────────────────────────────────────────────────────┘
```

**Columns:**
- 💡 Ideas - Feature proposals
- 📏 Sizing - Task sizing (STEP 0.5)
- 📋 Planning - Phases 0-1
- 🔍 Review - Phase 1.5
- ✅ Ready - Approved plans
- ⚙️ In Progress - Phase 2
- 🧪 QA - Phase 3
- ✔️ Validation - Phase 4
- 🔎 Verification - Phase 5
- 🎉 Complete - Done

**Example Issues:**
- #118: "Multi-agent task sizing improvements"
- #119: "GitHub webhook integration"
- #120: "Mission Control dashboard"

### 3. Mission Control (Sub-Project)

```
┌─────────────────────────────────────────────────────────────────┐
│ Mission Control (Sub-project of UltraPilot)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│ │🎨 Design│ │🔧Backend│ │🖥️Frontend│ │🔌Integr.│               │
│ │  (3)    │ │  (5)    │ │  (4)    │ │  (2)    │               │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘               │
│                                                                 │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│ │📊Dash...│ │🧪Testing│ │📚Doc...│ │🎉Complete│               │
│ │  (1)    │ │  (2)    │ │  (3)    │ │  (8)    │               │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘               │
└─────────────────────────────────────────────────────────────────┘
```

**Columns:**
- 🎨 Design - UI/UX design
- 🔧 Backend - Backend API
- 🖥️ Frontend - Frontend components
- 🔌 Integration - GitHub webhooks
- 📊 Dashboard - Visualization
- 🧪 Testing - QA
- 📚 Documentation - Docs
- 🎉 Complete - Done

**Example Issues:**
- #121: "Repository browser UI"
- #122: "Workflow status visualization"
- #123: "Real-time progress updates"

## How Issues Flow Through Hierarchy

### Example 1: Building a MyHealthTeam Feature Using UltraPilot

```
1. CREATE ISSUE IN MYHEALTHTEAM REPO
   Title: "[Feature] Patient scheduling system"
   Labels: feature-request, mega-project
   Repo: hscheema1979/myhealthteam
   → Appears in: MyHealthTeam Platform → 📋 Requirements

2. ULTRAPILOT PROCESSES THE FEATURE
   UltraPilot agents work on patient scheduling
   → Issue #118 in UltraPilot repo tracks this work
   → Appears in: UltraPilot Development → ⚙️ In Progress

3. MISSION CONTROL TRACKS PROGRESS
   Mission Control dashboard shows overall progress
   → Issue #45 in Mission Control shows visualization
   → Appears in: Mission Control → 📊 Dashboard
```

### Example 2: Improving UltraPilot Itself

```
1. CREATE ISSUE IN ULTRAPILOT REPO
   Title: "[Feature] Better task sizing algorithm"
   Labels: feature-request, improvement
   Repo: hscheema1979/ultrapilot
   → Appears in: UltraPilot Development → 💡 Ideas

2. SIZING & PLANNING
   Multi-agent sizing runs
   → Moves to: 📏 Sizing → 📋 Planning → 🔍 Review

3. EXECUTION
   UltraPilot builds UltraPilot (meta!)
   → Moves to: ✅ Ready → ⚙️ In Progress → 🎉 Complete
```

### Example 3: Building Mission Control Feature

```
1. CREATE ISSUE IN ULTRAPILOT REPO
   Title: "[Mission Control] Add repository browser"
   Labels: feature-request, mission-control
   Repo: hscheema1979/ultrapilot
   → Appears in BOTH:
     - UltraPilot Development → 💡 Ideas
     - Mission Control → 🎨 Design

2. DEVELOPMENT
   Frontend work on browser UI
   → Moves in Mission Control: 🎨 Design → 🖥️ Frontend

3. INTEGRATION
   Connect to GitHub API
   → Moves in Mission Control: 🔌 Integration → 🧪 Testing

4. COMPLETE
   Feature done!
   → Moves in Mission Control: 🎉 Complete
   → Also moves in UltraPilot Development: 🎉 Complete
```

## Cross-Project References

### Linking Related Issues

```
#45 in MyHealthTeam: "Patient scheduling system"
  ├─ References: UltraPilot#118 "Working on patient scheduling"
  │   └─ References: Mission Control#45 "Show scheduling progress"
  │
  ├─ Sub-issue: #46 "Appointment booking UI"
  │   └─ Sub-issue: #47 "Calendar integration"
  │
  └─ Depends on: UltraPilot#119 "GitHub integration" (blocking)
```

### How to Link Issues

```markdown
In issue body:

Relates to: #118
Depends on: #119
Sub-task of: #45
Parent of: #46, #47
Blocks: #120
```

## Daily Usage

### Morning Review (10 minutes)

1. **Check MyHealthTeam Platform**
   - URL: `https://github.com/hscheema1979/myhealthteam/projects`
   - Review: ⚙️ Development column
   - Check: What's being built for the platform

2. **Check UltraPilot Development**
   - URL: `https://github.com/hscheema1979/ultrapilot/projects`
   - Review: ⚙️ In Progress column
   - Check: What UltraPilot features are being built

3. **Check Mission Control**
   - URL: `https://github.com/hscheema1979/ultrapilot/projects` (same repo)
   - Review: All columns
   - Check: Dashboard and automation progress

### During Development

**Working on MyHealthTeam feature:**
1. Create issue in myhealthteam repo
2. UltraPilot processes it (appears in UltraPilot project)
3. Mission Control shows progress (appears in Mission Control project)

**Working on UltraPilot improvement:**
1. Create issue in ultrapilot repo
2. Add labels: feature-request, improvement
3. Appears in UltraPilot Development project
4. Moves through columns as it's built

**Working on Mission Control feature:**
1. Create issue in ultrapilot repo
2. Add labels: feature-request, mission-control
3. Appears in BOTH UltraPilot Development AND Mission Control projects
4. Track in both places

## Labels for Hierarchy

### MyHealthTeam Labels
```bash
mega-project        # Mega-project level features
feature-request     # New feature requests
strategic          # Strategic planning
requirements        # Requirements gathering
architecture        # Architecture design
development         # Active development
testing            # Testing phase
deployment         # Deployment
```

### UltraPilot Labels
```bash
ultrapilot-dev     # UltraPilot tool development
feature-request     # New features
improvement        # Improvements to existing features
bug                # Bug fixes
mission-control    # Mission Control specific features
core               # Core UltraPilot functionality
integration        # GitHub integration
```

### Mission Control Labels
```bash
mission-control    # Mission Control features
dashboard          # Dashboard UI
repository         # Repository management
workflow           # Workflow tracking
automation         # Automation features
github-integration # GitHub API integration
```

## Quick Start

### 1. Run Setup Script
```bash
cd ~/.claude/plugins/ultrapilot

# Set environment variables
export GITHUB_APP_ID=your_app_id
export GITHUB_PRIVATE_KEY=your_private_key
export GITHUB_INSTALLATION_ID_MYHEALTHTEAM=installation_id_for_myhealthteam
export GITHUB_INSTALLATION_ID_ULTRAPILOT=installation_id_for_ultrapilot

# Run setup
npx tsx setup-hierarchical-projects.ts
```

### 2. Access Your Dashboards

**MyHealthTeam Platform:**
```
https://github.com/hscheema1979/myhealthteam/projects
```

**UltraPilot Development:**
```
https://github.com/hscheema1979/ultrapilot/projects
```

**Mission Control:**
```
https://github.com/hscheema1979/ultrapilot/projects
(Same as UltraPilot - it's a sub-project within the same repo)
```

### 3. Start Creating Issues

**For MyHealthTeam:**
```bash
# In myhealthteam repo
gh issue create \
  --title "[Feature] Patient scheduling system" \
  --label "feature-request,mega-project" \
  --body "Description of feature..."
```

**For UltraPilot:**
```bash
# In ultrapilot repo
gh issue create \
  --title "[Feature] Better task sizing" \
  --label "feature-request,ultrapilot-dev" \
  --body "Description of feature..."
```

**For Mission Control:**
```bash
# In ultrapilot repo
gh issue create \
  --title "[Mission Control] Repository browser" \
  --label "feature-request,mission-control" \
  --body "Description of feature..."
```

## Benefits of Hierarchy

1. **Clear Separation** - Each project has its own focus
2. **Cross-Project Visibility** - See how projects relate
3. **Granular Tracking** - Track at appropriate level
4. **Meta Development** - UltraPilot builds UltraPilot
5. **Recursive Improvement** - Mission Control improves itself

## Summary

**Three interconnected project boards:**
1. **MyHealthTeam Platform** - Tracks platform development
2. **UltraPilot Development** - Tracks tool development
3. **Mission Control** - Tracks dashboard features

**Hierarchy:**
- Mega-project (MyHealthTeam) uses Project (UltraPilot) which contains Sub-project (Mission Control)

**All autonomous** - Use `/ultrapilot start` in any issue to trigger autonomous workflows!
