import { z } from "zod";
import type { FastifyInstance } from "fastify";
import type { TaskTransitionActor } from "@project-pwner/shared";
import { assertTransition, WorkflowError } from "../domain/taskWorkflow.js";
import { db, makeId } from "../store.js";
import type { Task } from "../types.js";

const createTaskSchema = z.object({
  projectId: z.string(),
  title: z.string(),
  description: z.string().default(""),
  assigneeAgentId: z.string().optional()
});

const transitionTaskSchema = z.object({
  toStatus: z.enum(["backlog", "ready", "in_progress", "review", "preview", "done"]),
  actor: z.enum(["pm", "agent", "system"])
});

export async function taskRoutes(app: FastifyInstance): Promise<void> {
  app.get("/tasks", async () => [...db.tasks.values()]);

  app.post("/tasks", async (request, reply) => {
    const body = createTaskSchema.parse(request.body);

    const task: Task = {
      id: makeId("task"),
      projectId: body.projectId,
      title: body.title,
      description: body.description,
      assigneeAgentId: body.assigneeAgentId,
      status: "backlog",
      createdAt: new Date().toISOString()
    };

    db.tasks.set(task.id, task);
    reply.code(201);
    return task;
  });

  app.post("/tasks/:taskId/transition", async (request, reply) => {
    const { taskId } = request.params as { taskId: string };
    const body = transitionTaskSchema.parse(request.body);
    const task = db.tasks.get(taskId);

    if (!task) {
      reply.code(404);
      return { error: "Task not found" };
    }

    try {
      assertTransition(task.status, body.toStatus, body.actor as TaskTransitionActor);
    } catch (error) {
      if (error instanceof WorkflowError) {
        reply.code(400);
        return { error: error.message };
      }
      throw error;
    }

    task.status = body.toStatus;
    if (body.toStatus === "done" && body.actor === "pm") {
      task.approvedAt = new Date().toISOString();
    }

    db.tasks.set(task.id, task);
    return task;
  });
}
