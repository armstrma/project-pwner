# Component Spec — Project Pwner MVP

Aligned to `../ARCHITECTURE.md` sections **2.1, 2.2, 2.4, 5** and shadcn/ui composition.

## 1) Design tokens (MVP foundation)

## Color tokens (semantic)
- `bg.canvas`, `bg.surface`, `bg.elevated`
- `text.primary`, `text.secondary`, `text.muted`
- `border.default`, `border.strong`
- `status.backlog`, `status.ready`, `status.inProgress`, `status.review`, `status.preview`, `status.done`
- `intent.success`, `intent.warning`, `intent.danger`, `intent.info`

Note: status chips must pass AA contrast and include icon/text cues.

## Typography tokens
- `type.display` (page title)
- `type.heading` (section title)
- `type.body`
- `type.meta` (timestamps, IDs)
- `type.code` (IDs/slugs)

## Spacing/radius/elevation
- 4/8px base grid
- Radius: `sm(6)`, `md(10)`, `lg(14)`
- Elevation: `level1` (cards), `level2` (drawers/modals)

## Motion
- Fast transitions (120–180ms)
- Reduced-motion respects `prefers-reduced-motion`

---

## 2) Core primitives (shadcn-level)

- Button (primary/secondary/ghost/destructive)
- Badge (status + metadata)
- Card
- Dialog / AlertDialog
- Drawer / Sheet
- Tabs
- Select / Combobox
- Input / Textarea
- Tooltip
- Toast
- Skeleton
- Table
- Switch
- Command (search/palette, future-ready)

---

## 3) Feature components

## A. Task board domain

### `TaskColumn`
Purpose: render one status lane.

Props:
- `status`
- `title`
- `count`
- `cards[]`
- `canDropToStatus` (function)

States:
- default
- drag-over valid
- drag-over invalid
- loading
- empty

Accessibility:
- `aria-label="{status} column"`
- announce drop result via live region

### `TaskCard`
Props:
- `id`, `title`, `assignee`, `prUrl?`, `previewUrl?`, `updatedAt`, `gateRequired?`

Interactions:
- click/enter opens detail drawer
- drag handle for pointer drag

States:
- default
- hovered/focused
- selected
- blocked (invalid transition attempt feedback)

### `TaskDetailDrawer`
Props:
- `task`
- `agents[]`
- callbacks: `onApproveReady`, `onApproveMerge`, `onAssign`

Sections:
- Header/meta
- Description
- Assignment
- Gate actions
- Links (PR/preview)
- Activity timeline

States:
- loading
- ready
- mutation pending
- mutation error

## B. Gate actions

### `GateActionPanel`
Displays next valid gated actions for current task state.

Rules:
- Backlog: show `Approve to Ready`
- Review/Preview with PR: show `Approve & Merge`
- Others: show contextual guidance text

### `TransitionConfirmDialog`
Reusable confirmation for gated transitions.

Props:
- `actionType` (`approve-ready` | `approve-merge`)
- `taskSummary`
- `riskText`

States:
- idle
- confirming
- submitting
- success/failure (dismiss to parent)

## C. Assignment

### `AssigneeSelect`
- Searchable combobox
- Show active/inactive agent status
- Optional quick-clear assignment

Validation:
- cannot assign inactive unless override mode (future)

## D. Agents domain

### `AgentTable`
Columns:
- Name
- Status
- Model
- Thinking level
- Suggestion toggle
- Workload
- Actions

States:
- loading
- populated
- empty
- error

### `AgentConfigPanel`
Editable form for section 2.2 fields.

Form sections:
1. Identity (name/slug)
2. Role + focus
3. Runtime (model/thinking/workspace)
4. Cadence (heartbeat/suggestion toggle)

Validation:
- slug uniqueness
- cron syntax format (basic)

### `AddAgentWizard` (MVP simple)
Steps:
1. Basic info
2. Runtime settings
3. Review & provision

## E. Suggestions domain

### `SuggestionList`
- Filter tabs: New / Approved / Rejected / Archived
- Search input

### `SuggestionDetailPane`
- Body content
- Source metadata
- Actions: Approve to Backlog / Reject / Archive

### `ApproveSuggestionDialog`
- Optional prefill for task title/description
- Confirm creation in Backlog

---

## 4) Global states and system feedback

## Async states (all screens)
- Initial loading: skeletons
- Empty states: actionable copy + primary CTA
- Error states: inline alert + retry
- Mutation pending: disable action buttons + spinner
- Optimistic UI only where rollback is safe (assignment ok; merge not optimistic)

## Notifications
- Toast success on mutation complete
- Toast error with concise actionable message
- Keep long technical errors collapsible (`Show details`)

---

## 5) Permission, gating, and state matrix

## Task transition controls
- Backlog → Ready:
  - UI: button enabled for PM role only
  - Server: must enforce gate regardless of UI
- In Progress → Review:
  - typically agent/system event; PM can override if needed (future)
- Review/Preview → Done:
  - UI: `Approve & Merge`
  - disabled when PR missing or merge blocked

## Disabled-state copy examples
- “PM approval required to move this task to Ready.”
- “Merge unavailable until PR is open and checks pass.”

---

## 6) Accessibility and inclusive behavior

- Focus visible on every interactive element.
- Minimum target size ~44x44px for touch targets.
- Dialogs:
  - labelled title + description
  - focus trap
  - escape to close (except critical confirms if policy requires)
- Board interactions:
  - keyboard fallback for status move (Move menu) in addition to drag/drop
- Assistive text for icons and status-only badges.
- Respect reduced motion and avoid motion-only context changes.

---

## 7) Analytics and event hooks (handoff-ready)

Emit UI events for key actions:
- `task_opened`
- `task_transition_attempted`
- `task_transition_succeeded`
- `task_transition_failed`
- `task_assigned`
- `merge_approved`
- `suggestion_approved_to_backlog`
- `agent_created`
- `agent_updated`

These support auditing and product feedback loops without changing core UX.

---

## 8) Build order recommendation

1. Primitives + token setup
2. Board + TaskCard + Drawer
3. GateActionPanel + TransitionConfirmDialog
4. AssigneeSelect
5. Suggestions list/detail/action dialogs
6. Agent table + config panel + add wizard
7. Empty/error polish + accessibility pass
