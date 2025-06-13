import type { PluginFastifyInstance } from "@raclettejs/raclette-core"
import type { Document } from "mongoose"
import { Schema } from "mongoose"
import { v4 as uuidv4 } from "uuid"
import { Todo } from "./todo.schema"

// this will be used to generate the modelName dynamically
export const MODEL_BASENAME = "Todo"

// TODO: check with @michelle about generic Document type
export interface ITodo extends Document<string, unknown, Todo> {
  name: string
  content: string
  isDeleted: boolean
  tags: Array<string>
  owner: string
  lastEditor: string
}

const TodoSchema: Schema = new Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4(),
      required: true,
    },
    name: { type: String, required: true },
    isDeleted: { type: Boolean, required: false, default: false },
    content: { type: String, required: false },
    tags: { type: Array, required: false },
    owner: {
      type: Schema.Types.String,
      ref: "pacifico_core_user",
      required: true,
    },

    lastEditor: {
      type: Schema.Types.String,
      ref: "pacifico_core_user",
      required: true,
    },
  },
  { timestamps: true },
)
let todoModel
export const createModels = (fastify: PluginFastifyInstance) => {
  // we call the createModel function from the app instance
  // this will handle all necessary prefixing
  todoModel = fastify.createModel(MODEL_BASENAME, TodoSchema)

  return {
    todo: todoModel,
  }
}
export default todoModel
