# Complete Project Structure

## 🏗️ Two Separate Uber Projects

Your GitHub organization now has **two separate uber project boards**, each managing different domains:

---

## 🏥 Healthcare Platform (Uber Project #1)

**Organization:** creative-adventures

**Purpose:** Complete healthcare application ecosystem

**Project Board:** https://github.com/creative-adventures/myhealthteam/projects

**Linked Repositories:**
- ✅ `creative-adventures/myhealthteam` - Main health platform
- ✅ `creative-adventures/myhealthteam.org` - Health platform website
- ⏳ `creative-adventures/myhealthteam2-refactor` - Platform refactor *(needs transfer from hscheema1979)*
- ⏳ `creative-adventures/myhealthteam-chatbot` - Chatbot interface *(needs transfer from hscheema1979)*

**Workflow Stages:**
```
Strategic → Requirements → Architecture → Development → Testing → Deployment → Monitoring → Complete
```

**Field Details:**
- Field Name: "Workflow Stage"
- Type: Single Select with 8 options
- Each stage has a unique color and description

---

## 🚀 Ultra-Workspace (Uber Project #2)

**Organization:** hscheema1979

**Purpose:** AI-powered development orchestration and tooling

**Project Board:** https://github.com/hscheema1979/ultra-workspace/projects

**Sub-Projects:**
1. **UltraPilot Development**
   - URL: https://github.com/hscheema1979/ultrapilot/projects
   - Repo: `hscheema1979/ultrapilot`
   - Purpose: Autonomous development tool itself

2. **Mission Control Dashboard**
   - URL: https://github.com/hscheema1979/ultrapilot/projects
   - Repo: `hscheema1979/ultrapilot`
   - Purpose: Dashboard and automation for tracking all projects

3. **VPS Monitoring Dashboard**
   - Status: 🚧 TBD (needs to be committed)
   - Purpose: Server monitoring and alerting

**Workflow Stages:**
```
Strategic → Infrastructure → Development → Integration → Testing → Monitoring → Documentation → Complete
```

---

## 📊 Visual Hierarchy

```
GITHUB ORGANIZATIONS
│
├─ 🏥 CREATIVE-ADVENTURES (Healthcare)
│  └─ Healthcare Platform (Uber Project)
│     ├─ myhealthteam
│     ├─ myhealthteam.org
│     ├─ myhealthteam2-refactor ⏳
│     └─ myhealthteam-chatbot ⏳
│
└─ 🚀 HSCHEEMA1979 (Development Tools)
   └─ Ultra-Workspace (Uber Project)
      ├─ UltraPilot Development (Project)
      ├─ Mission Control (Project)
      └─ VPS Monitoring Dashboard (TBD)
```

---

## 🔗 Quick Access URLs

### Healthcare Platform (creative-adventures)
- **Project Board:** https://github.com/creative-adventures/myhealthteam/projects
- **Repo 1:** https://github.com/creative-adventures/myhealthteam
- **Repo 2:** https://github.com/creative-adventures/myhealthteam.org
- **Repo 3:** https://github.com/creative-adventures/myhealthteam2-refactor *(pending transfer)*
- **Repo 4:** https://github.com/creative-adventures/myhealthteam-chatbot *(pending transfer)*

### Ultra-Workspace (hscheema1979)
- **Uber Project:** https://github.com/hscheema1979/ultra-workspace/projects
- **UltraPilot:** https://github.com/hscheema1979/ultrapilot/projects
- **Mission Control:** https://github.com/hscheema1979/ultrapilot/projects (same as UltraPilot)

---

## 📝 Pending Tasks

### Healthcare Platform
- [ ] Transfer `hscheema1979/myhealthteam2-refactor` → `creative-adventures/myhealthteam2-refactor`
- [ ] Transfer `hscheema1979/myhealthteam-chatbot` → `creative-adventures/myhealthteam-chatbot`
- [ ] Run `link-transferred-repos.sh` to link them to Healthcare Platform
- [ ] Delete old Healthcare Platform project from hscheema1979 (project #9)

**Transfer Instructions:**
1. Go to: https://github.com/hscheema1979/myhealthteam2-refactor/settings
2. Click "Transfer repository"
3. Enter: "creative-adventures"
4. Confirm transfer
5. Repeat for myhealthteam-chatbot
6. Run: `bash ~/.claude/plugins/ultrapilot/scripts/link-transferred-repos.sh`

### Ultra-Workspace
- [ ] Commit VPS Monitoring Dashboard code
- [ ] Create/link VPS Monitoring Dashboard project
- [ ] Decide: Should VPS Monitoring be in ultra-workspace repo or separate?

---

## 🎯 How to Use

### On Mobile App (GitHub)

#### Healthcare Platform
1. Open `creative-adventures/myhealthteam` repo
2. Tap "Projects" tab
3. See "Healthcare Platform" board
4. View issues across all 4 healthcare repos

#### Ultra-Workspace
1. Open `hscheema1979/ultra-workspace` repo
2. Tap "Projects" tab
3. See "Ultra-Workspace" board
4. View infrastructure/dev tool tasks

#### UltraPilot & Mission Control
1. Open `hscheema1979/ultrapilot` repo
2. Tap "Projects" tab
3. Switch between:
   - "UltraPilot Development" - Tool development
   - "Mission Control" - Dashboard development

---

## ✨ Benefits

1. **Clear Separation** - Healthcare vs Development Tools
2. **Domain-Specific Workflows** - Each uber project has relevant stages
3. **Cross-Repo Visibility** - See all work in one board
4. **Organizational Alignment** - Healthcare apps in creative-adventures, dev tools in hscheema1979
5. **Mobile-Friendly** - All accessible via GitHub mobile app

---

## 📚 Organization Strategy

**creative-adventures** = Healthcare & Patient-Facing Apps
- myhealthteam
- myhealthteam.org
- myhealthteam2-refactor
- myhealthteam-chatbot

**hscheema1979** = Development Infrastructure & Tooling
- ultra-workspace
- ultrapilot
- vps-monitoring

This keeps production healthcare apps separate from internal development tools.

---

**Last Updated:** 2026-03-06
**Created by:** UltraPilot Setup Scripts
