import { z } from "zod";

export const BrazeSDKServiceConfigSchema = z.object({
  BRAZE_WEB_KEY: z.string(),
  BRAZE_SDK_URL: z.string(),
  LINGO_ENV: z.string(),
  BRAZE_SUBSCRIPTION_SPECIAL_OFFERS: z.string(),
  BRAZE_SUBSCRIPTION_NEWS_CONTENT: z.string(),
  BRAZE_SUBSCRIPTION_PRODUCT_UPDATES: z.string(),
});

export type BrazeSDKServiceConfig = z.infer<typeof BrazeSDKServiceConfigSchema>;
