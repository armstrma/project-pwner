import type { Agent, Task } from "./types.js";

export const db = {
  tasks: new Map<string, Task>(),
  agents: new Map<string, Agent>()
};

export function makeId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
