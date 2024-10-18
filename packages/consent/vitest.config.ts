import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    ...configDefaults,
    globals: true,
    environment: "node",
    exclude: ["node_modules", "dist"],
  },
});
