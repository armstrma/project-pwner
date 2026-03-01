import type { TaskStatus } from "@project-pwner/shared";

export type Task = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeAgentId?: string;
  prUrl?: string;
  previewUrl?: string;
  createdAt: string;
  approvedAt?: string;
};

export type Agent = {
  id: string;
  projectId: string;
  name: string;
  slug: string;
  workspacePath: string;
  roleMd: string;
  heartbeatCron?: string;
  suggestionEnabled: boolean;
  model?: string;
  thinkingLevel?: string;
  status: "active" | "inactive";
};
