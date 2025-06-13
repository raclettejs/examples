import { PluginFastifyInstance } from "@raclettejs/raclette-core"

export const registerTodoCrud = (fastify: PluginFastifyInstance) => {
  fastify.registerCrudHandlers("todo", {
    create: fastify.custom.todoService.createTodo,
    read: fastify.custom.todoService.readTodo,
    update: fastify.custom.todoService.updateTodo,
    delete: fastify.custom.todoService.removeTodo,
  })
}
