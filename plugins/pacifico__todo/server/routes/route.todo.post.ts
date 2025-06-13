import type { TodoCreate } from "../todo.schema"
import type { FastifyReply, FastifyRequest } from "fastify"
import { todoCreateSchema } from "../todo.schema"
import type { PluginFastifyInstance } from "@raclettejs/raclette-types"

export default (fastify: PluginFastifyInstance) => {
  const handler = async (
    req: FastifyRequest<{
      Body: TodoCreate
    }>,
    reply: FastifyReply,
  ) => {
    try {
      // Add owner and lastEditor from the authenticated user
      const todoData = {
        ...req.body,
        owner: req.user._id,
        lastEditor: req.user._id,
      }

      const payload = await fastify.custom.todoService.createTodo(
        fastify,
        req.requestParams,
        todoData,
      )

      return reply.status(201).send(payload)
    } catch (err: any) {
      fastify.log.error(`Error creating todo: ${err.message}`)
      return reply.internalServerError(err.message)
    }
  }

  return {
    handler,
    onRequest: [fastify.authenticate],
    config: {
      type: "dataCreate",
      broadcastChannels: ["todoCreated"],
    },
    schema: {
      summary: "Create a new todo",
      description: "Create a new todo",
      tags: ["todo/todo"],
      body: todoCreateSchema,
    },
  }
}
