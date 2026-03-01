import type { TaskStatus, TaskTransitionActor } from "@project-pwner/shared";

export class WorkflowError extends Error {}

const STATUS_ORDER: TaskStatus[] = [
  "backlog",
  "ready",
  "in_progress",
  "review",
  "preview",
  "done"
];

export function canTransition(
  from: TaskStatus,
  to: TaskStatus,
  actor: TaskTransitionActor
): boolean {
  if (from === to) return true;

  // PM gate: backlog -> ready must be PM-approved
  if (from === "backlog" && to === "ready") return actor === "pm";

  // Agent completion moves task into review
  if (from === "in_progress" && to === "review") {
    return actor === "agent" || actor === "system";
  }

  // PM approval closes workflow
  if ((from === "review" || from === "preview") && to === "done") {
    return actor === "pm";
  }

  // PM/system can move through nominal sequence for manual operations
  const fromIdx = STATUS_ORDER.indexOf(from);
  const toIdx = STATUS_ORDER.indexOf(to);
  const isAdjacentForward = toIdx === fromIdx + 1;

  if (isAdjacentForward && (actor === "pm" || actor === "system")) {
    return true;
  }

  return false;
}

export function assertTransition(
  from: TaskStatus,
  to: TaskStatus,
  actor: TaskTransitionActor
): void {
  if (!canTransition(from, to, actor)) {
    throw new WorkflowError(
      `Illegal transition ${from} -> ${to} by ${actor}`
    );
  }
}
