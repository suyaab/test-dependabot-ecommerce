import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  /**
   * Define environment variable types and parsing
   */
  server: {
    BRAZE_API_URL: z.string(),
    BRAZE_API_KEY: z.string(),
    BRAZE_LINGO_DATA_PLATFORM_ID: z.string(),
    BRAZE_SUBSCRIPTION_SPECIAL_OFFERS: z.string(),
    BRAZE_SUBSCRIPTION_NEWS_CONTENT: z.string(),
    BRAZE_SUBSCRIPTION_PRODUCT_UPDATES: z.string(),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   *
   * Note: We could just pass in `process.env` here, but explicitly doing so forces us to
   * properly handle `turbo.json:globalEnv`
   */
  runtimeEnv: {
    BRAZE_API_URL: process.env.BRAZE_API_URL,
    BRAZE_API_KEY: process.env.BRAZE_API_KEY,
    BRAZE_LINGO_DATA_PLATFORM_ID: process.env.BRAZE_LINGO_DATA_PLATFORM_ID,
    BRAZE_SUBSCRIPTION_SPECIAL_OFFERS:
      process.env.BRAZE_SUBSCRIPTION_SPECIAL_OFFERS,
    BRAZE_SUBSCRIPTION_NEWS_CONTENT:
      process.env.BRAZE_SUBSCRIPTION_NEWS_CONTENT,
    BRAZE_SUBSCRIPTION_PRODUCT_UPDATES:
      process.env.BRAZE_SUBSCRIPTION_PRODUCT_UPDATES,
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
