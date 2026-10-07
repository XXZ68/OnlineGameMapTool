import { defineConfig } from "orval";

export default defineConfig({
  gameMap: {
    input: {
      target: "http://localhost:5089/swagger/v1/swagger.json",
    },

    output: {
      mode: "tags-split",
      target: "src/api",
      schemas: "src/model",
      client: "react-query",

      override: {
        mutator: {
          path: "./src/api/mutator.ts",
          name: "customInstance",
        },
      },
    },
  },
});