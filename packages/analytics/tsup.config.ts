import { defineConfig, Options } from "tsup";

export default defineConfig((options: Options) => ({
  entry: ["src/index.ts"],
  format: ["esm"],
  clean: true,
  external: ["react"],
  ...options,
}));
