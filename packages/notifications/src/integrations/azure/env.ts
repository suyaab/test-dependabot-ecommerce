import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  /**
   * Define environment variable types and parsing
   */
  server: {
    AZURE_SERVICEBUS_CONN_STR: z.string(),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   *
   * Note: We could just pass in `process.env` here, but explicitly doing so forces us to
   * properly handle `turbo.json:globalEnv`
   */
  runtimeEnv: {
    AZURE_SERVICEBUS_CONN_STR: process.env.AZURE_SERVICEBUS_CONN_STR,
  },

  /**
   * Treat all empty strings as undefined in Zod Parsing
   */
  emptyStringAsUndefined: true,

  /**
   * Skip validation for CI builds in GitHub and all unit tests
   */
  skipValidation: process.env.CI === "true" || process.env.NODE_ENV === "test",
});
