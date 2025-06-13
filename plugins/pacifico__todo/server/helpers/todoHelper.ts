import {
  ClientPayloadRequestData,
  PluginFastifyInstance,
} from "@raclettejs/raclette-core"
import { Todo } from "../todo.schema"

export const createTodoPayload = async (
  fastify: PluginFastifyInstance,
  items: Todo[],
  requestData: ClientPayloadRequestData,
) => {
  const res = await fastify.createPayload("todo", items, requestData)
  return res
}

export const registerPayload = (fastify: PluginFastifyInstance) => {
  fastify.registerPayloadHandler<Todo>("todo", {
    type: "todo",
    displayName: (item) => item.name || "",
    completion: (item) => item.name || "",

    fields: (item, requestData: ClientPayloadRequestData) => ({
      owner: "NONE",
      project: requestData.project!,
      tags: [],
    }),
  })
}
