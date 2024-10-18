import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  /**
   * Define environment variable types and parsing
   */
  server: {
    // LINGO MOBILE APP
    LINGO_APP_GRAPHQL_ENDPOINT: z.string().url(),
    LINGO_APP_API_KEY: z.string(),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   *
   * Note: We could just pass in `process.env` here, but explicitly doing so forces us to
   * properly handle `turbo.json:globalEnv`
   */
  runtimeEnv: {
    // LINGO MOBILE APP
    LINGO_APP_GRAPHQL_ENDPOINT: process.env.LINGO_APP_GRAPHQL_ENDPOINT,
    LINGO_APP_API_KEY: process.env.LINGO_APP_API_KEY,
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
