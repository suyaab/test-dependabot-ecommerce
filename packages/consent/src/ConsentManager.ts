import { z } from "zod";

export const collectionPointSchema = z.union([
  z.literal("COMPLETE_PURCHASE"),
  z.literal("NO_PURCHASE"),
  z.literal("OTHER_COUNTRY"),
  z.literal("UNSUBSCRIBE"),
]);

export type CollectionPoint = z.infer<typeof collectionPointSchema>;

export const consentSchema = z.object({
  externalId: z.string(),
  portalToken: z.string(),
  purposes: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      version: z.number(),
      status: z.string(),
    }),
  ),
});

export type Consent = z.infer<typeof consentSchema>;

export interface ConsentManager {
  postConsents(
    collectionPoint: CollectionPoint,
    userID: string,
    hasMarketingConsent?: boolean,
    country?: string,
  ): Promise<void>;

  getConsents(userId: string): Promise<Consent>;
  getGlobalMarketingPurposeIds(): string[];
}
export const SUBSCRIBED_CONSENT_STATUSES = [
  "CONFIRMED",
  "ACTIVE",
  "NOT_OPTED_OUT",
  "ALWAYS_ACTIVE",
];

export const UNSUBSCRIBED_CONSENT_STATUSES = [
  "WITHDRAWN",
  "OPT_OUT",
  "EXPIRED",
  "HARD_OPT_OUT",
];
