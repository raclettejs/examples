// Auto-generated frontend configuration for plugin: plugin_pacifico__todo
// This file is generated from backend routes - do not edit manually
// Entity mapping: {"todo":"todo"}

export default {
  pluginName: "todo",
  author: "pacifico",
  pluginKey: "plugin_pacifico__todo",
  routePrefix: "/plugin/pacifico/todo",
  pluginPath: "/app/src/raclette-plugins/pacifico__todo",
  data: {
    todo: {
      type: "todo",
      operations: {
        getAll: {
          target: "/plugin/pacifico/todo/todo/all",
          method: "get"
        },
        get: {
          target: (payload) => `/plugin/pacifico/todo/todo/${payload._id}`,
          method: "get"
        },
        create: {
          target: "/plugin/pacifico/todo/todo",
          method: "post",
          channels: [
            {
              channel: "plugin_pacifico__todo--todoCreated",
              channelKey: "todoCreated",
              prefix: "plugin_pacifico__todo"
            }
          ]
        },
        update: {
          target: (payload) => `/plugin/pacifico/todo/todo/${payload._id}`,
          method: "patch",
          channels: [
            {
              channel: "plugin_pacifico__todo--todoUpdated",
              channelKey: "todoUpdated",
              prefix: "plugin_pacifico__todo"
            },
            {
              channel: "plugin_pacifico__todo--broadcastDataUpdated",
              channelKey: "broadcastDataUpdated",
              prefix: "plugin_pacifico__todo"
            }
          ]
        },
        updateCheckTask: {
          target: (payload) => `/plugin/pacifico/todo/todo/checkTask/${payload._id}`,
          method: "patch",
          channels: [
            {
              channel: "plugin_pacifico__todo--todoUpdated",
              channelKey: "todoUpdated",
              prefix: "plugin_pacifico__todo"
            },
            {
              channel: "plugin_pacifico__todo--broadcastDataUpdated",
              channelKey: "broadcastDataUpdated",
              prefix: "plugin_pacifico__todo"
            }
          ]
        },
        delete: {
          target: (payload) => `/plugin/pacifico/todo/todo/${payload._id}`,
          method: "delete",
          channels: [
            {
              channel: "plugin_pacifico__todo--todoDeleted",
              channelKey: "todoDeleted",
              prefix: "plugin_pacifico__todo"
            }
          ]
        },
        deleteHard: {
          target: (payload) => `/plugin/pacifico/todo/todo/${payload._id}/hard`,
          method: "delete",
          channels: [
            {
              channel: "plugin_pacifico__todo--todoHardDeleted",
              channelKey: "todoHardDeleted",
              prefix: "plugin_pacifico__todo"
            }
          ]
        }
      }
    }
  }
}
