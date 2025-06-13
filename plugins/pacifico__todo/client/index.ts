import TodoApp from "./widgets/todo/TodoApp.vue"
import { defineRaclettePluginClient } from "@raclettejs/raclette-core/client"

export default defineRaclettePluginClient({
  widgets: {
    todoApp: {
      details: {
        widgetName: "todoApp",
        pluginName: "todoApp",
        company: "pacifico",
        title: "Pacifico Todo App",
        description: "A simple to-do list.",
        color: "#6CB5D1",
        icon: new URL("./widgets/todo/icon.svg", import.meta.url).href,
        images: [
          new URL("./widgets/todo/screenshot.png", import.meta.url).href,
        ],
      },
      component: TodoApp,
    },
  },

  i18n: {
    de: {
      title: "Todo Widget",
    },
    en: {
      title: "Todo Widget",
    },
  },
})
