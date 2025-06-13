import type { TodoUpdate } from "../todo.schema"
import type { Static } from "@sinclair/typebox"
import type { FastifyReply, FastifyRequest } from "fastify"
import { Type } from "@sinclair/typebox"
import { todoUpdateSchema } from "../todo.schema"
import type { PluginFastifyInstance } from "@raclettejs/raclette-types"

const ParamsSchema = Type.Object({
  _id: Type.String(),
})
type Params = Static<typeof ParamsSchema>

export default (fastify: PluginFastifyInstance) => {
  const handler = async (
    req: FastifyRequest<{
      Params: Params
      Body: TodoUpdate
    }>,
    reply: FastifyReply,
  ) => {
    try {
      const { _id } = req.params

      const payload = await fastify.custom.todoService.updateTodo(
        fastify,
        req.requestParams,
        _id,
        req.body,
        req.user._id,
      )

      return reply.status(201).send(payload)
    } catch (err: any) {
      fastify.log.error(`Error updating todo: ${err.message}`)
      return reply.internalServerError(err.message)
    }
  }

  return {
    handler,
    onRequest: [fastify.authenticate],
    config: {
      type: "dataUpdate",
      broadcastChannels: ["todoUpdated", "broadcastDataUpdated"],
    },
    schema: {
      summary: "Update a todo with a provided id",
      description: "Update an existing todo with the given ID",
      tags: ["todo/todo"],
      body: todoUpdateSchema,
      params: ParamsSchema,
    },
  }
}
