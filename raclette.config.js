import { defineRacletteConfig } from "@raclettejs/raclette-core"

export default defineRacletteConfig({
  name: "pacifico-raclette-plugin-examples",

  // Configure services
  services: {
    client: {
      enabled: true,
      port: 8081,
      volumes: [],
    },
    server: {
      enabled: true,
      port: 8082,
      enableDebug: true,
      installPackages: [],
      volumes: [
        // we use this to allow hot-reload of changes of this plugin during development
      ],
    },
    mongodb: {
      name: "raclette-mongodb",
      enabled: true,
      port: 27017,
      volume: "raclette-mongodb",
      databaseName: "raclette",
    },
    redis: {
      name: "raclette-redis",
      volume: "raclette-redis",
      enabled: true,
      port: 6379,
    },
    // make sure you have the admin dashboard as dependency installed
    dashboard: {
      enabled: true,
      portFrontend: 8083,
      portBackend: 8084,
      withLogs: false,
    },
  },
  // list your installed plugins
  // make sure they are listed in your package.json
  plugins: [],

  // Environment-specific configuration
  env: {
    development: {
      RACLETTE_DEBUG_MODE: true,
      RACLETTE_TEST: process.env.RACLETTE_TEST,
      RACLETTE_INHERIT_NPMRC: false,
    },
    production: {
      NODE_ENV: "production",
    },
  },

  // Frontend framework configuration
  frontend: {
    framework: "vue",
    vue: {
      plugins: ["vue-router"],
    },
  },

  eslint: {
    useRecommended: false,
  },
})
