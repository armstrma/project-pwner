# @project-pwner/api

Fastify + TypeScript API skeleton for Project Pwner MVP.

## Quick start

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
pnpm --filter @project-pwner/api dev
```

Server starts on `http://localhost:4000`.

## Migrations

```bash
export DATABASE_URL=postgres://...
pnpm --filter @project-pwner/api db:migrate
```

Migrations are SQL files in `apps/api/db/migrations` and are tracked in `schema_migrations`.

## Endpoints (MVP scaffold)

### Health
- `GET /health` -> `{ "status": "ok" }`

### Tasks
- `GET /api/v1/tasks`
- `POST /api/v1/tasks`
  - body:
    ```json
    {
      "projectId": "proj_1",
      "title": "Implement workflow guard",
      "description": "Enforce PM gated transitions",
      "assigneeAgentId": "agent_1"
    }
    ```
- `POST /api/v1/tasks/:taskId/transition`
  - body:
    ```json
    {
      "toStatus": "ready",
      "actor": "pm"
    }
    ```

### Agents
- `GET /api/v1/agents`
- `POST /api/v1/agents`
  - body:
    ```json
    {
      "projectId": "proj_1",
      "name": "Dev Generalist",
      "slug": "dev-generalist",
      "workspacePath": "/workspaces/dev-generalist",
      "roleMd": "Build backend services",
      "suggestionEnabled": true
    }
    ```

## Workflow guard rules
- `backlog -> ready` requires actor `pm`
- `in_progress -> review` allows `agent` or `system`
- `review|preview -> done` requires actor `pm`

See `src/domain/taskWorkflow.ts` + tests.
