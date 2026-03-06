# Visual Guide: GitHub Project Board Dashboard

## How to Access Your Dashboard

### Step 1: Run the Setup Script
```bash
cd ~/.claude/plugins/ultrapilot
npx tsx setup-project-board.ts
```

### Step 2: Open in Browser
```
https://github.com/hscheema1979/ultra-workspace/projects
```

## What You'll See

### Initial View (Empty Board)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ hscheema1979 / ultra-workspace                                            │
├────────────────────────────────────────────────────────────────────────────┤
│ ☰  Projects                                      + Add project             │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  UltraPilot Mission Control                                    ▼           │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │                                                                     │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐│ │
│  │  │ 📥 Backlog  │  │  📏 Sizing  │  │ 📋 Planning │  │  🔍 Review  ││ │
│  │  │    (0)      │  │    (0)      │  │    (0)      │  │    (0)      ││ │
│  │  │             │  │             │  │             │  │             ││ │
│  │  │             │  │             │  │             │  │             ││ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘│ │
│  │                                                                     │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐│ │
│  │  │  ✅ Ready   │  │⚙️ In Progress│  │  🧪 QA      │  │✔️ Validation ││ │
│  │  │    (0)      │  │    (0)      │  │    (0)      │  │    (0)      ││ │
│  │  │             │  │             │  │             │  │             ││ │
│  │  │             │  │             │  │             │  │             ││ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘│ │
│  │                                                                     │ │
│  │  ┌─────────────┐  ┌─────────────┐                                   │ │
│  │  │🔎 Verifica..│  │  🎉 Complete │                                   │ │
│  │  │    (0)      │  │    (0)      │                                   │ │
│  │  │             │  │             │                                   │ │
│  │  │             │  │             │                                   │ │
│  │  └─────────────┘  └─────────────┘                                   │ │
│  │                                                                     │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  Add cards                                                                │
└────────────────────────────────────────────────────────────────────────────┘
```

### After Adding Issues (Populated Board)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  UltraPilot Mission Control                                  [Filter]      │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │ 📥 Backlog  │  │  📏 Sizing  │  │ 📋 Planning │  │  🔍 Review  │      │
│  │    (3)      │  │    (1)      │  │    (2)      │  │    (0)      │      │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤  ├─────────────┤      │
│  │#120: User   │  │#118: Auth   │  │#115: API    │  │             │      │
│  │   Auth      │  │   System    │  │   Design    │  │             │      │
│  │   [feature] │  │   [sizing]  │  │   [plan]    │  │             │      │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤  │             │      │
│  │#121: Dashboard│ │             │  │#116: DB     │  │             │      │
│  │   [feature] │  │             │  │   Schema    │  │             │      │
│  ├─────────────┤  │             │  ├─────────────┤  │             │      │
│  │#122: Real-  │  │             │  │#117: Test   │  │             │      │
│  │   time      │  │             │  │   Suite     │  │             │      │
│  │   [feature] │  │             │  │             │  │             │      │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘      │
│                                                                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │  ✅ Ready   │  │⚙️ In Progress│  │  🧪 QA      │  │✔️ Validation │      │
│  │    (1)      │  │    (2)      │  │    (0)      │  │    (0)      │      │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤  ├─────────────┤      │
│  │#119: Micro- │  │#112: Login  │  │             │  │             │      │
│  │   services  │  │   Endpoint  │  │             │  │             │      │
│  │   [ready]   │  │   [exec]    │  │             │  │             │      │
│  │             │  ├─────────────┤  │             │  │             │      │
│  │             │  │#113: JWT    │  │             │  │             │      │
│  │             │  │   Tokens    │  │             │  │             │      │
│  │             │  │   [exec]    │  │             │  │             │      │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘      │
│                                                                            │
│  ┌─────────────┐  ┌─────────────┐                                            │
│  │🔎 Verifica..│  │  🎉 Complete │                                            │
│  │    (0)      │  │   (15)      │                                            │
│  ├─────────────┤  ├─────────────┤                                            │
│  │             │  │#100: User   │                                            │
│  │             │  │   Mgmt      │                                            │
│  │             │  │   [done]    │                                            │
│  │             │  ├─────────────┤                                            │
│  │             │  │#101: API    │                                            │
│  │             │  │   Gateway   │                                            │
│  │             │  │   [done]    │                                            │
│  │             │  ├─────────────┤                                            │
│  │             │  │... (13 more)│                                            │
│  │             │  └─────────────┘                                            │
│  └─────────────┘  └─────────────┘                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

## How to Interact with Cards

### Click a Card (Opens Issue Details)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ #118: [Feature] Authentication System                           [Close]  │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  Labels: feature-request mega-project size:l domain:auth                   │
│  Projects: UltraPilot Mission Control → 📏 Sizing                          │
│                                                                            │
│  ## Description                                                             │
│  Build a complete authentication system with:                               │
│  - User registration and login                                              │
│  - JWT token management                                                     │
│  - Password reset flow                                                      │
│  - Session management                                                       │
│                                                                            │
│  ## Acceptance Criteria                                                     │
│  - [ ] Users can register with email/password                               │
│  - [ ] Users can login with email/password                                  │
│  - [ ] JWT tokens generated on login                                        │
│  - [ ] Password reset emails sent                                           │
│  - [ ] Sessions timeout after 15 minutes                                    │
│                                                                            │
│  ## Activity                                                                │
│  ▼ 47 comments                                                             │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 💬 hscheema1979 (Owner) - 2 hours ago                               │   │
│  │                                                                   │   │
│  │ /ultrapilot start                                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 💬 ultra-planner (Agent) - 1 hour ago                               │   │
│  │                                                                   │   │
│  │ ## STEP 0.5: Multi-Agent Task Sizing                                │   │
│  │                                                                   │   │
│  │ **Agent:** ultra:planner                                            │   │
│  │ **Model:** Opus                                                     │   │
│  │                                                                   │   │
│  │ **Size Estimate:** L                                                │   │
│  │                                                                   │   │
│  │ **Reasoning:**                                                      │   │
│  │ - Task count: 35 tasks detected                                    │   │
│  │ - Complexity: Medium (5 integration points)                        │   │
│  │ - Estimated duration: 5 hours                                       │   │
│  │                                                                   │   │
│  │ **Breakdown:**                                                      │   │
│  │ - Requirements: 8 tasks                                            │   │
│  │ - Architecture: 5 tasks                                            │   │
│  │ - Implementation: 20 tasks                                         │   │
│  │ - Testing: 2 tasks                                                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
│  ... (45 more comments)                                                     │
│                                                                            │
│  [Load more...]                                                            │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Write a preview...                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
│  [Submit comment]                                                          │
└────────────────────────────────────────────────────────────────────────────┘
```

### Drag and Drop Cards (Change Phase)

```
To move a card from "📏 Sizing" to "📋 Planning":

1. Click and hold on the card
2. Drag it to the "📋 Planning" column
3. Release to drop it

The card automatically moves and shows its new position!
```

## Real-World Usage Example

### Scenario: New Feature Request

**User Action:**
```
1. Click "New Issue"
2. Title: "[Feature] Add two-factor authentication"
3. Labels: feature-request
4. Projects: UltraPilot Mission Control → 📥 Backlog
5. Submit
```

**What Happens Automatically:**

```
┌────────────────────────────────────────────────────────────────────────────┐
│  [Card appears in 📥 Backlog column]                                      │
│                                                                            │
│  ┌─────────────┐                                                           │
│  │ 📥 Backlog  │                                                           │
│  │    (4)      │                                                           │
│  ├─────────────┤                                                           │
│  │#123: 2FA    │  ← NEW CARD APPEARS HERE                                  │
│  │   Auth      │                                                           │
│  │   [feature] │                                                           │
│  ├─────────────┤                                                           │
│  │#120: User   │                                                           │
│  │   Auth      │                                                           │
│  │   [feature] │                                                           │
│  └─────────────┘                                                           │
└────────────────────────────────────────────────────────────────────────────┘
```

**User adds comment:**
```
/ultrapilot start
```

**System automatically:**

1. **Posts sizing agent comments** (within 1 minute)
   ```
   ultra:planner: "Size: M (25 tasks, 3 hours)"
   ultra:architect: "Size: L (5 integration points)"
   ultra:team-lead: "Size: L (requires 2 parallel workflows)"
   ```

2. **Adds label automatically**
   ```
   Labels: feature-request, sizing, size:l
   ```

3. **Moves card automatically** (or you can drag it)
   ```
   From: 📥 Backlog
   To: 📏 Sizing
   ```

```
┌────────────────────────────────────────────────────────────────────────────┐
│  [Card moves to 📏 Sizing column]                                         │
│                                                                            │
│  ┌─────────────┐                                                           │
│  │  📏 Sizing  │                                                           │
│  │    (2)      │                                                           │
│  ├─────────────┤                                                           │
│  │#118: Auth   │                                                           │
│  │   System    │                                                           │
│  │   [sizing]  │                                                           │
│  ├─────────────┤                                                           │
│  │#123: 2FA    │  ← CARD MOVED HERE                                       │
│  │   Auth      │                                                           │
│  │   [sizing]  │                                                           │
│  └─────────────┘                                                           │
└────────────────────────────────────────────────────────────────────────────┘
```

## Monitoring Progress

### At a Glance Dashboard

From the project board, you can see:

```
┌────────────────────────────────────────────────────────────────────────────┐
│  UltraPilot Mission Control                                  [Today ▼]     │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  Summary:                                                                  │
│  • 3 features in planning                                                 │
│  • 2 features actively being built                                        │
│  • 15 features completed this month                                       │
│  • 47 total features completed                                             │
└────────────────────────────────────────────────────────────────────────────┘
```

### Filter Views

```
[Filter by:]
┌────────────────────┐
│ Assigned to you    │
│ Created by you     │
│ Mentioning you     │
│ ────────────────── │
│ Labels:            │
│ □ feature-request  │
│ □ sizing           │
│ □ planning         │
│ ☑ in-progress      │
│ □ complete         │
│ ────────────────── │
│ Milestone:         │
│ □ Sprint 1         │
│ □ Sprint 2         │
└────────────────────┘
```

## Mobile Access

### GitHub Mobile App

```
1. Open GitHub mobile app
2. Tap "Projects" tab
3. Select "UltraPilot Mission Control"
4. See same board interface
5. Tap cards to view details
6. Swipe to move between columns
```

## Keyboard Shortcuts

### When viewing project board:

```
c - Focus card search
/ - Focus project search
q - Switch projects
? - Show keyboard shortcuts
```

### When viewing issue:

```
j - Next comment
k - Previous comment
c - Comment
e - Edit
l - Label
p - Project
s - Subscribe
. - Load more
```

## Summary: How to Use It Daily

### Morning Routine (5 minutes)
1. Open project board URL
2. Check "⚙️ In Progress" column
3. Review agent comments overnight
4. Move completed cards to next column

### During Day (As Needed)
1. Watch for email notifications (agent comments)
2. Click link to view in project board
3. See progress at a glance

### Evening Routine (5 minutes)
1. Review all columns
2. Move cards to appropriate stages
3. Check for stuck workflows
4. Plan tomorrow's work

## URL Shortcut

**Bookmark this:**
```
https://github.com/hscheema1979/ultra-workspace/projects
```

This is your Mission Control dashboard - always available, shows everything at a glance!

**Total setup time: 2 minutes**
**Daily usage time: 5-10 minutes**
**No code required!**
