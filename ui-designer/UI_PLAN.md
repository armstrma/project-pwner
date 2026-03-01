# UI Plan — Project Pwner MVP

References: `../ARCHITECTURE.md` sections **2.1 (Task Management)**, **2.2 (Agent Management)**, **2.4 (Suggestion Inbox)**, **5 (Tech Stack)**.

## 1) MVP Information Architecture (IA)

## Primary navigation
1. **Board** (default)  
   - Kanban board for task lifecycle: `Backlog → Ready → In Progress → Review → Preview → Done/Merged` (2.1)
2. **Agents**  
   - Team/registry management and per-agent configuration (2.2)
3. **Suggestions**  
   - Inbox triage and approve-to-backlog flow (2.4)
4. **Settings** (MVP-light)  
   - Project-level metadata, integration status, and instruction snippets (read-only or minimal edit in MVP)

## Shared IA primitives
- **Global top bar**: project switcher (future), search (future), quick create task, notification center
- **Context rail (right side/drawer)**: task detail and review actions from any view
- **Status language normalization**:
  - Task statuses are product states (Backlog, Ready, etc.)
  - Gate actions are explicit verbs (Approve for Ready, Approve & Merge)

## Route map (Next.js App Router)
- `/board`
- `/agents`
- `/suggestions`
- `/settings`
- Optional deep links:
  - `/board?task={taskId}` opens detail drawer
  - `/agents/{agentId}` details/config
  - `/suggestions/{suggestionId}` detail modal

---

## 2) Page plans + low-fidelity layout notes

## A. Board (primary surface)

## Layout (desktop)
- **Header row**
  - Left: “Board” title + active filters chip row
  - Right: `+ New Task`, `View: Kanban/List` toggle (List can be disabled in MVP)
- **Kanban body**
  - 6 columns: Backlog, Ready, In Progress, Review, Preview, Done/Merged
  - Column header: status name + count
  - Card list with vertical scroll per column
- **Task detail drawer (right)**
  - Opens on card click, contains actions + audit/activity log

## Card content (minimum)
- Title
- Task ID
- Assignee avatar/name (or “Unassigned”)
- PR badge if present
- Preview badge if present
- Updated time
- Optional gate badge: `PM approval required`

## Key board behaviors
- Drag/drop allowed only for valid transitions.
- Invalid gate transitions show inline explanation and CTA:
  - Backlog → Ready requires PM approval (2.1)
  - Review/Preview → Done requires Approve & Merge
- Server is source of truth for transition enforcement.

## B. Task detail/review panel

## Sections
1. **Summary**: title, description, labels
2. **Status + assignment**: current status, assign/reassign agent
3. **Gate actions**:
   - `Approve to Ready` (from Backlog)
   - `Approve & Merge` (from Review/Preview)
4. **Engineering links**: PR URL, Preview URL
5. **Activity timeline**: status changes, approvals, assignment events

## Review-mode emphasis
- If task is in Review/Preview and PR exists:
  - highlight PR metadata block
  - show merge readiness checklist (MVP static): tests/status checks placeholders
  - primary CTA becomes `Approve & Merge`

## C. Agents page

## Layout
- Table/grid of agents with quick stats:
  - Name/slug
  - Status
  - Model/thinking level
  - Suggestion toggle
  - Current workload count
- Right-side or modal editor for selected agent config

## Agent config fields (2.2)
- Name / slug
- Role markdown
- Focus tags
- Heartbeat cron
- Suggestion-at-heartbeat toggle
- Model / thinking level
- Workspace override path

## Lifecycle affordances
- `Add Agent` wizard (stepper): profile → model/settings → confirm/provision
- `Deactivate/Delete Agent` with irreversible warning and typed confirm

## D. Suggestions inbox

## Layout
- Two-pane:
  - Left: filterable list (New, Approved, Rejected, Archived)
  - Right: suggestion detail with action buttons

## Actions
- `Approve to Backlog` (creates backlog task)
- `Reject`
- `Archive`
- `Assign for follow-up` (optional future)

## Suggestion list row content
- Title
- Source (agent/human)
- Age
- Status
- Relevance tags (if available)

---

## 3) Critical user flows (MVP)

## Flow 1: PM approval gate (Backlog → Ready)
1. PM opens task from Backlog.
2. Drawer shows required gate card: “This transition requires PM approval.”
3. PM clicks `Approve to Ready`.
4. Confirm dialog summarizes:
   - task title
   - next status (Ready)
   - assignment state (assigned/unassigned)
5. Backend transition call succeeds.
6. Card moves to Ready; activity log writes approval event.
7. If auto-dispatch enabled later, show non-blocking notice: “Agent notified.”

Failure states:
- Permission denied: show role-based error.
- Conflict/stale status: show “Task changed, refresh.” with retry.

## Flow 2: Approve & Merge (Review/Preview → Done)
1. PM opens task in Review/Preview.
2. Drawer displays PR + preview links and merge summary block.
3. PM reviews then clicks `Approve & Merge`.
4. Confirm dialog includes irreversible merge warning.
5. Backend executes merge and status transition.
6. Success toast + status becomes Done/Merged + timeline event.

Failure states:
- Merge blocked/conflict: stay in Review and surface failure reason.
- Missing PR: disable action with clear helper text.

## Flow 3: Assign/Reassign Agent
1. PM opens task drawer.
2. Click assignee control and pick agent.
3. Save triggers assignment mutation.
4. Task card + drawer reflect new assignee.
5. Timeline entry recorded (`assignee changed from X to Y`).

Failure states:
- Agent inactive: disallow selection or warn before save.
- Task locked by merge op: show temporary lock message.

---

## 4) Interaction and usability rules

- Prefer **explicit action buttons** for gated transitions over pure drag/drop.
- Drag/drop can initiate transition, but gated transitions must route through confirmation modal.
- Every destructive/irreversible action requires confirmation.
- Support keyboard-first operation for all primary actions.
- Keep status color semantics consistent across board, drawer, and badges.

---

## 5) Accessibility guidance (MVP baseline)

- WCAG AA contrast for all status chips and buttons.
- Full keyboard navigation:
  - tab order through board controls/cards
  - enter/space opens drawer or activates focused control
- ARIA:
  - columns as labeled regions
  - cards as interactive list items/buttons
  - dialogs trap focus and restore on close
- Screen reader announcements for status changes and toasts.
- Non-color cues for state (icons/text labels, not color only).

---

## 6) Implementation notes for Next.js + shadcn (Section 5)

- Build using shadcn primitives and compose feature components.
- Use TanStack Query for data and mutation status.
- Keep domain logic server-enforced (especially gate transitions).
- Suggested responsive breakpoints:
  - Desktop: full 6-column board
  - Tablet: horizontal board scroll
  - Mobile: list-by-status with quick filters

---

## 7) Handoff checklist to dev-generalist

1. Implement routes and shell nav per IA.
2. Implement board + drawer with gated actions.
3. Add assignment control with active-agent filter.
4. Build suggestions two-pane inbox with approve/reject/archive.
5. Add accessible dialog/toast patterns and keyboard support.
6. Instrument activity timeline for all mutations.
