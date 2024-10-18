import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

import { lingoEnvSchema, logLevelSchema } from "@ecommerce/utils";

export const env = createEnv({
  /**
   * Define environment variable types and parsing
   */
  server: {
    // Lingo
    LINGO_ENV: lingoEnvSchema,
    LOG_LEVEL: logLevelSchema,

    // Arvato
    ARVATO_APPLICATION_COUNTRY_CODE: z.string(),
    ARVATO_SEEBURGER_URL: z.string().url(),
    ARVATO_USERNAME: z.string(),
    ARVATO_PASSWORD: z.string(),

    // Azure
    AZURE_SERVICEBUS_CONN_STR: z.string(),

    // SendGrid
    SENDGRID_API_KEY: z.string(),
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
    LOG_LEVEL: process.env.LOG_LEVEL,

    // Arvato
    ARVATO_APPLICATION_COUNTRY_CODE:
      process.env.ARVATO_APPLICATION_COUNTRY_CODE,
    ARVATO_SEEBURGER_URL: process.env.ARVATO_SEEBURGER_URL,
    ARVATO_USERNAME: process.env.ARVATO_USERNAME,
    ARVATO_PASSWORD: process.env.ARVATO_PASSWORD,

    // Azure
    AZURE_SERVICEBUS_CONN_STR: process.env.AZURE_SERVICEBUS_CONN_STR,

    // SendGrid
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
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
