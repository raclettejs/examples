import type {
  PluginOptions,
  PluginFastifyInstance,
} from "@raclettejs/raclette-core"
import { createModels } from "./todo.model"
import { registerRoutes } from "./routes"
import { registerPayload } from "./helpers/todoHelper"
import { registerTodoSchemas } from "./todo.schema"
import { registerTodoCrud } from "./helpers/crud"
import { createTodoService } from "./todo.service"

const todoPlugin = async (
  fastify: PluginFastifyInstance,
  _opts: PluginOptions,
) => {
  /*
   * ---------------------------------------------------------------------
   * CREATE AND REGISTER ALL YOUR MODELS
   * ---------------------------------------------------------------------
   */
  const models = createModels(fastify)

  const todoService = createTodoService(models.todo)

  fastify.custom.todoService = todoService

  /*
   * ---------------------------------------------------------------------
   * REGISTER ALL YOUR ROUTES
   * ---------------------------------------------------------------------
   */

  try {
    await fastify.register((instance) => registerRoutes(instance))
  } catch (error) {
    fastify.log.error(`Failed to register routes.`, error)
    throw error // Let the application handle the error
  }
  registerPayload(fastify)
  registerTodoSchemas(fastify)
  registerTodoCrud(fastify)

  fastify.registerForFrontendGeneration({
    entityMapping: {
      todo: "todo",
    },
  })
}
export default todoPlugin
