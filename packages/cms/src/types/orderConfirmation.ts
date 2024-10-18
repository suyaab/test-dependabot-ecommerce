import { z } from "zod";

import { ResponsiveImageSchema } from "./common";

export const OrderConfirmationContentSchema = z.object({
  header: z.object({
    title: z.string(),
    description: z.string(),
  }),
  whatsNext: z.object({
    title: z.string(),
    items: z.array(
      z.object({
        icon: z.string(),
        title: z.string(),
        description: z.string(),
      }),
    ),
    usernameLabel: z.string(),
  }),
  confirmation: z.object({
    title: z.string(),
    fulfilled: z.string(),
    delivery: z.string(),
  }),
  payment: z.object({
    title: z.string(),
    subtotal: z.string(),
    shipping: z.string(),
    tax: z.string(),
    total: z.string(),
    expire: z.string(),
  }),
  billing: z.object({
    title: z.string(),
  }),
  shipping: z.object({
    title: z.string(),
  }),
  footer: z.object({
    title: z.string(),
    description: z.string(),
  }),
  failedToFetch: z.string(),
});

export type OrderConfirmationContent = z.infer<
  typeof OrderConfirmationContentSchema
>;

export const CheckoutOrderSummaryContentSchema = z.object({
  typename: z.literal("CheckoutOrderSummary"),
  discountCodeForm: z.object({
    inputPlaceholder: z.string(),
    buttonLabel: z.string(),
  }),
  totalSectionLabels: z.object({
    subtotalLabel: z.string(),
    discountLabel: z.string(),
    taxLabel: z.string(),
    shippingLabel: z.string(),
    estimatedTotalLabel: z.string(),
  }),
  taxAmountPlaceholder: z.string(),
  subscriptionTotalLabel: z.string(),
  subscriptionTooltip: z.string(),
  moneybackImage: ResponsiveImageSchema,
});

export type CheckoutOrderSummaryContent = z.infer<
  typeof CheckoutOrderSummaryContentSchema
>;
