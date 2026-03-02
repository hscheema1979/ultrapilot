# Skills Analysis - Old Ultra-Plugin vs New Ultrapilot

## What We Have NOW

### Installed Skills (from old ultra-plugin)
Located at: `~/.claude/skills/`

**Core workflow skills:**
- `ultra-planning` - Superpowers writing-plans skill (110 lines)
- `autopilot` - OMC execution orchestrator (185 lines)
- `ultrapilot` - Main entry point (239 lines)

**Supporting skills:**
- `ultra-brainstorm` - Brainstorming principles (105 lines)
- `ultra-ralph` - Persistent execution loop (352 lines)
- `ultra-ultrawork` - Parallel execution engine (138 lines)
- `ultra-team` - Multi-agent coordination (213 lines)
- `ultra-verification` - Completion verification (145 lines)

**Review skills:**
- `ultra-security-review` - Security audit (461 lines)
- `ultra-quality-review` - Performance/quality (192 lines)
- `ultra-code-review` - Code review (34 lines)

**Other skills:**
- `ultra-tdd` - Test-driven development (372 lines)
- `ultra-debugging` - Debugging workflow (297 lines)
- `ultra-pipeline` - Agent chaining (441 lines)
- `ultra-ccg` - Tri-model orchestration (134 lines)
- `ultra-plan` - Strategic planning (263 lines)
- `ultra-domain-setup` - Domain initialization
- `ultra-autoloop` - Persistent heartbeat

---

## The OLD Workflow (from ultra-plugin)

```
User: /ultrapilot Build me X
    ↓
[ULTRAPILOT skill]
    ↓ (invokes)
[ULTRA-PLANNING skill]
    → Creates detailed plan (Superpowers writing-plans)
    → Saves to docs/plans/
    ↓ (invokes)
[AUTOPILOT orchestrator]
    → Loads plan from docs/plans/
    → Executes with Ralph + Ultrawork
    → QA cycles
    → Multi-perspective validation
    → Cleanup
    ↓
Complete
```

---

## What's MISSING: Domain Expert Review Loop

**What the user wants (the "stolen workflow"):**

```
Superpowers brainstorming + OMC analysis
    ↓
OMC architect plan
    ↓
Superpowers writing skill (ultra-planning)
    → Creates detailed plan draft
    ↓
[DOMAIN EXPERT REVIEWS] ← MISSING!
    → Parallel reviews by wshobson's agents + OMC agents
    → Frontend expert reviews frontend section
    → Backend expert reviews backend section
    → Database expert reviews database section
    → API integration expert reviews I/O contracts
    ↓
Feedback aggregated
    ↓
[FEEDBACK LOOP] ← MISSING!
    → ultra-planning incorporates feedback
    → Re-review by domain experts
    → Repeat until approved (max 3 cycles)
    ↓
When all approved → AUTOPILOT execution
```

---

## The Problem

**Current ultra-planning skill:**
- Creates detailed plan
- Immediately invokes autopilot
- NO domain expert reviews
- NO feedback loop
- NO I/O contract validation

**What we need:**
- Domain expert reviews BEFORE execution
- Feedback loop with revisions
- I/O contract validation
- Only execute when approved

---

## Two Approaches

### Option A: Enhance ultra-planning skill
Modify `skills/ultra-planning/SKILL.md` to add:
1. Domain expert review loop
2. Feedback aggregation
3. Revision cycles
4. Approval check
5. THEN invoke autopilot

**Pros:**
- Keeps everything in one skill
- Follows existing pattern

**Cons:**
- Makes ultra-planning skill very large
- Harder to maintain

### Option B: Create Phase 1.5 as separate skill
Create `skills/ultra-detailed-planning/SKILL.md` that:
1. Calls ultra-planning to create draft
2. Spawns domain expert reviews
3. Aggregates feedback
4. Runs revision cycles
5. When approved → calls autopilot

**Pros:**
- Separates concerns
- Easier to maintain
- Can be toggled on/off

**Cons:**
- Adds another layer
- More complex flow

---

## What We've Implemented So Far

✅ **Agent catalog** - Added 8 domain expert agents
✅ **State management** - Added DetailedPlanningState, IO contracts, reviews
✅ **Design documents** - Complete Phase 1.5 specification

⏳ **Still need:**
- Ultra-detailed-planning skill implementation
- HUD updates for Phase 1.5
- Integration with ultra-planning and autopilot
- Testing

---

## Recommended Approach

**Use Option A: Enhance ultra-planning skill**

Why?
1. ultra-planning is already the "Superpowers writing skill"
2. It should include the domain expert review loop
3. Simpler flow: ultra-planning → (reviews + feedback) → autopilot
4. Follows the stolen workflow more closely

**Implementation:**

Modify `skills/ultra-planning/SKILL.md` to add:

```markdown
## Workflow (Enhanced with Domain Expert Reviews)

### Step 1: Create Detailed Plan Draft
[existing ultra-planning logic]

### Step 2: Identify Domains
Analyze plan and identify domains (frontend, backend, database, etc.)

### Step 3: Parallel Domain Expert Reviews
Spawn appropriate expert agents:
- ultra:frontend-expert
- ultra:backend-expert
- ultra:database-expert
- ultra:api-integration-expert
- etc.

### Step 4: Aggregate Feedback
Collect all reviews and categorize issues

### Step 5: Approval Check
If all approve → Proceed to autopilot
If issues → Revise and re-review (max 3 cycles)

### Step 6: Revision Cycle (if needed)
Incorporate feedback and re-review

### Step 7: Invoke Autopilot
Only when all domain experts approve
```

---

## What's in the New Ultrapilot Repo

**At `/home/ubuntu/hscheema1979/ultrapilot/`:**

```
skills/
├── ultra-autoloop.md (already there)
├── ultra-domain-setup.md (already there)
├── autopilot/ (copied from old ultra-plugin)
├── ultra-brainstorm/ (copied)
├── ultra-ccg/ (copied)
├── ultra-code-review/ (copied)
├── ultra-debugging/ (copied)
├── ultra-pipeline/ (copied)
├── ultra-plan/ (copied)
├── ultra-planning/ (copied) ← KEY SKILL
├── ultra-quality-review/ (copied)
├── ultra-ralph/ (copied)
├── ultra-security-review/ (copied)
├── ultra-tdd/ (copied)
├── ultra-team/ (copied)
├── ultra-ultrawork/ (copied)
├── ultra-verification/ (copied)
└── ultrapilot/ (copied)
```

**All the skills are there!** We just need to:
1. Enhance ultra-planning with domain expert review loop
2. Update the main flow to use Phase 1.5
3. Test it

---

## Next Steps

1. **Modify ultra-planning skill** to add domain expert review loop
2. **Update ultrapilot skill** to call ultra-planning with review loop
3. **Add HUD support** for Phase 1.5 progress
4. **Test** the complete flow
5. **Commit** all changes

---

## Summary

**Good news:** All the skills from old ultra-plugin are now in the new repo!

**What we learned:** The ultra-planning skill creates detailed plans, but it's missing the domain expert review loop that the user wants.

**What to do:** Enhance ultra-planning to include the domain expert review loop before handing off to autopilot.

**This matches the stolen workflow:**
Superpowers writing (ultra-planning) + Domain expert reviews + Feedback loop → Autopilot execution
