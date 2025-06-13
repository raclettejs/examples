import type {
  Todo,
  TodoCreate,
  Todo as TodoType,
  TodoUpdate,
} from "./todo.schema"
import type { QueryOptions } from "@_/types/service"
import { v4 as uuidv4, validate } from "uuid"
import { createTodoPayload } from "./helpers/todoHelper"
import type {
  PluginFastifyInstance,
  ClientPayload,
  ClientPayloadRequestData,
} from "@raclettejs/raclette-core/types"
import { Model } from "mongoose"

export class TodoService {
  private todoModel: Model<Todo>

  constructor(model: Model<Todo>) {
    this.todoModel = model
  }

  /**
   * Core function to create a new todo (returns raw data)
   */
  async _createTodo(
    fastify: PluginFastifyInstance,
    todoBody: TodoCreate,
  ): Promise<TodoType> {
    try {
      if (todoBody._id) {
        const uuidValid = validate(todoBody._id)

        if (!uuidValid) {
          throw new Error("Invalid ID - not a valid uuid v4")
        }

        const duplicate = await this.todoModel.findById(todoBody._id)

        if (duplicate) {
          throw new Error("An entry with this id already exists")
        }
      } else {
        todoBody._id = uuidv4()
      }

      const todo = new this.todoModel(todoBody)

      await todo.save()
      fastify.log.info(`[API] Created todo #${todo._id}`)

      return todo.toObject ? todo.toObject() : todo
    } catch (err: any) {
      fastify.log.error(err.message)
      throw err
    }
  }

  /**
   * Create a new todo with payload wrapping and event emission
   */
  async createTodo(
    fastify: PluginFastifyInstance,
    requestData: ClientPayloadRequestData,
    todoBody: TodoCreate,
  ): Promise<ClientPayload<TodoType[]>> {
    const todo = await this._createTodo(fastify, todoBody)

    const payload = await createTodoPayload(fastify, [todo], requestData)

    if (requestData.broadcast) {
      fastify.emit("todoCreated", payload)
    }

    return payload
  }

  /**
   * Core function to read a specific todo by ID (returns raw data)
   */
  async _readTodo(
    fastify: PluginFastifyInstance,
    id: string,
  ): Promise<TodoType> {
    try {
      const todo = await this.todoModel
        .findOne({ _id: id, isDeleted: false })
        .lean()

      if (!todo) {
        throw new Error(`Todo with ID ${id} not found`)
      }

      return todo
    } catch (err: any) {
      fastify.log.error(err.message)
      throw err
    }
  }

  /**
   * Read a specific todo by ID with payload wrapping
   */
  async readTodo(
    fastify: PluginFastifyInstance,
    requestData: ClientPayloadRequestData,
    id: string,
  ): Promise<ClientPayload<TodoType[]>> {
    const todo = await this._readTodo(fastify, id)

    return createTodoPayload(fastify, [todo], requestData)
  }

  /**
   * Core function to read todos by ID or filter parameters (returns raw data)
   */
  async _readTodos(
    fastify: PluginFastifyInstance,
    filter: Record<string, any> = { isDeleted: false },
    options: QueryOptions = {},
  ): Promise<TodoType[]> {
    filter = { isDeleted: false, ...filter }

    try {
      // Start building the query
      let query = this.todoModel.find(filter)

      // Apply pagination if provided
      if (options.limit !== undefined) {
        query = query.limit(options.limit)
      }
      if (options.offset !== undefined) {
        query = query.skip(options.offset)
      }

      // Apply population if provided
      if (options.populate && Array.isArray(options.populate)) {
        options.populate.forEach((populateOption) => {
          query = query.populate(populateOption as any)
        })
      }

      // Execute query
      return await query.lean()
    } catch (err: any) {
      fastify.log.error(err.message)
      throw err
    }
  }

  /**
   * Read todos by ID or filter parameters with payload wrapping
   */
  async readTodos(
    fastify: PluginFastifyInstance,
    requestData: ClientPayloadRequestData,
    filter: { id?: string } = {},
  ): Promise<ClientPayload<TodoType[]>> {
    try {
      if (filter.id) {
        // Get single todo
        const todo = await this._readTodo(fastify, filter.id)

        return createTodoPayload(fastify, [todo], requestData)
      } else {
        const todos = await this._readTodos(fastify, filter)

        return createTodoPayload(fastify, todos, requestData)
      }
    } catch (err: any) {
      fastify.log.error(err.message)
      throw err
    }
  }

  /**
   * Core function to update an existing todo (returns raw data)
   */
  async _updateTodo(
    fastify: PluginFastifyInstance,
    id: string,
    todoBody: TodoUpdate,
    userId: string,
  ): Promise<{ updated: TodoType; original: TodoType }> {
    try {
      const originalTodo = await this.todoModel.findById(id)

      if (!originalTodo) {
        throw new Error(`Todo with ID ${id} not found`)
      }

      const updatedTodo = await this.todoModel.findByIdAndUpdate(
        id,
        { ...todoBody, lastEditor: userId },
        { new: true },
      )

      if (!updatedTodo) {
        throw new Error(`Failed to update todo with ID ${id}`)
      }

      fastify.log.info(`[API] Updated todo #${updatedTodo._id}`)

      return {
        updated: updatedTodo.toObject ? updatedTodo.toObject() : updatedTodo,
        original: originalTodo.toObject
          ? originalTodo.toObject()
          : originalTodo,
      }
    } catch (err: any) {
      fastify.log.error(err.message)
      throw err
    }
  }

  /**
   * Update an existing todo with payload wrapping and event emission
   */
  async updateTodo(
    fastify: PluginFastifyInstance,
    requestData: ClientPayloadRequestData,
    id: string,
    todoBody: TodoUpdate,
    userId: string,
  ): Promise<ClientPayload<TodoType[]>> {
    const { updated, original } = await this._updateTodo(
      fastify,
      id,
      todoBody,
      userId,
    )

    const payload = await createTodoPayload(fastify, [updated], requestData)

    payload.body.prevVersion = original

    if (requestData.broadcast) {
      fastify.emit("todoUpdated", payload)
      fastify.emit("broadcastDataUpdated", payload)
    }

    return payload
  }

  /**
   * Core function to soft delete a todo (returns raw data)
   */
  async _removeTodo(
    fastify: PluginFastifyInstance,
    id: string,
  ): Promise<TodoType> {
    try {
      const todo = await this.todoModel
        .findByIdAndUpdate(id, { isDeleted: true }, { new: true })
        .lean()

      if (!todo) {
        throw new Error(`Todo with ID ${id} not found`)
      }

      return todo
    } catch (err: any) {
      fastify.log.error(err.message)
      throw err
    }
  }

  /**
   * Soft delete a todo with payload wrapping and event emission
   */
  async removeTodo(
    fastify: PluginFastifyInstance,
    requestData: ClientPayloadRequestData,
    id: string,
  ): Promise<ClientPayload<TodoType[]>> {
    const todo = await this._removeTodo(fastify, id)

    const payload = await createTodoPayload(fastify, [todo], {
      ...requestData,
      type: "dataDeleted",
    })

    payload.body.deleted = [todo._id]

    if (requestData.broadcast) {
      fastify.emit("todoDeleted", payload)
      fastify.emit("broadcastDataDeleted", payload)
    }

    return payload
  }

  /**
   * Core function to hard delete a todo (returns raw data)
   */
  async _hardDeleteTodo(
    fastify: PluginFastifyInstance,
    id: string,
  ): Promise<TodoType> {
    try {
      const todo = await this.todoModel.findOne({ _id: id })

      if (!todo) {
        throw new Error(`Todo with ID ${id} not found`)
      }

      await this.todoModel.deleteOne({ _id: id })

      return todo.toObject ? todo.toObject() : todo
    } catch (err: any) {
      fastify.log.error(err.message)
      throw err
    }
  }

  /**
   * Hard delete a todo with payload wrapping and event emission
   */
  async hardDeleteTodo(
    fastify: PluginFastifyInstance,
    requestData: ClientPayloadRequestData,
    id: string,
  ): Promise<ClientPayload<TodoType[]>> {
    const todo = await this._hardDeleteTodo(fastify, id)

    const payload = await createTodoPayload(fastify, [todo], {
      ...requestData,
      type: "dataHardDeleted",
    })

    payload.body.deleted = [todo._id]
    if (requestData.broadcast) {
      fastify.emit("todoHardDeleted", payload)
      fastify.emit("broadcastDataDeleted", payload)
    }

    return payload
  }
}

export const createTodoService = (model: Model<Todo>) => {
  return new TodoService(model)
}
