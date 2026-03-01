CREATE TYPE task_status AS ENUM ('backlog', 'ready', 'in_progress', 'review', 'preview', 'done');
CREATE TYPE suggestion_status AS ENUM ('new', 'approved', 'rejected', 'archived');
CREATE TYPE agent_status AS ENUM ('active', 'inactive');

CREATE TABLE projects (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  main_repo_url TEXT NOT NULL,
  github_token_enc TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE agents (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  workspace_path TEXT NOT NULL,
  role_md TEXT NOT NULL,
  heartbeat_cron TEXT,
  suggestion_enabled BOOLEAN NOT NULL DEFAULT true,
  model TEXT,
  thinking_level TEXT,
  status agent_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, slug)
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status task_status NOT NULL DEFAULT 'backlog',
  assignee_agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  pr_url TEXT,
  preview_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_at TIMESTAMPTZ
);

CREATE TABLE suggestions (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  from_agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  status suggestion_status NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tasks_project_status ON tasks(project_id, status);
CREATE INDEX idx_agents_project_status ON agents(project_id, status);
CREATE INDEX idx_suggestions_project_status ON suggestions(project_id, status);
