import { z } from "zod";
import type { FastifyInstance } from "fastify";
import { db, makeId } from "../store.js";
import type { Agent } from "../types.js";

const createAgentSchema = z.object({
  projectId: z.string(),
  name: z.string(),
  slug: z.string(),
  workspacePath: z.string(),
  roleMd: z.string(),
  heartbeatCron: z.string().optional(),
  suggestionEnabled: z.boolean().default(true),
  model: z.string().optional(),
  thinkingLevel: z.string().optional()
});

export async function agentRoutes(app: FastifyInstance): Promise<void> {
  app.get("/agents", async () => [...db.agents.values()]);

  app.post("/agents", async (request, reply) => {
    const body = createAgentSchema.parse(request.body);
    const agent: Agent = {
      id: makeId("agent"),
      status: "active",
      ...body
    };

    db.agents.set(agent.id, agent);
    reply.code(201);
    return agent;
  });
}
