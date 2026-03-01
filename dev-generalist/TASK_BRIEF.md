# Task Brief — dev-generalist

Reference: `../ARCHITECTURE.md` sections 2.1, 2.3, 4, 5.

## Objective
Deliver the technical foundation for Project Pwner MVP:
- monorepo scaffold
- API skeleton
- Postgres schema + migrations
- task workflow state machine backend enforcement

## Scope (Initial)
1. Initialize workspace structure:
   - `apps/web` (placeholder only for now)
   - `apps/api`
   - `packages/shared`
2. In `apps/api`:
   - TypeScript server bootstrap
   - health endpoint
   - task endpoints scaffold
   - agent endpoints scaffold
3. DB layer:
   - migration tool setup
   - schema for `projects`, `agents`, `tasks`, `suggestions`
4. Implement task status transition guardrails:
   - enforce PM-gated transitions as described in architecture flow

## Non-Goals
- No full UI implementation.
- No full OpenClaw or GitHub integration yet (interfaces/stubs only).

## Deliverables
- runnable `pnpm dev` for API
- migration files + schema docs
- API route list + sample payloads
- concise README in `apps/api`
