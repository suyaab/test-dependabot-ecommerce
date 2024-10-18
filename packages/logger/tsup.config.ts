import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: "cjs", // NOTE: this needs to be CommonJS per Pino's dependencies
  splitting: false,
  sourcemap: true,
  clean: true,
});
