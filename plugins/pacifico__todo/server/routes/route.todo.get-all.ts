import type { FastifyReply, FastifyRequest } from "fastify"
import { PluginFastifyInstance } from "@raclettejs/raclette-types"

export default (fastify: PluginFastifyInstance) => {
  const handler = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const payload = await fastify.custom.todoService.readTodos(
        fastify,
        req.requestParams,
      )

      // TODO: broadcasts here?
      // broadcasts automatically with a hook?

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
      summary: "Get all todos",
      description: "Retrieve all todos that are not deleted",
      tags: ["todo/todo"],
    },
  }
}
