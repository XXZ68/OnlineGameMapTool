import { defineConfig } from "orval";

export default defineConfig({
  gameMap: {
    input: {
      target: "http://localhost:5089/swagger/v1/swagger.json",
    },
    output: {
      mode: "tags-split",
      target: "src/api/generated",
      schemas: "src/api/model",
      client: "react-query",
      httpClient: "axios",

      override: {
        mutator: {
          path: "./src/api/mutator.ts",
          name: "customInstance",
        },
      },
    },
  },
});