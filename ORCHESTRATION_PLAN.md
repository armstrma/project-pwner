# Project Pwner – Orchestration Plan (v0)

Based on `ARCHITECTURE.md`.

## Current State
- Architecture/vision doc exists.
- Role directories exist:
  - `dev-generalist/`
  - `ui-designer/`
- No app scaffold, backend service, DB schema files, or UI implementation yet.

## Delivery Strategy
Following architecture sections:
- **Section 2.1 / 3:** task flow with human gates first.
- **Section 2.3:** isolated repos/workspaces expected, so start with clean modular scaffold.
- **Section 5:** Next.js + Node + Postgres baseline.

## Phase Plan

### Phase 0 — Bootstrap Foundations
1. Monorepo scaffold:
   - `apps/web` (Next.js)
   - `apps/api` (Node.js service)
   - `packages/shared` (types/contracts)
2. Tooling:
   - pnpm workspace
   - TypeScript configs
   - lint/format/test baseline
3. Initial docs:
   - local runbook
   - environment variable templates

### Phase 1 — Core Domain + Persistence
1. Postgres schema from architecture section 4:
   - `projects`, `agents`, `tasks`, `suggestions`
2. Migration setup + seed script
3. API contracts for:
   - task CRUD + status transitions
   - agent registry CRUD
   - suggestion inbox CRUD

### Phase 2 — Human-Gated Task Workflow (MVP)
1. Implement task state machine with gate rules:
   - Backlog → Ready requires PM approval
   - Review/Done merge gate by PM
2. UI MVP:
   - Kanban board
   - task detail drawer
   - assign agent / approve actions
3. Integrations stubbed:
   - OpenClaw dispatch adapter interface
   - Git/PR adapter interface

### Phase 3 — Agent Lifecycle + Git/Preview Integrations
1. Agent add/remove workflow (repo + workspace provisioning hooks)
2. PR create/track + preview URL attach
3. Suggestion inbox intake and approval to backlog

## Immediate Work Items

### W1 (dev-generalist)
- Build workspace scaffold + API skeleton + DB migration setup.
- Output: runnable services, schema migrations, typed API surface.

### W2 (ui-designer)
- Define design system + IA + screen wireframes for:
  - Kanban board
  - task detail/review panel
  - agent management view
  - suggestion inbox
- Output: component map + token decisions + interaction specs.

### W3 (integration pass)
- Connect web ↔ api for task list and state transitions.
- Gate transitions enforced server-side.

## Risks / Open Decisions
1. Backend framework choice not finalized in repo yet (Express/Fastify/Nest).
2. Auth provider deferred until post-MVP shell (Clerk vs Supabase Auth).
3. Real OpenClaw/GitHub wiring deferred until core state machine is stable.

## Definition of Done for MVP
- PM can create tasks, move to Ready via explicit approval.
- Agent assignment works.
- Agent completion can move task to Review.
- PM can approve/merge and task reaches Done.
- All state changes audited in DB.

## Communication & Preview Protocol

1. **Threads by role**
   - Orchestrator uses project thread for coordination and summaries.
   - Worker agents post in their own thread with:
     - what changed
     - blockers
     - next step

2. **Progress cadence**
   - Lightweight status updates at meaningful milestones (not every command).
   - Escalate blockers immediately.

3. **Preview visibility**
   - PR updates trigger `.github/workflows/preview.yml`.
   - Workflow attempts `apps/web` preview deploy and posts status to Discord thread.
   - Preview status includes fallback signaling (missing secrets / failed deploy).

4. **Acceptance checkpoints**
   - Orchestrator posts phase gate checks after each W1/W2/W3 milestone.
   - Merge approval requires:
     - server-side guard checks passing
     - basic smoke check evidence
     - preview link or explicit deploy-failure note with mitigation
