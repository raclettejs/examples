import type { Static } from "@sinclair/typebox"
import type { Document } from "mongoose"
import { Type } from "@sinclair/typebox"
import { PluginFastifyInstance } from "@raclettejs/raclette-core"

/**
 * Base Todo Schema - Fields common to all operations
 */
const baseTodoSchema = {
  name: Type.String(),
  content: Type.Optional(Type.String()),
  tags: Type.Optional(Type.Array(Type.String(), { default: [] })),
  owner: Type.String(),
  lastEditor: Type.Optional(Type.String()),
  isDeleted: Type.Optional(Type.Boolean({ default: false })),
}

/**
 * Full Todo Schema - Used for response serialization and database model
 */
export const todoSchema = Type.Object(
  {
    _id: Type.String(),
    ...baseTodoSchema,
    createdAt: Type.String({ format: "date-time" }),
    updatedAt: Type.String({ format: "date-time" }),
  },
  {
    $id: "#todo/base",
    title: "core/todo",
  },
)

/**
 * Todo Create Schema - For POST operations
 */
export const todoCreateSchema = Type.Object(
  {
    _id: Type.Optional(Type.String()),
    ...baseTodoSchema,
  },
  {
    $id: "#todo/create",
    title: "core/todo-create",
  },
)

/**
 * Todo Update Schema - For PATCH operations
 */
export const todoUpdateSchema = Type.Object(
  {
    name: Type.Optional(Type.String()),
    content: Type.Optional(Type.String()),
    tags: Type.Optional(Type.Array(Type.String())),
    lastEditor: Type.Optional(Type.String()),
    isDeleted: Type.Optional(Type.Boolean()),
  },
  {
    $id: "#todo/update",
    title: "core/todo-update",
  },
)

/**
 * Type Utilities
 */

type DateTimeFields = {
  createdAt: Date
  updatedAt: Date
}

type RawTodo = Static<typeof todoSchema>
export type Todo = Omit<RawTodo, keyof DateTimeFields> & DateTimeFields

type RawTodoCreate = Static<typeof todoCreateSchema>
export type TodoCreate = RawTodoCreate

type RawTodoUpdate = Static<typeof todoUpdateSchema>
export type TodoUpdate = RawTodoUpdate

export interface TodoDoc extends Document<string, unknown, Todo>, Todo {
  _id: string
}
export type AnyTodo = Todo | TodoDoc

/**
 * Register Schema/Type Generation for Shared Folder
 */
export const registerTodoSchemas = (fastify: PluginFastifyInstance) => {
  fastify.registerSchema({
    schema: todoSchema,
    name: "Todo",
  })

  fastify.registerSchema({
    schema: todoCreateSchema,
    name: "TodoCreate",
  })

  fastify.registerSchema({
    schema: todoUpdateSchema,
    name: "TodoUpdate",
  })
}
