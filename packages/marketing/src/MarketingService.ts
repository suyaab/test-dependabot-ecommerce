import { z } from "zod";

export const marketingUserSchema = z.object({
  externalId: z.string(),
  subscribed: z.union([
    z.literal("unsubscribed"),
    z.literal("subscribed"),
    z.literal("opted_in"),
  ]),
});

export type MarketingUser = z.infer<typeof marketingUserSchema>;

export const SignupSourcesSchema = z.union([
  z.literal("us_footer"),
  z.literal("us_quiz"),
  z.literal("us_waitlist"),
  z.literal("us_modal"),
  z.literal("region_signup_dialog"),
  z.literal("checkout"),
  z.literal("us_metabolism101"),
  z.literal("us_login"),
]);

export type SignupSource = z.infer<typeof SignupSourcesSchema>;

/**
 * Marketing Events
 */
export const purchaseEventData = z.object({
  externalId: z.string(),
  email: z.string(),
  product: z.object({
    productId: z.string(),
    currency: z.string(),
    price: z.number(),
    properties: z.object({
      productType: z.string(),
    }),
  }),
});

export type PurchaseEventData = z.infer<typeof purchaseEventData>;

export enum MarketingEventType {
  Purchase = "Purchase",
}

export interface MarketingEventData {
  [MarketingEventType.Purchase]: PurchaseEventData;
}

/**
 * Marketing User Attributes
 */

export enum MarketingAttributeType {
  Subscription = "Subscription",
  Purchase = "Purchase",
}

export const PurchaseAttributeDataSchema = z.object({
  email: z.string(),
  externalId: z.string(),
  sku: z.string(),
  promoCode: z.string().optional().default(""),
});

export const SubscriptionAttributeDataSchema = z.object({
  externalId: z.string(),
  subscriptionStatus: z.union([
    z.literal("unsubscribed"),
    z.literal("subscribed"),
    z.literal("opted_in"),
  ]),
});
export type SubscriptionAttributeData = z.infer<
  typeof SubscriptionAttributeDataSchema
>;

export type PurchaseAttributeData = z.infer<typeof PurchaseAttributeDataSchema>;

export interface MarketingAttributeData {
  [MarketingAttributeType.Subscription]: SubscriptionAttributeData;
  [MarketingAttributeType.Purchase]: PurchaseAttributeData;
}

export interface MarketingService {
  createUser(
    externalId: string,
    email: string,
    marketingConsent: boolean,
    signupSource: SignupSource,
    countryCode: string,
  ): Promise<void>;

  getUser(userEmail: string): Promise<MarketingUser | undefined>;

  getUserById(externalId: string): Promise<MarketingUser | undefined>;

  sendEvent<T extends MarketingEventType>(
    event: T,
    eventData: MarketingEventData[T],
  ): Promise<void>;

  updateUserAttributes<T extends MarketingAttributeType>(
    attributeType: T,
    attributeData: MarketingAttributeData[T],
  ): Promise<void>;
}
