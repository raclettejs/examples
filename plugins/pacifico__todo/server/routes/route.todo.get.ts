import type { Static } from "@sinclair/typebox"
import type { FastifyReply, FastifyRequest } from "fastify"
import { Type } from "@sinclair/typebox"
import type { PluginFastifyInstance } from "@raclettejs/raclette-types"

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

      const payload = await fastify.custom.todoService.readTodo(
        fastify,
        req.requestParams,
        _id,
      )

      return payload
    } catch (err: any) {
      fastify.log.error(err.message)
      return reply.internalServerError(err.message)
    }
  }

  return {
    handler,
    onRequest: [fastify.authenticate],
    config: {
      type: "dataPush",
    },
    schema: {
      summary: "Get a todo by ID",
      description: "Retrieve a todo with the specified ID",
      tags: ["todo/todo"],
      params: ParamsSchema,
    },
  }
}
