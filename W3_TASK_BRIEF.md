# W3 Task Brief — dev-generalist

## Workspace isolation
- Work only in this path: `.workstations/dev-generalist`
- Branch: `agent/dev-generalist`
- Do not commit directly to `main`

## Objective
Implement web↔api integration MVP so we can use preview URLs to exercise real workflow behavior.

## Scope
1. **Web app scaffold in `apps/web`**
   - Initialize minimal Next.js app (App Router, TypeScript)
   - Add basic layout + health badge

2. **API client wiring**
   - Add typed client in web app for:
     - `GET /api/v1/tasks`
     - `POST /api/v1/tasks`
     - `POST /api/v1/tasks/:taskId/transition`
     - `GET /api/v1/agents`

3. **MVP board behavior**
   - Render task columns by status
   - Create task form (title/description)
   - Transition action buttons with optimistic UI fallback

4. **Config + docs**
   - `NEXT_PUBLIC_API_BASE_URL`
   - README updates for local dev + preview assumptions

## Acceptance checks
- `pnpm --filter @project-pwner/web build` passes
- Web app can list tasks from API
- Can create and transition tasks via UI
- Guard errors surfaced clearly in UI

## Deliverables
- Commit(s) on `agent/dev-generalist`
- Open PR to `main`
- Thread update: changed / blockers / verification
