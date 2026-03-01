# W3 Task Brief — ui-designer

## Workspace isolation
- Work only in this path: `.workstations/ui-designer`
- Branch: `agent/ui-designer`
- Do not commit directly to `main`

## Objective
Translate UI plan/spec into implementable UI structure for the first interactive preview.

## Scope
1. **Token + layout baseline (web app)**
   - Define minimal design tokens (spacing/type/color vars)
   - Establish page shell and board layout rhythm

2. **Component implementations (MVP subset)**
   - TaskColumn
   - TaskCard
   - TaskDetailDrawer (or panel fallback)
   - GateActionPanel for transition controls

3. **States and UX notes**
   - Loading/empty/error states for board and detail
   - Disabled/permission states for gated transitions

4. **Handoff alignment**
   - Keep props/API contracts aligned with dev-generalist client wiring
   - Update `COMPONENT_SPEC.md` with any implementation deltas

## Acceptance checks
- Components are renderable in app routes
- Empty/loading/error states visibly tested
- Basic accessibility labels/roles included

## Deliverables
- Commit(s) on `agent/ui-designer`
- Open PR to `main`
- Thread update: changed / blockers / verification
