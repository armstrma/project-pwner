# Database Schema (MVP)

Tables follow architecture section 4.

- `projects`
- `agents`
- `tasks`
- `suggestions`

Implemented in migration: `db/migrations/001_init.sql`.

Status enums:
- `task_status`: backlog, ready, in_progress, review, preview, done
- `agent_status`: active, inactive
- `suggestion_status`: new, approved, rejected, archived
