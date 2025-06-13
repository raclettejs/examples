import type { PluginFastifyInstance } from "@raclettejs/raclette-core"
import getAllRoute from "./route.todo.get-all"
import getByIdRoute from "./route.todo.get"
import postRoute from "./route.todo.post"
import patchRoute from "./route.todo.patch"
import deleteRoute from "./route.todo.delete"
import hardDeleteRoute from "./route.todo.hard-delete"

export const registerRoutes = async (fastify: PluginFastifyInstance) => {
  // Register individual routes
  fastify.get("/todo/all", getAllRoute(fastify))
  fastify.get("/todo/:_id", getByIdRoute(fastify))
  fastify.post("/todo", postRoute(fastify))
  fastify.patch("/todo/:_id", patchRoute(fastify))
  fastify.patch("/todo/checkTask/:_id", patchRoute(fastify)) // only for auto.generation demo
  fastify.delete("/todo/:_id", deleteRoute(fastify))
  fastify.delete("/todo/:_id/hard", hardDeleteRoute(fastify))
}
