import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  /**
   * Define environment variable types and parsing
   */
  server: {
    PAYON_API_URL: z.string().url(),
    PAYON_AUTH_TOKEN: z.string(),
    PAYON_ECOMM_ENTITY_ID: z.string(),
    PAYON_MOTO_ENTITY_ID: z.string(),
    PAYON_TEST_MODE: z
      .union([z.literal("EXTERNAL"), z.literal("INTERNAL")])
      .optional(),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   *
   * Note: We could just pass in `process.env` here, but explicitly doing so forces us to
   * properly handle `turbo.json:globalEnv`
   */
  runtimeEnv: {
    PAYON_API_URL: process.env.PAYON_API_URL,
    PAYON_AUTH_TOKEN: process.env.PAYON_AUTH_TOKEN,
    PAYON_ECOMM_ENTITY_ID: process.env.PAYON_ECOMM_ENTITY_ID,
    PAYON_MOTO_ENTITY_ID: process.env.PAYON_MOTO_ENTITY_ID,
    PAYON_TEST_MODE: process.env.PAYON_TEST_MODE,
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
