import { describe, expect, it } from "vitest";
import { canTransition } from "./taskWorkflow.js";

describe("task workflow guard", () => {
  it("requires PM for backlog -> ready", () => {
    expect(canTransition("backlog", "ready", "pm")).toBe(true);
    expect(canTransition("backlog", "ready", "agent")).toBe(false);
  });

  it("allows agent to move in_progress -> review", () => {
    expect(canTransition("in_progress", "review", "agent")).toBe(true);
  });

  it("requires PM for review -> done", () => {
    expect(canTransition("review", "done", "pm")).toBe(true);
    expect(canTransition("review", "done", "agent")).toBe(false);
  });
});
