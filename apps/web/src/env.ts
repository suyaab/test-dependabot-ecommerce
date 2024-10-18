import { createEnv } from "@t3-oss/env-nextjs";
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

    // Adobe
    ADOBE_DTM_SCRIPT: z.string(),

    AUTH0_SECRET: z.string(),
    AUTH0_BASE_URL: z.string(),
    AUTH0_ISSUER_BASE_URL: z.string(),
    AUTH0_CLIENT_ID: z.string(),
    AUTH0_CLIENT_SECRET: z.string(),

    //Google Address Validation
    GOOGLE_VALIDATION_API_KEY: z.string(),

    // Braze
    BRAZE_WEB_KEY: z.string(),
    BRAZE_SDK_URL: z.string().url(),
    BRAZE_SUBSCRIPTION_SPECIAL_OFFERS: z.string(),
    BRAZE_SUBSCRIPTION_NEWS_CONTENT: z.string(),
    BRAZE_SUBSCRIPTION_PRODUCT_UPDATES: z.string(),

    // Harness
    HARNESS_SERVER_API_KEY: z.string(),

    // OneTrust
    ONETRUST_PRIVACY_URL: z.string().url(),
    ONETRUST_PRIVACY_PORTAL_ID: z.string(),

    // PayOn
    PAYON_API_URL: z.string().url(),

    // Next.js
    ON_DEMAND_REVALIDATION_SECRET: z.string(),

    // Misc.
    WEBSITE_INSTANCE_ID: z.string().optional(),
    GIT_SHA: z.string().optional(),
  },

  client: {
    // Arvato
    NEXT_PUBLIC_ARVATO_RETURN_SCRIPT: z.string().optional(),
    NEXT_PUBLIC_ARVATO_TRACKING_SCRIPT: z.string().optional(),

    // Harness
    NEXT_PUBLIC_HARNESS_CLIENT_API_KEY: z.string().default(""),

    NEXT_PUBLIC_GOOGLE_PLACES_API_KEY: z.string().default(""),
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

    AUTH0_SECRET: process.env.AUTH0_SECRET,
    AUTH0_BASE_URL: process.env.AUTH0_BASE_URL,
    AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,

    // Adobe
    ADOBE_DTM_SCRIPT: process.env.ADOBE_DTM_SCRIPT,

    //Google Address Validation
    GOOGLE_VALIDATION_API_KEY: process.env.GOOGLE_VALIDATION_API_KEY,

    // Braze
    BRAZE_WEB_KEY: process.env.BRAZE_WEB_KEY,
    BRAZE_SDK_URL: process.env.BRAZE_SDK_URL,
    BRAZE_SUBSCRIPTION_SPECIAL_OFFERS:
      process.env.BRAZE_SUBSCRIPTION_SPECIAL_OFFERS,
    BRAZE_SUBSCRIPTION_NEWS_CONTENT:
      process.env.BRAZE_SUBSCRIPTION_NEWS_CONTENT,
    BRAZE_SUBSCRIPTION_PRODUCT_UPDATES:
      process.env.BRAZE_SUBSCRIPTION_PRODUCT_UPDATES,

    // OneTrust
    ONETRUST_PRIVACY_URL: process.env.ONETRUST_PRIVACY_URL,
    ONETRUST_PRIVACY_PORTAL_ID: process.env.ONETRUST_PRIVACY_PORTAL_ID,

    // Harness
    HARNESS_SERVER_API_KEY: process.env.HARNESS_SERVER_API_KEY,

    // PayOn
    PAYON_API_URL: process.env.PAYON_API_URL,

    // Next.js
    ON_DEMAND_REVALIDATION_SECRET: process.env.ON_DEMAND_REVALIDATION_SECRET,

    // Misc.
    WEBSITE_INSTANCE_ID: process.env.WEBSITE_INSTANCE_ID,
    GIT_SHA: process.env.GIT_SHA,

    // Client Side
    NEXT_PUBLIC_ARVATO_RETURN_SCRIPT:
      process.env.NEXT_PUBLIC_ARVATO_RETURN_SCRIPT,
    NEXT_PUBLIC_ARVATO_TRACKING_SCRIPT:
      process.env.NEXT_PUBLIC_ARVATO_TRACKING_SCRIPT,
    NEXT_PUBLIC_HARNESS_CLIENT_API_KEY:
      process.env.NEXT_PUBLIC_HARNESS_CLIENT_API_KEY,
    NEXT_PUBLIC_GOOGLE_PLACES_API_KEY:
      process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY,
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
