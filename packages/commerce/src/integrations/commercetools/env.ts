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

    // COMMERCETOOLS
    CTP_API_URL: z.string().url(),
    CTP_AUTH_URL: z.string().url(),
    CTP_PROJECT_KEY: z.string(),
    CTP_CLIENT_ID: z.string(),
    CTP_CLIENT_SECRET: z.string(),
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

    // COMMERCETOOLS
    CTP_PROJECT_KEY: process.env.CTP_PROJECT_KEY,
    CTP_CLIENT_ID: process.env.CTP_CLIENT_ID,
    CTP_CLIENT_SECRET: process.env.CTP_CLIENT_SECRET,
    CTP_API_URL: process.env.CTP_API_URL,
    CTP_AUTH_URL: process.env.CTP_AUTH_URL,
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
