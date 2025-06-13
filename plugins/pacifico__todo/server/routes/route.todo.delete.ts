import type { Static } from "@sinclair/typebox"
import type { FastifyReply, FastifyRequest } from "fastify"
import { Type } from "@sinclair/typebox"
import { PluginFastifyInstance } from "@raclettejs/raclette-core"

const ParamsSchema = Type.Object({
  _id: Type.String(),
})
type Params = Static<typeof ParamsSchema>

export default (fastify: PluginFastifyInstance) => {
  const handler = async (
    req: FastifyRequest<{
      Params: Params
    }>,
    reply: FastifyReply,
  ) => {
    try {
      const { _id } = req.params

      const payload = await fastify.custom.todoService.removeTodo(
        fastify,
        req.requestParams,
        _id,
      )

      return reply.status(200).send(payload)
    } catch (err: any) {
      fastify.log.error(`Error deleting todo: ${err.message}`)
      return reply.internalServerError(err.message)
    }
  }

  return {
    handler,
    onRequest: [fastify.authenticate],
    config: {
      type: "dataDelete",
      broadcastChannels: ["todoDeleted"],
    },
    schema: {
      summary: "Soft delete a todo",
      description: "Mark a todo as deleted by setting isDeleted to true",
      tags: ["todo/todo"],
      params: ParamsSchema,
    },
  }
}
