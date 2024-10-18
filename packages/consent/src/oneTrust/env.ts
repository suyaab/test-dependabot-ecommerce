import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

import { lingoEnvSchema } from "@ecommerce/utils";

export const env = createEnv({
  /**
   * Define environment variable types and parsing
   */
  server: {
    // Lingo
    LINGO_ENV: lingoEnvSchema,

    // OneTrust
    ONETRUST_URL: z.string().url(),
    ONETRUST_PRIVACY_URL: z.string().url(),
    ONETRUST_CLIENT_ID: z.string(),
    ONETRUST_CLIENT_SECRET: z.string(),
    ONETRUST_US_COLLECTION_POINT_ID: z.string(),
    ONETRUST_UK_UNSUBSCRIBE_COLLECTION_POINT_ID: z.string(),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   *
   * Note: We could just pass in `process.env` here, but explicitly doing so forces us to
   * properly handle `turbo.json:globalEnv`
   */
  runtimeEnv: {
    // Lingo
    LINGO_ENV: process.env.LINGO_ENV,

    // OneTrust
    ONETRUST_URL: process.env.ONETRUST_URL,
    ONETRUST_PRIVACY_URL: process.env.ONETRUST_PRIVACY_URL,
    ONETRUST_CLIENT_ID: process.env.ONETRUST_CLIENT_ID,
    ONETRUST_CLIENT_SECRET: process.env.ONETRUST_CLIENT_SECRET,
    ONETRUST_US_COLLECTION_POINT_ID:
      process.env.ONETRUST_US_COLLECTION_POINT_ID,
    ONETRUST_UK_UNSUBSCRIBE_COLLECTION_POINT_ID:
      process.env.ONETRUST_UK_UNSUBSCRIBE_COLLECTION_POINT_ID,
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
