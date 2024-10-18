import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

import { lingoEnvSchema } from "@ecommerce/utils";

export const env = createEnv({
  /**
   * Define environment variable types and parsing
   */
  server: {
    // LINGO
    LINGO_ENV: lingoEnvSchema,

    // Avalara
    AVALARA_ACCOUNT_ID: z.string(),
    AVALARA_LICENSE_KEY: z.string(),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   *
   * Note: We could just pass in `process.env` here, but explicitly doing so forces us to
   * properly handle `turbo.json:globalEnv`
   */
  runtimeEnv: {
    // LINGO
    LINGO_ENV: process.env.LINGO_ENV,
    AVALARA_ACCOUNT_ID: process.env.AVALARA_ACCOUNT_ID,
    AVALARA_LICENSE_KEY: process.env.AVALARA_LICENSE_KEY,
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
