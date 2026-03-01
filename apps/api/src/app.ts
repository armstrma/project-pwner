import Fastify, { type FastifyInstance } from "fastify";
import { healthRoutes } from "./routes/health.js";
import { taskRoutes } from "./routes/tasks.js";
import { agentRoutes } from "./routes/agents.js";

export function buildApp(): FastifyInstance {
  const app = Fastify({ logger: true });

  app.register(healthRoutes);
  app.register(taskRoutes, { prefix: "/api/v1" });
  app.register(agentRoutes, { prefix: "/api/v1" });

  return app;
}
