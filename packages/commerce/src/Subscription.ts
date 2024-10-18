import { z } from "zod";

import { OrderNumber } from "./Order";
import { LineItemProduct } from "./Products";

// TODO: let's consider moving Subscriptions into a shared domain package

export const subscriptionStatusSchema = z.union([
  z.literal("active"), // active subscription
  z.literal("inactive"), // subscription has run out and won't auto-renew
  z.literal("paused"), // user intentionally paused subscription
  z.literal("cancelled"), // user intentionally cancelled subscription
]);

export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;

export const subscriptionSchema = z.object({
  customerId: z.string(),
  customerVersion: z.number(),
  status: subscriptionStatusSchema,
  subscription: z.string(),
  prepaidShipmentsRemaining: z.number(),
  paymentMethodId: z.string().optional(),
  parentOrderNumber: z.string(),
  nextOrderDate: z.coerce.date(),

  nextPlan: z.string().nullish(),
  nextPlanCartId: z.string().nullish(),
  cancellationDate: z.coerce.date().nullish(),
  notified: z.boolean().nullish(),
  stoppedRetrying: z.boolean().nullish(),
});

/**
 * A Subscription holds information about a user's subscription
 *
 * Since currently subscription lives on the customer object in commercetools,
 * we will explicitly use customerId and customerVersion to avoid confusion,
 * although it will be a slightly more difficult refactor if we switch to a separate db
 *
 * - customerId - The ID of the customer where subscription lives
 * - customerVersion - The version of the customer where subscription lives
 * - status - Current status of the subscription
 * - subscription - The product ID of the subscription
 * - nextPlan - The product ID of the upcoming subscription (if customer has opted for one)
 * - prepaidShipmentsRemaining - Number of prepaid shipments remaining on user's subscription
 * - paymentMethodId - Payment Method ID which will be used to create recurring payments
 * - parentOrderNumber - The first, initial order number related to the current subscription
 * - nextOrderDate - The date when the next subscription order should be placed
 * - cancellationDate - If the user has cancelled, the date of said cancellation
 * - notified - If the user has been notified before their next order date
 * - stoppedRetrying - If the subscription manager failed and will not retry again
 */
export type Subscription = z.infer<typeof subscriptionSchema>;

/**
 * A SubscriptionDraft is used to create a new subscription
 *
 * - subscriptionProduct - The product that the user is subscribing to
 * - paymentMethodId - The payment method that will be used to create recurring payments
 * - parentOrderNumber - The first, initial order number related to the current subscription
 */
export interface SubscriptionDraft {
  subscriptionProduct: LineItemProduct;
  parentOrderNumber: OrderNumber;
  paymentMethodId?: string;
}

export interface SubscriptionService {
  getSubscription(customerId: string): Promise<Subscription | undefined>;

  createSubscription(
    customerId: string,
    customerVersion: number,
    subscriptionDraft: SubscriptionDraft,
  ): Promise<[string, number]>;

  fulfillSubscription(
    customerId: string,
    customerVersion: number,
  ): Promise<Subscription>;

  renewSubscription(
    customerId: string,
    customerVersion: number,
    newOrderNumber: OrderNumber,
  ): Promise<Subscription>;

  cancelSubscription(
    customerId: string,
    customerVersion: number,
  ): Promise<Subscription>;

  updateSubscription(
    customerId: string,
    customerVersion: number,
    cartId: string,
    productId: string,
  ): Promise<Subscription>;

  updateSubscriptionDate(
    customerId: string,
    customerVersion: number,
    newDate: Date,
  ): Promise<Subscription>;

  updatePaymentMethod(
    customerId: string,
    customerVersion: number,
    paymentMethodId: string,
  ): Promise<Subscription>;

  updateStoppedRetrying(
    customerId: string,
    customerVersion: number,
    stoppedRetrying: boolean,
  ): Promise<Subscription | undefined>;

  updateSubscriptionStatus(
    customerId: string,
    customerVersion: number,
    status: SubscriptionStatus,
  ): Promise<Subscription | undefined>;
}
