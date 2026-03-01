export type TaskStatus =
  | "backlog"
  | "ready"
  | "in_progress"
  | "review"
  | "preview"
  | "done";

export type TaskTransitionActor = "pm" | "agent" | "system";
